import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { globalAIConfig } from "@/lib/ai/global-config"
import { isAdmin } from "@/lib/admin-auth"
import { getServerSession } from "next-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user || !isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const supabase = createClient()

    // Get all global config
    const { data: configs, error: configError } = await supabase
      .from("global_ai_config")
      .select("*")
      .order("category, config_key")

    if (configError) {
      throw new Error(`Failed to fetch configs: ${configError.message}`)
    }

    // Get provider configs
    const { data: providers, error: providerError } = await supabase
      .from("ai_provider_config")
      .select("*")
      .order("priority")

    if (providerError) {
      throw new Error(`Failed to fetch providers: ${providerError.message}`)
    }

    // Get usage stats
    const usageStats = await globalAIConfig.getUsageStats()

    // Get daily cost info
    const costInfo = await globalAIConfig.checkDailyCostLimit()

    return NextResponse.json({
      configs: configs || [],
      providers: providers || [],
      usageStats,
      costInfo,
      success: true,
    })
  } catch (error: any) {
    console.error("Error fetching AI config:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch AI configuration" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user || !isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { configs, reason } = await request.json()

    if (!configs || !Array.isArray(configs)) {
      return NextResponse.json({ error: "Invalid config data" }, { status: 400 })
    }

    // Update each config
    for (const config of configs) {
      await globalAIConfig.setConfig(config.key, config.value, session.user.id, reason || "Admin update")
    }

    return NextResponse.json({
      message: "Configuration updated successfully",
      success: true,
    })
  } catch (error: any) {
    console.error("Error updating AI config:", error)
    return NextResponse.json({ error: error.message || "Failed to update AI configuration" }, { status: 500 })
  }
}
