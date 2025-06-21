export interface CurriculumContext {
  gradeLevel: string
  learningArea: string
  strand?: string
  subStrand?: string
  studentLevel: "beginner" | "intermediate" | "advanced"
}

export interface AIRequest {
  type: "explanation" | "quiz" | "practice" | "assessment" | "summary"
  topic: string
  context: CurriculumContext
  additionalInstructions?: string
}

export function buildCurriculumPrompt(request: AIRequest): string {
  const { type, topic, context, additionalInstructions } = request

  const basePrompt = `As TutorBot AI, create ${type} content for:
- Topic: ${topic}
- Grade: ${context.gradeLevel}
- Learning Area: ${context.learningArea}
- Student Level: ${context.studentLevel}`

  const typeSpecificPrompts = {
    explanation: `Provide a clear, age-appropriate explanation of ${topic}. Include:
- Key concepts and definitions
- Real-world examples relevant to Kenyan context
- Step-by-step breakdown if applicable
- Visual or practical demonstrations suggestions`,

    quiz: `Create a ${context.studentLevel} level quiz on ${topic} with:
- 5-10 multiple choice questions
- 2-3 short answer questions
- 1 practical application question
- Answer key with explanations`,

    practice: `Generate practice exercises for ${topic} including:
- Varied difficulty levels
- Different question types
- Real-world problem scenarios
- Self-assessment rubric`,

    assessment: `Design a comprehensive assessment for ${topic} with:
- Learning objectives alignment
- Multiple assessment methods
- Rubric for evaluation
- Feedback guidelines`,

    summary: `Create a study summary for ${topic} featuring:
- Key points and concepts
- Important formulas or rules
- Memory aids and mnemonics
- Review questions`,
  }

  return `${basePrompt}

${typeSpecificPrompts[type]}

${context.strand ? `Strand: ${context.strand}` : ""}
${context.subStrand ? `Sub-strand: ${context.subStrand}` : ""}

${additionalInstructions || ""}

Ensure all content aligns with CBC curriculum standards and is culturally relevant to Kenyan students.`
}

export async function getCurriculumAIResponse(request: AIRequest): Promise<string> {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: buildCurriculumPrompt(request) }],
        userContext: `${request.context.gradeLevel} ${request.context.learningArea} student`,
      }),
    })

    const data = await response.json()
    return data.message
  } catch (error) {
    console.error("Curriculum AI Error:", error)
    throw new Error("Failed to get AI response")
  }
}
