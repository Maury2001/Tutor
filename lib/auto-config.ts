/**
 * Auto Configuration System for CBC Tutorbot Platform
 *
 * This module automatically detects and configures all necessary
 * environment variables and settings for the application.
 */

import { randomBytes } from "crypto"

// Environment detection
export const ENV = {
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_TEST: process.env.NODE_ENV === "test",
  IS_VERCEL: !!process.env.VERCEL,
  IS_PREVIEW: process.env.VERCEL_ENV === "preview",
}

// Base URL detection
export function detectBaseUrl(): string {
  // For client-side, use window.location
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  // Priority 1: Explicitly set NEXTAUTH_URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  // Priority 2: Vercel deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Priority 3: Custom domain (if set)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  // Priority 4: Development fallback with auto-detected port
  const port = Number.parseInt(process.env.PORT || "3000", 10)
  return `http://localhost:${port}`
}

// Generate a secure random string for secrets
export function generateSecureSecret(length = 32): string {
  return randomBytes(length).toString("hex")
}

// Auto-configure NextAuth
export function configureNextAuth() {
  const baseUrl = detectBaseUrl()

  // Set NEXTAUTH_URL if not already set (server-side only)
  if (typeof window === "undefined" && !process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = baseUrl
    console.log(`🔧 Auto-configured NEXTAUTH_URL: ${baseUrl}`)
  }

  // Generate a secure secret for development if not set
  if (typeof window === "undefined" && ENV.IS_DEVELOPMENT && !process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = generateSecureSecret()
    console.log(`🔧 Auto-generated NEXTAUTH_SECRET for development`)
  }

  return {
    url: baseUrl,
    secret: process.env.NEXTAUTH_SECRET,
  }
}

// Auto-configure database
export function configureDatabase() {
  // Detect database URL
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    (ENV.IS_DEVELOPMENT ? "postgresql://postgres:postgres@localhost:5432/cbc_tutorbot" : undefined)

  // Set DATABASE_URL if not already set (server-side only)
  if (typeof window === "undefined" && ENV.IS_DEVELOPMENT && !process.env.DATABASE_URL && databaseUrl) {
    process.env.DATABASE_URL = databaseUrl
    console.log(`🔧 Auto-configured DATABASE_URL for development`)
  }

  return {
    url: databaseUrl,
    directUrl: process.env.DIRECT_URL || process.env.POSTGRES_URL_NON_POOLING,
    host: process.env.POSTGRES_HOST || "localhost",
    port: process.env.POSTGRES_PORT || "5432",
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DATABASE || "cbc_tutorbot",
  }
}

// Auto-configure AI providers
export function configureAI() {
  return {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-4o",
      temperature: Number(process.env.OPENAI_TEMPERATURE || "0.7"),
      maxTokens: Number(process.env.OPENAI_MAX_TOKENS || "2000"),
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || "llama3-70b-8192",
    },
  }
}

// Auto-configure authentication providers
export function configureAuthProviders() {
  return {
    google: {
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  }
}

// Auto-configure Supabase
export function configureSupabase() {
  return {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    jwtSecret: process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET,
  }
}

// Auto-configure deployment
export function configureDeployment() {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL,
    port: process.env.PORT || "3000",
  }
}

// Auto-configure package manager
export function configurePackageManager() {
  return {
    registry: process.env.NPM_REGISTRY_URL || process.env.YARN_REGISTRY || "https://registry.npmjs.org/",
    networkTimeout: process.env.NPM_CONFIG_NETWORK_TIMEOUT || "300000",
    fetchRetries: process.env.NPM_CONFIG_FETCH_RETRIES || "5",
  }
}

// Main auto-configuration function
export function autoConfig() {
  const config = {
    env: ENV,
    baseUrl: detectBaseUrl(),
    nextAuth: configureNextAuth(),
    database: configureDatabase(),
    ai: configureAI(),
    authProviders: configureAuthProviders(),
    supabase: configureSupabase(),
    deployment: configureDeployment(),
    packageManager: configurePackageManager(),
  }

  // Log configuration in development (server-side only)
  if (typeof window === "undefined" && ENV.IS_DEVELOPMENT) {
    console.log("🚀 CBC Tutorbot Platform Auto-Configuration:")
    console.log(`   Environment: ${config.env.IS_PRODUCTION ? "Production" : "Development"}`)
    console.log(`   Base URL: ${config.baseUrl}`)
    console.log(`   NextAuth URL: ${config.nextAuth.url}`)
    console.log(`   Google OAuth: ${config.authProviders.google.enabled ? "✅ Enabled" : "❌ Disabled"}`)
    console.log(`   Database: ${config.database.url ? "✅ Configured" : "❌ Not configured"}`)
    console.log(`   OpenAI: ${config.ai.openai.apiKey ? "✅ Configured" : "❌ Not configured"}`)
    console.log(`   Groq: ${config.ai.groq.apiKey ? "✅ Configured" : "❌ Not configured"}`)
  }

  return config
}

// Export the auto-configured settings
export const CONFIG = autoConfig()

// Export individual configurations for backward compatibility
export const apiConfig = {
  rateLimit: {
    windowMs: 60000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
  },
  cache: {
    ttl: 300, // 5 minutes
    maxSize: 100, // 100 items
  },
}

export const dbConfig = {
  connectionPoolSize: 20,
  connectionTimeout: 30000, // 30 seconds
  statementTimeout: 60000, // 60 seconds
  idleTimeout: 60000, // 60 seconds
}

export const performanceConfig = {
  enabled: true,
  sampleRate: 0.1, // 10% of requests
  logLevel: "error",
}
