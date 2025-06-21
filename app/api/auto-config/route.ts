import { NextResponse } from "next/server"
import { CONFIG } from "@/lib/auto-config"

export async function GET() {
  // Create a safe version of the config without sensitive information
  const safeConfig = {
    env: CONFIG.env,
    baseUrl: CONFIG.baseUrl,
    nextAuth: {
      url: CONFIG.nextAuth.url,
    },
    database: {
      host: CONFIG.database.host,
      port: CONFIG.database.port,
      database: CONFIG.database.database,
      configured: !!CONFIG.database.url,
    },
    ai: {
      openai: {
        model: CONFIG.ai.openai.model,
        temperature: CONFIG.ai.openai.temperature,
        maxTokens: CONFIG.ai.openai.maxTokens,
        configured: !!CONFIG.ai.openai.apiKey,
      },
      groq: {
        model: CONFIG.ai.groq.model,
        configured: !!CONFIG.ai.groq.apiKey,
      },
    },
    authProviders: {
      google: {
        enabled: CONFIG.authProviders.google.enabled,
      },
      github: {
        enabled: CONFIG.authProviders.github.enabled,
      },
    },
    supabase: {
      configured: !!(CONFIG.supabase.url && CONFIG.supabase.anonKey),
    },
    deployment: CONFIG.deployment,
    packageManager: CONFIG.packageManager,
  }

  return NextResponse.json(safeConfig)
}
