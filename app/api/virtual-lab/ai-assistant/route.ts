import { NextResponse } from "next/server"

// Enhanced fallback responses for different experiment types
function getSmartFallbackResponse(experimentType: string, message: string) {
  const responses = {
    microscopy: {
      observation:
        "Great observation! When using the microscope, try adjusting the focus and magnification. Look for cell walls, nuclei, and other organelles. What structures can you identify?",
      question:
        "Excellent question about microscopy! Remember that different magnifications reveal different details. Start with low power to locate your specimen, then increase magnification for detailed observation.",
      help: "I'm here to help with your microscopy work! Use the fine focus knob for sharp images, and always start with the lowest objective lens. What specific part of the cell are you examining?",
    },
    ecosystem: {
      observation:
        "Fantastic thinking about ecosystems! Consider how energy flows through food chains and how organisms depend on each other. What relationships do you notice between different species?",
      question:
        "Great ecosystem question! Think about producers, consumers, and decomposers. How do they interact? What happens when one part of the ecosystem changes?",
      help: "Ecosystems are complex networks! Look for patterns in how organisms interact with each other and their environment. What role does each organism play?",
    },
    osmosis: {
      observation:
        "Excellent observation about osmosis! Watch how water moves across cell membranes. Notice the direction of water movement - it goes from low to high solute concentration.",
      question:
        "Good osmosis question! Remember that water moves to balance concentrations on both sides of the membrane. What do you predict will happen next?",
      help: "Osmosis is all about water movement! Observe how cells change shape as water enters or leaves. This helps maintain cell balance.",
    },
    photosynthesis: {
      observation:
        "Great thinking about photosynthesis! Plants use sunlight, water, and carbon dioxide to make glucose and oxygen. What factors affect the rate of photosynthesis?",
      question:
        "Excellent photosynthesis question! Consider the inputs (light, water, CO2) and outputs (glucose, oxygen). How do environmental changes affect this process?",
      help: "Photosynthesis is amazing! Plants are like solar-powered food factories. What evidence of photosynthesis can you observe in your experiment?",
    },
    default: {
      observation:
        "Excellent scientific thinking! Keep observing carefully and asking questions. What patterns do you notice in your experiment?",
      question:
        "Great question! Scientific inquiry starts with curiosity like yours. What do you predict will happen next, and why?",
      help: "You're doing great scientific work! Remember to observe, question, hypothesize, and test. What's the most interesting thing you've discovered so far?",
    },
  }

  const experimentResponses = responses[experimentType as keyof typeof responses] || responses.default
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("what") || lowerMessage.includes("how") || lowerMessage.includes("why")) {
    return experimentResponses.question
  } else if (lowerMessage.includes("see") || lowerMessage.includes("notice") || lowerMessage.includes("observe")) {
    return experimentResponses.observation
  } else {
    return experimentResponses.help
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      status: "Lab Assistant Ready",
      hasGroqKey: !!process.env.GROQ_API_KEY,
      model: "groq-llama",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      status: "Lab Assistant Ready (Fallback Mode)",
      hasGroqKey: false,
      error: "Configuration check failed",
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, experimentType = "default", context } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Valid message is required",
          response: "Please ask me a question about your experiment!",
          fallback: true,
        },
        { status: 400 },
      )
    }

    // Try to use Groq API if available
    if (process.env.GROQ_API_KEY) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              {
                role: "system",
                content: `You are an enthusiastic science lab assistant helping students with virtual experiments. 

Your role:
- Guide students through ${experimentType} experiments
- Ask thought-provoking questions to encourage discovery
- Provide hints without giving away answers directly
- Encourage scientific thinking and observation
- Keep responses concise (2-3 sentences max)
- Use encouraging, age-appropriate language for grades 4-8

Current experiment context: ${context ? JSON.stringify(context) : "General lab work"}

Remember: Help them discover, don't just tell them the answer!`,
              },
              {
                role: "user",
                content: message,
              },
            ],
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const aiResponse = data.choices?.[0]?.message?.content

          if (aiResponse) {
            return NextResponse.json({
              response: aiResponse,
              fallback: false,
              model: "llama3-8b-8192",
              timestamp: new Date().toISOString(),
            })
          }
        }
      } catch (groqError) {
        console.log("Groq API unavailable, using fallback:", groqError)
      }
    }

    // Always provide a helpful fallback response
    const fallbackResponse = getSmartFallbackResponse(experimentType, message)

    return NextResponse.json({
      response: fallbackResponse,
      fallback: true,
      model: "smart-fallback",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Lab Assistant Error:", error)

    // Ensure we always return valid JSON
    return NextResponse.json(
      {
        response:
          "I'm having a small technical hiccup, but let's keep exploring! Remember to observe carefully and ask questions about what you see in your experiment.",
        fallback: true,
        error: "general_error",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    ) // Return 200 to avoid HTML error pages
  }
}
