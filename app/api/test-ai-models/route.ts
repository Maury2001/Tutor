import { NextResponse } from "next/server"
import { getAIService } from "@/lib/ai/ai-service-wrapper"

export async function POST(request: Request) {
  try {
    const { testType } = await request.json()

    const openai = getAIService()
    const groq = getAIService({ apiKey: process.env.GROQ_API_KEY })

    const testResults = {
      timestamp: new Date().toISOString(),
      environment: {
        openai_key: openai.isServiceConfigured(),
        groq_key: groq.isServiceConfigured(),
        node_env: process.env.NODE_ENV,
      },
      tests: {
        openai: { status: "pending", response: null, error: null },
        groq: { status: "pending", response: null, error: null },
        fallback: { status: "pending", response: null, error: null },
      },
    }

    // Test OpenAI
    if (openai.isServiceConfigured()) {
      try {
        const response = await openai.completion({ prompt: 'This is a test. Please respond with "OK".' })
        testResults.tests.openai = { status: "success", response, error: null }
      } catch (error: any) {
        testResults.tests.openai = { status: "error", response: null, error: error.message }
      }
    } else {
      testResults.tests.openai = { status: "not_configured", response: null, error: "OpenAI not configured" }
    }

    // Test Groq
    if (groq.isServiceConfigured()) {
      try {
        const response = await groq.completion({ prompt: 'This is a test. Please respond with "OK".' })
        testResults.tests.groq = { status: "success", response, error: null }
      } catch (error: any) {
        testResults.tests.groq = { status: "error", response: null, error: error.message }
      }
    } else {
      testResults.tests.groq = { status: "not_configured", response: null, error: "Groq not configured" }
    }

    // Test Fallback
    try {
      const response = await getAIService({ apiKey: "invalid-key" }).completion({ prompt: "This is a test." })
      testResults.tests.fallback = { status: "success", response, error: null }
    } catch (error: any) {
      testResults.tests.fallback = { status: "error", response: null, error: error.message }
    }

    // Calculate summary
    const workingServices = Object.values(testResults.tests).filter((test) => test.status === "success").length
    const totalServices = Object.keys(testResults.tests).length
    const healthPercentage = (workingServices / totalServices) * 100

    const summary = {
      working_services: workingServices,
      total_services: totalServices,
      health_percentage: healthPercentage,
      status: healthPercentage === 100 ? "operational" : "degraded",
      recommendations: generateRecommendations(testResults),
    }

    return NextResponse.json({ success: true, results: testResults, summary })
  } catch (error) {
    console.error("Test AI Models route error:", error)
    return NextResponse.json({ success: false, error: "Failed to test AI models" }, { status: 500 })
  }
}

function generateRecommendations(results: any): string[] {
  const recommendations = []

  if (results.tests.openai.status !== "success" && results.environment.openai_key) {
    recommendations.push("Check OpenAI API key and quota.")
  } else if (!results.environment.openai_key) {
    recommendations.push("Configure OpenAI API key.")
  }

  if (results.tests.groq.status !== "success" && results.environment.groq_key) {
    recommendations.push("Check Groq API key and quota.")
  } else if (!results.environment.groq_key) {
    recommendations.push("Configure Groq API key.")
  }

  return recommendations
}
