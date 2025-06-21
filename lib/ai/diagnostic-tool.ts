export interface DiagnosticResult {
  success: boolean
  message: string
  details?: any
  timestamp: string
}

export interface DiagnosticReport {
  apiKeyStatus: DiagnosticResult
  networkStatus: DiagnosticResult
  implementationStatus: DiagnosticResult
  databaseStatus: DiagnosticResult
  overallStatus: "healthy" | "degraded" | "critical"
  recommendations: string[]
}

export async function runAIDiagnostics(customApiKey?: string): Promise<DiagnosticReport> {
  const report: DiagnosticReport = {
    apiKeyStatus: {
      success: false,
      message: "Not tested",
      timestamp: new Date().toISOString(),
    },
    networkStatus: {
      success: false,
      message: "Not tested",
      timestamp: new Date().toISOString(),
    },
    implementationStatus: {
      success: false,
      message: "Not tested",
      timestamp: new Date().toISOString(),
    },
    databaseStatus: {
      success: false,
      message: "Not tested",
      timestamp: new Date().toISOString(),
    },
    overallStatus: "critical",
    recommendations: [],
  }

  try {
    // Test API Key
    const apiKey = customApiKey || process.env.OPENAI_API_KEY
    if (!apiKey) {
      report.apiKeyStatus = {
        success: false,
        message: "OpenAI API key not found in environment variables",
        timestamp: new Date().toISOString(),
      }
    } else {
      try {
        const response = await fetch("https://api.openai.com/v1/models", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })

        if (response.ok) {
          report.apiKeyStatus = {
            success: true,
            message: "API key is valid and working",
            timestamp: new Date().toISOString(),
          }
        } else {
          report.apiKeyStatus = {
            success: false,
            message: `API key validation failed: ${response.status} ${response.statusText}`,
            timestamp: new Date().toISOString(),
          }
        }
      } catch (error: any) {
        report.apiKeyStatus = {
          success: false,
          message: `API key test failed: ${error.message}`,
          timestamp: new Date().toISOString(),
        }
      }
    }

    // Test Network Connectivity
    try {
      const networkResponse = await fetch("https://api.openai.com/v1/models", {
        method: "HEAD",
        headers: {
          Authorization: `Bearer ${apiKey || "test"}`,
        },
      })

      report.networkStatus = {
        success: true,
        message: "Network connectivity to OpenAI API is working",
        timestamp: new Date().toISOString(),
      }
    } catch (error: any) {
      report.networkStatus = {
        success: false,
        message: `Network connectivity failed: ${error.message}`,
        timestamp: new Date().toISOString(),
      }
    }

    // Test Implementation
    try {
      // Test if AI SDK is properly configured
      const { generateText } = await import("ai")
      const { openai } = await import("@ai-sdk/openai")

      if (apiKey) {
        const { text } = await generateText({
          model: openai("gpt-3.5-turbo"),
          messages: [{ role: "user", content: "Say 'OK' if you can hear me." }],
          maxTokens: 10,
        })

        report.implementationStatus = {
          success: true,
          message: "AI implementation is working correctly",
          details: { response: text },
          timestamp: new Date().toISOString(),
        }
      } else {
        report.implementationStatus = {
          success: false,
          message: "Cannot test implementation without valid API key",
          timestamp: new Date().toISOString(),
        }
      }
    } catch (error: any) {
      report.implementationStatus = {
        success: false,
        message: `Implementation test failed: ${error.message}`,
        details: { error: error.stack },
        timestamp: new Date().toISOString(),
      }
    }

    // Test Database Status
    try {
      // Test database connection
      const dbUrl = process.env.POSTGRES_URL || process.env.SUPABASE_URL
      if (dbUrl) {
        report.databaseStatus = {
          success: true,
          message: "Database configuration found",
          timestamp: new Date().toISOString(),
        }
      } else {
        report.databaseStatus = {
          success: false,
          message: "No database configuration found",
          timestamp: new Date().toISOString(),
        }
      }
    } catch (error: any) {
      report.databaseStatus = {
        success: false,
        message: `Database test failed: ${error.message}`,
        timestamp: new Date().toISOString(),
      }
    }

    // Determine overall status
    const successCount = [
      report.apiKeyStatus.success,
      report.networkStatus.success,
      report.implementationStatus.success,
      report.databaseStatus.success,
    ].filter(Boolean).length

    if (successCount === 4) {
      report.overallStatus = "healthy"
    } else if (successCount >= 2) {
      report.overallStatus = "degraded"
    } else {
      report.overallStatus = "critical"
    }

    // Generate recommendations
    report.recommendations = generateRecommendations(report)

    return report
  } catch (error: any) {
    console.error("Diagnostic error:", error)
    return {
      ...report,
      overallStatus: "critical",
      recommendations: ["Critical error occurred during diagnostics. Check server logs."],
    }
  }
}

function generateRecommendations(report: DiagnosticReport): string[] {
  const recommendations: string[] = []

  if (!report.apiKeyStatus.success) {
    recommendations.push("Set up a valid OpenAI API key in environment variables")
    recommendations.push("Verify API key has sufficient credits and permissions")
  }

  if (!report.networkStatus.success) {
    recommendations.push("Check internet connectivity and firewall settings")
    recommendations.push("Verify OpenAI API endpoints are accessible")
  }

  if (!report.implementationStatus.success) {
    recommendations.push("Check AI SDK installation and configuration")
    recommendations.push("Verify all required dependencies are installed")
  }

  if (!report.databaseStatus.success) {
    recommendations.push("Configure database connection (Supabase or PostgreSQL)")
    recommendations.push("Verify database credentials and permissions")
  }

  if (recommendations.length === 0) {
    recommendations.push("All systems are functioning normally")
  }

  return recommendations
}

export async function logDiagnosticResult(result: DiagnosticResult, context?: string): Promise<void> {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      success: result.success,
      message: result.message,
      details: result.details,
      context: context || "general",
    }

    // Log to console for development
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Diagnostic Log:", logEntry)
    }

    // In production, you could log to a database or external service
    if (process.env.NODE_ENV === "production") {
      // Example: await logToDatabase(logEntry)
      // Example: await logToExternalService(logEntry)
    }
  } catch (error) {
    console.error("Failed to log diagnostic result:", error)
  }
}
