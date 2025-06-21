import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const progressData = await request.json()

    // Insert progress record
    const { data, error } = await supabase
      .from("student_progress")
      .insert({
        student_id: user.id,
        activity_type: progressData.activity,
        activity_data: {
          operation: progressData.operation,
          correct: progressData.correct,
          difficulty: progressData.difficulty,
          time_spent: progressData.timeSpent,
        },
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving progress:", error)
      return NextResponse.json({ error: "Failed to save progress" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Progress save error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
