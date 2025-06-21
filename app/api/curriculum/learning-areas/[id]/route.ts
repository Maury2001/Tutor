import { NextResponse, type NextRequest } from "next/server"
import { findLearningArea, getStrands } from "@/lib/cbc-curriculum"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const learningAreaId = params.id
    const { searchParams } = new URL(request.url)
    const includeStrands = searchParams.get("includeStrands") === "true"

    const learningArea = findLearningArea(learningAreaId)

    if (!learningArea) {
      return NextResponse.json({ error: `Learning area '${learningAreaId}' not found` }, { status: 404 })
    }

    const response = {
      success: true,
      data: {
        ...learningArea,
        strands: includeStrands
          ? getStrands(learningAreaId)
          : learningArea.strands.map((s) => ({ id: s.id, name: s.name })),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
