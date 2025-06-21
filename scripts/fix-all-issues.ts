#!/usr/bin/env tsx

import { config, validateConfig } from "../lib/config/environment"
import { dbConnection } from "../lib/db/connection"

async function fixAllIssues() {
  console.log("🔧 Starting comprehensive fix process...\n")

  // 1. Validate environment configuration
  console.log("1. Validating environment configuration...")
  const configValidation = validateConfig()

  if (!configValidation.isValid) {
    console.error("❌ Configuration errors found:")
    configValidation.errors.forEach((error) => console.error(`   - ${error}`))
    console.log("\n📝 Please set the missing environment variables and try again.\n")
    return false
  }
  console.log("✅ Environment configuration is valid\n")

  // 2. Test database connection
  console.log("2. Testing database connection...")
  try {
    const dbTest = await dbConnection.testConnection()
    if (dbTest) {
      console.log("✅ Database connection successful\n")
    } else {
      console.log("❌ Database connection failed\n")
      return false
    }
  } catch (error) {
    console.error("❌ Database connection error:", error)
    return false
  }

  // 3. Check required services
  console.log("3. Checking required services...")
  const services = {
    Supabase: !!(config.supabase.url && config.supabase.anonKey),
    OpenAI: !!config.ai.openai.apiKey,
    NextAuth: !!config.auth.nextAuthSecret,
    "Redis/Upstash": !!(config.redis.url || config.redis.restApiUrl),
  }

  let allServicesReady = true
  Object.entries(services).forEach(([service, isReady]) => {
    if (isReady) {
      console.log(`✅ ${service} is configured`)
    } else {
      console.log(`❌ ${service} is not configured`)
      allServicesReady = false
    }
  })

  if (!allServicesReady) {
    console.log("\n⚠️  Some services are not configured. The application may not work correctly.\n")
  }

  console.log("\n🎉 Fix process completed!")
  console.log("📋 Summary:")
  console.log(`   - Environment: ${configValidation.isValid ? "Valid" : "Invalid"}`)
  console.log(`   - Database: Connected`)
  console.log(`   - Services: ${allServicesReady ? "All Ready" : "Some Missing"}`)

  return true
}

// Run the fix process
if (require.main === module) {
  fixAllIssues()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error("❌ Fix process failed:", error)
      process.exit(1)
    })
}

export default fixAllIssues
