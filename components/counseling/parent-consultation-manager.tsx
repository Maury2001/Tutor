"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Phone, Mail, MessageSquare, Send, AlertCircle, FileText, Star, Target } from "lucide-react"

interface ParentProfile {
  id: string
  name: string
  relationship: "Mother" | "Father" | "Guardian"
  email: string
  phone: string
  whatsapp?: string
  communicationPreference: "Email" | "Phone" | "SMS" | "WhatsApp"
  availability: {
    weekdays: string[]
    weekends: boolean
    preferredTimes: string[]
    unavailableDates: string[]
  }
  involvementLevel: "High" | "Medium" | "Low"
  concerns: string[]
  interests: string[]
  educationBackground: string
  occupation: string
  supportCapacity: {
    financial: "High" | "Medium" | "Low"
    academic: "High" | "Medium" | "Low"
    emotional: "High" | "Medium" | "Low"
  }
}

interface ParentPreparationMaterial {
  id: string
  title: string
  description: string
  type: "Guide" | "Worksheet" | "Checklist" | "FAQ" | "Video"
  consultationType: string
  content: string
  sent: boolean
  sentDate?: string
  read: boolean
  readDate?: string
  feedback?: string
}

export function ParentConsultationManager({ studentId = "student-001" }: { studentId?: string }) {
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null)
  const [preparationMaterials, setPreparationMaterials] = useState<ParentPreparationMaterial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Mock parent profile data
      const mockParentProfile: ParentProfile = {
        id: "parent-001",
        name: "Mrs. Mary Kamau",
        relationship: "Mother",
        email: "mary.kamau@email.com",
        phone: "+254-722-123-456",
        whatsapp: "+254-722-123-456",
        communicationPreference: "WhatsApp",
        availability: {
          weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          weekends: true,
          preferredTimes: ["16:00-18:00", "19:00-21:00"],
          unavailableDates: ["2024-01-22", "2024-01-23"],
        },
        involvementLevel: "High",
        concerns: [
          "University costs and financial planning",
          "Career security and job market prospects",
          "Academic pressure and student wellbeing",
          "Local vs international university options",
          "Long-term career growth potential",
        ],
        interests: [
          "STEM career opportunities",
          "Scholarship and financial aid options",
          "University campus life and support services",
          "Professional networking and mentorship",
          "Academic excellence strategies",
        ],
        educationBackground: "Secondary School Certificate",
        occupation: "Small Business Owner",
        supportCapacity: {
          financial: "Medium",
          academic: "Medium",
          emotional: "High",
        },
      }

      // Mock preparation materials
      const mockMaterials: ParentPreparationMaterial[] = [
        {
          id: "material-001",
          title: "STEM Career Pathways Guide for Parents",
          description: "Comprehensive overview of STEM careers, salary expectations, and job market trends",
          type: "Guide",
          consultationType: "Professional",
          content: "Detailed guide covering software engineering, data science, engineering, and other STEM careers",
          sent: true,
          sentDate: "2024-01-15",
          read: true,
          readDate: "2024-01-16",
          feedback: "Very informative, helped understand career prospects better",
        },
        {
          id: "material-002",
          title: "University Admission Requirements Checklist",
          description: "Step-by-step checklist for STEM university applications",
          type: "Checklist",
          consultationType: "University Rep",
          content: "Detailed requirements for top Kenyan universities offering STEM programs",
          sent: true,
          sentDate: "2024-01-15",
          read: true,
          readDate: "2024-01-17",
        },
        {
          id: "material-003",
          title: "Financial Planning Worksheet",
          description: "Budget planning tool for university education costs",
          type: "Worksheet",
          consultationType: "University Rep",
          content: "Interactive worksheet to calculate education costs and plan financing",
          sent: true,
          sentDate: "2024-01-15",
          read: false,
        },
        {
          id: "material-004",
          title: "Parent Questions Template",
          description: "Suggested questions to ask during consultations",
          type: "Guide",
          consultationType: "All",
          content: "Comprehensive list of questions organized by consultation type",
          sent: false,
        },
        {
          id: "material-005",
          title: "Supporting Your STEM Student",
          description: "Strategies for providing academic and emotional support",
          type: "Guide",
          consultationType: "Teacher",
          content: "Practical tips for supporting students in challenging STEM subjects",
          sent: false,
        },
      ]

      setParentProfile(mockParentProfile)
      setPreparationMaterials(mockMaterials)
      setIsLoading(false)
    }

    fetchData()
  }, [studentId])

  const handleSendMaterials = () => {
    const updatedMaterials = preparationMaterials.map((material) => {
      if (selectedMaterials.includes(material.id) && !material.sent) {
        return {
          ...material,
          sent: true,
          sentDate: new Date().toISOString().split("T")[0],
        }
      }
      return material
    })

    setPreparationMaterials(updatedMaterials)
    setSelectedMaterials([])
  }

  const handleMaterialSelection = (materialId: string, checked: boolean) => {
    if (checked) {
      setSelectedMaterials([...selectedMaterials, materialId])
    } else {
      setSelectedMaterials(selectedMaterials.filter((id) => id !== materialId))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!parentProfile) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Parent Profile Not Found</h3>
          <p className="text-muted-foreground">Unable to load parent information</p>
        </CardContent>
      </Card>
    )
  }

  const sentMaterials = preparationMaterials.filter((m) => m.sent).length
  const readMaterials = preparationMaterials.filter((m) => m.read).length
  const pendingMaterials = preparationMaterials.filter((m) => !m.sent).length

  return (
    <div className="space-y-6">
      {/* Parent Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{parentProfile.name}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <Badge variant="outline">{parentProfile.relationship}</Badge>
                  <Badge className="bg-purple-100 text-purple-800">{parentProfile.involvementLevel} Involvement</Badge>
                  <span className="text-sm">{parentProfile.occupation}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Preferred Contact</div>
              <div className="font-medium">{parentProfile.communicationPreference}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Parent Engagement Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Parent Engagement Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sentMaterials}</div>
              <div className="text-sm text-muted-foreground">Materials Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{readMaterials}</div>
              <div className="text-sm text-muted-foreground">Materials Read</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingMaterials}</div>
              <div className="text-sm text-muted-foreground">Pending Materials</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-muted-foreground">Consultations Attended</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parent Profile Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parent Profile & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Contact Information</Label>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{parentProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{parentProfile.phone}</span>
                  </div>
                  {parentProfile.whatsapp && (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{parentProfile.whatsapp}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Availability</Label>
                <div className="mt-2 space-y-1 text-sm">
                  <div>
                    <strong>Preferred Times:</strong>
                    <div className="text-muted-foreground">{parentProfile.availability.preferredTimes.join(", ")}</div>
                  </div>
                  <div>
                    <strong>Weekends:</strong>
                    <span className="text-muted-foreground ml-1">
                      {parentProfile.availability.weekends ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Support Capacity</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-muted-foreground">Financial</div>
                  <Badge
                    className={
                      parentProfile.supportCapacity.financial === "High"
                        ? "bg-green-100 text-green-800"
                        : parentProfile.supportCapacity.financial === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {parentProfile.supportCapacity.financial}
                  </Badge>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-muted-foreground">Academic</div>
                  <Badge
                    className={
                      parentProfile.supportCapacity.academic === "High"
                        ? "bg-green-100 text-green-800"
                        : parentProfile.supportCapacity.academic === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {parentProfile.supportCapacity.academic}
                  </Badge>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-muted-foreground">Emotional</div>
                  <Badge
                    className={
                      parentProfile.supportCapacity.emotional === "High"
                        ? "bg-green-100 text-green-800"
                        : parentProfile.supportCapacity.emotional === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {parentProfile.supportCapacity.emotional}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Key Concerns</Label>
              <div className="mt-2 space-y-1">
                {parentProfile.concerns.slice(0, 3).map((concern, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-3 w-3 text-yellow-600" />
                    <span className="text-muted-foreground">{concern}</span>
                  </div>
                ))}
                {parentProfile.concerns.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{parentProfile.concerns.length - 3} more concerns
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Areas of Interest</Label>
              <div className="mt-2 space-y-1">
                {parentProfile.interests.slice(0, 3).map((interest, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-blue-600" />
                    <span className="text-muted-foreground">{interest}</span>
                  </div>
                ))}
                {parentProfile.interests.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{parentProfile.interests.length - 3} more interests
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preparation Materials Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preparation Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {preparationMaterials.map((material) => (
                <div
                  key={material.id}
                  className={`p-3 border rounded-lg ${material.sent ? "bg-blue-50 border-blue-200" : "bg-gray-50"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!material.sent && (
                        <Checkbox
                          checked={selectedMaterials.includes(material.id)}
                          onCheckedChange={(checked) => handleMaterialSelection(material.id, checked as boolean)}
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-sm">{material.title}</h4>
                        <p className="text-xs text-muted-foreground">{material.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {material.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {material.consultationType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {material.sent ? (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">Sent</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      )}
                      {material.read && <Badge className="bg-green-100 text-green-800 text-xs">Read</Badge>}
                    </div>
                  </div>

                  {material.sent && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <div>Sent: {material.sentDate}</div>
                      {material.readDate && <div>Read: {material.readDate}</div>}
                      {material.feedback && (
                        <div className="mt-1 p-2 bg-white rounded text-sm">
                          <strong>Parent Feedback:</strong> {material.feedback}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedMaterials.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedMaterials.length} material(s) selected for sending
                  </span>
                  <Button onClick={handleSendMaterials} size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Send Materials
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Parent-Specific Consultation Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Parent-Specific Consultation Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Teacher Consultations</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-blue-600" />
                    Understand academic support needs
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-blue-600" />
                    Learn about home study strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-blue-600" />
                    Discuss progress monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-blue-600" />
                    Address academic challenges
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Professional Meetings</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-green-600" />
                    Understand career prospects
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-green-600" />
                    Learn about industry requirements
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-green-600" />
                    Explore mentorship opportunities
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-green-600" />
                    Discuss work-life balance
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">University Visits</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-orange-600" />
                    Understand admission requirements
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-orange-600" />
                    Learn about financial aid options
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-orange-600" />
                    Assess campus facilities
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-orange-600" />
                    Discuss student support services
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Communication & Follow-up */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Communication & Follow-up</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Recent Communications</h4>
              <div className="space-y-3">
                {[
                  {
                    date: "2024-01-17",
                    type: "WhatsApp",
                    message: "Sent STEM career guide and university checklist",
                    status: "Read",
                  },
                  {
                    date: "2024-01-16",
                    type: "Phone",
                    message: "Discussed upcoming university visit arrangements",
                    status: "Completed",
                  },
                  {
                    date: "2024-01-15",
                    type: "Email",
                    message: "Consultation confirmation and preparation materials",
                    status: "Read",
                  },
                ].map((comm, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium">{comm.message}</div>
                      <div className="text-xs text-muted-foreground">
                        {comm.date} via {comm.type}
                      </div>
                    </div>
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
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Upcoming Follow-ups</h4>
              <div className="space-y-3">
                {[
                  {
                    date: "2024-01-20",
                    action: "Send reminder for mathematics teacher consultation",
                    priority: "High",
                  },
                  {
                    date: "2024-01-22",
                    action: "Follow up on financial planning worksheet completion",
                    priority: "Medium",
                  },
                  {
                    date: "2024-01-25",
                    action: "Confirm attendance for Safaricom professional meeting",
                    priority: "High",
                  },
                ].map((followUp, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div>
                      <div className="text-sm font-medium">{followUp.action}</div>
                      <div className="text-xs text-muted-foreground">{followUp.date}</div>
                    </div>
                    <Badge
                      className={
                        followUp.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : followUp.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }
                    >
                      {followUp.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Update Message
            </Button>
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Schedule Call
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
