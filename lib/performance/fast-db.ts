import { createClient } from "@supabase/supabase-js"
import { fastCache } from "./fast-cache"

// Optimized database operations
class FastDB {
  private client: any
  private static instance: FastDB

  constructor() {
    this.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )
  }

  static getInstance(): FastDB {
    if (!FastDB.instance) {
      FastDB.instance = new FastDB()
    }
    return FastDB.instance
  }

  // Cached query with automatic invalidation
  async cachedQuery<T>(
    table: string,
    query: any,
    cacheKey: string,
    ttl = 300000, // 5 minutes
  ): Promise<T[]> {
    // Try cache first
    const cached = fastCache.get<T[]>(cacheKey)
    if (cached) {
      return cached
    }

    // Execute query
    const { data, error } = await this.client.from(table).select(query)

    if (error) {
      throw new Error(`Database query failed: ${error.message}`)
    }

    // Cache result
    fastCache.set(cacheKey, data || [], ttl)
    return data || []
  }

  // Batch operations for better performance
  async batchInsert(table: string, records: any[]) {
    const batchSize = 100
    const results = []

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      const { data, error } = await this.client.from(table).insert(batch)

      if (error) {
        throw new Error(`Batch insert failed: ${error.message}`)
      }

      results.push(...(data || []))
    }

    // Invalidate related cache
    this.invalidateCache(table)
    return results
  }

  // Smart cache invalidation
  invalidateCache(pattern: string) {
    // Clear all cache keys that match the pattern
    const keys = Array.from((fastCache as any).cache.keys())
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        fastCache.delete(key)
      }
    })
  }

  // Optimized user data fetching
  async getUserData(userId: string) {
    const cacheKey = `user-data-${userId}`

    return this.cachedQuery(
      "users",
      `
        id, name, email, role, grade_level,
        progress:user_progress(*),
        achievements:user_achievements(*),
        stats:user_stats(*)
      `,
      cacheKey,
      600000, // 10 minutes
    )
  }

  // Fast curriculum data
  async getCurriculumData(grade?: string) {
    const cacheKey = `curriculum-${grade || "all"}`

    return this.cachedQuery(
      "curriculum",
      `
        id, name, grade_level, learning_area,
        strands:curriculum_strands(*),
        outcomes:learning_outcomes(*)
      `,
      cacheKey,
      1800000, // 30 minutes
    )
  }
}

export const fastDB = FastDB.getInstance()
