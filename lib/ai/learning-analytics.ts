export interface LearningPattern {
  studentId: string
  patternType: "strength" | "weakness" | "preference" | "behavior"
  description: string
  confidence: number // 0-1
  evidence: string[]
  firstObserved: Date
  lastConfirmed: Date
  actionable: boolean
}

export interface LearningInsight {
  type: "performance" | "engagement" | "learning_style" | "difficulty" | "time_management"
  title: string
  description: string
  severity: "low" | "medium" | "high"
  recommendations: string[]
  dataPoints: any[]
}

export class LearningAnalytics {
  private patterns: Map<string, LearningPattern[]> = new Map()
  private insights: Map<string, LearningInsight[]> = new Map()

  public analyzeStudentData(studentId: string, performanceData: any): LearningInsight[] {
    const insights: LearningInsight[] = []

    // Analyze performance trends
    insights.push(...this.analyzePerformanceTrends(studentId, performanceData))

    // Analyze engagement patterns
    insights.push(...this.analyzeEngagementPatterns(studentId, performanceData))

    // Analyze learning style effectiveness
    insights.push(...this.analyzeLearningStyleEffectiveness(studentId, performanceData))

    // Analyze difficulty progression
    insights.push(...this.analyzeDifficultyProgression(studentId, performanceData))

    // Store insights
    this.insights.set(studentId, insights)

    return insights
  }

  private analyzePerformanceTrends(studentId: string, data: any): LearningInsight[] {
    const insights: LearningInsight[] = []

    // Declining performance
    if (this.isPerformanceDeclining(data)) {
      insights.push({
        type: "performance",
        title: "Performance Decline Detected",
        description: "Student performance has been declining over recent sessions",
        severity: "high",
        recommendations: [
          "Review fundamental concepts",
          "Reduce difficulty temporarily",
          "Provide additional encouragement",
          "Check for external factors affecting learning",
        ],
        dataPoints: data.recentScores || [],
      })
    }

    // Consistent high performance
    if (this.isConsistentlyHighPerforming(data)) {
      insights.push({
        type: "performance",
        title: "Ready for Advanced Content",
        description: "Student consistently performs well and may be ready for more challenging material",
        severity: "low",
        recommendations: [
          "Increase difficulty level",
          "Introduce advanced concepts",
          "Provide enrichment activities",
          "Consider accelerated learning path",
        ],
        dataPoints: data.recentScores || [],
      })
    }

    return insights
  }

  private analyzeEngagementPatterns(studentId: string, data: any): LearningInsight[] {
    const insights: LearningInsight[] = []

    // Low engagement
    if (data.sessionDuration < data.attentionSpan * 0.5) {
      insights.push({
        type: "engagement",
        title: "Low Engagement Detected",
        description: "Student sessions are significantly shorter than their attention span suggests",
        severity: "medium",
        recommendations: [
          "Make content more interactive",
          "Use gamification elements",
          "Adjust content to student interests",
          "Check for technical issues",
        ],
        dataPoints: [data.sessionDuration, data.attentionSpan],
      })
    }

    // High help-seeking behavior
    if (data.helpRequestFrequency > 5) {
      insights.push({
        type: "engagement",
        title: "High Help-Seeking Behavior",
        description: "Student frequently requests help, indicating possible confusion or lack of confidence",
        severity: "medium",
        recommendations: [
          "Provide clearer explanations",
          "Break down complex concepts",
          "Offer more examples",
          "Build confidence with easier questions",
        ],
        dataPoints: [data.helpRequestFrequency],
      })
    }

    return insights
  }

  private analyzeLearningStyleEffectiveness(studentId: string, data: any): LearningInsight[] {
    const insights: LearningInsight[] = []

    // Learning style mismatch
    if (this.isLearningStyleMismatch(data)) {
      insights.push({
        type: "learning_style",
        title: "Learning Style Optimization Needed",
        description: "Current teaching approach may not match student's optimal learning style",
        severity: "medium",
        recommendations: [
          "Experiment with different presentation styles",
          "Incorporate more visual/auditory/kinesthetic elements",
          "Ask student about preferences",
          "Monitor performance with different approaches",
        ],
        dataPoints: [data.preferredLearningStyle, data.currentApproach],
      })
    }

    return insights
  }

  private analyzeDifficultyProgression(studentId: string, data: any): LearningInsight[] {
    const insights: LearningInsight[] = []

    // Difficulty plateau
    if (this.isDifficultyPlateau(data)) {
      insights.push({
        type: "difficulty",
        title: "Difficulty Progression Stalled",
        description: "Student has been at the same difficulty level for an extended period",
        severity: "low",
        recommendations: [
          "Gradually increase challenge",
          "Introduce new problem types",
          "Provide scaffolding for harder concepts",
          "Set progressive goals",
        ],
        dataPoints: data.difficultyHistory || [],
      })
    }

    return insights
  }

  // Helper methods for pattern detection
  private isPerformanceDeclining(data: any): boolean {
    if (!data.recentScores || data.recentScores.length < 3) return false

    const scores = data.recentScores.slice(-5)
    let decliningCount = 0

    for (let i = 1; i < scores.length; i++) {
      if (scores[i] < scores[i - 1]) decliningCount++
    }

    return decliningCount >= scores.length * 0.6
  }

  private isConsistentlyHighPerforming(data: any): boolean {
    if (!data.recentScores || data.recentScores.length < 3) return false

    const scores = data.recentScores.slice(-5)
    return scores.every((score) => score >= 0.8)
  }

  private isLearningStyleMismatch(data: any): boolean {
    // Simple heuristic - in real implementation, this would be more sophisticated
    return data.preferredLearningStyle !== data.currentApproach && data.recentPerformance < 0.6
  }

  private isDifficultyPlateau(data: any): boolean {
    if (!data.difficultyHistory || data.difficultyHistory.length < 5) return false

    const recentLevels = data.difficultyHistory.slice(-5)
    return recentLevels.every((level) => level === recentLevels[0])
  }

  public generatePersonalizedRecommendations(studentId: string): string[] {
    const insights = this.insights.get(studentId) || []
    const recommendations: string[] = []

    // Prioritize high-severity insights
    const highPriorityInsights = insights.filter((insight) => insight.severity === "high")
    const mediumPriorityInsights = insights.filter((insight) => insight.severity === "medium")

    // Add recommendations from high-priority insights first
    highPriorityInsights.forEach((insight) => {
      recommendations.push(...insight.recommendations.slice(0, 2))
    })

    // Add some medium-priority recommendations
    mediumPriorityInsights.slice(0, 2).forEach((insight) => {
      recommendations.push(insight.recommendations[0])
    })

    return [...new Set(recommendations)].slice(0, 5) // Remove duplicates and limit to 5
  }
}

export const learningAnalytics = new LearningAnalytics()
