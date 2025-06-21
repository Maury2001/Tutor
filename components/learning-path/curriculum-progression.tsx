"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, PlayCircle, ArrowRight, BookOpen, Target, TrendingUp, Calendar } from "lucide-react"

interface ProgressionNode {
  id: string
  title: string
  description: string
  status: "completed" | "current" | "upcoming" | "locked"
  progress: number
  estimatedWeeks: number
  learningOutcomes: string[]
  keySkills: string[]
  assessments: number
  prerequisites?: string[]
}

interface CurriculumProgressionProps {
  gradeLevel: string
  learningAreaId: string
}

export function CurriculumProgression({ gradeLevel, learningAreaId }: CurriculumProgressionProps) {
  const [progressionData, setProgressionData] = useState<ProgressionNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgressionData()
  }, [gradeLevel, learningAreaId])

  const fetchProgressionData = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockProgression: ProgressionNode[] = [
        {
          id: "term1-numbers",
          title: "Term 1: Number Foundations",
          description: "Build strong number sense and basic operations",
          status: "completed",
          progress: 100,
          estimatedWeeks: 4,
          learningOutcomes: ["Count objects from 1-100", "Understand place value", "Add and subtract within 20"],
          keySkills: ["Counting", "Number recognition", "Basic addition", "Basic subtraction"],
          assessments: 3,
        },
        {
          id: "term1-shapes",
          title: "Term 1: Basic Shapes",
          description: "Identify and describe 2D shapes in the environment",
          status: "current",
          progress: 60,
          estimatedWeeks: 2,
          learningOutcomes: [
            "Identify circles, squares, triangles, rectangles",
            "Describe shape properties",
            "Find shapes in environment",
          ],
          keySkills: ["Shape recognition", "Spatial awareness", "Observation"],
          assessments: 2,
          prerequisites: ["term1-numbers"],
        },
        {
          id: "term2-measurement",
          title: "Term 2: Measurement Basics",
          description: "Compare and measure length, weight, and capacity",
          status: "upcoming",
          progress: 0,
          estimatedWeeks: 3,
          learningOutcomes: ["Compare objects by length", "Use non-standard units", "Understand heavy/light concepts"],
          keySkills: ["Comparison", "Measurement", "Estimation"],
          assessments: 2,
          prerequisites: ["term1-shapes"],
        },
        {
          id: "term2-patterns",
          title: "Term 2: Patterns and Sequences",
          description: "Recognize and create simple patterns",
          status: "locked",
          progress: 0,
          estimatedWeeks: 2,
          learningOutcomes: ["Identify repeating patterns", "Create simple patterns", "Extend pattern sequences"],
          keySkills: ["Pattern recognition", "Logical thinking", "Sequencing"],
          assessments: 1,
          prerequisites: ["term2-measurement"],
        },
        {
          id: "term3-data",
          title: "Term 3: Data and Graphs",
          description: "Collect and organize simple data",
          status: "locked",
          progress: 0,
          estimatedWeeks: 3,
          learningOutcomes: ["Collect simple data", "Create pictographs", "Answer questions about data"],
          keySkills: ["Data collection", "Organization", "Interpretation"],
          assessments: 2,
          prerequisites: ["term2-patterns"],
        },
      ]

      setProgressionData(mockProgression)
    } catch (error) {
      console.error("Error fetching progression data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "current":
        return <PlayCircle className="h-5 w-5 text-blue-500" />
      case "upcoming":
        return <Clock className="h-5 w-5 text-orange-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50"
      case "current":
        return "border-blue-500 bg-blue-50"
      case "upcoming":
        return "border-orange-500 bg-orange-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "current":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "upcoming":
        return <Badge className="bg-orange-500">Coming Soon</Badge>
      default:
        return <Badge variant="secondary">Locked</Badge>
    }
  }

  const calculateOverallProgress = () => {
    const totalNodes = progressionData.length
    const weightedProgress = progressionData.reduce((acc, node) => acc + node.progress, 0)
    return totalNodes > 0 ? weightedProgress / totalNodes : 0
  }

  const getCurrentTerm = () => {
    const currentNode = progressionData.find((node) => node.status === "current")
    return currentNode ? currentNode.title.split(":")[0] : "Term 1"
  }

  const getTimelinePosition = (index: number) => {
    const total = progressionData.length
    return (index / (total - 1)) * 100
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Curriculum Progression - Grade {gradeLevel.replace("grade", "")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(calculateOverallProgress())}%</div>
              <div className="text-sm text-gray-600">Year Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {progressionData.filter((n) => n.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600">Units Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{getCurrentTerm()}</div>
              <div className="text-sm text-gray-600">Current Term</div>
            </div>
          </div>
          <Progress value={calculateOverallProgress()} className="h-3" />
        </CardContent>
      </Card>

      {/* Timeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Learning Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200"></div>

            {/* Timeline nodes */}
            <div className="relative flex justify-between">
              {progressionData.map((node, index) => (
                <div key={node.id} className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      node.status === "completed"
                        ? "bg-green-500 border-green-500"
                        : node.status === "current"
                          ? "bg-blue-500 border-blue-500"
                          : node.status === "upcoming"
                            ? "bg-orange-500 border-orange-500"
                            : "bg-gray-300 border-gray-300"
                    }`}
                  ></div>
                  <div className="mt-2 text-xs text-center max-w-20">
                    <div className="font-medium">{node.title.split(":")[0]}</div>
                    <div className="text-gray-500">{node.estimatedWeeks}w</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Progression Cards */}
      <div className="space-y-4">
        {progressionData.map((node, index) => (
          <Card key={node.id} className={`border-2 ${getStatusColor(node.status)} transition-all hover:shadow-lg`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(node.status)}
                  <div>
                    <CardTitle className="text-lg">{node.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{node.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getStatusBadge(node.status)}
                  <div className="text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {node.estimatedWeeks} weeks
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Progress bar */}
                {node.status !== "locked" && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{node.progress}%</span>
                    </div>
                    <Progress value={node.progress} className="h-2" />
                  </div>
                )}

                {/* Learning Outcomes */}
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    Learning Outcomes
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {node.learningOutcomes.map((outcome, outcomeIndex) => (
                      <li key={outcomeIndex} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Skills */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {node.keySkills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Prerequisites */}
                {node.prerequisites && node.prerequisites.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Prerequisites</h4>
                    <div className="flex flex-wrap gap-1">
                      {node.prerequisites.map((prereq, prereqIndex) => (
                        <Badge key={prereqIndex} variant="secondary" className="text-xs">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-gray-500">{node.assessments} assessments</div>
                  <div className="space-x-2">
                    {node.status === "current" && (
                      <Button size="sm">
                        Continue Learning
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                    {node.status === "completed" && (
                      <Button size="sm" variant="outline">
                        Review
                        <BookOpen className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                    {node.status === "upcoming" && (
                      <Button size="sm" variant="outline" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
