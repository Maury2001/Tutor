import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { studentId, learningHistory, currentTopic, difficulty, learningStyle, gradeLevel, subject } =
      await request.json()

    if (!studentId || !currentTopic) {
      return NextResponse.json({ error: "Student ID and current topic are required" }, { status: 400 })
    }

    // Analyze learning history to determine adaptations
    const performanceAnalysis = analyzeLearningHistory(learningHistory || [])
    const adaptedDifficulty = adaptDifficulty(difficulty, performanceAnalysis)
    const personalizedApproach = determinePersonalizedApproach(learningStyle, performanceAnalysis)

    const adaptivePrompt = `You are an expert CBC (Competency-Based Curriculum) adaptive learning AI for Kenyan students.

STUDENT PROFILE:
- Student ID: ${studentId}
- Grade Level: ${gradeLevel || "Not specified"}
- Subject: ${subject || "General"}
- Current Topic: ${currentTopic}
- Original Difficulty: ${difficulty || "medium"}
- Adapted Difficulty: ${adaptedDifficulty}
- Learning Style: ${learningStyle || "mixed"}
- Performance Analysis: ${JSON.stringify(performanceAnalysis)}

LEARNING HISTORY INSIGHTS:
${formatLearningHistory(learningHistory || [])}

PERSONALIZED APPROACH:
${personalizedApproach}

Generate a comprehensive adaptive learning plan that includes:

1. **PERSONALIZED LEARNING PATH**
   - Customized to student's performance patterns
   - Appropriate difficulty progression
   - Learning style accommodations

2. **CBC-ALIGNED ACTIVITIES**
   - Competency-based learning objectives
   - Kenyan cultural contexts and examples
   - Practical applications relevant to student's life

3. **ADAPTIVE ASSESSMENTS**
   - Formative assessment strategies
   - Self-assessment opportunities
   - Progress tracking methods

4. **INTERVENTION STRATEGIES**
   - Support for struggling areas
   - Enrichment for mastered concepts
   - Motivation and engagement techniques

5. **NEXT STEPS RECOMMENDATIONS**
   - Immediate next learning objectives
   - Long-term learning goals
   - Parent/teacher collaboration suggestions

Format your response as a structured JSON with clear sections for easy implementation.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: adaptivePrompt,
      maxTokens: 1500,
      temperature: 0.7,
    })

    // Parse and structure the response
    const adaptivePlan = parseAdaptivePlan(text)

    return NextResponse.json({
      success: true,
      studentProfile: {
        studentId,
        gradeLevel,
        subject,
        currentTopic,
        originalDifficulty: difficulty,
        adaptedDifficulty,
        learningStyle,
        performanceAnalysis,
      },
      adaptiveLearningPlan: adaptivePlan,
      recommendations: generateRecommendations(performanceAnalysis, adaptedDifficulty),
      metadata: {
        generatedAt: new Date().toISOString(),
        apiVersion: "2.0",
        adaptationReason: getAdaptationReason(performanceAnalysis),
      },
    })
  } catch (error) {
    console.error("Adaptive Learning API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate adaptive learning content",
        fallback: generateFallbackPlan(request),
      },
      { status: 500 },
    )
  }
}

function analyzeLearningHistory(history: any[]): any {
  if (!history || history.length === 0) {
    return {
      averageScore: 0.5,
      strengths: [],
      weaknesses: [],
      learningTrend: "neutral",
      engagementLevel: "medium",
      timeSpentLearning: 0,
      helpRequestFrequency: "low",
    }
  }

  const scores = history.map((h) => h.score || 0.5)
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length

  const recentScores = scores.slice(-5)
  const trend =
    recentScores.length > 1
      ? recentScores[recentScores.length - 1] > recentScores[0]
        ? "improving"
        : recentScores[recentScores.length - 1] < recentScores[0]
          ? "declining"
          : "stable"
      : "neutral"

  return {
    averageScore,
    strengths: history.filter((h) => h.score > 0.8).map((h) => h.topic),
    weaknesses: history.filter((h) => h.score < 0.6).map((h) => h.topic),
    learningTrend: trend,
    engagementLevel: averageScore > 0.7 ? "high" : averageScore > 0.4 ? "medium" : "low",
    timeSpentLearning: history.reduce((total, h) => total + (h.timeSpent || 0), 0),
    helpRequestFrequency: history.filter((h) => h.helpRequested).length > history.length * 0.3 ? "high" : "low",
  }
}

function adaptDifficulty(originalDifficulty: string, analysis: any): string {
  const difficultyLevels = ["very_easy", "easy", "medium", "hard", "very_hard"]
  let currentIndex = difficultyLevels.indexOf(originalDifficulty) || 2

  if (analysis.averageScore < 0.4) {
    currentIndex = Math.max(0, currentIndex - 1)
  } else if (analysis.averageScore > 0.8) {
    currentIndex = Math.min(4, currentIndex + 1)
  }

  if (analysis.learningTrend === "declining") {
    currentIndex = Math.max(0, currentIndex - 1)
  } else if (analysis.learningTrend === "improving") {
    currentIndex = Math.min(4, currentIndex + 1)
  }

  return difficultyLevels[currentIndex]
}

function determinePersonalizedApproach(learningStyle: string, analysis: any): string {
  const approaches = {
    visual: "Use diagrams, charts, and visual representations. Include colorful examples and mind maps.",
    auditory: "Incorporate verbal explanations, discussions, and audio elements. Use storytelling techniques.",
    kinesthetic: "Include hands-on activities, physical movement, and practical experiments.",
    reading: "Provide text-based materials, written instructions, and reading comprehension activities.",
    mixed: "Combine multiple learning modalities for comprehensive understanding.",
  }

  let baseApproach = approaches[learningStyle as keyof typeof approaches] || approaches.mixed

  if (analysis.engagementLevel === "low") {
    baseApproach += " Focus on motivation and engagement through gamification and rewards."
  }

  if (analysis.helpRequestFrequency === "high") {
    baseApproach += " Provide additional scaffolding and step-by-step guidance."
  }

  return baseApproach
}

function formatLearningHistory(history: any[]): string {
  if (history.length === 0) return "No previous learning history available."

  return history
    .slice(-5)
    .map(
      (item, index) =>
        `${index + 1}. Topic: ${item.topic || "Unknown"}, Score: ${(item.score * 100).toFixed(0)}%, Time: ${item.timeSpent || 0}min`,
    )
    .join("\n")
}

function parseAdaptivePlan(text: string): any {
  try {
    // Try to extract JSON if present, otherwise structure the text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    // If JSON parsing fails, structure the text response
  }

  return {
    learningPath: text,
    activities: ["Personalized activities based on student profile"],
    assessments: ["Adaptive assessments aligned with CBC standards"],
    interventions: ["Targeted support strategies"],
    nextSteps: ["Recommended progression path"],
  }
}

function generateRecommendations(analysis: any, difficulty: string): string[] {
  const recommendations = []

  if (analysis.averageScore < 0.5) {
    recommendations.push("Focus on foundational concepts before advancing")
    recommendations.push("Provide additional practice opportunities")
  }

  if (analysis.learningTrend === "declining") {
    recommendations.push("Consider reducing cognitive load")
    recommendations.push("Increase motivational elements")
  }

  if (analysis.engagementLevel === "low") {
    recommendations.push("Incorporate more interactive elements")
    recommendations.push("Use gamification strategies")
  }

  if (difficulty === "very_easy") {
    recommendations.push("Build confidence with achievable challenges")
  } else if (difficulty === "very_hard") {
    recommendations.push("Provide advanced enrichment activities")
  }

  return recommendations
}

function getAdaptationReason(analysis: any): string {
  if (analysis.averageScore < 0.4) {
    return "Difficulty reduced due to low performance scores"
  } else if (analysis.averageScore > 0.8) {
    return "Difficulty increased due to high mastery level"
  } else if (analysis.learningTrend === "declining") {
    return "Adapted to address declining performance trend"
  } else if (analysis.learningTrend === "improving") {
    return "Adapted to maintain positive learning momentum"
  }
  return "Standard adaptation based on learning profile"
}

function generateFallbackPlan(request: any): any {
  return {
    learningPath: "Basic CBC-aligned learning activities",
    activities: ["Review fundamental concepts", "Practice with examples", "Apply knowledge"],
    note: "Fallback plan - full AI features temporarily unavailable",
  }
}
