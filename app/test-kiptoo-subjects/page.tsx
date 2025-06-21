"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  BookOpen,
  Globe,
  Beaker,
  Languages,
  User,
  Activity,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Target,
  Lightbulb,
} from "lucide-react"

// Kiptoo's base profile with subject-specific learning histories
const kiptooBaseProfile = {
  studentId: "student_002",
  name: "Kiptoo Kiprotich",
  gradeLevel: "Grade 6",
  learningStyle: "kinesthetic",
  difficulty: "easy",
  additionalContext: {
    preferredLanguage: "English with some Kiswahili",
    homeEnvironment: "Rural Kenya - farming family",
    interests: ["Football", "Animals", "Farming"],
    challenges: ["Abstract concepts", "Reading comprehension", "Confidence"],
    strengths: ["Practical activities", "Observation skills", "Persistence"],
  },
}

const subjectProfiles = {
  Mathematics: {
    ...kiptooBaseProfile,
    subject: "Mathematics",
    currentTopic: "Fractions and Decimals",
    learningHistory: [
      {
        topic: "Addition and Subtraction",
        score: 0.52,
        timeSpent: 45,
        helpRequested: true,
        attempts: 3,
        strugglingAreas: ["Borrowing in subtraction", "Word problems"],
        completionDate: "2024-01-15",
      },
      {
        topic: "Multiplication Tables",
        score: 0.48,
        timeSpent: 50,
        helpRequested: true,
        attempts: 4,
        strugglingAreas: ["7x, 8x, 9x tables", "Mental math"],
        completionDate: "2024-01-20",
      },
      {
        topic: "Basic Geometry",
        score: 0.55,
        timeSpent: 40,
        helpRequested: false,
        attempts: 2,
        strugglingAreas: ["Angle measurement"],
        completionDate: "2024-01-25",
      },
    ],
  },
  English: {
    ...kiptooBaseProfile,
    subject: "English",
    currentTopic: "Creative Writing",
    learningHistory: [
      {
        topic: "Reading Comprehension",
        score: 0.45,
        timeSpent: 35,
        helpRequested: true,
        attempts: 3,
        strugglingAreas: ["Inference questions", "Vocabulary"],
        completionDate: "2024-01-15",
      },
      {
        topic: "Grammar - Tenses",
        score: 0.5,
        timeSpent: 42,
        helpRequested: true,
        attempts: 2,
        strugglingAreas: ["Past perfect tense", "Future tense"],
        completionDate: "2024-01-20",
      },
      {
        topic: "Oral Presentation",
        score: 0.58,
        timeSpent: 30,
        helpRequested: false,
        attempts: 1,
        strugglingAreas: ["Confidence speaking"],
        completionDate: "2024-01-25",
      },
    ],
  },
  "Social Studies": {
    ...kiptooBaseProfile,
    subject: "Social Studies",
    currentTopic: "Kenyan Government",
    learningHistory: [
      {
        topic: "Physical Features of Kenya",
        score: 0.62,
        timeSpent: 38,
        helpRequested: false,
        attempts: 2,
        strugglingAreas: ["Map reading"],
        completionDate: "2024-01-15",
      },
      {
        topic: "Kenyan Communities",
        score: 0.55,
        timeSpent: 40,
        helpRequested: true,
        attempts: 2,
        strugglingAreas: ["Cultural practices", "Traditional governance"],
        completionDate: "2024-01-20",
      },
      {
        topic: "Economic Activities",
        score: 0.58,
        timeSpent: 35,
        helpRequested: false,
        attempts: 1,
        strugglingAreas: ["Trade concepts"],
        completionDate: "2024-01-25",
      },
    ],
  },
  Kiswahili: {
    ...kiptooBaseProfile,
    subject: "Kiswahili",
    currentTopic: "Uandishi wa Insha",
    learningHistory: [
      {
        topic: "Sarufi - Nomino",
        score: 0.48,
        timeSpent: 40,
        helpRequested: true,
        attempts: 3,
        strugglingAreas: ["Aina za nomino", "Wingi na umoja"],
        completionDate: "2024-01-15",
      },
      {
        topic: "Kusoma kwa Uelewa",
        score: 0.52,
        timeSpent: 38,
        helpRequested: true,
        attempts: 2,
        strugglingAreas: ["Maana ya maneno", "Muhtasari"],
        completionDate: "2024-01-20",
      },
      {
        topic: "Mazungumzo",
        score: 0.6,
        timeSpent: 32,
        helpRequested: false,
        attempts: 1,
        strugglingAreas: ["Lafudhi"],
        completionDate: "2024-01-25",
      },
    ],
  },
}

