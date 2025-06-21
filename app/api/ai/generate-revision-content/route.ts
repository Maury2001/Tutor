import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { curriculum, preferences, previousQuestions } = await request.json()

    const systemPrompt = `You are a CBC curriculum revision specialist for Kenyan students. Generate revision questions that:

1. Align with the specific CBC curriculum requirements
2. Adapt to the student's learning style (${preferences.learningAbility})
3. Match the difficulty preference (${preferences.difficultyPreference})
4. Focus on reinforcing previously learned concepts
5. Use Kenyan context and examples
6. Provide clear explanations and hints

Generate content appropriate for ${curriculum.grade} level in ${curriculum.learningArea}.`

    const userPrompt = `Create a revision question for:
- Grade: ${curriculum.grade}
- Learning Area: ${curriculum.learningArea}
- Strand: ${curriculum.strand}
- Sub-strand: ${curriculum.subStrand}
- Learning Style: ${preferences.learningAbility}
- Difficulty: ${preferences.difficultyPreference}

Previous questions covered: ${previousQuestions.map((q: any) => q.topic).join(", ")}

Return a JSON object with:
{
  "question": {
    "id": "unique_id",
    "title": "Question title",
    "content": "Question content with clear instructions",
    "type": "open-ended|multiple-choice",
    "difficulty": "easy|medium|hard",
    "expectedAnswer": "Sample correct answer",
    "feedback": "Encouraging feedback for correct answers",
    "explanation": "Detailed explanation of the concept",
    "image": "optional image URL for visual learners"
  },
  "hint": "Helpful hint to guide thinking"
}`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 1000,
      temperature: 0.7,
    })

    const questionData = JSON.parse(text)

    return NextResponse.json(questionData)
  } catch (error) {
    console.error("Error generating revision content:", error)
    return NextResponse.json({ error: "Failed to generate revision content" }, { status: 500 })
  }
}
