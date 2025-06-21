"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, CheckCircle, XCircle, Clock, Target, Zap, BarChart3, GraduationCap } from "lucide-react"
import {
  generateLearningPath,
  formatGradeLabel,
  getLearningAreas,
  GRADE_LEVELS,
  type GradeLevel,
  type LearningPathOptions,
} from "@/lib/cbc-curriculum"

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

export default function TestLearningPathsPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>("")
  const [activeTab, setActiveTab] = useState("overview")

  const testConfigurations: Array<{
    name: string
    config: LearningPathOptions
    description: string
  }> = [
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

  const runLearningPathTests = async () => {
    setIsRunning(true)
    setTestResults([])
    const results: TestResult[] = []

    for (const test of testConfigurations) {
      setCurrentTest(test.name)

      try {
        const startTime = Date.now()
        const learningPath = generateLearningPath(test.config)
        const endTime = Date.now()

        const totalMinutes = learningPath.reduce((total, step) => {
          const minutes = Number.parseInt(step.estimatedDuration.replace(/\D/g, "")) || 0
          return total + minutes
        }, 0)

        const sampleSteps = learningPath.slice(0, 3).map((step) => ({
          step: step.step,
          area: step.learningArea.name,
          strand: step.strand.name,
          outcome: step.outcome.description,
          duration: step.estimatedDuration,
        }))

        results.push({
          name: test.name,
          grade: test.config.studentGrade,
          success: learningPath.length > 0,
          pathLength: learningPath.length,
          totalTime: totalMinutes,
          generationTime: endTime - startTime,
          sampleSteps,
        })
      } catch (error) {
        results.push({
          name: test.name,
          grade: test.config.studentGrade,
          success: false,
          pathLength: 0,
          totalTime: 0,
          generationTime: 0,
          error: error instanceof Error ? error.message : "Unknown error",
          sampleSteps: [],
        })
      }
    }

    setTestResults(results)
    setIsRunning(false)
    setCurrentTest("")
  }

  const runBenchmarkTests = async () => {
    setIsRunning(true)
    setBenchmarkResults([])

    const benchmarkGrades: GradeLevel[] = ["pp1", "grade3", "grade7", "grade12"]
    const results: BenchmarkResult[] = []

    for (const grade of benchmarkGrades) {
      setCurrentTest(`Benchmarking ${formatGradeLabel(grade)}`)

      const iterations = 50
      const times: number[] = []
      let successCount = 0

      for (let i = 0; i < iterations; i++) {
        try {
          const startTime = Date.now() // Changed from performance.now()
          const path = generateLearningPath({
            studentGrade: grade,
            difficulty: "medium",
            focus: "breadth",
          })
          const endTime = Date.now() // Changed from performance.now()

          if (path.length > 0) {
            successCount++
            times.push(endTime - startTime)
          }
        } catch (error) {
          console.error(`Benchmark error for ${grade}:`, error)
          // Count as failed iteration
        }
      }

      if (times.length > 0) {
        results.push({
          grade,
          avgTime: times.reduce((sum, time) => sum + time, 0) / times.length,
          minTime: Math.min(...times),
          maxTime: Math.max(...times),
          successRate: (successCount / iterations) * 100,
          iterations,
        })
      }
    }

    setBenchmarkResults(results)
    setIsRunning(false)
    setCurrentTest("")
  }

  const getSuccessRate = () => {
    if (!testResults || testResults.length === 0) return 0
    const successful = testResults.filter((r) => r.success).length
    return Math.round((successful / testResults.length) * 100)
  }

  const getTotalSteps = () => {
    if (!testResults) return 0
    return testResults.reduce((total, result) => total + (result.pathLength || 0), 0)
  }

  const getAverageGenerationTime = () => {
    if (!testResults || testResults.length === 0) return 0
    const totalTime = testResults.reduce((total, result) => total + (result.generationTime || 0), 0)
    return Math.round(totalTime / testResults.length)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Path Generation Tests</h1>
          <p className="text-muted-foreground">
            Comprehensive testing of learning path generation across all grade levels
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runLearningPathTests} disabled={isRunning} className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Run Path Tests
          </Button>
          <Button
            onClick={runBenchmarkTests}
            disabled={isRunning}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Run Benchmarks
          </Button>
        </div>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Running tests: {currentTest}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{getSuccessRate()}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{getTotalSteps()}</div>
                <div className="text-sm text-muted-foreground">Total Steps Generated</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{getAverageGenerationTime()}ms</div>
                <div className="text-sm text-muted-foreground">Avg Generation Time</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <GraduationCap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{GRADE_LEVELS.length}</div>
                <div className="text-sm text-muted-foreground">Grade Levels</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testConfigurations.map((config, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold">{config.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{config.description}</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">{formatGradeLabel(config.config.studentGrade)}</Badge>
                      <Badge variant="outline">{config.config.difficulty || "default"}</Badge>
                      <Badge variant="outline">{config.config.focus || "default"}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <ScrollArea className="h-[600px]">
            {testResults.map((result, index) => (
              <Card key={index} className="mb-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      {result.name}
                    </CardTitle>
                    <Badge variant={result.success ? "default" : "destructive"}>{formatGradeLabel(result.grade)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {result.success ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Steps Generated:</span> {result.pathLength}
                        </div>
                        <div>
                          <span className="font-medium">Total Time:</span> {Math.round(result.totalTime / 60)}h
                        </div>
                        <div>
                          <span className="font-medium">Generation:</span> {result.generationTime.toFixed(2)}ms
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Sample Learning Steps:</h5>
                        <div className="space-y-2">
                          {result.sampleSteps.map((step, stepIndex) => (
                            <div key={stepIndex} className="p-3 bg-muted rounded-lg">
                              <div className="font-medium">
                                {step.step}. {step.area} → {step.strand}
                              </div>
                              <div className="text-sm text-muted-foreground">{step.outcome}</div>
                              <div className="text-xs text-muted-foreground">Duration: {step.duration}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <span className="font-medium">Error:</span> {result.error || "Unknown error"}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          {benchmarkResults.map((benchmark, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {formatGradeLabel(benchmark.grade)} Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{benchmark.avgTime.toFixed(2)}ms</div>
                    <div className="text-sm text-muted-foreground">Average Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{benchmark.minTime.toFixed(2)}ms</div>
                    <div className="text-sm text-muted-foreground">Fastest</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{benchmark.maxTime.toFixed(2)}ms</div>
                    <div className="text-sm text-muted-foreground">Slowest</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{benchmark.successRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Performance Score</span>
                    <span>{benchmark.successRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={benchmark.successRate} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GRADE_LEVELS.map((grade) => {
              const learningAreas = getLearningAreas(grade)
              return (
                <Card key={grade}>
                  <CardHeader>
                    <CardTitle className="text-lg">{formatGradeLabel(grade)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Learning Areas:</span>
                        <Badge>{learningAreas.length}</Badge>
                      </div>
                      {learningAreas.length > 0 ? (
                        <div className="space-y-1">
                          {learningAreas.map((area) => {
                            const totalStrands = area.strands.length
                            const totalOutcomes = area.strands.reduce(
                              (sum, strand) =>
                                sum +
                                strand.subStrands.reduce((subSum, subStrand) => subSum + subStrand.outcomes.length, 0),
                              0,
                            )

                            return (
                              <div key={area.id} className="text-sm">
                                <div className="font-medium">{area.name}</div>
                                <div className="text-muted-foreground">
                                  {totalStrands} strands, {totalOutcomes} outcomes
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No curriculum data</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
