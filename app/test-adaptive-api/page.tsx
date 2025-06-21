"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, User, BookOpen, TrendingUp, Target, Clock, Star, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface StudentProfile {
  studentId: string
  name: string
  gradeLevel: string
  subject: string
  learningStyle: string
  currentTopic: string
  difficulty: string
  learningHistory: any[]
}

const sampleProfiles: StudentProfile[] = [
  {
    studentId: "student_001",
    name: "Amina Wanjiku",
    gradeLevel: "Grade 4",
    subject: "Mathematics",
    learningStyle: "visual",
    currentTopic: "Fractions",
    difficulty: "medium",
    learningHistory: [
      { topic: "Addition", score: 0.85, timeSpent: 25, helpRequested: false },
      { topic: "Subtraction", score: 0.78, timeSpent: 30, helpRequested: true },
      { topic: "Multiplication", score: 0.92, timeSpent: 20, helpRequested: false },
      { topic: "Division", score: 0.65, timeSpent: 35, helpRequested: true },
      { topic: "Place Value", score: 0.88, timeSpent: 22, helpRequested: false },
    ],
  },
  {
    studentId: "student_002",
    name: "Kiptoo Kiprotich",
    gradeLevel: "Grade 6",
    subject: "Science",
    learningStyle: "kinesthetic",
    currentTopic: "Plant Growth",
    difficulty: "easy",
    learningHistory: [
      { topic: "Animal Classification", score: 0.45, timeSpent: 40, helpRequested: true },
      { topic: "Water Cycle", score: 0.52, timeSpent: 38, helpRequested: true },
      { topic: "Soil Types", score: 0.48, timeSpent: 42, helpRequested: true },
      { topic: "Weather Patterns", score: 0.55, timeSpent: 35, helpRequested: false },
    ],
  },
  {
    studentId: "student_003",
    name: "Grace Achieng",
    gradeLevel: "Grade 8",
    subject: "English",
    learningStyle: "reading",
    currentTopic: "Essay Writing",
    difficulty: "hard",
    learningHistory: [
      { topic: "Grammar", score: 0.95, timeSpent: 18, helpRequested: false },
      { topic: "Vocabulary", score: 0.92, timeSpent: 20, helpRequested: false },
      { topic: "Reading Comprehension", score: 0.88, timeSpent: 25, helpRequested: false },
      { topic: "Creative Writing", score: 0.85, timeSpent: 30, helpRequested: false },
      { topic: "Poetry Analysis", score: 0.9, timeSpent: 28, helpRequested: false },
    ],
  },
  {
    studentId: "student_004",
    name: "Omar Hassan",
    gradeLevel: "Grade 5",
    subject: "Social Studies",
    learningStyle: "auditory",
    currentTopic: "Kenyan Geography",
    difficulty: "medium",
    learningHistory: [
      { topic: "Counties of Kenya", score: 0.72, timeSpent: 28, helpRequested: false },
      { topic: "Physical Features", score: 0.68, timeSpent: 32, helpRequested: true },
      { topic: "Climate Zones", score: 0.75, timeSpent: 26, helpRequested: false },
      { topic: "Natural Resources", score: 0.7, timeSpent: 30, helpRequested: false },
    ],
  },
]

