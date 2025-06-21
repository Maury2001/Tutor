"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  BookOpen,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import {
  CBC_LEARNING_AREAS_2024,
  REMOVED_LEARNING_AREAS_2019,
  CURRICULUM_CHANGES_SUMMARY_2024,
  getLearningAreaChanges,
} from "@/lib/cbc-curriculum-2024"

export function CurriculumChanges2024() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const learningAreas = CBC_LEARNING_AREAS_2024.upperPrimary

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case "increased":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "decreased":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "renamed":
        return <ArrowRight className="h-4 w-4 text-blue-600" />
      case "merged":
        return <Users className="h-4 w-4 text-purple-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getChangeBadgeColor = (changeType: string) => {
    switch (changeType) {
      case "increased":
        return "bg-green-100 text-green-800 border-green-200"
      case "decreased":
        return "bg-red-100 text-red-800 border-red-200"
      case "renamed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "merged":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with curriculum image */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl">CBC Upper Primary Curriculum Changes 2024</CardTitle>
              <p className="text-muted-foreground">Updated learning areas and lesson allocations for Grades 4-6</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src="/images/2024-CBC-Upper-Primary-changes.png"
                alt="CBC Upper Primary Curriculum Changes 2019 vs 2024"
                className="w-full rounded-lg border shadow-sm"
              />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">40</div>
                    <div className="text-sm text-muted-foreground">2019 Lessons</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">35</div>
                    <div className="text-sm text-muted-foreground">2024 Lessons</div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Lesson Reduction</span>
                  <span className="font-medium">-5 lessons per week</span>
                </div>
                <Progress value={87.5} className="h-2" />
                <p className="text-xs text-muted-foreground">87.5% of original lesson allocation maintained</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="changes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="changes">Key Changes</TabsTrigger>
          <TabsTrigger value="current">2024 Curriculum</TabsTrigger>
          <TabsTrigger value="removed">Removed Areas</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="changes" className="space-y-4">
          <div className="grid gap-4">
            {CURRICULUM_CHANGES_SUMMARY_2024.majorChanges.map((change, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <p className="text-sm">{change}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-4">
            {learningAreas.map((area) => (
              <Card key={area.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{area.name}</h3>
                        <p className="text-sm text-muted-foreground">{area.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-lg">{area.weeklyLessons}</div>
                        <div className="text-xs text-muted-foreground">lessons/week</div>
                      </div>
                      {area.changes && (
                        <div className="flex items-center gap-2">
                          {getChangeIcon(area.changes.changeType)}
                          <Badge className={getChangeBadgeColor(area.changes.changeType)}>
                            {area.changes.changeType}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  {area.changes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">
                        <strong>Change:</strong> {getLearningAreaChanges(area.id)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="removed" className="space-y-4">
          <div className="grid gap-4">
            {REMOVED_LEARNING_AREAS_2019.map((area) => (
              <Card key={area.id} className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <h3 className="font-medium text-red-900">{area.name}</h3>
                        <p className="text-sm text-red-700">{area.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-red-600">{area.weeklyLessons}</div>
                      <div className="text-xs text-red-600">lessons/week</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Implementation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Implementation Year</span>
                  <span className="font-medium">2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Affected Grades</span>
                  <span className="font-medium">4, 5, 6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Learning Areas</span>
                  <span className="font-medium">{learningAreas.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Weekly Lessons</span>
                  <span className="font-medium">35</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Change Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Lesson Increases</span>
                  <span className="font-medium text-green-600">3 areas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Renamed Areas</span>
                  <span className="font-medium text-blue-600">1 area</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Merged Areas</span>
                  <span className="font-medium text-purple-600">1 area</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Removed Areas</span>
                  <span className="font-medium text-red-600">3 areas</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
