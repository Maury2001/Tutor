import "server-only"
import { cache as memoryCache, type CacheInterface } from "./redis"
import { apiConfig } from "../config"

// Only import Redis in a server context
let Redis: any
try {
  // Dynamic import to prevent bundling for client
  Redis = require("ioredis").default
} catch (e) {
  console.warn("Redis not available, using memory cache only")
}

// Create Redis client if REDIS_URL is available and we're in a server environment
let redisClient: any = null
let redisCache: CacheInterface | null = null

// Only initialize Redis if we're in a server environment and Redis is available
if (typeof window === "undefined" && Redis && process.env.REDIS_URL) {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      connectTimeout: 10000,
      lazyConnect: true, // Don't connect immediately
    })

    // Create Redis-based cache implementation
    redisCache = {
      async get<T>(key: string): Promise<T | null> {
        try {
          const value = await redisClient.get(key)
          if (value) {
            return JSON.parse(value) as T
          }
          return null
        } catch (error) {
          console.error("Redis get error:", error)
          // Fall back to memory cache
          return memoryCache.get<T>(key)
        }
      },

      async set<T>(key: string, value: T, ttl: number = apiConfig.cache.ttl): Promise<void> {
        try {
          await redisClient.set(key, JSON.stringify(value), "EX", ttl)
        } catch (error) {
          console.error("Redis set error:", error)
          // Fall back to memory cache
          await memoryCache.set(key, value, ttl)
        }
      },

      async delete(key: string): Promise<void> {
        try {
          await redisClient.del(key)
        } catch (error) {
          console.error("Redis delete error:", error)
          // Fall back to memory cache
          await memoryCache.delete(key)
        }
      },

      async flush(): Promise<void> {
        try {
          await redisClient.flushall()
        } catch (error) {
          console.error("Redis flush error:", error)
          // Fall back to memory cache
          await memoryCache.flush()
        }
      },
    }

    // Connect to Redis
    redisClient.connect().catch((err: any) => {
      console.error("Redis connection error:", err)
    })

    if (process.env.NODE_ENV === "development") {
      console.log("🔌 Connected to Redis")
    }
  } catch (error) {
    console.error("Failed to initialize Redis:", error)
    console.log("⚠️ Falling back to memory cache")
  }
}

// Export the appropriate cache implementation
export const serverCache: CacheInterface = redisCache || memoryCache

// Initialize function to be called from server components/API routes
export function initServerCache(): CacheInterface {
  return serverCache
}
