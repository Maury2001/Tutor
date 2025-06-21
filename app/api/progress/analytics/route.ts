import { type NextRequest, NextResponse } from "next/server"
import { getProgressSummary, getStudentAnalytics } from "@/lib/supabase/progress"
import { getCurrentUser } from "@/lib/supabase/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const gradeLevel = searchParams.get("grade_level")
    const days = Number.parseInt(searchParams.get("days") || "30")

    if (!gradeLevel) {
      return NextResponse.json({ error: "Grade level is required" }, { status: 400 })
    }

    const [progressSummary, analytics] = await Promise.all([
      getProgressSummary(user.id, gradeLevel),
      getStudentAnalytics(user.id, days),
    ])

    return NextResponse.json({
      success: true,
      data: {
        progress_summary: progressSummary,
        analytics: analytics,
      },
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
