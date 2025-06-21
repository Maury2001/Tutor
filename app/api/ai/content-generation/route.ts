import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { contentType, gradeLevel, subject, topic, learningObjectives, duration, difficulty } = await request.json()

    if (!contentType || !gradeLevel || !subject || !topic) {
      return NextResponse.json(
        {
          error: "Content type, grade level, subject, and topic are required",
        },
        { status: 400 },
      )
    }

    const contentPrompt = `Generate ${contentType} for CBC curriculum in Kenya:

Grade Level: ${gradeLevel}
Subject: ${subject}
Topic: ${topic}
Learning Objectives: ${learningObjectives || "General understanding"}
Duration: ${duration || "30 minutes"}
Difficulty: ${difficulty || "medium"}

Requirements:
1. Follow KICD curriculum standards
2. Use Kenyan cultural contexts and examples
3. Include practical applications
4. Align with CBC core values (respect, integrity, responsibility, patriotism)
5. Provide assessment criteria
6. Include interactive elements

Content Types Available:
- lesson_plan: Detailed lesson structure with activities
- worksheet: Practice exercises and problems
- assessment: Quiz or test with rubric
- project: Hands-on project with guidelines
- simulation: Interactive learning activity
- notes: Study materials and summaries

Generate comprehensive, engaging content that promotes active learning.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: contentPrompt,
      maxTokens: 1500,
      temperature: 0.8,
    })

    return NextResponse.json({
      success: true,
      generatedContent: text,
      metadata: {
        contentType,
        gradeLevel,
        subject,
        topic,
        duration,
        difficulty,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Content Generation API Error:", error)
    return NextResponse.json({ error: "Failed to generate educational content" }, { status: 500 })
  }
}
