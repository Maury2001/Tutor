"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, GraduationCap, Target, ChevronRight, RefreshCw, Brain, Trophy } from "lucide-react"

// Extended grade levels for full CBC coverage
const GRADE_LEVELS = [
  { value: "pp1", label: "Pre-Primary 1 (PP1)", age: "4-5 years" },
  { value: "pp2", label: "Pre-Primary 2 (PP2)", age: "5-6 years" },
  { value: "grade1", label: "Grade 1", age: "6-7 years" },
  { value: "grade2", label: "Grade 2", age: "7-8 years" },
  { value: "grade3", label: "Grade 3", age: "8-9 years" },
  { value: "grade4", label: "Grade 4", age: "9-10 years" },
  { value: "grade5", label: "Grade 5", age: "10-11 years" },
  { value: "grade6", label: "Grade 6", age: "11-12 years" },
  { value: "grade7", label: "Grade 7", age: "12-13 years" },
  { value: "grade8", label: "Grade 8", age: "13-14 years" },
  { value: "grade9", label: "Grade 9", age: "14-15 years" },
  { value: "grade10", label: "Grade 10", age: "15-16 years" },
  { value: "grade11", label: "Grade 11", age: "16-17 years" },
  { value: "grade12", label: "Grade 12", age: "17-18 years" },
]

// Expanded learning areas for different grade levels
const LEARNING_AREAS_BY_GRADE = {
  pp1: [
    { id: "language-activities", name: "Language Activities", description: "Pre-literacy skills development" },
    { id: "mathematical-activities", name: "Mathematical Activities", description: "Foundation mathematical concepts" },
    {
      id: "environmental-activities",
      name: "Environmental Activities",
      description: "Understanding immediate environment",
    },
    {
      id: "psychomotor-creative",
      name: "Psychomotor and Creative Activities",
      description: "Physical and creative development",
    },
    { id: "hygiene-nutrition", name: "Hygiene and Nutrition", description: "Personal health and nutrition" },
  ],
  pp2: [
    { id: "literacy-activities", name: "Literacy Activities", description: "Advanced pre-literacy skills" },
    { id: "mathematical-activities", name: "Mathematical Activities", description: "Extended mathematical concepts" },
    {
      id: "environmental-activities",
      name: "Environmental Activities",
      description: "Extended environmental understanding",
    },
    {
      id: "psychomotor-activities",
      name: "Psychomotor Activities",
      description: "Advanced physical and creative skills",
    },
  ],
  grade1: [
    { id: "english", name: "English", description: "English language development" },
    { id: "kiswahili", name: "Kiswahili", description: "Kiswahili language development" },
    { id: "mathematics", name: "Mathematics", description: "Mathematical concepts and skills" },
    { id: "integrated-science", name: "Integrated Science", description: "Basic science concepts" },
    { id: "social-studies", name: "Social Studies", description: "Understanding society and environment" },
    { id: "creative-arts", name: "Creative Arts", description: "Art, music, and drama" },
    { id: "physical-education", name: "Physical Education", description: "Physical fitness and sports" },
  ],
  // Add more grades with appropriate learning areas
  grade4: [
    { id: "english", name: "English", description: "English language and literature" },
    { id: "kiswahili", name: "Kiswahili", description: "Kiswahili language and literature" },
    { id: "mathematics", name: "Mathematics", description: "Mathematical concepts and problem solving" },
    { id: "integrated-science", name: "Integrated Science", description: "Scientific inquiry and concepts" },
    { id: "social-studies", name: "Social Studies", description: "History, geography, and civics" },
    { id: "creative-arts", name: "Creative Arts", description: "Visual arts, music, and performing arts" },
    { id: "physical-education", name: "Physical Education", description: "Physical fitness and health" },
    {
      id: "christian-religious-education",
      name: "Christian Religious Education",
      description: "Christian values and teachings",
    },
    {
      id: "islamic-religious-education",
      name: "Islamic Religious Education",
      description: "Islamic values and teachings",
    },
    { id: "hindu-religious-education", name: "Hindu Religious Education", description: "Hindu values and teachings" },
  ],
  grade7: [
    { id: "english", name: "English", description: "Advanced English language skills" },
    { id: "kiswahili", name: "Kiswahili", description: "Advanced Kiswahili language skills" },
    { id: "mathematics", name: "Mathematics", description: "Advanced mathematical concepts" },
    { id: "integrated-science", name: "Integrated Science", description: "Advanced scientific concepts" },
    { id: "social-studies", name: "Social Studies", description: "Advanced social studies" },
    { id: "creative-arts", name: "Creative Arts", description: "Advanced creative expression" },
    { id: "physical-education", name: "Physical Education", description: "Advanced physical education" },
    { id: "pre-technical-studies", name: "Pre-Technical Studies", description: "Introduction to technical skills" },
    { id: "agricultural-activities", name: "Agricultural Activities", description: "Basic agricultural concepts" },
  ],
}

interface CurriculumSelection {
  grade: string
  learningArea: string
  strand: string
  subStrand: string
  mode: "revision" | "guided" | "mastery" | null
}

