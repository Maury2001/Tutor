console.log("🧪 Testing Learning Path Generation for All Grades...\n")

import {
  generateLearningPath,
  formatGradeLabel,
  getLearningAreas,
  GRADE_LEVELS,
  type GradeLevel,
  type LearningPathOptions,
} from "../lib/cbc-curriculum.js"

interface TestConfiguration {
  name: string
  config: LearningPathOptions
  description: string
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

// Function to test learning path generation
async function testLearningPathGeneration(): Promise<void> {
  console.log("=".repeat(80))
  console.log("🎯 LEARNING PATH GENERATION TEST RESULTS")
  console.log("=".repeat(80))

  let totalTests = 0
  let passedTests = 0
  let failedTests = 0

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
      // Generate learning path
      const startTime = Date.now()
      const learningPath = generateLearningPath(test.config)
      const endTime = Date.now()

      // Validate results
      if (learningPath && learningPath.length > 0) {
        passedTests++
        console.log(`✅ SUCCESS - Generated ${learningPath.length} learning steps`)
        console.log(`⏱️  Generation time: ${endTime - startTime}ms`)

        // Show first few steps
        console.log(`📋 Sample Learning Steps:`)
        learningPath.slice(0, 3).forEach((step, index) => {
          console.log(`   ${step.step}. ${step.learningArea.name} → ${step.strand.name}`)
          console.log(`      📖 ${step.outcome.description}`)
          console.log(`      ⏰ Duration: ${step.estimatedDuration}`)
          console.log(`      🎯 Objectives: ${step.objectives.length}`)
        })

        if (learningPath.length > 3) {
          console.log(`   ... and ${learningPath.length - 3} more steps`)
        }

        // Calculate total estimated time
        const totalMinutes = learningPath.reduce((total, step) => {
          const minutes = Number.parseInt(step.estimatedDuration.replace(/\D/g, "")) || 0
          return total + minutes
        }, 0)
        console.log(`📊 Total estimated time: ${Math.round(totalMinutes / 60)} hours`)
      } else {
        failedTests++
        console.log(`❌ FAILED - No learning path generated`)
      }
    } catch (error) {
      failedTests++
      console.log(`❌ ERROR - ${error instanceof Error ? (error as Error).message : "Unknown error"}`)
    }

    console.log("-".repeat(60))
  }

  // Summary
  console.log(`\n📊 TEST SUMMARY:`)
  console.log(`   Total Tests: ${totalTests}`)
  console.log(`   ✅ Passed: ${passedTests}`)
  console.log(`   ❌ Failed: ${failedTests}`)
  console.log(`   📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`)
}

// Function to test curriculum coverage
async function testCurriculumCoverage(): Promise<void> {
  console.log("\n" + "=".repeat(80))
  console.log("📚 CURRICULUM COVERAGE ANALYSIS")
  console.log("=".repeat(80))

  for (const grade of GRADE_LEVELS) {
    const learningAreas = getLearningAreas(grade)
    console.log(`\n${formatGradeLabel(grade)}:`)
    console.log(`   📖 Learning Areas: ${learningAreas.length}`)

    if (learningAreas.length > 0) {
      learningAreas.forEach((area) => {
        const totalStrands = area.strands.length
        const totalSubStrands = area.strands.reduce((sum, strand) => sum + strand.subStrands.length, 0)
        const totalOutcomes = area.strands.reduce(
          (sum, strand) => sum + strand.subStrands.reduce((subSum, subStrand) => subSum + subStrand.outcomes.length, 0),
          0,
        )

        console.log(
          `   📚 ${area.name}: ${totalStrands} strands, ${totalSubStrands} sub-strands, ${totalOutcomes} outcomes`,
        )
      })
    } else {
      console.log(`   ⚠️  No curriculum data available`)
    }
  }
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

  scenarios.forEach((scenario) => {
    console.log(`\n🎯 Scenario: ${scenario.name}`)
    console.log(`📝 ${scenario.description}`)

    try {
      const path = generateLearningPath({
        studentGrade: scenario.grade,
        learningAreas: scenario.areas,
        difficulty: "medium",
        focus: "depth",
      })

      console.log(`✅ Generated ${path.length} learning steps`)

      // Analyze path composition
      const areaDistribution = path.reduce(
        (dist, step) => {
          const areaName = step.learningArea.name
          dist[areaName] = (dist[areaName] || 0) + 1
          return dist
        },
        {} as Record<string, number>,
      )

      console.log(`📊 Learning Area Distribution:`)
      Object.entries(areaDistribution).forEach(([area, count]) => {
        console.log(`   ${area}: ${count} steps`)
      })
    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? (error as Error).message : "Unknown error"}`)
    }
  })
}

// Function to benchmark performance
async function benchmarkPerformance(): Promise<void> {
  console.log("\n" + "=".repeat(80))
  console.log("⚡ PERFORMANCE BENCHMARK")
  console.log("=".repeat(80))

  const benchmarkTests = [
    { grade: "pp1" as GradeLevel, iterations: 100 },
    { grade: "grade3" as GradeLevel, iterations: 100 },
    { grade: "grade7" as GradeLevel, iterations: 100 },
    { grade: "grade12" as GradeLevel, iterations: 100 },
  ]

  benchmarkTests.forEach((test) => {
    console.log(`\n⏱️  Benchmarking ${formatGradeLabel(test.grade)} (${test.iterations} iterations)`)

    const times: number[] = []
    let successCount = 0

    for (let i = 0; i < test.iterations; i++) {
      const startTime = Date.now()

      try {
        const path = generateLearningPath({
          studentGrade: test.grade,
          difficulty: "medium",
          focus: "breadth",
        })

        if (path.length > 0) {
          successCount++
        }

        const endTime = Date.now()
        times.push(endTime - startTime)
      } catch (error) {
        // Count as failed iteration
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
  })
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Starting Comprehensive Learning Path Tests...\n")

  try {
    await testLearningPathGeneration()
    await testCurriculumCoverage()
    await testLearningPathScenarios()
    await benchmarkPerformance()

    console.log("\n" + "=".repeat(80))
    console.log("🎉 ALL TESTS COMPLETED SUCCESSFULLY!")
    console.log("=".repeat(80))
  } catch (error) {
    console.error("💥 Test suite failed:", error)
    process.exit(1)
  }
}

// Execute tests
runAllTests()
