import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { curriculum, preferences, step, totalSteps, understanding } = await request.json()

    const systemPrompt = `You are a CBC curriculum guided learning specialist. Create step-by-step lessons that:

1. Break down complex concepts into manageable steps
2. Adapt to student's learning style (${preferences.learningAbility})
3. Provide interactive elements and examples
4. Use Kenyan context and culturally relevant examples
5. Include practical activities and real-world applications
6. Scaffold learning appropriately for ${curriculum.grade} level

Current understanding level: ${understanding}%`

    const userPrompt = `Create lesson step ${step} of ${totalSteps} for:
- Grade: ${curriculum.grade}
- Learning Area: ${curriculum.learningArea}
- Strand: ${curriculum.strand}
- Sub-strand: ${curriculum.subStrand}
- Learning Style: ${preferences.learningAbility}
- Student Understanding: ${understanding}%

Return a JSON object with:
{
  "lesson": {
    "title": "Lesson step title",
    "objective": "Clear learning objective for this step",
    "content": "Rich HTML content with explanations, adapted for ${preferences.learningAbility} learners",
    "examples": [
      {
        "title": "Example title",
        "description": "Example using Kenyan context"
      }
    ],
    "activity": {
      "title": "Interactive activity title",
      "instructions": "Clear activity instructions",
      "steps": ["Step 1", "Step 2", "Step 3"]
    },
    "keyPoints": ["Key point 1", "Key point 2"],
    "nextStepPreview": "Brief preview of what comes next"
  }
}`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 1500,
      temperature: 0.7,
    })

    const lessonData = JSON.parse(text)

    return NextResponse.json(lessonData)
  } catch (error) {
    console.error("Error generating guided lesson:", error)
    return NextResponse.json({ error: "Failed to generate guided lesson" }, { status: 500 })
  }
}
