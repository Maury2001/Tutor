import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, grade, assignment, criteria, levels } = body

    if (!subject || !grade || !assignment) {
      return NextResponse.json({ error: "Subject, grade, and assignment are required" }, { status: 400 })
    }

    const prompt = `Create a comprehensive assessment rubric for:
Subject: ${subject}
Grade: ${grade}
Assignment: ${assignment}
Assessment Criteria: ${criteria || "Generate appropriate criteria"}
Performance Levels: ${levels} (e.g., Excellent, Good, Satisfactory, Needs Improvement)

Please include:
1. Clear performance criteria
2. ${levels} performance levels with descriptors
3. Point values or scoring guide
4. Specific indicators for each level
5. CBC curriculum alignment
6. Student-friendly language
7. Teacher guidance notes

Make it suitable for ${grade} students and aligned with Kenyan CBC assessment standards.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2000,
      temperature: 0.6,
    })

    return NextResponse.json({
      content: text,
      metadata: {
        subject,
        grade,
        assignment,
        criteria,
        levels,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error generating rubric:", error)
    return NextResponse.json({ error: "Failed to generate rubric" }, { status: 500 })
  }
}
