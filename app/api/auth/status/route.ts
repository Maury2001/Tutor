import { NextResponse } from "next/server"
import { APP_CONFIG } from "@/lib/config"

/**
 * API route to check authentication configuration status
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    config: {
      baseUrl: APP_CONFIG.baseUrl,
      nextAuthUrl: APP_CONFIG.nextAuthUrl,
      environment: APP_CONFIG.environment,
      port: APP_CONFIG.port,
      googleOAuth: {
        enabled: APP_CONFIG.googleOAuth.enabled,
        redirectUri: APP_CONFIG.googleOAuth.redirectUri,
      },
      database: {
        enabled: APP_CONFIG.database.enabled,
      },
    },
    timestamp: new Date().toISOString(),
  })
}
