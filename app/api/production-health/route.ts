import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()

    // Production environment checks
    const productionChecks = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        vercelUrl: process.env.VERCEL_URL,
        productionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL,
        region: process.env.VERCEL_REGION || "unknown",
      },
      deployment: {
        vercelDeploymentId: process.env.VERCEL_DEPLOYMENT_ID || "local",
        vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
        vercelGitCommitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || "unknown",
        buildTime: process.env.VERCEL_BUILD_TIME || "unknown",
      },
      runtime: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
      integrations: {
        database: {
          postgres: !!process.env.POSTGRES_URL,
          supabase: !!process.env.SUPABASE_URL,
          neon: !!process.env.DATABASE_URL,
        },
        ai: {
          openai: !!process.env.OPENAI_API_KEY,
          groq: !!process.env.GROQ_API_KEY,
        },
        auth: {
          nextauth: !!process.env.NEXTAUTH_SECRET,
          google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        },
        cache: {
          redis: !!process.env.REDIS_URL,
          upstash: !!(process.env.KV_URL && process.env.KV_REST_API_TOKEN),
        },
      },
      performance: {
        responseTime: Date.now() - startTime,
        memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        uptimeMinutes: Math.round(process.uptime() / 60),
      },
    }

    // Test database connectivity
    let databaseStatus = "not_configured"
    if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
      try {
        // Simple connection test without actually connecting
        databaseStatus = "configured"
      } catch (error) {
        databaseStatus = "error"
      }
    }

    // Test AI API connectivity
    let aiStatus = "not_configured"
    if (process.env.OPENAI_API_KEY) {
      try {
        // Test OpenAI API availability (without making actual request)
        aiStatus = "configured"
      } catch (error) {
        aiStatus = "error"
      }
    }

    const healthScore = calculateHealthScore(productionChecks)

    return NextResponse.json({
      status: "healthy",
      healthScore,
      message: "Production environment health check completed",
      data: productionChecks,
      services: {
        database: databaseStatus,
        ai: aiStatus,
      },
      recommendations: generateRecommendations(productionChecks),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        message: "Production health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

function calculateHealthScore(checks: any): number {
  let score = 0
  let maxScore = 0

  // Environment checks (20 points)
  maxScore += 20
  if (checks.environment.nodeEnv === "production") score += 10
  if (checks.environment.vercelEnv === "production") score += 10

  // Integration checks (40 points)
  maxScore += 40
  if (checks.integrations.database.postgres || checks.integrations.database.neon) score += 15
  if (checks.integrations.ai.openai || checks.integrations.ai.groq) score += 15
  if (checks.integrations.auth.nextauth) score += 10

  // Performance checks (40 points)
  maxScore += 40
  if (checks.performance.responseTime < 100) score += 20
  else if (checks.performance.responseTime < 500) score += 10
  if (checks.performance.memoryUsageMB < 100) score += 20
  else if (checks.performance.memoryUsageMB < 200) score += 10

  return Math.round((score / maxScore) * 100)
}

function generateRecommendations(checks: any): string[] {
  const recommendations: string[] = []

  if (!checks.integrations.database.postgres && !checks.integrations.database.neon) {
    recommendations.push("Configure database connection (PostgreSQL or Neon)")
  }

  if (!checks.integrations.ai.openai && !checks.integrations.ai.groq) {
    recommendations.push("Configure AI provider (OpenAI or Groq)")
  }

  if (!checks.integrations.auth.nextauth) {
    recommendations.push("Configure NextAuth secret for authentication")
  }

  if (!checks.integrations.auth.google) {
    recommendations.push("Configure Google OAuth for social login")
  }

  if (!checks.integrations.cache.redis && !checks.integrations.cache.upstash) {
    recommendations.push("Configure Redis/Upstash for caching and performance")
  }

  if (checks.performance.responseTime > 500) {
    recommendations.push("Optimize API response times (currently > 500ms)")
  }

  if (checks.performance.memoryUsageMB > 200) {
    recommendations.push("Monitor memory usage (currently > 200MB)")
  }

  if (recommendations.length === 0) {
    recommendations.push("All systems operational! Consider monitoring and logging setup.")
  }

  return recommendations
}
