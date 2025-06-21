import { NextResponse, type NextRequest } from "next/server"
import { generateLearningPath } from "@/lib/cbc-curriculum"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get("grade")
    const learningAreaId = searchParams.get("learningAreaId")
    const strandId = searchParams.get("strandId")

    if (!grade) {
      return NextResponse.json({ error: "Grade parameter is required" }, { status: 400 })
    }

    const learningPath = generateLearningPath({
      grade,
      learningAreaId: learningAreaId || undefined,
      strandId: strandId || undefined,
    })

    return NextResponse.json({
      success: true,
      data: learningPath,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
