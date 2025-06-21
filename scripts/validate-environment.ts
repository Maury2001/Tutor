#!/usr/bin/env node
import fs from "fs"
import path from "path"

interface ValidationRule {
  name: string
  check: () => Promise<{ valid: boolean; message: string; details?: string }>
  required: boolean
  category: string
}

class EnvironmentValidator {
  private envPath = path.join(process.cwd(), ".env")

  private rules: ValidationRule[] = [
    {
      name: "Environment file exists",
      required: true,
      category: "setup",
      check: async () => ({
        valid: fs.existsSync(this.envPath),
        message: fs.existsSync(this.envPath) ? "✅ .env file found" : "❌ .env file missing",
        details: fs.existsSync(this.envPath) ? undefined : "Run 'npm run setup:env' to create it",
      }),
    },
    {
      name: "NEXTAUTH_SECRET",
      required: true,
      category: "auth",
      check: async () => {
        const value = process.env.NEXTAUTH_SECRET
        const valid = !!(value && value.length >= 32)
        return {
          valid,
          message: valid ? "✅ NextAuth secret configured" : "❌ NextAuth secret missing or too short",
          details: valid ? undefined : "Must be at least 32 characters long",
        }
      },
    },
    {
      name: "NEXTAUTH_URL",
      required: true,
      category: "auth",
      check: async () => {
        const value = process.env.NEXTAUTH_URL
        const valid = !!(value && (value.startsWith("http://") || value.startsWith("https://")))
        return {
          valid,
          message: valid ? "✅ NextAuth URL configured" : "❌ NextAuth URL missing or invalid",
          details: valid ? undefined : "Must start with http:// or https://",
        }
      },
    },
    {
      name: "Database connection",
      required: true,
      category: "database",
      check: async () => {
        const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
        if (!dbUrl) {
          return {
            valid: false,
            message: "❌ Database URL not configured",
            details: "Set DATABASE_URL or POSTGRES_URL",
          }
        }

        const validFormat = dbUrl.includes("postgresql://") || dbUrl.includes("postgres://")
        return {
          valid: validFormat,
          message: validFormat ? "✅ Database URL format valid" : "❌ Database URL format invalid",
          details: validFormat ? undefined : "Must be a valid PostgreSQL connection string",
        }
      },
    },
    {
      name: "Supabase configuration",
      required: true,
      category: "database",
      check: async () => {
        const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!url || !key) {
          return {
            valid: false,
            message: "❌ Supabase not configured",
            details: "Set SUPABASE_URL and SUPABASE_ANON_KEY",
          }
        }

        const validUrl = url.includes("supabase.co")
        const validKey = key.startsWith("eyJ")

        return {
          valid: validUrl && validKey,
          message: validUrl && validKey ? "✅ Supabase configured" : "❌ Supabase configuration invalid",
          details: !validUrl ? "Invalid Supabase URL" : !validKey ? "Invalid Supabase key format" : undefined,
        }
      },
    },
    {
      name: "OpenAI API",
      required: true,
      category: "ai",
      check: async () => {
        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
          return {
            valid: false,
            message: "❌ OpenAI API key not configured",
            details: "Set OPENAI_API_KEY",
          }
        }

        const validFormat = apiKey.startsWith("sk-")
        return {
          valid: validFormat,
          message: validFormat ? "✅ OpenAI API key format valid" : "❌ OpenAI API key invalid format",
          details: validFormat ? undefined : "API key should start with 'sk-'",
        }
      },
    },
    {
      name: "Groq API (optional)",
      required: false,
      category: "ai",
      check: async () => {
        const apiKey = process.env.GROQ_API_KEY
        if (!apiKey) {
          return {
            valid: true,
            message: "⏭️ Groq API not configured (optional)",
          }
        }

        const validFormat = apiKey.startsWith("gsk_")
        return {
          valid: validFormat,
          message: validFormat ? "✅ Groq API configured" : "❌ Groq API key invalid format",
          details: validFormat ? undefined : "API key should start with 'gsk_'",
        }
      },
    },
    {
      name: "Google OAuth (optional)",
      required: false,
      category: "auth",
      check: async () => {
        const clientId = process.env.GOOGLE_CLIENT_ID
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET

        if (!clientId || !clientSecret) {
          return {
            valid: true,
            message: "⏭️ Google OAuth not configured (optional)",
          }
        }

        const validId = clientId.includes("googleusercontent.com")
        const validSecret = clientSecret.startsWith("GOCSPX-")

        return {
          valid: validId && validSecret,
          message: validId && validSecret ? "✅ Google OAuth configured" : "❌ Google OAuth configuration invalid",
          details: !validId ? "Invalid client ID format" : !validSecret ? "Invalid client secret format" : undefined,
        }
      },
    },
  ]

  async run() {
    console.log("🔍 CBC Tutorbot Platform - Environment Validation")
    console.log("=".repeat(50))

    // Load environment variables
    if (fs.existsSync(this.envPath)) {
      const envContent = fs.readFileSync(this.envPath, "utf8")
      const envVars = this.parseEnvFile(envContent)

      // Set environment variables for validation
      for (const [key, value] of Object.entries(envVars)) {
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    }

    const results = []
    let passedCount = 0
    let failedCount = 0
    let warningCount = 0

    console.log("\n🧪 Running validation checks...\n")

    for (const rule of this.rules) {
      try {
        const result = await rule.check()
        results.push({ rule, result })

        const status = result.valid ? "✅" : rule.required ? "❌" : "⚠️"
        console.log(`${status} ${rule.name}`)
        console.log(`   ${result.message}`)

        if (result.details) {
          console.log(`   💡 ${result.details}`)
        }

        if (result.valid) {
          passedCount++
        } else if (rule.required) {
          failedCount++
        } else {
          warningCount++
        }

        console.log()
      } catch (error) {
        console.log(`❌ ${rule.name}`)
        console.log(`   Error: ${(error as Error).message}`)
        failedCount++
        console.log()
      }
    }

    // Summary
    console.log("📊 Validation Summary")
    console.log("-".repeat(20))
    console.log(`✅ Passed: ${passedCount}`)
    console.log(`❌ Failed: ${failedCount}`)
    console.log(`⚠️  Warnings: ${warningCount}`)

    if (failedCount === 0) {
      console.log("\n🎉 All required checks passed! Your environment is ready.")
    } else {
      console.log("\n🔧 Some required checks failed. Please fix the issues above.")
      console.log("💡 Run 'npm run setup:env' to configure missing variables.")
    }

    // Exit with appropriate code
    process.exit(failedCount > 0 ? 1 : 0)
  }

  private parseEnvFile(content: string): Record<string, string> {
    const env: Record<string, string> = {}
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

    return env
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new EnvironmentValidator()
  validator.run().catch(console.error)
}

export { EnvironmentValidator }
