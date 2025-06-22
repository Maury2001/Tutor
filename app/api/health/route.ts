import type { NextRequest } from "next/server";
import { handleApiError, createApiResponse } from "@/lib/utils/error-handler";
import { config, validateConfig } from "@/lib/config/environment";
import { dbConnection } from "@/lib/db/connection";

export async function GET(request: NextRequest) {
  try {
    const configValidation = validateConfig();
    const dbConnectionTest = await dbConnection.testConnection();

    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isProduction: config.isProduction,
        isDevelopment: config.isDevelopment,
        isVercel: config.isVercel,
      },
      services: {
        database: {
          connected: dbConnectionTest,
          url: config.database.url ? "configured" : "missing",
        },
        supabase: {
          configured: !!(config.supabase.url && config.supabase.anonKey),
          url: config.supabase.url ? "configured" : "missing",
        },
        ai: {
          openai: config.ai.openai.apiKey ? "configured" : "missing",
          groq: config.ai.groq.apiKey ? "configured" : "missing",
        },
        redis: {
          configured: !!(config.redis.url || config.redis.restApiUrl),
        },
        auth: {
          configured: !!config.auth.nextAuthSecret,
        },
      },
      config: {
        valid: configValidation.isValid,
        errors: configValidation.errors,
      },
    };
    console.log("🔍 OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
    console.log("🔍 config.ai.openai.apiKey:", config.ai.openai.apiKey);
    return createApiResponse(healthData);
  } catch (error) {
    return handleApiError(error);
  }
}
