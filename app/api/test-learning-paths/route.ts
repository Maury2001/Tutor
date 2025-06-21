import { NextResponse } from "next/server"
import {
  generateLearningPath,
  formatGradeLabel,
  getLearningAreas,
  GRADE_LEVELS,
  type GradeLevel,
  type LearningPathOptions,
} from "@/lib/cbc-curriculum"

export async function GET() {
  try {
    // Add validation for curriculum data
    if (!GRADE_LEVELS || GRADE_LEVELS.length === 0) {
      throw new Error("No grade levels available")
    }

    const testConfigurations: Array<{
      name: string
      config: LearningPathOptions
      description: string
    }> = [
      {
        name: "Early Childhood (PP1)",
        config: {
          studentGrade: "pp1",
          difficulty: "easy",
          focus: "breadth",
        },
        description: "Basic foundational skills for pre-primary",
      },
      {
        name: "Primary Foundation (Grade 1)",
        config: {
          studentGrade: "grade1",
          learningAreas: ["mathematics-grade1", "english-grade1"],
          difficulty: "easy",
          focus: "depth",
        },
        description: "Core subjects with deep focus",
      },
      {
        name: "Primary Intermediate (Grade 3)",
        config: {
          studentGrade: "grade3",
          difficulty: "medium",
          focus: "breadth",
        },
        description: "Balanced approach across all subjects",
      },
      {
        name: "Junior Secondary (Grade 7)",
        config: {
          studentGrade: "grade7",
          difficulty: "medium",
          focus: "breadth",
        },
        description: "Transition to secondary education",
      },
      {
        name: "Senior Secondary (Grade 10)",
        config: {
          studentGrade: "grade10",
          difficulty: "hard",
          focus: "breadth",
        },
        description: "Advanced secondary concepts",
      },
      {
        name: "University Preparation (Grade 12)",
        config: {
          studentGrade: "grade12",
          learningAreas: ["applied-mathematics-grade12", "advanced-physics-grade12"],
          difficulty: "hard",
          focus: "depth",
        },
        description: "University entrance preparation",
      },
    ]

    const results = []
    let totalTests = 0
    let passedTests = 0

    for (const test of testConfigurations) {
      totalTests++

      try {
        // Add validation for test configuration
        if (!test.config.studentGrade) {
          throw new Error("Student grade is required")
        }

        const startTime = Date.now()
        const learningPath = generateLearningPath(test.config)
        const endTime = Date.now()

        if (learningPath && Array.isArray(learningPath) && learningPath.length > 0) {
          passedTests++

          const totalMinutes = learningPath.reduce((total, step) => {
            if (!step.estimatedDuration) return total
            const minutes = Number.parseInt(step.estimatedDuration.replace(/\D/g, "")) || 0
            return total + minutes
          }, 0)

          const sampleSteps = learningPath.slice(0, 3).map((step) => ({
            step: step.step || 0,
            area: step.learningArea?.name || "Unknown",
            strand: step.strand?.name || "Unknown",
            outcome: step.outcome?.description || "Unknown",
            duration: step.estimatedDuration || "0 minutes",
            objectives: step.objectives?.length || 0,
          }))

          results.push({
            name: test.name,
            grade: formatGradeLabel(test.config.studentGrade),
            success: true,
            pathLength: learningPath.length,
            totalTimeMinutes: totalMinutes,
            totalTimeHours: Math.round(totalMinutes / 60),
            generationTimeMs: endTime - startTime,
            sampleSteps,
            description: test.description,
          })
        } else {
          results.push({
            name: test.name,
            grade: formatGradeLabel(test.config.studentGrade),
            success: false,
            error: "No learning path generated or invalid path structure",
            description: test.description,
          })
        }
      } catch (error) {
        console.error(`Test error for ${test.name}:`, error)
        results.push({
          name: test.name,
          grade: test.config.studentGrade ? formatGradeLabel(test.config.studentGrade) : "Unknown",
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          description: test.description,
        })
      }
    }

    // Add validation for curriculum coverage
    const curriculumCoverage = GRADE_LEVELS.map((grade) => {
      try {
        const learningAreas = getLearningAreas(grade)
        return {
          grade: formatGradeLabel(grade),
          learningAreasCount: learningAreas?.length || 0,
          learningAreas: (learningAreas || []).map((area) => ({
            name: area.name || "Unknown",
            strandsCount: area.strands?.length || 0,
            subStrandsCount: (area.strands || []).reduce((sum, strand) => sum + (strand.subStrands?.length || 0), 0),
            outcomesCount: (area.strands || []).reduce(
              (sum, strand) =>
                sum +
                (strand.subStrands || []).reduce((subSum, subStrand) => subSum + (subStrand.outcomes?.length || 0), 0),
              0,
            ),
          })),
        }
      } catch (error) {
        console.error(`Coverage error for ${grade}:`, error)
        return {
          grade: formatGradeLabel(grade),
          learningAreasCount: 0,
          learningAreas: [],
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    })

    return NextResponse.json({
      success: true,
      summary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        successRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0,
      },
      testResults: results,
      curriculumCoverage,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Learning path test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to run learning path tests",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { grade, learningAreas, difficulty, focus } = body

    if (!grade) {
      return NextResponse.json(
        {
          success: false,
          error: "Grade level is required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    // Validate grade level
    if (!GRADE_LEVELS.includes(grade as GradeLevel)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid grade level: ${grade}`,
          validGrades: GRADE_LEVELS,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    const startTime = Date.now()
    const learningPath = generateLearningPath({
      studentGrade: grade as GradeLevel,
      learningAreas: Array.isArray(learningAreas) ? learningAreas : undefined,
      difficulty: difficulty || "medium",
      focus: focus || "breadth",
    })
    const endTime = Date.now()

    if (!learningPath || !Array.isArray(learningPath)) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate valid learning path",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    const totalMinutes = learningPath.reduce((total, step) => {
      if (!step.estimatedDuration) return total
      const minutes = Number.parseInt(step.estimatedDuration.replace(/\D/g, "")) || 0
      return total + minutes
    }, 0)

    return NextResponse.json({
      success: true,
      learningPath: {
        steps: learningPath.length,
        totalTimeMinutes,
        totalTimeHours: Math.round(totalMinutes / 60),
        generationTimeMs: endTime - startTime,
        path: learningPath.map((step) => ({
          step: step.step || 0,
          learningArea: step.learningArea?.name || "Unknown",
          strand: step.strand?.name || "Unknown",
          subStrand: step.subStrand?.name || "Unknown",
          outcome: step.outcome?.description || "Unknown",
          objectives: step.objectives?.length || 0,
          estimatedDuration: step.estimatedDuration || "0 minutes",
          prerequisites: step.prerequisites || [],
        })),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Learning path generation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate learning path",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
