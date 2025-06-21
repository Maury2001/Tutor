#!/usr/bin/env node
import fs from "fs"
import path from "path"
import { randomBytes } from "crypto"

interface QuickSetupOption {
  name: string
  description: string
  envVars: Record<string, string | (() => string)>
}

class QuickSetup {
  private envPath = path.join(process.cwd(), ".env")

  private presets: QuickSetupOption[] = [
    {
      name: "development",
      description: "Local development with minimal configuration",
      envVars: {
        NODE_ENV: "development",
        NEXTAUTH_URL: "http://localhost:3000",
        NEXTAUTH_SECRET: () => randomBytes(32).toString("hex"),
        PORT: "3000",
        // Placeholder values for development
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/cbc_tutorbot",
        SUPABASE_URL: "https://your-project.supabase.co",
        NEXT_PUBLIC_SUPABASE_URL: "https://your-project.supabase.co",
        SUPABASE_ANON_KEY: "your-supabase-anon-key",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "your-supabase-anon-key",
        OPENAI_API_KEY: "your-openai-api-key",
      },
    },
    {
      name: "production",
      description: "Production deployment template",
      envVars: {
        NODE_ENV: "production",
        NEXTAUTH_URL: "https://your-app.vercel.app",
        NEXTAUTH_SECRET: () => randomBytes(32).toString("hex"),
        // Production values need to be filled manually
        DATABASE_URL: "your-production-database-url",
        SUPABASE_URL: "https://your-project.supabase.co",
        NEXT_PUBLIC_SUPABASE_URL: "https://your-project.supabase.co",
        SUPABASE_ANON_KEY: "your-supabase-anon-key",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "your-supabase-anon-key",
        SUPABASE_SERVICE_ROLE_KEY: "your-supabase-service-role-key",
        OPENAI_API_KEY: "your-openai-api-key",
        GROQ_API_KEY: "your-groq-api-key",
        GOOGLE_CLIENT_ID: "your-google-client-id",
        GOOGLE_CLIENT_SECRET: "your-google-client-secret",
      },
    },
    {
      name: "testing",
      description: "Testing environment with mock values",
      envVars: {
        NODE_ENV: "test",
        NEXTAUTH_URL: "http://localhost:3000",
        NEXTAUTH_SECRET: () => randomBytes(32).toString("hex"),
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/cbc_tutorbot_test",
        SUPABASE_URL: "https://test-project.supabase.co",
        NEXT_PUBLIC_SUPABASE_URL: "https://test-project.supabase.co",
        SUPABASE_ANON_KEY: "test-anon-key",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
        OPENAI_API_KEY: "test-openai-key",
      },
    },
  ]

  async run() {
    const args = process.argv.slice(2)
    const presetName = args[0]

    if (!presetName) {
      this.showHelp()
      return
    }

    const preset = this.presets.find((p) => p.name === presetName)
    if (!preset) {
      console.error(`❌ Unknown preset: ${presetName}`)
      this.showHelp()
      return
    }

    console.log(`🚀 Setting up ${preset.name} environment`)
    console.log(`📝 ${preset.description}`)

    // Create backup if .env exists
    if (fs.existsSync(this.envPath)) {
      const backupPath = `${this.envPath}.backup.${Date.now()}`
      fs.copyFileSync(this.envPath, backupPath)
      console.log(`📁 Backed up existing .env to ${backupPath}`)
    }

    // Generate environment file
    const envLines = [`# ${preset.description}`, `# Generated: ${new Date().toISOString()}`, ""]

    for (const [key, valueOrFn] of Object.entries(preset.envVars)) {
      const value = typeof valueOrFn === "function" ? valueOrFn() : valueOrFn
      envLines.push(`${key}=${value}`)
    }

    fs.writeFileSync(this.envPath, envLines.join("\n"))

    console.log(`✅ Environment file created: ${this.envPath}`)

    if (presetName === "development") {
      console.log("\n📋 Next steps for development:")
      console.log("1. Update SUPABASE_URL with your actual Supabase project URL")
      console.log("2. Update SUPABASE_ANON_KEY with your actual Supabase anon key")
      console.log("3. Update OPENAI_API_KEY with your actual OpenAI API key")
      console.log("4. Run 'npm run dev' to start development server")
    } else if (presetName === "production") {
      console.log("\n📋 Next steps for production:")
      console.log("1. Replace all placeholder values with actual production values")
      console.log("2. Update NEXTAUTH_URL with your actual domain")
      console.log("3. Set up all required API keys and database connections")
      console.log("4. Test the configuration before deploying")
    }

    console.log("\n🔧 To customize further, run: npm run setup:env")
  }

  private showHelp() {
    console.log("🚀 CBC Tutorbot Platform - Quick Setup")
    console.log("\nUsage: npm run setup:quick <preset>")
    console.log("\nAvailable presets:")

    for (const preset of this.presets) {
      console.log(`  ${preset.name.padEnd(12)} - ${preset.description}`)
    }

    console.log("\nExamples:")
    console.log("  npm run setup:quick development")
    console.log("  npm run setup:quick production")
    console.log("  npm run setup:quick testing")
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new QuickSetup()
  setup.run().catch(console.error)
}

export { QuickSetup }
