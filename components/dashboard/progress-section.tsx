import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const SUBJECTS = [
  { name: "Mathematics", progress: 85 },
  { name: "Science", progress: 72 },
  { name: "English", progress: 91 },
  { name: "Social Studies", progress: 78 },
]

export default function ProgressSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>Your current progress across all subjects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {SUBJECTS.map((subject) => (
            <div key={subject.name}>
              <div className="flex justify-between text-sm mb-2">
                <span>{subject.name}</span>
                <span>{subject.progress}%</span>
              </div>
              <Progress value={subject.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
