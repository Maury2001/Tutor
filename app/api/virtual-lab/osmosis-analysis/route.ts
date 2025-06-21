import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

interface OsmosisAnalysisRequest {
  experimentType: string
  data: any[]
  analysis: any
}

// Initialize Groq client
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || "",
})

export async function POST(request: NextRequest) {
  try {
    const analysisRequest: OsmosisAnalysisRequest = await request.json()

    if (!analysisRequest.experimentType || !analysisRequest.data) {
      return NextResponse.json({ error: "Experiment type and data are required" }, { status: 400 })
    }

    // Generate structured insights first (always works)
    const structuredInsights = generateStructuredInsights(analysisRequest)

    let aiInsights = structuredInsights

    // Try to get AI-enhanced insights
    if (process.env.GROQ_API_KEY) {
      try {
        const systemPrompt = `You are an expert biology educator specializing in Kenya's CBC curriculum and osmosis experiments. 
Analyze the provided experimental data and provide detailed insights for Grade 9 students.

Focus on:
1. Scientific interpretation of the data patterns
2. Connection to CBC learning outcomes
3. Real-world applications in Kenya
4. Common misconceptions to address
5. Suggestions for deeper understanding

Be encouraging, scientifically accurate, and age-appropriate for 14-15 year old students.`

        const userPrompt = `Analyze this osmosis experiment data:

Experiment Type: ${analysisRequest.experimentType}
Data Points: ${analysisRequest.data.length}
Summary Statistics: ${JSON.stringify(analysisRequest.analysis.summary, null, 2)}
Trends: ${JSON.stringify(analysisRequest.analysis.trends, null, 2)}

Provide detailed insights about what this data reveals about osmosis, how it connects to the CBC curriculum, and what students should learn from these results.`

        const { text } = await generateText({
          model: groq("llama3-70b-8192"),
          system: systemPrompt,
          prompt: userPrompt,
          maxTokens: 800,
          temperature: 0.7,
        })

        aiInsights = text
      } catch (aiError) {
        console.log("AI analysis unavailable, using structured insights")
      }
    }

    return NextResponse.json({
      success: true,
      insights: aiInsights,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Osmosis Analysis Error:", error)

    // Return fallback insights
    const fallbackInsights = `Your osmosis experiment shows interesting patterns! The data reveals how water moves across cell membranes in response to concentration differences. This is a fundamental process in all living things, from the plants in your garden to the cells in your body.

Key observations from your data:
- Water movement follows predictable patterns based on concentration gradients
- Cell size changes reflect the osmotic pressure differences
- The system tends toward equilibrium over time

This connects directly to the CBC Grade 9 curriculum on cell transport and helps explain many real-world phenomena you observe in Kenya, from how plants survive drought to how food preservation works.

Continue exploring and asking questions - that's how great scientists are made!`

    return NextResponse.json({
      success: true,
      insights: fallbackInsights,
      timestamp: new Date().toISOString(),
    })
  }
}

function generateStructuredInsights(request: OsmosisAnalysisRequest): string {
  const { experimentType, data, analysis } = request

  let insights = `## Osmosis Experiment Analysis: ${experimentType.replace("-", " ").toUpperCase()}\n\n`

  // Data overview
  insights += `### Data Overview\n`
  insights += `Your experiment collected ${data.length} data points, providing a comprehensive view of osmosis in action.\n\n`

  // Key findings
  if (analysis.summary) {
    insights += `### Key Findings\n`

    if (analysis.summary.cellSize) {
      const change = analysis.summary.cellSize.change
      if (Math.abs(change) > 5) {
        insights += `- **Cell Size Change**: ${change > 0 ? "Increased" : "Decreased"} by ${Math.abs(change).toFixed(1)}%, indicating ${change > 0 ? "water influx (hypotonic environment)" : "water efflux (hypertonic environment)"}\n`
      }
    }

    if (analysis.summary.equilibriumTime) {
      insights += `- **Equilibrium**: Reached after ${analysis.summary.equilibriumTime} minutes, showing the system's natural tendency to balance\n`
    }

    if (analysis.summary.waterMovement) {
      insights += `- **Water Movement**: Total of ${analysis.summary.waterMovement.total.toFixed(2)} mL moved across the membrane\n`
    }
  }

  // Trends analysis
  if (analysis.trends && analysis.trends.length > 0) {
    insights += `\n### Observed Trends\n`
    analysis.trends.forEach((trend: any) => {
      insights += `- **${trend.metric}**: Shows ${trend.strength} ${trend.direction} trend - ${trend.interpretation}\n`
    })
  }

  // CBC connections
  insights += `\n### CBC Curriculum Connections\n`
  insights += `This experiment directly supports Grade 9 Integrated Science learning outcomes:\n`
  insights += `- Understanding cell membrane transport mechanisms\n`
  insights += `- Analyzing experimental data and drawing conclusions\n`
  insights += `- Connecting scientific concepts to real-world applications\n`

  // Real-world applications
  insights += `\n### Real-World Applications in Kenya\n`
  insights += `- **Agriculture**: Understanding how plants absorb water helps farmers optimize irrigation\n`
  insights += `- **Food Preservation**: Salt and sugar preservation methods work through osmosis\n`
  insights += `- **Medicine**: IV fluid administration relies on osmotic balance\n`
  insights += `- **Water Treatment**: Reverse osmosis is used in water purification systems\n`

  // Learning recommendations
  insights += `\n### Next Steps for Learning\n`
  insights += `- Try varying the concentration gradients to see different effects\n`
  insights += `- Observe different cell types to compare responses\n`
  insights += `- Connect your observations to plant and animal physiology\n`
  insights += `- Research how osmosis affects daily life in your community\n`

  return insights
}
