export interface StudentPerformance {
  studentId: string
  gradeLevel: string
  learningArea: string
  strand?: string
  subStrand?: string

  // Performance Metrics
  totalQuestions: number
  correctAnswers: number
  averageResponseTime: number
  strugglingTopics: string[]
  masteredTopics: string[]

  // Learning Patterns
  preferredLearningStyle: "visual" | "auditory" | "kinesthetic" | "reading" | "mixed"
  attentionSpan: number // in minutes
  bestPerformanceTime: "morning" | "afternoon" | "evening"
  difficultyPreference: "easy" | "medium" | "hard" | "adaptive"

  // Engagement Metrics
  sessionDuration: number
  questionsPerSession: number
  helpRequestFrequency: number
  motivationLevel: "low" | "medium" | "high"

  // Adaptive Factors
  currentDifficultyLevel: number // 1-10 scale
  adaptationHistory: AdaptationEvent[]
  lastUpdated: Date
}

export interface AdaptationEvent {
  timestamp: Date
  trigger: "poor_performance" | "excellent_performance" | "engagement_drop" | "time_based" | "topic_mastery"
  action: "increase_difficulty" | "decrease_difficulty" | "change_style" | "provide_encouragement" | "suggest_break"
  previousState: any
  newState: any
  effectiveness?: number // 1-10 rating of how well the adaptation worked
}

export interface LearningContext {
  currentTopic: string
  previousTopics: string[]
  timeInSession: number
  questionsAsked: number
  recentPerformance: number[] // last 5 question scores
  currentMood: "frustrated" | "confident" | "neutral" | "excited"
  energyLevel: "low" | "medium" | "high"
}

export interface AdaptiveResponse {
  content: string
  difficulty: number
  style: "encouraging" | "challenging" | "explanatory" | "interactive" | "visual"
  nextTopicSuggestion?: string
  adaptationReason: string
  followUpQuestions: string[]
  estimatedTime: number
  supportMaterials?: string[]
}

export class AdaptiveAIEngine {
  private performanceHistory: Map<string, StudentPerformance> = new Map()
  private adaptationRules: AdaptationRule[] = []

  constructor() {
    this.initializeAdaptationRules()
  }

  private initializeAdaptationRules() {
    this.adaptationRules = [
      // Performance-based adaptations
      {
        condition: (perf, context) => this.getRecentAccuracy(perf) < 0.4,
        action: "decrease_difficulty",
        priority: 9,
        description: "Decrease difficulty when accuracy drops below 40%",
      },
      {
        condition: (perf, context) => this.getRecentAccuracy(perf) > 0.8 && perf.currentDifficultyLevel < 8,
        action: "increase_difficulty",
        priority: 7,
        description: "Increase difficulty when accuracy is above 80%",
      },

      // Engagement-based adaptations
      {
        condition: (perf, context) => context.timeInSession > perf.attentionSpan,
        action: "suggest_break",
        priority: 10,
        description: "Suggest break when session exceeds attention span",
      },
      {
        condition: (perf, context) => perf.helpRequestFrequency > 3,
        action: "provide_encouragement",
        priority: 8,
        description: "Provide encouragement when help requests are frequent",
      },

      // Learning style adaptations
      {
        condition: (perf, context) => perf.preferredLearningStyle === "visual" && context.questionsAsked > 3,
        action: "add_visual_elements",
        priority: 6,
        description: "Add visual elements for visual learners",
      },
      {
        condition: (perf, context) => perf.preferredLearningStyle === "kinesthetic",
        action: "suggest_hands_on",
        priority: 6,
        description: "Suggest hands-on activities for kinesthetic learners",
      },

      // Time-based adaptations
      {
        condition: (perf, context) => this.isLowEnergyTime(perf, new Date()),
        action: "simplify_content",
        priority: 5,
        description: "Simplify content during low energy periods",
      },
    ]
  }

  public async generateAdaptiveResponse(
    studentId: string,
    question: string,
    context: LearningContext,
    curriculumContext: any,
  ): Promise<AdaptiveResponse> {
    const performance = this.getStudentPerformance(studentId)
    const adaptations = this.analyzeNeededAdaptations(performance, context)

    // Apply adaptations
    for (const adaptation of adaptations) {
      await this.applyAdaptation(studentId, adaptation, context)
    }

    // Generate response based on current state
    const response = await this.generateContextualResponse(
      performance,
      context,
      question,
      curriculumContext,
      adaptations,
    )

    // Update performance tracking
    this.updatePerformanceTracking(studentId, context, response)

    return response
  }

