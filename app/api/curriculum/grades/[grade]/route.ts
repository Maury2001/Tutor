import { NextResponse, type NextRequest } from "next/server"
import { CBC_CURRICULUM, getLearningAreas, formatGradeLabel } from "@/lib/cbc-curriculum"
import type { GradeLevel } from "@/lib/cbc-curriculum"

export async function GET(request: NextRequest, { params }: { params: { grade: string } }) {
  try {
    const grade = params.grade as GradeLevel

    if (!CBC_CURRICULUM[grade]) {
      return NextResponse.json({ error: `Grade '${grade}' not found` }, { status: 404 })
    }

    const learningAreas = getLearningAreas(grade)

    return NextResponse.json({
      success: true,
      data: {
        grade,
        gradeLabel: formatGradeLabel(grade),
        learningAreas,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
