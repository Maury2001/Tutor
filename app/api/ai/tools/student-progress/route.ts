import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentData, subject, grade, timeframe } = body

    if (!studentData || !subject || !grade) {
      return NextResponse.json({ error: "Student data, subject, and grade are required" }, { status: 400 })
    }

    const prompt = `Analyze student progress data and provide insights:

Subject: ${subject}
Grade: ${grade}
Timeframe: ${timeframe || "Current term"}
Student Data: ${JSON.stringify(studentData)}

Please provide:
1. Overall progress summary
2. Strengths and achievements
3. Areas needing improvement
4. Learning pattern analysis
5. Personalized recommendations
6. Next steps for learning
7. Parent/guardian communication points
8. CBC competency development tracking

Make recommendations specific and actionable for ${grade} level.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    })

    return NextResponse.json({
      analysis: text,
      metadata: {
        subject,
        grade,
        timeframe,
        analyzedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error analyzing student progress:", error)
    return NextResponse.json({ error: "Failed to analyze student progress" }, { status: 500 })
  }
}
