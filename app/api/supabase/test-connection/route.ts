import { NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase/client"

export async function GET() {
  try {
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase.from("profiles").select("count").limit(1)

    if (healthError) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: healthError.message,
        },
        { status: 500 },
      )
    }

    // Test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession()

    // Test admin connection (if service key is available)
    let adminTest = null
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data: adminData, error: adminError } = await supabaseAdmin.from("profiles").select("count").limit(1)

        adminTest = {
          success: !adminError,
          error: adminError?.message,
        }
      } catch (err) {
        adminTest = {
          success: false,
          error: "Admin client test failed",
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "✅ Supabase connection successful!",
      tests: {
        database: {
          success: true,
          message: "Database connection working",
        },
        auth: {
          success: !authError,
          message: authError ? authError.message : "Auth service available",
        },
        admin: adminTest,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Connection test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
