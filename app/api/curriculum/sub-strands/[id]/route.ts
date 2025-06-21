import { NextResponse, type NextRequest } from "next/server"
import { findSubStrand, getLearningOutcomes } from "@/lib/cbc-curriculum"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subStrandId = params.id
    const { searchParams } = new URL(request.url)
    const includeOutcomes = searchParams.get("includeOutcomes") === "true"

    const subStrand = findSubStrand(subStrandId)

    if (!subStrand) {
      return NextResponse.json({ error: `Sub-strand '${subStrandId}' not found` }, { status: 404 })
    }

    const response = {
      success: true,
      data: {
        ...subStrand,
        outcomes: includeOutcomes
          ? getLearningOutcomes(subStrandId)
          : subStrand.outcomes.map((o) => ({ id: o.id, description: o.description })),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
