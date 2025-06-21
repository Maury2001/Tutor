import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin-auth"
import { getServerSession } from "next-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user || !isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const includeInactive = searchParams.get("include_inactive") === "true"

    const supabase = createClient()

    let query = supabase.from("ai_config_templates").select("*").order("category, name")

    if (category) {
      query = query.eq("category", category)
    }

    if (!includeInactive) {
      query = query.eq("is_active", true)
    }

    const { data: templates, error } = await query

    if (error) {
      throw new Error(`Failed to fetch templates: ${error.message}`)
    }

    // Get template application history
    const { data: applications, error: appError } = await supabase
      .from("ai_template_applications")
      .select(`
        id,
        template_id,
        applied_by,
        application_reason,
        created_at,
        auth.users!applied_by(email, raw_user_meta_data)
      `)
      .order("created_at", { ascending: false })
      .limit(50)

    if (appError) {
      console.error("Failed to fetch application history:", appError)
    }

    return NextResponse.json({
      templates: templates || [],
      applications: applications || [],
      categories: [
        { value: "cost_control", label: "Cost Control", icon: "dollar-sign" },
        { value: "performance", label: "Performance", icon: "zap" },
        { value: "education", label: "Education", icon: "graduation-cap" },
        { value: "creativity", label: "Creativity", icon: "palette" },
        { value: "system", label: "System", icon: "settings" },
        { value: "development", label: "Development", icon: "code" },
      ],
      success: true,
    })
  } catch (error: any) {
    console.error("Error fetching AI config templates:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user || !isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { name, description, category, icon, color, config_data } = await request.json()

    if (!name || !config_data) {
      return NextResponse.json({ error: "Name and config_data are required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("ai_config_templates")
      .insert({
        name,
        description,
        category: category || "general",
        icon: icon || "settings",
        color: color || "blue",
        config_data,
        created_by: session.user.id,
        updated_by: session.user.id,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create template: ${error.message}`)
    }

    return NextResponse.json({
      template: data,
      message: "Template created successfully",
      success: true,
    })
  } catch (error: any) {
    console.error("Error creating AI config template:", error)
    return NextResponse.json({ error: error.message || "Failed to create template" }, { status: 500 })
  }
}
