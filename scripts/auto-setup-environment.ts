#!/usr/bin/env node
import fs from "fs"
import path from "path"
import { randomBytes } from "crypto"
import { createInterface } from "readline"

interface EnvConfig {
  name: string
  description: string
  required: boolean
  generator?: () => string
  validator?: (value: string) => boolean
  prompt?: string
  defaultValue?: string
  category: "database" | "ai" | "auth" | "integrations" | "deployment"
}

class EnvironmentSetup {
  private envPath = path.join(process.cwd(), ".env")
  private envExamplePath = path.join(process.cwd(), ".env.example")
  private backupPath = path.join(process.cwd(), ".env.backup")
  private rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  private envConfigs: EnvConfig[] = [
    // Authentication
    {
      name: "NEXTAUTH_SECRET",
      description: "Secret key for NextAuth.js session encryption",
      required: true,
      category: "auth",
      generator: () => randomBytes(32).toString("hex"),
      validator: (value) => value.length >= 32,
      prompt: "Generate a secure NextAuth secret? (recommended)",
    },
    {
      name: "NEXTAUTH_URL",
      description: "Base URL of your application",
      required: true,
      category: "auth",
      defaultValue: "http://localhost:3000",
      validator: (value) => value.startsWith("http"),
      prompt: "Enter your application URL",
    },

    // Database
    {
      name: "DATABASE_URL",
      description: "PostgreSQL database connection string",
      required: true,
      category: "database",
      validator: (value) => value.includes("postgresql://") || value.includes("postgres://"),
      prompt: "Enter your PostgreSQL database URL",
    },
    {
      name: "SUPABASE_URL",
      description: "Supabase project URL",
      required: true,
      category: "database",
      validator: (value) => value.includes("supabase.co"),
      prompt: "Enter your Supabase project URL",
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_URL",
      description: "Supabase project URL (public)",
      required: true,
      category: "database",
      validator: (value) => value.includes("supabase.co"),
      prompt: "Enter your Supabase project URL (public)",
    },
    {
      name: "SUPABASE_ANON_KEY",
      description: "Supabase anonymous/public key",
      required: true,
      category: "database",
      validator: (value) => value.startsWith("eyJ"),
      prompt: "Enter your Supabase anonymous key",
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      description: "Supabase anonymous key (public)",
      required: true,
      category: "database",
      validator: (value) => value.startsWith("eyJ"),
      prompt: "Enter your Supabase anonymous key (public)",
    },
    {
      name: "SUPABASE_SERVICE_ROLE_KEY",
      description: "Supabase service role key (admin access)",
      required: false,
      category: "database",
      validator: (value) => value.startsWith("eyJ"),
      prompt: "Enter your Supabase service role key (optional)",
    },

    // AI Services
    {
      name: "OPENAI_API_KEY",
      description: "OpenAI API key for GPT models",
      required: true,
      category: "ai",
      validator: (value) => value.startsWith("sk-"),
      prompt: "Enter your OpenAI API key",
    },
    {
      name: "GROQ_API_KEY",
      description: "Groq API key for alternative AI models",
      required: false,
      category: "ai",
      validator: (value) => value.startsWith("gsk_"),
      prompt: "Enter your Groq API key (optional)",
    },

    // OAuth Providers
    {
      name: "GOOGLE_CLIENT_ID",
      description: "Google OAuth client ID",
      required: false,
      category: "auth",
      validator: (value) => value.includes("googleusercontent.com"),
      prompt: "Enter your Google OAuth client ID (optional)",
    },
    {
      name: "GOOGLE_CLIENT_SECRET",
      description: "Google OAuth client secret",
      required: false,
      category: "auth",
      validator: (value) => value.startsWith("GOCSPX-"),
      prompt: "Enter your Google OAuth client secret (optional)",
    },
    {
      name: "GITHUB_CLIENT_ID",
      description: "GitHub OAuth client ID",
      required: false,
      category: "auth",
      prompt: "Enter your GitHub OAuth client ID (optional)",
    },
    {
      name: "GITHUB_CLIENT_SECRET",
      description: "GitHub OAuth client secret",
      required: false,
      category: "auth",
      prompt: "Enter your GitHub OAuth client secret (optional)",
    },

    // Integrations
    {
      name: "KV_URL",
      description: "Redis/Upstash KV database URL",
      required: false,
      category: "integrations",
      validator: (value) => value.startsWith("redis://") || value.startsWith("rediss://"),
      prompt: "Enter your Redis/KV database URL (optional)",
    },
    {
      name: "KV_REST_API_URL",
      description: "Upstash KV REST API URL",
      required: false,
      category: "integrations",
      prompt: "Enter your Upstash KV REST API URL (optional)",
    },
    {
      name: "KV_REST_API_TOKEN",
      description: "Upstash KV REST API token",
      required: false,
      category: "integrations",
      prompt: "Enter your Upstash KV REST API token (optional)",
    },

    // Deployment
    {
      name: "PORT",
      description: "Port number for the application",
      required: false,
      category: "deployment",
      defaultValue: "3000",
      validator: (value) => !isNaN(Number(value)),
      prompt: "Enter port number",
    },
    {
      name: "NODE_ENV",
      description: "Node environment",
      required: false,
      category: "deployment",
      defaultValue: "development",
      prompt: "Enter Node environment (development/production)",
    },
  ]

