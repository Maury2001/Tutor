import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const varName = searchParams.get("var")

    if (!varName) {
      return NextResponse.json({ error: "Variable name required" }, { status: 400 })
    }

    // Check multiple possible variable names
    const possibleNames = [varName, `NEXT_PUBLIC_${varName}`, varName.replace("NEXT_PUBLIC_", "")]

    let value = null
    let foundName = null

    for (const name of possibleNames) {
      if (process.env[name]) {
        value = process.env[name]
        foundName = name
        break
      }
    }

    const exists = !!value
    const masked =
      exists && value
        ? `${value.substring(0, 4)}${"*".repeat(Math.max(0, value.length - 8))}${value.substring(Math.max(4, value.length - 4))}`
        : null

    return NextResponse.json({
      variable: varName,
      exists,
      foundAs: foundName,
      masked,
      details: exists
        ? `Found as ${foundName} (${value?.length || 0} characters)`
        : `Not found. Checked: ${possibleNames.join(", ")}`,
    })
  } catch (error) {
    console.error("Config check error:", error)
    return NextResponse.json({ error: "Failed to check configuration" }, { status: 500 })
  }
}

// Health check for the config checker itself
export async function POST() {
  try {
    const criticalVars = [
      "DATABASE_URL",
      "POSTGRES_URL",
      "SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "OPENAI_API_KEY",
      "NEXTAUTH_SECRET",
    ]

    const results = criticalVars.map((varName) => {
      const value = process.env[varName] || process.env[`NEXT_PUBLIC_${varName}`]
      return {
        name: varName,
        exists: !!value,
        length: value?.length || 0,
      }
    })

    const missingCritical = results.filter((r) => !r.exists)
    const hasAllCritical = missingCritical.length === 0

    return NextResponse.json({
      status: hasAllCritical ? "healthy" : "unhealthy",
      criticalVariables: results,
      missing: missingCritical.map((r) => r.name),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV,
      },
    })
  } catch (error) {
    console.error("Config health check error:", error)
    return NextResponse.json({ error: "Health check failed" }, { status: 500 })
  }
}
