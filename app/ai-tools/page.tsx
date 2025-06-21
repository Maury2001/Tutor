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
  Target,
  Calculator,
  MessageSquare,
  PenTool,
  TrendingUp,
} from "lucide-react"

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")

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

  const aiTools = [
    {
      id: "lesson-generator",
      name: "Lesson Generator",
      description: "Create comprehensive CBC-aligned lesson plans",
      icon: FileText,
      color: "blue",
      category: "Content Creation",
    },
    {
      id: "assessment-generator",
      name: "Assessment Creator",
      description: "Build tests, quizzes, and evaluations",
      icon: ClipboardList,
      color: "green",
      category: "Assessment",
    },
    {
      id: "content-creator",
      name: "Content Creator",
      description: "Generate educational materials and resources",
      icon: BookOpen,
      color: "purple",
      category: "Content Creation",
    },
    {
      id: "quiz-maker",
      name: "Quiz Maker",
      description: "Create interactive quizzes and knowledge checks",
      icon: Target,
      color: "orange",
      category: "Assessment",
    },
    {
      id: "rubric-creator",
      name: "Rubric Creator",
      description: "Build assessment rubrics and scoring guides",
      icon: Calculator,
      color: "red",
      category: "Assessment",
    },
    {
      id: "feedback-generator",
      name: "Feedback Generator",
      description: "Generate personalized student feedback",
      icon: MessageSquare,
      color: "pink",
      category: "Analysis",
    },
    {
      id: "worksheet-generator",
      name: "Worksheet Generator",
      description: "Create practice worksheets and activities",
      icon: PenTool,
      color: "indigo",
      category: "Content Creation",
    },
    {
      id: "adaptive-tutor",
      name: "Adaptive Tutor",
      description: "Provide personalized tutoring support",
      icon: Brain,
      color: "cyan",
      category: "Tutoring",
    },
    {
      id: "progress-analyzer",
      name: "Progress Analyzer",
      description: "Analyze and track student learning progress",
      icon: TrendingUp,
      color: "emerald",
      category: "Analysis",
    },
    {
      id: "curriculum-analyzer",
      name: "Curriculum Analyzer",
      description: "Analyze content for CBC alignment",
      icon: BarChart3,
      color: "yellow",
      category: "Analysis",
    },
  ]

  const generateContent = async (toolId: string, formData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/ai/tools/${toolId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setGeneratedContent(data.content || data.response || data.analysis || "Content generated successfully!")
    } catch (error) {
      console.error(`Error generating content:`, error)
      setGeneratedContent(`Failed to generate content. Please try again.`)
    } finally {
      setIsLoading(false)
    }
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
                  AI Tools Suite
                </h1>
                <p className="text-sm text-gray-600">Complete AI-powered educational toolkit</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                CBC Aligned
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                10 AI Tools
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Tools Overview</TabsTrigger>
            <TabsTrigger value="workspace">AI Workspace</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete AI Teaching Assistant</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Access 10 powerful AI tools designed specifically for Kenyan CBC curriculum
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiTools.map((tool) => {
                  const IconComponent = tool.icon
                  return (
                    <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-${tool.color}-100 flex items-center justify-center`}>
                            <IconComponent className={`w-5 h-5 text-${tool.color}-600`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {tool.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">{tool.description}</CardDescription>
                        <Button className="w-full" onClick={() => setActiveTab("workspace")}>
                          Use Tool
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workspace">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    AI Workspace
                  </CardTitle>
                  <CardDescription>Select a tool and configure your content generation</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label>AI Tool</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an AI tool" />
                      </SelectTrigger>
                      <SelectContent>
                        {aiTools.map((tool) => (
                          <SelectItem key={tool.id} value={tool.id}>
                            {tool.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Subject</Label>
                      <Select>
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
                      <Select>
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
                    <Input placeholder="Enter topic or learning objective" />
                  </div>

                  <div>
                    <Label>Additional Instructions</Label>
                    <Textarea placeholder="Provide any specific requirements or preferences..." rows={3} />
                  </div>

                  <Button
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Generated Content
                    </span>
                    {generatedContent && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
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
                    <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">{generatedContent}</pre>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Generated content will appear here</p>
                      <p className="text-sm">Select a tool and configure your settings to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
