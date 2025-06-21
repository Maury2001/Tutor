import { NextResponse } from "next/server"
import {
  CBC_LEARNING_AREAS_2024,
  CURRICULUM_CHANGES_SUMMARY_2024,
  REMOVED_LEARNING_AREAS_2019,
} from "@/lib/cbc-curriculum-2024"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        learningAreas: CBC_LEARNING_AREAS_2024.upperPrimary,
        changesSummary: CURRICULUM_CHANGES_SUMMARY_2024,
        removedAreas: REMOVED_LEARNING_AREAS_2019,
        metadata: {
          implementationYear: 2024,
          affectedGrades: ["grade4", "grade5", "grade6"],
          totalLearningAreas: CBC_LEARNING_AREAS_2024.upperPrimary.length,
          totalWeeklyLessons: CBC_LEARNING_AREAS_2024.upperPrimary.reduce((sum, area) => sum + area.weeklyLessons, 0),
        },
      },
    })
  } catch (error) {
    console.error("Error fetching 2024 curriculum updates:", error)
    return NextResponse.json({ error: "Failed to fetch curriculum updates" }, { status: 500 })
  }
}
