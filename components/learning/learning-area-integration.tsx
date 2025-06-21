"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Target, MessageCircle } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { CBC_CURRICULUM } from "@/lib/cbc-curriculum"

interface LearningAreaIntegrationProps {
  onStartTutoring: (context: any) => void
}

export function LearningAreaIntegration({ onStartTutoring }: LearningAreaIntegrationProps) {
  const { user } = useAuth()
  const [learningAreas, setLearningAreas] = useState<any[]>([])
  const [selectedArea, setSelectedArea] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadLearningAreas = async () => {
      if (user?.gradeLevel) {
        setIsLoading(true)
        try {
          const areas = CBC_CURRICULUM[user.gradeLevel as any] || []
          setLearningAreas(areas)
        } catch (error) {
          console.error("Error loading learning areas:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadLearningAreas()
  }, [user?.gradeLevel])

  const handleStartTutoring = (area: any, strand?: any) => {
    const context = {
      grade: user?.gradeLevel,
      learningArea: area.id,
      learningAreaName: area.name,
      strand: strand?.id,
      strandName: strand?.name,
    }
    onStartTutoring(context)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading learning areas...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learning Areas for {user?.gradeLevel?.toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningAreas.map((area) => (
              <Card key={area.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{area.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{area.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline">{area.weekly_lessons} lessons/week</Badge>
                  </div>
                  <div className="space-y-2">
                    <Button onClick={() => handleStartTutoring(area)} className="w-full" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start AI Tutoring
                    </Button>
                    <Button
                      onClick={() => setSelectedArea(selectedArea?.id === area.id ? null : area)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      View Strands
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedArea && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Strands in {selectedArea.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedArea.strands?.map((strand: any) => (
                <Card key={strand.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{strand.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{strand.description}</p>
                    <Button onClick={() => handleStartTutoring(selectedArea, strand)} size="sm" className="w-full">
                      <Brain className="h-4 w-4 mr-2" />
                      Get AI Help with {strand.name}
                    </Button>
                  </CardContent>
                </Card>
              )) || <p className="text-gray-500 col-span-2">No strands available for this learning area.</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
