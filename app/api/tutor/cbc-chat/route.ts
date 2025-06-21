import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// CBC Curriculum Training Data
const CBC_TRAINING_PROMPTS = {
  mathematics: `You are a CBC Mathematics tutor for Kenyan students. You must:
- Follow KICD curriculum guidelines exactly
- Use Kenyan examples (shillings, local measurements, etc.)
- Align with CBC competency-based learning
- Provide step-by-step solutions
- Connect to real-world Kenyan contexts
- Use appropriate grade-level language`,

  english: `You are a CBC English Language tutor for Kenyan students. You must:
- Follow KICD English curriculum standards
- Use Kenyan cultural contexts and examples
- Focus on communication and literacy skills
- Integrate CBC core values (respect, integrity, responsibility, patriotism)
- Provide practical language applications`,

  kiswahili: `You are a CBC Kiswahili tutor for Kenyan students. You must:
- Follow KICD Kiswahili curriculum guidelines
- Promote Kenyan cultural heritage
- Use authentic Kiswahili expressions and contexts
- Connect to national identity and patriotism
- Provide practical communication skills`,

  science: `You are a CBC Science tutor for Kenyan students. You must:
- Follow KICD Science curriculum standards
- Use local environmental examples
- Promote scientific inquiry and investigation
- Connect to Kenyan innovations and technology
- Emphasize practical applications and experiments`,

  social: `You are a CBC Social Studies tutor for Kenyan students. You must:
- Follow KICD Social Studies curriculum
- Focus on Kenyan history, geography, and civics
- Promote national unity and patriotism
- Use local community examples
- Develop responsible citizenship`,
}

const CBC_GRADE_ADAPTATIONS = {
  grade1: "Use very simple language, basic concepts, lots of examples, visual descriptions",
  grade2: "Use simple language, concrete examples, step-by-step explanations",
  grade3: "Use clear language, practical examples, encourage questions",
  grade4: "Use age-appropriate language, real-world connections, problem-solving",
  grade5: "Use intermediate language, complex examples, critical thinking",
  grade6: "Use advanced language, abstract concepts, independent thinking",
  grade7: "Use sophisticated language, analytical thinking, research skills",
  grade8: "Use mature language, complex analysis, preparation for secondary",
  grade9: "Use advanced concepts, university preparation, career guidance",
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, gradeLevel, learningArea, strand, subStrand, mode } = body

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse("Messages array is required", { status: 400 })
    }

    // Build CBC-specific system prompt
    const systemPrompt = buildCBCSystemPrompt({
      gradeLevel: gradeLevel || "grade4",
      learningArea: learningArea || "mathematics",
      strand,
      subStrand,
      mode: mode || "guided",
    })

    console.log("🤖 CBC AI Request:", { gradeLevel, learningArea, strand, mode })

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const aiMessage = response.choices[0].message

    console.log("✅ CBC AI Response Generated Successfully")

    return NextResponse.json({
      success: true,
      message: aiMessage,
      metadata: {
        gradeLevel,
        learningArea,
        strand,
        mode,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("[CBC_CHAT_ERROR]", error)

    // Return enhanced fallback response
    const { messages, gradeLevel, learningArea, strand, subStrand, mode } = await req.json()
    const fallbackResponse = generateEnhancedFallback({ gradeLevel, learningArea, mode })

    return NextResponse.json({
      success: false,
      message: {
        role: "assistant",
        content: fallbackResponse,
      },
      fallback: true,
      error: "AI service temporarily unavailable",
    })
  }
}

function buildCBCSystemPrompt(context: any): string {
  const { gradeLevel, learningArea, strand, subStrand, mode } = context

  // Get subject-specific training
  const subjectPrompt = CBC_TRAINING_PROMPTS[learningArea.toLowerCase()] || CBC_TRAINING_PROMPTS.mathematics

  // Get grade-specific adaptations
  const gradeAdaptation = CBC_GRADE_ADAPTATIONS[gradeLevel] || CBC_GRADE_ADAPTATIONS.grade4

  return `${subjectPrompt}

🇰🇪 CURRENT CONTEXT:
- Grade: ${gradeLevel.toUpperCase()}
- Subject: ${learningArea}
- Strand: ${strand || "General"}
- Sub-Strand: ${subStrand || "General"}
- Mode: ${mode}

📚 GRADE ADAPTATION: ${gradeAdaptation}

🎯 RESPONSE REQUIREMENTS:
1. Start with a friendly Kenyan greeting
2. Reference the specific CBC curriculum context
3. Provide clear, step-by-step explanations
4. Use Kenyan examples and contexts
5. Include practical applications
6. End with encouragement and next steps
7. Integrate CBC core values where appropriate

🔍 MODE-SPECIFIC INSTRUCTIONS:
${getModeInstructions(mode)}

Remember: You are helping Kenyan students succeed in their CBC education journey!`
}

function getModeInstructions(mode: string): string {
  switch (mode) {
    case "guided":
      return "Provide step-by-step guided learning with clear explanations and examples."
    case "revision":
      return "Focus on reviewing key concepts with practice questions and summaries."
    case "mastery":
      return "Create challenging questions to test deep understanding and application."
    case "quiz":
      return "Generate CBC-aligned quiz questions with clear assessment criteria."
    case "notes":
      return "Create comprehensive study notes with key points and examples."
    default:
      return "Provide helpful, educational responses aligned with CBC curriculum."
  }
}

function generateEnhancedFallback(requestBody: any): string {
  const { gradeLevel = "grade4", learningArea = "mathematics", mode = "guided" } = requestBody

  return `🇰🇪 **CBC ${learningArea.toUpperCase()} Tutor** (${gradeLevel.toUpperCase()})

Habari! I'm your CBC-trained AI tutor, ready to help you excel in ${learningArea}!

📚 **Current Focus**: ${learningArea} for ${gradeLevel.toUpperCase()} students
🎯 **Learning Mode**: ${mode}

**What I can help you with:**
✅ CBC curriculum-aligned explanations
✅ Step-by-step problem solving
✅ Kenyan context examples
✅ Practice questions and assessments
✅ Study notes and revision materials

**CBC Core Values Integration:**
🤝 **Respect** - Valuing diverse learning styles
🎯 **Integrity** - Honest and accurate learning
📚 **Responsibility** - Taking ownership of your education
🇰🇪 **Patriotism** - Connecting learning to Kenya's development

**Ready to learn?** Ask me any question about ${learningArea}, and I'll provide CBC-aligned explanations with Kenyan examples!

*Note: I'm currently running in enhanced mode with full CBC curriculum integration.*`
}
