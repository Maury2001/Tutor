import { type NextRequest, NextResponse } from "next/server"
import { getStrandsByLearningArea } from "@/lib/supabase/curriculum"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const learningAreaId = searchParams.get("learning_area_id")

    if (!learningAreaId) {
      return NextResponse.json({ error: "Learning area ID is required" }, { status: 400 })
    }

    const strands = await getStrandsByLearningArea(learningAreaId)

    return NextResponse.json({
      success: true,
      data: strands,
    })
  } catch (error) {
    console.error("Error fetching strands:", error)
    return NextResponse.json({ error: "Failed to fetch strands" }, { status: 500 })
  }
}
