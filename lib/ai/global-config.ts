import { createClient } from "@/lib/supabase/server"

export interface GlobalAIConfig {
  id: number
  config_key: string
  config_value: any
  description?: string
  category: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AIProviderConfig {
  id: number
  provider_name: string
  is_enabled: boolean
  priority: number
  config: any
  rate_limit: number
  cost_per_token: number
}

export interface AIUsageLog {
  id: number
  user_id: string
  session_id?: string
  model_used: string
  provider: string
  tokens_used: number
  cost: number
  response_time_ms?: number
  success: boolean
  error_message?: string
  created_at: string
}

export class GlobalAIConfigManager {
  private static instance: GlobalAIConfigManager
  private configCache: Map<string, any> = new Map()
  private lastCacheUpdate = 0
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  static getInstance(): GlobalAIConfigManager {
    if (!GlobalAIConfigManager.instance) {
      GlobalAIConfigManager.instance = new GlobalAIConfigManager()
    }
    return GlobalAIConfigManager.instance
  }

  async getConfig(key: string, defaultValue?: any): Promise<any> {
    await this.refreshCacheIfNeeded()
    return this.configCache.get(key) ?? defaultValue
  }

  async getAllConfig(): Promise<Record<string, any>> {
    await this.refreshCacheIfNeeded()
    return Object.fromEntries(this.configCache)
  }

  async setConfig(key: string, value: any, userId?: string, reason?: string): Promise<void> {
    const supabase = createClient()

    // Get current value for history
    const { data: currentConfig } = await supabase
      .from("global_ai_config")
      .select("config_value")
      .eq("config_key", key)
      .single()

    // Update the config
    const { error } = await supabase.from("global_ai_config").upsert({
      config_key: key,
      config_value: value,
      updated_by: userId,
    })

    if (error) {
      throw new Error(`Failed to update config: ${error.message}`)
    }

    // Log the change
    if (currentConfig && userId) {
      await supabase.from("ai_config_history").insert({
        config_key: key,
        old_value: currentConfig.config_value,
        new_value: value,
        changed_by: userId,
        change_reason: reason,
      })
    }

    // Clear cache to force refresh
    this.configCache.clear()
    this.lastCacheUpdate = 0
  }

  async getProviderConfigs(): Promise<AIProviderConfig[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("ai_provider_config")
      .select("*")
      .eq("is_enabled", true)
      .order("priority")

    if (error) {
      throw new Error(`Failed to get provider configs: ${error.message}`)
    }

    return data || []
  }

  async logUsage(usage: Omit<AIUsageLog, "id" | "created_at">): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from("ai_usage_logs").insert(usage)

    if (error) {
      console.error("Failed to log AI usage:", error)
      // Don't throw error to avoid breaking the main flow
    }
  }

  async getUsageStats(userId?: string, days = 7): Promise<any> {
    const supabase = createClient()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    let query = supabase.from("ai_usage_logs").select("*").gte("created_at", startDate.toISOString())

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to get usage stats: ${error.message}`)
    }

    return this.processUsageStats(data || [])
  }

  private async refreshCacheIfNeeded(): Promise<void> {
    const now = Date.now()
    if (now - this.lastCacheUpdate < this.CACHE_TTL && this.configCache.size > 0) {
      return
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from("global_ai_config")
      .select("config_key, config_value")
      .eq("is_active", true)

    if (error) {
      console.error("Failed to refresh AI config cache:", error)
      return
    }

    this.configCache.clear()
    data?.forEach((item) => {
      this.configCache.set(item.config_key, item.config_value)
    })

    this.lastCacheUpdate = now
  }

  private processUsageStats(logs: AIUsageLog[]): any {
    const stats = {
      totalRequests: logs.length,
      totalTokens: logs.reduce((sum, log) => sum + log.tokens_used, 0),
      totalCost: logs.reduce((sum, log) => sum + log.cost, 0),
      averageResponseTime: logs.reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / logs.length,
      successRate: (logs.filter((log) => log.success).length / logs.length) * 100,
      modelUsage: {} as Record<string, number>,
      providerUsage: {} as Record<string, number>,
      dailyUsage: {} as Record<string, number>,
    }

    logs.forEach((log) => {
      // Model usage
      stats.modelUsage[log.model_used] = (stats.modelUsage[log.model_used] || 0) + 1

      // Provider usage
      stats.providerUsage[log.provider] = (stats.providerUsage[log.provider] || 0) + 1

      // Daily usage
      const date = new Date(log.created_at).toISOString().split("T")[0]
      stats.dailyUsage[date] = (stats.dailyUsage[date] || 0) + 1
    })

    return stats
  }

  // Get effective configuration for a user (global + user overrides)
  async getEffectiveConfig(userId?: string): Promise<any> {
    const globalConfig = await this.getAllConfig()

    // TODO: Add user-specific overrides if needed
    // For now, just return global config
    return {
      defaultModel: globalConfig.default_model || "llama3-70b-8192",
      fallbackStrategy: globalConfig.fallback_strategy || "balanced",
      temperature: globalConfig.temperature || 0.7,
      maxTokens: globalConfig.max_tokens || 800,
      autoFallback: globalConfig.auto_fallback !== false,
      showModelInfo: globalConfig.show_model_info === true,
      rateLimitPerUser: globalConfig.rate_limit_per_user || 100,
      dailyCostLimit: globalConfig.daily_cost_limit || 50,
      enableFreeModelsOnly: globalConfig.enable_free_models_only === true,
      maintenanceMode: globalConfig.maintenance_mode === true,
    }
  }

  // Check if user has exceeded rate limits
  async checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
    const config = await this.getEffectiveConfig(userId)
    const hourAgo = new Date()
    hourAgo.setHours(hourAgo.getHours() - 1)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("ai_usage_logs")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", hourAgo.toISOString())

    if (error) {
      console.error("Failed to check rate limit:", error)
      return { allowed: true, remaining: config.rateLimitPerUser }
    }

    const currentUsage = data?.length || 0
    const remaining = Math.max(0, config.rateLimitPerUser - currentUsage)

    return {
      allowed: currentUsage < config.rateLimitPerUser,
      remaining,
    }
  }

  // Check daily cost limit
  async checkDailyCostLimit(): Promise<{ allowed: boolean; currentCost: number; limit: number }> {
    const config = await this.getAllConfig()
    const limit = config.daily_cost_limit || 50

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const supabase = createClient()
    const { data, error } = await supabase.from("ai_usage_logs").select("cost").gte("created_at", today.toISOString())

    if (error) {
      console.error("Failed to check daily cost limit:", error)
      return { allowed: true, currentCost: 0, limit }
    }

    const currentCost = data?.reduce((sum, log) => sum + log.cost, 0) || 0

    return {
      allowed: currentCost < limit,
      currentCost,
      limit,
    }
  }
}

// Export singleton instance
export const globalAIConfig = GlobalAIConfigManager.getInstance()
