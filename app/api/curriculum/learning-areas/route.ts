import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gradeLevel = searchParams.get("grade")

    if (!gradeLevel) {
      return NextResponse.json({ error: "Grade level is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("learning_areas")
      .select(`
        *,
        strands (
          *,
          sub_strands (
            *,
            learning_outcomes (
              *,
              learning_objectives (*)
            )
          )
        )
      `)
      .eq("grade_level", gradeLevel)
      .order("name")

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch learning areas" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
