import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, grade, topic, type, difficulty, questions } = body

    if (!subject || !grade || !topic) {
      return NextResponse.json({ error: "Subject, grade, and topic are required" }, { status: 400 })
    }

    const prompt = `Create a comprehensive ${type} assessment for:
Subject: ${subject}
Grade: ${grade}
Topic: ${topic}
Difficulty: ${difficulty}
Number of Questions: ${questions}

Please include:
1. ${questions} well-structured questions of varying types (multiple choice, short answer, essay)
2. Clear instructions for students
3. Marking scheme/rubric
4. Answer key
5. Time allocation suggestions
6. CBC curriculum alignment notes

Ensure questions are age-appropriate for ${grade} students and aligned with Kenyan CBC curriculum standards.`

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        maxTokens: 2500,
        temperature: 0.6,
      })

      return NextResponse.json({
        content: text,
        provider: "OpenAI GPT-4o",
        metadata: {
          subject,
          grade,
          topic,
          type,
          difficulty,
          questions,
          generatedAt: new Date().toISOString(),
        },
      })
    } catch (aiError: any) {
      console.error("OpenAI API Error:", aiError)

      // Handle quota exceeded and other API errors with fallback content
      const fallbackContent = generateFallbackAssessment({ subject, grade, topic, type, difficulty, questions })

      return NextResponse.json({
        content: fallbackContent,
        provider: "Fallback Template",
        error: "AI service temporarily unavailable. Using educational template.",
        metadata: {
          subject,
          grade,
          topic,
          type,
          difficulty,
          questions,
          generatedAt: new Date().toISOString(),
          fallback: true,
        },
      })
    }
  } catch (error) {
    console.error("Error generating assessment:", error)
    return NextResponse.json(
      {
        error: "Failed to generate assessment",
        content: "Unable to generate assessment at this time. Please try again later or contact support.",
      },
      { status: 500 },
    )
  }
}

function generateFallbackAssessment({ subject, grade, topic, type, difficulty, questions }: any): string {
  return `# ${type.toUpperCase()}: ${subject} - ${topic}
**Grade Level:** ${grade}
**Difficulty:** ${difficulty}
**Total Questions:** ${questions}
**Time Allocation:** ${Math.ceil(questions * 2)} minutes

---

## INSTRUCTIONS FOR STUDENTS
1. Read all questions carefully before answering
2. Answer all questions to the best of your ability
3. Show your working where applicable
4. Use clear, complete sentences for written responses

---

## SECTION A: MULTIPLE CHOICE (${Math.ceil(questions * 0.4)} Questions)
*Choose the best answer for each question*

${Array.from(
  { length: Math.ceil(questions * 0.4) },
  (_, i) => `
**Question ${i + 1}:** [Sample question about ${topic} appropriate for ${grade} level]
a) Option A
b) Option B  
c) Option C
d) Option D
`,
).join("")}

---

## SECTION B: SHORT ANSWER (${Math.ceil(questions * 0.4)} Questions)
*Provide brief, clear answers*

${Array.from(
  { length: Math.ceil(questions * 0.4) },
  (_, i) => `
**Question ${Math.ceil(questions * 0.4) + i + 1}:** [Short answer question about ${topic} for ${grade} students]

_Answer:_ ________________________________
`,
).join("")}

---

## SECTION C: EXTENDED RESPONSE (${Math.floor(questions * 0.2)} Questions)
*Provide detailed explanations*

${Array.from(
  { length: Math.floor(questions * 0.2) },
  (_, i) => `
**Question ${Math.ceil(questions * 0.8) + i + 1}:** [Extended response question about ${topic} requiring analysis and explanation]

_Answer:_
_________________________________________________
_________________________________________________
_________________________________________________
`,
).join("")}

---

## MARKING SCHEME

### Section A: Multiple Choice (${Math.ceil(questions * 0.4)} marks)
- 1 mark per correct answer
- No partial credit

### Section B: Short Answer (${Math.ceil(questions * 0.4) * 2} marks)  
- 2 marks per question
- 1 mark for partial understanding
- 2 marks for complete, accurate answer

### Section C: Extended Response (${Math.floor(questions * 0.2) * 5} marks)
- 5 marks per question
- **Excellent (5 marks):** Complete, accurate, well-explained
- **Good (4 marks):** Mostly accurate with minor gaps
- **Satisfactory (3 marks):** Basic understanding shown
- **Needs Improvement (1-2 marks):** Limited understanding
- **Inadequate (0 marks):** No relevant response

**Total Marks:** ${Math.ceil(questions * 0.4) + (Math.ceil(questions * 0.4) * 2) + Math.floor(questions * 0.2) * 5}

---

## ANSWER KEY
*[Teachers: Complete answer key would be provided here with detailed explanations]*

---

## CBC CURRICULUM ALIGNMENT
- **Learning Area:** ${subject}
- **Grade Level:** ${grade}
- **Topic Coverage:** ${topic}
- **Core Competencies Assessed:**
  - Communication and Collaboration
  - Critical Thinking and Problem Solving
  - Creativity and Imagination
  - Digital Literacy

---

## TEACHER NOTES
- This assessment aligns with CBC curriculum standards for ${grade}
- Adjust time allocation based on student needs
- Consider providing additional support for struggling learners
- Use results to inform future lesson planning

---

*⚠️ Note: This is a template assessment. For AI-generated, personalized content, please ensure your OpenAI API quota is available or contact your administrator.*`
}
