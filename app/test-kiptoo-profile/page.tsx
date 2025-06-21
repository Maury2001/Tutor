"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  User,
  BookOpen,
  TrendingDown,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  HandHeart,
  Lightbulb,
  Activity,
  Award,
} from "lucide-react"

// Kiptoo's detailed profile - struggling student
const kiptooProfile = {
  studentId: "student_002",
  name: "Kiptoo Kiprotich",
  gradeLevel: "Grade 6",
  subject: "Science",
  learningStyle: "kinesthetic",
  currentTopic: "Plant Growth",
  difficulty: "easy",
  learningHistory: [
    {
      topic: "Animal Classification",
      score: 0.45,
      timeSpent: 40,
      helpRequested: true,
      attempts: 3,
      strugglingAreas: ["Vertebrates vs Invertebrates", "Mammal characteristics"],
      completionDate: "2024-01-15",
    },
    {
      topic: "Water Cycle",
      score: 0.52,
      timeSpent: 38,
      helpRequested: true,
      attempts: 2,
      strugglingAreas: ["Evaporation process", "Condensation"],
      completionDate: "2024-01-20",
    },
    {
      topic: "Soil Types",
      score: 0.48,
      timeSpent: 42,
      helpRequested: true,
      attempts: 3,
      strugglingAreas: ["Clay soil properties", "Soil formation"],
      completionDate: "2024-01-25",
    },
    {
      topic: "Weather Patterns",
      score: 0.55,
      timeSpent: 35,
      helpRequested: false,
      attempts: 2,
      strugglingAreas: ["Cloud types"],
      completionDate: "2024-01-30",
    },
  ],
  additionalContext: {
    preferredLanguage: "English with some Kiswahili",
    homeEnvironment: "Rural Kenya - farming family",
    interests: ["Football", "Animals", "Farming"],
    challenges: ["Abstract concepts", "Reading comprehension", "Confidence"],
    strengths: ["Practical activities", "Observation skills", "Persistence"],
  },
}

