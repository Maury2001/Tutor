"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Plus, Edit } from "lucide-react"

interface SessionSchedule {
  id: string
  studentName: string
  sessionType: string
  date: string
  time: string
  duration: number
  attendees: string[]
  status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled"
  notes: string
}

export function SessionScheduler() {
  const [sessions, setSessions] = useState<SessionSchedule[]>([
    {
      id: "1",
      studentName: "John Kamau",
      sessionType: "Initial Counseling",
      date: "2024-01-15",
      time: "14:00",
      duration: 60,
      attendees: ["Student", "Parent", "Counselor"],
      status: "Scheduled",
      notes: "First career counseling session to discuss CBC pathway options",
    },
    {
      id: "2",
      studentName: "Mary Wanjiku",
      sessionType: "Follow-up",
      date: "2024-01-16",
      time: "10:00",
      duration: 45,
      attendees: ["Student", "Counselor"],
      status: "Confirmed",
      notes: "Review action items from previous session",
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newSession, setNewSession] = useState<Partial<SessionSchedule>>({
    studentName: "",
    sessionType: "Initial Counseling",
    date: "",
    time: "",
    duration: 60,
    attendees: ["Student", "Counselor"],
    notes: "",
  })

  const handleCreateSession = () => {
    if (!newSession.studentName || !newSession.date || !newSession.time) return

    const session: SessionSchedule = {
      id: Date.now().toString(),
      studentName: newSession.studentName!,
      sessionType: newSession.sessionType!,
      date: newSession.date!,
      time: newSession.time!,
      duration: newSession.duration!,
      attendees: newSession.attendees!,
      status: "Scheduled",
      notes: newSession.notes || "",
    }

    setSessions([...sessions, session])
    setNewSession({
      studentName: "",
      sessionType: "Initial Counseling",
      date: "",
      time: "",
      duration: 60,
      attendees: ["Student", "Counselor"],
      notes: "",
    })
    setIsCreating(false)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      Scheduled: "bg-blue-100 text-blue-800",
      Confirmed: "bg-green-100 text-green-800",
      Completed: "bg-gray-100 text-gray-800",
      Cancelled: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || colors.Scheduled
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Session Scheduler</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Session
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Counseling Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Student Name</Label>
                <Input
                  value={newSession.studentName}
                  onChange={(e) => setNewSession({ ...newSession, studentName: e.target.value })}
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <Label>Session Type</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newSession.sessionType}
                  onChange={(e) => setNewSession({ ...newSession, sessionType: e.target.value })}
                >
                  <option>Initial Counseling</option>
                  <option>Follow-up</option>
                  <option>Parent Conference</option>
                  <option>Final Review</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={newSession.time}
                  onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                />
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={newSession.duration}
                  onChange={(e) => setNewSession({ ...newSession, duration: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={newSession.notes}
                onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                placeholder="Session objectives and notes"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateSession}>Schedule Session</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{session.studentName}</h3>
                    <p className="text-muted-foreground">{session.sessionType}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{session.attendees.length} attendees</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {session.notes && <p className="mt-2 text-sm text-muted-foreground">{session.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
