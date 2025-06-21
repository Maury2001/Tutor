import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

interface AdaptiveLearningRequest {
  studentId: string
  experimentType: string
  gradeLevel: string
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading"
  performanceData: {
    completionRate: number
    accuracyScore: number
    timeSpent: number
    strugglingConcepts: string[]
    masteredConcepts: string[]
  }
  currentDifficulty: "beginner" | "intermediate" | "advanced"
}

interface AdaptiveRecommendations {
  difficultyAdjustment: "increase" | "maintain" | "decrease"
  personalizedActivities: string[]
  conceptReinforcement: string[]
  nextExperiments: string[]
  learningSupports: string[]
  motivationalElements: string[]
}

// Initialize Groq client
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || "",
})

export async function POST(request: NextRequest) {
  try {
    const adaptiveRequest: AdaptiveLearningRequest = await request.json()

    if (!adaptiveRequest.studentId || !adaptiveRequest.experimentType) {
      return NextResponse.json({ error: "Student ID and experiment type are required" }, { status: 400 })
    }

    // Generate structured adaptive recommendations first (always works)
    const recommendations = generateAdaptiveRecommendations(adaptiveRequest)

    let aiAnalysis = "AI analysis temporarily unavailable. Using rule-based recommendations."

    // Try to get AI analysis, but don't fail if it doesn't work
    if (process.env.GROQ_API_KEY) {
      try {
        const systemPrompt = `You are an expert AI adaptive learning system for Kenya's CBC curriculum. Provide brief, practical learning recommendations.

Student Profile:
- Grade Level: ${adaptiveRequest.gradeLevel}
- Learning Style: ${adaptiveRequest.learningStyle}
- Current Difficulty: ${adaptiveRequest.currentDifficulty}
- Experiment Type: ${adaptiveRequest.experimentType}

Performance: ${adaptiveRequest.performanceData.completionRate}% completion, ${adaptiveRequest.performanceData.accuracyScore}% accuracy

Provide 2-3 specific, actionable recommendations for this student.`

        const userPrompt = `Based on the student's performance, provide specific recommendations for improving their learning experience in this ${adaptiveRequest.experimentType} experiment.`

        const { text } = await generateText({
          model: groq("llama3-70b-8192"),
          system: systemPrompt,
          prompt: userPrompt,
          maxTokens: 300,
          temperature: 0.7,
        })

        aiAnalysis = text
      } catch (aiError) {
        console.log("AI analysis unavailable, using fallback recommendations")
      }
    }

    return NextResponse.json({
      success: true,
      adaptiveRecommendations: recommendations,
      aiAnalysis,
      learningPath: generateLearningPath(adaptiveRequest),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Adaptive Learning Error:", error)

    // Return fallback recommendations even if there's an error
    const fallbackRecommendations = generateFallbackRecommendations()

    return NextResponse.json({
      success: true,
      adaptiveRecommendations: fallbackRecommendations,
      aiAnalysis: "Using offline recommendations. Continue with your experiment!",
      learningPath: {
        currentLevel: "intermediate",
        recommendedProgression: [
          "Complete current experiment",
          "Review key concepts",
          "Try related activities",
          "Share your findings",
        ],
        timelineEstimate: "2-3 weeks",
        checkpoints: ["Finish current steps", "Understand main concepts", "Apply to real situations"],
      },
      timestamp: new Date().toISOString(),
    })
  }
}

function generateAdaptiveRecommendations(request: AdaptiveLearningRequest): AdaptiveRecommendations {
  const { performanceData, learningStyle, currentDifficulty } = request

  // Determine difficulty adjustment
  let difficultyAdjustment: "increase" | "maintain" | "decrease"
  if (performanceData.completionRate > 85 && performanceData.accuracyScore > 80) {
    difficultyAdjustment = "increase"
  } else if (performanceData.completionRate < 60 || performanceData.accuracyScore < 60) {
    difficultyAdjustment = "decrease"
  } else {
    difficultyAdjustment = "maintain"
  }

  // Generate learning style-specific activities
  const personalizedActivities = generateLearningStyleActivities(learningStyle, request.experimentType)

  // Generate concept reinforcement based on struggling areas
  const conceptReinforcement =
    request.performanceData.strugglingConcepts.length > 0
      ? request.performanceData.strugglingConcepts.map(
          (concept) => `Review ${concept} with interactive simulations and real-world examples`,
        )
      : ["Continue practicing current concepts", "Explore related topics", "Connect to real-world applications"]

  return {
    difficultyAdjustment,
    personalizedActivities,
    conceptReinforcement,
    nextExperiments: generateNextExperiments(request),
    learningSupports: generateLearningSupports(request),
    motivationalElements: generateMotivationalElements(request),
  }
}

function generateFallbackRecommendations(): AdaptiveRecommendations {
  return {
    difficultyAdjustment: "maintain",
    personalizedActivities: [
      "Take detailed observations",
      "Draw what you see",
      "Ask questions about what you notice",
      "Connect to things you know",
    ],
    conceptReinforcement: [
      "Review the experiment steps carefully",
      "Practice identifying key features",
      "Discuss findings with others",
    ],
    nextExperiments: ["Try a related experiment", "Explore different specimens", "Investigate similar concepts"],
    learningSupports: ["Use the help guides", "Take your time with each step", "Ask questions when needed"],
    motivationalElements: ["Celebrate your progress!", "You're learning important skills", "Every observation counts"],
  }
}

function generateLearningStyleActivities(learningStyle: string, experimentType: string): string[] {
  const activities = {
    visual: [
      "Create concept maps and diagrams",
      "Use interactive visualizations",
      "Draw experimental setups and results",
      "Take screenshots of important findings",
    ],
    auditory: [
      "Discuss findings with others",
      "Record voice notes of observations",
      "Explain concepts out loud",
      "Listen to related educational content",
    ],
    kinesthetic: [
      "Engage in hands-on simulations",
      "Use interactive lab tools",
      "Practice experimental procedures",
      "Build models when possible",
    ],
    reading: [
      "Read detailed experimental procedures",
      "Study written case studies",
      "Take comprehensive notes",
      "Research background information",
    ],
  }

  return activities[learningStyle as keyof typeof activities] || activities.visual
}

function generateNextExperiments(request: AdaptiveLearningRequest): string[] {
  const experimentSuggestions = {
    microscopy: ["Cell structure comparison", "Tissue examination", "Microorganism study"],
    "solar-system": ["Planetary motion", "Eclipse modeling", "Gravity simulation"],
    ecosystem: ["Food web analysis", "Population study", "Environmental factors"],
    "atomic-structure": ["Chemical bonding", "Molecular geometry", "Reaction mechanisms"],
    "water-purification": ["Water quality testing", "Filtration methods", "Chemical treatment"],
  }

  return (
    experimentSuggestions[request.experimentType as keyof typeof experimentSuggestions] || [
      "Related concept exploration",
      "Advanced application studies",
      "Cross-curricular connections",
    ]
  )
}

function generateLearningSupports(request: AdaptiveLearningRequest): string[] {
  return [
    "Use the AI guidance chat for questions",
    "Take breaks when needed",
    "Review previous steps if confused",
    "Connect concepts to real life",
    "Practice with different examples",
    "Share discoveries with others",
  ]
}

function generateMotivationalElements(request: AdaptiveLearningRequest): string[] {
  return [
    "Great job exploring science!",
    "Your observations are valuable",
    "You're building important skills",
    "Science helps solve real problems",
    "Keep asking great questions",
    "Every scientist started like you",
  ]
}

function generateLearningPath(request: AdaptiveLearningRequest) {
  return {
    currentLevel: request.currentDifficulty,
    recommendedProgression: [
      "Master current concepts",
      "Apply knowledge to new contexts",
      "Explore advanced applications",
      "Design independent investigations",
    ],
    timelineEstimate: "2-4 weeks",
    checkpoints: [
      "Complete current experiment series",
      "Demonstrate concept mastery",
      "Apply learning to real scenarios",
      "Share findings with others",
    ],
  }
}
