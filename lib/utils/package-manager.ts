// This file contains utilities for package manager detection and configuration

/**
 * Detects the package manager being used and returns appropriate configuration
 */
export function getPackageManagerConfig() {
  // Default to npm configuration
  return {
    installCommand: "npm install",
    lockfile: "package-lock.json",
    registry: "https://registry.npmjs.org/",
    cacheDir: ".npm",
  }
}

/**
 * Returns the appropriate registry URL based on environment
 */
export function getRegistryUrl() {
  // Check for environment variables that might specify an alternative registry
  return process.env.NPM_REGISTRY_URL || "https://registry.npmjs.org/"
}

/**
 * Returns the appropriate timeout for package manager operations
 */
export function getNetworkTimeout() {
  return Number.parseInt(process.env.NPM_CONFIG_NETWORK_TIMEOUT || "300000", 10)
}
