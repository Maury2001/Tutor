import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all badges
    const { data: allBadges, error: badgesError } = await supabase
      .from("badges")
      .select("*")
      .eq("is_active", true)
      .order("created_at")

    if (badgesError) {
      throw badgesError
    }

    // Get user's earned badges
    const { data: userBadges, error: userBadgesError } = await supabase
      .from("user_badges")
      .select(`
        *,
        badge:badges(*)
      `)
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false })

    if (userBadgesError) {
      throw userBadgesError
    }

    return NextResponse.json({
      allBadges: allBadges || [],
      userBadges: userBadges || [],
    })
  } catch (error) {
    console.error("Error fetching badges:", error)
    return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { badgeId } = await request.json()

    // Check if user already has this badge
    const { data: existingBadge, error: checkError } = await supabase
      .from("user_badges")
      .select("id")
      .eq("user_id", user.id)
      .eq("badge_id", badgeId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError
    }

    if (existingBadge) {
      return NextResponse.json({ error: "Badge already earned" }, { status: 400 })
    }

    // Award the badge
    const { data: userBadge, error: awardError } = await supabase
      .from("user_badges")
      .insert({
        user_id: user.id,
        badge_id: badgeId,
      })
      .select(`
        *,
        badge:badges(*)
      `)
      .single()

    if (awardError) {
      throw awardError
    }

    // Award points for the badge
    if (userBadge.badge?.points > 0) {
      await supabase.from("point_transactions").insert({
        user_id: user.id,
        points: userBadge.badge.points,
        type: "earned",
        source: "badge_earned",
        description: `Badge earned: ${userBadge.badge.name}`,
        metadata: { badge_id: badgeId },
      })

      await supabase.rpc("update_user_points", {
        p_user_id: user.id,
        p_points: userBadge.badge.points,
      })
    }

    return NextResponse.json({ userBadge })
  } catch (error) {
    console.error("Error awarding badge:", error)
    return NextResponse.json({ error: "Failed to award badge" }, { status: 500 })
  }
}
