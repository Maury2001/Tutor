"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  CBC_CURRICULUM,
  type GradeLevel,
  type LearningArea,
  type Strand,
  type SubStrand,
  type CBCCurriculumSelector,
} from "@/lib/cbc-curriculum"
import { ChevronRight, BookOpen, Lightbulb, Target, Activity } from "lucide-react"

interface CurriculumSelectorProps {
  onSelectionChange?: (selection: CBCCurriculumSelector) => void
  defaultGrade?: GradeLevel
  defaultLearningArea?: string
  defaultStrand?: string
  defaultSubStrand?: string
}

export function EnhancedCurriculumSelector({
  onSelectionChange,
  defaultGrade = "grade1",
  defaultLearningArea,
  defaultStrand,
  defaultSubStrand,
}: CurriculumSelectorProps) {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(defaultGrade)
  const [selectedLearningArea, setSelectedLearningArea] = useState<string>(defaultLearningArea || "")
  const [selectedStrand, setSelectedStrand] = useState<string>(defaultStrand || "")
  const [selectedSubStrand, setSelectedSubStrand] = useState<string>(defaultSubStrand || "")
  const [currentLearningAreas, setCurrentLearningAreas] = useState<LearningArea[]>([])
  const [currentStrands, setCurrentStrands] = useState<Strand[]>([])
  const [currentSubStrands, setCurrentSubStrands] = useState<SubStrand[]>([])
  const [currentSubStrand, setCurrentSubStrand] = useState<SubStrand | null>(null)
  const [activeTab, setActiveTab] = useState<string>("overview")

  // Initialize with default values
  useEffect(() => {
    if (defaultGrade) {
      const learningAreas = CBC_CURRICULUM[defaultGrade]
      setCurrentLearningAreas(learningAreas)

      if (defaultLearningArea) {
        const learningArea = learningAreas.find((la) => la.id === defaultLearningArea)
        if (learningArea) {
          setCurrentStrands(learningArea.strands)

          if (defaultStrand) {
            const strand = learningArea.strands.find((s) => s.id === defaultStrand)
            if (strand) {
              setCurrentSubStrands(strand.subStrands)

              if (defaultSubStrand) {
                const subStrand = strand.subStrands.find((ss) => ss.id === defaultSubStrand)
                if (subStrand) {
                  setCurrentSubStrand(subStrand)
                }
              }
            }
          }
        }
      }
    }
  }, [defaultGrade, defaultLearningArea, defaultStrand, defaultSubStrand])

  // Update learning areas when grade changes
  useEffect(() => {
    const learningAreas = CBC_CURRICULUM[selectedGrade]
    setCurrentLearningAreas(learningAreas)

    // Reset selections when grade changes
    if (!defaultLearningArea || !learningAreas.some((la) => la.id === selectedLearningArea)) {
      setSelectedLearningArea("")
      setSelectedStrand("")
      setSelectedSubStrand("")
      setCurrentStrands([])
      setCurrentSubStrands([])
      setCurrentSubStrand(null)
    }
  }, [selectedGrade, defaultLearningArea, selectedLearningArea])

  // Update strands when learning area changes
  useEffect(() => {
    if (selectedLearningArea) {
      const learningArea = currentLearningAreas.find((la) => la.id === selectedLearningArea)
      if (learningArea) {
        setCurrentStrands(learningArea.strands)

        // Reset strand and substrand selections when learning area changes
        if (!defaultStrand || !learningArea.strands.some((s) => s.id === selectedStrand)) {
          setSelectedStrand("")
          setSelectedSubStrand("")
          setCurrentSubStrands([])
          setCurrentSubStrand(null)
        }
      }
    }
  }, [selectedLearningArea, currentLearningAreas, defaultStrand, selectedStrand])

  // Update substrands when strand changes
  useEffect(() => {
    if (selectedStrand) {
      const strand = currentStrands.find((s) => s.id === selectedStrand)
      if (strand) {
        setCurrentSubStrands(strand.subStrands)

        // Reset substrand selection when strand changes
        if (!defaultSubStrand || !strand.subStrands.some((ss) => ss.id === selectedSubStrand)) {
          setSelectedSubStrand("")
          setCurrentSubStrand(null)
        }
      }
    }
  }, [selectedStrand, currentStrands, defaultSubStrand, selectedSubStrand])

  // Update current substrand when substrand selection changes
  useEffect(() => {
    if (selectedSubStrand) {
      const subStrand = currentSubStrands.find((ss) => ss.id === selectedSubStrand)
      if (subStrand) {
        setCurrentSubStrand(subStrand)
      }
    } else {
      setCurrentSubStrand(null)
    }
  }, [selectedSubStrand, currentSubStrands])

  // Notify parent component when selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        grade: selectedGrade,
        learningArea: selectedLearningArea,
        strand: selectedStrand,
        subStrand: selectedSubStrand,
      })
    }
  }, [selectedGrade, selectedLearningArea, selectedStrand, selectedSubStrand, onSelectionChange])

  const gradeOptions = Object.keys(CBC_CURRICULUM).map((grade) => {
    const formattedGrade = grade.replace("grade", "Grade ").replace("pp", "PP ").replace("playgroup", "Play Group")
    return { value: grade as GradeLevel, label: formattedGrade }
  })

  const getGradeDisplayName = (grade: GradeLevel) => {
    return grade.replace("grade", "Grade ").replace("pp", "PP ").replace("playgroup", "Play Group")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Kenya CBC Curriculum Explorer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Grade Selection */}
            <div>
              <label className="text-sm font-medium mb-1 block">Grade Level</label>
              <Select value={selectedGrade} onValueChange={(value: GradeLevel) => setSelectedGrade(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Learning Area Selection */}
            <div>
              <label className="text-sm font-medium mb-1 block">Learning Area</label>
              <Select
                value={selectedLearningArea}
                onValueChange={setSelectedLearningArea}
                disabled={currentLearningAreas.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Learning Area" />
                </SelectTrigger>
                <SelectContent>
                  {currentLearningAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Strand Selection */}
            <div>
              <label className="text-sm font-medium mb-1 block">Strand</label>
              <Select value={selectedStrand} onValueChange={setSelectedStrand} disabled={currentStrands.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Strand" />
                </SelectTrigger>
                <SelectContent>
                  {currentStrands.map((strand) => (
                    <SelectItem key={strand.id} value={strand.id}>
                      {strand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub-Strand Selection */}
            <div>
              <label className="text-sm font-medium mb-1 block">Sub-Strand</label>
              <Select
                value={selectedSubStrand}
                onValueChange={setSelectedSubStrand}
                disabled={currentSubStrands.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sub-Strand" />
                </SelectTrigger>
                <SelectContent>
                  {currentSubStrands.map((subStrand) => (
                    <SelectItem key={subStrand.id} value={subStrand.id}>
                      {subStrand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Current Selection Path */}
          {(selectedLearningArea || selectedStrand || selectedSubStrand) && (
            <div className="flex items-center text-sm text-muted-foreground overflow-x-auto py-2">
              <span className="font-medium">{getGradeDisplayName(selectedGrade)}</span>
              {selectedLearningArea && (
                <>
                  <ChevronRight className="h-4 w-4 mx-1" />
                  <span>{currentLearningAreas.find((la) => la.id === selectedLearningArea)?.name}</span>
                </>
              )}
              {selectedStrand && (
                <>
                  <ChevronRight className="h-4 w-4 mx-1" />
                  <span>{currentStrands.find((s) => s.id === selectedStrand)?.name}</span>
                </>
              )}
              {selectedSubStrand && (
                <>
                  <ChevronRight className="h-4 w-4 mx-1" />
                  <span>{currentSubStrands.find((ss) => ss.id === selectedSubStrand)?.name}</span>
                </>
              )}
            </div>
          )}

          {/* Content Display */}
          {currentSubStrand ? (
            <div className="mt-4 border rounded-lg">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b px-4">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-muted">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="outcomes" className="data-[state=active]:bg-muted">
                      Learning Outcomes
                    </TabsTrigger>
                    <TabsTrigger value="activities" className="data-[state=active]:bg-muted">
                      Activities
                    </TabsTrigger>
                    {currentSubStrand.practicalProjects && currentSubStrand.practicalProjects.length > 0 && (
                      <TabsTrigger value="projects" className="data-[state=active]:bg-muted">
                        Practical Projects
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>

                <TabsContent value="overview" className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{currentSubStrand.name}</h3>
                  <p className="text-muted-foreground mb-4">{currentSubStrand.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          Learning Outcomes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {currentSubStrand.outcomes.map((outcome) => (
                            <li key={outcome.id}>{outcome.description}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center">
                          <Activity className="h-4 w-4 mr-2" />
                          Key Activities
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {currentSubStrand.outcomes
                            .flatMap((outcome) =>
                              outcome.objectives.flatMap((objective) => objective.activities.slice(0, 2)),
                            )
                            .slice(0, 5)
                            .map((activity, index) => (
                              <li key={index}>{activity}</li>
                            ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="outcomes" className="p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {currentSubStrand.outcomes.map((outcome, index) => (
                      <AccordionItem key={outcome.id} value={`outcome-${index}`}>
                        <AccordionTrigger className="hover:bg-muted/50 px-4">
                          <div className="flex items-start text-left">
                            <Lightbulb className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{outcome.description}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2">
                          <div className="pl-7">
                            <h4 className="font-medium mb-2">Learning Objectives:</h4>
                            <ul className="space-y-4">
                              {outcome.objectives.map((objective) => (
                                <li key={objective.id} className="border-l-2 border-muted pl-4">
                                  <p className="font-medium">{objective.description}</p>
                                  <div className="mt-2">
                                    <h5 className="text-sm font-medium text-muted-foreground mb-1">Activities:</h5>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                      {objective.activities.map((activity, actIndex) => (
                                        <li key={actIndex}>{activity}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>

                <TabsContent value="activities" className="p-4">
                  <div className="space-y-6">
                    {currentSubStrand.outcomes.map((outcome) => (
                      <div key={outcome.id} className="space-y-4">
                        <h3 className="text-md font-semibold border-l-4 border-primary pl-3">{outcome.description}</h3>

                        {outcome.objectives.map((objective) => (
                          <Card key={objective.id} className="bg-muted/30">
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm">{objective.description}</CardTitle>
                            </CardHeader>
                            <CardContent className="py-2">
                              <ul className="list-disc pl-5 space-y-2 text-sm">
                                {objective.activities.map((activity, index) => (
                                  <li key={index} className="pb-2">
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {currentSubStrand.practicalProjects && currentSubStrand.practicalProjects.length > 0 && (
                  <TabsContent value="projects" className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentSubStrand.practicalProjects.map((project, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-md">{project.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Materials Needed:</h4>
                              <ul className="list-disc pl-5 text-sm">
                                {project.materials.map((material, idx) => (
                                  <li key={idx}>{material}</li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 border rounded-lg bg-muted/20">
              <div className="text-center p-4">
                <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">Select a Sub-Strand</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a grade, learning area, strand, and sub-strand to view curriculum details
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
