"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  Clock,
  User,
  Users,
  CheckCircle,
  AlertCircle,
  Target,
  MessageSquare,
  FileText,
  GraduationCap,
  Save,
  Send,
  Plus,
  Edit,
} from "lucide-react"

interface CounselingSession {
  id: string
  studentId: string
  studentName: string
  counselorId: string
  counselorName: string
  sessionDate: string
  sessionTime: string
  sessionType: "Initial" | "Follow-up" | "Parent Conference" | "Final Review"
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"
  duration: number
  attendees: Array<{
    name: string
    role: "Student" | "Parent" | "Guardian" | "Teacher" | "Counselor"
    present: boolean
  }>
  pathwayRecommendations: Array<{
    pathway: string
    matchScore: number
    discussed: boolean
    studentInterest: "High" | "Medium" | "Low"
    parentSupport: "High" | "Medium" | "Low"
  }>
  sessionNotes: string
  actionItems: Array<{
    id: string
    task: string
    assignedTo: string
    dueDate: string
    status: "Pending" | "In Progress" | "Completed"
    priority: "High" | "Medium" | "Low"
  }>
  nextSteps: string[]
  followUpDate?: string
}

interface SessionAgenda {
  items: Array<{
    id: string
    title: string
    duration: number
    description: string
    completed: boolean
  }>
  totalDuration: number
}

