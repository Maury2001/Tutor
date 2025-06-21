import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { studentQuestion, studentProfile, currentContext, learningHistory, preferredStyle } = await request.json()

    if (!studentQuestion) {
      return NextResponse.json(
        {
          error: "Student question is required",
        },
        { status: 400 },
      )
    }

    const tutoringPrompt = `You are an intelligent CBC tutor for Kenyan students. Provide personalized tutoring:

Student Question: ${studentQuestion}
Student Profile: ${JSON.stringify(studentProfile || {})}
Current Context: ${JSON.stringify(currentContext || {})}
Learning History: ${JSON.stringify(learningHistory || [])}
Preferred Learning Style: ${preferredStyle || "mixed"}

Provide smart tutoring that includes:
1. Direct answer to the student's question
2. Step-by-step explanation appropriate for their level
3. Kenyan cultural examples and contexts
4. Interactive elements or questions
5. Connection to CBC learning objectives
6. Practice opportunities
7. Encouragement and motivation
8. Next learning steps
9. Additional resources
10. Assessment of understanding

Tutoring Principles:
- Socratic method: Guide discovery through questions
- Scaffolding: Build on existing knowledge
- Personalization: Adapt to individual needs
- Cultural relevance: Use Kenyan contexts
- Competency focus: Emphasize practical skills
- Growth mindset: Encourage persistence and learning from mistakes`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: tutoringPrompt,
      maxTokens: 1200,
      temperature: 0.7,
    })

    // Generate follow-up questions and activities
    const followUpQuestions = generateFollowUpQuestions(studentQuestion, currentContext)
    const practiceActivities = generatePracticeActivities(studentQuestion, studentProfile)
    const resources = generateAdditionalResources(studentQuestion, currentContext)

    return NextResponse.json({
      success: true,
      smartTutoring: {
        mainResponse: text,
        followUpQuestions,
        practiceActivities,
        additionalResources: resources,
        difficultyAdjustment: calculateDifficultyAdjustment(studentProfile, learningHistory),
      },
      metadata: {
        questionType: categorizeQuestion(studentQuestion),
        responseLength: text.length,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Smart Tutoring API Error:", error)
    return NextResponse.json({ error: "Failed to provide smart tutoring response" }, { status: 500 })
  }
}

function generateFollowUpQuestions(question: string, context: any): string[] {
  const questions = []

  if (question.toLowerCase().includes("math")) {
    questions.push("Can you solve a similar problem on your own?")
    questions.push("How would you explain this to a friend?")
    questions.push("Where might you use this in real life?")
  }

  if (question.toLowerCase().includes("science")) {
    questions.push("What do you think would happen if we changed one variable?")
    questions.push("Can you design an experiment to test this?")
    questions.push("How does this connect to what you observe in nature?")
  }

  questions.push("What part would you like me to explain more?")
  questions.push("Do you have any other questions about this topic?")

  return questions.slice(0, 3)
}

function generatePracticeActivities(question: string, profile: any): any[] {
  const activities = []

  if (question.toLowerCase().includes("math")) {
    activities.push({
      type: "practice_problems",
      title: "Solve 3 similar problems",
      description: "Practice with problems of increasing difficulty",
      estimatedTime: "15 minutes",
    })
  }

  if (question.toLowerCase().includes("writing")) {
    activities.push({
      type: "creative_writing",
      title: "Write a short paragraph",
      description: "Apply the concepts in your own writing",
      estimatedTime: "20 minutes",
    })
  }

  activities.push({
    type: "reflection",
    title: "Reflect on your learning",
    description: "Think about what you learned and how you can use it",
    estimatedTime: "5 minutes",
  })

  return activities
}

function generateAdditionalResources(question: string, context: any): any[] {
  return [
    {
      type: "video",
      title: "Related educational video",
      description: "Visual explanation of the concept",
      url: "#",
    },
    {
      type: "interactive",
      title: "Practice simulation",
      description: "Hands-on learning activity",
      url: "#",
    },
    {
      type: "reading",
      title: "Additional reading material",
      description: "Deepen your understanding",
      url: "#",
    },
  ]
}

function calculateDifficultyAdjustment(profile: any, history: any[]): any {
  // Simple difficulty adjustment logic
  const recentPerformance = history?.slice(-5) || []
  const averageScore =
    recentPerformance.length > 0
      ? recentPerformance.reduce((sum, item) => sum + (item.score || 0), 0) / recentPerformance.length
      : 50

  let adjustment = "maintain"
  if (averageScore > 80) adjustment = "increase"
  if (averageScore < 60) adjustment = "decrease"

  return {
    recommendation: adjustment,
    currentLevel: profile?.difficultyLevel || "medium",
    reasoning: `Based on recent performance average of ${Math.round(averageScore)}%`,
  }
}

function categorizeQuestion(question: string): string {
  const q = question.toLowerCase()

  if (q.includes("how") || q.includes("explain")) return "explanation"
  if (q.includes("what") || q.includes("define")) return "definition"
  if (q.includes("why")) return "reasoning"
  if (q.includes("solve") || q.includes("calculate")) return "problem_solving"
  if (q.includes("example")) return "example_request"

  return "general_inquiry"
}
