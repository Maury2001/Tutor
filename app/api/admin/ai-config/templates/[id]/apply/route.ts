import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin-auth"
import { getServerSession } from "next-auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user || !isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { reason } = await request.json()
    const templateId = Number.parseInt(params.id)

    if (isNaN(templateId)) {
      return NextResponse.json({ error: "Invalid template ID" }, { status: 400 })
    }

    const supabase = createClient()

    // Call the stored function to apply the template
    const { data, error } = await supabase.rpc("apply_ai_config_template", {
      template_id_param: templateId,
      applied_by_param: session.user.id,
      reason_param: reason || "Applied via admin interface",
    })

    if (error) {
      throw new Error(`Failed to apply template: ${error.message}`)
    }

    if (!data.success) {
      return NextResponse.json({ error: data.error }, { status: 400 })
    }

    return NextResponse.json({
      message: data.message,
      template_name: data.template_name,
      configs_updated: data.configs_updated,
      success: true,
    })
  } catch (error: any) {
    console.error("Error applying AI config template:", error)
    return NextResponse.json({ error: error.message || "Failed to apply template" }, { status: 500 })
  }
}
