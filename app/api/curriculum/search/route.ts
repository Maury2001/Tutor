import { NextResponse, type NextRequest } from "next/server"
import { searchCurriculum } from "@/lib/cbc-curriculum"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const grade = searchParams.get("grade")
    const learningArea = searchParams.get("learningArea")
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10)

    if (!query || query.length < 2) {
      return NextResponse.json({ error: "Search query must be at least 2 characters" }, { status: 400 })
    }

    const results = searchCurriculum({
      query,
      grade: grade || undefined,
      learningAreaId: learningArea || undefined,
      limit,
    })

    return NextResponse.json({
      success: true,
      data: {
        query,
        count: results.length,
        results,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
