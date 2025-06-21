import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")

    if (!classId) {
      return NextResponse.json({ error: "Class ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Verify the teacher has access to this class
    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("id")
      .eq("id", classId)
      .eq("teacher_id", session.user.id)
      .single()

    if (classError || !classData) {
      return NextResponse.json({ error: "Unauthorized access to this class" }, { status: 403 })
    }

    // Get students in the class
    const { data: students, error } = await supabase
      .from("profiles")
      .select("id, full_name, grade_level, avatar_url")
      .eq("class_id", classId)
      .eq("role", "student")
      .order("full_name")

    if (error) {
      console.error("Error fetching students:", error)
      return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
    }

    return NextResponse.json(students || [])
  } catch (error) {
    console.error("Error in students API:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