  private analyzeNeededAdaptations(performance: StudentPerformance, context: LearningContext): AdaptationEvent[] {
    const adaptations: AdaptationEvent[] = []

    // Sort rules by priority and check conditions
    const sortedRules = this.adaptationRules.sort((a, b) => b.priority - a.priority)

    for (const rule of sortedRules) {
      if (rule.condition(performance, context)) {
        const adaptation: AdaptationEvent = {
          timestamp: new Date(),
          trigger: this.determineTrigger(rule, performance, context),
          action: rule.action,
          previousState: { ...performance },
          newState: {},
          effectiveness: undefined,
        }

        adaptations.push(adaptation)

        // Only apply one high-priority adaptation at a time
        if (rule.priority >= 8) break
      }
    }

    return adaptations
  }

  private async applyAdaptation(
    studentId: string,
    adaptation: AdaptationEvent,
    context: LearningContext,
  ): Promise<void> {
    const performance = this.getStudentPerformance(studentId)

    switch (adaptation.action) {
      case "decrease_difficulty":
        performance.currentDifficultyLevel = Math.max(1, performance.currentDifficultyLevel - 1)
        adaptation.newState = { difficultyLevel: performance.currentDifficultyLevel }
        break

      case "increase_difficulty":
        performance.currentDifficultyLevel = Math.min(10, performance.currentDifficultyLevel + 1)
        adaptation.newState = { difficultyLevel: performance.currentDifficultyLevel }
        break

      case "change_style":
        const newStyle = this.determineOptimalLearningStyle(performance, context)
        adaptation.newState = { learningStyle: newStyle }
        break

      case "provide_encouragement":
        performance.motivationLevel = "high"
        adaptation.newState = { motivationLevel: "high" }
        break

      case "suggest_break":
        adaptation.newState = { suggestedBreak: true }
        break
    }

    // Record adaptation
    performance.adaptationHistory.push(adaptation)
    performance.lastUpdated = new Date()

    this.performanceHistory.set(studentId, performance)
  }

  private async generateContextualResponse(
    performance: StudentPerformance,
    context: LearningContext,
    question: string,
    curriculumContext: any,
    adaptations: AdaptationEvent[],
  ): Promise<AdaptiveResponse> {
    const difficulty = performance.currentDifficultyLevel
    const style = this.determineResponseStyle(performance, context, adaptations)

    let content = await this.generateBaseResponse(question, curriculumContext, difficulty, style)

    // Apply adaptations to content
    for (const adaptation of adaptations) {
      content = this.modifyContentForAdaptation(content, adaptation, performance)
    }

    // Generate follow-up questions based on performance
    const followUpQuestions = this.generateFollowUpQuestions(performance, context, curriculumContext)

    // Estimate time based on student's typical pace
    const estimatedTime = this.estimateResponseTime(performance, content.length)

    return {
      content,
      difficulty,
      style,
      nextTopicSuggestion: this.suggestNextTopic(performance, curriculumContext),
      adaptationReason: this.explainAdaptations(adaptations),
      followUpQuestions,
      estimatedTime,
      supportMaterials: this.suggestSupportMaterials(performance, curriculumContext),
    }
  }

  private async generateBaseResponse(
    question: string,
    curriculumContext: any,
    difficulty: number,
    style: string,
  ): Promise<string> {
    // Base response generation logic
    const difficultyModifiers = {
      1: "Let's start with the very basics",
      2: "Here's a simple explanation",
      3: "Let me break this down step by step",
      4: "Here's what you need to know",
      5: "Let's explore this concept",
      6: "Now we're getting into more detail",
      7: "This requires some deeper thinking",
      8: "Here's a challenging aspect",
      9: "Let's tackle this advanced concept",
      10: "This is quite complex, but you can handle it",
    }

    const styleModifiers = {
      encouraging: "Great question! You're doing really well. ",
      challenging: "Excellent! Ready for something more challenging? ",
      explanatory: "Let me explain this clearly. ",
      interactive: "Let's work through this together! ",
      visual: "Picture this in your mind as I explain. ",
    }

    let response = styleModifiers[style as keyof typeof styleModifiers] || ""
    response += difficultyModifiers[difficulty as keyof typeof difficultyModifiers] || ""

    // Add curriculum-specific content
    if (curriculumContext?.learningArea?.includes("math")) {
      response += this.generateMathResponse(question, difficulty)
    } else if (curriculumContext?.learningArea?.includes("science")) {
      response += this.generateScienceResponse(question, difficulty)
    } else if (curriculumContext?.learningArea?.includes("language")) {
      response += this.generateLanguageResponse(question, difficulty)
    } else {
      response += this.generateGeneralResponse(question, difficulty)
    }

    return response
  }

