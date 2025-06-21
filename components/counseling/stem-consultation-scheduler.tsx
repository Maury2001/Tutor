"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  User,
  Users,
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Star,
  Target,
  BookOpen,
  Lightbulb,
  Send,
  MessageSquare,
} from "lucide-react"

interface STEMConsultation {
  id: string
  studentId: string
  studentName: string
  consultationType: "Teacher" | "Professional" | "Mentor" | "University Rep"
  consultantName: string
  consultantTitle: string
  consultantOrganization: string
  subject: string
  date: string
  time: string
  duration: number
  location: string
  meetingType: "In-Person" | "Virtual" | "Phone"
  status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled" | "Rescheduled"
  objectives: string[]
  agenda: string[]
  outcomes?: string[]
  studentFeedback?: string
  parentFeedback?: string
  followUpRequired: boolean
  followUpDate?: string
  contactInfo: {
    email: string
    phone: string
    office?: string
  }
  expertise: string[]
  careerPath: string
  experience: string
  notes: string
  parentInvolved: boolean
  parentConfirmed: boolean
  parentPreparationSent: boolean
  parentFeedbackReceived: boolean
  parentSpecificObjectives: string[]
  parentQuestions: string[]
  parentAvailability: {
    preferredTimes: string[]
    unavailableDates: string[]
    communicationPreference: "Email" | "Phone" | "SMS" | "WhatsApp"
  }
  parentPreparationMaterials: {
    sent: boolean
    materials: string[]
    readConfirmation: boolean
  }
  parentFeedback?: {
    satisfaction: number
    concerns: string[]
    additionalQuestions: string[]
    followUpNeeded: boolean
  }
}

interface ConsultationTemplate {
  type: string
  duration: number
  objectives: string[]
  agenda: string[]
  questions: string[]
}

