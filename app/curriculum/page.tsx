"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, GraduationCap, FileText, Users, Search } from "lucide-react"
import { CurriculumSelector } from "@/components/curriculum/curriculum-selector"
import { EnhancedCurriculumSelector } from "@/components/curriculum/enhanced-curriculum-selector"
import { CurriculumExplorer } from "@/components/curriculum/curriculum-explorer"
import { useState, useEffect } from "react"

export default function CurriculumPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [curriculumData, setCurriculumData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCurriculumData()
  }, [])

  const fetchCurriculumData = async () => {
    try {
      const response = await fetch("/api/curriculum")
      if (response.ok) {
        const data = await response.json()
        setCurriculumData(data)
      }
    } catch (error) {
      console.error("Failed to fetch curriculum data:", error)
    } finally {
      setLoading(false)
    }
  }

  const subjects = [
    {
      name: "Mathematics",
      icon: "🔢",
      description: "Numbers, algebra, geometry",
      topics: ["Number Operations", "Fractions", "Geometry", "Measurement"],
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "English",
      icon: "📚",
      description: "Reading, writing, communication",
      topics: ["Reading", "Writing", "Speaking", "Listening"],
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Kiswahili",
      icon: "🗣️",
      description: "Language and literature",
      topics: ["Kusoma", "Kuandika", "Mazungumzo", "Fasihi"],
      color: "bg-orange-100 text-orange-800",
    },
    {
      name: "Science",
      icon: "🔬",
      description: "Biology, chemistry, physics",
      topics: ["Living Things", "Matter", "Energy", "Environment"],
      color: "bg-purple-100 text-purple-800",
    },
    {
      name: "Social Studies",
      icon: "🌍",
      description: "History, geography, civics",
      topics: ["History", "Geography", "Citizenship", "Culture"],
      color: "bg-red-100 text-red-800",
    },
    {
      name: "Creative Arts",
      icon: "🎨",
      description: "Art, music, drama",
      topics: ["Visual Arts", "Music", "Drama", "Dance"],
      color: "bg-pink-100 text-pink-800",
    },
    {
      name: "Physical Education",
      icon: "⚽",
      description: "Sports and fitness",
      topics: ["Athletics", "Ball Games", "Gymnastics", "Health"],
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "Life Skills",
      icon: "🛠️",
      description: "Practical life abilities",
      topics: ["Self-awareness", "Communication", "Decision Making", "Problem Solving"],
      color: "bg-indigo-100 text-indigo-800",
    },
  ]

  const grades = ["PP1", "PP2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6","Grade 7","Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Please log in to access the curriculum.</p>
          <Button onClick={() => router.push("/auth/signin")} className="mt-4">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CBC Curriculum</h1>
              <p className="text-gray-600">Competency-Based Curriculum resources and materials</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800">
            {user.gradeLevel?.toUpperCase().replace("GRADE", "Grade ") || "All Grades"}
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="explorer">Explorer</TabsTrigger>
            <TabsTrigger value="selector">Selector</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Search and Filter */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search curriculum content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Grades</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Grade Levels */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                  Grade Levels
                </CardTitle>
                <CardDescription>Browse curriculum by grade level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {grades.map((grade) => (
                    <Button
                      key={grade}
                      variant={selectedGrade === grade ? "default" : "outline"}
                      className="h-16 flex flex-col"
                      onClick={() => setSelectedGrade(selectedGrade === grade ? "" : grade)}
                    >
                      <span className="font-semibold">{grade}</span>
                      <span className="text-xs text-gray-500">
                        {curriculumData?.grades?.[grade]?.subjectCount || 8} subjects
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subjects.length}</div>
                  <p className="text-xs text-muted-foreground">Across all grades</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Areas</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">32</div>
                  <p className="text-xs text-muted-foreground">Competency areas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Grade Levels</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{grades.length}</div>
                  <p className="text-xs text-muted-foreground">PP1 to Grade 6</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resources</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">150+</div>
                  <p className="text-xs text-muted-foreground">Learning resources</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects">
            {/* Subject Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((subject, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl mb-2">{subject.icon}</div>
                      <Badge className={subject.color}>{subject.name}</Badge>
                    </div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription>{subject.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Key Topics:</h4>
                        <div className="flex flex-wrap gap-1">
                          {subject.topics.map((topic, topicIndex) => (
                            <Badge key={topicIndex} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Explore Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="explorer">
            <CurriculumExplorer />
          </TabsContent>

          <TabsContent value="selector">
            <div className="space-y-8">
              <EnhancedCurriculumSelector />
              <CurriculumSelector />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
