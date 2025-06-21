import { LRUCache } from "lru-cache"
import { apiConfig } from "../config"

// Create a type for our cache interface
export interface CacheInterface {
  get: <T>(key: string) => Promise<T | null>
  set: <T>(key: string, value: T, ttl?: number) => Promise<void>
  delete: (key: string) => Promise<void>
  flush: () => Promise<void>
}

// In-memory LRU cache that works in all environments
const memoryCache = new LRUCache<string, any>({
  max: apiConfig.cache.maxSize,
  ttl: apiConfig.cache.ttl * 1000, // Convert to milliseconds
})

// Create a memory-based cache implementation
const memoryOnlyCache: CacheInterface = {
  async get<T>(key: string): Promise<T | null> {
    return (memoryCache.get(key) as T) || null
  },

  async set<T>(key: string, value: T, ttl: number = apiConfig.cache.ttl): Promise<void> {
    memoryCache.set(key, value, { ttl: ttl * 1000 })
  },

  async delete(key: string): Promise<void> {
    memoryCache.delete(key)
  },

  async flush(): Promise<void> {
    memoryCache.clear()
  },
}

// Export the memory cache as the default implementation
// This ensures the code works in all environments
export const cache: CacheInterface = memoryOnlyCache

// Helper function to create a cache key from function arguments
export function createCacheKey(prefix: string, args: any[]): string {
  return `${prefix}:${JSON.stringify(args)}`
}

// Decorator function to cache function results
export function withCache<T>(fn: (...args: any[]) => Promise<T>, keyPrefix: string, ttl?: number) {
  return async (...args: any[]): Promise<T> => {
    const cacheKey = createCacheKey(keyPrefix, args)
    const cachedResult = await cache.get<T>(cacheKey)

    if (cachedResult !== null) {
      return cachedResult
    }

    const result = await fn(...args)
    await cache.set(cacheKey, result, ttl)

    return result
  }
}