  private generateMathResponse(question: string, difficulty: number): string {
    const responses = {
      1: "about this math concept. Let's use simple numbers and count together.",
      3: "about this math problem. I'll show you the steps one by one.",
      5: "about this mathematical concept. Let's work through some examples.",
      7: "about this math challenge. We'll need to think carefully about each step.",
      10: "about this advanced mathematical concept. This will require deep analytical thinking.",
    }

    const closestLevel = Object.keys(responses)
      .map(Number)
      .reduce((prev, curr) => (Math.abs(curr - difficulty) < Math.abs(prev - difficulty) ? curr : prev))

    return responses[closestLevel as keyof typeof responses]
  }

  private generateScienceResponse(question: string, difficulty: number): string {
    const responses = {
      1: "about this science topic. Let's observe and explore together.",
      3: "about this scientific concept. I'll help you understand through examples.",
      5: "about this science question. Let's think like scientists and investigate.",
      7: "about this scientific principle. We'll need to analyze and connect ideas.",
      10: "about this complex scientific concept. This requires advanced scientific thinking.",
    }

    const closestLevel = Object.keys(responses)
      .map(Number)
      .reduce((prev, curr) => (Math.abs(curr - difficulty) < Math.abs(prev - difficulty) ? curr : prev))

    return responses[closestLevel as keyof typeof responses]
  }

  private generateLanguageResponse(question: string, difficulty: number): string {
    const responses = {
      1: "about language. Let's start with simple words and sounds.",
      3: "about this language concept. I'll help you understand step by step.",
      5: "about this language question. Let's explore words and meanings together.",
      7: "about this language topic. We'll analyze and think deeply about language.",
      10: "about this advanced language concept. This requires sophisticated language analysis.",
    }

    const closestLevel = Object.keys(responses)
      .map(Number)
      .reduce((prev, curr) => (Math.abs(curr - difficulty) < Math.abs(prev - difficulty) ? curr : prev))

    return responses[closestLevel as keyof typeof responses]
  }

  private generateGeneralResponse(question: string, difficulty: number): string {
    return `about your question. Let me help you understand this concept at the right level for you.`
  }

  private modifyContentForAdaptation(
    content: string,
    adaptation: AdaptationEvent,
    performance: StudentPerformance,
  ): string {
    switch (adaptation.action) {
      case "provide_encouragement":
        return `🌟 You're doing great! Keep up the excellent work!\n\n${content}\n\n💪 Remember, every question you ask helps you learn more!`

      case "suggest_break":
        return `${content}\n\n⏰ You've been working hard! Consider taking a 5-minute break to refresh your mind. I'll be here when you're ready to continue.`

      case "add_visual_elements":
        return `${content}\n\n📊 Visual Aid: [Imagine a diagram or chart that shows this concept]\n🎨 Try drawing this out to help you remember!`

      case "suggest_hands_on":
        return `${content}\n\n🔧 Hands-on Activity: Try this practical exercise to reinforce your learning!\n✋ Use objects around you to practice this concept.`

      case "simplify_content":
        return content
          .replace(/complex/gi, "simple")
          .replace(/advanced/gi, "basic")
          .replace(/challenging/gi, "manageable")

      default:
        return content
    }
  }

  private generateFollowUpQuestions(
    performance: StudentPerformance,
    context: LearningContext,
    curriculumContext: any,
  ): string[] {
    const questions: string[] = []
    const difficulty = performance.currentDifficultyLevel

    if (difficulty <= 3) {
      questions.push(
        "Can you tell me what you understood from this explanation?",
        "Would you like me to explain any part again?",
        "Can you think of an example from your daily life?",
      )
    } else if (difficulty <= 6) {
      questions.push(
        "How would you apply this concept to solve a problem?",
        "What connections can you make to what you learned before?",
        "Can you explain this concept in your own words?",
      )
    } else {
      questions.push(
        "What are the implications of this concept?",
        "How might this principle apply in different contexts?",
        "Can you analyze the strengths and limitations of this approach?",
      )
    }

    return questions.slice(0, 3)
  }

