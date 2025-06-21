import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if we have database URL
    const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL

    if (!databaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Database URL not configured",
          message: "Please set POSTGRES_URL or DATABASE_URL environment variable",
          database_connected: false,
        },
        { status: 500 },
      )
    }

    // Validate database URL format
    if (!databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("postgresql://")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid database URL format",
          message: "Database URL must start with postgres:// or postgresql://",
          database_connected: false,
        },
        { status: 500 },
      )
    }

    // Import database connection with better error handling
    let sql
    try {
      const { neon } = await import("@neondatabase/serverless")
      sql = neon(databaseUrl)
    } catch (dbImportError) {
      console.error("Failed to import database client:", dbImportError)
      return NextResponse.json(
        {
          success: false,
          error: "Database client import failed",
          message: "Failed to load database driver. Check if @neondatabase/serverless is installed.",
          database_connected: false,
        },
        { status: 500 },
      )
    }

    // Test basic connection with timeout
    let connectionTest
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout after 10 seconds")), 10000),
      )

      const queryPromise = sql`SELECT 1 as test, NOW() as timestamp`

      connectionTest = await Promise.race([queryPromise, timeoutPromise])
    } catch (connectionError) {
      console.error("Database connection test failed:", connectionError)

      let errorMessage = "Failed to connect to database"
      if (connectionError instanceof Error) {
        if (connectionError.message.includes("timeout")) {
          errorMessage = "Database connection timeout - check your database URL and network"
        } else if (connectionError.message.includes("authentication")) {
          errorMessage = "Database authentication failed - check your credentials"
        } else if (connectionError.message.includes("does not exist")) {
          errorMessage = "Database does not exist - create the database first"
        } else {
          errorMessage = connectionError.message
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          message: errorMessage,
          database_connected: false,
        },
        { status: 500 },
      )
    }

    // Check if tables exist with better error handling
    let tables = []
    try {
      tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name IN ('users', 'schools', 'curriculum_learning_areas', 'curriculum_strands', 'curriculum_outcomes')
      `
    } catch (tablesError) {
      console.error("Failed to query tables:", tablesError)
      // Still return success for connection, but note table query failed
      return NextResponse.json({
        success: true,
        database_connected: true,
        tables_exist: {
          users: false,
          schools: false,
          curriculum_learning_areas: false,
          curriculum_strands: false,
          curriculum_outcomes: false,
        },
        total_tables: 0,
        message: "Database connected but failed to query tables. May need to create schema.",
        warning: "Table query failed - database may need initialization",
      })
    }

    const tableNames = tables.map((t: any) => t.table_name)
    const hasUsers = tableNames.includes("users")
    const hasSchools = tableNames.includes("schools")
    const hasCurriculum = tableNames.includes("curriculum_learning_areas")
    const hasStrands = tableNames.includes("curriculum_strands")
    const hasOutcomes = tableNames.includes("curriculum_outcomes")

    // Get statistics if tables exist
    let statistics = null
    if (hasUsers) {
      try {
        const [userCount, schoolCount, learningAreaCount, outcomeCount] = await Promise.all([
          sql`SELECT COUNT(*) as count FROM users`,
          hasSchools ? sql`SELECT COUNT(*) as count FROM schools` : Promise.resolve([{ count: 0 }]),
          hasCurriculum
            ? sql`SELECT COUNT(*) as count FROM curriculum_learning_areas`
            : Promise.resolve([{ count: 0 }]),
          hasOutcomes ? sql`SELECT COUNT(*) as count FROM curriculum_outcomes` : Promise.resolve([{ count: 0 }]),
        ])

        statistics = {
          users: Number.parseInt(userCount[0]?.count || "0"),
          schools: Number.parseInt(schoolCount[0]?.count || "0"),
          learning_areas: Number.parseInt(learningAreaCount[0]?.count || "0"),
          curriculum_outcomes: Number.parseInt(outcomeCount[0]?.count || "0"),
        }
      } catch (statsError) {
        console.error("Error getting statistics:", statsError)
        statistics = {
          users: 0,
          schools: 0,
          learning_areas: 0,
          curriculum_outcomes: 0,
          error: "Failed to get statistics",
        }
      }
    }

    return NextResponse.json({
      success: true,
      database_connected: true,
      connection_time: connectionTest?.[0]?.timestamp || new Date().toISOString(),
      tables_exist: {
        users: hasUsers,
        schools: hasSchools,
        curriculum_learning_areas: hasCurriculum,
        curriculum_strands: hasStrands,
        curriculum_outcomes: hasOutcomes,
      },
      total_tables: tableNames.length,
      statistics,
      message:
        tableNames.length > 0
          ? "Database is set up and tables exist"
          : "Database connected but no tables found. Run migration scripts.",
    })
  } catch (error) {
    console.error("Database setup check failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown database error",
        message: "Database setup check failed",
        database_connected: false,
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    // Check if we have database URL
    if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "Database URL not configured",
        },
        { status: 500 },
      )
    }

    let sql
    try {
      const db = await import("@/lib/db/neon")
      sql = db.sql
    } catch (dbImportError) {
      console.error("Failed to import database client:", dbImportError)
      return NextResponse.json(
        {
          success: false,
          error: "Database client import failed",
          message: dbImportError instanceof Error ? dbImportError.message : "Unknown error importing database client",
        },
        { status: 500 },
      )
    }

    // Test connection
    try {
      await sql`SELECT 1 as test`
    } catch (connectionError) {
      console.error("Database connection test failed:", connectionError)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          message: connectionError instanceof Error ? connectionError.message : "Failed to connect to database",
        },
        { status: 500 },
      )
    }

    // Create basic tables if they don't exist
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'student',
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `

      await sql`
        CREATE TABLE IF NOT EXISTS schools (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          code VARCHAR(50) UNIQUE,
          county VARCHAR(100),
          sub_county VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `

      await sql`
        CREATE TABLE IF NOT EXISTS curriculum_learning_areas (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          code VARCHAR(50) UNIQUE,
          description TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    } catch (createTableError) {
      console.error("Failed to create tables:", createTableError)
      return NextResponse.json(
        {
          success: false,
          error: "Table creation failed",
          message: createTableError instanceof Error ? createTableError.message : "Failed to create database tables",
        },
        { status: 500 },
      )
    }

    // Insert sample data if tables are empty
    try {
      const userCount = await sql`SELECT COUNT(*) as count FROM users`
      if (Number.parseInt(userCount[0]?.count || "0") === 0) {
        await sql`
          INSERT INTO users (email, name, role) VALUES 
          ('admin@example.com', 'Admin User', 'admin'),
          ('teacher@example.com', 'Teacher User', 'teacher'),
          ('student@example.com', 'Student User', 'student')
        `
      }

      const schoolCount = await sql`SELECT COUNT(*) as count FROM schools`
      if (Number.parseInt(schoolCount[0]?.count || "0") === 0) {
        await sql`
          INSERT INTO schools (name, code, county) VALUES 
          ('Sample Primary School', 'SPS001', 'Nairobi'),
          ('Demo Secondary School', 'DSS002', 'Kiambu')
        `
      }

      const learningAreaCount = await sql`SELECT COUNT(*) as count FROM curriculum_learning_areas`
      if (Number.parseInt(learningAreaCount[0]?.count || "0") === 0) {
        await sql`
          INSERT INTO curriculum_learning_areas (name, code, description) VALUES 
          ('Mathematics', 'MATH', 'Mathematical concepts and problem solving'),
          ('English', 'ENG', 'Language and communication skills'),
          ('Science & Technology', 'SCI', 'Scientific inquiry and technological literacy'),
          ('Social Studies', 'SS', 'Understanding society and environment')
        `
      }
    } catch (seedError) {
      console.error("Failed to seed data:", seedError)
      return NextResponse.json(
        {
          success: false,
          error: "Data seeding failed",
          message: seedError instanceof Error ? seedError.message : "Failed to seed initial data",
          tables_created: true,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
      tables_created: true,
      sample_data_inserted: true,
    })
  } catch (error) {
    console.error("Database setup failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Database setup failed",
      },
      { status: 500 },
    )
  }
}
