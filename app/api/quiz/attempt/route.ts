import { type NextRequest, NextResponse } from "next/server"
import { adaptiveQuizEngine } from "@/lib/ai/adaptive-quiz-engine"
import { aiQuizGenerator } from "@/lib/ai/quiz-generator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case "start":
        return await handleStartAttempt(data)
      case "answer":
        return await handleAnswerQuestion(data)
      case "complete":
        return await handleCompleteAttempt(data)
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in quiz attempt:", error)
    return NextResponse.json({ error: "Failed to process quiz attempt" }, { status: 500 })
  }
}

async function handleStartAttempt(data: any) {
  const { quizId, studentId } = data

  if (!quizId || !studentId) {
    return NextResponse.json({ error: "Quiz ID and student ID are required" }, { status: 400 })
  }

  // In a real implementation, you would fetch the quiz from database
  // For now, we'll create a mock quiz
  const mockQuiz = await createMockQuiz(quizId, studentId)

  const attempt = adaptiveQuizEngine.startQuizAttempt(mockQuiz, studentId)

  return NextResponse.json({
    success: true,
    attempt: {
      id: attempt.id,
      quizId: attempt.quizId,
      startTime: attempt.startTime,
      currentQuestionIndex: attempt.currentQuestionIndex,
    },
    firstQuestion: mockQuiz.questions[0],
    totalQuestions: mockQuiz.questions.length,
  })
}

async function handleAnswerQuestion(data: any) {
  const { attemptId, questionId, answer, timeSpent, confidence = "medium" } = data

  if (!attemptId || !questionId || answer === undefined) {
    return NextResponse.json({ error: "Attempt ID, question ID, and answer are required" }, { status: 400 })
  }

  const result = await adaptiveQuizEngine.processQuestionResponse(
    attemptId,
    questionId,
    answer,
    timeSpent || 60,
    confidence,
  )

  return NextResponse.json({
    success: true,
    ...result,
  })
}

async function handleCompleteAttempt(data: any) {
  const { attemptId } = data

  if (!attemptId) {
    return NextResponse.json({ error: "Attempt ID is required" }, { status: 400 })
  }

  const results = adaptiveQuizEngine.getQuizResults(attemptId)

  return NextResponse.json({
    success: true,
    results,
  })
}

// Mock quiz creation for demonstration
async function createMockQuiz(quizId: string, studentId: string) {
  // This would typically fetch from database
  // Creating a mock quiz for demonstration
  const mockConfig = {
    studentId,
    gradeLevel: "grade4",
    learningArea: "mathematics",
    questionCount: 10,
    difficultyRange: [3, 7] as [number, number],
    questionTypes: ["multiple_choice" as const],
    adaptToDifficulty: true,
    focusOnWeakAreas: true,
    reinforceStrengths: false,
    includeReviewQuestions: true,
    recentPerformance: [0.6, 0.7, 0.5],
    strugglingTopics: ["fractions", "word_problems"],
    masteredTopics: ["addition", "subtraction"],
    preferredQuestionTypes: ["multiple_choice" as const],
  }

  return await aiQuizGenerator.generateAdaptiveQuiz(mockConfig)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const attemptId = searchParams.get("attemptId")

    if (!attemptId) {
      return NextResponse.json({ error: "Attempt ID is required" }, { status: 400 })
    }

    const results = adaptiveQuizEngine.getQuizResults(attemptId)

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("Error getting quiz results:", error)
    return NextResponse.json({ error: "Failed to get quiz results" }, { status: 500 })
  }
}
