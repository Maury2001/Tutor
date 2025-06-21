#!/usr/bin/env node
import fs from "fs"
import path from "path"
import { randomBytes } from "crypto"

// Generate a secure random string
function generateSecureString(length = 32): string {
  return randomBytes(length).toString("hex")
}

// Auto-generate environment variables
function autoGenerateEnv() {
  console.log("Auto-generating environment variables...")

  // Define the path to the .env file
  const envPath = path.join(process.cwd(), ".env")
  const envExamplePath = path.join(process.cwd(), ".env.example")

  // Check if .env file exists
  const envExists = fs.existsSync(envPath)

  // Create or read the .env file
  let envContent = envExists ? fs.readFileSync(envPath, "utf8") : ""

  // Define the variables to auto-generate
  const variables: Record<string, string | (() => string)> = {
    // NextAuth configuration
    NEXTAUTH_URL: "http://localhost:3000",
    NEXTAUTH_SECRET: () => generateSecureString(),

    // Port configuration
    PORT: "3000",

    // Package manager configuration
    NPM_REGISTRY_URL: "https://registry.npmjs.org/",
    NPM_CONFIG_NETWORK_TIMEOUT: "300000",
    NPM_CONFIG_FETCH_RETRIES: "5",
    NPM_CONFIG_FETCH_RETRY_FACTOR: "10",
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT: "20000",
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT: "120000",

    // Database configuration (development defaults)
    DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/cbc_tutorbot",
    POSTGRES_HOST: "localhost",
    POSTGRES_PORT: "5432",
    POSTGRES_USER: "postgres",
    POSTGRES_PASSWORD: "postgres",
    POSTGRES_DATABASE: "cbc_tutorbot",

    // OpenAI configuration
    OPENAI_MODEL: "gpt-4o",
    OPENAI_TEMPERATURE: "0.7",
    OPENAI_MAX_TOKENS: "2000",

    // Groq configuration
    GROQ_MODEL: "llama3-70b-8192",
  }

  // Add variables to .env file if they don't exist
  for (const [key, valueOrFn] of Object.entries(variables)) {
    // Check if the variable already exists in the .env file
    if (!envContent.includes(`${key}=`)) {
      // Get the value (call the function if it's a function)
      const value = typeof valueOrFn === "function" ? valueOrFn() : valueOrFn

      // Add the variable to the .env file
      envContent += `\n${key}=${value}`
      console.log(`✅ Added ${key}`)
    }
  }

  // Write the updated .env file
  fs.writeFileSync(envPath, envContent.trim() + "\n")

  // Create .env.example if it doesn't exist
  if (!fs.existsSync(envExamplePath)) {
    let exampleContent = "# Environment Variables Example\n\n"

    for (const [key, valueOrFn] of Object.entries(variables)) {
      const value = typeof valueOrFn === "function" ? "your-secure-value-here" : valueOrFn
      exampleContent += `${key}=${value}\n`
    }

    // Add placeholders for sensitive values
    exampleContent += "\n# API Keys (required for production)\n"
    exampleContent += "OPENAI_API_KEY=your-openai-api-key\n"
    exampleContent += "GROQ_API_KEY=your-groq-api-key\n"
    exampleContent += "\n# OAuth Providers\n"
    exampleContent += "GOOGLE_CLIENT_ID=your-google-client-id\n"
    exampleContent += "GOOGLE_CLIENT_SECRET=your-google-client-secret\n"
    exampleContent += "GITHUB_CLIENT_ID=your-github-client-id\n"
    exampleContent += "GITHUB_CLIENT_SECRET=your-github-client-secret\n"

    fs.writeFileSync(envExamplePath, exampleContent)
    console.log("✅ Created .env.example file")
  }

  console.log("✅ Environment variables auto-generated successfully!")
}

// Run the auto-generate function
autoGenerateEnv()
