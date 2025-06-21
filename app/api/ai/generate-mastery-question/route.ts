import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { curriculum, preferences, questionNumber, totalQuestions, previousAnswers } = await request.json()

    const systemPrompt = `You are a CBC curriculum mastery assessment specialist. Create comprehensive assessment questions that:

1. Test deep understanding and application of concepts
2. Align with CBC competency-based assessment principles
3. Use authentic, real-world scenarios relevant to Kenyan students
4. Progress in difficulty appropriately
5. Assess multiple competency levels
6. Include both knowledge recall and higher-order thinking

This is question ${questionNumber + 1} of ${totalQuestions} in the assessment.`

    const userPrompt = `Create a mastery assessment question for:
- Grade: ${curriculum.grade}
- Learning Area: ${curriculum.learningArea}
- Strand: ${curriculum.strand}
- Sub-strand: ${curriculum.subStrand}
- Question Position: ${questionNumber + 1}/${totalQuestions}

Previous performance: ${
      previousAnswers.length > 0
        ? `${previousAnswers.filter((a: any) => a.correct).length}/${previousAnswers.length} correct`
        : "No previous answers"
    }

Return a JSON object with:
{
  "question": {
    "id": "unique_id",
    "question": "Assessment question text",
    "context": "Background context if needed",
    "type": "multiple-choice|open-ended|practical",
    "difficulty": "easy|medium|hard",
    "competency": "Specific competency being assessed",
    "options": [
      {"id": "a", "text": "Option A"},
      {"id": "b", "text": "Option B"},
      {"id": "c", "text": "Option C"},
      {"id": "d", "text": "Option D"}
    ],
    "correctAnswer": "correct option id or expected answer",
    "explanation": "Detailed explanation of correct answer",
    "rubric": "Assessment criteria for open-ended questions",
    "image": "optional image URL"
  }
}`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 1200,
      temperature: 0.6,
    })

    const questionData = JSON.parse(text)

    return NextResponse.json(questionData)
  } catch (error) {
    console.error("Error generating mastery question:", error)
    return NextResponse.json({ error: "Failed to generate mastery question" }, { status: 500 })
  }
}
