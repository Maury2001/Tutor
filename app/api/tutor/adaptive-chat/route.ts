import { type NextRequest, NextResponse } from "next/server"
import { adaptiveAI } from "@/lib/ai/adaptive-engine"
import { learningAnalytics } from "@/lib/ai/learning-analytics"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, message, curriculumContext, sessionContext, performanceData } = body

    // Validate required fields
    if (!studentId || !message) {
      return NextResponse.json({ error: "Student ID and message are required" }, { status: 400 })
    }

    // Prepare learning context
    const learningContext = {
      currentTopic:
        curriculumContext?.subStrand || curriculumContext?.strand || curriculumContext?.learningArea || "General",
      previousTopics: sessionContext?.previousTopics || [],
      timeInSession: sessionContext?.timeInSession || 0,
      questionsAsked: sessionContext?.questionsAsked || 0,
      recentPerformance: performanceData?.recentScores || [0.5],
      currentMood: sessionContext?.mood || "neutral",
      energyLevel: sessionContext?.energyLevel || "medium",
    }

    // Generate adaptive response
    const adaptiveResponse = await adaptiveAI.generateAdaptiveResponse(
      studentId,
      message,
      learningContext,
      curriculumContext,
    )

    // Analyze learning patterns if performance data is available
    let insights = []
    if (performanceData) {
      insights = learningAnalytics.analyzeStudentData(studentId, performanceData)
    }

    // Get performance insights
    const performanceInsights = adaptiveAI.getPerformanceInsights(studentId)

    return NextResponse.json({
      response: adaptiveResponse,
      insights,
      performanceInsights,
      adaptationApplied: adaptiveResponse.adaptationReason !== "Continuing with current approach",
      recommendations: learningAnalytics.generatePersonalizedRecommendations(studentId),
    })
  } catch (error) {
    console.error("Error in adaptive chat:", error)
    return NextResponse.json({ error: "Failed to generate adaptive response" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, questionId, isCorrect, responseTime, topic } = body

    // Update student performance
    adaptiveAI.updateStudentResponse(studentId, questionId, isCorrect, responseTime, topic)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating student response:", error)
    return NextResponse.json({ error: "Failed to update student response" }, { status: 500 })
  }
}
