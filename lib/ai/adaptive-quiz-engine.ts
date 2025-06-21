import type { QuizAttempt, QuizResponse, QuizAdaptation, GeneratedQuiz, QuizQuestion } from "./quiz-generator"

export class AdaptiveQuizEngine {
  private activeAttempts: Map<string, QuizAttempt> = new Map()
  private adaptationThresholds = {
    consecutiveWrong: 2,
    consecutiveRight: 3,
    timePerQuestion: 120, // seconds
    confidenceThreshold: 0.6,
  }

  public startQuizAttempt(quiz: GeneratedQuiz, studentId: string): QuizAttempt {
    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}_${studentId}`,
      quizId: quiz.id,
      studentId,
      startTime: new Date(),
      responses: [],
      currentQuestionIndex: 0,
      score: 0,
      maxScore: quiz.questions.length,
      timeSpent: 0,
      adaptations: [],
      completed: false,
    }

    this.activeAttempts.set(attempt.id, attempt)
    return attempt
  }

  public async processQuestionResponse(
    attemptId: string,
    questionId: string,
    studentAnswer: string | string[] | number,
    timeSpent: number,
    confidence: "low" | "medium" | "high",
  ): Promise<{
    isCorrect: boolean
    feedback: string
    nextQuestion?: QuizQuestion
    adaptations: QuizAdaptation[]
    shouldContinue: boolean
  }> {
    const attempt = this.activeAttempts.get(attemptId)
    if (!attempt) {
      throw new Error("Quiz attempt not found")
    }

    // Get the current question
    const quiz = await this.getQuiz(attempt.quizId)
    const currentQuestion = quiz.questions.find((q) => q.id === questionId)
    if (!currentQuestion) {
      throw new Error("Question not found")
    }

    // Evaluate the response
    const isCorrect = this.evaluateResponse(currentQuestion, studentAnswer)

    // Create response record
    const response: QuizResponse = {
      questionId,
      studentAnswer,
      isCorrect,
      timeSpent,
      hintsUsed: 0, // Track separately
      confidence,
      difficulty: currentQuestion.difficulty,
    }

    // Update attempt
    attempt.responses.push(response)
    attempt.timeSpent += timeSpent
    if (isCorrect) attempt.score++

    // Analyze need for adaptations
    const adaptations = await this.analyzeAndAdapt(attempt, response, quiz)
    attempt.adaptations.push(...adaptations)

    // Generate feedback
    const feedback = this.generateFeedback(currentQuestion, response, adaptations)

    // Determine next question
    const nextQuestion = this.getNextQuestion(attempt, quiz, adaptations)
    const shouldContinue = nextQuestion !== null && !attempt.completed

    if (nextQuestion) {
      attempt.currentQuestionIndex++
    } else {
      attempt.completed = true
      attempt.endTime = new Date()
    }

    this.activeAttempts.set(attemptId, attempt)

    return {
      isCorrect,
      feedback,
      nextQuestion: nextQuestion || undefined,
      adaptations,
      shouldContinue,
    }
  }

  private evaluateResponse(question: QuizQuestion, studentAnswer: string | string[] | number): boolean {
    const correctAnswer = question.correctAnswer

    if (Array.isArray(correctAnswer) && Array.isArray(studentAnswer)) {
      // For multiple correct answers (like matching questions)
      return (
        correctAnswer.length === studentAnswer.length && correctAnswer.every((answer) => studentAnswer.includes(answer))
      )
    }

    if (typeof correctAnswer === "number" && typeof studentAnswer === "number") {
      return Math.abs(correctAnswer - studentAnswer) < 0.001 // Handle floating point precision
    }

    // String comparison (case-insensitive for text answers)
    return correctAnswer.toString().toLowerCase().trim() === studentAnswer.toString().toLowerCase().trim()
  }

  private async analyzeAndAdapt(
    attempt: QuizAttempt,
    currentResponse: QuizResponse,
    quiz: GeneratedQuiz,
  ): Promise<QuizAdaptation[]> {
    const adaptations: QuizAdaptation[] = []
    const recentResponses = attempt.responses.slice(-5) // Last 5 responses

    // Check for consecutive wrong answers
    const consecutiveWrong = this.getConsecutiveWrongCount(recentResponses)
    if (consecutiveWrong >= this.adaptationThresholds.consecutiveWrong) {
      adaptations.push({
        timestamp: new Date(),
        trigger: "streak_incorrect",
        action: "reduce_difficulty",
        questionIndex: attempt.currentQuestionIndex,
        previousDifficulty: currentResponse.difficulty,
        newDifficulty: Math.max(1, currentResponse.difficulty - 1),
        reason: `Reducing difficulty after ${consecutiveWrong} consecutive incorrect answers`,
      })
    }

    // Check for consecutive right answers
    const consecutiveRight = this.getConsecutiveRightCount(recentResponses)
    if (consecutiveRight >= this.adaptationThresholds.consecutiveRight) {
      adaptations.push({
        timestamp: new Date(),
        trigger: "streak_correct",
        action: "increase_difficulty",
        questionIndex: attempt.currentQuestionIndex,
        previousDifficulty: currentResponse.difficulty,
        newDifficulty: Math.min(10, currentResponse.difficulty + 1),
        reason: `Increasing difficulty after ${consecutiveRight} consecutive correct answers`,
      })
    }

    // Check for time pressure
    if (currentResponse.timeSpent > this.adaptationThresholds.timePerQuestion) {
      adaptations.push({
        timestamp: new Date(),
        trigger: "time_pressure",
        action: "provide_hint",
        questionIndex: attempt.currentQuestionIndex,
        previousDifficulty: currentResponse.difficulty,
        newDifficulty: currentResponse.difficulty,
        reason: "Providing additional support due to extended response time",
      })
    }

    // Check for low confidence
    if (currentResponse.confidence === "low" && !currentResponse.isCorrect) {
      adaptations.push({
        timestamp: new Date(),
        trigger: "confidence_low",
        action: "add_explanation",
        questionIndex: attempt.currentQuestionIndex,
        previousDifficulty: currentResponse.difficulty,
        newDifficulty: currentResponse.difficulty,
        reason: "Adding detailed explanation due to low confidence and incorrect answer",
      })
    }

    return adaptations
  }

  private getConsecutiveWrongCount(responses: QuizResponse[]): number {
    let count = 0
    for (let i = responses.length - 1; i >= 0; i--) {
      if (!responses[i].isCorrect) {
        count++
      } else {
        break
      }
    }
    return count
  }

  private getConsecutiveRightCount(responses: QuizResponse[]): number {
    let count = 0
    for (let i = responses.length - 1; i >= 0; i--) {
      if (responses[i].isCorrect) {
        count++
      } else {
        break
      }
    }
    return count
  }

  private generateFeedback(question: QuizQuestion, response: QuizResponse, adaptations: QuizAdaptation[]): string {
    let feedback = ""

    if (response.isCorrect) {
      feedback = "🎉 Correct! " + this.getPositiveFeedback(response.confidence)
    } else {
      feedback = "❌ Not quite right. " + question.explanation
    }

    // Add adaptive feedback
    for (const adaptation of adaptations) {
      switch (adaptation.action) {
        case "reduce_difficulty":
          feedback += "\n\n💡 I'm adjusting the next questions to be a bit easier to help you build confidence."
          break
        case "increase_difficulty":
          feedback += "\n\n🚀 Great job! I'm making the next questions more challenging since you're doing so well."
          break
        case "provide_hint":
          feedback += "\n\n💭 Here's a hint for similar questions: " + this.getHint(question)
          break
        case "add_explanation":
          feedback += "\n\n📚 Let me explain this concept in more detail: " + this.getDetailedExplanation(question)
          break
      }
    }

    return feedback
  }

  private getPositiveFeedback(confidence: "low" | "medium" | "high"): string {
    const feedbackOptions = {
      high: [
        "You seem very confident in your answer!",
        "Excellent work! You clearly understand this concept.",
        "Perfect! Your confidence shows in your correct answer.",
      ],
      medium: [
        "Good job! You're getting the hang of this.",
        "Nice work! Keep up the steady progress.",
        "Well done! You're building good understanding.",
      ],
      low: [
        "Great job! Even when unsure, you got it right.",
        "Excellent! Sometimes the right answer comes even when we're not certain.",
        "Well done! Trust your instincts - they're working well.",
      ],
    }

    const options = feedbackOptions[confidence]
    return options[Math.floor(Math.random() * options.length)]
  }

  private getHint(question: QuizQuestion): string {
    if (question.hints && question.hints.length > 0) {
      return question.hints[0]
    }
    return "Break down the problem into smaller steps and take your time."
  }

  private getDetailedExplanation(question: QuizQuestion): string {
    // Generate more detailed explanation based on question type and topic
    return (
      question.explanation + " This concept is important because it builds the foundation for more advanced topics."
    )
  }

  private getNextQuestion(
    attempt: QuizAttempt,
    quiz: GeneratedQuiz,
    adaptations: QuizAdaptation[],
  ): QuizQuestion | null {
    if (attempt.currentQuestionIndex >= quiz.questions.length - 1) {
      return null // Quiz completed
    }

    let nextQuestion = quiz.questions[attempt.currentQuestionIndex + 1]

    // Apply adaptations to next question
    for (const adaptation of adaptations) {
      if (adaptation.action === "reduce_difficulty" || adaptation.action === "increase_difficulty") {
        // Find a question with the adapted difficulty level
        const targetDifficulty = adaptation.newDifficulty
        const alternativeQuestion = quiz.questions.find(
          (q) => q.difficulty === targetDifficulty && !attempt.responses.some((r) => r.questionId === q.id),
        )

        if (alternativeQuestion) {
          nextQuestion = alternativeQuestion
        }
      }
    }

    return nextQuestion
  }

  public getQuizResults(attemptId: string): QuizResults {
    const attempt = this.activeAttempts.get(attemptId)
    if (!attempt) {
      throw new Error("Quiz attempt not found")
    }

    const totalQuestions = attempt.responses.length
    const correctAnswers = attempt.responses.filter((r) => r.isCorrect).length
    const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0

    // Calculate performance by difficulty
    const performanceByDifficulty = this.calculatePerformanceByDifficulty(attempt.responses)

    // Calculate time efficiency
    const averageTimePerQuestion = attempt.timeSpent / totalQuestions

    // Identify strengths and weaknesses
    const topicPerformance = this.calculateTopicPerformance(attempt.responses)

    return {
      attemptId,
      totalQuestions,
      correctAnswers,
      accuracy,
      totalTime: attempt.timeSpent,
      averageTimePerQuestion,
      performanceByDifficulty,
      topicPerformance,
      adaptationsSummary: this.summarizeAdaptations(attempt.adaptations),
      recommendations: this.generateRecommendations(attempt),
      completed: attempt.completed,
    }
  }

  private calculatePerformanceByDifficulty(responses: QuizResponse[]): Record<number, number> {
    const performance: Record<number, { correct: number; total: number }> = {}

    responses.forEach((response) => {
      const difficulty = response.difficulty
      if (!performance[difficulty]) {
        performance[difficulty] = { correct: 0, total: 0 }
      }
      performance[difficulty].total++
      if (response.isCorrect) {
        performance[difficulty].correct++
      }
    })

    const result: Record<number, number> = {}
    Object.entries(performance).forEach(([difficulty, stats]) => {
      result[Number.parseInt(difficulty)] = stats.total > 0 ? stats.correct / stats.total : 0
    })

    return result
  }

  private calculateTopicPerformance(responses: QuizResponse[]): Record<string, number> {
    // This would need access to question topics - simplified for now
    return {
      Overall: responses.filter((r) => r.isCorrect).length / responses.length,
    }
  }

  private summarizeAdaptations(adaptations: QuizAdaptation[]): string[] {
    const summary: string[] = []
    const adaptationCounts: Record<string, number> = {}

    adaptations.forEach((adaptation) => {
      adaptationCounts[adaptation.action] = (adaptationCounts[adaptation.action] || 0) + 1
    })

    Object.entries(adaptationCounts).forEach(([action, count]) => {
      switch (action) {
        case "reduce_difficulty":
          summary.push(`Difficulty was reduced ${count} time(s) to provide better support`)
          break
        case "increase_difficulty":
          summary.push(`Difficulty was increased ${count} time(s) due to strong performance`)
          break
        case "provide_hint":
          summary.push(`Additional hints were provided ${count} time(s)`)
          break
        case "add_explanation":
          summary.push(`Detailed explanations were added ${count} time(s)`)
          break
      }
    })

    return summary
  }

  private generateRecommendations(attempt: QuizAttempt): string[] {
    const recommendations: string[] = []
    const accuracy = attempt.score / attempt.responses.length

    if (accuracy < 0.5) {
      recommendations.push("Focus on reviewing fundamental concepts before attempting more advanced topics")
      recommendations.push("Consider working through practice problems at a slower pace")
    } else if (accuracy > 0.8) {
      recommendations.push("Excellent performance! You're ready for more challenging material")
      recommendations.push("Consider exploring advanced topics in this subject area")
    }

    const avgTimePerQuestion = attempt.timeSpent / attempt.responses.length
    if (avgTimePerQuestion > 90) {
      recommendations.push("Take time to read questions carefully, but try to work more efficiently")
    } else if (avgTimePerQuestion < 30) {
      recommendations.push("Great speed! Make sure you're reading questions thoroughly")
    }

    return recommendations
  }

  private async getQuiz(quizId: string): Promise<GeneratedQuiz> {
    // This would typically fetch from a database
    // For now, return a mock quiz structure
    throw new Error("Quiz retrieval not implemented - would fetch from database")
  }
}

export interface QuizResults {
  attemptId: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  totalTime: number
  averageTimePerQuestion: number
  performanceByDifficulty: Record<number, number>
  topicPerformance: Record<string, number>
  adaptationsSummary: string[]
  recommendations: string[]
  completed: boolean
}

export const adaptiveQuizEngine = new AdaptiveQuizEngine()
