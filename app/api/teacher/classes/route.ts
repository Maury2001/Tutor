import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()

    const { data: classes, error } = await supabase
      .from("classes")
      .select("id, name, grade_level, description")
      .eq("teacher_id", session.user.id)
      .order("name")

    if (error) {
      console.error("Error fetching classes:", error)
      return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
    }

    return NextResponse.json(classes || [])
  } catch (error) {
    console.error("Error in classes API:", error)
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}
