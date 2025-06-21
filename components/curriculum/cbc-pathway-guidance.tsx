"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Calculator,
  Palette,
  Users,
  Wrench,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  GraduationCap,
  Briefcase,
} from "lucide-react"

interface PathwayData {
  id: string
  name: string
  description: string
  icon: any
  color: string
  subjects: string[]
  careerPaths: string[]
  requirements: {
    minimumGrade: string
    keySubjects: string[]
    recommendedStrengths: string[]
  }
  universities: string[]
  marketDemand: "High" | "Medium" | "Low"
  averageSalary: string
}

interface StudentProfile {
  id: string
  name: string
  grade: string
  strengths: Array<{ subject: string; score: number }>
  weaknesses: Array<{ subject: string; score: number }>
  interests: string[]
  learningStyle: string
  careerInterests: string[]
}

const CBC_PATHWAYS: PathwayData[] = [
  {
    id: "stem",
    name: "STEM Pathway",
    description:
      "Science, Technology, Engineering, and Mathematics track for students with strong analytical and problem-solving skills",
    icon: Calculator,
    color: "blue",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
    careerPaths: [
      "Software Engineer",
      "Medical Doctor",
      "Civil Engineer",
      "Data Scientist",
      "Biotechnologist",
      "Aerospace Engineer",
      "Research Scientist",
      "Pharmacist",
    ],
    requirements: {
      minimumGrade: "B+",
      keySubjects: ["Mathematics", "Physics", "Chemistry"],
      recommendedStrengths: ["Logical thinking", "Problem solving", "Mathematical reasoning"],
    },
    universities: ["University of Nairobi", "JKUAT", "Moi University", "Kenyatta University"],
    marketDemand: "High",
    averageSalary: "KSh 80,000 - 200,000",
  },
  {
    id: "arts-sports",
    name: "Arts & Sports Science",
    description: "Creative and physical development pathway for students with artistic talents and sports abilities",
    icon: Palette,
    color: "purple",
    subjects: ["Art & Design", "Music", "Physical Education", "Psychology", "Literature"],
    careerPaths: [
      "Graphic Designer",
      "Sports Coach",
      "Physiotherapist",
      "Art Teacher",
      "Sports Journalist",
      "Event Manager",
      "Fitness Trainer",
      "Creative Director",
    ],
    requirements: {
      minimumGrade: "B-",
      keySubjects: ["Art & Design", "Physical Education", "English"],
      recommendedStrengths: ["Creativity", "Physical coordination", "Communication"],
    },
    universities: ["Kenyatta University", "Moi University", "Maseno University"],
    marketDemand: "Medium",
    averageSalary: "KSh 40,000 - 120,000",
  },
  {
    id: "social-sciences",
    name: "Social Sciences",
    description:
      "Humanities and social studies pathway for students interested in society, culture, and human behavior",
    icon: Users,
    color: "green",
    subjects: ["History", "Geography", "Government", "Economics", "Sociology"],
    careerPaths: [
      "Lawyer",
      "Diplomat",
      "Social Worker",
      "Journalist",
      "Economist",
      "Political Analyst",
      "Human Rights Advocate",
      "International Relations Specialist",
    ],
    requirements: {
      minimumGrade: "B",
      keySubjects: ["History", "Government", "English"],
      recommendedStrengths: ["Critical thinking", "Communication", "Research skills"],
    },
    universities: ["University of Nairobi", "Kenyatta University", "Maseno University"],
    marketDemand: "Medium",
    averageSalary: "KSh 50,000 - 150,000",
  },
  {
    id: "technical-vocational",
    name: "Technical & Vocational",
    description: "Practical skills pathway focusing on hands-on technical and vocational training",
    icon: Wrench,
    color: "orange",
    subjects: ["Technical Drawing", "Woodwork", "Metalwork", "Electronics", "Agriculture"],
    careerPaths: [
      "Electrician",
      "Plumber",
      "Carpenter",
      "Mechanic",
      "Agricultural Officer",
      "Electronics Technician",
      "Building Contractor",
      "Industrial Designer",
    ],
    requirements: {
      minimumGrade: "C+",
      keySubjects: ["Mathematics", "Technical subjects"],
      recommendedStrengths: ["Practical skills", "Manual dexterity", "Problem solving"],
    },
    universities: ["Technical Universities", "TVET Institutions", "Polytechnics"],
    marketDemand: "High",
    averageSalary: "KSh 30,000 - 100,000",
  },
]

