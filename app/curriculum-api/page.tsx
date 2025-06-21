import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CurriculumApiTester from "@/components/curriculum/api-tester"

export default function CurriculumApiPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">CBC Curriculum API</h1>

      <Card>
        <CardHeader>
          <CardTitle>API Overview</CardTitle>
          <CardDescription>
            The CBC Curriculum API provides programmatic access to the Competency-Based Curriculum data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>This API allows you to access curriculum data at various levels of the hierarchy:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Grade levels (Playgroup, PP1, PP2, Grade 1-9)</li>
              <li>Learning areas (subjects)</li>
              <li>Strands (major topics within subjects)</li>
              <li>Sub-strands (specific topics)</li>
              <li>Learning outcomes (what students should achieve)</li>
              <li>Learning objectives (specific skills to develop)</li>
            </ul>

            <p>You can also search across the curriculum and generate learning paths.</p>
          </div>
        </CardContent>
      </Card>

      <CurriculumApiTester />

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Complete documentation for all available endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            For full API documentation, visit the{" "}
            <a href="/api/curriculum/docs" className="text-blue-600 hover:underline">
              API docs endpoint
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
