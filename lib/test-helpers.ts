/**
 * Test Helper Functions
 * Utility functions for testing learning path generation
 */

import type { GradeLevel, LearningPathOptions } from "./cbc-curriculum"

export interface TestConfiguration {
  name: string
  config: LearningPathOptions
  description: string
  expectedMinSteps?: number
  expectedMaxSteps?: number
}

export interface TestResult {
  name: string
  grade: GradeLevel
  success: boolean
  pathLength: number
  totalTime: number
  generationTime: number
  error?: string
  sampleSteps: Array<{
    step: number
    area: string
    strand: string
    outcome: string
    duration: string
  }>
}

export interface BenchmarkResult {
  grade: GradeLevel
  avgTime: number
  minTime: number
  maxTime: number
  successRate: number
  iterations: number
}

/**
 * Safely parse duration string to extract minutes
 */
export function parseDuration(duration: string): number {
  try {
    if (!duration || typeof duration !== "string") return 0
    const match = duration.match(/(\d+)/)
    return match ? Number.parseInt(match[1], 10) : 0
  } catch {
    return 0
  }
}

/**
 * Validate learning path structure
 */
export function validateLearningPath(path: any): boolean {
  try {
    if (!Array.isArray(path)) return false
    if (path.length === 0) return false

    return path.every((step) => {
      return (
        step &&
        typeof step === "object" &&
        typeof step.step === "number" &&
        step.learningArea &&
        typeof step.learningArea.name === "string" &&
        step.strand &&
        typeof step.strand.name === "string" &&
        step.outcome &&
        typeof step.outcome.description === "string" &&
        Array.isArray(step.objectives)
      )
    })
  } catch {
    return false
  }
}

/**
 * Calculate learning path statistics
 */
export function calculatePathStats(path: any[]) {
  try {
    const totalMinutes = path.reduce((total, step) => {
      const minutes = parseDuration(step.estimatedDuration || "0")
      return total + minutes
    }, 0)

    const areaDistribution = path.reduce(
      (dist, step) => {
        const areaName = step.learningArea?.name || "Unknown"
        dist[areaName] = (dist[areaName] || 0) + 1
        return dist
      },
      {} as Record<string, number>,
    )

    const totalObjectives = path.reduce((total, step) => {
      return total + (step.objectives?.length || 0)
    }, 0)

    return {
      totalSteps: path.length,
      totalMinutes,
      totalHours: Math.round(totalMinutes / 60),
      areaDistribution,
      totalObjectives,
      avgObjectivesPerStep: path.length > 0 ? Math.round(totalObjectives / path.length) : 0,
    }
  } catch (error) {
    console.error("Error calculating path stats:", error)
    return {
      totalSteps: 0,
      totalMinutes: 0,
      totalHours: 0,
      areaDistribution: {},
      totalObjectives: 0,
      avgObjectivesPerStep: 0,
    }
  }
}

/**
 * Generate test report
 */
export function generateTestReport(results: TestResult[]): {
  summary: {
    totalTests: number
    passedTests: number
    failedTests: number
    successRate: number
  }
  details: {
    totalSteps: number
    totalTime: number
    avgGenerationTime: number
    gradeDistribution: Record<string, number>
  }
} {
  const totalTests = results.length
  const passedTests = results.filter((r) => r.success).length
  const failedTests = totalTests - passedTests
  const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0

  const totalSteps = results.reduce((sum, r) => sum + r.pathLength, 0)
  const totalTime = results.reduce((sum, r) => sum + r.totalTime, 0)
  const avgGenerationTime =
    results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.generationTime, 0) / results.length) : 0

  const gradeDistribution = results.reduce(
    (dist, result) => {
      const grade = result.grade
      dist[grade] = (dist[grade] || 0) + 1
      return dist
    },
    {} as Record<string, number>,
  )

  return {
    summary: {
      totalTests,
      passedTests,
      failedTests,
      successRate,
    },
    details: {
      totalSteps,
      totalTime,
      avgGenerationTime,
      gradeDistribution,
    },
  }
}

/**
 * Validate test configuration
 */
export function validateTestConfig(config: LearningPathOptions): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.studentGrade) {
    errors.push("Student grade is required")
  }

  if (config.learningAreas && !Array.isArray(config.learningAreas)) {
    errors.push("Learning areas must be an array")
  }

  if (config.difficulty && !["easy", "medium", "hard"].includes(config.difficulty)) {
    errors.push("Difficulty must be 'easy', 'medium', or 'hard'")
  }

  if (config.focus && !["breadth", "depth"].includes(config.focus)) {
    errors.push("Focus must be 'breadth' or 'depth'")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Create safe test environment
 */
export function createSafeTestEnvironment() {
  // Set up error handling
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error)
    process.exit(1)
  })

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason)
    process.exit(1)
  })

  // Return cleanup function
  return () => {
    // Cleanup if needed
  }
}