export function CareerCounselingSession({ sessionId }: { sessionId?: string }) {
  const [session, setSession] = useState<CounselingSession | null>(null)
  const [agenda, setAgenda] = useState<SessionAgenda | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [newActionItem, setNewActionItem] = useState("")
  const [newNextStep, setNewNextStep] = useState("")

  useEffect(() => {
    // Simulate fetching session data
    const fetchSessionData = async () => {
      setIsLoading(true)

      // Mock session data
      const mockSession: CounselingSession = {
        id: sessionId || "session-001",
        studentId: "student-001",
        studentName: "John Kamau",
        counselorId: "counselor-001",
        counselorName: "Ms. Sarah Wanjiku",
        sessionDate: "2024-01-15",
        sessionTime: "14:00",
        sessionType: "Initial",
        status: "In Progress",
        duration: 60,
        attendees: [
          { name: "John Kamau", role: "Student", present: true },
          { name: "Mary Kamau", role: "Parent", present: true },
          { name: "Ms. Sarah Wanjiku", role: "Counselor", present: true },
          { name: "Mr. Peter Mwangi", role: "Teacher", present: false },
        ],
        pathwayRecommendations: [
          {
            pathway: "STEM Pathway",
            matchScore: 92,
            discussed: true,
            studentInterest: "High",
            parentSupport: "High",
          },
          {
            pathway: "Social Sciences",
            matchScore: 78,
            discussed: true,
            studentInterest: "Medium",
            parentSupport: "Medium",
          },
          {
            pathway: "Technical & Vocational",
            matchScore: 65,
            discussed: false,
            studentInterest: "Low",
            parentSupport: "Low",
          },
        ],
        sessionNotes: `Initial career counseling session with John Kamau and his mother Mary Kamau.

Key Discussion Points:
- Reviewed John's academic performance across all subjects
- Discussed his strong performance in Mathematics (92%) and Physics (88%)
- Explored his interest in technology and problem-solving
- Parent expressed support for STEM pathway but concerns about career prospects

Student Feedback:
- Very interested in software development and engineering
- Enjoys hands-on problem solving and logical thinking
- Concerned about the difficulty of STEM subjects in senior secondary
- Wants to understand more about career opportunities

Parent Feedback:
- Supportive of John's interests but wants assurance about job security
- Interested in understanding university requirements and costs
- Prefers local universities for financial reasons
- Wants regular progress updates`,
        actionItems: [
          {
            id: "action-001",
            task: "Research STEM career opportunities and salary ranges",
            assignedTo: "John Kamau",
            dueDate: "2024-01-22",
            status: "Pending",
            priority: "High",
          },
          {
            id: "action-002",
            task: "Schedule university visit to JKUAT Engineering Department",
            assignedTo: "Ms. Sarah Wanjiku",
            dueDate: "2024-01-25",
            status: "In Progress",
            priority: "Medium",
          },
          {
            id: "action-003",
            task: "Prepare subject combination options for Grade 10",
            assignedTo: "Ms. Sarah Wanjiku",
            dueDate: "2024-01-20",
            status: "Completed",
            priority: "High",
          },
        ],
        nextSteps: [
          "Schedule follow-up session in 2 weeks",
          "Arrange meeting with STEM teachers",
          "Provide university admission requirements document",
          "Connect with STEM career professionals for mentorship",
        ],
        followUpDate: "2024-01-29",
      }

      // Mock agenda data
      const mockAgenda: SessionAgenda = {
        items: [
          {
            id: "agenda-001",
            title: "Welcome & Introductions",
            duration: 5,
            description: "Welcome attendees and review session objectives",
            completed: true,
          },
          {
            id: "agenda-002",
            title: "Academic Performance Review",
            duration: 15,
            description: "Review student's academic strengths and areas for improvement",
            completed: true,
          },
          {
            id: "agenda-003",
            title: "Pathway Recommendations Discussion",
            duration: 20,
            description: "Present and discuss CBC pathway recommendations",
            completed: true,
          },
          {
            id: "agenda-004",
            title: "Student & Parent Feedback",
            duration: 10,
            description: "Gather feedback on pathway preferences and concerns",
            completed: false,
          },
          {
            id: "agenda-005",
            title: "Action Planning",
            duration: 8,
            description: "Define specific action items and next steps",
            completed: false,
          },
          {
            id: "agenda-006",
            title: "Follow-up Scheduling",
            duration: 2,
            description: "Schedule next counseling session",
            completed: false,
          },
        ],
        totalDuration: 60,
      }

      setSession(mockSession)
      setAgenda(mockAgenda)
      setIsLoading(false)
    }

    fetchSessionData()
  }, [sessionId])

  const handleAddActionItem = () => {
    if (!newActionItem.trim() || !session) return

    const newItem = {
      id: `action-${Date.now()}`,
      task: newActionItem,
      assignedTo: session.studentName,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Pending" as const,
      priority: "Medium" as const,
    }

    setSession({
      ...session,
      actionItems: [...session.actionItems, newItem],
    })
    setNewActionItem("")
  }

  const handleAddNextStep = () => {
    if (!newNextStep.trim() || !session) return

    setSession({
      ...session,
      nextSteps: [...session.nextSteps, newNextStep],
    })
    setNewNextStep("")
  }

  const handleCompleteAgendaItem = (itemId: string) => {
    if (!agenda) return

    setAgenda({
      ...agenda,
      items: agenda.items.map((item) => (item.id === itemId ? { ...item, completed: true } : item)),
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      Scheduled: "bg-blue-100 text-blue-800",
      "In Progress": "bg-yellow-100 text-yellow-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || colors.Scheduled
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    }
    return colors[priority as keyof typeof colors] || colors.Medium
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || !agenda) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Session Not Found</h3>
          <p className="text-muted-foreground">Unable to load counseling session data</p>
        </CardContent>
      </Card>
    )
  }

  const completedAgendaItems = agenda.items.filter((item) => item.completed).length
  const agendaProgress = (completedAgendaItems / agenda.items.length) * 100

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Career Counseling Session</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{session.studentName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(session.sessionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{session.sessionTime}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
              <Badge variant="outline">{session.sessionType}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Session Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Session Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Agenda Completion</span>
              <span className="text-sm text-muted-foreground">
                {completedAgendaItems} of {agenda.items.length} items
              </span>
            </div>
            <Progress value={agendaProgress} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{session.duration}</div>
                <div className="text-sm text-muted-foreground">Minutes Allocated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {session.attendees.filter((a) => a.present).length}
                </div>
                <div className="text-sm text-muted-foreground">Attendees Present</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{session.pathwayRecommendations.length}</div>
                <div className="text-sm text-muted-foreground">Pathways Discussed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{session.actionItems.length}</div>
                <div className="text-sm text-muted-foreground">Action Items</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Session Content */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="pathways">Pathways</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Session Attendees
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {session.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${attendee.present ? "bg-green-500" : "bg-red-500"}`}
                            />
                            <span className="font-medium">{attendee.name}</span>
                          </div>
                          <Badge variant="outline">{attendee.role}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      Student Profile Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Student:</span>
                        <span className="font-medium">{session.studentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Grade:</span>
                        <span className="font-medium">Grade 9</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Top Pathway:</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          STEM ({session.pathwayRecommendations[0]?.matchScore}%)
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Session Type:</span>
                        <span className="font-medium">{session.sessionType}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="agenda" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Session Agenda</h3>
                <Badge variant="outline">
                  {completedAgendaItems}/{agenda.items.length} Completed
                </Badge>
              </div>

              <div className="space-y-3">
                {agenda.items.map((item) => (
                  <Card key={item.id} className={item.completed ? "bg-green-50 border-green-200" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => handleCompleteAgendaItem(item.id)}
                          />
                          <div>
                            <h4 className={`font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                              {item.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.duration} min</Badge>
                          {item.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pathways" className="space-y-4">
              <h3 className="text-lg font-semibold">Pathway Recommendations Discussion</h3>

              <div className="space-y-4">
                {session.pathwayRecommendations.map((pathway, index) => (
                  <Card key={index} className={pathway.discussed ? "border-green-200" : "border-gray-200"}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-lg">{pathway.pathway}</h4>
                          <Badge className="bg-blue-100 text-blue-800">{pathway.matchScore}% Match</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {pathway.discussed && <CheckCircle className="h-4 w-4 text-green-600" />}
                          <Badge variant={pathway.discussed ? "default" : "outline"}>
                            {pathway.discussed ? "Discussed" : "Pending"}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Student Interest</Label>
                          <div className="mt-1">
                            <Badge
                              className={
                                pathway.studentInterest === "High"
                                  ? "bg-green-100 text-green-800"
                                  : pathway.studentInterest === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {pathway.studentInterest}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Parent Support</Label>
                          <div className="mt-1">
                            <Badge
                              className={
                                pathway.parentSupport === "High"
                                  ? "bg-green-100 text-green-800"
                                  : pathway.parentSupport === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {pathway.parentSupport}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Session Notes</h3>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  {isEditing ? (
                    <Textarea
                      value={session.sessionNotes}
                      onChange={(e) => setSession({ ...session, sessionNotes: e.target.value })}
                      className="min-h-[300px]"
                      placeholder="Enter detailed session notes..."
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-sm">{session.sessionNotes}</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Action Items</h3>
                <Badge variant="outline">
                  {session.actionItems.filter((item) => item.status === "Completed").length}/
                  {session.actionItems.length} Completed
                </Badge>
              </div>

              <div className="space-y-3">
                {session.actionItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.task}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Assigned to: {item.assignedTo}</span>
                            <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                          <Badge
                            className={
                              item.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : item.status === "In Progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Action Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter new action item..."
                      value={newActionItem}
                      onChange={(e) => setNewActionItem(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddActionItem()}
                    />
                    <Button onClick={handleAddActionItem}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="follow-up" className="space-y-4">
              <h3 className="text-lg font-semibold">Next Steps & Follow-up</h3>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Follow-up Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Scheduled Date</Label>
                      <Input type="date" value={session.followUpDate} className="mt-1" />
                    </div>
                    <div>
                      <Label>Session Type</Label>
                      <select className="w-full mt-1 p-2 border rounded">
                        <option>Follow-up</option>
                        <option>Parent Conference</option>
                        <option>Final Review</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {session.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Add next step..."
                      value={newNextStep}
                      onChange={(e) => setNewNextStep(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddNextStep()}
                    />
                    <Button onClick={handleAddNextStep}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          Save Session
        </Button>
        <Button variant="outline" className="flex-1">
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
        <Button variant="outline" className="flex-1">
          <Send className="mr-2 h-4 w-4" />
          Send Summary
        </Button>
      </div>
    </div>
  )
}
