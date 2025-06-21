/**
 * Simple in-memory cache implementation for API responses
 */
type CacheItem<T> = {
  value: T
  expiry: number
}

class APICache {
  private cache: Map<string, CacheItem<any>> = new Map()
  private maxSize: number
  private defaultTTL: number

  constructor(maxSize = 1000, defaultTTL = 60000) {
    this.maxSize = maxSize
    this.defaultTTL = defaultTTL
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  set<T>(key: string, value: T, ttl = this.defaultTTL): void {
    // If cache is at max size, remove oldest item
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    })
  }

  has(key: string): boolean {
    const item = this.cache.get(key)

    if (!item) {
      return false
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }
}

export const apiCache = new APICache()

/**
 * Decorator function to cache API responses
 */
export function withCache<T>(fn: (...args: any[]) => Promise<T>, keyFn: (...args: any[]) => string, ttl?: number) {
  return async (...args: any[]): Promise<T> => {
    const cacheKey = keyFn(...args)
    const cachedResult = apiCache.get<T>(cacheKey)

    if (cachedResult) {
      return cachedResult
    }

    const result = await fn(...args)
    apiCache.set(cacheKey, result, ttl)

    return result
  }
}
