/**
 * OpenAI Cost Management Configuration
 *
 * This file contains recommended settings and monitoring for OpenAI API costs
 */

export const OPENAI_COST_CONFIG = {
  // Recommended monthly limits for educational platforms
  LIMITS: {
    DEVELOPMENT: {
      soft: 5, // $5 warning
      hard: 10, // $10 cutoff
    },
    PRODUCTION: {
      soft: 20, // $20 warning
      hard: 50, // $50 cutoff
    },
  },

  // Cost per model (approximate, as of 2024)
  MODEL_COSTS: {
    "gpt-3.5-turbo": {
      input: 0.0015, // per 1K tokens
      output: 0.002, // per 1K tokens
    },
    "gpt-4": {
      input: 0.03, // per 1K tokens
      output: 0.06, // per 1K tokens
    },
    "gpt-4o": {
      input: 0.005, // per 1K tokens
      output: 0.015, // per 1K tokens
    },
  },

  // Usage monitoring thresholds
  MONITORING: {
    DAILY_LIMIT: 2, // $2 per day
    HOURLY_LIMIT: 0.5, // $0.50 per hour
    REQUEST_LIMIT: 100, // requests per minute
  },
}

/**
 * Calculate estimated monthly cost based on usage patterns
 */
export function estimateMonthlyCost(
  dailyRequests: number,
  avgTokensPerRequest: number,
  model: keyof typeof OPENAI_COST_CONFIG.MODEL_COSTS = "gpt-4o",
) {
  const modelCost = OPENAI_COST_CONFIG.MODEL_COSTS[model]
  const dailyCost = dailyRequests * (avgTokensPerRequest / 1000) * modelCost.input
  return dailyCost * 30 // Monthly estimate
}

/**
 * Usage monitoring and alerts
 */
export class OpenAICostMonitor {
  private static instance: OpenAICostMonitor
  private dailyUsage = 0
  private monthlyUsage = 0

  static getInstance() {
    if (!OpenAICostMonitor.instance) {
      OpenAICostMonitor.instance = new OpenAICostMonitor()
    }
    return OpenAICostMonitor.instance
  }

  trackUsage(tokens: number, model: string) {
    const cost = this.calculateCost(tokens, model)
    this.dailyUsage += cost
    this.monthlyUsage += cost

    // Check thresholds
    if (this.dailyUsage > OPENAI_COST_CONFIG.MONITORING.DAILY_LIMIT) {
      console.warn(`Daily OpenAI usage exceeded: $${this.dailyUsage.toFixed(2)}`)
    }

    if (this.monthlyUsage > OPENAI_COST_CONFIG.LIMITS.PRODUCTION.soft) {
      console.warn(`Monthly OpenAI usage warning: $${this.monthlyUsage.toFixed(2)}`)
    }
  }

  private calculateCost(tokens: number, model: string): number {
    const modelCost = OPENAI_COST_CONFIG.MODEL_COSTS[model as keyof typeof OPENAI_COST_CONFIG.MODEL_COSTS]
    if (!modelCost) return 0
    return (tokens / 1000) * modelCost.input
  }

  getDailyUsage(): number {
    return this.dailyUsage
  }

  getMonthlyUsage(): number {
    return this.monthlyUsage
  }

  resetDailyUsage() {
    this.dailyUsage = 0
  }
}