  private suggestNextTopic(performance: StudentPerformance, curriculumContext: any): string | undefined {
    // Logic to suggest next topic based on mastery and curriculum sequence
    if (performance.masteredTopics.length > performance.strugglingTopics.length) {
      return "Ready to explore the next challenging topic?"
    } else if (performance.strugglingTopics.length > 0) {
      return `Let's reinforce ${performance.strugglingTopics[0]} before moving forward`
    }
    return undefined
  }

  private explainAdaptations(adaptations: AdaptationEvent[]): string {
    if (adaptations.length === 0) return "Continuing with current approach"

    const reasons = adaptations.map((adaptation) => {
      switch (adaptation.action) {
        case "decrease_difficulty":
          return "I've simplified the content to match your current understanding"
        case "increase_difficulty":
          return "You're ready for more challenging material!"
        case "provide_encouragement":
          return "Adding extra encouragement to boost your confidence"
        case "suggest_break":
          return "Suggesting a break to help you stay fresh and focused"
        default:
          return "Adjusting my teaching approach for you"
      }
    })

    return reasons.join("; ")
  }

  private suggestSupportMaterials(performance: StudentPerformance, curriculumContext: any): string[] {
    const materials: string[] = []

    if (performance.preferredLearningStyle === "visual") {
      materials.push("Interactive diagrams", "Visual concept maps", "Educational videos")
    }

    if (performance.preferredLearningStyle === "kinesthetic") {
      materials.push("Hands-on activities", "Physical manipulatives", "Movement-based exercises")
    }

    if (performance.currentDifficultyLevel <= 3) {
      materials.push("Basic practice worksheets", "Simple examples", "Step-by-step guides")
    } else if (performance.currentDifficultyLevel >= 7) {
      materials.push("Advanced problem sets", "Research projects", "Critical thinking exercises")
    }

    return materials
  }

  // Helper methods
  private getStudentPerformance(studentId: string): StudentPerformance {
    if (!this.performanceHistory.has(studentId)) {
      // Initialize new student performance
      const newPerformance: StudentPerformance = {
        studentId,
        gradeLevel: "",
        learningArea: "",
        totalQuestions: 0,
        correctAnswers: 0,
        averageResponseTime: 30,
        strugglingTopics: [],
        masteredTopics: [],
        preferredLearningStyle: "mixed",
        attentionSpan: 20,
        bestPerformanceTime: "morning",
        difficultyPreference: "adaptive",
        sessionDuration: 0,
        questionsPerSession: 0,
        helpRequestFrequency: 0,
        motivationLevel: "medium",
        currentDifficultyLevel: 5,
        adaptationHistory: [],
        lastUpdated: new Date(),
      }
      this.performanceHistory.set(studentId, newPerformance)
    }
    return this.performanceHistory.get(studentId)!
  }

  private getRecentAccuracy(performance: StudentPerformance): number {
    if (performance.totalQuestions === 0) return 0.5 // neutral starting point
    return performance.correctAnswers / performance.totalQuestions
  }

  private isLowEnergyTime(performance: StudentPerformance, currentTime: Date): boolean {
    const hour = currentTime.getHours()

    // General low energy periods
    if (hour >= 13 && hour <= 15) return true // post-lunch dip
    if (hour >= 20 || hour <= 6) return true // late night/early morning

    // Personal low energy time
    if (performance.bestPerformanceTime === "morning" && hour >= 15) return true
    if (performance.bestPerformanceTime === "afternoon" && (hour <= 9 || hour >= 18)) return true
    if (performance.bestPerformanceTime === "evening" && hour <= 12) return true

    return false
  }

  private determineOptimalLearningStyle(performance: StudentPerformance, context: LearningContext): string {
    // Analyze recent performance to suggest optimal learning style
    if (context.recentPerformance.length >= 3) {
      const avgPerformance = context.recentPerformance.reduce((a, b) => a + b, 0) / context.recentPerformance.length
      if (avgPerformance < 0.6) {
        // Switch to more supportive style
        return performance.preferredLearningStyle === "visual" ? "visual" : "explanatory"
      }
    }
    return performance.preferredLearningStyle
  }

