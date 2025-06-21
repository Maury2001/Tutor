import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const diagnosticResults = {
      timestamp: new Date().toISOString(),
      environment: {
        openai_configured: !!process.env.OPENAI_API_KEY,
        groq_configured: !!process.env.GROQ_API_KEY,
        node_env: process.env.NODE_ENV,
        vercel_env: process.env.VERCEL_ENV,
      },
      tests: {
        openai: { status: "pending", error: null, response: null },
        groq: { status: "pending", error: null, response: null },
        agents: [],
      },
    }

    // Test OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        const openaiResponse = await fetch("https://api.openai.com/v1/models", {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        })

        if (openaiResponse.ok) {
          const data = await openaiResponse.json()
          diagnosticResults.tests.openai = {
            status: "success",
            error: null,
            response: `Found ${data.data?.length || 0} models available`,
          }
        } else {
          diagnosticResults.tests.openai = {
            status: "error",
            error: `HTTP ${openaiResponse.status}: ${openaiResponse.statusText}`,
            response: null,
          }
        }
      } catch (error) {
        diagnosticResults.tests.openai = {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          response: null,
        }
      }
    } else {
      diagnosticResults.tests.openai = {
        status: "error",
        error: "OPENAI_API_KEY not configured",
        response: null,
      }
    }

    // Test Groq
    if (process.env.GROQ_API_KEY) {
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/models", {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        })

        if (groqResponse.ok) {
          const data = await groqResponse.json()
          diagnosticResults.tests.groq = {
            status: "success",
            error: null,
            response: `Found ${data.data?.length || 0} models available`,
          }
        } else {
          diagnosticResults.tests.groq = {
            status: "error",
            error: `HTTP ${groqResponse.status}: ${groqResponse.statusText}`,
            response: null,
          }
        }
      } catch (error) {
        diagnosticResults.tests.groq = {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          response: null,
        }
      }
    } else {
      diagnosticResults.tests.groq = {
        status: "error",
        error: "GROQ_API_KEY not configured",
        response: null,
      }
    }

    // Test AI Agents (internal endpoints)
    const agentEndpoints = [
      "/api/ai/adaptive-learning",
      "/api/ai/assessment-creator",
      "/api/ai/content-generation",
      "/api/ai/diagnostic",
      "/api/ai/smart-tutoring",
    ]

    for (const endpoint of agentEndpoints) {
      try {
        const agentResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test: true, message: "Health check" }),
        })

        diagnosticResults.tests.agents.push({
          endpoint,
          status: agentResponse.ok ? "success" : "error",
          error: agentResponse.ok ? null : `HTTP ${agentResponse.status}`,
          response: agentResponse.ok ? "Endpoint responsive" : null,
        })
      } catch (error) {
        diagnosticResults.tests.agents.push({
          endpoint,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          response: null,
        })
      }
    }

    // Calculate overall health
    const openaiHealthy = diagnosticResults.tests.openai.status === "success"
    const groqHealthy = diagnosticResults.tests.groq.status === "success"
    const agentsHealthy = diagnosticResults.tests.agents.filter((a) => a.status === "success").length
    const totalAgents = diagnosticResults.tests.agents.length

    const overallHealth = {
      status: (openaiHealthy || groqHealthy) && agentsHealthy > 0 ? "healthy" : "degraded",
      score: Math.round((((openaiHealthy ? 1 : 0) + (groqHealthy ? 1 : 0) + agentsHealthy / totalAgents) / 3) * 100),
      summary: `${openaiHealthy ? "OpenAI ✅" : "OpenAI ❌"} | ${groqHealthy ? "Groq ✅" : "Groq ❌"} | Agents: ${agentsHealthy}/${totalAgents}`,
    }

    return NextResponse.json({
      success: true,
      diagnostics: diagnosticResults,
      health: overallHealth,
      recommendations: generateRecommendations(diagnosticResults),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        diagnostics: null,
      },
      { status: 500 },
    )
  }
}

function generateRecommendations(results: any): string[] {
  const recommendations = []

  if (results.tests.openai.status === "error") {
    recommendations.push("🔧 Configure OPENAI_API_KEY environment variable")
    recommendations.push("💳 Verify OpenAI account has sufficient credits")
  }

  if (results.tests.groq.status === "error") {
    recommendations.push("🔧 Configure GROQ_API_KEY environment variable")
    recommendations.push("🔑 Verify Groq API key is valid and active")
  }

  const failedAgents = results.tests.agents.filter((a: any) => a.status === "error")
  if (failedAgents.length > 0) {
    recommendations.push(`🔧 Fix ${failedAgents.length} AI agent endpoints`)
    recommendations.push("🌐 Check internal API routing and middleware")
  }

  if (!results.environment.openai_configured && !results.environment.groq_configured) {
    recommendations.push("⚠️ No AI providers configured - system will not function")
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ All systems operational - no action needed")
  }

  return recommendations
}

export async function GET() {
  return NextResponse.json({
    message: "AI Diagnostic endpoint ready",
    usage: "POST to run comprehensive diagnostics",
  })
}
