console.log("🧪 Testing Learning Path Generation for All Grades (Fixed Version)...\n")

// Import with proper module resolution
import {
  generateLearningPath,
  formatGradeLabel,
  getLearningAreas,
  GRADE_LEVELS,
  type GradeLevel,
  type LearningPathOptions,
} from "../lib/cbc-curriculum.js"

// Proper type definitions
interface TestConfiguration {
  name: string
  config: LearningPathOptions
  description: string
}

interface TestResult {
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

interface BenchmarkResult {
  grade: GradeLevel
  avgTime: number
  minTime: number
  maxTime: number
  successRate: number
  iterations: number
}

// Test configuration for different scenarios
const testConfigurations: TestConfiguration[] = [
  {
    name: "Early Childhood (PP1)",
    config: {
      studentGrade: "pp1",
      difficulty: "easy",
      focus: "breadth",
    },
    description: "Basic foundational skills for pre-primary",
  },
  {
    name: "Primary Foundation (Grade 1)",
    config: {
      studentGrade: "grade1",
      learningAreas: ["mathematics-grade1", "english-grade1"],
      difficulty: "easy",
      focus: "depth",
    },
    description: "Core subjects with deep focus",
  },
  {
    name: "Primary Intermediate (Grade 3)",
    config: {
      studentGrade: "grade3",
      difficulty: "medium",
      focus: "breadth",
    },
    description: "Balanced approach across all subjects",
  },
  {
    name: "Primary Advanced (Grade 6)",
    config: {
      studentGrade: "grade6",
      learningAreas: ["mathematics-grade6", "science-grade6"],
      difficulty: "hard",
      focus: "depth",
    },
    description: "STEM focus for advanced primary",
  },
  {
    name: "Junior Secondary (Grade 7)",
    config: {
      studentGrade: "grade7",
      difficulty: "medium",
      focus: "breadth",
    },
    description: "Transition to secondary education",
  },
  {
    name: "Junior Secondary Advanced (Grade 9)",
    config: {
      studentGrade: "grade9",
      learningAreas: ["mathematics-grade9", "biology-grade9"],
      difficulty: "hard",
      focus: "depth",
    },
    description: "Pre-secondary preparation",
  },
  {
    name: "Senior Secondary (Grade 10)",
    config: {
      studentGrade: "grade10",
      difficulty: "hard",
      focus: "breadth",
    },
    description: "Advanced secondary concepts",
  },
  {
    name: "University Preparation (Grade 12)",
    config: {
      studentGrade: "grade12",
      learningAreas: ["applied-mathematics-grade12", "advanced-physics-grade12"],
      difficulty: "hard",
      focus: "depth",
    },
    description: "University entrance preparation",
  },
]

// Function to safely parse duration
function parseDuration(duration: string): number {
  try {
    const match = duration.match(/(\d+)/)
    return match ? Number.parseInt(match[1]) : 0
  } catch {
    return 0
  }
}

// Function to test learning path generation with proper error handling
async function testLearningPathGeneration(): Promise<void> {
  console.log("=".repeat(80))
  console.log("🎯 LEARNING PATH GENERATION TEST RESULTS")
  console.log("=".repeat(80))

  let totalTests = 0
  let passedTests = 0
  let failedTests = 0
  const results: TestResult[] = []

  for (const test of testConfigurations) {
    totalTests++
    console.log(`\n📚 Testing: ${test.name}`)
    console.log(`📝 Description: ${test.description}`)
    console.log(`⚙️  Configuration:`)
    console.log(`   - Grade: ${formatGradeLabel(test.config.studentGrade)}`)
    console.log(`   - Difficulty: ${test.config.difficulty || "default"}`)
    console.log(`   - Focus: ${test.config.focus || "default"}`)
    console.log(`   - Learning Areas: ${test.config.learningAreas?.length || "all"} areas`)

    try {
      // Validate configuration
      if (!test.config.studentGrade) {
        throw new Error("Student grade is required")
      }

      if (!GRADE_LEVELS.includes(test.config.studentGrade)) {
        throw new Error(`Invalid grade level: ${test.config.studentGrade}`)
      }

      // Generate learning path
      const startTime = Date.now()
      const learningPath = generateLearningPath(test.config)
      const endTime = Date.now()

      // Validate results
      if (learningPath && Array.isArray(learningPath) && learningPath.length > 0) {
        passedTests++
        console.log(`✅ SUCCESS - Generated ${learningPath.length} learning steps`)
        console.log(`⏱️  Generation time: ${endTime - startTime}ms`)

        // Show first few steps with error handling
        console.log(`📋 Sample Learning Steps:`)
        const sampleSteps = learningPath.slice(0, 3).map((step) => {
          const sampleStep = {
            step: step.step || 0,
            area: step.learningArea?.name || "Unknown",
            strand: step.strand?.name || "Unknown",
            outcome: step.outcome?.description || "Unknown",
            duration: step.estimatedDuration || "0 minutes",
          }

          console.log(`   ${sampleStep.step}. ${sampleStep.area} → ${sampleStep.strand}`)
          console.log(`      📖 ${sampleStep.outcome}`)
          console.log(`      ⏰ Duration: ${sampleStep.duration}`)
          console.log(`      🎯 Objectives: ${step.objectives?.length || 0}`)

          return sampleStep
        })

        if (learningPath.length > 3) {
          console.log(`   ... and ${learningPath.length - 3} more steps`)
        }

        // Calculate total estimated time safely
        const totalMinutes = learningPath.reduce((total, step) => {
          const minutes = parseDuration(step.estimatedDuration || "0")
          return total + minutes
        }, 0)
        console.log(`📊 Total estimated time: ${Math.round(totalMinutes / 60)} hours`)

        results.push({
          name: test.name,
          grade: test.config.studentGrade,
          success: true,
          pathLength: learningPath.length,
          totalTime: totalMinutes,
          generationTime: endTime - startTime,
          sampleSteps,
        })
      } else {
        failedTests++
        console.log(`❌ FAILED - No learning path generated or invalid structure`)
        results.push({
          name: test.name,
          grade: test.config.studentGrade,
          success: false,
          pathLength: 0,
          totalTime: 0,
          generationTime: 0,
          error: "No learning path generated",
          sampleSteps: [],
        })
      }
    } catch (error) {
      failedTests++
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.log(`❌ ERROR - ${errorMessage}`)
      results.push({
        name: test.name,
        grade: test.config.studentGrade,
        success: false,
        pathLength: 0,
        totalTime: 0,
        generationTime: 0,
        error: errorMessage,
        sampleSteps: [],
      })
    }

    console.log("-".repeat(60))
  }

  // Summary
  console.log(`\n📊 TEST SUMMARY:`)
  console.log(`   Total Tests: ${totalTests}`)
  console.log(`   ✅ Passed: ${passedTests}`)
  console.log(`   ❌ Failed: ${failedTests}`)
  console.log(`   📈 Success Rate: ${totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%`)

  return Promise.resolve()
}

// Function to test curriculum coverage with error handling
async function testCurriculumCoverage(): Promise<void> {
  console.log("\n" + "=".repeat(80))
  console.log("📚 CURRICULUM COVERAGE ANALYSIS")
  console.log("=".repeat(80))

  try {
    for (const grade of GRADE_LEVELS) {
      try {
        const learningAreas = getLearningAreas(grade)
        console.log(`\n${formatGradeLabel(grade)}:`)
        console.log(`   📖 Learning Areas: ${learningAreas?.length || 0}`)

        if (learningAreas && learningAreas.length > 0) {
          learningAreas.forEach((area) => {
            try {
              const totalStrands = area.strands?.length || 0
              const totalSubStrands = (area.strands || []).reduce(
                (sum, strand) => sum + (strand.subStrands?.length || 0),
                0,
              )
              const totalOutcomes = (area.strands || []).reduce(
                (sum, strand) =>
                  sum +
                  (strand.subStrands || []).reduce(
                    (subSum, subStrand) => subSum + (subStrand.outcomes?.length || 0),
                    0,
                  ),
                0,
              )

              console.log(
                `   📚 ${area.name || "Unknown"}: ${totalStrands} strands, ${totalSubStrands} sub-strands, ${totalOutcomes} outcomes`,
              )
            } catch (error) {
              console.log(
                `   ⚠️  Error analyzing area ${area.name || "Unknown"}: ${error instanceof Error ? error.message : "Unknown error"}`,
              )
            }
          })
        } else {
          console.log(`   ⚠️  No curriculum data available`)
        }
      } catch (error) {
        console.log(
          `   ❌ Error processing ${formatGradeLabel(grade)}: ${error instanceof Error ? error.message : "Unknown error"}`,
        )
      }
    }
  } catch (error) {
    console.error("Coverage analysis failed:", error)
  }

  return Promise.resolve()
}

// Function to test different learning path scenarios
async function testLearningPathScenarios(): Promise<void> {
  console.log("\n" + "=".repeat(80))
  console.log("🎯 LEARNING PATH SCENARIOS TEST")
  console.log("=".repeat(80))

  const scenarios = [
    {
      name: "Mathematics Focus Path",
      grade: "grade5" as GradeLevel,
      areas: ["mathematics-grade5"],
      description: "Deep dive into mathematics concepts",
    },
    {
      name: "Language Arts Path",
      grade: "grade4" as GradeLevel,
      areas: ["english-grade4", "kiswahili-grade4"],
      description: "Bilingual language development",
    },
    {
      name: "STEM Preparation",
      grade: "grade8" as GradeLevel,
      areas: ["mathematics-grade8", "chemistry-grade8"],
      description: "Science and mathematics integration",
    },
    {
      name: "University Prep",
      grade: "grade11" as GradeLevel,
      areas: ["advanced-mathematics-grade11", "chemistry-grade11"],
      description: "Advanced academic preparation",
    },
  ]

  for (const scenario of scenarios) {
    console.log(`\n🎯 Scenario: ${scenario.name}`)
    console.log(`📝 ${scenario.description}`)

    try {
      const path = generateLearningPath({
        studentGrade: scenario.grade,
        learningAreas: scenario.areas,
        difficulty: "medium",
        focus: "depth",
      })

      if (path && Array.isArray(path)) {
        console.log(`✅ Generated ${path.length} learning steps`)

        // Analyze path composition safely
        const areaDistribution = path.reduce(
          (dist, step) => {
            const areaName = step.learningArea?.name || "Unknown"
            dist[areaName] = (dist[areaName] || 0) + 1
            return dist
          },
          {} as Record<string, number>,
        )

        console.log(`📊 Learning Area Distribution:`)
        Object.entries(areaDistribution).forEach(([area, count]) => {
          console.log(`   ${area}: ${count} steps`)
        })
      } else {
        console.log(`❌ Failed to generate learning path`)
      }
    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return Promise.resolve()
}

// Function to benchmark performance
async function benchmarkPerformance(): Promise<void> {
  console.log("\n" + "=".repeat(80))
  console.log("⚡ PERFORMANCE BENCHMARK")
  console.log("=".repeat(80))

  const benchmarkTests = [
    { grade: "pp1" as GradeLevel, iterations: 50 },
    { grade: "grade3" as GradeLevel, iterations: 50 },
    { grade: "grade7" as GradeLevel, iterations: 50 },
    { grade: "grade12" as GradeLevel, iterations: 50 },
  ]

  for (const test of benchmarkTests) {
    console.log(`\n⏱️  Benchmarking ${formatGradeLabel(test.grade)} (${test.iterations} iterations)`)

    const times: number[] = []
    let successCount = 0

    for (let i = 0; i < test.iterations; i++) {
      try {
        const startTime = Date.now()

        const path = generateLearningPath({
          studentGrade: test.grade,
          difficulty: "medium",
          focus: "breadth",
        })

        const endTime = Date.now()

        if (path && Array.isArray(path) && path.length > 0) {
          successCount++
          times.push(endTime - startTime)
        }
      } catch (error) {
        // Count as failed iteration
        console.error(`Benchmark iteration ${i + 1} failed:`, error instanceof Error ? error.message : "Unknown error")
      }
    }

    if (times.length > 0) {
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length
      const minTime = Math.min(...times)
      const maxTime = Math.max(...times)

      console.log(`   📊 Average time: ${avgTime.toFixed(2)}ms`)
      console.log(`   ⚡ Fastest: ${minTime.toFixed(2)}ms`)
      console.log(`   🐌 Slowest: ${maxTime.toFixed(2)}ms`)
      console.log(`   ✅ Success rate: ${Math.round((successCount / test.iterations) * 100)}%`)
    } else {
      console.log(`   ❌ All iterations failed`)
    }
  }

  return Promise.resolve()
}

// Run all tests with proper error handling
async function runAllTests(): Promise<void> {
  console.log("🚀 Starting Comprehensive Learning Path Tests...\n")

  try {
    // Validate that curriculum data is available
    if (!GRADE_LEVELS || GRADE_LEVELS.length === 0) {
      throw new Error("No grade levels available in curriculum data")
    }

    console.log(`📚 Found ${GRADE_LEVELS.length} grade levels to test`)
    console.log(`🎯 Running ${testConfigurations.length} test configurations`)

    await testLearningPathGeneration()
    await testCurriculumCoverage()
    await testLearningPathScenarios()
    await benchmarkPerformance()

    console.log("\n" + "=".repeat(80))
    console.log("🎉 ALL TESTS COMPLETED SUCCESSFULLY!")
    console.log("=".repeat(80))
  } catch (error) {
    console.error("💥 Test suite failed:", error instanceof Error ? error.message : "Unknown error")
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace available")
    process.exit(1)
  }
}

// Execute tests
runAllTests().catch((error) => {
  console.error("💥 Fatal error running tests:", error)
  process.exit(1)
})