interface ComprehensiveCurriculumSelectorProps {
  onSelectionComplete: (selection: CurriculumSelection) => void
  defaultSelection?: Partial<CurriculumSelection>
}

export function ComprehensiveCurriculumSelector({
  onSelectionComplete,
  defaultSelection,
}: ComprehensiveCurriculumSelectorProps) {
  const [selectedGrade, setSelectedGrade] = useState(defaultSelection?.grade || "")
  const [selectedLearningArea, setSelectedLearningArea] = useState(defaultSelection?.learningArea || "")
  const [selectedStrand, setSelectedStrand] = useState(defaultSelection?.strand || "")
  const [selectedSubStrand, setSelectedSubStrand] = useState(defaultSelection?.subStrand || "")
  const [selectedMode, setSelectedMode] = useState<"revision" | "guided" | "mastery" | null>(
    defaultSelection?.mode || null,
  )

  const [availableLearningAreas, setAvailableLearningAreas] = useState<any[]>([])
  const [availableStrands, setAvailableStrands] = useState<any[]>([])
  const [availableSubStrands, setAvailableSubStrands] = useState<any[]>([])

  // Mock strands data - in real implementation, this would come from the CBC curriculum database
  const getStrandsForLearningArea = (learningAreaId: string) => {
    const strandMap: Record<string, any[]> = {
      english: [
        { id: "listening-speaking", name: "Listening and Speaking", description: "Oral communication skills" },
        { id: "reading", name: "Reading", description: "Reading comprehension and fluency" },
        { id: "writing", name: "Writing", description: "Written communication skills" },
        { id: "language-use", name: "Language Use", description: "Grammar and vocabulary" },
      ],
      mathematics: [
        { id: "numbers", name: "Numbers", description: "Number concepts and operations" },
        { id: "measurement", name: "Measurement", description: "Length, weight, time, money" },
        { id: "geometry", name: "Geometry", description: "Shapes, space, and position" },
        { id: "data-handling", name: "Data Handling", description: "Statistics and probability" },
        { id: "algebra", name: "Algebra", description: "Patterns and algebraic thinking" },
      ],
      "integrated-science": [
        { id: "living-things", name: "Living Things", description: "Plants, animals, and human body" },
        { id: "non-living-things", name: "Non-Living Things", description: "Materials and their properties" },
        { id: "energy", name: "Energy", description: "Forms and sources of energy" },
        { id: "earth-space", name: "Earth and Space", description: "Weather, environment, and space" },
      ],
    }
    return strandMap[learningAreaId] || []
  }

  // Mock sub-strands data
  const getSubStrandsForStrand = (strandId: string) => {
    const subStrandMap: Record<string, any[]> = {
      numbers: [
        { id: "counting", name: "Counting", description: "Counting objects and numbers" },
        { id: "place-value", name: "Place Value", description: "Understanding place value" },
        { id: "addition", name: "Addition", description: "Addition facts and strategies" },
        { id: "subtraction", name: "Subtraction", description: "Subtraction facts and strategies" },
        { id: "multiplication", name: "Multiplication", description: "Multiplication concepts" },
        { id: "division", name: "Division", description: "Division concepts" },
      ],
      reading: [
        { id: "phonics", name: "Phonics", description: "Letter-sound relationships" },
        { id: "sight-words", name: "Sight Words", description: "High-frequency words" },
        { id: "comprehension", name: "Reading Comprehension", description: "Understanding texts" },
        { id: "fluency", name: "Reading Fluency", description: "Reading with speed and accuracy" },
      ],
      "living-things": [
        { id: "plants", name: "Plants", description: "Plant structure and functions" },
        { id: "animals", name: "Animals", description: "Animal characteristics and habitats" },
        { id: "human-body", name: "Human Body", description: "Body parts and systems" },
        { id: "health", name: "Health and Hygiene", description: "Staying healthy and clean" },
      ],
    }
    return subStrandMap[strandId] || []
  }

  // Update available options when selections change
  useEffect(() => {
    if (selectedGrade) {
      const areas = LEARNING_AREAS_BY_GRADE[selectedGrade as keyof typeof LEARNING_AREAS_BY_GRADE] || []
      setAvailableLearningAreas(areas)

      if (!areas.some((area) => area.id === selectedLearningArea)) {
        setSelectedLearningArea("")
        setSelectedStrand("")
        setSelectedSubStrand("")
      }
    }
  }, [selectedGrade])

  useEffect(() => {
    if (selectedLearningArea) {
      const strands = getStrandsForLearningArea(selectedLearningArea)
      setAvailableStrands(strands)

      if (!strands.some((strand) => strand.id === selectedStrand)) {
        setSelectedStrand("")
        setSelectedSubStrand("")
      }
    }
  }, [selectedLearningArea])

  useEffect(() => {
    if (selectedStrand) {
      const subStrands = getSubStrandsForStrand(selectedStrand)
      setAvailableSubStrands(subStrands)

      if (!subStrands.some((subStrand) => subStrand.id === selectedSubStrand)) {
        setSelectedSubStrand("")
      }
    }
  }, [selectedStrand])

  const isSelectionComplete =
    selectedGrade && selectedLearningArea && selectedStrand && selectedSubStrand && selectedMode

  const handleStartLearning = () => {
    if (isSelectionComplete) {
      onSelectionComplete({
        grade: selectedGrade,
        learningArea: selectedLearningArea,
        strand: selectedStrand,
        subStrand: selectedSubStrand,
        mode: selectedMode!,
      })
    }
  }

  const getLearningModeConfig = (mode: string) => {
    const configs = {
      revision: {
        title: "Revision Mode",
        description: "Review and reinforce concepts you've learned",
        icon: RefreshCw,
        color: "bg-green-500",
        features: ["Content review", "Practice questions", "Memory reinforcement"],
      },
      guided: {
        title: "Guided Learning",
        description: "Step-by-step learning with AI assistance",
        icon: Brain,
        color: "bg-blue-500",
        features: ["Interactive lessons", "Real-time help", "Progressive difficulty"],
      },
      mastery: {
        title: "Mastery Check",
        description: "Test your understanding and knowledge",
        icon: Trophy,
        color: "bg-purple-500",
        features: ["Assessment tests", "Performance tracking", "Skill validation"],
      },
    }
    return configs[mode as keyof typeof configs]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Kenya CBC Curriculum Learning Platform
          </CardTitle>
          <p className="text-muted-foreground">
            Select your grade level, learning area, and preferred learning mode to start your personalized learning
            journey
          </p>
        </CardHeader>
      </Card>

      {/* Curriculum Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Curriculum Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Grade Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Grade Level</label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select your grade level" />
              </SelectTrigger>
              <SelectContent>
                {GRADE_LEVELS.map((grade) => (
                  <SelectItem key={grade.value} value={grade.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{grade.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">{grade.age}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Learning Area */}
          {selectedGrade && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Learning Area</label>
              <Select value={selectedLearningArea} onValueChange={setSelectedLearningArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select learning area" />
                </SelectTrigger>
                <SelectContent>
                  {availableLearningAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      <div>
                        <div className="font-medium">{area.name}</div>
                        <div className="text-xs text-muted-foreground">{area.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Strand */}
          {selectedLearningArea && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Strand</label>
              <Select value={selectedStrand} onValueChange={setSelectedStrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strand" />
                </SelectTrigger>
                <SelectContent>
                  {availableStrands.map((strand) => (
                    <SelectItem key={strand.id} value={strand.id}>
                      <div>
                        <div className="font-medium">{strand.name}</div>
                        <div className="text-xs text-muted-foreground">{strand.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sub-Strand */}
          {selectedStrand && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Sub-Strand</label>
              <Select value={selectedSubStrand} onValueChange={setSelectedSubStrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-strand" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubStrands.map((subStrand) => (
                    <SelectItem key={subStrand.id} value={subStrand.id}>
                      <div>
                        <div className="font-medium">{subStrand.name}</div>
                        <div className="text-xs text-muted-foreground">{subStrand.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selection Path Display */}
          {(selectedGrade || selectedLearningArea || selectedStrand || selectedSubStrand) && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-2">Learning Path:</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                {selectedGrade && (
                  <>
                    <Badge variant="outline">{GRADE_LEVELS.find((g) => g.value === selectedGrade)?.label}</Badge>
                    {selectedLearningArea && <ChevronRight className="h-3 w-3" />}
                  </>
                )}
                {selectedLearningArea && (
                  <>
                    <Badge variant="outline">
                      {availableLearningAreas.find((la) => la.id === selectedLearningArea)?.name}
                    </Badge>
                    {selectedStrand && <ChevronRight className="h-3 w-3" />}
                  </>
                )}
                {selectedStrand && (
                  <>
                    <Badge variant="outline">{availableStrands.find((s) => s.id === selectedStrand)?.name}</Badge>
                    {selectedSubStrand && <ChevronRight className="h-3 w-3" />}
                  </>
                )}
                {selectedSubStrand && (
                  <Badge variant="outline">{availableSubStrands.find((ss) => ss.id === selectedSubStrand)?.name}</Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Mode Selection */}
      {selectedSubStrand && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Choose Learning Mode
            </CardTitle>
            <p className="text-sm text-muted-foreground">Select how you want to learn this topic</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {["revision", "guided", "mastery"].map((mode) => {
                const config = getLearningModeConfig(mode)
                const isSelected = selectedMode === mode
                const IconComponent = config.icon

                return (
                  <Card
                    key={mode}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedMode(mode as "revision" | "guided" | "mastery")}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${config.color} text-white`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{config.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
                          <div className="mt-2 space-y-1">
                            {config.features.map((feature, index) => (
                              <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Learning Button */}
      {isSelectionComplete && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Ready to Start Learning!</h3>
                <p className="text-sm text-muted-foreground">
                  You've selected {getLearningModeConfig(selectedMode).title} for{" "}
                  {availableSubStrands.find((ss) => ss.id === selectedSubStrand)?.name}
                </p>
              </div>
              <Button onClick={handleStartLearning} size="lg" className="w-full md:w-auto">
                Start Learning Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
