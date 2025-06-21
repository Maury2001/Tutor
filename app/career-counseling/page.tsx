"use client"

import { useState } from "react"
import { CareerCounselingSession } from "@/components/counseling/career-counseling-session"
import { SessionScheduler } from "@/components/counseling/session-scheduler"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Calendar, Users, TrendingUp, Target, CheckCircle, Clock, Award, BookOpen } from "lucide-react"

export default function CareerCounselingPage() {
  const [activeSession, setActiveSession] = useState<string | null>(null)

  const counselingStats = {
    totalSessions: 24,
    completedSessions: 18,
    scheduledSessions: 6,
    studentsServed: 15,
    pathwaysRecommended: {
      STEM: 8,
      "Arts & Sports": 3,
      "Social Sciences": 3,
      "Technical & Vocational": 1,
    },
    averageSessionDuration: 52,
    parentParticipation: 85,
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Career Counseling Center</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Structured career counseling sessions using CBC pathway guidance to help students make informed decisions
          about their academic and career futures.
        </p>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{counselingStats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{counselingStats.studentsServed}</div>
            <div className="text-sm text-muted-foreground">Students Served</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{counselingStats.averageSessionDuration}</div>
            <div className="text-sm text-muted-foreground">Avg Duration (min)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{counselingStats.parentParticipation}%</div>
            <div className="text-sm text-muted-foreground">Parent Participation</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="scheduler">Schedule Sessions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          {activeSession ? (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setActiveSession(null)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to Sessions
                </button>
                <h2 className="text-2xl font-semibold">Session Details</h2>
              </div>
              <CareerCounselingSession sessionId={activeSession} />
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Active Counseling Sessions</h2>

              <div className="grid gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4" onClick={() => setActiveSession("session-001")}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">John Kamau - Initial Counseling</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Jan 15, 2024</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>2:00 PM</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>3 attendees</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                        <Badge variant="outline">STEM Focus</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4" onClick={() => setActiveSession("session-002")}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">Mary Wanjiku - Follow-up Session</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Jan 16, 2024</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>10:00 AM</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>2 attendees</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                        <Badge variant="outline">Arts Focus</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="scheduler">
          <SessionScheduler />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-semibold">Counseling Analytics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Pathway Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(counselingStats.pathwaysRecommended).map(([pathway, count]) => (
                    <div key={pathway} className="flex items-center justify-between">
                      <span className="font-medium">{pathway}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / counselingStats.studentsServed) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Session Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {Math.round((counselingStats.completedSessions / counselingStats.totalSessions) * 100)}%
                  </div>
                  <p className="text-muted-foreground">
                    {counselingStats.completedSessions} of {counselingStats.totalSessions} sessions completed
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{
                        width: `${(counselingStats.completedSessions / counselingStats.totalSessions) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <h2 className="text-2xl font-semibold">Counseling Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Session Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Initial Counseling Session Agenda</li>
                  <li>• Follow-up Session Template</li>
                  <li>• Parent Conference Guide</li>
                  <li>• Final Review Checklist</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Assessment Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Interest Inventory Questionnaire</li>
                  <li>• Skills Assessment Rubric</li>
                  <li>• Learning Style Evaluation</li>
                  <li>• Career Readiness Checklist</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Reference Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• CBC Pathway Requirements</li>
                  <li>• University Admission Criteria</li>
                  <li>• Career Outlook Reports</li>
                  <li>• Industry Salary Surveys</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
