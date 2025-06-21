import { Card, CardContent } from "@/components/ui/card"
import { Brain, Clock, MessageSquare, Users } from "lucide-react"

interface AIUsageOverviewProps {
  data: {
    total_interactions: number
    total_students: number
    avg_interactions_per_student: number
    avg_tokens_per_interaction: number
    total_time_minutes: number
  }
}

export function AIUsageOverview({ data }: AIUsageOverviewProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Interactions</p>
              <p className="text-2xl font-bold">{data?.total_interactions?.toLocaleString() || 0}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Students Using AI</p>
              <p className="text-2xl font-bold">{data?.total_students?.toLocaleString() || 0}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Interactions/Student</p>
              <p className="text-2xl font-bold">{data?.avg_interactions_per_student?.toFixed(1) || 0}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total AI Learning Time</p>
              <p className="text-2xl font-bold">{formatTime(data?.total_time_minutes || 0)}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
