"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  BookOpen,
  TrendingUp,
  FileText,
  Download,
  Plus,
  BarChart3,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target,
  Settings,
} from "lucide-react"

interface Student {
  id: string
  name: string
  grade: string
  overallProgress: number
  strengths: string[]
  challenges: string[]
  lastActivity: Date
  totalHours: number
  completedTopics: number
  avgScore: number
}

interface ClassAnalytics {
  totalStudents: number
  activeStudents: number
  avgProgress: number
  topPerformers: Student[]
  needsAttention: Student[]
  popularTopics: Array<{ topic: string; engagement: number }>
  learningTrends: Array<{ week: string; progress: number }>
}

interface TeacherDashboardProps {
  teacherId: string
  selectedClass?: string
}

export function ComprehensiveTeacherDashboard({ teacherId, selectedClass }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [students, setStudents] = useState<Student[]>([])
  const [analytics, setAnalytics] = useState<ClassAnalytics | null>(null)
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real implementation, fetch from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock student data
      const mockStudents: Student[] = [
        {
          id: "1",
          name: "Sarah Mwangi",
          grade: "Grade 4",
          overallProgress: 85,
          strengths: ["Mathematics", "English"],
          challenges: ["Science"],
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          totalHours: 24,
          completedTopics: 12,
          avgScore: 78,
        },
        {
          id: "2",
          name: "John Kipchoge",
          grade: "Grade 4",
          overallProgress: 72,
          strengths: ["Science", "Social Studies"],
          challenges: ["Mathematics", "English"],
          lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          totalHours: 18,
          completedTopics: 8,
          avgScore: 65,
        },
        {
          id: "3",
          name: "Grace Achieng",
          grade: "Grade 4",
          overallProgress: 95,
          strengths: ["English", "Creative Arts"],
          challenges: [],
          lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          totalHours: 32,
          completedTopics: 18,
          avgScore: 92,
        },
        {
          id: "4",
          name: "David Ochieng",
          grade: "Grade 4",
          overallProgress: 45,
          strengths: ["Physical Education"],
          challenges: ["Mathematics", "English", "Science"],
          lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          totalHours: 8,
          completedTopics: 3,
          avgScore: 42,
        },
      ]

      // Mock analytics
      const mockAnalytics: ClassAnalytics = {
        totalStudents: mockStudents.length,
        activeStudents: mockStudents.filter((s) => s.lastActivity > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
        avgProgress: mockStudents.reduce((sum, s) => sum + s.overallProgress, 0) / mockStudents.length,
        topPerformers: mockStudents.filter((s) => s.overallProgress >= 80),
        needsAttention: mockStudents.filter((s) => s.overallProgress < 60),
        popularTopics: [
          { topic: "Addition and Subtraction", engagement: 95 },
          { topic: "Reading Comprehension", engagement: 87 },
          { topic: "Plant Life Cycles", engagement: 78 },
          { topic: "Kenya Geography", engagement: 72 },
        ],
        learningTrends: [
          { week: "Week 1", progress: 60 },
          { week: "Week 2", progress: 65 },
          { week: "Week 3", progress: 70 },
          { week: "Week 4", progress: 74 },
        ],
      }

      setStudents(mockStudents)
      setAnalytics(mockAnalytics)
      setIsLoading(false)
    }

    fetchDashboardData()
  }, [teacherId, selectedClass])

  const generateStudentReport = (student: Student) => {
    // Mock report generation
    console.log(`Generating comprehensive report for ${student.name}`)
    // In real implementation, this would generate a PDF report
  }

  const generateClassSummary = () => {
    // Mock class summary generation
    console.log("Generating class summary notes")
    // In real implementation, this would generate summary notes for the class
  }

  const createAdaptiveQuiz = () => {
    // Mock quiz creation
    console.log("Creating adaptive quiz for class")
    // In real implementation, this would open a quiz creation interface
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Teacher Dashboard - CBC Learning Analytics
            </div>
            <div className="flex gap-2">
              <Button onClick={generateClassSummary}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Summary Notes
              </Button>
              <Button onClick={createAdaptiveQuiz}>
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </div>
          </CardTitle>
          <div className="flex gap-4">
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="grade1">Grade 1</SelectItem>
                <SelectItem value="grade2">Grade 2</SelectItem>
                <SelectItem value="grade3">Grade 3</SelectItem>
                <SelectItem value="grade4">Grade 4</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="social-studies">Social Studies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{analytics.totalStudents}</div>
                  <div className="text-sm text-muted-foreground">Total Students</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{analytics.activeStudents}</div>
                  <div className="text-sm text-muted-foreground">Active Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{Math.round(analytics.avgProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Avg Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">{analytics.needsAttention.length}</div>
                  <div className="text-sm text-muted-foreground">Need Attention</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="tools">AI Tools</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Class Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.topPerformers.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.completedTopics} topics completed</div>
                      </div>
                      <Badge variant="secondary">{student.overallProgress}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Students Needing Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.needsAttention.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">Challenges: {student.challenges.join(", ")}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">{student.overallProgress}%</Badge>
                        <Button variant="outline" size="sm" className="ml-2">
                          <Brain className="h-3 w-3 mr-1" />
                          Help
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Most Engaging Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.popularTopics.map((topic, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-medium">{topic.topic}</div>
                      <Progress value={topic.engagement} className="h-2 mt-1" />
                    </div>
                    <Badge variant="outline">{topic.engagement}% engaged</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* Individual Student Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Student Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <Card key={student.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{student.name}</h3>
                          <Badge variant="outline">{student.grade}</Badge>
                          <Badge
                            variant={
                              student.overallProgress >= 80
                                ? "default"
                                : student.overallProgress >= 60
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {student.overallProgress}% Progress
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <div className="text-sm font-medium">Learning Hours</div>
                            <div className="text-lg font-bold flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {student.totalHours}h
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Completed Topics</div>
                            <div className="text-lg font-bold flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              {student.completedTopics}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Average Score</div>
                            <div className="text-lg font-bold flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {student.avgScore}%
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-green-600 mb-1">Strengths</div>
                            <div className="flex gap-1 flex-wrap">
                              {student.strengths.map((strength, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-orange-600 mb-1">Areas for Improvement</div>
                            <div className="flex gap-1 flex-wrap">
                              {student.challenges.map((challenge, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {challenge}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-muted-foreground">
                          Last activity: {student.lastActivity.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => generateStudentReport(student)}>
                          <FileText className="h-3 w-3 mr-1" />
                          Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Brain className="h-3 w-3 mr-1" />
                          AI Tutor
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Learning Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Class Learning Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.learningTrends.map((trend, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-16 text-sm font-medium">{trend.week}</div>
                    <div className="flex-1">
                      <Progress value={trend.progress} className="h-3" />
                    </div>
                    <div className="w-12 text-sm text-muted-foreground">{trend.progress}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded">
                    <div className="font-medium">Peak Learning Time</div>
                    <div className="text-sm text-muted-foreground">10:00 AM - 11:00 AM</div>
                    <div className="text-xs text-muted-foreground">85% of students most active</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="font-medium">Average Session Duration</div>
                    <div className="text-sm text-muted-foreground">22 minutes</div>
                    <div className="text-xs text-muted-foreground">Optimal for this age group</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="font-medium">Preferred Learning Mode</div>
                    <div className="text-sm text-muted-foreground">Guided Learning (65%)</div>
                    <div className="text-xs text-muted-foreground">Followed by Revision (25%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="font-medium text-blue-800">Recommendation</div>
                    <div className="text-sm text-blue-700">
                      Focus more on visual learning aids for Mathematics topics
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <div className="font-medium text-green-800">Success Pattern</div>
                    <div className="text-sm text-green-700">
                      Students perform 23% better when topics include real-world examples
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                    <div className="font-medium text-orange-800">Alert</div>
                    <div className="text-sm text-orange-700">
                      3 students showing declining engagement in Science topics
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          {/* AI-Powered Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Auto-Generate Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create adaptive quizzes based on student performance and curriculum standards
                </p>
                <div className="space-y-3">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="addition">Addition & Subtraction</SelectItem>
                      <SelectItem value="reading">Reading Comprehension</SelectItem>
                      <SelectItem value="science">Basic Science</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (1-3)</SelectItem>
                      <SelectItem value="medium">Medium (4-6)</SelectItem>
                      <SelectItem value="hard">Hard (7-10)</SelectItem>
                      <SelectItem value="adaptive">Adaptive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full" onClick={createAdaptiveQuiz}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary Notes Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate comprehensive summary notes for any CBC topic
                </p>
                <div className="space-y-3">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="social-studies">Social Studies</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Note Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concept">Concept Summary</SelectItem>
                      <SelectItem value="lesson">Lesson Plan</SelectItem>
                      <SelectItem value="activity">Activity Guide</SelectItem>
                      <SelectItem value="assessment">Assessment Rubric</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full" onClick={generateClassSummary}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Notes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate detailed progress reports and learning analytics
                </p>
                <div className="space-y-3">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual Progress</SelectItem>
                      <SelectItem value="class">Class Overview</SelectItem>
                      <SelectItem value="comparative">Comparative Analysis</SelectItem>
                      <SelectItem value="predictive">Predictive Insights</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="term">This Term</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Teaching Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">For Your Class</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded">
                      <div className="font-medium text-sm">Focus Area: Mathematics</div>
                      <div className="text-xs text-muted-foreground">
                        Students struggling with place value concepts. Recommend visual number charts.
                      </div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="font-medium text-sm">Teaching Strategy</div>
                      <div className="text-xs text-muted-foreground">
                        Use more hands-on activities for science topics to improve engagement.
                      </div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="font-medium text-sm">Timing Optimization</div>
                      <div className="text-xs text-muted-foreground">
                        Schedule challenging topics between 10-11 AM for best results.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Individual Support</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded">
                      <div className="font-medium text-sm">David Ochieng</div>
                      <div className="text-xs text-muted-foreground">
                        Needs additional support in basic numeracy. Consider one-on-one sessions.
                      </div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="font-medium text-sm">John Kipchoge</div>
                      <div className="text-xs text-muted-foreground">
                        Strong in science but needs reading comprehension support for word problems.
                      </div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="font-medium text-sm">Grace Achieng</div>
                      <div className="text-xs text-muted-foreground">
                        Ready for advanced challenges. Consider enrichment activities.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Report Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Progress Reports</span>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Last updated: {student.lastActivity.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => generateStudentReport(student)}>
                        <FileText className="h-3 w-3 mr-1" />
                        Individual Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="progress">Progress Summary</SelectItem>
                      <SelectItem value="performance">Performance Analysis</SelectItem>
                      <SelectItem value="behavior">Learning Behavior</SelectItem>
                      <SelectItem value="comparative">Comparative Study</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="term">Current Term</SelectItem>
                      <SelectItem value="year">Academic Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="presentation">PowerPoint</SelectItem>
                      <SelectItem value="dashboard">Interactive Dashboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Custom Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
