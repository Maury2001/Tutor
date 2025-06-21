"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Wand2, Download, Share, Copy, Sparkles } from "lucide-react"
import {
  Brain,
  FileText,
  ClipboardList,
  BarChart3,
  BookOpen,
  Lightbulb,
  Target,
  PenTool,
  Calculator,
  MessageSquare,
  TrendingUp,
} from "lucide-react"

export default function TeacherAIToolsPage() {
  const [activeTab, setActiveTab] = useState("lesson-planner")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")

  // Form states for different tools
  const [lessonForm, setLessonForm] = useState({
    subject: "",
    grade: "",
    topic: "",
    duration: 40,
    objectives: "",
    resources: "",
  })

  const [assessmentForm, setAssessmentForm] = useState({
    subject: "",
    grade: "",
    topic: "",
    type: "quiz",
    difficulty: "medium",
    questions: 10,
  })

  const [contentForm, setContentForm] = useState({
    type: "worksheet",
    subject: "",
    grade: "",
    topic: "",
    format: "pdf",
  })

  const [quizForm, setQuizForm] = useState({
    subject: "",
    grade: "",
    topic: "",
    questionCount: 10,
    timeLimit: 30,
    difficulty: "medium",
  })

  const [rubricForm, setRubricForm] = useState({
    subject: "",
    grade: "",
    assignment: "",
    criteria: "",
    levels: 4,
  })

  const [feedbackForm, setFeedbackForm] = useState({
    studentWork: "",
    rubric: "",
    grade: "",
    subject: "",
  })

  const subjects = [
    "Mathematics",
    "English",
    "Kiswahili",
    "Science",
    "Social Studies",
    "Creative Arts",
    "Physical Education",
    "Life Skills",
  ]

  const grades = ["PP1", "PP2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"]

  const generateContent = async (toolType: string, formData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/ai/tools/${toolType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.error && data.content) {
        // API had issues but provided fallback content
        setGeneratedContent(`⚠️ ${data.error}\n\n${data.content}`)
      } else if (data.content) {
        // Success with provider info
        const providerInfo = data.provider ? `\n\n---\n*Generated using ${data.provider}*` : ""
        setGeneratedContent(data.content + providerInfo)
      } else {
        // Complete failure
        const errorMessage = data.error?.includes("quota")
          ? `❌ OpenAI API quota exceeded. 

**What this means:**
• Your OpenAI API usage limit has been reached
• This is common during high-usage periods
• The service will reset based on your billing cycle

**Solutions:**
1. **Wait and retry** - Quotas often reset hourly/daily
2. **Contact administrator** - They can upgrade the API plan
3. **Use fallback templates** - Educational content is still available

**For immediate help:**
• Check your OpenAI dashboard at platform.openai.com
• Review your current usage and billing
• Consider upgrading your API plan for higher limits

*This platform includes educational templates as backup when AI services are unavailable.*`
          : `❌ Failed to generate ${toolType}. 

This could be due to:
• API quota exceeded
• Network connectivity issues  
• Service temporarily unavailable

Please try again later or contact support if the issue persists.`

        setGeneratedContent(errorMessage)
      }
    } catch (error) {
      console.error(`Error generating ${toolType}:`, error)
      setGeneratedContent(`❌ Network Error: Unable to connect to the AI service.

**Troubleshooting Steps:**
1. Check your internet connection
2. Refresh the page and try again
3. Contact support if the problem continues

**Alternative Options:**
• Use the educational templates available in the system
• Try again during off-peak hours
• Contact your administrator about API quota limits`)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Teaching Tools Suite
                </h1>
                <p className="text-sm text-gray-600">Comprehensive AI-powered educational content creation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                CBC Aligned
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                10 AI Tools
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                ⚠️ API Quota Limited
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete AI Teaching Assistant</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate lesson plans, assessments, worksheets, quizzes, rubrics, and personalized feedback - all aligned
            with Kenya CBC curriculum standards
          </p>
        </div>

        {/* AI Tools Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1">
            <TabsTrigger value="lesson-planner" className="flex flex-col items-center gap-1 p-3 h-auto">
              <FileText className="w-4 h-4" />
              <span className="text-xs">Lessons</span>
            </TabsTrigger>
            <TabsTrigger value="assessment-creator" className="flex flex-col items-center gap-1 p-3 h-auto">
              <ClipboardList className="w-4 h-4" />
              <span className="text-xs">Assessments</span>
            </TabsTrigger>
            <TabsTrigger value="content-generator" className="flex flex-col items-center gap-1 p-3 h-auto">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs">Content</span>
            </TabsTrigger>
            <TabsTrigger value="quiz-maker" className="flex flex-col items-center gap-1 p-3 h-auto">
              <Target className="w-4 h-4" />
              <span className="text-xs">Quizzes</span>
            </TabsTrigger>
            <TabsTrigger value="rubric-creator" className="flex flex-col items-center gap-1 p-3 h-auto">
              <Calculator className="w-4 h-4" />
              <span className="text-xs">Rubrics</span>
            </TabsTrigger>
            <TabsTrigger value="feedback-generator" className="flex flex-col items-center gap-1 p-3 h-auto">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">Feedback</span>
            </TabsTrigger>
            <TabsTrigger value="worksheet-generator" className="flex flex-col items-center gap-1 p-3 h-auto">
              <PenTool className="w-4 h-4" />
              <span className="text-xs">Worksheets</span>
            </TabsTrigger>
            <TabsTrigger value="adaptive-tutor" className="flex flex-col items-center gap-1 p-3 h-auto">
              <Brain className="w-4 h-4" />
              <span className="text-xs">Tutor</span>
            </TabsTrigger>
            <TabsTrigger value="progress-analyzer" className="flex flex-col items-center gap-1 p-3 h-auto">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col items-center gap-1 p-3 h-auto">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Lesson Planner */}
          <TabsContent value="lesson-planner">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <FileText className="w-6 h-6" />
                    AI Lesson Planner
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Generate comprehensive CBC-aligned lesson plans with activities and assessments
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Subject</Label>
                      <Select
                        value={lessonForm.subject}
                        onValueChange={(value) => setLessonForm({ ...lessonForm, subject: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Grade</Label>
                      <Select
                        value={lessonForm.grade}
                        onValueChange={(value) => setLessonForm({ ...lessonForm, grade: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Topic</Label>
                    <Input
                      placeholder="Enter lesson topic"
                      value={lessonForm.topic}
                      onChange={(e) => setLessonForm({ ...lessonForm, topic: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      placeholder="40"
                      value={lessonForm.duration}
                      onChange={(e) =>
                        setLessonForm({ ...lessonForm, duration: Number.parseInt(e.target.value) || 40 })
                      }
                    />
                  </div>
                  <div>
                    <Label>Learning Objectives</Label>
                    <Textarea
                      placeholder="Enter learning objectives"
                      value={lessonForm.objectives}
                      onChange={(e) => setLessonForm({ ...lessonForm, objectives: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={() => generateContent("lesson-generator", lessonForm)}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Lesson Plan...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Lesson Plan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Content Display */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Generated Content
                    </span>
                    {generatedContent && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {generatedContent ? (
                    <div className="space-y-4">
                      <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed">{generatedContent}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Generated content will appear here</p>
                      <p className="text-sm">Fill out the form and click generate to create your content</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assessment Creator */}
          <TabsContent value="assessment-creator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <ClipboardList className="w-6 h-6" />
                    Assessment Creator
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Create comprehensive assessments with rubrics and answer keys
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Subject</Label>
                      <Select
                        value={assessmentForm.subject}
                        onValueChange={(value) => setAssessmentForm({ ...assessmentForm, subject: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Grade</Label>
                      <Select
                        value={assessmentForm.grade}
                        onValueChange={(value) => setAssessmentForm({ ...assessmentForm, grade: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Topic</Label>
                    <Input
                      placeholder="Enter assessment topic"
                      value={assessmentForm.topic}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, topic: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Assessment Type</Label>
                      <Select
                        value={assessmentForm.type}
                        onValueChange={(value) => setAssessmentForm({ ...assessmentForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quiz">Quiz</SelectItem>
                          <SelectItem value="test">Test</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Difficulty</Label>
                      <Select
                        value={assessmentForm.difficulty}
                        onValueChange={(value) => setAssessmentForm({ ...assessmentForm, difficulty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Number of Questions</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={assessmentForm.questions}
                      onChange={(e) =>
                        setAssessmentForm({ ...assessmentForm, questions: Number.parseInt(e.target.value) || 10 })
                      }
                    />
                  </div>
                  <Button
                    onClick={() => generateContent("assessment-generator", assessmentForm)}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Assessment...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Create Assessment
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Content Display */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Generated Assessment
                    </span>
                    {generatedContent && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {generatedContent ? (
                    <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">{generatedContent}</pre>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Generated assessment will appear here</p>
                      <p className="text-sm">Configure your assessment and click create</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Add similar TabsContent for other tools... */}
          {/* Content Generator, Quiz Maker, Rubric Creator, etc. */}

          {/* Analytics Dashboard */}
          <TabsContent value="analytics">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <BarChart3 className="w-6 h-6" />
                  AI Tools Analytics
                </CardTitle>
                <CardDescription className="text-orange-600">
                  Track usage and effectiveness of AI teaching tools
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600">156</div>
                    <p className="text-blue-700 font-medium">Lessons Generated</p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <div className="text-3xl font-bold text-green-600">89</div>
                    <p className="text-green-700 font-medium">Assessments Created</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600">234</div>
                    <p className="text-purple-700 font-medium">Worksheets Made</p>
                  </div>
                  <div className="text-center p-6 bg-orange-50 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600">67</div>
                    <p className="text-orange-700 font-medium">Quizzes Built</p>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
                  <h4 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    AI Insights & Recommendations
                  </h4>
                  <ul className="text-orange-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      Most popular tool: Lesson Planner (45% of usage)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      Mathematics content generates 40% faster than other subjects
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      Grade 4-6 content has highest teacher satisfaction (4.8/5)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      Recommendation: Try the new Adaptive Tutor for personalized learning
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
