"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar, Search, Users, BookOpen, Brain, BarChart3 } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { AIUsageOverview } from "@/components/teacher/ai-usage-overview"
import { AITopicAnalysis } from "@/components/teacher/ai-topic-analysis"
import { AIStudentEngagement } from "@/components/teacher/ai-student-engagement"
import { AIInteractionList } from "@/components/teacher/ai-interaction-list"
import { AILearningAreaBreakdown } from "@/components/teacher/ai-learning-area-breakdown"
import { AIInsightsPanel } from "@/components/teacher/ai-insights-panel"

export function AIMonitoringDashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [filters, setFilters] = useState({
    classId: "",
    learningAreaId: "",
    studentId: "",
    days: "30",
    page: 1,
    pageSize: 10,
  })
  const [classes, setClasses] = useState<any[]>([])
  const [learningAreas, setLearningAreas] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])

  useEffect(() => {
    // Fetch classes taught by this teacher
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/teacher/classes")
        if (response.ok) {
          const data = await response.json()
          setClasses(data)
        }
      } catch (error) {
        console.error("Error fetching classes:", error)
      }
    }

    // Fetch learning areas
    const fetchLearningAreas = async () => {
      try {
        const response = await fetch("/api/curriculum/learning-areas")
        if (response.ok) {
          const data = await response.json()
          setLearningAreas(data)
        }
      } catch (error) {
        console.error("Error fetching learning areas:", error)
      }
    }

    fetchClasses()
    fetchLearningAreas()
  }, [])

  // Fetch students when class is selected
  useEffect(() => {
    if (filters.classId) {
      const fetchStudents = async () => {
        try {
          const response = await fetch(`/api/teacher/students?classId=${filters.classId}`)
          if (response.ok) {
            const data = await response.json()
            setStudents(data)
          }
        } catch (error) {
          console.error("Error fetching students:", error)
        }
      }
      fetchStudents()
    } else {
      setStudents([])
    }
  }, [filters.classId])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (filters.classId) queryParams.append("classId", filters.classId)
        if (filters.learningAreaId) queryParams.append("learningAreaId", filters.learningAreaId)
        if (filters.studentId) queryParams.append("studentId", filters.studentId)
        queryParams.append("days", filters.days)
        queryParams.append("page", filters.page.toString())
        queryParams.append("pageSize", filters.pageSize.toString())

        const response = await fetch(`/api/teacher/ai-interactions?${queryParams.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        }
      } catch (error) {
        console.error("Error fetching AI monitoring data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [filters])

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset page when changing filters
      ...(key !== "page" && { page: 1 }),
    }))
  }

  const handlePageChange = (newPage: number) => {
    handleFilterChange("page", newPage)
  }

  if (!user) {
    return <div>Please log in to access this dashboard</div>
  }

  return (
    <div className="space-y-6">
      {/* Personality & Pathway Reports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Student Personality Analysis */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Personality Analysis</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Learning Style Assessment</span>
                <span className="text-sm font-medium">Visual: 65% | Kinesthetic: 25% | Auditory: 10%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Problem-Solving Approach</span>
                <span className="text-sm font-medium">Analytical: 70% | Creative: 30%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Collaboration Preference</span>
                <span className="text-sm font-medium">Independent: 60% | Group: 40%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CBC Pathway Recommendations */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">CBC Senior School Pathways</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="font-medium text-green-800">STEM Pathway (Recommended)</div>
                <div className="text-sm text-green-600">Strong in Mathematics, Science & Technology</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="font-medium text-blue-800">Arts & Sports Science</div>
                <div className="text-sm text-blue-600">Creative thinking & physical coordination</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <div className="font-medium text-orange-800">Social Sciences</div>
                <div className="text-sm text-orange-600">Communication & analytical skills</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Weaknesses Analysis */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Student Strengths & Weaknesses Analysis (Grades 1-9)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Key Strengths
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm">Mathematical Reasoning</span>
                  <span className="text-sm font-medium text-green-700">92%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm">Scientific Inquiry</span>
                  <span className="text-sm font-medium text-green-700">88%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm">Problem Solving</span>
                  <span className="text-sm font-medium text-green-700">85%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm">Digital Literacy</span>
                  <span className="text-sm font-medium text-green-700">90%</span>
                </div>
              </div>
            </div>

            {/* Weaknesses */}
            <div>
              <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Areas for Improvement
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="text-sm">Creative Writing</span>
                  <span className="text-sm font-medium text-red-700">65%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="text-sm">Oral Communication</span>
                  <span className="text-sm font-medium text-red-700">68%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="text-sm">Social Studies</span>
                  <span className="text-sm font-medium text-red-700">72%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="text-sm">Art & Craft</span>
                  <span className="text-sm font-medium text-red-700">58%</span>
                </div>
              </div>
            </div>
          </div>

          {/* CBC Pathway Recommendation Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <h4 className="font-medium text-gray-800 mb-2">CBC Senior School Pathway Recommendation</h4>
            <p className="text-sm text-gray-600 mb-3">
              Based on performance analysis from Grades 1-9, this student shows strong aptitude for STEM subjects with
              excellent mathematical reasoning and scientific inquiry skills. Recommended pathway preparation:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Mathematics</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Physics</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Chemistry</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">Biology</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Computer Science</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Original header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Tutor Monitoring</h1>
          <p className="text-muted-foreground">Track and analyze how your students are interacting with the AI tutor</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filters.days} onValueChange={(value) => handleFilterChange("days", value)}>
            <SelectTrigger className="w-[120px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={filters.classId} onValueChange={(value) => handleFilterChange("classId", value)}>
                <SelectTrigger>
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select
                value={filters.learningAreaId}
                onValueChange={(value) => handleFilterChange("learningAreaId", value)}
              >
                <SelectTrigger>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Learning Areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Learning Areas</SelectItem>
                  {learningAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select
                value={filters.studentId}
                onValueChange={(value) => handleFilterChange("studentId", value)}
                disabled={!filters.classId || students.length === 0}
              >
                <SelectTrigger>
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search interactions..."
                  className="pl-8"
                  onChange={(e) => {
                    // Implement search functionality
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : !dashboardData ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Brain className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No AI interaction data available</h3>
            <p className="text-muted-foreground">Encourage your students to use the AI tutor to see data here</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Overview Stats */}
          <AIUsageOverview data={dashboardData.summary} />

          <Tabs defaultValue="topics" className="space-y-4">
            <TabsList>
              <TabsTrigger value="topics">
                <BookOpen className="mr-2 h-4 w-4" />
                Topics & Questions
              </TabsTrigger>
              <TabsTrigger value="students">
                <Users className="mr-2 h-4 w-4" />
                Student Engagement
              </TabsTrigger>
              <TabsTrigger value="interactions">
                <Brain className="mr-2 h-4 w-4" />
                Interaction History
              </TabsTrigger>
              <TabsTrigger value="insights">
                <BarChart3 className="mr-2 h-4 w-4" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="topics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <AITopicAnalysis topics={dashboardData.popularTopics} />
                </div>
                <div>
                  <AILearningAreaBreakdown distribution={dashboardData.summary.learning_area_distribution} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <AIStudentEngagement students={dashboardData.studentEngagement} />
            </TabsContent>

            <TabsContent value="interactions" className="space-y-4">
              <AIInteractionList
                interactions={dashboardData.interactions}
                pagination={dashboardData.pagination}
                onPageChange={handlePageChange}
              />
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <AIInsightsPanel
                data={dashboardData}
                filters={{
                  className: classes.find((c) => c.id === filters.classId)?.name || "All Classes",
                  learningArea:
                    learningAreas.find((a) => a.id === filters.learningAreaId)?.name || "All Learning Areas",
                  studentName: students.find((s) => s.id === filters.studentId)?.full_name || "All Students",
                  days: Number.parseInt(filters.days),
                }}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