export default function TestAdaptiveAPI() {
  const [selectedProfile, setSelectedProfile] = useState<StudentProfile | null>(null)
  const [customProfile, setCustomProfile] = useState<Partial<StudentProfile>>({})
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useCustomProfile, setUseCustomProfile] = useState(false)

  const testAdaptiveAPI = async (profile: StudentProfile) => {
    setIsLoading(true)
    setError(null)
    setApiResponse(null)

    try {
      const response = await fetch("/api/ai/adaptive-learning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: profile.studentId,
          gradeLevel: profile.gradeLevel,
          subject: profile.subject,
          currentTopic: profile.currentTopic,
          difficulty: profile.difficulty,
          learningStyle: profile.learningStyle,
          learningHistory: profile.learningHistory,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setApiResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAverageScore = (history: any[]) => {
    if (!history || history.length === 0) return 0
    return history.reduce((sum, item) => sum + item.score, 0) / history.length
  }

  const getPerformanceTrend = (history: any[]) => {
    if (!history || history.length < 2) return "neutral"
    const recent = history.slice(-3)
    const older = history.slice(0, -3)
    const recentAvg = recent.reduce((sum, item) => sum + item.score, 0) / recent.length
    const olderAvg = older.length > 0 ? older.reduce((sum, item) => sum + item.score, 0) / older.length : recentAvg

    if (recentAvg > olderAvg + 0.1) return "improving"
    if (recentAvg < olderAvg - 0.1) return "declining"
    return "stable"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          CBC Adaptive Learning API Tester
        </h1>
        <p className="text-muted-foreground">
          Test the adaptive learning API with different student profiles and see personalized learning plans
        </p>
      </div>

      {/* Profile Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Profiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleProfiles.map((profile) => {
              const avgScore = calculateAverageScore(profile.learningHistory)
              const trend = getPerformanceTrend(profile.learningHistory)

              return (
                <Card
                  key={profile.studentId}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedProfile?.studentId === profile.studentId ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedProfile(profile)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{profile.name}</h3>
                        <Badge variant="outline">{profile.gradeLevel}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Subject:</span>
                          <div className="font-medium">{profile.subject}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Topic:</span>
                          <div className="font-medium">{profile.currentTopic}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Style:</span>
                          <div className="font-medium capitalize">{profile.learningStyle}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Difficulty:</span>
                          <div className="font-medium capitalize">{profile.difficulty}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Average Score</span>
                          <span className="font-medium">{(avgScore * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={avgScore * 100} className="h-2" />

                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp
                            className={`h-4 w-4 ${
                              trend === "improving"
                                ? "text-green-500"
                                : trend === "declining"
                                  ? "text-red-500"
                                  : "text-yellow-500"
                            }`}
                          />
                          <span className="capitalize">{trend} trend</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {profile.learningHistory.length} learning sessions recorded
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedProfile && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Selected Profile: {selectedProfile.name}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ID:</span>
                  <div className="font-mono">{selectedProfile.studentId}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Grade:</span>
                  <div>{selectedProfile.gradeLevel}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Subject:</span>
                  <div>{selectedProfile.subject}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Learning Style:</span>
                  <div className="capitalize">{selectedProfile.learningStyle}</div>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  onClick={() => testAdaptiveAPI(selectedProfile)}
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Adaptive Plan...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Test Adaptive Learning API
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error testing API: {error}</AlertDescription>
        </Alert>
      )}

      {/* API Response */}
      {apiResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Adaptive Learning Plan Generated
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student Profile Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Difficulty Adaptation</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>
                      Original: <Badge variant="outline">{apiResponse.studentProfile.originalDifficulty}</Badge>
                    </div>
                    <div>
                      Adapted: <Badge variant="default">{apiResponse.studentProfile.adaptedDifficulty}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Performance</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>
                      Average: {(apiResponse.studentProfile.performanceAnalysis.averageScore * 100).toFixed(0)}%
                    </div>
                    <div>
                      Trend:{" "}
                      <Badge variant="secondary">{apiResponse.studentProfile.performanceAnalysis.learningTrend}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Engagement</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>
                      Level:{" "}
                      <Badge variant="secondary">
                        {apiResponse.studentProfile.performanceAnalysis.engagementLevel}
                      </Badge>
                    </div>
                    <div>Time: {apiResponse.studentProfile.performanceAnalysis.timeSpentLearning}min</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Adaptation Reason */}
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <strong>Adaptation Reason:</strong> {apiResponse.metadata.adaptationReason}
              </AlertDescription>
            </Alert>

            {/* Learning Plan */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Personalized Learning Plan
              </h4>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                  {typeof apiResponse.adaptiveLearningPlan === "string"
                    ? apiResponse.adaptiveLearningPlan
                    : JSON.stringify(apiResponse.adaptiveLearningPlan, null, 2)}
                </pre>
              </div>
            </div>

            {/* Recommendations */}
            {apiResponse.recommendations && apiResponse.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">AI Recommendations</h4>
                <div className="space-y-2">
                  {apiResponse.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw API Response */}
            <details className="mt-4">
              <summary className="cursor-pointer font-medium">View Raw API Response</summary>
              <div className="mt-2 p-4 bg-gray-100 rounded-lg overflow-auto">
                <pre className="text-xs">{JSON.stringify(apiResponse, null, 2)}</pre>
              </div>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
