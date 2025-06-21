import { type NextRequest, NextResponse } from "next/server"
import { aiQuizGenerator, type QuizConfiguration } from "@/lib/ai/quiz-generator"
import { adaptiveAI } from "@/lib/ai/adaptive-engine"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      studentId,
      gradeLevel,
      learningArea,
      strand,
      subStrand,
      questionCount = 10,
      timeLimit,
      difficultyRange = [3, 7],
      questionTypes = ["multiple_choice"],
      adaptToDifficulty = true,
      focusOnWeakAreas = true,
      reinforceStrengths = false,
      includeReviewQuestions = true,
    } = body

    // Validate required fields
    if (!studentId || !gradeLevel || !learningArea) {
      return NextResponse.json({ error: "Student ID, grade level, and learning area are required" }, { status: 400 })
    }

    // Get student performance data
    const performanceInsights = adaptiveAI.getPerformanceInsights(studentId)

    // Create quiz configuration
    const config: QuizConfiguration = {
      studentId,
      gradeLevel,
      learningArea,
      strand,
      subStrand,
      questionCount: Math.min(Math.max(questionCount, 5), 50), // Limit between 5-50 questions
      timeLimit,
      difficultyRange: [Math.max(1, difficultyRange[0]), Math.min(10, difficultyRange[1])],
      questionTypes,
      adaptToDifficulty,
      focusOnWeakAreas,
      reinforceStrengths,
      includeReviewQuestions,
      recentPerformance: [performanceInsights.overallAccuracy],
      strugglingTopics: performanceInsights.areasForImprovement,
      masteredTopics: performanceInsights.strengths,
      preferredQuestionTypes: questionTypes, // Could be determined from performance data
    }

    // Generate the adaptive quiz
    const quiz = await aiQuizGenerator.generateAdaptiveQuiz(config)

    return NextResponse.json({
      success: true,
      quiz,
      message: "Quiz generated successfully",
    })
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const learningArea = searchParams.get("learningArea")

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    // Get student's quiz history and performance insights
    const performanceInsights = adaptiveAI.getPerformanceInsights(studentId)

    // Generate quiz recommendations
    const recommendations = {
      suggestedDifficulty: this.calculateSuggestedDifficulty(performanceInsights.overallAccuracy),
      recommendedTopics: performanceInsights.areasForImprovement.slice(0, 3),
      optimalQuestionCount: this.calculateOptimalQuestionCount(performanceInsights),
      estimatedDuration: this.estimateQuizDuration(performanceInsights),
      adaptiveFeatures: {
        shouldAdaptDifficulty: performanceInsights.areasForImprovement.length > 2,
        shouldFocusOnWeakAreas: performanceInsights.overallAccuracy < 0.7,
        shouldIncludeReview: performanceInsights.strengths.length > 0,
      },
    }

    return NextResponse.json({
      success: true,
      performanceInsights,
      recommendations,
    })
  } catch (error) {
    console.error("Error getting quiz recommendations:", error)
    return NextResponse.json({ error: "Failed to get quiz recommendations" }, { status: 500 })
  }
}

// Helper functions (would typically be in a separate utility file)
function calculateSuggestedDifficulty(accuracy: number): [number, number] {
  if (accuracy < 0.4) return [1, 4]
  if (accuracy < 0.6) return [2, 6]
  if (accuracy < 0.8) return [4, 8]
  return [6, 10]
}

function calculateOptimalQuestionCount(insights: any): number {
  // Base question count on performance and attention factors
  let baseCount = 10

  if (insights.overallAccuracy < 0.5) {
    baseCount = 8 // Fewer questions for struggling students
  } else if (insights.overallAccuracy > 0.8) {
    baseCount = 15 // More questions for high performers
  }

  return baseCount
}

function estimateQuizDuration(insights: any): number {
  // Estimate in minutes based on question count and student performance
  const questionCount = calculateOptimalQuestionCount(insights)
  const baseTimePerQuestion = insights.overallAccuracy > 0.7 ? 1.5 : 2.5 // minutes

  return Math.round(questionCount * baseTimePerQuestion)
}
