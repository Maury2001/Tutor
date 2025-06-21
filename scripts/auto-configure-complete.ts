#!/usr/bin/env node

/**
 * Complete Auto-Configuration Script for CBC Tutorbot Platform
 * This script automatically configures the entire system for deployment
 */

console.log("🚀 Starting Complete Auto-Configuration for CBC Tutorbot Platform...\n")

// Environment detection
const isVercel = !!process.env.VERCEL
const isProduction = process.env.NODE_ENV === "production"
const isDevelopment = process.env.NODE_ENV === "development"

console.log(`📍 Environment: ${isProduction ? "Production" : isDevelopment ? "Development" : "Unknown"}`)
console.log(`🌐 Platform: ${isVercel ? "Vercel" : "Local/Other"}`)

// Generate secure secrets
function generateSecret(length = 32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Detect base URL
function detectBaseUrl() {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return "http://localhost:3000"
}

const baseUrl = detectBaseUrl()
console.log(`🔗 Base URL: ${baseUrl}`)

// Configuration object
const config = {
  // Basic settings
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "3000",

  // NextAuth configuration
  NEXTAUTH_URL: baseUrl,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || generateSecret(),

  // Database configuration
  DATABASE_URL:
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    "postgresql://postgres:postgres@localhost:5432/cbc_tutorbot",
  DIRECT_URL: process.env.DIRECT_URL || process.env.POSTGRES_URL_NON_POOLING,
  POSTGRES_URL: process.env.POSTGRES_URL,
  POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
  POSTGRES_HOST: process.env.POSTGRES_HOST || "localhost",
  POSTGRES_PORT: process.env.POSTGRES_PORT || "5432",
  POSTGRES_USER: process.env.POSTGRES_USER || "postgres",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "postgres",
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || "cbc_tutorbot",

  // Supabase configuration
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || generateSecret(),

  // AI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o",
  OPENAI_TEMPERATURE: process.env.OPENAI_TEMPERATURE || "0.7",
  OPENAI_MAX_TOKENS: process.env.OPENAI_MAX_TOKENS || "2000",
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL || "llama3-70b-8192",

  // OAuth Providers
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

  // Redis/Caching
  REDIS_URL: process.env.REDIS_URL,
  KV_URL: process.env.KV_URL,
  KV_REST_API_URL: process.env.KV_REST_API_URL,
  KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
  KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,

  // Vercel specific
  VERCEL: process.env.VERCEL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_REGION: process.env.VERCEL_REGION || "iad1",
  VERCEL_DEPLOYMENT_ID: process.env.VERCEL_DEPLOYMENT_ID,
  VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
  VERCEL_GIT_COMMIT_MESSAGE: process.env.VERCEL_GIT_COMMIT_MESSAGE,
  VERCEL_BUILD_TIME: process.env.VERCEL_BUILD_TIME || new Date().toISOString(),

  // Additional settings
  CI: process.env.CI,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || baseUrl,
  NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,

  // NPM Configuration
  NPM_REGISTRY_URL: process.env.NPM_REGISTRY_URL || "https://registry.npmjs.org/",
  NPM_CONFIG_NETWORK_TIMEOUT: process.env.NPM_CONFIG_NETWORK_TIMEOUT || "300000",
  NPM_CONFIG_FETCH_RETRIES: process.env.NPM_CONFIG_FETCH_RETRIES || "5",
  NPM_CONFIG_LEGACY_PEER_DEPS: "true",
  NPM_CONFIG_FETCH_RETRY_FACTOR: process.env.NPM_CONFIG_FETCH_RETRY_FACTOR || "10",
  NPM_CONFIG_FETCH_RETRY_MINTIMEOUT: process.env.NPM_CONFIG_FETCH_RETRY_MINTIMEOUT || "10000",
  NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT: process.env.NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT || "60000",
}

// Create .env file content
console.log("\n📝 Creating environment configuration...")
const envContent = Object.entries(config)
  .filter(([_, value]) => value !== undefined && value !== null)
  .map(([key, value]) => `${key}="${value}"`)
  .join("\n")

console.log("✅ Environment configuration created")

// Create .env.example file content
console.log("📝 Creating .env.example template...")
const envExampleContent = Object.keys(config)
  .map((key) => {
    if (key.includes("SECRET") || key.includes("KEY") || key.includes("PASSWORD")) {
      return `${key}="your_${key.toLowerCase()}_here"`
    }
    return `${key}="${config[key] || `your_${key.toLowerCase()}_here`}"`
  })
  .join("\n")

console.log("✅ .env.example template created")

// Configuration summary
console.log("\n📊 Configuration Summary:")
console.log("=".repeat(50))

const categories = {
  "🌐 Environment": ["NODE_ENV", "PORT", "NEXTAUTH_URL"],
  "🔐 Authentication": ["NEXTAUTH_SECRET", "GOOGLE_CLIENT_ID", "GITHUB_CLIENT_ID"],
  "🗄️ Database": ["DATABASE_URL", "SUPABASE_URL", "POSTGRES_HOST"],
  "🤖 AI Providers": ["OPENAI_API_KEY", "GROQ_API_KEY"],
  "☁️ Deployment": ["VERCEL", "VERCEL_ENV", "VERCEL_URL"],
  "⚡ Caching": ["REDIS_URL", "KV_URL"],
}

Object.entries(categories).forEach(([category, keys]) => {
  console.log(`\n${category}:`)
  keys.forEach((key) => {
    const value = config[key]
    const status = value ? "✅" : "❌"
    const displayValue = value
      ? key.includes("SECRET") || key.includes("KEY") || key.includes("PASSWORD")
        ? "***configured***"
        : value.length > 50
          ? value.substring(0, 47) + "..."
          : value
      : "Not configured"
    console.log(`  ${status} ${key}: ${displayValue}`)
  })
})

// Recommendations
console.log("\n💡 Recommendations:")
console.log("=".repeat(50))

const recommendations = []

if (!config.OPENAI_API_KEY) {
  recommendations.push("🔑 Add OPENAI_API_KEY for AI functionality")
}

if (!config.GROQ_API_KEY) {
  recommendations.push("🔑 Add GROQ_API_KEY for alternative AI provider")
}

if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
  recommendations.push("🔐 Configure Google OAuth for authentication")
}

if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
  recommendations.push("🗄️ Set up Supabase for database and auth")
}

if (!config.REDIS_URL && !config.KV_URL) {
  recommendations.push("⚡ Add Redis/KV for caching and performance")
}

if (recommendations.length === 0) {
  console.log("🎉 All major configurations are set up!")
} else {
  recommendations.forEach((rec) => console.log(`  ${rec}`))
}

// Next steps
console.log("\n🚀 Next Steps:")
console.log("=".repeat(50))
console.log("1. 📋 Review the configuration summary above")
console.log("2. 🔑 Add any missing API keys to your environment")
console.log("3. 🧪 Run verification to check status")
console.log("4. 🗄️ Set up database connections")
console.log("5. 🚀 Start development or deploy")

console.log("\n✨ Auto-configuration complete!")
console.log("🎯 Your CBC Tutorbot Platform is ready to configure!")

// Output the configuration for use
console.log("\n" + "=".repeat(60))
console.log("ENVIRONMENT CONFIGURATION:")
console.log("=".repeat(60))
console.log(envContent)
console.log("=".repeat(60))
