"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  Lightbulb,
  Star,
  ChevronRight,
  User,
  Briefcase,
  GraduationCap,
  Heart,
  Zap,
  Globe,
} from "lucide-react"

interface LearningPathData {
  studentId: string
  overallAnalysis: string
  personalityAssessment?: {
    dimensions: {
      learning_style: string
      thinking_style: string
      social_preference: string
      motivation_type: string
    }
    summary: string
    aiAssessment?: string
  }
  learningAreas: Array<{
    area: string
    areaKiswahili: string
    currentScore: number
    engagement: number
    timeSpent: number
    struggles: string[]
    strengths: string[]
    aiRecommendations: string
    nextTopics: string[]
    personalityAlignment: number
  }>
  cbcPathways: Array<{
    id: string
    name: string
    nameKiswahili: string
    description: string
    matchScore: number
    personalityFit: number
    careerOpportunities: string[]
  }>
  careerGuidance: {
    topRecommendations: Array<{
      career: string
      area: string
      matchScore: number
      personalityAlignment: number
    }>
  }
  personalizedStrategies?: Array<{
    type: string
    strategy: string
    implementation: string
  }>
  nextSteps?: Array<{
    priority: string
    area: string
    action: string
    timeline: string
    resources: string[]
  }>
  aiRecommendations?: {
    adaptiveLearning: string
    personalizedContent: string
    progressTracking: string
    careerGuidance: string
    mentorship: string
  }
}

