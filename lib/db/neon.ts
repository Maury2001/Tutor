import { neon } from "@neondatabase/serverless"

// Get database URL from environment
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  console.warn("⚠️ No database URL found. Please set POSTGRES_URL or DATABASE_URL environment variable.")
}

// Create the SQL client with error handling
export const sql = databaseUrl
  ? neon(databaseUrl)
  : () => {
      throw new Error("Database URL not configured")
    }

// Query function with error handling
export const query = async (text: string, params?: any[]) => {
  try {
    if (!databaseUrl) {
      throw new Error("Database URL not configured")
    }
    const result = await sql(text, params)
    return { rows: result }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Pool compatibility (no-op for serverless)
export const pool = {
  query: query,
  connect: async () => ({
    query,
    release: () => Promise.resolve(),
  }),
  end: async () => Promise.resolve(),
}

// Connection function
export const getConnection = async () => {
  if (!databaseUrl) {
    throw new Error("Database URL not configured")
  }

  return {
    query: query,
    release: () => Promise.resolve(),
  }
}

// Database helper functions with error handling
export const db = {
  // Test connection
  async testConnection() {
    try {
      await sql`SELECT 1 as test`
      return { success: true, message: "Database connection successful" }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  },

  // Users
  async createUser(userData: {
    email: string
    name: string
    role?: string
    avatar_url?: string
  }) {
    try {
      const result = await sql`
        INSERT INTO users (email, name, role, avatar_url)
        VALUES (${userData.email}, ${userData.name}, ${userData.role || "student"}, ${userData.avatar_url})
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  },

  async getUserByEmail(email: string) {
    try {
      const result = await sql`
        SELECT * FROM users WHERE email = ${email}
      `
      return result[0]
    } catch (error) {
      console.error("Error getting user by email:", error)
      throw error
    }
  },

  // Curriculum
  async getLearningAreas() {
    try {
      const result = await sql`
        SELECT * FROM curriculum_learning_areas 
        WHERE is_active = true 
        ORDER BY name
      `
      return result
    } catch (error) {
      console.error("Error getting learning areas:", error)
      return []
    }
  },

  // Health check
  async healthCheck() {
    try {
      const result = await sql`
        SELECT 
          'database' as component,
          'healthy' as status,
          NOW() as timestamp
      `
      return {
        success: true,
        data: result[0],
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }
    }
  },
}

export default db
