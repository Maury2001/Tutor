import "server-only"
import { apiConfig } from "../config"
import { serverCache } from "../cache/redis-server"

interface RateLimitInfo {
  count: number
  lastReset: number
}

export async function rateLimit(
  identifier: string,
  limit: number = apiConfig.rateLimit.max,
  windowMs: number = apiConfig.rateLimit.windowMs,
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const now = Date.now()
  const key = `ratelimit:${identifier}`

  try {
    // Get current rate limit info
    const rateLimitInfo = (await serverCache.get<RateLimitInfo>(key)) || { count: 0, lastReset: now }

    // Reset count if window has passed
    if (now - rateLimitInfo.lastReset > windowMs) {
      rateLimitInfo.count = 0
      rateLimitInfo.lastReset = now
    }

    // Increment count
    rateLimitInfo.count++

    // Save updated rate limit info
    await serverCache.set(key, rateLimitInfo, Math.ceil(windowMs / 1000))

    // Calculate remaining and reset time
    const remaining = Math.max(0, limit - rateLimitInfo.count)
    const reset = rateLimitInfo.lastReset + windowMs

    return {
      success: rateLimitInfo.count <= limit,
      limit,
      remaining,
      reset,
    }
  } catch (error) {
    console.error("Rate limit error:", error)
    // In case of error, allow the request to proceed
    return {
      success: true,
      limit,
      remaining: 999,
      reset: now + windowMs,
    }
  }
}
