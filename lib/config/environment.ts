// Environment configuration with proper validation

export const config = {
  // Database
  database: {
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL || "",
    prismaUrl: process.env.POSTGRES_PRISMA_URL || "postgres://85bfdfd082b18a7cfb2c6a15aba7a27e6191f6c8c4c4fe42ee9f77fdc5d305f8:sk_iGRCzn32yVmUt3TG-jA6I@db.prisma.io:5432/?sslmode=require",
    nonPoolingUrl: process.env.POSTGRES_URL_NON_POOLING || "",
    host: process.env.POSTGRES_HOST || "localhost",
    user: process.env.POSTGRES_USER || "",
    password: process.env.POSTGRES_PASSWORD || "",
    database: process.env.POSTGRES_DATABASE || "",
  },

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    jwtSecret: process.env.SUPABASE_JWT_SECRET || "",
  },

  // AI Services
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
      model: process.env.OPENAI_MODEL || "gpt-4",
      temperature: Number.parseFloat(process.env.OPENAI_TEMPERATURE || "0.7"),
      maxTokens: Number.parseInt(process.env.OPENAI_MAX_TOKENS || "2000"),
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY || "",
      model: process.env.GROQ_MODEL || "mixtral-8x7b-32768",
    },
  },

  // Redis/Upstash
  redis: {
    url: process.env.KV_URL || process.env.REDIS_URL || "",
    restApiUrl: process.env.KV_REST_API_URL || "",
    restApiToken: process.env.KV_REST_API_TOKEN || "",
    restApiReadOnlyToken: process.env.KV_REST_API_READ_ONLY_TOKEN || "",
  },

  // Auth
  auth: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "",
    nextAuthUrl: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "",
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    githubClientId: process.env.GITHUB_CLIENT_ID || "",
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  },

  // App
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    cdnUrl: process.env.NEXT_PUBLIC_CDN_URL || "",
    port: Number.parseInt(process.env.PORT || "3000"),
  },

  // Vercel
  vercel: {
    projectProductionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL || "",
    region: process.env.VERCEL_REGION || "",
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID || "",
    gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || "",
    gitCommitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || "",
    buildTime: process.env.VERCEL_BUILD_TIME || "",
  },

  // Cloud Providers
  cloud: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      sagemakerRoleArn: process.env.AWS_SAGEMAKER_ROLE_ARN || "",
    },
    google: {
      cloudApiKey: process.env.GOOGLE_CLOUD_API_KEY || "",
    },
    runpod: {
      apiKey: process.env.RUNPOD_API_KEY || "",
    },
    vast: {
      apiKey: process.env.VAST_API_KEY || "",
    },
  },

  // Package Management
  npm: {
    registryUrl: process.env.NPM_REGISTRY_URL || "https://registry.npmjs.org/",
    yarnRegistry: process.env.YARN_REGISTRY || "https://registry.yarnpkg.com/",
    networkTimeout: Number.parseInt(process.env.NPM_CONFIG_NETWORK_TIMEOUT || "60000"),
    fetchRetries: Number.parseInt(process.env.NPM_CONFIG_FETCH_RETRIES || "2"),
    fetchRetryFactor: Number.parseInt(process.env.NPM_CONFIG_FETCH_RETRY_FACTOR || "10"),
    fetchRetryMinTimeout: Number.parseInt(process.env.NPM_CONFIG_FETCH_RETRY_MINTIMEOUT || "10000"),
    fetchRetryMaxTimeout: Number.parseInt(process.env.NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT || "60000"),
  },

  // Custom
  custom: {
    key: process.env.CUSTOM_KEY || "",
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  isVercel: !!process.env.VERCEL,
  isCi: !!process.env.CI,
}

// Validation function
export function validateConfig() {
  const errors: string[] = []

  // Required environment variables
  const required = [
    { key: "POSTGRES_URL", value: config.database.url },
    { key: "SUPABASE_URL", value: config.supabase.url },
    { key: "SUPABASE_ANON_KEY", value: config.supabase.anonKey },
    { key: "NEXTAUTH_SECRET", value: config.auth.nextAuthSecret },
  ]

  required.forEach(({ key, value }) => {
    if (!value) {
      errors.push(`Missing required environment variable: ${key}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
  
}

export default config
