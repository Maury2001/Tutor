import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

interface ExperimentGuidanceRequest {
  experimentId: string
  currentStep: number
  studentQuestion: string
  experimentType: string
  gradeLevel: string
  difficulty: "beginner" | "intermediate" | "advanced"
  studentProgress: {
    completedSteps: number[]
    currentObservations: string[]
    challenges: string[]
  }
}

interface GuidanceResponse {
  mainResponse: string
  encouragement: string
  nextSteps: string[]
  safetyReminders: string[]
  conceptConnections: string[]
  realWorldLinks: string[]
}

// Initialize Groq client
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || "",
})

export async function POST(request: NextRequest) {
  try {
    const guidanceRequest: ExperimentGuidanceRequest = await request.json()

    if (!guidanceRequest.experimentId || !guidanceRequest.studentQuestion) {
      return NextResponse.json({ error: "Experiment ID and student question are required" }, { status: 400 })
    }

    // Generate fallback guidance first
    const fallbackGuidance = generateFallbackGuidance(guidanceRequest)

    // Try to get AI guidance if Groq is available
    if (process.env.GROQ_API_KEY) {
      try {
        const systemPrompt = `You are a helpful AI lab instructor for Kenya's CBC curriculum. You're guiding a ${guidanceRequest.gradeLevel} student through a ${guidanceRequest.experimentType} experiment.

Current Context:
- Step: ${guidanceRequest.currentStep}
- Difficulty: ${guidanceRequest.difficulty}
- Student's question: "${guidanceRequest.studentQuestion}"
- Completed steps: ${guidanceRequest.studentProgress.completedSteps.join(", ")}
- Current challenges: ${guidanceRequest.studentProgress.challenges.join(", ")}

Provide helpful, encouraging guidance that:
1. Answers their specific question
2. Relates to CBC learning objectives
3. Includes safety considerations
4. Connects to real-world applications in Kenya
5. Encourages scientific thinking

Keep responses concise but informative.`

        const userPrompt = `The student asks: "${guidanceRequest.studentQuestion}"

Please provide helpful guidance for this ${guidanceRequest.experimentType} experiment.`

        const { text } = await generateText({
          model: groq("llama3-70b-8192"),
          system: systemPrompt,
          prompt: userPrompt,
          maxTokens: 400,
          temperature: 0.7,
        })

        const aiGuidance: GuidanceResponse = {
          mainResponse: text,
          encouragement: generateEncouragement(guidanceRequest),
          nextSteps: generateNextSteps(guidanceRequest),
          safetyReminders: generateSafetyReminders(guidanceRequest),
          conceptConnections: generateConceptConnections(guidanceRequest),
          realWorldLinks: generateRealWorldLinks(guidanceRequest),
        }

        return NextResponse.json({
          success: true,
          guidance: aiGuidance,
          timestamp: new Date().toISOString(),
        })
      } catch (aiError) {
        console.log("AI guidance unavailable, using fallback")
      }
    }

    // Return fallback guidance
    return NextResponse.json({
      success: true,
      guidance: fallbackGuidance,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Experiment Guidance Error:", error)

    // Always return some guidance, even if there's an error
    const emergencyGuidance: GuidanceResponse = {
      mainResponse:
        "I'm here to help! Continue with your experiment step by step. If you're unsure about something, take your time to observe carefully and think about what you're seeing.",
      encouragement: "You're doing great! Science is all about asking questions and making discoveries.",
      nextSteps: ["Continue with the current step", "Make careful observations", "Record what you notice"],
      safetyReminders: ["Follow all safety guidelines", "Ask for help if needed"],
      conceptConnections: ["Think about how this connects to what you've learned"],
      realWorldLinks: ["Consider how this applies to everyday life"],
    }

    return NextResponse.json({
      success: true,
      guidance: emergencyGuidance,
      timestamp: new Date().toISOString(),
    })
  }
}

function generateFallbackGuidance(request: ExperimentGuidanceRequest): GuidanceResponse {
  const experimentGuidance = {
    microscopy: {
      mainResponse:
        "Great question about microscopy! Focus on adjusting the focus carefully and looking for different structures. What specific features are you trying to observe?",
      conceptConnections: ["Cell structure and function", "Living vs non-living", "Scale and magnification"],
      realWorldLinks: ["Medical diagnosis", "Food safety", "Water quality testing"],
    },
    "atomic-structure": {
      mainResponse:
        "Excellent question about atoms! Remember that protons determine the element, while electrons affect chemical behavior. What patterns do you notice?",
      conceptConnections: ["Periodic table organization", "Chemical bonding", "Matter and energy"],
      realWorldLinks: ["Materials science", "Electronics", "Nuclear energy"],
    },
    ecosystem: {
      mainResponse:
        "Good observation about ecosystems! Think about how different factors affect the balance of life. What relationships do you see between organisms?",
      conceptConnections: ["Food chains and webs", "Environmental factors", "Biodiversity"],
      realWorldLinks: ["Conservation in Kenya", "Agriculture", "Climate change"],
    },
    "water-purification": {
      mainResponse:
        "Important question about water treatment! Each step removes different types of contaminants. What changes do you observe in the water?",
      conceptConnections: ["Physical and chemical changes", "Filtration methods", "Water quality"],
      realWorldLinks: ["Clean water access", "Public health", "Environmental protection"],
    },
  }

  const guidance =
    experimentGuidance[request.experimentType as keyof typeof experimentGuidance] || experimentGuidance.microscopy

  return {
    mainResponse: guidance.mainResponse,
    encouragement: generateEncouragement(request),
    nextSteps: generateNextSteps(request),
    safetyReminders: generateSafetyReminders(request),
    conceptConnections: guidance.conceptConnections,
    realWorldLinks: guidance.realWorldLinks,
  }
}

function generateEncouragement(request: ExperimentGuidanceRequest): string {
  const encouragements = [
    "You're asking excellent scientific questions!",
    "Great observation skills - keep it up!",
    "Your curiosity is what makes a great scientist!",
    "You're making wonderful progress!",
    "That's exactly the kind of thinking scientists do!",
  ]
  return encouragements[Math.floor(Math.random() * encouragements.length)]
}

function generateNextSteps(request: ExperimentGuidanceRequest): string[] {
  return [
    "Continue with careful observations",
    "Record what you notice in detail",
    "Think about why you're seeing these results",
    "Consider how this connects to the bigger picture",
  ]
}

function generateSafetyReminders(request: ExperimentGuidanceRequest): string[] {
  const safetyByExperiment = {
    microscopy: ["Handle slides carefully", "Adjust focus slowly", "Keep lenses clean"],
    "atomic-structure": ["Virtual experiment - no physical safety concerns", "Take breaks to rest your eyes"],
    ecosystem: ["Virtual simulation - observe patterns carefully"],
    "water-purification": ["In real labs, wear safety equipment", "Handle materials carefully"],
  }

  return (
    safetyByExperiment[request.experimentType as keyof typeof safetyByExperiment] || [
      "Follow all safety guidelines",
      "Ask for help if needed",
    ]
  )
}

function generateConceptConnections(request: ExperimentGuidanceRequest): string[] {
  return [
    "How does this relate to what you've learned before?",
    "What patterns do you notice?",
    "How might this apply to other situations?",
  ]
}

function generateRealWorldLinks(request: ExperimentGuidanceRequest): string[] {
  return [
    "How is this used in everyday life?",
    "What careers use this knowledge?",
    "How does this help solve real problems?",
  ]
}