export function CBCPathwayGuidance({ studentId }: { studentId?: string }) {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [recommendedPathways, setRecommendedPathways] = useState<Array<PathwayData & { matchScore: number }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPathway, setSelectedPathway] = useState<string>("")

  useEffect(() => {
    // Simulate fetching student data
    const fetchStudentProfile = async () => {
      setIsLoading(true)

      // Mock student data - in real app, fetch from API
      const mockProfile: StudentProfile = {
        id: studentId || "student-001",
        name: "John Kamau",
        grade: "Grade 9",
        strengths: [
          { subject: "Mathematics", score: 92 },
          { subject: "Physics", score: 88 },
          { subject: "Chemistry", score: 85 },
          { subject: "Computer Science", score: 90 },
        ],
        weaknesses: [
          { subject: "Art & Design", score: 58 },
          { subject: "Music", score: 62 },
          { subject: "Physical Education", score: 65 },
        ],
        interests: ["Technology", "Problem Solving", "Research", "Innovation"],
        learningStyle: "Visual-Analytical",
        careerInterests: ["Software Development", "Engineering", "Data Science", "Medicine"],
      }

      setStudentProfile(mockProfile)

      // Calculate pathway recommendations
      const pathwayScores = CBC_PATHWAYS.map((pathway) => {
        let score = 0

        // Score based on subject strengths
        const relevantStrengths = mockProfile.strengths.filter((strength) =>
          pathway.subjects.some(
            (subject) =>
              subject.toLowerCase().includes(strength.subject.toLowerCase()) ||
              strength.subject.toLowerCase().includes(subject.toLowerCase()),
          ),
        )

        if (relevantStrengths.length > 0) {
          score += relevantStrengths.reduce((sum, strength) => sum + strength.score, 0) / relevantStrengths.length
        }

        // Score based on career interests alignment
        const careerAlignment = mockProfile.careerInterests.some((interest) =>
          pathway.careerPaths.some(
            (career) =>
              career.toLowerCase().includes(interest.toLowerCase()) ||
              interest.toLowerCase().includes(career.toLowerCase()),
          ),
        )

        if (careerAlignment) score += 20

        // Score based on interests
        const interestAlignment = mockProfile.interests.some((interest) =>
          pathway.description.toLowerCase().includes(interest.toLowerCase()),
        )

        if (interestAlignment) score += 15

        return { ...pathway, matchScore: Math.min(score, 100) }
      })

      const sortedPathways = pathwayScores.sort((a, b) => b.matchScore - a.matchScore)
      setRecommendedPathways(sortedPathways)
      setSelectedPathway(sortedPathways[0]?.id || "")

      setIsLoading(false)
    }

    fetchStudentProfile()
  }, [studentId])

  const getPathwayIcon = (pathway: PathwayData) => {
    const IconComponent = pathway.icon
    return <IconComponent className="h-6 w-6" />
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "border-blue-500 bg-blue-50 text-blue-700",
      purple: "border-purple-500 bg-purple-50 text-purple-700",
      green: "border-green-500 bg-green-50 text-green-700",
      orange: "border-orange-500 bg-orange-50 text-orange-700",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!studentProfile) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Student Profile Not Found</h3>
          <p className="text-muted-foreground">Unable to load student data for pathway guidance</p>
        </CardContent>
      </Card>
    )
  }

  const selectedPathwayData = recommendedPathways.find((p) => p.id === selectedPathway)

  return (
    <div className="space-y-6">
      {/* Student Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                CBC Pathway Guidance for {studentProfile.name}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {studentProfile.grade} • Learning Style: {studentProfile.learningStyle}
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Star className="h-4 w-4 mr-1" />
              Top Match: {recommendedPathways[0]?.matchScore.toFixed(0)}%
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Pathway Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendedPathways.map((pathway) => (
          <Card
            key={pathway.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedPathway === pathway.id ? `border-2 ${getColorClasses(pathway.color)}` : "hover:border-gray-300"
            }`}
            onClick={() => setSelectedPathway(pathway.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${getColorClasses(pathway.color)}`}>{getPathwayIcon(pathway)}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{pathway.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={pathway.matchScore} className="flex-1 h-2" />
                    <span className="text-xs font-medium">{pathway.matchScore.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Market Demand: {pathway.marketDemand}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{pathway.averageSalary}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Pathway Information */}
      {selectedPathwayData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${getColorClasses(selectedPathwayData.color)}`}>
                {getPathwayIcon(selectedPathwayData)}
              </div>
              <div>
                <h2 className="text-2xl">{selectedPathwayData.name}</h2>
                <p className="text-muted-foreground font-normal">{selectedPathwayData.description}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="careers">Careers</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="preparation">Preparation</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold">Match Score</h4>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedPathwayData.matchScore.toFixed(0)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Based on your strengths and interests</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <h4 className="font-semibold">Market Demand</h4>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{selectedPathwayData.marketDemand}</div>
                      <p className="text-sm text-muted-foreground">Job market outlook</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="h-4 w-4 text-purple-600" />
                        <h4 className="font-semibold">Salary Range</h4>
                      </div>
                      <div className="text-lg font-bold text-purple-600">{selectedPathwayData.averageSalary}</div>
                      <p className="text-sm text-muted-foreground">Average monthly salary</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="subjects" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Core Subjects for {selectedPathwayData.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedPathwayData.subjects.map((subject) => (
                      <div key={subject} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{subject}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Your Performance in Related Subjects</h4>
                  <div className="space-y-2">
                    {studentProfile.strengths
                      .filter((strength) =>
                        selectedPathwayData.subjects.some(
                          (subject) =>
                            subject.toLowerCase().includes(strength.subject.toLowerCase()) ||
                            strength.subject.toLowerCase().includes(subject.toLowerCase()),
                        ),
                      )
                      .map((strength) => (
                        <div
                          key={strength.subject}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{strength.subject}</span>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {strength.score}%
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="careers" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Career Opportunities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPathwayData.careerPaths.map((career) => (
                      <div key={career} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Award className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">{career}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Your Career Interests Alignment</h4>
                  <div className="space-y-2">
                    {studentProfile.careerInterests.map((interest) => {
                      const isAligned = selectedPathwayData.careerPaths.some(
                        (career) =>
                          career.toLowerCase().includes(interest.toLowerCase()) ||
                          interest.toLowerCase().includes(career.toLowerCase()),
                      )
                      return (
                        <div
                          key={interest}
                          className={`flex items-center gap-2 p-2 rounded ${
                            isAligned ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {isAligned ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span>{interest}</span>
                          {isAligned && (
                            <Badge variant="secondary" className="ml-auto">
                              Aligned
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Academic Requirements</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Minimum Grade</span>
                        <Badge variant="outline">{selectedPathwayData.requirements.minimumGrade}</Badge>
                      </div>

                      <div>
                        <p className="font-medium mb-2">Key Subjects:</p>
                        <div className="space-y-1">
                          {selectedPathwayData.requirements.keySubjects.map((subject) => (
                            <div key={subject} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span>{subject}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Recommended Strengths</h4>
                    <div className="space-y-2">
                      {selectedPathwayData.requirements.recommendedStrengths.map((strength) => (
                        <div key={strength} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                          <Star className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Universities & Institutions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedPathwayData.universities.map((university) => (
                      <div key={university} className="flex items-center gap-2 p-2 border rounded">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{university}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preparation" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-700">Strengths to Leverage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {studentProfile.strengths
                          .filter((strength) => strength.score >= 80)
                          .map((strength) => (
                            <div
                              key={strength.subject}
                              className="flex items-center justify-between p-2 bg-green-50 rounded"
                            >
                              <span className="text-sm font-medium">{strength.subject}</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {strength.score}%
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-orange-700">Areas to Improve</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {studentProfile.weaknesses
                          .filter((weakness) =>
                            selectedPathwayData.subjects.some((subject) =>
                              subject.toLowerCase().includes(weakness.subject.toLowerCase()),
                            ),
                          )
                          .map((weakness) => (
                            <div
                              key={weakness.subject}
                              className="flex items-center justify-between p-2 bg-orange-50 rounded"
                            >
                              <span className="text-sm font-medium">{weakness.subject}</span>
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                {weakness.score}%
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Action Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <div>
                          <h5 className="font-semibold">Focus on Core Subjects</h5>
                          <p className="text-sm text-muted-foreground">
                            Maintain excellence in {selectedPathwayData.requirements.keySubjects.join(", ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        <div>
                          <h5 className="font-semibold">Develop Key Skills</h5>
                          <p className="text-sm text-muted-foreground">
                            Build {selectedPathwayData.requirements.recommendedStrengths.join(", ")} abilities
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                        <div>
                          <h5 className="font-semibold">Explore Career Options</h5>
                          <p className="text-sm text-muted-foreground">
                            Research and gain exposure to careers in {selectedPathwayData.name.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="flex-1">
          <BookOpen className="mr-2 h-4 w-4" />
          Generate Detailed Report
        </Button>
        <Button variant="outline" className="flex-1">
          <Users className="mr-2 h-4 w-4" />
          Schedule Counseling Session
        </Button>
      </div>
    </div>
  )
}
