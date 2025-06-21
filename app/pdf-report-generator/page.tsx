"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Download,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  School,
  Brain,
  Target,
  CheckCircle,
  Loader2,
  Mail,
  Share2,
  Settings,
} from "lucide-react"

interface ReportTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  estimatedSize: string
  generationTime: string
}

export default function PDFReportGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("school-performance")
  const [selectedSchool, setSelectedSchool] = useState("hilltop-high")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStatus, setGenerationStatus] = useState("")
  const [generatedReports, setGeneratedReports] = useState<string[]>([])
  const [dateRange, setDateRange] = useState("last-30-days")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeDetails, setIncludeDetails] = useState(true)

  const reportTemplates: ReportTemplate[] = [
    {
      id: "parent-involvement",
      name: "Parent Involvement Report",
      description: "Comprehensive parent engagement and consultation analytics",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      category: "Parent Reports",
      estimatedSize: "2-3 MB",
      generationTime: "30-45 seconds",
    },
    {
      id: "student-progress",
      name: "Student Progress Analytics",
      description: "Individual and class-wide student performance metrics",
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      category: "Academic Reports",
      estimatedSize: "1-2 MB",
      generationTime: "20-30 seconds",
    },
    {
      id: "ai-usage-analytics",
      name: "AI Usage & Cost Analytics",
      description: "AI model usage, token consumption, and cost analysis",
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      category: "System Reports",
      estimatedSize: "1.5-2 MB",
      generationTime: "25-35 seconds",
    },
    {
      id: "curriculum-alignment",
      name: "CBC Curriculum Alignment Report",
      description: "Curriculum coverage and learning outcome tracking",
      icon: <Target className="h-6 w-6 text-orange-600" />,
      category: "Academic Reports",
      estimatedSize: "3-4 MB",
      generationTime: "40-60 seconds",
    },
    {
      id: "school-performance",
      name: "School Performance Dashboard",
      description: "Comprehensive school-wide performance and engagement metrics",
      icon: <School className="h-6 w-6 text-indigo-600" />,
      category: "Administrative Reports",
      estimatedSize: "4-5 MB",
      generationTime: "60-90 seconds",
    },
    {
      id: "virtual-lab-usage",
      name: "Virtual Lab Usage Report",
      description: "Virtual laboratory experiment usage and completion analytics",
      icon: <BarChart3 className="h-6 w-6 text-teal-600" />,
      category: "System Reports",
      estimatedSize: "2-3 MB",
      generationTime: "35-45 seconds",
    },
  ]

  const schools = [
    { id: "riverside-primary", name: "Riverside Primary School", students: 450 },
    { id: "hilltop-high", name: "Hilltop High School", students: 800 },
    { id: "valley-academy", name: "Valley Academy", students: 320 },
    { id: "mountain-view", name: "Mountain View School", students: 600 },
    { id: "coastal-college", name: "Coastal College Prep", students: 750 },
  ]

  const handleGenerateReport = async () => {
    if (!selectedTemplate) {
      alert("Please select a report template first!")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationStatus("Initializing comprehensive school performance analysis...")

    try {
      const template = reportTemplates.find((t) => t.id === selectedTemplate)
      const schoolName = schools.find((s) => s.id === selectedSchool)?.name || "Selected School"

      const steps = [
        { message: "Collecting student enrollment and demographic data...", progress: 10 },
        { message: "Analyzing academic performance across all grade levels...", progress: 20 },
        { message: "Processing AI tutor usage and engagement metrics...", progress: 30 },
        { message: "Calculating virtual lab experiment completion rates...", progress: 40 },
        { message: "Evaluating teacher-student interaction patterns...", progress: 50 },
        { message: "Generating curriculum alignment and CBC compliance metrics...", progress: 60 },
        { message: "Creating comparative performance benchmarks...", progress: 70 },
        { message: "Building interactive charts and visualizations...", progress: 80 },
        { message: "Compiling parent engagement and communication data...", progress: 85 },
        { message: "Formatting comprehensive PDF layout with school branding...", progress: 90 },
        { message: "Adding executive summary and recommendations...", progress: 95 },
        { message: "Finalizing comprehensive school performance report...", progress: 100 },
      ]

      for (const step of steps) {
        setGenerationStatus(step.message)
        setGenerationProgress(step.progress)
        await new Promise((resolve) => setTimeout(resolve, 1200))
      }

      // Generate comprehensive report name
      const reportName = `Comprehensive_School_Performance_${schoolName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
      setGeneratedReports((prev) => [...prev, reportName])

      // Simulate download with comprehensive report details
      const link = document.createElement("a")
      link.href = "#" // In real app, this would be the blob URL
      link.download = reportName
      link.click()

      setGenerationStatus("🎉 Comprehensive school performance report generated successfully!")

      // Show success message with report details
      setTimeout(() => {
        alert(`📊 COMPREHENSIVE SCHOOL PERFORMANCE REPORT GENERATED! 📊

📋 Report Details:
• School: ${schoolName}
• File Size: 4.2 MB
• Pages: 24 pages
• Generation Time: ${steps.length * 1.2} seconds

📈 Report Includes:
✅ Executive Summary & Key Metrics
✅ Student Performance Analytics (All Grades)
✅ AI Tutor Usage & Engagement Stats
✅ Virtual Lab Completion Rates
✅ Teacher Effectiveness Metrics
✅ Parent Involvement Analysis
✅ CBC Curriculum Alignment
✅ Comparative Benchmarking
✅ Recommendations & Action Items
✅ Visual Charts & Graphs

📥 The report has been automatically downloaded!
📧 You can also email it to stakeholders from the History tab.`)
      }, 1000)
    } catch (error) {
      console.error("Report generation error:", error)
      setGenerationStatus("❌ Report generation failed. Please try again.")
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
        setGenerationProgress(0)
        setGenerationStatus("")
      }, 3000)
    }
  }

  const handleEmailReport = (reportName: string) => {
    alert(`Email functionality: ${reportName} would be sent to selected recipients`)
  }

  const handleShareReport = (reportName: string) => {
    if (navigator.share) {
      navigator.share({
        title: reportName,
        text: `CBC TutorBot Report: ${reportName}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Report link copied to clipboard!")
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">📊 PDF Report Generator</h1>
        <p className="text-blue-100">
          Generate comprehensive analytics reports for schools, students, and system performance
        </p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="history">Generated Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Configuration */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Report Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="school-select">Select School</Label>
                    <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Schools" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Schools</SelectItem>
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name} ({school.students} students)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                        <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                        <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                        <SelectItem value="current-term">Current Term</SelectItem>
                        <SelectItem value="current-year">Current Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Report Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-charts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
                        <Label htmlFor="include-charts" className="text-sm">
                          Include Charts & Visualizations
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-details" checked={includeDetails} onCheckedChange={setIncludeDetails} />
                        <Label htmlFor="include-details" className="text-sm">
                          Include Detailed Breakdowns
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generation Status */}
              {isGenerating && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">{generationStatus}</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                      <div className="text-xs text-blue-600 text-center">{generationProgress}% Complete</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Report Templates */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Report Template</CardTitle>
                  <CardDescription>Choose from our comprehensive report templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">{template.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                            <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {template.category}
                              </Badge>
                              <div className="text-xs text-gray-500">{template.estimatedSize}</div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">⏱️ {template.generationTime}</div>
                          </div>
                          {selectedTemplate === template.id && (
                            <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button
                      onClick={handleGenerateReport}
                      disabled={!selectedTemplate || isGenerating}
                      size="lg"
                      className="w-full md:w-auto"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Report...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Generate & Download PDF Report
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {template.icon}
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>File Size:</span>
                      <span>{template.estimatedSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Generation Time:</span>
                      <span>{template.generationTime}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => {
                      setSelectedTemplate(template.id)
                      // Switch to generate tab
                      const generateTab = document.querySelector('[value="generate"]') as HTMLElement
                      if (generateTab) generateTab.click()
                    }}
                  >
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recently Generated Reports</CardTitle>
              <CardDescription>Download, email, or share your previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No reports generated yet.</p>
                  <p className="text-sm">Generate your first report to see it here!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedReports.map((report, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{report}</h4>
                          <p className="text-sm text-gray-500">Generated just now</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => alert(`Downloading ${report}`)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEmailReport(report)}>
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleShareReport(report)}>
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{generatedReports.length}</p>
                <p className="text-xs text-gray-500">Reports Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <School className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{schools.length}</p>
                <p className="text-xs text-gray-500">Schools Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{reportTemplates.length}</p>
                <p className="text-xs text-gray-500">Report Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{schools.reduce((sum, school) => sum + school.students, 0)}</p>
                <p className="text-xs text-gray-500">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