  async run() {
    console.log("🚀 CBC Tutorbot Platform - Environment Setup")
    console.log("=".repeat(50))

    try {
      // Create backup if .env exists
      await this.createBackup()

      // Load existing environment
      const existingEnv = await this.loadExistingEnv()

      console.log("\n📋 Environment Variable Configuration")
      console.log("This script will help you configure all required environment variables.\n")

      // Setup each category
      const categories = ["auth", "database", "ai", "integrations", "deployment"] as const
      const newEnv: Record<string, string> = { ...existingEnv }

      for (const category of categories) {
        await this.setupCategory(category, newEnv)
      }

      // Write the new environment file
      await this.writeEnvFile(newEnv)

      // Create .env.example
      await this.createEnvExample()

      // Validate the configuration
      await this.validateConfiguration(newEnv)

      console.log("\n✅ Environment setup completed successfully!")
      console.log("🔄 Please restart your development server to apply changes.")
    } catch (error) {
      console.error("\n❌ Setup failed:", (error as Error).message)
      await this.restoreBackup()
    } finally {
      this.rl.close()
    }
  }

  private async createBackup() {
    if (fs.existsSync(this.envPath)) {
      fs.copyFileSync(this.envPath, this.backupPath)
      console.log("📁 Created backup of existing .env file")
    }
  }