export default function LearningPathPage() {
  const [learningPath, setLearningPath] = useState<LearningPathData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [includePersonality, setIncludePersonality] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "kiswahili">("english")

  useEffect(() => {
    fetchLearningPath()
  }, [includePersonality])

  const fetchLearningPath = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/learning-path?personality=${includePersonality}&studentId=demo-student`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setLearningPath(data.data)
      } else {
        throw new Error(data.error || "Failed to fetch learning path")
      }
    } catch (err) {
      console.error("Error fetching learning path:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getPersonalityIcon = (dimension: string) => {
    const icons = {
      visual: "👁️",
      auditory: "👂",
      kinesthetic: "✋",
      reading_writing: "📝",
      analytical: "🧮",
      creative: "🎨",
      practical: "🔧",
      theoretical: "💭",
      collaborative: "👥",
      independent: "🚶",
      competitive: "🏆",
      supportive: "🤝",
      intrinsic: "💡",
      extrinsic: "🎯",
      achievement: "🏅",
      social: "👫",
    }
    return icons[dimension as keyof typeof icons] || "⭐"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Analyzing Your Learning Journey...</h2>
          <p className="text-gray-500 mt-2">AI is processing your performance across all CBC learning areas</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Learning Path</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchLearningPath} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!learningPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-6">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Learning Path Data</h2>
            <p className="text-gray-600 mb-4">Unable to generate your personalized learning path</p>
            <Button onClick={fetchLearningPath} className="w-full">
              Generate Learning Path
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI-Powered CBC Learning Path</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Personalized learning journey with AI feedback, personality assessment, and career guidance
          </p>

          {/* Language Toggle */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              variant={selectedLanguage === "english" ? "default" : "outline"}
              onClick={() => setSelectedLanguage("english")}
              size="sm"
            >
              English
            </Button>
            <Button
              variant={selectedLanguage === "kiswahili" ? "default" : "outline"}
              onClick={() => setSelectedLanguage("kiswahili")}
              size="sm"
            >
              Kiswahili
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="subjects">Learning Areas</TabsTrigger>
            <TabsTrigger value="pathways">CBC Pathways</TabsTrigger>
            <TabsTrigger value="careers">Career Guidance</TabsTrigger>
            <TabsTrigger value="strategies">AI Strategies</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  AI Learning Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">{learningPath.overallAnalysis}</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{learningPath.learningAreas.length}</div>
                  <div className="text-sm text-gray-600">Learning Areas</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(
                      learningPath.learningAreas.reduce((sum, area) => sum + area.currentScore, 0) /
                        learningPath.learningAreas.length,
                    )}
                    %
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(
                      learningPath.learningAreas.reduce((sum, area) => sum + area.engagement, 0) /
                        learningPath.learningAreas.length,
                    )}
                    %
                  </div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {learningPath.careerGuidance.topRecommendations.length}
                  </div>
                  <div className="text-sm text-gray-600">Career Options</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Personality Tab */}
          <TabsContent value="personality" className="space-y-6">
            {learningPath.personalityAssessment ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-6 h-6 text-purple-600" />
                      AI Personality Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">Personality Summary</h4>
                        <p className="text-purple-700">{learningPath.personalityAssessment.summary}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(learningPath.personalityAssessment.dimensions).map(([dimension, value]) => (
                          <div key={dimension} className="bg-white border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{getPersonalityIcon(value)}</span>
                              <h4 className="font-semibold capitalize">{dimension.replace("_", " ")}</h4>
                            </div>
                            <Badge variant="secondary" className="capitalize">
                              {value.replace("_", " ")}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {learningPath.personalityAssessment.aiAssessment && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">Detailed AI Analysis</h4>
                          <div className="whitespace-pre-wrap text-blue-700">
                            {learningPath.personalityAssessment.aiAssessment}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center p-8">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Personality Assessment Not Available</h3>
                  <p className="text-gray-500 mb-4">
                    Enable personality assessment to get deeper insights into your learning style
                  </p>
                  <Button onClick={() => setIncludePersonality(true)}>Enable Personality Assessment</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Learning Areas Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPath.learningAreas.map((area, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <div className="text-lg">
                          {selectedLanguage === "kiswahili" ? area.areaKiswahili : area.area}
                        </div>
                        <div className="text-sm text-gray-500 font-normal">
                          {selectedLanguage === "kiswahili" ? area.area : area.areaKiswahili}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {area.currentScore}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bars */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Performance</span>
                        <span>{area.currentScore}%</span>
                      </div>
                      <Progress value={area.currentScore} className="h-2" />

                      <div className="flex justify-between text-sm">
                        <span>Engagement</span>
                        <span>{area.engagement}%</span>
                      </div>
                      <Progress value={area.engagement} className="h-2" />
                    </div>

                    {/* Strengths and Struggles */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-green-700 mb-1">Strengths</h5>
                        <div className="space-y-1">
                          {area.strengths.map((strength, i) => (
                            <Badge key={i} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {area.struggles.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-orange-700 mb-1">Focus Areas</h5>
                          <div className="space-y-1">
                            {area.struggles.map((struggle, i) => (
                              <Badge key={i} variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                                {struggle}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Recommendations */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-blue-800 text-sm">AI Recommendation</h5>
                          <p className="text-blue-700 text-sm">{area.aiRecommendations}</p>
                        </div>
                      </div>
                    </div>

                    {/* Next Topics */}
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Next Topics</h5>
                      <div className="space-y-1">
                        {area.nextTopics.map((topic, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <ChevronRight className="w-3 h-3" />
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* CBC Pathways Tab */}
          <TabsContent value="pathways" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPath.cbcPathways.map((pathway, index) => (
                <Card key={pathway.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <div className="text-lg">
                          {selectedLanguage === "kiswahili" ? pathway.nameKiswahili : pathway.name}
                        </div>
                        <div className="text-sm text-gray-500 font-normal">{pathway.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round((pathway.matchScore + pathway.personalityFit) / 2)}%
                        </div>
                        <div className="text-xs text-gray-500">Overall Match</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Match Scores */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Academic Match</span>
                          <span>{pathway.matchScore}%</span>
                        </div>
                        <Progress value={pathway.matchScore} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Personality Fit</span>
                          <span>{pathway.personalityFit}%</span>
                        </div>
                        <Progress value={pathway.personalityFit} className="h-2" />
                      </div>
                    </div>

                    {/* Career Opportunities */}
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Career Opportunities</h5>
                      <div className="flex flex-wrap gap-1">
                        {pathway.careerOpportunities.map((career, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {career}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {index === 0 && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-800 text-sm">Top Recommendation</span>
                        </div>
                        <p className="text-green-700 text-sm mt-1">
                          This pathway aligns best with your current performance and personality profile.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Career Guidance Tab */}
          <TabsContent value="careers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                  AI-Powered Career Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {learningPath.careerGuidance.topRecommendations.map((career, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{career.career}</h4>
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        Based on {selectedLanguage === "kiswahili" ? "your performance in" : ""} {career.area}
                      </p>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Academic Match</span>
                            <span>{career.matchScore}%</span>
                          </div>
                          <Progress value={career.matchScore} className="h-1" />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Personality Fit</span>
                            <span>{career.personalityAlignment}%</span>
                          </div>
                          <Progress value={career.personalityAlignment} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Strategies Tab */}
          <TabsContent value="strategies" className="space-y-6">
            {/* Personalized Strategies */}
            {learningPath.personalizedStrategies && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-600" />
                    Personalized Learning Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningPath.personalizedStrategies.map((strategy, index) => (
                      <div key={index} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            {strategy.type}
                          </Badge>
                          <div className="flex-1">
                            <h4 className="font-semibold text-yellow-800 mb-1">{strategy.strategy}</h4>
                            <p className="text-yellow-700 text-sm">{strategy.implementation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            {learningPath.nextSteps && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    Next Steps & Action Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningPath.nextSteps.map((step, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Badge className={getPriorityColor(step.priority)}>{step.priority} Priority</Badge>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-1">{step.action}</h4>
                            <p className="text-gray-600 text-sm mb-2">
                              <strong>Area:</strong> {step.area} | <strong>Timeline:</strong> {step.timeline}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {step.resources.map((resource, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {resource}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Recommendations */}
            {learningPath.aiRecommendations && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-600" />
                    AI-Powered Learning Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(learningPath.aiRecommendations).map(([key, value]) => (
                      <div key={key} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </h4>
                        <p className="text-purple-700 text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Button onClick={fetchLearningPath} className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Refresh AI Analysis
          </Button>

          <Button
            variant="outline"
            onClick={() => setIncludePersonality(!includePersonality)}
            className="flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            {includePersonality ? "Disable" : "Enable"} Personality Assessment
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Explore CBC Pathways
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Career Exploration
          </Button>
        </div>
      </div>
    </div>
  )
}
