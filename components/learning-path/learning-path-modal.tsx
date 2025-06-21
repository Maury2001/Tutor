"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  Trophy,
  Target,
  ArrowRight,
  Star,
  Calendar,
  TrendingUp,
  Award,
  MapPin,
} from "lucide-react"

interface LearningPathNode {
  id: string
  title: string
  description: string
  type: "strand" | "substrand" | "outcome" | "objective"
  status: "completed" | "in_progress" | "locked" | "available"
  progress: number
  estimatedTime: number
  prerequisites: string[]
  children?: LearningPathNode[]
  difficulty: "beginner" | "intermediate" | "advanced"
  skills: string[]
}

interface LearningPathModalProps {
  gradeLevel: string
  learningAreaId?: string
  trigger?: React.ReactNode
}

export function LearningPathModal({ gradeLevel, learningAreaId, trigger }: LearningPathModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedPath, setSelectedPath] = useState<string>("overview")
  const [pathData, setPathData] = useState<LearningPathNode[]>([])
  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    if (open) {
      fetchLearningPath()
    }
  }, [open, gradeLevel, learningAreaId])

  const fetchLearningPath = async () => {
    setLoading(true)
    try {
      // Simulate API call - replace with actual API
      const mockData: LearningPathNode[] = [
        {
          id: "math-numbers",
          title: "Numbers and Operations",
          description: "Master fundamental number concepts and basic operations",
          type: "strand",
          status: "completed",
          progress: 100,
          estimatedTime: 120,
          prerequisites: [],
          difficulty: "beginner",
          skills: ["Counting", "Addition", "Subtraction", "Place Value"],
          children: [
            {
              id: "counting-1-100",
              title: "Counting 1-100",
              description: "Learn to count objects and numbers from 1 to 100",
              type: "substrand",
              status: "completed",
              progress: 100,
              estimatedTime: 30,
              prerequisites: [],
              difficulty: "beginner",
              skills: ["One-to-one correspondence", "Number sequence"],
            },
            {
              id: "basic-addition",
              title: "Basic Addition",
              description: "Add numbers within 20 using various strategies",
              type: "substrand",
              status: "in_progress",
              progress: 65,
              estimatedTime: 45,
              prerequisites: ["counting-1-100"],
              difficulty: "beginner",
              skills: ["Mental math", "Number bonds", "Addition facts"],
            },
          ],
        },
        {
          id: "math-geometry",
          title: "Geometry and Shapes",
          description: "Explore 2D and 3D shapes and their properties",
          type: "strand",
          status: "available",
          progress: 0,
          estimatedTime: 90,
          prerequisites: ["math-numbers"],
          difficulty: "intermediate",
          skills: ["Shape recognition", "Spatial reasoning", "Measurement"],
          children: [
            {
              id: "2d-shapes",
              title: "2D Shapes",
              description: "Identify and describe circles, squares, triangles, and rectangles",
              type: "substrand",
              status: "locked",
              progress: 0,
              estimatedTime: 30,
              prerequisites: ["basic-addition"],
              difficulty: "beginner",
              skills: ["Shape identification", "Properties"],
            },
          ],
        },
        {
          id: "science-living-things",
          title: "Living Things",
          description: "Discover plants, animals, and their environments",
          type: "strand",
          status: "available",
          progress: 25,
          estimatedTime: 100,
          prerequisites: [],
          difficulty: "beginner",
          skills: ["Observation", "Classification", "Life cycles"],
          children: [
            {
              id: "plants-around-us",
              title: "Plants Around Us",
              description: "Observe and identify common plants in the environment",
              type: "substrand",
              status: "in_progress",
              progress: 40,
              estimatedTime: 35,
              prerequisites: [],
              difficulty: "beginner",
              skills: ["Plant identification", "Plant parts", "Plant care"],
            },
          ],
        },
      ]

      setPathData(mockData)

      // Mock user progress
      setUserProgress({
        "math-numbers": 100,
        "counting-1-100": 100,
        "basic-addition": 65,
        "math-geometry": 0,
        "science-living-things": 25,
        "plants-around-us": 40,
      })
    } catch (error) {
      console.error("Error fetching learning path:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string, progress: number) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in_progress":
        return <PlayCircle className="h-5 w-5 text-blue-500" />
      case "locked":
        return <Clock className="h-5 w-5 text-gray-400" />
      default:
        return <Target className="h-5 w-5 text-orange-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50"
      case "in_progress":
        return "border-blue-500 bg-blue-50"
      case "locked":
        return "border-gray-300 bg-gray-50"
      default:
        return "border-orange-500 bg-orange-50"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateOverallProgress = () => {
    const totalNodes = pathData.length
    const completedNodes = pathData.filter((node) => node.status === "completed").length
    return totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0
  }

  const getRecommendedNext = () => {
    return pathData.find((node) => node.status === "available" || node.status === "in_progress")
  }

  const renderPathVisualization = () => (
    <div className="space-y-6">
      {pathData.map((node, index) => (
        <div key={node.id} className="relative">
          {/* Connection line to next node */}
          {index < pathData.length - 1 && <div className="absolute left-6 top-20 w-0.5 h-16 bg-gray-200 z-0"></div>}

          <Card className={`relative z-10 border-2 ${getStatusColor(node.status)} transition-all hover:shadow-lg`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(node.status, node.progress)}
                  <div>
                    <CardTitle className="text-lg">{node.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{node.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getDifficultyColor(node.difficulty)}>{node.difficulty}</Badge>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {node.estimatedTime} min
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{node.progress}%</span>
                  </div>
                  <Progress value={node.progress} className="h-2" />
                </div>

                {/* Skills */}
                <div>
                  <p className="text-sm font-medium mb-2">Skills you'll learn:</p>
                  <div className="flex flex-wrap gap-1">
                    {node.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Prerequisites */}
                {node.prerequisites.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Prerequisites:</p>
                    <div className="flex flex-wrap gap-1">
                      {node.prerequisites.map((prereq, prereqIndex) => (
                        <Badge key={prereqIndex} variant="secondary" className="text-xs">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action button */}
                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-gray-500">{node.children?.length || 0} sub-topics</div>
                  <Button
                    size="sm"
                    disabled={node.status === "locked"}
                    variant={node.status === "completed" ? "outline" : "default"}
                  >
                    {node.status === "completed"
                      ? "Review"
                      : node.status === "in_progress"
                        ? "Continue"
                        : node.status === "locked"
                          ? "Locked"
                          : "Start"}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sub-nodes */}
          {node.children && node.children.length > 0 && (
            <div className="ml-8 mt-4 space-y-3">
              {node.children.map((child, childIndex) => (
                <Card key={child.id} className={`border ${getStatusColor(child.status)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(child.status, child.progress)}
                        <div>
                          <h4 className="font-medium">{child.title}</h4>
                          <p className="text-sm text-gray-600">{child.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{child.progress}%</div>
                        <div className="text-xs text-gray-500">{child.estimatedTime} min</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderProgressOverview = () => {
    const overallProgress = calculateOverallProgress()
    const recommendedNext = getRecommendedNext()
    const totalTime = pathData.reduce((acc, node) => acc + node.estimatedTime, 0)
    const completedTime = pathData.reduce((acc, node) => acc + node.estimatedTime * (node.progress / 100), 0)

    return (
      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{Math.round(completedTime / 60)}h</div>
              <div className="text-sm text-gray-600">Time Invested</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{pathData.filter((n) => n.status === "completed").length}</div>
              <div className="text-sm text-gray-600">Topics Mastered</div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Next */}
        {recommendedNext && (
          <Card className="border-2 border-blue-500 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Star className="h-5 w-5 mr-2" />
                Recommended Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">{recommendedNext.title}</h3>
                  <p className="text-blue-700 text-sm">{recommendedNext.description}</p>
                  <div className="flex items-center mt-2 text-sm text-blue-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {recommendedNext.estimatedTime} minutes
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  {recommendedNext.status === "in_progress" ? "Continue" : "Start"}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Learning Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "First Steps", description: "Complete your first learning objective", achieved: true },
                { title: "Number Master", description: "Master all number operations", achieved: true },
                { title: "Shape Explorer", description: "Complete geometry fundamentals", achieved: false },
                { title: "Science Discoverer", description: "Explore living things", achieved: false },
                { title: "Grade Champion", description: "Complete 80% of grade curriculum", achieved: false },
              ].map((milestone, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.achieved ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {milestone.achieved ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className={`font-medium ${milestone.achieved ? "text-green-700" : "text-gray-700"}`}>
                      {milestone.title}
                    </div>
                    <div className="text-sm text-gray-600">{milestone.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderStudyPlan = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Weekly Study Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center font-medium text-sm text-gray-600 p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, i) => (
              <Card key={i} className="p-3 min-h-[100px]">
                <div className="text-xs space-y-1">
                  {i < 5 && (
                    <>
                      <div className="bg-blue-100 text-blue-800 p-1 rounded text-center">Math</div>
                      <div className="bg-green-100 text-green-800 p-1 rounded text-center">Science</div>
                    </>
                  )}
                  {i === 5 && <div className="bg-purple-100 text-purple-800 p-1 rounded text-center">Review</div>}
                  {i === 6 && <div className="bg-orange-100 text-orange-800 p-1 rounded text-center">Practice</div>}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Learning Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { goal: "Complete Basic Addition", progress: 65, target: 100, deadline: "2 days" },
              { goal: "Master 2D Shapes", progress: 0, target: 100, deadline: "1 week" },
              { goal: "Explore Plant Life", progress: 40, target: 100, deadline: "3 days" },
            ].map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{goal.goal}</span>
                  <span className="text-gray-500">Due in {goal.deadline}</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="text-xs text-gray-600">
                  {goal.progress}% of {goal.target}% target
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            View Learning Path
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Learning Path - Grade {gradeLevel.replace("grade", "")}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedPath} onValueChange={setSelectedPath} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="path">Learning Path</TabsTrigger>
            <TabsTrigger value="plan">Study Plan</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[600px] mt-4">
            <TabsContent value="overview" className="mt-0">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                renderProgressOverview()
              )}
            </TabsContent>

            <TabsContent value="path" className="mt-0">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                renderPathVisualization()
              )}
            </TabsContent>

            <TabsContent value="plan" className="mt-0">
              {renderStudyPlan()}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