export function STEMConsultationScheduler({ studentId = "student-001" }: { studentId?: string }) {
  const [consultations, setConsultations] = useState<STEMConsultation[]>([])
  const [templates, setTemplates] = useState<ConsultationTemplate[]>([])
  const [isScheduling, setIsScheduling] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)

  const [newConsultation, setNewConsultation] = useState<Partial<STEMConsultation>>({
    studentId: studentId,
    studentName: "John Kamau",
    consultationType: "Teacher",
    date: "",
    time: "",
    duration: 45,
    location: "",
    meetingType: "In-Person",
    objectives: [],
    agenda: [],
    followUpRequired: false,
    contactInfo: { email: "", phone: "" },
    expertise: [],
    notes: "",
    parentInvolved: false,
    parentConfirmed: false,
    parentPreparationSent: false,
    parentFeedbackReceived: false,
    parentSpecificObjectives: [],
    parentQuestions: [],
    parentAvailability: {
      preferredTimes: [],
      unavailableDates: [],
      communicationPreference: "Email",
    },
    parentPreparationMaterials: {
      sent: false,
      materials: [],
      readConfirmation: false,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Mock consultation data
      const mockConsultations: STEMConsultation[] = [
        {
          id: "consult-001",
          studentId: "student-001",
          studentName: "John Kamau",
          consultationType: "Teacher",
          consultantName: "Mr. David Mwangi",
          consultantTitle: "Senior Mathematics Teacher",
          consultantOrganization: "Nairobi High School",
          subject: "Advanced Mathematics",
          date: "2024-01-20",
          time: "10:00",
          duration: 45,
          location: "Mathematics Department Office",
          meetingType: "In-Person",
          status: "Scheduled",
          objectives: [
            "Discuss Grade 10 Mathematics preparation",
            "Review advanced topics and study strategies",
            "Understand university mathematics requirements",
            "Get recommendations for additional resources",
          ],
          agenda: [
            "Review John's current mathematics performance",
            "Discuss Grade 10 mathematics curriculum",
            "Advanced mathematics study strategies",
            "University preparation recommendations",
            "Resource recommendations and study materials",
          ],
          contactInfo: {
            email: "d.mwangi@nairobihigh.ac.ke",
            phone: "+254-700-123-456",
            office: "Math Dept, Room 204",
          },
          expertise: ["Calculus", "Statistics", "Applied Mathematics", "University Prep"],
          careerPath: "Mathematics Education - 15 years experience",
          experience: "Former university lecturer, curriculum developer",
          followUpRequired: true,
          followUpDate: "2024-02-03",
          notes: "Highly recommended by current Grade 9 mathematics teacher",
          parentInvolved: true,
          parentConfirmed: true,
          parentPreparationSent: true,
          parentFeedbackReceived: false,
          parentSpecificObjectives: ["Understand parent expectations", "Discuss support strategies"],
          parentQuestions: ["How can I support John at home?", "What are the key areas to focus on?"],
          parentAvailability: {
            preferredTimes: ["Evenings", "Weekends"],
            unavailableDates: [],
            communicationPreference: "Email",
          },
          parentPreparationMaterials: {
            sent: true,
            materials: ["Mathematics Study Guide"],
            readConfirmation: true,
          },
        },
        {
          id: "consult-002",
          studentId: "student-001",
          studentName: "John Kamau",
          consultationType: "Professional",
          consultantName: "Eng. Sarah Njeri",
          consultantTitle: "Senior Software Engineer",
          consultantOrganization: "Safaricom PLC",
          subject: "Software Engineering Career",
          date: "2024-01-25",
          time: "14:30",
          duration: 60,
          location: "Safaricom Headquarters",
          meetingType: "In-Person",
          status: "Confirmed",
          objectives: [
            "Understand software engineering career path",
            "Learn about industry requirements and skills",
            "Discuss university vs. bootcamp training",
            "Explore internship and mentorship opportunities",
          ],
          agenda: [
            "Introduction to software engineering field",
            "Career progression and opportunities",
            "Required skills and qualifications",
            "Industry trends and future outlook",
            "Advice for aspiring software engineers",
            "Q&A session",
          ],
          contactInfo: {
            email: "sarah.njeri@safaricom.co.ke",
            phone: "+254-722-987-654",
            office: "Safaricom HQ, 7th Floor",
          },
          expertise: ["Full-Stack Development", "Mobile Apps", "Cloud Computing", "Team Leadership"],
          careerPath: "Computer Science → Junior Dev → Senior Engineer → Team Lead",
          experience: "8 years in software development, mentored 20+ junior developers",
          followUpRequired: true,
          followUpDate: "2024-02-15",
          notes: "Alumni of University of Nairobi, active in tech mentorship programs",
          parentInvolved: false,
          parentConfirmed: false,
          parentPreparationSent: false,
          parentFeedbackReceived: false,
          parentSpecificObjectives: [],
          parentQuestions: [],
          parentAvailability: {
            preferredTimes: [],
            unavailableDates: [],
            communicationPreference: "Email",
          },
          parentPreparationMaterials: {
            sent: false,
            materials: [],
            readConfirmation: false,
          },
        },
        {
          id: "consult-003",
          studentId: "student-001",
          studentName: "John Kamau",
          consultationType: "University Rep",
          consultantName: "Dr. Peter Kiprotich",
          consultantTitle: "Admissions Officer",
          consultantOrganization: "JKUAT - Engineering Faculty",
          subject: "Engineering Admissions",
          date: "2024-01-30",
          time: "11:00",
          duration: 90,
          location: "JKUAT Campus",
          meetingType: "In-Person",
          status: "Scheduled",
          objectives: [
            "Understand JKUAT engineering admission requirements",
            "Tour engineering facilities and laboratories",
            "Meet current engineering students",
            "Learn about scholarship opportunities",
          ],
          agenda: [
            "Welcome and university overview",
            "Engineering programs presentation",
            "Admission requirements and process",
            "Campus tour - engineering facilities",
            "Student interaction session",
            "Scholarship and financial aid information",
            "Q&A with faculty members",
          ],
          contactInfo: {
            email: "p.kiprotich@jkuat.ac.ke",
            phone: "+254-67-52123",
            office: "JKUAT Admissions Office",
          },
          expertise: ["Engineering Education", "Student Admissions", "Academic Planning"],
          careerPath: "Engineering → Academia → Student Services",
          experience: "15 years in engineering education and student admissions",
          followUpRequired: true,
          followUpDate: "2024-02-10",
          notes: "Campus visit includes lunch with current engineering students",
          parentInvolved: true,
          parentConfirmed: false,
          parentPreparationSent: false,
          parentFeedbackReceived: false,
          parentSpecificObjectives: ["Understand admission process", "Discuss financial aid options"],
          parentQuestions: ["What are the key deadlines?", "What scholarships are available?"],
          parentAvailability: {
            preferredTimes: ["Weekdays"],
            unavailableDates: [],
            communicationPreference: "Phone",
          },
          parentPreparationMaterials: {
            sent: false,
            materials: ["Admission Requirements Checklist"],
            readConfirmation: false,
          },
        },
      ]

      // Mock consultation templates
      const mockTemplates: ConsultationTemplate[] = [
        {
          type: "STEM Teacher Consultation",
          duration: 45,
          objectives: [
            "Review student's current performance",
            "Discuss Grade 10 subject preparation",
            "Get study strategy recommendations",
            "Understand advanced topic requirements",
          ],
          agenda: [
            "Performance review and assessment",
            "Grade 10 curriculum overview",
            "Study strategies and resources",
            "Advanced topics preparation",
            "University preparation advice",
          ],
          questions: [
            "What are John's strengths and areas for improvement?",
            "How can he best prepare for Grade 10 advanced subjects?",
            "What study resources do you recommend?",
            "How does our curriculum compare to university requirements?",
          ],
        },
        {
          type: "Industry Professional Meeting",
          duration: 60,
          objectives: [
            "Understand career path and opportunities",
            "Learn about industry requirements",
            "Explore mentorship possibilities",
            "Get practical career advice",
          ],
          agenda: [
            "Professional introduction and background",
            "Career path discussion",
            "Industry overview and trends",
            "Skills and qualifications needed",
            "Mentorship and networking opportunities",
            "Q&A session",
          ],
          questions: [
            "What does a typical day look like in your role?",
            "What skills are most important for success?",
            "How did you get started in this field?",
            "What advice would you give to someone starting out?",
            "Are there internship or mentorship opportunities?",
          ],
        },
        {
          type: "University Representative Meeting",
          duration: 90,
          objectives: [
            "Understand admission requirements",
            "Learn about programs and facilities",
            "Explore scholarship opportunities",
            "Meet current students and faculty",
          ],
          agenda: [
            "University and program overview",
            "Admission requirements and process",
            "Campus tour and facilities",
            "Student life and support services",
            "Scholarship and financial aid",
            "Faculty and student interactions",
          ],
          questions: [
            "What are the specific admission requirements?",
            "What makes your program unique?",
            "What support services are available for students?",
            "What are the career outcomes for graduates?",
            "What scholarship opportunities exist?",
          ],
        },
      ]

      setConsultations(mockConsultations)
      setTemplates(mockTemplates)
      setIsLoading(false)
    }

    fetchData()
  }, [studentId])

  const handleScheduleConsultation = () => {
    if (!newConsultation.consultantName || !newConsultation.date || !newConsultation.time) return

    const consultation: STEMConsultation = {
      id: `consult-${Date.now()}`,
      studentId: newConsultation.studentId!,
      studentName: newConsultation.studentName!,
      consultationType: newConsultation.consultationType!,
      consultantName: newConsultation.consultantName!,
      consultantTitle: newConsultation.consultantTitle || "",
      consultantOrganization: newConsultation.consultantOrganization || "",
      subject: newConsultation.subject || "",
      date: newConsultation.date!,
      time: newConsultation.time!,
      duration: newConsultation.duration!,
      location: newConsultation.location!,
      meetingType: newConsultation.meetingType!,
      status: "Scheduled",
      objectives: newConsultation.objectives!,
      agenda: newConsultation.agenda!,
      contactInfo: newConsultation.contactInfo!,
      expertise: newConsultation.expertise!,
      careerPath: newConsultation.careerPath || "",
      experience: newConsultation.experience || "",
      followUpRequired: newConsultation.followUpRequired!,
      notes: newConsultation.notes!,
      parentInvolved: newConsultation.parentInvolved!,
      parentConfirmed: newConsultation.parentConfirmed!,
      parentPreparationSent: newConsultation.parentPreparationSent!,
      parentFeedbackReceived: newConsultation.parentFeedbackReceived!,
      parentSpecificObjectives: newConsultation.parentSpecificObjectives!,
      parentQuestions: newConsultation.parentQuestions!,
      parentAvailability: newConsultation.parentAvailability!,
      parentPreparationMaterials: newConsultation.parentPreparationMaterials!,
    }

    setConsultations([...consultations, consultation])
    setNewConsultation({
      studentId: studentId,
      studentName: "John Kamau",
      consultationType: "Teacher",
      date: "",
      time: "",
      duration: 45,
      location: "",
      meetingType: "In-Person",
      objectives: [],
      agenda: [],
      followUpRequired: false,
      contactInfo: { email: "", phone: "" },
      expertise: [],
      notes: "",
      parentInvolved: false,
      parentConfirmed: false,
      parentPreparationSent: false,
      parentFeedbackReceived: false,
      parentSpecificObjectives: [],
      parentQuestions: [],
      parentAvailability: {
        preferredTimes: [],
        unavailableDates: [],
        communicationPreference: "Email",
      },
      parentPreparationMaterials: {
        sent: false,
        materials: [],
        readConfirmation: false,
      },
    })
    setIsScheduling(false)
  }

  const applyTemplate = (templateType: string) => {
    const template = templates.find((t) => t.type === templateType)
    if (template) {
      setNewConsultation({
        ...newConsultation,
        duration: template.duration,
        objectives: template.objectives,
        agenda: template.agenda,
      })
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      Scheduled: "bg-blue-100 text-blue-800",
      Confirmed: "bg-green-100 text-green-800",
      Completed: "bg-gray-100 text-gray-800",
      Cancelled: "bg-red-100 text-red-800",
      Rescheduled: "bg-yellow-100 text-yellow-800",
    }
    return colors[status as keyof typeof colors] || colors.Scheduled
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      Teacher: <GraduationCap className="h-5 w-5 text-blue-600" />,
      Professional: <Briefcase className="h-5 w-5 text-green-600" />,
      Mentor: <User className="h-5 w-5 text-purple-600" />,
      "University Rep": <BookOpen className="h-5 w-5 text-orange-600" />,
    }
    return icons[type as keyof typeof icons] || icons.Teacher
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const completedConsultations = consultations.filter((c) => c.status === "Completed").length
  const totalConsultations = consultations.length
  const progressPercentage = totalConsultations > 0 ? (completedConsultations / totalConsultations) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">STEM Consultation Scheduler</CardTitle>
                <p className="text-muted-foreground">Arrange meetings with STEM teachers and professionals</p>
              </div>
            </div>
            <Button onClick={() => setIsScheduling(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Consultation
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Consultation Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Consultations Completed</span>
              <span className="text-sm text-muted-foreground">
                {completedConsultations} of {totalConsultations} meetings
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalConsultations}</div>
                <div className="text-sm text-muted-foreground">Total Scheduled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedConsultations}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {consultations.filter((c) => c.status === "Confirmed").length}
                </div>
                <div className="text-sm text-muted-foreground">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {consultations.filter((c) => c.followUpRequired).length}
                </div>
                <div className="text-sm text-muted-foreground">Follow-ups</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent Involvement Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Parent Involvement Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {consultations.filter((c) => c.parentInvolved).length}
                </div>
                <div className="text-sm text-muted-foreground">Parent Included</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {consultations.filter((c) => c.parentConfirmed).length}
                </div>
                <div className="text-sm text-muted-foreground">Parent Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {consultations.filter((c) => c.parentPreparationSent).length}
                </div>
                <div className="text-sm text-muted-foreground">Prep Materials Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {consultations.filter((c) => c.parentFeedbackReceived).length}
                </div>
                <div className="text-sm text-muted-foreground">Feedback Received</div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Parent Participation Guidelines</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Essential Parent Meetings:</strong>
                  <ul className="mt-1 space-y-1 text-blue-700">
                    <li>• University representative visits</li>
                    <li>• Career pathway final decisions</li>
                    <li>• Financial planning discussions</li>
                  </ul>
                </div>
                <div>
                  <strong>Optional Parent Meetings:</strong>
                  <ul className="mt-1 space-y-1 text-blue-700">
                    <li>• Subject teacher consultations</li>
                    <li>• Industry professional meetings</li>
                    <li>• Mentorship introductions</li>
                  </ul>
                </div>
                <div>
                  <strong>Parent-Only Meetings:</strong>
                  <ul className="mt-1 space-y-1 text-blue-700">
                    <li>• Financial aid counseling</li>
                    <li>• University cost planning</li>
                    <li>• Support strategy sessions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling Form */}
      {isScheduling && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule New STEM Consultation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Consultation Type</Label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={newConsultation.consultationType}
                  onChange={(e) =>
                    setNewConsultation({
                      ...newConsultation,
                      consultationType: e.target.value as STEMConsultation["consultationType"],
                    })
                  }
                >
                  <option value="Teacher">STEM Teacher</option>
                  <option value="Professional">Industry Professional</option>
                  <option value="Mentor">Career Mentor</option>
                  <option value="University Rep">University Representative</option>
                </select>
              </div>
              <div>
                <Label>Use Template</Label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={selectedTemplate}
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value)
                    if (e.target.value) applyTemplate(e.target.value)
                  }}
                >
                  <option value="">Select template...</option>
                  {templates.map((template) => (
                    <option key={template.type} value={template.type}>
                      {template.type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Consultant Name</Label>
                <Input
                  value={newConsultation.consultantName}
                  onChange={(e) => setNewConsultation({ ...newConsultation, consultantName: e.target.value })}
                  placeholder="Enter consultant name"
                />
              </div>
              <div>
                <Label>Title/Position</Label>
                <Input
                  value={newConsultation.consultantTitle}
                  onChange={(e) => setNewConsultation({ ...newConsultation, consultantTitle: e.target.value })}
                  placeholder="Enter title or position"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Organization</Label>
                <Input
                  value={newConsultation.consultantOrganization}
                  onChange={(e) => setNewConsultation({ ...newConsultation, consultantOrganization: e.target.value })}
                  placeholder="School, company, or organization"
                />
              </div>
              <div>
                <Label>Subject/Focus Area</Label>
                <Input
                  value={newConsultation.subject}
                  onChange={(e) => setNewConsultation({ ...newConsultation, subject: e.target.value })}
                  placeholder="Mathematics, Engineering, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newConsultation.date}
                  onChange={(e) => setNewConsultation({ ...newConsultation, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={newConsultation.time}
                  onChange={(e) => setNewConsultation({ ...newConsultation, time: e.target.value })}
                />
              </div>
              <div>
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  value={newConsultation.duration}
                  onChange={(e) =>
                    setNewConsultation({ ...newConsultation, duration: Number.parseInt(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Meeting Type</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newConsultation.meetingType}
                  onChange={(e) =>
                    setNewConsultation({
                      ...newConsultation,
                      meetingType: e.target.value as STEMConsultation["meetingType"],
                    })
                  }
                >
                  <option value="In-Person">In-Person</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Location</Label>
              <Input
                value={newConsultation.location}
                onChange={(e) => setNewConsultation({ ...newConsultation, location: e.target.value })}
                placeholder="Meeting location or virtual link"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newConsultation.contactInfo?.email}
                  onChange={(e) =>
                    setNewConsultation({
                      ...newConsultation,
                      contactInfo: { ...newConsultation.contactInfo!, email: e.target.value },
                    })
                  }
                  placeholder="consultant@email.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={newConsultation.contactInfo?.phone}
                  onChange={(e) =>
                    setNewConsultation({
                      ...newConsultation,
                      contactInfo: { ...newConsultation.contactInfo!, phone: e.target.value },
                    })
                  }
                  placeholder="+254-xxx-xxx-xxx"
                />
              </div>
            </div>

            <div>
              <Label>Meeting Objectives</Label>
              <Textarea
                value={newConsultation.objectives?.join("\n")}
                onChange={(e) =>
                  setNewConsultation({ ...newConsultation, objectives: e.target.value.split("\n").filter(Boolean) })
                }
                placeholder="Enter objectives, one per line"
                rows={4}
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={newConsultation.notes}
                onChange={(e) => setNewConsultation({ ...newConsultation, notes: e.target.value })}
                placeholder="Additional notes or special requirements"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleScheduleConsultation}>Schedule Consultation</Button>
              <Button variant="outline" onClick={() => setIsScheduling(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consultations List */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="follow-ups">Follow-ups</TabsTrigger>
              <TabsTrigger value="parents">Parent Management</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <h3 className="text-lg font-semibold">All STEM Consultations</h3>
              <div className="space-y-4">
                {consultations.map((consultation) => (
                  <Card key={consultation.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getTypeIcon(consultation.consultationType)}
                          <div>
                            <h4 className="font-semibold text-lg">{consultation.consultantName}</h4>
                            <p className="text-muted-foreground">
                              {consultation.consultantTitle} - {consultation.consultantOrganization}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(consultation.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{consultation.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{consultation.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(consultation.status)}>{consultation.status}</Badge>
                          <Badge variant="outline">{consultation.consultationType}</Badge>
                          {consultation.followUpRequired && (
                            <Badge className="bg-purple-100 text-purple-800">Follow-up Required</Badge>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm">Meeting Objectives:</h5>
                          <ul className="text-sm text-muted-foreground mt-1">
                            {consultation.objectives.slice(0, 2).map((objective, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {objective}
                              </li>
                            ))}
                            {consultation.objectives.length > 2 && (
                              <li className="text-xs">+{consultation.objectives.length - 2} more objectives</li>
                            )}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm">Contact Information:</h5>
                          <div className="text-sm text-muted-foreground mt-1 space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {consultation.contactInfo.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {consultation.contactInfo.phone}
                            </div>
                          </div>
                        </div>
                      </div>

                      {consultation.expertise.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium text-sm mb-2">Areas of Expertise:</h5>
                          <div className="flex flex-wrap gap-1">
                            {consultation.expertise.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {consultation.parentInvolved && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                          <h5 className="font-medium text-sm text-purple-800 mb-2">Parent Involvement</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="flex items-center gap-2">
                                {consultation.parentConfirmed ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                                )}
                                <span>Parent Attendance: {consultation.parentConfirmed ? "Confirmed" : "Pending"}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {consultation.parentPreparationSent ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                                )}
                                <span>Prep Materials: {consultation.parentPreparationSent ? "Sent" : "Pending"}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-purple-700">
                                <strong>Parent Objectives:</strong>
                                <ul className="mt-1 text-xs">
                                  {consultation.parentSpecificObjectives?.slice(0, 2).map((obj, idx) => (
                                    <li key={idx}>• {obj}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <h3 className="text-lg font-semibold">Upcoming Consultations</h3>
              <div className="space-y-4">
                {consultations
                  .filter((c) => c.status === "Scheduled" || c.status === "Confirmed")
                  .map((consultation) => (
                    <Card key={consultation.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{consultation.consultantName}</h4>
                            <p className="text-muted-foreground">{consultation.subject}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getStatusColor(consultation.status)}>{consultation.status}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(consultation.date).toLocaleDateString()} at {consultation.time}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <h3 className="text-lg font-semibold">Completed Consultations</h3>
              <div className="space-y-4">
                {consultations
                  .filter((c) => c.status === "Completed")
                  .map((consultation) => (
                    <Card key={consultation.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{consultation.consultantName}</h4>
                            <p className="text-muted-foreground">{consultation.subject}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-muted-foreground">
                                Completed on {new Date(consultation.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">4.8/5</span>
                          </div>
                        </div>
                        {consultation.outcomes && (
                          <div className="mt-3">
                            <h5 className="font-medium text-sm">Key Outcomes:</h5>
                            <ul className="text-sm text-muted-foreground mt-1">
                              {consultation.outcomes.slice(0, 2).map((outcome, index) => (
                                <li key={index} className="flex items-center gap-1">
                                  <Lightbulb className="h-3 w-3" />
                                  {outcome}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="follow-ups" className="space-y-4">
              <h3 className="text-lg font-semibold">Follow-up Required</h3>
              <div className="space-y-4">
                {consultations
                  .filter((c) => c.followUpRequired)
                  .map((consultation) => (
                    <Card key={consultation.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{consultation.consultantName}</h4>
                            <p className="text-muted-foreground">{consultation.subject}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <AlertCircle className="h-4 w-4 text-purple-600" />
                              <span className="text-sm text-muted-foreground">
                                Follow-up due: {consultation.followUpDate}
                              </span>
                            </div>
                          </div>
                          <Button size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Follow-up
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="parents" className="space-y-4">
              <h3 className="text-lg font-semibold">Parent Involvement Management</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mrs. Mary Kamau - Parent Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Communication Preference:</span>
                        <Badge variant="outline">Phone + Email</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Availability:</span>
                        <span className="text-sm">Weekdays after 4 PM, Weekends</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Involvement Level:</span>
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Meetings Attended:</span>
                        <span className="font-medium">2 of 3 scheduled</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="font-medium text-sm mb-2">Key Concerns & Interests:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• University costs and financial planning</li>
                        <li>• Career security and job prospects</li>
                        <li>• Academic support and tutoring needs</li>
                        <li>• Local vs. international university options</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Parent Preparation Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { title: "STEM Career Overview Guide", sent: true, read: true },
                        { title: "University Admission Requirements", sent: true, read: true },
                        { title: "Financial Planning Worksheet", sent: true, read: false },
                        { title: "Parent Questions Template", sent: false, read: false },
                      ].map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{material.title}</span>
                          <div className="flex items-center gap-2">
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
                      ))}
                    </div>

                    <Button className="w-full mt-4" variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Send All Pending Materials
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consultation-Specific Parent Involvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consultations.map((consultation) => (
                      <div key={consultation.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{consultation.consultantName}</h4>
                            <p className="text-sm text-muted-foreground">{consultation.subject}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                consultation.parentInvolved
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {consultation.parentInvolved ? "Parent Included" : "Student Only"}
                            </Badge>
                            {consultation.parentInvolved && (
                              <Badge
                                className={
                                  consultation.parentConfirmed
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {consultation.parentConfirmed ? "Confirmed" : "Pending"}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {consultation.parentInvolved && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Parent-Specific Objectives:</strong>
                              <ul className="mt-1 text-muted-foreground">
                                {consultation.parentSpecificObjectives?.map((obj, idx) => (
                                  <li key={idx}>• {obj}</li>
                                )) || <li>• Standard parent involvement</li>}
                              </ul>
                            </div>
                            <div>
                              <strong>Preparation Status:</strong>
                              <div className="mt-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  {consultation.parentPreparationSent ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 text-yellow-600" />
                                  )}
                                  <span className="text-xs">Materials Sent</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {consultation.parentFeedbackReceived ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 text-yellow-600" />
                                  )}
                                  <span className="text-xs">Feedback Received</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 mt-3">
                          {!consultation.parentInvolved && (
                            <Button size="sm" variant="outline">
                              <Plus className="h-3 w-3 mr-1" />
                              Include Parent
                            </Button>
                          )}
                          {consultation.parentInvolved && !consultation.parentPreparationSent && (
                            <Button size="sm" variant="outline">
                              <Send className="h-3 w-3 mr-1" />
                              Send Prep Materials
                            </Button>
                          )}
                          {consultation.parentInvolved && consultation.parentConfirmed && (
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Send Reminder
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
