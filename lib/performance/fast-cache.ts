import { LRUCache } from "lru-cache"

// Serialization helpers
const serialize = (value: any): string => {
  try {
    if (value === null || value === undefined) return "null"
    if (typeof value === "string") return value
    if (typeof value === "number" || typeof value === "boolean") return String(value)

    // Handle objects and arrays
    return JSON.stringify(value, (key, val) => {
      // Handle circular references
      if (typeof val === "object" && val !== null) {
        if (val.constructor === Object || Array.isArray(val)) {
          return val
        }
        // Convert other objects to plain objects
        return Object.assign({}, val)
      }
      return val
    })
  } catch (error) {
    console.warn("Serialization failed:", error)
    return String(value)
  }
}

const deserialize = (value: string): any => {
  try {
    if (value === "null") return null
    if (value === "undefined") return undefined

    // Try to parse as JSON first
    return JSON.parse(value)
  } catch {
    // Return as string if JSON parsing fails
    return value
  }
}

// High-performance in-memory cache with safe serialization
class FastCache {
  private cache: LRUCache<string, string>
  private static instance: FastCache

  constructor() {
    this.cache = new LRUCache({
      max: 10000,
      ttl: 1000 * 60 * 15, // 15 minutes
      allowStale: true,
      updateAgeOnGet: true,
    })
  }

  static getInstance(): FastCache {
    if (!FastCache.instance) {
      FastCache.instance = new FastCache()
    }
    return FastCache.instance
  }

  get<T>(key: string): T | null {
    try {
      const serialized = this.cache.get(key)
      if (serialized === undefined) return null
      return deserialize(serialized) as T
    } catch (error) {
      console.warn(`Cache get failed for key ${key}:`, error)
      return null
    }
  }

  set<T>(key: string, value: T, ttl?: number): void {
    try {
      const serialized = serialize(value)
      this.cache.set(key, serialized, { ttl })
    } catch (error) {
      console.warn(`Cache set failed for key ${key}:`, error)
    }
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  getStats() {
    return {
      size: this.cache.size,
      calculatedSize: this.cache.calculatedSize,
      max: this.cache.max,
    }
  }
}

export const fastCache = FastCache.getInstance()

// Safe cache decorator
export function withFastCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl = 60000,
): T {
  return (async (...args: Parameters<T>) => {
    try {
      const cacheKey = keyGenerator(...args)

      // Validate cache key
      if (typeof cacheKey !== "string") {
        console.warn("Invalid cache key, executing function directly")
        return await fn(...args)
      }

      const cached = fastCache.get(cacheKey)
      if (cached !== null) {
        return cached
      }

      const result = await fn(...args)
      fastCache.set(cacheKey, result, ttl)
      return result
    } catch (error) {
      console.warn("Cache operation failed, executing function directly:", error)
      return await fn(...args)
    }
  }) as T
}
