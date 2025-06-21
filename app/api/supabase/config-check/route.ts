import { NextResponse } from "next/server"
import { checkSupabaseConfig } from "@/lib/supabase/client"

export async function GET() {
  try {
    const configStatus = checkSupabaseConfig()

    return NextResponse.json({
      success: true,
      configured: configStatus.isConfigured,
      status: configStatus.config,
      missing: configStatus.missing,
      message: configStatus.isConfigured
        ? "✅ Supabase is properly configured!"
        : "❌ Supabase configuration incomplete",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check Supabase configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
