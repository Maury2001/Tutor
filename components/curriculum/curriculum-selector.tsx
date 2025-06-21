"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CurriculumSelectorProps {
  onSelectionChange?: (selection: any) => void
  showObjectives?: boolean
}

export function CurriculumSelector({ onSelectionChange, showObjectives = false }: CurriculumSelectorProps) {
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedLearningArea, setSelectedLearningArea] = useState("")
  const [selectedStrand, setSelectedStrand] = useState("")
  const [selectedSubStrand, setSelectedSubStrand] = useState("")

  const handleSelectionChange = useCallback(
    (field: string, value: string) => {
      const updates: any = { [field]: value }

      // Reset dependent fields when parent changes
      if (field === "grade") {
        updates.learningArea = ""
        updates.strand = ""
        updates.subStrand = ""
        setSelectedGrade(value)
        setSelectedLearningArea("")
        setSelectedStrand("")
        setSelectedSubStrand("")
      } else if (field === "learningArea") {
        updates.strand = ""
        updates.subStrand = ""
        setSelectedLearningArea(value)
        setSelectedStrand("")
        setSelectedSubStrand("")
      } else if (field === "strand") {
        updates.subStrand = ""
        setSelectedStrand(value)
        setSelectedSubStrand("")
      } else if (field === "subStrand") {
        setSelectedSubStrand(value)
      }

      // Call parent callback with current state
      if (onSelectionChange) {
        onSelectionChange({
          grade: field === "grade" ? value : selectedGrade,
          learningArea: field === "learningArea" ? value : selectedLearningArea,
          strand: field === "strand" ? value : selectedStrand,
          subStrand: field === "subStrand" ? value : selectedSubStrand,
        })
      }
    },
    [selectedGrade, selectedLearningArea, selectedStrand, selectedSubStrand, onSelectionChange],
  )

  const grades = [
    { value: "grade1", label: "Grade 1" },
    { value: "grade2", label: "Grade 2" },
    { value: "grade3", label: "Grade 3" },
    { value: "grade4", label: "Grade 4" },
    { value: "grade5", label: "Grade 5" },
  ]

  const learningAreas = [
    { value: "mathematics", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "science", label: "Science" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Curriculum Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Grade Level</label>
            <Select value={selectedGrade} onValueChange={(value) => handleSelectionChange("grade", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade.value} value={grade.value}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Learning Area</label>
            <Select
              value={selectedLearningArea}
              onValueChange={(value) => handleSelectionChange("learningArea", value)}
              disabled={!selectedGrade}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select learning area" />
              </SelectTrigger>
              <SelectContent>
                {learningAreas.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
