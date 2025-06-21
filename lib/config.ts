// Simplified configuration for deployment
export const CONFIG = {
  // Environment detection
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isVercel: !!process.env.VERCEL,

  // URLs
  baseUrl:
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),

  // Database
  database: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
  },

  // AI
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-4o",
    temperature: Number.parseFloat(process.env.OPENAI_TEMPERATURE || "0.7"),
    maxTokens: Number.parseInt(process.env.OPENAI_MAX_TOKENS || "2000"),
  },

  // Auth
  auth: {
    secret: process.env.NEXTAUTH_SECRET || "development-secret",
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  },

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  },
}

// Legacy exports for backward compatibility
export const apiConfig = {
  rateLimit: {
    windowMs: 60000,
    max: 100,
  },
  cache: {
    ttl: 300,
    maxSize: 100,
  },
}

export const dbConfig = {
  connectionPoolSize: 20,
  connectionTimeout: 30000,
  statementTimeout: 60000,
  idleTimeout: 60000,
}

export const performanceConfig = {
  enabled: true,
  sampleRate: 0.1,
  logLevel: "error",
}

// Application configuration - REQUIRED EXPORT
export const APP_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
  VERCEL_ENV: process.env.VERCEL_ENV || "development",
  VERCEL_URL: process.env.VERCEL_URL || "localhost:3000",
  PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL || "",
  PORT: process.env.PORT || "3000",
  BASE_URL:
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
}

// Environment detection helpers - REQUIRED EXPORTS
export const IS_PRODUCTION = APP_CONFIG.NODE_ENV === "production" || APP_CONFIG.VERCEL_ENV === "production"
export const IS_DEVELOPMENT =
  APP_CONFIG.NODE_ENV === "development" || APP_CONFIG.VERCEL_ENV === "development" || APP_CONFIG.NODE_ENV === "test"
export const IS_BROWSER = typeof window !== "undefined"
export const IS_SERVER = typeof window === "undefined"

// Additional required exports for backward compatibility
export const NEXTAUTH_URL = APP_CONFIG.BASE_URL
export const PORT = APP_CONFIG.PORT

// Database configuration - REQUIRED EXPORT
export const DATABASE_CONFIG = {
  URL: process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
  DIRECT_URL: process.env.DIRECT_URL || process.env.POSTGRES_URL_NON_POOLING || "",
  USER: process.env.POSTGRES_USER || "postgres",
  PASSWORD: process.env.POSTGRES_PASSWORD || "",
  HOST: process.env.POSTGRES_HOST || "localhost",
  PORT: process.env.POSTGRES_PORT || "5432",
  DATABASE: process.env.POSTGRES_DATABASE || "cbc_tutorbot",
}

// Supabase configuration - REQUIRED EXPORT
export const SUPABASE_CONFIG = {
  URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  JWT_SECRET: process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || "",
}

// OpenAI configuration - REQUIRED EXPORT
export const OPENAI_CONFIG = {
  API_KEY: process.env.OPENAI_API_KEY || "",
  MODEL: process.env.OPENAI_MODEL || "gpt-4o",
  TEMPERATURE: Number.parseFloat(process.env.OPENAI_TEMPERATURE || "0.7"),
  MAX_TOKENS: Number.parseInt(process.env.OPENAI_MAX_TOKENS || "2000", 10),
}

// Groq configuration - REQUIRED EXPORT
export const GROQ_CONFIG = {
  API_KEY: process.env.GROQ_API_KEY || "",
  MODEL: process.env.GROQ_MODEL || "llama3-70b-8192",
}

// Auth configuration - REQUIRED EXPORT
export const AUTH_CONFIG = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "your-development-only-secret",
  NEXTAUTH_URL: NEXTAUTH_URL,
}

// NPM configuration - REQUIRED EXPORT
export const NPM_CONFIG = {
  REGISTRY_URL: process.env.NPM_REGISTRY_URL || "https://registry.npmjs.org/",
  NETWORK_TIMEOUT: process.env.NPM_CONFIG_NETWORK_TIMEOUT || "300000",
  FETCH_RETRIES: process.env.NPM_CONFIG_FETCH_RETRIES || "5",
  FETCH_RETRY_FACTOR: process.env.NPM_CONFIG_FETCH_RETRY_FACTOR || "10",
  FETCH_RETRY_MINTIMEOUT: process.env.NPM_CONFIG_FETCH_RETRY_MINTIMEOUT || "20000",
  FETCH_RETRY_MAXTIMEOUT: process.env.NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT || "120000",
}
