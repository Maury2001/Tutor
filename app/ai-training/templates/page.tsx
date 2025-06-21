"use client"

import { useState } from "react"
import { TemplateSelector } from "@/components/ai-training/template-selector"
import { TrainingParameterEditor } from "@/components/ai-training/training-parameter-editor"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Rocket } from "lucide-react"
import type { EducationalTemplate } from "@/lib/ai/model-training/educational-templates"

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EducationalTemplate | null>(null)
  const [showParameterEditor, setShowParameterEditor] = useState(false)

  const handleTemplateSelect = (template: EducationalTemplate) => {
    setSelectedTemplate(template)
  }

  const startTrainingWithTemplate = () => {
    if (selectedTemplate) {
      setShowParameterEditor(true)
    }
  }

  if (showParameterEditor && selectedTemplate) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setShowParameterEditor(false)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          <h1 className="text-3xl font-bold">Configure Training: {selectedTemplate.name}</h1>
          <p className="text-muted-foreground">Fine-tune parameters for your specific needs</p>
        </div>
        <TrainingParameterEditor initialTemplate={selectedTemplate} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Educational Training Templates</h1>
        <p className="text-muted-foreground">
          Choose from pre-configured templates designed for specific educational tasks
        </p>
      </div>

      <TemplateSelector onTemplateSelect={handleTemplateSelect} selectedTemplate={selectedTemplate} />

      {selectedTemplate && (
        <div className="mt-6 flex justify-center">
          <Button size="lg" onClick={startTrainingWithTemplate} className="bg-blue-600 hover:bg-blue-700">
            <Rocket className="h-5 w-5 mr-2" />
            Start Training with {selectedTemplate.name}
          </Button>
        </div>
      )}
    </div>
  )
}