export default function TestKiptooSubjects() {
  const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics")
  const [apiResponses, setApiResponses] = useState<Record<string, any>>({})
  const [loadingSubjects, setLoadingSubjects] = useState<Set<string>>(new Set())
  const [errors, setErrors] = useState<Record<string, string>>({})

  const testSubject = async (subject: string) => {
    setLoadingSubjects((prev) => new Set([...prev, subject]))
    setErrors((prev) => ({ ...prev, [subject]: "" }))

    try {
      const profile = subjectProfiles[subject as keyof typeof subjectProfiles]
      const response = await fetch("/api/ai/adaptive-learning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setApiResponses((prev) => ({ ...prev, [subject]: data }))
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [subject]: err instanceof Error ? err.message : "Unknown error occurred",
      }))
    } finally {
      setLoadingSubjects((prev) => {
        const newSet = new Set(prev)
        newSet.delete(subject)
        return newSet
      })
    }
  }

  const testAllSubjects = async () => {
    const subjects = Object.keys(subjectProfiles)
    for (const subject of subjects) {
      await testSubject(subject)
      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  const getSubjectIcon = (subject: string) => {
    const icons = {
      Mathematics: Calculator,
      English: BookOpen,
      "Social Studies": Globe,
      Science: Beaker,
      Kiswahili: Languages,
    }
    const Icon = icons[subject as keyof typeof icons] || BookOpen
    return <Icon className="h-5 w-5" />
  }

  const calculateAverageScore = (history: any[]) => {
    const scores = history.map((h) => h.score)
    return scores.reduce((sum, score) => sum + score, 0) / scores.length
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <User className="h-8 w-8 text-blue-500" />
          Kiptoo's Multi-Subject Adaptive Learning Test
        </h1>
        <p className="text-muted-foreground">
          Testing how AI adapts support strategies across different CBC subjects for the same struggling student
        </p>
      </div>

      {/* Student Overview */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <User className="h-5 w-5" />
            Kiptoo Kiprotich - Grade 6 Student Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <span className="text-sm text-muted-foreground">Learning Style</span>
              <div className="font-semibold">Kinesthetic</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Environment</span>
              <div className="font-semibold">Rural Kenya</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Interests</span>
              <div className="font-semibold">Football, Animals, Farming</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Main Challenge</span>
              <div className="font-semibold">Abstract Concepts</div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={testAllSubjects} size="lg" className="mb-4">
              <Activity className="h-4 w-4 mr-2" />
              Test All Subjects
            </Button>
            {Object.keys(subjectProfiles).map((subject) => (
              <Button
                key={subject}
                onClick={() => testSubject(subject)}
                disabled={loadingSubjects.has(subject)}
                variant="outline"
                size="sm"
              >
                {loadingSubjects.has(subject) ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  getSubjectIcon(subject)
                )}
                {subject}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject Comparison Tabs */}
      <Tabs value={selectedSubject} onValueChange={setSelectedSubject}>
        <TabsList className="grid w-full grid-cols-4">
          {Object.keys(subjectProfiles).map((subject) => (
            <TabsTrigger key={subject} value={subject} className="flex items-center gap-2">
              {getSubjectIcon(subject)}
              <span className="hidden sm:inline">{subject}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(subjectProfiles).map(([subject, profile]) => (
          <TabsContent key={subject} value={subject} className="space-y-6">
            {/* Subject-Specific Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getSubjectIcon(subject)}
                  {subject} - Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-muted rounded">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {(calculateAverageScore(profile.learningHistory) * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Average Score</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{profile.currentTopic}</div>
                    <div className="text-sm text-muted-foreground">Current Topic</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {profile.learningHistory.filter((h) => h.helpRequested).length}/{profile.learningHistory.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Help Requests</div>
                  </div>
                </div>

                {/* Recent Learning History */}
                <div className="space-y-2">
                  <h5 className="font-semibold">Recent Learning History</h5>
                  {profile.learningHistory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div className="flex-1">
                        <div className="font-medium">{item.topic}</div>
                        <div className="text-sm text-muted-foreground">
                          Struggling with: {item.strugglingAreas.join(", ")}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={item.score < 0.6 ? "destructive" : "secondary"}>
                          {(item.score * 100).toFixed(0)}%
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.attempts} attempts, {item.timeSpent}min
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {errors[subject] && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Error testing {subject}: {errors[subject]}
                </AlertDescription>
              </Alert>
            )}

            {/* AI Adaptations for This Subject */}
            {apiResponses[subject] && (
              <div className="space-y-6">
                {/* Adaptation Summary */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Target className="h-5 w-5" />
                      {subject} - AI Adaptations Applied
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-4 bg-white rounded">
                        <div className="text-lg font-bold text-blue-600">
                          {apiResponses[subject].studentProfile.adaptedDifficulty}
                        </div>
                        <div className="text-sm text-muted-foreground">Adapted Difficulty</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded">
                        <div className="text-lg font-bold text-green-600">Kinesthetic</div>
                        <div className="text-sm text-muted-foreground">Learning Style Focus</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded">
                        <div className="text-lg font-bold text-purple-600">High</div>
                        <div className="text-sm text-muted-foreground">Support Level</div>
                      </div>
                    </div>

                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Adaptation Reason:</strong> {apiResponses[subject].metadata.adaptationReason}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Subject-Specific Strategies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      {subject} - Kinesthetic Learning Strategies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {subject === "Mathematics" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">🧮 Hands-On Math Activities</h5>
                          <ul className="text-sm space-y-1 text-blue-700">
                            <li>• Use physical objects (beans, stones) to represent fractions</li>
                            <li>• Create fraction pizzas and cakes using cardboard</li>
                            <li>• Build decimal place value charts with moveable pieces</li>
                            <li>• Use measuring cups and rulers for practical decimal work</li>
                            <li>• Football field measurements for real-world math problems</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h5 className="font-semibold text-green-800 mb-2">🏡 Farm-Based Math</h5>
                          <ul className="text-sm space-y-1 text-green-700">
                            <li>• Calculate farm plot areas using fractions</li>
                            <li>• Measure and divide seeds for planting</li>
                            <li>• Work with milk measurements in decimals</li>
                            <li>• Calculate costs of farming supplies</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {subject === "English" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <h5 className="font-semibold text-purple-800 mb-2">✍️ Active Writing Strategies</h5>
                          <ul className="text-sm space-y-1 text-purple-700">
                            <li>• Act out stories before writing them</li>
                            <li>• Use props and costumes for creative writing</li>
                            <li>• Write about football matches and farm experiences</li>
                            <li>• Create physical story maps and character boards</li>
                            <li>• Interview family members for story ideas</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h5 className="font-semibold text-orange-800 mb-2">🎭 Drama & Movement</h5>
                          <ul className="text-sm space-y-1 text-orange-700">
                            <li>• Act out grammar concepts (verb actions)</li>
                            <li>• Use gestures to remember vocabulary</li>
                            <li>• Role-play different characters in stories</li>
                            <li>• Physical warm-ups before writing sessions</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {subject === "Social Studies" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h5 className="font-semibold text-yellow-800 mb-2">🗺️ Interactive Geography</h5>
                          <ul className="text-sm space-y-1 text-yellow-700">
                            <li>• Build 3D models of Kenyan physical features</li>
                            <li>• Create floor maps for walking through regions</li>
                            <li>• Use sand and clay to show landforms</li>
                            <li>• Visit local government offices</li>
                            <li>• Interview community leaders</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <h5 className="font-semibold text-red-800 mb-2">🏛️ Government Simulation</h5>
                          <ul className="text-sm space-y-1 text-red-700">
                            <li>• Role-play different government positions</li>
                            <li>• Create mock elections and voting</li>
                            <li>• Build model parliament buildings</li>
                            <li>• Simulate local council meetings</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {subject === "Kiswahili" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-teal-50 rounded-lg">
                          <h5 className="font-semibold text-teal-800 mb-2">🎪 Mazungumzo na Mchezo</h5>
                          <ul className="text-sm space-y-1 text-teal-700">
                            <li>• Mchezo wa kuigiza mazungumzo</li>
                            <li>• Kutumia ishara za mikono katika mazungumzo</li>
                            <li>• Kuandika kuhusu michezo ya mpira</li>
                            <li>• Mazungumzo kuhusu kilimo na mifugo</li>
                            <li>• Kuimba nyimbo za Kiswahili</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-lg">
                          <h5 className="font-semibold text-indigo-800 mb-2">📝 Uandishi wa Vitendo</h5>
                          <ul className="text-sm space-y-1 text-indigo-700">
                            <li>• Kuandika kuhusu mazingira ya kijijini</li>
                            <li>• Kutumia picha na michoro katika insha</li>
                            <li>• Kuandika barua kwa marafiki</li>
                            <li>• Kurekodi mazungumzo ya kila siku</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Support Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      {subject} - Support Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {apiResponses[subject].recommendations && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {apiResponses[subject].recommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="text-sm text-green-700">{rec}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Cross-Subject Analysis */}
      {Object.keys(apiResponses).length > 1 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800">Cross-Subject Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-purple-800 mb-3">Consistent Adaptations</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Kinesthetic learning emphasis across all subjects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Reduced difficulty levels for confidence building
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Real-world connections to farming and rural life
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Hands-on activities and practical applications
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-purple-800 mb-3">Subject-Specific Variations</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Math: Physical manipulatives and measurement tools
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    English: Drama, role-play, and storytelling
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Social Studies: Model building and field trips
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Kiswahili: Cultural activities and oral practice
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
