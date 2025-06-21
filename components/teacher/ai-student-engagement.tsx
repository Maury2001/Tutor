import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Clock, Eye } from "lucide-react"
import { safeDateFormat } from "@/utils/date-helpers"

interface AIStudentEngagementProps {
  students: Array<{
    student_id: string
    student_name: string
    grade_level: string
    avatar_url: string
    total_interactions: number
    total_time_minutes: number
    last_interaction: string
    favorite_learning_area: string
    average_session_minutes: number
  }>
}

export function AIStudentEngagement({ students = [] }: AIStudentEngagementProps) {
  // Find the maximum interactions to normalize the progress bars
  const maxInteractions = Math.max(...students.map((s) => s.total_interactions), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student AI Engagement</CardTitle>
        <CardDescription>How individual students are using the AI tutor</CardDescription>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-muted-foreground">No student engagement data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.student_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={student.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      {student.student_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{student.student_name}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{student.grade_level}</span>
                      {student.favorite_learning_area && (
                        <>
                          <span className="mx-1">•</span>
                          <Badge variant="outline">{student.favorite_learning_area}</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{student.total_time_minutes} min</span>
                  </div>
                  <div className="text-sm">
                    {student.last_interaction ? (
                      <span>Last: {safeDateFormat(new Date(student.last_interaction))}</span>
                    ) : (
                      <span>No interactions</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{student.total_interactions} interactions</p>
                    <p className="text-xs text-muted-foreground">
                      ~{student.average_session_minutes.toFixed(1)} min/session
                    </p>
                  </div>
                  <div className="w-24 hidden md:block">
                    <Progress value={(student.total_interactions / maxInteractions) * 100} />
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
