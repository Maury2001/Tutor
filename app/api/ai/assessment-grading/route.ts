import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { studentAnswers, correctAnswers, questions, gradingCriteria, subject, gradeLevel } = await request.json()

    if (!studentAnswers || !questions) {
      return NextResponse.json(
        {
          error: "Student answers and questions are required",
        },
        { status: 400 },
      )
    }

    const gradingPrompt = `You are an AI grading assistant for CBC curriculum assessments in Kenya.

Assessment Details:
- Subject: ${subject}
- Grade Level: ${gradeLevel}
- Number of Questions: ${questions.length}

Grading Criteria: ${gradingCriteria || "Standard CBC competency-based assessment"}

Questions and Answers:
${questions
  .map(
    (q: any, i: number) => `
Question ${i + 1}: ${q.question}
Correct Answer: ${correctAnswers?.[i] || q.correctAnswer || "Not provided"}
Student Answer: ${studentAnswers[i] || "No answer provided"}
`,
  )
  .join("\n")}

Provide:
1. Individual question scores with explanations
2. Overall grade and percentage
3. Strengths and areas for improvement
4. Specific feedback for each answer
5. Recommendations for further learning
6. CBC competency assessment

Use CBC grading standards:
- Exceeding Expectations (80-100%)
- Meeting Expectations (60-79%)
- Approaching Expectations (40-59%)
- Below Expectations (0-39%)`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: gradingPrompt,
      maxTokens: 1200,
      temperature: 0.3,
    })

    // Calculate basic score
    let totalScore = 0
    const questionScores = []

    for (let i = 0; i < questions.length; i++) {
      const studentAnswer = studentAnswers[i]?.toLowerCase().trim()
      const correctAnswer = (correctAnswers?.[i] || questions[i].correctAnswer)?.toLowerCase().trim()

      const isCorrect = studentAnswer === correctAnswer
      const score = isCorrect ? 1 : 0
      totalScore += score

      questionScores.push({
        questionIndex: i,
        isCorrect,
        score,
        studentAnswer: studentAnswers[i],
        correctAnswer: correctAnswers?.[i] || questions[i].correctAnswer,
      })
    }

    const percentage = Math.round((totalScore / questions.length) * 100)
    const cbcGrade =
      percentage >= 80 ? "Exceeding" : percentage >= 60 ? "Meeting" : percentage >= 40 ? "Approaching" : "Below"

    return NextResponse.json({
      success: true,
      gradingResults: {
        aiAnalysis: text,
        automaticScoring: {
          totalScore,
          totalQuestions: questions.length,
          percentage,
          cbcGrade,
          questionScores,
        },
      },
      metadata: {
        subject,
        gradeLevel,
        gradedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Assessment Grading API Error:", error)
    return NextResponse.json({ error: "Failed to grade assessment" }, { status: 500 })
  }
}
