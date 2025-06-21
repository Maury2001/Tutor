import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin-auth"
import { getServerSession } from "next-auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user || !isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { application_id } = await request.json()

    if (!application_id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Call the stored function to rollback the configuration
    const { data, error } = await supabase.rpc("rollback_ai_config_template", {
      application_id_param: application_id,
      rolled_back_by_param: session.user.id,
    })

    if (error) {
      throw new Error(`Failed to rollback configuration: ${error.message}`)
    }

    if (!data.success) {
      return NextResponse.json({ error: data.error }, { status: 400 })
    }

    return NextResponse.json({
      message: data.message,
      configs_restored: data.configs_restored,
      success: true,
    })
  } catch (error: any) {
    console.error("Error rolling back AI config:", error)
    return NextResponse.json({ error: error.message || "Failed to rollback configuration" }, { status: 500 })
  }
}
