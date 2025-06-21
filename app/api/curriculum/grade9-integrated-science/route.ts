import { NextResponse } from "next/server"
import {
  GRADE_9_INTEGRATED_SCIENCE_CURRICULUM,
  JUNIOR_SCHOOL_LEARNING_OUTCOMES,
  INTEGRATED_SCIENCE_GENERAL_OUTCOMES,
  JUNIOR_SCHOOL_LESSON_ALLOCATION,
  CSL_MILESTONES,
  ASSESSMENT_METHODS,
  LEARNING_RESOURCES,
  NON_FORMAL_ACTIVITIES,
  getTotalLessons,
  getStrandSummary,
} from "@/lib/cbc-curriculum-grade9-integrated-science"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        curriculum: GRADE_9_INTEGRATED_SCIENCE_CURRICULUM,
        juniorSchoolOutcomes: JUNIOR_SCHOOL_LEARNING_OUTCOMES,
        integratedScienceOutcomes: INTEGRATED_SCIENCE_GENERAL_OUTCOMES,
        lessonAllocation: JUNIOR_SCHOOL_LESSON_ALLOCATION,
        cslMilestones: CSL_MILESTONES,
        assessmentMethods: ASSESSMENT_METHODS,
        learningResources: LEARNING_RESOURCES,
        nonFormalActivities: NON_FORMAL_ACTIVITIES,
        summary: {
          totalLessons: getTotalLessons(),
          strandSummary: getStrandSummary(),
          implementationYear: 2024,
          publisher: "Kenya Institute of Curriculum Development (KICD)",
        },
      },
    })
  } catch (error) {
    console.error("Error fetching Grade 9 Integrated Science curriculum:", error)
    return NextResponse.json({ error: "Failed to fetch curriculum data" }, { status: 500 })
  }
}
