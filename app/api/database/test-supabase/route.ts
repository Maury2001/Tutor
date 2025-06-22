import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"


export async function GET() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: false,
        supabase_connected: false,
        error: "Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
      })
    }

    // Import Supabase client

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // Test basic connection by checking if we can query users table
    const { data: connectionTest, error: connectionError } = await supabase.from("users").select("count").limit(1)

    if (
      connectionError &&
      !connectionError.message.includes("relation") &&
      !connectionError.message.includes("does not exist")
    ) {
      throw connectionError
    }

    // Try to get learning areas
    let learningAreas: any[] = []
    let learningAreasError = null

    try {
      const { data, error } = await supabase
        .from("curriculum_learning_areas")
        .select("*")
        .eq("is_active", true)
        .limit(5)

      if (error && !error.message.includes("relation") && !error.message.includes("does not exist")) {
        learningAreasError = error
      } else {
        learningAreas = data || []
      }
    } catch (error) {
      learningAreasError = error
    }

    return NextResponse.json({
      success: true,
      supabase_connected: true,
      learning_areas_count: learningAreas.length,
      sample_learning_areas: learningAreas.slice(0, 3),
      timestamp: new Date().toISOString(),
      note: learningAreasError ? "Tables may not exist yet - run database setup first" : null,
    })
  } catch (error) {
    console.error("Supabase test failed:", error)
    return NextResponse.json(
      {
        success: false,
        supabase_connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        error: "Supabase service role key not configured",
      })
    }

    const { createClient } = await import("@supabase/supabase-js")

    // Use service role key for write operations
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Test creating a sample user
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      name: "Test User",
      role: "student",
    }

    const { data, error } = await supabase.from("users").insert(testUser).select().single()

    if (error) {
      // If table doesn't exist, that's expected
      if (error.message.includes("relation") || error.message.includes("does not exist")) {
        return NextResponse.json({
          success: true,
          message: "Supabase connection works, but tables don't exist yet. Run database setup first.",
          test_user_created: false,
          note: "Tables need to be created",
        })
      }
      throw error
    }

    // Clean up - delete the test user
    await supabase.from("users").delete().eq("id", data.id)

    return NextResponse.json({
      success: true,
      message: "Supabase write test successful",
      test_user_created: true,
      test_user_deleted: true,
    })
  } catch (error) {
    console.error("Supabase write test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
