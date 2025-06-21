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

    // Get user points
    const { data: userPoints, error: pointsError } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (pointsError && pointsError.code !== "PGRST116") {
      throw pointsError
    }

    // Get recent point transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from("point_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (transactionsError) {
      throw transactionsError
    }

    return NextResponse.json({
      userPoints: userPoints || {
        user_id: user.id,
        total_points: 0,
        weekly_points: 0,
        monthly_points: 0,
        streak_days: 0,
        level: 1,
        experience_points: 0,
      },
      transactions: transactions || [],
    })
  } catch (error) {
    console.error("Error fetching points:", error)
    return NextResponse.json({ error: "Failed to fetch points" }, { status: 500 })
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

    const { points, source, description, metadata } = await request.json()

    // Add point transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("point_transactions")
      .insert({
        user_id: user.id,
        points,
        type: "earned",
        source,
        description,
        metadata: metadata || {},
      })
      .select()
      .single()

    if (transactionError) {
      throw transactionError
    }

    // Update user points using the database function
    const { data: result, error: updateError } = await supabase.rpc("update_user_points", {
      p_user_id: user.id,
      p_points: points,
    })

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      transaction,
      result,
    })
  } catch (error) {
    console.error("Error awarding points:", error)
    return NextResponse.json({ error: "Failed to award points" }, { status: 500 })
  }
}
