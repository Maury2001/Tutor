import { NextResponse, type NextRequest } from "next/server"
import { findStrand, getSubStrands } from "@/lib/cbc-curriculum"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const strandId = params.id
    const { searchParams } = new URL(request.url)
    const includeSubStrands = searchParams.get("includeSubStrands") === "true"

    const strand = findStrand(strandId)

    if (!strand) {
      return NextResponse.json({ error: `Strand '${strandId}' not found` }, { status: 404 })
    }

    const response = {
      success: true,
      data: {
        ...strand,
        subStrands: includeSubStrands
          ? getSubStrands(strandId)
          : strand.subStrands.map((s) => ({ id: s.id, name: s.name })),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
