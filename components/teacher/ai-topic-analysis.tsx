import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"

interface AITopicAnalysisProps {
  topics: Array<{
    topic: string
    count: number
    learning_area_id: string
    learning_area_name: string
  }>
}

export function AITopicAnalysis({ topics = [] }: AITopicAnalysisProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Popular Topics & Questions</CardTitle>
        <CardDescription>Most frequent topics students are asking the AI tutor</CardDescription>
      </CardHeader>
      <CardContent>
        {topics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No topic data available yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic, index) => (
              <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{topic.topic}</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="mr-2">
                      {topic.learning_area_name || "General"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{topic.count} interactions</span>
                  </div>
                </div>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-xs font-medium">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
