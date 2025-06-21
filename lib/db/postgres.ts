// Use Neon serverless client for all database operations
export { sql, query, pool, getConnection, db } from "./neon"

// Legacy compatibility exports
export const cachedQuery = query

// Simple transaction wrapper for serverless
export const withTransaction = async <T,>(callback: (client: any) => Promise<T>): Promise<T> => {
  // For serverless, we don't need explicit transactions in most cases
  // Neon handles this automatically
  const client = await getConnection()
  try {
    return await callback(client)
  } finally {
    if (client && typeof client.release === "function") {
      await client.release()
    }
  }
}

export const closePool = async (): Promise<void> => {
  // No-op for serverless
  return Promise.resolve()
}