export default function TestKiptooProfile() {
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testStage, setTestStage] = useState<"profile" | "testing" | "results">("profile")

  const testAdaptiveAPI = async () => {
    setIsLoading(true)
    setError(null)
    setTestStage("testing")

    try {
      const response = await fetch("/api/ai/adaptive-learning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: kiptooProfile.studentId,
          gradeLevel: kiptooProfile.gradeLevel,
          subject: kiptooProfile.subject,
          currentTopic: kiptooProfile.currentTopic,
          difficulty: kiptooProfile.difficulty,
          learningStyle: kiptooProfile.learningStyle,
          learningHistory: kiptooProfile.learningHistory,
          additionalContext: kiptooProfile.additionalContext,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setApiResponse(data)
      setTestStage("results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      setTestStage("profile")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAverageScore = () => {
    const scores = kiptooProfile.learningHistory.map((h) => h.score)
    return scores.reduce((sum, score) => sum + score, 0) / scores.length
  }

  const getHelpRequestRate = () => {
    const helpRequests = kiptooProfile.learningHistory.filter((h) => h.helpRequested).length
    return (helpRequests / kiptooProfile.learningHistory.length) * 100
  }

  const averageScore = calculateAverageScore()
  const helpRequestRate = getHelpRequestRate()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <HandHeart className="h-8 w-8 text-blue-500" />
          Kiptoo's Adaptive Learning Support Test
        </h1>
        <p className="text-muted-foreground">Testing AI adaptations for a struggling student who needs extra support</p>
      </div>

      {/* Student Profile Analysis */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <User className="h-5 w-5" />
            Student Profile: {kiptooProfile.name}
            <Badge variant="outline" className="bg-orange-100">
              Needs Support
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Grade Level</span>
              <div className="font-semibold">{kiptooProfile.gradeLevel}</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Subject</span>
              <div className="font-semibold">{kiptooProfile.subject}</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Current Topic</span>
              <div className="font-semibold">{kiptooProfile.currentTopic}</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Learning Style</span>
              <div className="font-semibold capitalize">{kiptooProfile.learningStyle}</div>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Average Performance</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-red-600">{(averageScore * 100).toFixed(0)}%</div>
                  <Progress value={averageScore * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground">Below grade level expectations (70%+)</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Help Requests</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-yellow-600">{helpRequestRate.toFixed(0)}%</div>
                  <Progress value={helpRequestRate} className="h-2" />
                  <div className="text-xs text-muted-foreground">High frequency of help requests</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Time Investment</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {kiptooProfile.learningHistory.reduce((sum, h) => sum + h.timeSpent, 0)}min
                  </div>
                  <div className="text-xs text-muted-foreground">High effort, needs efficiency improvement</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning History Details */}
          <div>
            <h4 className="font-semibold mb-3">Recent Learning History</h4>
            <div className="space-y-2">
              {kiptooProfile.learningHistory.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex-1">
                    <div className="font-medium">{item.topic}</div>
                    <div className="text-sm text-muted-foreground">
                      Struggling with: {item.strugglingAreas.join(", ")}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={item.score < 0.6 ? "destructive" : "secondary"}>
                      {(item.score * 100).toFixed(0)}%
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {item.attempts} attempts, {item.timeSpent}min
                    </div>
                    {item.helpRequested && (
                      <Badge variant="outline" className="text-xs">
                        Help Requested
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-green-600 mb-2">Strengths</h5>
              <ul className="text-sm space-y-1">
                {kiptooProfile.additionalContext.strengths.map((strength, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-red-600 mb-2">Challenges</h5>
              <ul className="text-sm space-y-1">
                {kiptooProfile.additionalContext.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button onClick={testAdaptiveAPI} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Support Adaptations...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Test Adaptive Support for Kiptoo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Error testing API: {error}</AlertDescription>
        </Alert>
      )}

      {/* API Response - Support Adaptations */}
      {apiResponse && (
        <div className="space-y-6">
          {/* Adaptation Summary */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Target className="h-5 w-5" />
                AI Support Adaptations Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {apiResponse.studentProfile.originalDifficulty} → {apiResponse.studentProfile.adaptedDifficulty}
                  </div>
                  <div className="text-sm text-muted-foreground">Difficulty Reduced</div>
                </div>
                <div className="text-center p-4 bg-white rounded">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {apiResponse.studentProfile.performanceAnalysis.engagementLevel}
                  </div>
                  <div className="text-sm text-muted-foreground">Engagement Level</div>
                </div>
                <div className="text-center p-4 bg-white rounded">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Kinesthetic</div>
                  <div className="text-sm text-muted-foreground">Hands-on Focus</div>
                </div>
              </div>

              <Alert className="mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Adaptation Reason:</strong> {apiResponse.metadata.adaptationReason}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Support Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HandHeart className="h-5 w-5 text-blue-500" />
                Personalized Support Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {apiResponse.recommendations && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apiResponse.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-blue-800 mb-1">Support Strategy</div>
                        <div className="text-sm text-blue-700">{rec}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Kinesthetic Learning Adaptations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                Kinesthetic Learning Adaptations for Plant Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-semibold text-orange-800 mb-2">🌱 Hands-On Activities</h5>
                  <ul className="text-sm space-y-1 text-orange-700">
                    <li>• Plant bean seeds in different soil types</li>
                    <li>• Create a classroom garden to observe daily growth</li>
                    <li>• Build models of plant parts using clay or recycled materials</li>
                    <li>• Conduct water absorption experiments with celery stalks</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">🔬 Interactive Experiments</h5>
                  <ul className="text-sm space-y-1 text-green-700">
                    <li>• Test how light affects plant growth using cardboard boxes</li>
                    <li>• Measure and record plant height daily</li>
                    <li>• Compare plants grown with/without fertilizer</li>
                    <li>• Create a photosynthesis demonstration with aquatic plants</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">🎯 Real-World Connections</h5>
                  <ul className="text-sm space-y-1 text-blue-700">
                    <li>• Visit local farms to see crop growth stages</li>
                    <li>• Interview farmers about plant care techniques</li>
                    <li>• Start a school vegetable garden project</li>
                    <li>• Connect to family farming experiences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confidence Building Measures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Confidence Building & Motivation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-semibold text-yellow-800">Achievement Recognition</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Celebrate small wins and progress</li>
                    <li>• Use visual progress charts</li>
                    <li>• Peer recognition for effort</li>
                    <li>• Connect learning to student interests (football, animals)</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h5 className="font-semibold text-green-800">Scaffolding Support</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Break complex concepts into smaller steps</li>
                    <li>• Provide visual aids and diagrams</li>
                    <li>• Use Kiswahili terms when helpful</li>
                    <li>• Encourage questions without judgment</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Learning Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                AI-Generated Support Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                  {typeof apiResponse.adaptiveLearningPlan === "string"
                    ? apiResponse.adaptiveLearningPlan
                    : JSON.stringify(apiResponse.adaptiveLearningPlan, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Success Metrics */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Expected Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">60-70%</div>
                  <div className="text-sm text-green-700">Target Score Range</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">↓50%</div>
                  <div className="text-sm text-blue-700">Reduced Help Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">↑High</div>
                  <div className="text-sm text-purple-700">Increased Confidence</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
