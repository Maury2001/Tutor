import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "global"
    const gradeLevel = searchParams.get("grade")
    const schoolName = searchParams.get("school")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase.from(type === "weekly" ? "weekly_leaderboard_view" : "leaderboard_view").select("*")

    // Apply filters
    if (gradeLevel) {
      query = query.eq("grade_level", gradeLevel)
    }

    if (schoolName) {
      query = query.eq("school_name", schoolName)
    }

    const { data: leaderboard, error } = await query
      .limit(limit)
      .order(type === "weekly" ? "weekly_points" : "total_points", { ascending: false })

    if (error) {
      throw error
    }

    // Add rank to each entry
    const leaderboardWithRank = (leaderboard || []).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))

    // Get current user's rank if authenticated
    let userRank = null
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const userEntry = leaderboardWithRank.find((entry) => entry.user_id === user.id)
      userRank = userEntry?.rank || null
    }

    return NextResponse.json({
      leaderboard: leaderboardWithRank,
      userRank,
      type,
      filters: {
        gradeLevel,
        schoolName,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
