import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { studentId, performanceData, learningGoals, strugglingAreas, strengths, recentActivities } =
      await request.json()

    if (!studentId || !performanceData) {
      return NextResponse.json(
        {
          error: "Student ID and performance data are required",
        },
        { status: 400 },
      )
    }

    const feedbackPrompt = `Generate personalized feedback for a CBC student in Kenya:

Student ID: ${studentId}
Performance Data: ${JSON.stringify(performanceData)}
Learning Goals: ${learningGoals || "General improvement"}
Struggling Areas: ${strugglingAreas || "None specified"}
Strengths: ${strengths || "To be identified"}
Recent Activities: ${JSON.stringify(recentActivities || [])}

Provide comprehensive feedback that includes:
1. Celebration of achievements and strengths
2. Specific areas for improvement with actionable steps
3. Personalized learning recommendations
4. Motivational encouragement
5. Connection to CBC core values
6. Next steps and goals
7. Resources and support suggestions

Make the feedback:
- Encouraging and positive
- Specific and actionable
- Culturally relevant to Kenya
- Age-appropriate
- Aligned with CBC competency-based approach
- Focused on growth mindset`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: feedbackPrompt,
      maxTokens: 1000,
      temperature: 0.7,
    })

    // Generate specific recommendations based on performance
    const recommendations = generateRecommendations(performanceData, strugglingAreas, strengths)

    return NextResponse.json({
      success: true,
      personalizedFeedback: {
        aiGeneratedFeedback: text,
        specificRecommendations: recommendations,
        motivationalMessage: generateMotivationalMessage(performanceData),
        nextSteps: generateNextSteps(strugglingAreas, learningGoals),
      },
      metadata: {
        studentId,
        generatedAt: new Date().toISOString(),
        feedbackType: "comprehensive",
      },
    })
  } catch (error) {
    console.error("Personalized Feedback API Error:", error)
    return NextResponse.json({ error: "Failed to generate personalized feedback" }, { status: 500 })
  }
}

function generateRecommendations(performanceData: any, strugglingAreas: string[], strengths: string[]) {
  const recommendations = []

  if (strugglingAreas?.includes("mathematics")) {
    recommendations.push({
      area: "Mathematics",
      suggestion: "Practice daily math problems using Kenyan currency examples",
      resources: ["Math games with shillings", "Local market calculation exercises"],
    })
  }

  if (strugglingAreas?.includes("reading")) {
    recommendations.push({
      area: "Reading",
      suggestion: "Read Kenyan stories and local newspapers daily",
      resources: ["Kenyan children's books", "Local news articles"],
    })
  }

  if (strengths?.includes("science")) {
    recommendations.push({
      area: "Science",
      suggestion: "Explore advanced science topics and conduct experiments",
      resources: ["Science fair projects", "Nature observation activities"],
    })
  }

  return recommendations
}

function generateMotivationalMessage(performanceData: any) {
  const messages = [
    "Hongera! Your hard work is paying off. Keep up the excellent effort!",
    "You're making great progress! Every step forward is an achievement.",
    "Your dedication to learning is inspiring. Continue reaching for the stars!",
    "Pole sana for any challenges, but remember - every expert was once a beginner!",
  ]

  return messages[Math.floor(Math.random() * messages.length)]
}

function generateNextSteps(strugglingAreas: string[], learningGoals: string) {
  const steps = []

  if (strugglingAreas?.length > 0) {
    steps.push(`Focus on improving ${strugglingAreas[0]} through daily practice`)
    steps.push(`Seek help from teachers or peers in ${strugglingAreas[0]}`)
  }

  if (learningGoals) {
    steps.push(`Work towards your goal: ${learningGoals}`)
  }

  steps.push("Set aside 30 minutes daily for focused study")
  steps.push("Track your progress weekly")

  return steps
}
