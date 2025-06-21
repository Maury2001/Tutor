import { NextResponse, type NextRequest } from "next/server"
import { findLearningOutcome, getLearningObjectives } from "@/lib/cbc-curriculum"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const outcomeId = params.id
    const outcome = findLearningOutcome(outcomeId)

    if (!outcome) {
      return NextResponse.json({ error: `Learning outcome '${outcomeId}' not found` }, { status: 404 })
    }

    const objectives = getLearningObjectives(outcomeId)

    return NextResponse.json({
      success: true,
      data: {
        ...outcome,
        objectives,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
