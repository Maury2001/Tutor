import { config } from "@/lib/config/environment"

// Database connection utility
export class DatabaseConnection {
  private static instance: DatabaseConnection
  private connectionString: string

  private constructor() {
    this.connectionString = this.getConnectionString()
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection()
    }
    return DatabaseConnection.instance
  }

  private getConnectionString(): string {
    // Priority order for connection strings
    const connectionOptions = [config.database.url, config.database.prismaUrl, config.database.nonPoolingUrl]

    for (const connection of connectionOptions) {
      if (connection && connection.trim() !== "") {
        return connection
      }
    }

    // Fallback: construct from individual components
    if (config.database.host && config.database.user && config.database.database) {
      const password = config.database.password ? `:${config.database.password}` : ""
      return `postgresql://${config.database.user}${password}@${config.database.host}/${config.database.database}`
    }

    throw new Error("No valid database connection string found")
  }

  public getConnection(): string {
    return this.connectionString
  }

  public async testConnection(): Promise<boolean> {
    try {
      // This would be implemented with actual database connection testing
      // For now, just check if connection string exists
      return !!this.connectionString
    } catch (error) {
      console.error("Database connection test failed:", error)
      return false
    }
  }
}

export const dbConnection = DatabaseConnection.getInstance()
