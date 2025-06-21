import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

interface OsmosisGuidanceRequest {
  experimentId: string
  studentLevel: string
  currentStep: number
  studentQuestion?: string
  experimentData?: {
    timeElapsed: number
    waterMovement: number
    concentration: {
      inside: number
      outside: number
    }
    cellSize: number
    observations: string[]
  }
}

interface OsmosisGuidanceResponse {
  guidance: string
  nextSteps: string[]
  conceptExplanation: string
  safetyReminders: string[]
  cbcAlignment: string[]
  assessmentQuestions: string[]
  realWorldConnections: string[]
}

// Initialize Groq client
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || "",
})

const OSMOSIS_EXPERIMENTS = {
  "potato-osmosis": {
    name: "Potato Osmosis Investigation",
    steps: [
      "Prepare potato slices and salt solutions",
      "Place potato in hypotonic solution",
      "Record initial observations",
      "Monitor changes over time",
      "Switch to hypertonic solution",
      "Analyze and conclude",
    ],
    concepts: ["cell membrane permeability", "water potential", "turgor pressure"],
    safety: ["Handle sharp tools carefully", "Wash hands after handling solutions"],
  },
  "egg-membrane-osmosis": {
    name: "Egg Membrane Osmosis",
    steps: [
      "Prepare egg membrane and solutions",
      "Set up osmosis apparatus",
      "Record initial measurements",
      "Monitor water movement",
      "Calculate osmotic pressure",
      "Analyze results",
    ],
    concepts: ["selective permeability", "osmotic pressure", "concentration gradients"],
    safety: ["Handle glass equipment carefully", "Clean up spills immediately"],
  },
  "plant-cell-plasmolysis": {
    name: "Plant Cell Plasmolysis",
    steps: [
      "Prepare onion epidermis",
      "Mount on microscope slide",
      "Observe normal cells",
      "Add hypertonic solution",
      "Observe plasmolysis",
      "Add water and observe recovery",
    ],
    concepts: ["plasmolysis", "deplasmolysis", "cell wall vs membrane"],
    safety: ["Handle microscope carefully", "Dispose of biological material properly"],
  },
  "dialysis-tubing": {
    name: "Dialysis Tubing Osmosis",
    steps: [
      "Prepare dialysis tubing",
      "Fill with test solution",
      "Immerse in external solution",
      "Monitor volume changes",
      "Test for substance movement",
      "Calculate permeability rates",
    ],
    concepts: ["artificial membranes", "molecular size", "diffusion rates"],
    safety: ["Handle chemicals properly", "Wear safety equipment"],
  },
}

