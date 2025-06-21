import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, TrendingUp, AlertTriangle, BookOpen } from "lucide-react"

interface AIInsightsPanelProps {
  data: any
  filters: {
    className: string
    learningArea: string
    studentName: string
    days: number
  }
}

export function AIInsightsPanel({ data, filters }: AIInsightsPanelProps) {
  // Generate insights based on the data
  const generateInsights = () => {
    const insights = []
    const summary = data?.summary || {}
    const topics = data?.popularTopics || []
    const students = data?.studentEngagement || []

    // Check if we have enough data for meaningful insights
    if (summary.total_interactions < 10) {
      insights.push({
        type: "info",
        title: "Not Enough Data",
        description: "Encourage more AI tutor usage to generate meaningful insights.",
        icon: <AlertTriangle className="h-5 w-5" />,
      })
      return insights
    }

    // Popular topics insight
    if (topics.length > 0) {
      const topTopic = topics[0]
      insights.push({
        type: "trend",
        title: "Popular Topic Identified",
        description: `"${topTopic.topic}" is the most common topic students are asking about (${topTopic.count} times).`,
        icon: <TrendingUp className="h-5 w-5" />,
      })
    }

    // Student engagement insights
    if (students.length > 0) {
      // Find students with very high or low engagement
      const highEngagementStudents = students.filter((s) => s.total_interactions > 20)
      const lowEngagementStudents = students.filter((s) => s.total_interactions < 3 && s.total_interactions > 0)
      const noEngagementStudents = students.filter((s) => s.total_interactions === 0)

      if (highEngagementStudents.length > 0) {
        insights.push({
          type: "positive",
          title: "High Engagement Students",
          description: `${highEngagementStudents.length} students are highly engaged with the AI tutor.`,
          icon: <Lightbulb className="h-5 w-5" />,
        })
      }

      if (lowEngagementStudents.length > students.length * 0.3) {
        insights.push({
          type: "warning",
          title: "Low Engagement Alert",
          description: `${lowEngagementStudents.length} students have minimal AI tutor interaction.`,
          icon: <AlertTriangle className="h-5 w-5" />,
        })
      }

      if (noEngagementStudents.length > 0) {
        insights.push({
          type: "warning",
          title: "No Engagement Alert",
          description: `${noEngagementStudents.length} students haven't used the AI tutor at all.`,
          icon: <AlertTriangle className="h-5 w-5" />,
        })
      }
    }

    // Learning area distribution insights
    const distribution = summary.learning_area_distribution || {}
    const areas = Object.keys(distribution)

    if (areas.length > 0) {
      // Find most and least used learning areas
      const sortedAreas = areas.sort((a, b) => distribution[b] - distribution[a])
      const mostUsed = sortedAreas[0]
      const leastUsed = sortedAreas[sortedAreas.length - 1]

      insights.push({
        type: "insight",
        title: "Learning Area Focus",
        description: `Students are most frequently using the AI tutor for ${mostUsed} (${distribution[mostUsed]} interactions).`,
        icon: <BookOpen className="h-5 w-5" />,
      })

      if (areas.length > 1 && distribution[mostUsed] > distribution[leastUsed] * 3) {
        insights.push({
          type: "suggestion",
          title: "Learning Area Imbalance",
          description: `Consider encouraging more AI tutor usage for ${leastUsed}, which has much lower engagement.`,
          icon: <Lightbulb className="h-5 w-5" />,
        })
      }
    }

    // Time-based insights
    if (summary.avg_interactions_per_student > 0) {
      const interactionsPerDay = summary.total_interactions / filters.days

      if (interactionsPerDay < 1) {
        insights.push({
          type: "suggestion",
          title: "Increase AI Tutor Usage",
          description: "Consider integrating AI tutor activities into regular classwork to increase usage.",
          icon: <Lightbulb className="h-5 w-5" />,
        })
      }
    }

    return insights
  }

  const insights = generateInsights()

  // Map insight types to alert variants
  const getAlertVariant = (type: string) => {
    switch (type) {
      case "positive":
        return "default"
      case "warning":
        return "warning"
      case "suggestion":
        return "default"
      case "trend":
        return "default"
      case "insight":
        return "default"
      default:
        return "default"
    }
  }

  // Map insight types to icon colors
  const getIconColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-green-500"
      case "warning":
        return "text-amber-500"
      case "suggestion":
        return "text-blue-500"
      case "trend":
        return "text-purple-500"
      case "insight":
        return "text-cyan-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Learning Insights</CardTitle>
        <CardDescription>
          Actionable insights based on how students are using the AI tutor
          {filters.className !== "All Classes" && ` in ${filters.className}`}
          {filters.learningArea !== "All Learning Areas" && ` for ${filters.learningArea}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Lightbulb className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No insights available yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Alert key={index} variant={getAlertVariant(insight.type)}>
                <div className={getIconColor(insight.type)}>{insight.icon}</div>
                <AlertTitle>{insight.title}</AlertTitle>
                <AlertDescription>{insight.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
