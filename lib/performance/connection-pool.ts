/**
 * Database connection pool manager
 */
import { createClient } from "@supabase/supabase-js"
import { dbConfig } from "../config"

class ConnectionPool {
  private pool: any[] = []
  private maxSize: number
  private inUse: Set<any> = new Set()

  constructor(maxSize = dbConfig.connectionPoolSize || 20) {
    this.maxSize = maxSize
  }

  async getConnection() {
    // Check if there's an available connection in the pool
    const availableConnection = this.pool.find((conn) => !this.inUse.has(conn))

    if (availableConnection) {
      this.inUse.add(availableConnection)
      return availableConnection
    }

    // If pool is not at max size, create a new connection
    if (this.pool.length < this.maxSize) {
      const newConnection = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_ANON_KEY || "")

      this.pool.push(newConnection)
      this.inUse.add(newConnection)

      return newConnection
    }

    // If pool is at max size, wait for a connection to become available
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const availableConnection = this.pool.find((conn) => !this.inUse.has(conn))

        if (availableConnection) {
          clearInterval(checkInterval)
          this.inUse.add(availableConnection)
          resolve(availableConnection)
        }
      }, 100)
    })
  }

  releaseConnection(connection: any) {
    this.inUse.delete(connection)
  }
}

export const connectionPool = new ConnectionPool()

/**
 * Decorator function to use connection pooling
 */
export function withConnectionPool<T>(fn: (client: any, ...args: any[]) => Promise<T>) {
  return async (...args: any[]): Promise<T> => {
    const connection = await connectionPool.getConnection()

    try {
      return await fn(connection, ...args)
    } finally {
      connectionPool.releaseConnection(connection)
    }
  }
}
