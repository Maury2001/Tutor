"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  FileText,
  Download,
  PrinterIcon as Print,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Star,
  Target,
  MessageSquare,
  Phone,
  BookOpen,
  Award,
  BarChart3,
} from "lucide-react"

interface ParentInvolvementData {
  reportId: string
  generatedDate: string
  reportingPeriod: {
    startDate: string
    endDate: string
  }
  student: {
    id: string
    name: string
    grade: string
    pathway: string
  }
  parent: {
    id: string
    name: string
    relationship: string
    email: string
    phone: string
    involvementLevel: string
  }
  consultationSummary: {
    totalScheduled: number
    parentAttended: number
    parentMissed: number
    attendanceRate: number
  }
  preparationMaterials: {
    totalSent: number
    totalRead: number
    readingRate: number
    feedbackProvided: number
  }
  communication: {
    totalMessages: number
    responseRate: number
    averageResponseTime: string
    preferredMethod: string
  }
  engagement: {
    overallScore: number
    preparationScore: number
    participationScore: number
    followUpScore: number
  }
  outcomes: {
    pathwayDecisionMade: boolean
    parentSatisfaction: number
    studentBenefit: number
    familyAlignment: number
  }
  recommendations: string[]
  nextSteps: string[]
}

interface ConsultationDetail {
  id: string
  date: string
  consultant: string
  type: string
  parentAttended: boolean
  preparationCompleted: boolean
  objectives: string[]
  outcomes: string[]
  parentFeedback?: string
  rating?: number
}