export async function POST(request: NextRequest) {
  try {
    const guidanceRequest: OsmosisGuidanceRequest = await request.json()

    if (!guidanceRequest.experimentId || !guidanceRequest.studentLevel) {
      return NextResponse.json({ error: "Experiment ID and student level are required" }, { status: 400 })
    }

    // Get experiment details
    const experiment = OSMOSIS_EXPERIMENTS[guidanceRequest.experimentId as keyof typeof OSMOSIS_EXPERIMENTS]
    if (!experiment) {
      return NextResponse.json({ error: "Unknown experiment" }, { status: 400 })
    }

    // Generate structured guidance first (always works)
    const structuredGuidance = generateStructuredGuidance(guidanceRequest, experiment)

    let aiGuidance = "AI guidance temporarily unavailable. Using structured guidance."

    // Try to get AI-enhanced guidance
    if (process.env.GROQ_API_KEY) {
      try {
        const systemPrompt = `You are an expert biology teacher specializing in Kenya's CBC curriculum for Grade 9. 
You're guiding students through osmosis experiments with deep understanding of:

- CBC Grade 9 Integrated Science curriculum
- Osmosis, diffusion, and cell transport mechanisms  
- Laboratory safety and proper experimental procedures
- Real-world applications in Kenyan agriculture and medicine
- Age-appropriate explanations for 14-15 year old students

Current Experiment: ${experiment.name}
Current Step: ${guidanceRequest.currentStep + 1} of ${experiment.steps.length}
Step Description: ${experiment.steps[guidanceRequest.currentStep] || "Experiment complete"}

Provide clear, encouraging guidance that:
1. Explains the current step in simple terms
2. Connects to CBC learning outcomes
3. Relates to real-world applications in Kenya
4. Encourages scientific thinking and observation
5. Addresses common misconceptions about osmosis`

        const userPrompt =
          guidanceRequest.studentQuestion ||
          `Guide me through step ${guidanceRequest.currentStep + 1} of the ${experiment.name} experiment. 
          ${
            guidanceRequest.experimentData
              ? `Current data: Water movement: ${guidanceRequest.experimentData.waterMovement}, 
             Cell size: ${guidanceRequest.experimentData.cellSize}%, 
             Time elapsed: ${guidanceRequest.experimentData.timeElapsed} seconds`
              : ""
          }`

        const { text } = await generateText({
          model: groq("llama3-70b-8192"),
          system: systemPrompt,
          prompt: userPrompt,
          maxTokens: 500,
          temperature: 0.7,
        })

        aiGuidance = text
      } catch (aiError) {
        console.log("AI guidance unavailable, using structured guidance")
      }
    }

    const response: OsmosisGuidanceResponse = {
      guidance: aiGuidance,
      nextSteps: structuredGuidance.nextSteps,
      conceptExplanation: structuredGuidance.conceptExplanation,
      safetyReminders: structuredGuidance.safetyReminders,
      cbcAlignment: structuredGuidance.cbcAlignment,
      assessmentQuestions: structuredGuidance.assessmentQuestions,
      realWorldConnections: structuredGuidance.realWorldConnections,
    }

    return NextResponse.json({
      success: true,
      ...response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Osmosis Guidance Error:", error)

    // Return fallback guidance even if there's an error
    const fallbackGuidance = {
      guidance: "Continue with your osmosis experiment! Observe carefully and record what you see.",
      nextSteps: [
        "Make detailed observations",
        "Record any changes you notice",
        "Think about why these changes are happening",
        "Connect your observations to osmosis theory",
      ],
      conceptExplanation: "Osmosis is the movement of water across a membrane from low to high concentration areas.",
      safetyReminders: ["Handle all materials carefully", "Clean up your workspace"],
      cbcAlignment: ["Grade 9 Cell Biology", "Transport in Living Things"],
      assessmentQuestions: ["What did you observe?", "Why do you think this happened?"],
      realWorldConnections: ["Plant watering", "Food preservation", "Medical treatments"],
    }

    return NextResponse.json({
      success: true,
      ...fallbackGuidance,
      timestamp: new Date().toISOString(),
    })
  }
}

function generateStructuredGuidance(
  request: OsmosisGuidanceRequest,
  experiment: any,
): Omit<OsmosisGuidanceResponse, "guidance"> {
  const currentStep = request.currentStep
  const isLastStep = currentStep >= experiment.steps.length - 1

  return {
    nextSteps: isLastStep
      ? [
          "Review your observations and data",
          "Write a conclusion about what you learned",
          "Think about real-world applications",
          "Prepare to share your findings",
        ]
      : [
          experiment.steps[currentStep + 1] || "Continue observations",
          "Record detailed measurements",
          "Note any changes in appearance",
          "Think about the science behind what you see",
        ],

    conceptExplanation: getConceptExplanation(request.experimentId, currentStep),

    safetyReminders: experiment.safety || [
      "Handle all materials with care",
      "Keep your workspace clean and organized",
      "Wash hands before and after the experiment",
    ],

    cbcAlignment: [
      "Grade 9 Integrated Science - Living Things and Their Environment",
      "Cell Structure and Function",
      "Transport in Plants and Animals",
      "Scientific Investigation Skills",
    ],

    assessmentQuestions: generateAssessmentQuestions(request.experimentId, currentStep),

    realWorldConnections: [
      "How farmers in Kenya manage crop irrigation",
      "Food preservation methods used locally",
      "Medical treatments involving fluid balance",
      "Water purification in rural communities",
      "Plant adaptation to different climates",
    ],
  }
}

function getConceptExplanation(experimentId: string, step: number): string {
  const explanations = {
    "potato-osmosis": [
      "Potato cells have semi-permeable membranes that allow water to pass through",
      "When placed in different solutions, water moves to balance concentrations",
      "Hypotonic solutions cause cells to swell as water moves in",
      "Hypertonic solutions cause cells to shrink as water moves out",
      "This demonstrates how plants control water uptake and loss",
      "Understanding this helps explain plant responses to drought and flooding",
    ],
    "egg-membrane-osmosis": [
      "Egg membranes are naturally semi-permeable, like cell membranes",
      "We can measure osmotic pressure by observing volume changes",
      "Different molecules move at different rates through membranes",
      "Concentration gradients drive the movement of water",
      "This models how cells maintain proper water balance",
      "Medical applications include understanding how IV fluids work",
    ],
    "plant-cell-plasmolysis": [
      "Plant cells have both cell walls and cell membranes",
      "Under normal conditions, cells are turgid (full of water)",
      "In hypertonic solutions, the cell membrane pulls away from the wall",
      "This process is called plasmolysis and can damage plants",
      "Adding water can reverse plasmolysis (deplasmolysis)",
      "This explains why plants wilt in salty soil or during drought",
    ],
    "dialysis-tubing": [
      "Dialysis tubing mimics biological membranes",
      "Only certain sized molecules can pass through the pores",
      "We can control what substances move across the membrane",
      "This demonstrates selective permeability in action",
      "Different pressures affect the rate of movement",
      "This technology is used in kidney dialysis machines",
    ],
  }

  const expExplanations = explanations[experimentId as keyof typeof explanations] || [
    "Osmosis involves water movement across membranes",
    "Concentration differences drive this movement",
    "Cells use osmosis to maintain proper water balance",
  ]

  return expExplanations[step] || expExplanations[expExplanations.length - 1]
}

function generateAssessmentQuestions(experimentId: string, step: number): string[] {
  const baseQuestions = [
    "What changes did you observe during this step?",
    "Why do you think these changes occurred?",
    "How does this relate to osmosis theory?",
    "What would happen if you changed the concentration?",
    "How might this apply to real plants or animals?",
  ]

  const specificQuestions = {
    "potato-osmosis": [
      "How did the potato texture change in different solutions?",
      "What does this tell us about plant cell water content?",
      "Why might this be important for crop farming?",
    ],
    "egg-membrane-osmosis": [
      "How much did the volume change over time?",
      "What factors might affect the rate of osmosis?",
      "How is this similar to what happens in living cells?",
    ],
    "plant-cell-plasmolysis": [
      "What did the cells look like before and after treatment?",
      "How is plasmolysis different from normal cell shrinkage?",
      "When might plants experience plasmolysis in nature?",
    ],
    "dialysis-tubing": [
      "Which substances moved through the membrane?",
      "How does pore size affect what can pass through?",
      "How is this similar to kidney function?",
    ],
  }

  const specific = specificQuestions[experimentId as keyof typeof specificQuestions] || []
  return [...baseQuestions.slice(0, 3), ...specific.slice(0, 2)]
}
