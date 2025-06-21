#!/usr/bin/env node
import fs from "fs"
import path from "path"
import { execSync } from "child_process"

// Auto-fill environment variables in .env file
function autoFillEnv() {
  console.log("Auto-filling environment variables...")

  // Define the path to the .env file
  const envPath = path.join(process.cwd(), ".env")

  // Check if .env file exists
  const envExists = fs.existsSync(envPath)

  // Create or read the .env file
  let envContent = envExists ? fs.readFileSync(envPath, "utf8") : ""

  // Define the variables to auto-fill
  const variables = {
    // NPM configuration
    NPM_REGISTRY_URL: "https://registry.npmjs.org/",
    NPM_CONFIG_NETWORK_TIMEOUT: "300000",

    // NextAuth configuration
    NEXTAUTH_URL: "http://localhost:3000",

    // Port configuration
    PORT: "3000",
  }

  // Add variables to .env file if they don't exist
  for (const [key, value] of Object.entries(variables)) {
    // Check if the variable already exists in the .env file
    if (!envContent.includes(`${key}=`)) {
      // Add the variable to the .env file
      envContent += `\n${key}=${value}`
    }
  }

  // Write the updated .env file
  fs.writeFileSync(envPath, envContent.trim() + "\n")

  console.log("Environment variables auto-filled successfully!")
}

// Run the auto-fill function
autoFillEnv()

// Check if running in a CI environment
const isCI = process.env.CI === "true"

// If not in CI, try to restart the development server
if (!isCI) {
  try {
    console.log("Restarting development server...")
    execSync("npm run dev", { stdio: "inherit" })
  } catch (error) {
    console.error("Failed to restart development server:", error)
  }
}
