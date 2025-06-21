"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BookOpen,
  Brain,
  Microscope,
  FileText,
  Award,
  TrendingUp,
  Target,
  MessageSquare,
  BarChart3,
  Upload,
  Calendar,
  Settings,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function TeacherPortal() {
  // Non-functional handler
  const handleNonFunctional = () => {
    alert("This feature is not functional in this demo version")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Teacher Portal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empower your teaching with AI-driven tools, comprehensive analytics, and CBC-aligned resources
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/teacher/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <BarChart3 className="h-5 w-5 mr-2" />
                Go to Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={handleNonFunctional}>
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* AI Teaching Tools */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNonFunctional}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-6 w-6 mr-2 text-blue-500" />
                AI Teaching Tools
              </CardTitle>
              <CardDescription>Access advanced AI-powered lesson planning and content generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Lesson Planning</Badge>
                <Badge variant="secondary">Content Generation</Badge>
                <Badge variant="secondary">Assessment Creation</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Student Progress */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNonFunctional}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-green-500" />
                Student Progress
              </CardTitle>
              <CardDescription>Monitor individual and class performance with detailed analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Performance Tracking</Badge>
                <Badge variant="secondary">Learning Analytics</Badge>
                <Badge variant="secondary">Progress Reports</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Virtual Lab */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNonFunctional}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Microscope className="h-6 w-6 mr-2 text-purple-500" />
                Virtual Laboratory
              </CardTitle>
              <CardDescription>Conduct interactive science experiments and simulations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Science Experiments</Badge>
                <Badge variant="secondary">Interactive Simulations</Badge>
                <Badge variant="secondary">Lab Reports</Badge>
              </div>
            </CardContent>
          </Card>

          {/* CBC AI Tutor */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNonFunctional}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-orange-500" />
                CBC AI Tutor
              </CardTitle>
              <CardDescription>Intelligent tutoring system aligned with Kenyan CBC curriculum</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Adaptive Learning</Badge>
                <Badge variant="secondary">CBC Aligned</Badge>
                <Badge variant="secondary">Personalized Support</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Materials Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNonFunctional}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-indigo-500" />
                Materials Library
              </CardTitle>
              <CardDescription>Upload, organize, and share educational resources with students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Resource Upload</Badge>
                <Badge variant="secondary">Content Organization</Badge>
                <Badge variant="secondary">Student Sharing</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Tools */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNonFunctional}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2 text-red-500" />
                Assessment Creator
              </CardTitle>
              <CardDescription>Create tests, quizzes, and assignments with automated grading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Quiz Generation</Badge>
                <Badge variant="secondary">Auto Grading</Badge>
                <Badge variant="secondary">Rubric Creation</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-6 w-6 mr-2 text-blue-500" />
                AI-Powered Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Intelligent Lesson Planning</h4>
                    <p className="text-sm text-gray-600">
                      AI generates CBC-aligned lesson plans tailored to your class needs
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Adaptive Assessment</h4>
                    <p className="text-sm text-gray-600">
                      Create personalized assessments that adapt to student performance
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Learning Analytics</h4>
                    <p className="text-sm text-gray-600">Deep insights into student learning patterns and progress</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-6 w-6 mr-2 text-green-500" />
                CBC Curriculum Alignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Competency-Based Learning</h4>
                    <p className="text-sm text-gray-600">
                      All content aligned with CBC learning outcomes and objectives
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Kenyan Context</h4>
                    <p className="text-sm text-gray-600">Culturally relevant examples and real-world applications</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Values Integration</h4>
                    <p className="text-sm text-gray-600">Incorporates CBC core values in all learning activities</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col" onClick={handleNonFunctional}>
                <Upload className="h-6 w-6 mb-2" />
                <span className="text-xs">Upload Material</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col" onClick={handleNonFunctional}>
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-xs">Create Quiz</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col" onClick={handleNonFunctional}>
                <Users className="h-6 w-6 mb-2" />
                <span className="text-xs">View Students</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col" onClick={handleNonFunctional}>
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-xs">Schedule Class</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">28</div>
              <p className="text-sm text-gray-600">Active Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">15</div>
              <p className="text-sm text-gray-600">Teaching Materials</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">7</div>
              <p className="text-sm text-gray-600">Active Assignments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">85%</div>
              <p className="text-sm text-gray-600">Class Average</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