  private determineResponseStyle(
    performance: StudentPerformance,
    context: LearningContext,
    adaptations: AdaptationEvent[],
  ): string {
    // Check for specific adaptations first
    for (const adaptation of adaptations) {
      if (adaptation.action === "provide_encouragement") return "encouraging"
      if (adaptation.action === "increase_difficulty") return "challenging"
      if (adaptation.action === "add_visual_elements") return "visual"
    }

    // Base on performance and context
    const recentAccuracy = this.getRecentAccuracy(performance)

    if (recentAccuracy < 0.4) return "encouraging"
    if (recentAccuracy > 0.8) return "challenging"
    if (context.timeInSession > 15) return "interactive"

    return "explanatory"
  }

  private determineTrigger(
    rule: AdaptationRule,
    performance: StudentPerformance,
    context: LearningContext,
  ): AdaptationEvent["trigger"] {
    if (this.getRecentAccuracy(performance) < 0.4) return "poor_performance"
    if (this.getRecentAccuracy(performance) > 0.8) return "excellent_performance"
    if (context.timeInSession > performance.attentionSpan) return "time_based"
    if (performance.helpRequestFrequency > 3) return "engagement_drop"
    return "topic_mastery"
  }

  private estimateResponseTime(performance: StudentPerformance, contentLength: number): number {
    // Estimate based on student's reading speed and comprehension level
    const baseTime = contentLength / 10 // rough words per second
    const difficultyMultiplier = performance.currentDifficultyLevel / 5
    return Math.round(baseTime * difficultyMultiplier)
  }

  private updatePerformanceTracking(studentId: string, context: LearningContext, response: AdaptiveResponse): void {
    const performance = this.getStudentPerformance(studentId)

    // Update session metrics
    performance.questionsPerSession = context.questionsAsked
    performance.sessionDuration = context.timeInSession

    // Update last activity
    performance.lastUpdated = new Date()

    this.performanceHistory.set(studentId, performance)
  }

  // Public methods for external use
  public updateStudentResponse(
    studentId: string,
    questionId: string,
    isCorrect: boolean,
    responseTime: number,
    topic: string,
  ): void {
    const performance = this.getStudentPerformance(studentId)

    performance.totalQuestions++
    if (isCorrect) performance.correctAnswers++

    // Update average response time
    performance.averageResponseTime =
      (performance.averageResponseTime * (performance.totalQuestions - 1) + responseTime) / performance.totalQuestions

    // Update topic mastery
    if (isCorrect && !performance.masteredTopics.includes(topic)) {
      performance.masteredTopics.push(topic)
      performance.strugglingTopics = performance.strugglingTopics.filter((t) => t !== topic)
    } else if (!isCorrect && !performance.strugglingTopics.includes(topic)) {
      performance.strugglingTopics.push(topic)
    }

    performance.lastUpdated = new Date()
    this.performanceHistory.set(studentId, performance)
  }

  public getPerformanceInsights(studentId: string): any {
    const performance = this.getStudentPerformance(studentId)

    return {
      overallAccuracy: this.getRecentAccuracy(performance),
      currentDifficulty: performance.currentDifficultyLevel,
      learningStyle: performance.preferredLearningStyle,
      strengths: performance.masteredTopics,
      areasForImprovement: performance.strugglingTopics,
      motivationLevel: performance.motivationLevel,
      recentAdaptations: performance.adaptationHistory.slice(-5),
      recommendations: this.generateRecommendations(performance),
    }
  }

  private generateRecommendations(performance: StudentPerformance): string[] {
    const recommendations: string[] = []

    if (performance.strugglingTopics.length > 3) {
      recommendations.push("Focus on reviewing fundamental concepts before advancing")
    }

    if (this.getRecentAccuracy(performance) > 0.9) {
      recommendations.push("Ready for more challenging material")
    }

    if (performance.sessionDuration > performance.attentionSpan * 1.5) {
      recommendations.push("Consider shorter, more frequent study sessions")
    }

    return recommendations
  }
}

interface AdaptationRule {
  condition: (performance: StudentPerformance, context: LearningContext) => boolean
  action: string
  priority: number
  description: string
}

// Export singleton instance
export const adaptiveAI = new AdaptiveAIEngine()