  private async loadExistingEnv(): Promise<Record<string, string>> {
    const env: Record<string, string> = {}

    if (fs.existsSync(this.envPath)) {
      const content = fs.readFileSync(this.envPath, "utf8")
      const lines = content.split("\n")

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith("#")) {
          const [key, ...valueParts] = trimmed.split("=")
          if (key && valueParts.length > 0) {
            env[key] = valueParts.join("=")
          }
        }
      }
    }

    return env
  }

  private async setupCategory(category: string, env: Record<string, string>) {
    const configs = this.envConfigs.filter((c) => c.category === category)
    if (configs.length === 0) return

    console.log(`\n🔧 ${category.toUpperCase()} Configuration`)
    console.log("-".repeat(30))

    for (const config of configs) {
      await this.setupVariable(config, env)
    }
  }

  private async setupVariable(config: EnvConfig, env: Record<string, string>) {
    const existing = env[config.name]
    const hasExisting = existing && existing.length > 0

    console.log(`\n📝 ${config.name}`)
    console.log(`   ${config.description}`)
    console.log(`   Required: ${config.required ? "Yes" : "No"}`)

    if (hasExisting) {
      const masked = this.maskValue(existing)
      console.log(`   Current: ${masked}`)

      const keepExisting = await this.askQuestion(`Keep existing value? (y/n): `)
      if (keepExisting.toLowerCase() === "y") {
        return
      }
    }

    // Handle auto-generation
    if (config.generator && !hasExisting) {
      const autoGenerate = await this.askQuestion(`Auto-generate ${config.name}? (y/n): `)
      if (autoGenerate.toLowerCase() === "y") {
        env[config.name] = config.generator()
        console.log(`   ✅ Generated automatically`)
        return
      }
    }

    // Handle default values
    if (config.defaultValue && !hasExisting) {
      const useDefault = await this.askQuestion(`Use default value "${config.defaultValue}"? (y/n): `)
      if (useDefault.toLowerCase() === "y") {
        env[config.name] = config.defaultValue
        console.log(`   ✅ Using default value`)
        return
      }
    }

    // Manual input
    if (config.required || hasExisting) {
      let value = ""
      let isValid = false

      while (!isValid) {
        value = await this.askQuestion(`${config.prompt || `Enter ${config.name}`}: `)

        if (!value && !config.required) {
          console.log(`   ⏭️  Skipped (optional)`)
          break
        }

        if (!value && config.required) {
          console.log(`   ❌ This field is required`)
          continue
        }

        if (config.validator && !config.validator(value)) {
          console.log(`   ❌ Invalid format`)
          continue
        }

        env[config.name] = value
        console.log(`   ✅ Set successfully`)
        isValid = true
      }
    } else {
      const setValue = await this.askQuestion(`Set ${config.name}? (y/n): `)
      if (setValue.toLowerCase() === "y") {
        const value = await this.askQuestion(`${config.prompt || `Enter ${config.name}`}: `)
        if (value) {
          env[config.name] = value
          console.log(`   ✅ Set successfully`)
        }
      }
    }
  }

  private maskValue(value: string): string {
    if (value.length <= 8) {
      return "*".repeat(value.length)
    }
    return `${value.substring(0, 4)}${"*".repeat(value.length - 8)}${value.substring(value.length - 4)}`
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, resolve)
    })
  }

  private async writeEnvFile(env: Record<string, string>) {
    const lines = [
      "# Environment Variables for CBC Tutorbot Platform",
      "# Generated by auto-setup script",
      `# Created: ${new Date().toISOString()}`,
      "",
    ]

    // Group by category
    const categories = {
      auth: "# Authentication",
      database: "# Database Configuration",
      ai: "# AI Services",
      integrations: "# Integrations",
      deployment: "# Deployment",
    }

    for (const [category, header] of Object.entries(categories)) {
      const categoryVars = this.envConfigs.filter((c) => c.category === category).filter((c) => env[c.name])

      if (categoryVars.length > 0) {
        lines.push(header)
        for (const config of categoryVars) {
          lines.push(`${config.name}=${env[config.name]}`)
        }
        lines.push("")
      }
    }

    fs.writeFileSync(this.envPath, lines.join("\n"))
    console.log(`\n📄 Environment file written to ${this.envPath}`)
  }

  private async createEnvExample() {
    const lines = ["# Environment Variables Example", "# Copy this file to .env and fill in your actual values", ""]

    const categories = {
      auth: "# Authentication",
      database: "# Database Configuration",
      ai: "# AI Services",
      integrations: "# Integrations",
      deployment: "# Deployment",
    }

    for (const [category, header] of Object.entries(categories)) {
      const categoryVars = this.envConfigs.filter((c) => c.category === category)

      if (categoryVars.length > 0) {
        lines.push(header)
        for (const config of categoryVars) {
          lines.push(`# ${config.description}`)
          const example = config.defaultValue || "your-value-here"
          lines.push(`${config.name}=${example}`)
          lines.push("")
        }
      }
    }

    fs.writeFileSync(this.envExamplePath, lines.join("\n"))
    console.log(`📄 Example file created at ${this.envExamplePath}`)
  }

  private async validateConfiguration(env: Record<string, string>) {
    console.log("\n🔍 Validating configuration...")

    const requiredVars = this.envConfigs.filter((c) => c.required)
    const missing = requiredVars.filter((c) => !env[c.name])

    if (missing.length > 0) {
      console.log("\n⚠️  Missing required variables:")
      for (const config of missing) {
        console.log(`   - ${config.name}: ${config.description}`)
      }
      throw new Error("Required environment variables are missing")
    }

    // Validate formats
    const invalid = []
    for (const config of this.envConfigs) {
      const value = env[config.name]
      if (value && config.validator && !config.validator(value)) {
        invalid.push(config.name)
      }
    }

    if (invalid.length > 0) {
      console.log("\n⚠️  Invalid variable formats:")
      for (const name of invalid) {
        console.log(`   - ${name}`)
      }
      throw new Error("Some environment variables have invalid formats")
    }

    console.log("✅ All required variables are configured correctly")
  }

  private async restoreBackup() {
    if (fs.existsSync(this.backupPath)) {
      fs.copyFileSync(this.backupPath, this.envPath)
      console.log("🔄 Restored backup .env file")
    }
  }
}

// Run the setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new EnvironmentSetup()
  setup.run().catch(console.error)
}

export { EnvironmentSetup }
