"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedDigestiveAnimation } from "@/components/virtual-lab/enhanced-digestive-animation"
import { AIGuidancePanel } from "@/components/virtual-lab/ai-guidance-panel"
import { ArrowLeft, BookOpen, Microscope } from "lucide-react"

export default function DigestiveSystemDemo() {
  const [currentStage, setCurrentStage] = useState<any>(null)

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Virtual Lab
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Microscope className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Human Digestive System - Live Animation</h1>
            <p className="text-gray-600 text-lg">Watch food's incredible 6-8 hour journey through your body</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">Grade 9 CBC Biology</Badge>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">🎬 Animation Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Real-time food particle tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Organ-specific visual effects</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span>Variable speed control</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Interactive stage information</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <EnhancedDigestiveAnimation onStageChange={setCurrentStage} autoStart={false} />
        </div>

        {/* AI Guidance Panel */}
        <div className="lg:col-span-1">
          <AIGuidancePanel
            experimentType="Digestive System Animation"
            gradeLevel="Grade 9"
            currentStep={currentStage ? 1 : 0}
            studentProgress={{
              completedSteps: [],
              currentObservations: currentStage
                ? [
                    `Currently observing: ${currentStage.name}`,
                    `Active organ: ${currentStage.organ}`,
                    `Key processes: ${currentStage.processes.slice(0, 2).join(", ")}`,
                  ]
                : ["Ready to start digestive journey"],
              challenges: [],
            }}
          />
        </div>
      </div>

      {/* Educational Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">⏱️ Timeline Facts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              • <strong>Mouth:</strong> 30 seconds - 2 minutes
            </div>
            <div>
              • <strong>Esophagus:</strong> 4-8 seconds
            </div>
            <div>
              • <strong>Stomach:</strong> 2-4 hours
            </div>
            <div>
              • <strong>Small Intestine:</strong> 3-5 hours
            </div>
            <div>
              • <strong>Large Intestine:</strong> 12-48 hours
            </div>
            <div className="pt-2 font-semibold text-blue-600">Total Journey: 6-8 hours (to small intestine)</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">🔬 Amazing Facts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>• Your stomach acid is as strong as battery acid!</div>
            <div>• Small intestine is 6 meters long when stretched</div>
            <div>• You produce 1.5 liters of saliva daily</div>
            <div>• Stomach can hold up to 1.5 liters of food</div>
            <div>• Peristalsis works even in zero gravity!</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">🧪 Key Enzymes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              • <strong>Amylase:</strong> Breaks down starch
            </div>
            <div>
              • <strong>Pepsin:</strong> Digests proteins
            </div>
            <div>
              • <strong>Lipase:</strong> Breaks down fats
            </div>
            <div>
              • <strong>Trypsin:</strong> Protein digestion
            </div>
            <div>
              • <strong>Bile:</strong> Emulsifies fats
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4 justify-center">
        <Button
          onClick={() => (window.location.href = "/virtual-lab/animal-nutrition-digestion")}
          className="bg-green-600 hover:bg-green-700"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Full Nutrition Lab
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/virtual-lab")}>
          <Microscope className="h-4 w-4 mr-2" />
          More Virtual Labs
        </Button>
      </div>
    </div>
  )
}