export function ParentInvolvementReport({ studentId = "student-001" }: { studentId?: string }) {
  const [reportData, setReportData] = useState<ParentInvolvementData | null>(null)
  const [consultationDetails, setConsultationDetails] = useState<ConsultationDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true)

      // Mock comprehensive report data
      const mockReportData: ParentInvolvementData = {
        reportId: "PIR-2024-001",
        generatedDate: "2024-01-18",
        reportingPeriod: {
          startDate: "2024-01-01",
          endDate: "2024-01-18",
        },
        student: {
          id: "student-001",
          name: "John Kamau",
          grade: "Grade 9",
          pathway: "STEM Pathway (Primary Choice)",
        },
        parent: {
          id: "parent-001",
          name: "Mrs. Mary Kamau",
          relationship: "Mother",
          email: "mary.kamau@email.com",
          phone: "+254-722-123-456",
          involvementLevel: "High",
        },
        consultationSummary: {
          totalScheduled: 3,
          parentAttended: 3,
          parentMissed: 0,
          attendanceRate: 100,
        },
        preparationMaterials: {
          totalSent: 5,
          totalRead: 3,
          readingRate: 60,
          feedbackProvided: 2,
        },
        communication: {
          totalMessages: 12,
          responseRate: 100,
          averageResponseTime: "2.5 hours",
          preferredMethod: "WhatsApp",
        },
        engagement: {
          overallScore: 92,
          preparationScore: 88,
          participationScore: 95,
          followUpScore: 90,
        },
        outcomes: {
          pathwayDecisionMade: true,
          parentSatisfaction: 95,
          studentBenefit: 90,
          familyAlignment: 98,
        },
        recommendations: [
          "Continue high level of engagement in upcoming university visits",
          "Complete pending financial planning worksheet before next consultation",
          "Consider attending additional industry professional meetings",
          "Explore scholarship application preparation sessions",
          "Maintain regular communication with assigned counselor",
        ],
        nextSteps: [
          "Schedule follow-up meeting with mathematics teacher (Due: Jan 25)",
          "Complete university campus visit arrangements (Due: Jan 28)",
          "Review and submit financial planning worksheet (Due: Jan 22)",
          "Attend Safaricom professional meeting (Scheduled: Jan 25)",
          "Begin scholarship research and application preparation",
        ],
      }

      const mockConsultationDetails: ConsultationDetail[] = [
        {
          id: "consult-001",
          date: "2024-01-15",
          consultant: "Ms. Sarah Wanjiku (Career Counselor)",
          type: "Initial Career Counseling",
          parentAttended: true,
          preparationCompleted: true,
          objectives: [
            "Discuss CBC pathway options",
            "Understand family priorities and concerns",
            "Establish communication preferences",
            "Set consultation schedule",
          ],
          outcomes: [
            "STEM pathway identified as primary choice",
            "Strong family consensus achieved",
            "Communication preferences established",
            "Comprehensive consultation plan created",
          ],
          parentFeedback: "Very informative session. Helped us understand the options clearly.",
          rating: 5,
        },
        {
          id: "consult-002",
          date: "2024-01-20",
          consultant: "Mr. David Mwangi (Mathematics Teacher)",
          type: "Academic Consultation",
          parentAttended: true,
          preparationCompleted: true,
          objectives: [
            "Review John's mathematics performance",
            "Discuss Grade 10 preparation strategies",
            "Understand home support requirements",
            "Plan advanced mathematics pathway",
          ],
          outcomes: [
            "Identified specific areas for improvement",
            "Received comprehensive study plan",
            "Established home tutoring schedule",
            "Planned advanced mathematics track",
          ],
          parentFeedback: "Excellent guidance on supporting John's mathematics studies at home.",
          rating: 5,
        },
        {
          id: "consult-003",
          date: "2024-01-25",
          consultant: "Eng. Sarah Njeri (Software Engineer)",
          type: "Industry Professional Meeting",
          parentAttended: true,
          preparationCompleted: true,
          objectives: [
            "Understand software engineering career prospects",
            "Learn about industry requirements",
            "Explore mentorship opportunities",
            "Discuss work-life balance",
          ],
          outcomes: [
            "Gained clear understanding of career path",
            "Established mentorship connection",
            "Received industry insights and trends",
            "Understood professional development requirements",
          ],
          parentFeedback: "Very inspiring meeting. Sarah provided excellent career insights.",
          rating: 5,
        },
      ]

      setReportData(mockReportData)
      setConsultationDetails(mockConsultationDetails)
      setIsLoading(false)
    }

    fetchReportData()
  }, [studentId])

  const handleDownloadReport = () => {
    // In a real application, this would generate and download a PDF report
    console.log("Downloading parent involvement report...")
    alert("Report download initiated. PDF will be generated with all data.")
  }

  const handlePrintReport = () => {
    window.print()
  }

  const handleEmailReport = () => {
    // In a real application, this would email the report
    console.log("Emailing report to parent...")
    alert("Report will be emailed to mary.kamau@email.com")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Report Data Not Available</h3>
          <p className="text-muted-foreground">Unable to generate parent involvement report</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Report Header */}
      <Card className="print:shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Parent Involvement Summary Report</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <span>Report ID: {reportData.reportId}</span>
                  <span>Generated: {new Date(reportData.generatedDate).toLocaleDateString()}</span>
                  <span>
                    Period: {new Date(reportData.reportingPeriod.startDate).toLocaleDateString()} -{" "}
                    {new Date(reportData.reportingPeriod.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button onClick={handleDownloadReport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button onClick={handlePrintReport} variant="outline">
                <Print className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button onClick={handleEmailReport}>
                <Mail className="mr-2 h-4 w-4" />
                Email Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Student & Parent Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{reportData.student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grade:</span>
                <span className="font-medium">{reportData.student.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pathway:</span>
                <Badge className="bg-green-100 text-green-800">{reportData.student.pathway}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Parent Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{reportData.parent.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Relationship:</span>
                <span className="font-medium">{reportData.parent.relationship}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Involvement Level:</span>
                <Badge className="bg-purple-100 text-purple-800">{reportData.parent.involvementLevel}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact:</span>
                <span className="font-medium text-sm">{reportData.parent.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Key Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{reportData.consultationSummary.attendanceRate}%</div>
              <div className="text-sm text-muted-foreground">Consultation Attendance</div>
              <Progress value={reportData.consultationSummary.attendanceRate} className="mt-2 h-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{reportData.preparationMaterials.readingRate}%</div>
              <div className="text-sm text-muted-foreground">Material Reading Rate</div>
              <Progress value={reportData.preparationMaterials.readingRate} className="mt-2 h-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{reportData.communication.responseRate}%</div>
              <div className="text-sm text-muted-foreground">Communication Response</div>
              <Progress value={reportData.communication.responseRate} className="mt-2 h-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{reportData.engagement.overallScore}</div>
              <div className="text-sm text-muted-foreground">Overall Engagement Score</div>
              <Progress value={reportData.engagement.overallScore} className="mt-2 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Report Tabs */}
      <Card className="print:break-inside-avoid">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 print:hidden">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <h3 className="text-xl font-semibold">Executive Summary</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Engagement Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Preparation Score</span>
                          <span className="text-sm font-medium">{reportData.engagement.preparationScore}/100</span>
                        </div>
                        <Progress value={reportData.engagement.preparationScore} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Participation Score</span>
                          <span className="text-sm font-medium">{reportData.engagement.participationScore}/100</span>
                        </div>
                        <Progress value={reportData.engagement.participationScore} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Follow-up Score</span>
                          <span className="text-sm font-medium">{reportData.engagement.followUpScore}/100</span>
                        </div>
                        <Progress value={reportData.engagement.followUpScore} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Outcome Indicators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pathway Decision Made</span>
                        {reportData.outcomes.pathwayDecisionMade ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Parent Satisfaction</span>
                          <span className="text-sm font-medium">{reportData.outcomes.parentSatisfaction}%</span>
                        </div>
                        <Progress value={reportData.outcomes.parentSatisfaction} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Student Benefit</span>
                          <span className="text-sm font-medium">{reportData.outcomes.studentBenefit}%</span>
                        </div>
                        <Progress value={reportData.outcomes.studentBenefit} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Family Alignment</span>
                          <span className="text-sm font-medium">{reportData.outcomes.familyAlignment}%</span>
                        </div>
                        <Progress value={reportData.outcomes.familyAlignment} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Strengths</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Perfect consultation attendance record (100%)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Excellent communication responsiveness
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Strong family consensus on pathway selection
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          High quality feedback and engagement
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          Complete pending preparation materials (40% pending)
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          Increase feedback provision on materials
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          Consider attending additional professional meetings
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="consultations" className="space-y-4">
              <h3 className="text-xl font-semibold">Consultation Participation Analysis</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {reportData.consultationSummary.totalScheduled}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Scheduled</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {reportData.consultationSummary.parentAttended}
                    </div>
                    <div className="text-sm text-muted-foreground">Parent Attended</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{reportData.consultationSummary.parentMissed}</div>
                    <div className="text-sm text-muted-foreground">Missed Sessions</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {consultationDetails.map((consultation) => (
                  <Card key={consultation.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{consultation.consultant}</h4>
                          <p className="text-sm text-muted-foreground">{consultation.type}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{new Date(consultation.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {consultation.parentAttended ? (
                            <Badge className="bg-green-100 text-green-800">Attended</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Missed</Badge>
                          )}
                          {consultation.preparationCompleted && (
                            <Badge className="bg-blue-100 text-blue-800">Prepared</Badge>
                          )}
                          {consultation.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">{consultation.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Objectives:</h5>
                          <ul className="text-sm space-y-1">
                            {consultation.objectives.map((objective, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Target className="h-3 w-3 text-blue-600" />
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Outcomes:</h5>
                          <ul className="text-sm space-y-1">
                            {consultation.outcomes.map((outcome, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {outcome}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {consultation.parentFeedback && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-sm text-blue-800 mb-1">Parent Feedback:</h5>
                          <p className="text-sm text-blue-700">"{consultation.parentFeedback}"</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <h3 className="text-xl font-semibold">Preparation Materials Analysis</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{reportData.preparationMaterials.totalSent}</div>
                    <div className="text-sm text-muted-foreground">Materials Sent</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{reportData.preparationMaterials.totalRead}</div>
                    <div className="text-sm text-muted-foreground">Materials Read</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {reportData.preparationMaterials.feedbackProvided}
                    </div>
                    <div className="text-sm text-muted-foreground">Feedback Provided</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {reportData.preparationMaterials.readingRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">Reading Rate</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Material Engagement Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "STEM Career Pathways Guide",
                        type: "Guide",
                        sent: true,
                        read: true,
                        feedback: "Very informative, helped understand career prospects better",
                      },
                      {
                        title: "University Admission Requirements",
                        type: "Checklist",
                        sent: true,
                        read: true,
                        feedback: null,
                      },
                      {
                        title: "Financial Planning Worksheet",
                        type: "Worksheet",
                        sent: true,
                        read: false,
                        feedback: null,
                      },
                      {
                        title: "Parent Questions Template",
                        type: "Guide",
                        sent: false,
                        read: false,
                        feedback: null,
                      },
                      {
                        title: "Supporting Your STEM Student",
                        type: "Guide",
                        sent: false,
                        read: false,
                        feedback: null,
                      },
                    ].map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-sm">{material.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {material.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {material.sent ? (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">Sent</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Pending
                            </Badge>
                          )}
                          {material.read && <Badge className="bg-green-100 text-green-800 text-xs">Read</Badge>}
                          {material.feedback && (
                            <Badge className="bg-purple-100 text-purple-800 text-xs">Feedback</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication" className="space-y-4">
              <h3 className="text-xl font-semibold">Communication Analysis</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{reportData.communication.totalMessages}</div>
                    <div className="text-sm text-muted-foreground">Total Messages</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{reportData.communication.responseRate}%</div>
                    <div className="text-sm text-muted-foreground">Response Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {reportData.communication.averageResponseTime}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Communication Preferences & History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Preferred Communication Methods</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-green-600" />
                            <span className="text-sm">WhatsApp</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800 text-xs">Primary</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Phone Call</span>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Secondary</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">Email</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Backup
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Recent Communication History</h4>
                      <div className="space-y-2">
                        {[
                          {
                            date: "2024-01-17",
                            method: "WhatsApp",
                            message: "Consultation reminder sent",
                            status: "Read",
                          },
                          {
                            date: "2024-01-16",
                            method: "Phone",
                            message: "University visit discussion",
                            status: "Completed",
                          },
                          {
                            date: "2024-01-15",
                            method: "Email",
                            message: "Preparation materials sent",
                            status: "Read",
                          },
                        ].map((comm, index) => (
                          <div key={index} className="p-2 border rounded text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{comm.message}</span>
                              <Badge
                                className={
                                  comm.status === "Read" || comm.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {comm.status}
                              </Badge>
                            </div>
                            <div className="text-muted-foreground text-xs mt-1">
                              {comm.date} via {comm.method}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="outcomes" className="space-y-4">
              <h3 className="text-xl font-semibold">Outcomes & Recommendations</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-gold-600" />
                      Key Outcomes Achieved
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pathway Decision Made</span>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Parent Satisfaction</span>
                          <span className="text-sm font-medium">{reportData.outcomes.parentSatisfaction}%</span>
                        </div>
                        <Progress value={reportData.outcomes.parentSatisfaction} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Student Benefit</span>
                          <span className="text-sm font-medium">{reportData.outcomes.studentBenefit}%</span>
                        </div>
                        <Progress value={reportData.outcomes.studentBenefit} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Family Alignment</span>
                          <span className="text-sm font-medium">{reportData.outcomes.familyAlignment}%</span>
                        </div>
                        <Progress value={reportData.outcomes.familyAlignment} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Overall Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-green-600 mb-2">{reportData.engagement.overallScore}</div>
                      <div className="text-sm text-muted-foreground">Overall Engagement Score</div>
                      <Badge className="bg-green-100 text-green-800 mt-2">Excellent Performance</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground text-center">
                      Mrs. Mary Kamau demonstrates exceptional commitment to her son's educational journey with
                      outstanding participation in consultations and strong family support for the chosen STEM pathway.
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommendations for Continued Success</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Next Steps & Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Report Footer */}
      <Card className="print:shadow-none">
        <CardContent className="p-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              This report was generated on {new Date(reportData.generatedDate).toLocaleDateString()} for the period{" "}
              {new Date(reportData.reportingPeriod.startDate).toLocaleDateString()} to{" "}
              {new Date(reportData.reportingPeriod.endDate).toLocaleDateString()}.
            </p>
            <p className="mt-2">
              For questions about this report, please contact the Career Counseling Department at
              counseling@school.ac.ke
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
