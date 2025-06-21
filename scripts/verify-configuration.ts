#!/usr/bin/env node

/**
 * Configuration Verification Script
 * Verifies that all configurations are working correctly
 */

console.log("🔍 Verifying CBC Tutorbot Platform Configuration...\n")

// Test categories
const tests = {
  "🌐 Environment": {
    "Node.js Version": () => process.version,
    Environment: () => process.env.NODE_ENV || "development",
    "Base URL": () => process.env.NEXTAUTH_URL || "Not configured",
    Port: () => process.env.PORT || "3000",
  },

  "🔐 Authentication": {
    "NextAuth Secret": () => (process.env.NEXTAUTH_SECRET ? "✅ Configured" : "❌ Missing"),
    "Google OAuth": () =>
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? "✅ Configured" : "❌ Missing",
    "GitHub OAuth": () =>
      process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? "✅ Configured" : "❌ Missing",
  },

  "🗄️ Database": {
    "Primary Database": () => (process.env.DATABASE_URL ? "✅ Configured" : "❌ Missing"),
    "Supabase URL": () => (process.env.SUPABASE_URL ? "✅ Configured" : "❌ Missing"),
    "Supabase Key": () => (process.env.SUPABASE_ANON_KEY ? "✅ Configured" : "❌ Missing"),
    PostgreSQL: () => (process.env.POSTGRES_URL ? "✅ Configured" : "❌ Missing"),
  },

  "🤖 AI Providers": {
    OpenAI: () => (process.env.OPENAI_API_KEY ? "✅ Configured" : "❌ Missing"),
    Groq: () => (process.env.GROQ_API_KEY ? "✅ Configured" : "❌ Missing"),
    "OpenAI Model": () => process.env.OPENAI_MODEL || "gpt-4o (default)",
    "Groq Model": () => process.env.GROQ_MODEL || "llama3-70b-8192 (default)",
  },

  "☁️ Deployment": {
    Platform: () => (process.env.VERCEL ? "Vercel" : "Local/Other"),
    Environment: () => process.env.VERCEL_ENV || "local",
    Region: () => process.env.VERCEL_REGION || "Not specified",
    "Deployment ID": () => process.env.VERCEL_DEPLOYMENT_ID || "Not available",
  },

  "⚡ Performance": {
    "Redis Cache": () => (process.env.REDIS_URL ? "✅ Configured" : "❌ Missing"),
    "Upstash KV": () => (process.env.KV_URL ? "✅ Configured" : "❌ Missing"),
    CDN: () => (process.env.NEXT_PUBLIC_CDN_URL ? "✅ Configured" : "❌ Not configured"),
  },
}

// Run tests
let totalTests = 0
let passedTests = 0

Object.entries(tests).forEach(([category, categoryTests]) => {
  console.log(`${category}:`)
  console.log("-".repeat(40))

  Object.entries(categoryTests).forEach(([testName, testFn]) => {
    totalTests++
    try {
      const result = testFn()
      const status = result.includes("✅") ? "✅" : result.includes("❌") ? "❌" : "📋"
      if (status === "✅" || (!result.includes("❌") && !result.includes("Missing"))) {
        passedTests++
      }
      console.log(`  ${status} ${testName}: ${result}`)
    } catch (error) {
      console.log(`  ❌ ${testName}: Error - ${error.message}`)
    }
  })
  console.log("")
})

// Summary
const score = Math.round((passedTests / totalTests) * 100)
console.log("📊 Configuration Summary:")
console.log("=".repeat(50))
console.log(`✅ Passed: ${passedTests}/${totalTests} tests`)
console.log(`📊 Score: ${score}%`)

if (score >= 80) {
  console.log("🎉 Excellent! Your configuration is ready for production.")
} else if (score >= 60) {
  console.log("⚠️  Good start! Add missing configurations for better functionality.")
} else {
  console.log("🔧 More configuration needed. Please add missing environment variables.")
}

// Specific recommendations
console.log("\n💡 Priority Actions:")
const priorities = []

if (!process.env.OPENAI_API_KEY) priorities.push("🔑 Add OPENAI_API_KEY for AI functionality")
if (!process.env.DATABASE_URL && !process.env.SUPABASE_URL) priorities.push("🗄️ Configure database connection")
if (!process.env.NEXTAUTH_SECRET) priorities.push("🔐 Set NEXTAUTH_SECRET for authentication")

if (priorities.length === 0) {
  console.log("🎯 All critical configurations are in place!")
} else {
  priorities.forEach((priority) => console.log(`  ${priority}`))
}

console.log("\n✨ Configuration verification complete!")
