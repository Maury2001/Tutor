"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, Target, Brain, RefreshCw, Trophy, ChevronRight } from "lucide-react"

// Complete CBC Grade Levels
const CBC_GRADES = [
  { value: "pp1", label: "Pre-Primary 1 (PP1)", age: "4-5 years", description: "Foundation learning through play" },
  { value: "pp2", label: "Pre-Primary 2 (PP2)", age: "5-6 years", description: "Preparation for formal learning" },
  { value: "grade1", label: "Grade 1", age: "6-7 years", description: "Beginning formal education" },
  { value: "grade2", label: "Grade 2", age: "7-8 years", description: "Building basic skills" },
  { value: "grade3", label: "Grade 3", age: "8-9 years", description: "Developing competencies" },
  { value: "grade4", label: "Grade 4", age: "9-10 years", description: "Intermediate primary" },
  { value: "grade5", label: "Grade 5", age: "10-11 years", description: "Advanced primary skills" },
  { value: "grade6", label: "Grade 6", age: "11-12 years", description: "Primary completion" },
  { value: "grade7", label: "Grade 7", age: "12-13 years", description: "Junior secondary entry" },
  { value: "grade8", label: "Grade 8", age: "13-14 years", description: "Junior secondary development" },
  { value: "grade9", label: "Grade 9", age: "14-15 years", description: "Junior secondary completion" },
  { value: "grade10", label: "Grade 10", age: "15-16 years", description: "Senior secondary foundation" },
  { value: "grade11", label: "Grade 11", age: "16-17 years", description: "Senior secondary specialization" },
  { value: "grade12", label: "Grade 12", age: "17-18 years", description: "Senior secondary completion" },
]

// CBC Learning Areas by Grade Level
const CBC_LEARNING_AREAS = {
  pp1: [
    { id: "language-activities", name: "Language Activities", description: "Pre-literacy and communication skills" },
    { id: "mathematical-activities", name: "Mathematical Activities", description: "Number concepts and patterns" },
    { id: "environmental-activities", name: "Environmental Activities", description: "Understanding surroundings" },
    {
      id: "psychomotor-creative",
      name: "Psychomotor and Creative Activities",
      description: "Physical and creative development",
    },
    { id: "hygiene-nutrition", name: "Hygiene and Nutrition Activities", description: "Health and wellness" },
  ],
  pp2: [
    { id: "literacy-activities", name: "Literacy Activities", description: "Reading and writing readiness" },
    { id: "numeracy-activities", name: "Numeracy Activities", description: "Mathematical thinking" },
    { id: "environmental-activities", name: "Environmental Activities", description: "World awareness" },
    {
      id: "psychomotor-activities",
      name: "Psychomotor and Creative Activities",
      description: "Motor skills and creativity",
    },
    { id: "hygiene-nutrition", name: "Hygiene and Nutrition Activities", description: "Personal care" },
  ],
  grade1: [
    { id: "english", name: "English", description: "English language development" },
    { id: "kiswahili", name: "Kiswahili", description: "Kiswahili language skills" },
    { id: "mathematics", name: "Mathematics", description: "Number operations and problem solving" },
    { id: "integrated-science", name: "Integrated Science", description: "Scientific inquiry and discovery" },
    { id: "social-studies", name: "Social Studies", description: "Community and environment" },
    { id: "creative-arts", name: "Creative Arts", description: "Artistic expression and appreciation" },
    { id: "physical-education", name: "Physical Education", description: "Physical fitness and health" },
  ],
  grade4: [
    { id: "english", name: "English", description: "Advanced language and literature" },
    { id: "kiswahili", name: "Kiswahili", description: "Advanced Kiswahili skills" },
    { id: "mathematics", name: "Mathematics", description: "Complex mathematical concepts" },
    { id: "integrated-science", name: "Integrated Science", description: "Scientific investigation" },
    { id: "social-studies", name: "Social Studies", description: "History, geography, and civics" },
    { id: "creative-arts", name: "Creative Arts", description: "Advanced artistic skills" },
    { id: "physical-education", name: "Physical Education", description: "Sports and wellness" },
    {
      id: "christian-religious-education",
      name: "Christian Religious Education",
      description: "Christian values and teachings",
    },
    { id: "islamic-religious-education", name: "Islamic Religious Education", description: "Islamic principles" },
    { id: "hindu-religious-education", name: "Hindu Religious Education", description: "Hindu philosophy" },
  ],
  grade7: [
    { id: "english", name: "English", description: "Literature and advanced communication" },
    { id: "kiswahili", name: "Kiswahili", description: "Advanced Kiswahili literature" },
    { id: "mathematics", name: "Mathematics", description: "Algebra, geometry, and statistics" },
    { id: "integrated-science", name: "Integrated Science", description: "Physics, chemistry, and biology concepts" },
    { id: "social-studies", name: "Social Studies", description: "Advanced social sciences" },
    { id: "creative-arts", name: "Creative Arts", description: "Specialized artistic disciplines" },
    { id: "physical-education", name: "Physical Education", description: "Advanced sports and health" },
    { id: "pre-technical-studies", name: "Pre-Technical Studies", description: "Introduction to technology" },
    { id: "agricultural-activities", name: "Agricultural Activities", description: "Farming and food production" },
  ],
  grade10: [
    { id: "english", name: "English", description: "Advanced literature and communication" },
    { id: "kiswahili", name: "Kiswahili", description: "Advanced Kiswahili studies" },
    { id: "mathematics", name: "Mathematics", description: "Advanced mathematics" },
    { id: "biology", name: "Biology", description: "Life sciences" },
    { id: "chemistry", name: "Chemistry", description: "Chemical sciences" },
    { id: "physics", name: "Physics", description: "Physical sciences" },
    { id: "history-government", name: "History and Government", description: "Historical and political studies" },
    { id: "geography", name: "Geography", description: "Physical and human geography" },
    { id: "business-studies", name: "Business Studies", description: "Commerce and entrepreneurship" },
    { id: "computer-science", name: "Computer Science", description: "Computing and programming" },
  ],
}

// CBC Strands by Learning Area
const CBC_STRANDS = {
  english: [
    { id: "listening-speaking", name: "Listening and Speaking", description: "Oral communication skills" },
    { id: "reading", name: "Reading", description: "Reading comprehension and fluency" },
    { id: "writing", name: "Writing", description: "Written communication" },
    { id: "language-use", name: "Language Use", description: "Grammar and vocabulary" },
  ],
  kiswahili: [
    {
      id: "kusikiliza-kuzungumza",
      name: "Kusikiliza na Kuzungumza",
      description: "Listening and speaking in Kiswahili",
    },
    { id: "kusoma", name: "Kusoma", description: "Reading in Kiswahili" },
    { id: "kuandika", name: "Kuandika", description: "Writing in Kiswahili" },
    { id: "matumizi-lugha", name: "Matumizi ya Lugha", description: "Language use and grammar" },
  ],
  mathematics: [
    { id: "numbers", name: "Numbers", description: "Number concepts and operations" },
    { id: "measurement", name: "Measurement", description: "Length, mass, time, capacity, money" },
    { id: "geometry", name: "Geometry", description: "Shapes, space, and position" },
    { id: "data-handling", name: "Data Handling", description: "Statistics and probability" },
    { id: "algebra", name: "Algebra", description: "Patterns and algebraic thinking" },
  ],
  "integrated-science": [
    { id: "living-things", name: "Living Things and Their Environment", description: "Biology concepts" },
    { id: "non-living-things", name: "Non-Living Things", description: "Chemistry and physics concepts" },
    { id: "energy", name: "Energy", description: "Forms and sources of energy" },
    { id: "earth-space", name: "Earth and Space", description: "Earth sciences and astronomy" },
  ],
  "social-studies": [
    { id: "social-skills", name: "Social Skills and Values", description: "Interpersonal skills" },
    { id: "citizenship", name: "Citizenship", description: "Rights, responsibilities, and governance" },
    { id: "geography", name: "Geography", description: "Physical and human geography" },
    { id: "history", name: "History", description: "Historical knowledge and understanding" },
  ],
}

// CBC Sub-strands by Strand
const CBC_SUB_STRANDS = {
  numbers: [
    { id: "counting", name: "Counting", description: "Counting objects and numbers 1-100" },
    { id: "place-value", name: "Place Value", description: "Understanding tens and ones" },
    { id: "addition", name: "Addition", description: "Adding numbers with and without regrouping" },
    { id: "subtraction", name: "Subtraction", description: "Subtracting numbers with and without regrouping" },
    { id: "multiplication", name: "Multiplication", description: "Multiplication tables and concepts" },
    { id: "division", name: "Division", description: "Division facts and long division" },
    { id: "fractions", name: "Fractions", description: "Understanding parts of a whole" },
    { id: "decimals", name: "Decimals", description: "Decimal notation and operations" },
  ],
  reading: [
    { id: "phonics", name: "Phonics", description: "Letter-sound relationships" },
    { id: "sight-words", name: "Sight Words", description: "High-frequency word recognition" },
    { id: "comprehension", name: "Reading Comprehension", description: "Understanding texts" },
    { id: "fluency", name: "Reading Fluency", description: "Reading with speed and accuracy" },
    { id: "vocabulary", name: "Vocabulary Development", description: "Word meaning and usage" },
  ],
  "living-things": [
    { id: "plants", name: "Plants", description: "Plant parts, growth, and functions" },
    { id: "animals", name: "Animals", description: "Animal characteristics and habitats" },
    { id: "human-body", name: "Human Body", description: "Body systems and health" },
    { id: "ecosystems", name: "Ecosystems", description: "Interactions in nature" },
    { id: "classification", name: "Classification", description: "Grouping living things" },
  ],
  "social-skills": [
    { id: "family", name: "Family and Community", description: "Family structures and roles" },
    { id: "communication", name: "Communication", description: "Effective communication skills" },
    { id: "conflict-resolution", name: "Conflict Resolution", description: "Peaceful problem solving" },
    { id: "leadership", name: "Leadership", description: "Leadership qualities and skills" },
  ],
}

interface CurriculumSelection {
  grade: string
  learningArea: string
  strand: string
  subStrand: string
  mode: "revision" | "guided" | "mastery" | null
  learningAbility: "visual" | "auditory" | "kinesthetic" | "mixed"
  difficultyPreference: "easy" | "medium" | "challenging" | "adaptive"
}

interface CBCCurriculumSelectorProps {
  onSelectionComplete: (selection: CurriculumSelection) => void
  userRole: "student" | "teacher"
}

export function CBCCurriculumSelector({ onSelectionComplete, userRole }: CBCCurriculumSelectorProps) {
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedLearningArea, setSelectedLearningArea] = useState("")
  const [selectedStrand, setSelectedStrand] = useState("")
  const [selectedSubStrand, setSelectedSubStrand] = useState("")
  const [selectedMode, setSelectedMode] = useState<"revision" | "guided" | "mastery" | null>(null)
  const [learningAbility, setLearningAbility] = useState<"visual" | "auditory" | "kinesthetic" | "mixed">("mixed")
  const [difficultyPreference, setDifficultyPreference] = useState<"easy" | "medium" | "challenging" | "adaptive">(
    "adaptive",
  )

  const [availableLearningAreas, setAvailableLearningAreas] = useState<any[]>([])
  const [availableStrands, setAvailableStrands] = useState<any[]>([])
  const [availableSubStrands, setAvailableSubStrands] = useState<any[]>([])

  // Update available options based on selections
  useEffect(() => {
    if (selectedGrade) {
      const areas = CBC_LEARNING_AREAS[selectedGrade as keyof typeof CBC_LEARNING_AREAS] || []
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
      const strands = CBC_STRANDS[selectedLearningArea as keyof typeof CBC_STRANDS] || []
      setAvailableStrands(strands)
      if (!strands.some((strand) => strand.id === selectedStrand)) {
        setSelectedStrand("")
        setSelectedSubStrand("")
      }
    }
  }, [selectedLearningArea])

  useEffect(() => {
    if (selectedStrand) {
      const subStrands = CBC_SUB_STRANDS[selectedStrand as keyof typeof CBC_SUB_STRANDS] || []
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
        learningAbility,
        difficultyPreference,
      })
    }
  }

  const getLearningModeConfig = (mode: string) => {
    const configs = {
      revision: {
        title: "Revision Mode",
        description: "Review and reinforce previously learned concepts",
        icon: RefreshCw,
        color: "bg-green-500",
        features: ["Content review", "Practice questions", "Memory reinforcement", "Progress tracking"],
        suitableFor: "Students who want to strengthen understanding of topics they've already covered",
      },
      guided: {
        title: "Guided Learning",
        description: "Step-by-step learning with AI tutoring support",
        icon: Brain,
        color: "bg-blue-500",
        features: ["Interactive lessons", "Real-time AI help", "Adaptive difficulty", "Personalized pace"],
        suitableFor: "Students learning new concepts or needing structured support",
      },
      mastery: {
        title: "Mastery Check",
        description: "Assess understanding and demonstrate competency",
        icon: Trophy,
        color: "bg-purple-500",
        features: ["Comprehensive assessment", "Skill validation", "Performance analytics", "Competency tracking"],
        suitableFor: "Students ready to demonstrate their knowledge and skills",
      },
    }
    return configs[mode as keyof typeof configs]
  }

  const getLearningAbilityConfig = (ability: string) => {
    const configs = {
      visual: {
        title: "Visual Learner",
        description: "Learn best through images, diagrams, and visual aids",
        features: ["Charts and graphs", "Visual demonstrations", "Color-coded content", "Mind maps"],
      },
      auditory: {
        title: "Auditory Learner",
        description: "Learn best through listening and verbal instruction",
        features: ["Audio explanations", "Verbal discussions", "Sound associations", "Rhythm and music"],
      },
      kinesthetic: {
        title: "Kinesthetic Learner",
        description: "Learn best through hands-on activities and movement",
        features: [
          "Interactive activities",
          "Physical demonstrations",
          "Practical exercises",
          "Movement-based learning",
        ],
      },
      mixed: {
        title: "Mixed Learning Style",
        description: "Benefit from a combination of learning approaches",
        features: ["Multi-modal content", "Varied activities", "Flexible presentation", "Adaptive methods"],
      },
    }
    return configs[ability as keyof typeof configs]
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
            Select your curriculum path and learning preferences for a personalized AI-powered learning experience
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
        <CardContent className="space-y-6">
          {/* Grade Level Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Grade Level</label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select your grade level" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {CBC_GRADES.map((grade) => (
                  <SelectItem key={grade.value} value={grade.value}>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{grade.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">{grade.age}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{grade.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Learning Area Selection */}
          {selectedGrade && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Learning Area</label>
              <Select value={selectedLearningArea} onValueChange={setSelectedLearningArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select learning area" />
                </SelectTrigger>
                <SelectContent>
                  {availableLearningAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{area.name}</span>
                        <span className="text-xs text-muted-foreground">{area.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Strand Selection */}
          {selectedLearningArea && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Strand</label>
              <Select value={selectedStrand} onValueChange={setSelectedStrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strand" />
                </SelectTrigger>
                <SelectContent>
                  {availableStrands.map((strand) => (
                    <SelectItem key={strand.id} value={strand.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{strand.name}</span>
                        <span className="text-xs text-muted-foreground">{strand.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sub-Strand Selection */}
          {selectedStrand && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Sub-Strand</label>
              <Select value={selectedSubStrand} onValueChange={setSelectedSubStrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-strand" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubStrands.map((subStrand) => (
                    <SelectItem key={subStrand.id} value={subStrand.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{subStrand.name}</span>
                        <span className="text-xs text-muted-foreground">{subStrand.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Learning Path Display */}
          {(selectedGrade || selectedLearningArea || selectedStrand || selectedSubStrand) && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-2">Selected Learning Path:</div>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                {selectedGrade && (
                  <>
                    <Badge variant="outline">{CBC_GRADES.find((g) => g.value === selectedGrade)?.label}</Badge>
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

      {/* Learning Preferences */}
      {selectedSubStrand && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Learning Preferences
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Help us personalize your learning experience based on how you learn best
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Learning Style */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Learning Style</label>
              <div className="grid gap-3 md:grid-cols-2">
                {(["visual", "auditory", "kinesthetic", "mixed"] as const).map((ability) => {
                  const config = getLearningAbilityConfig(ability)
                  const isSelected = learningAbility === ability

                  return (
                    <Card
                      key={ability}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isSelected ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setLearningAbility(ability)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">{config.title}</h4>
                          <p className="text-xs text-muted-foreground">{config.description}</p>
                          <div className="space-y-1">
                            {config.features.slice(0, 2).map((feature, index) => (
                              <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Difficulty Preference */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Difficulty Preference</label>
              <div className="grid gap-2 md:grid-cols-4">
                {(["easy", "medium", "challenging", "adaptive"] as const).map((difficulty) => {
                  const isSelected = difficultyPreference === difficulty
                  const descriptions = {
                    easy: "Start with simple concepts",
                    medium: "Balanced challenge level",
                    challenging: "Advanced difficulty",
                    adaptive: "AI adjusts automatically",
                  }

                  return (
                    <Card
                      key={difficulty}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isSelected ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setDifficultyPreference(difficulty)}
                    >
                      <CardContent className="p-3 text-center">
                        <h4 className="font-semibold text-sm capitalize">{difficulty}</h4>
                        <p className="text-xs text-muted-foreground">{descriptions[difficulty]}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Mode Selection */}
      {selectedSubStrand && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Choose Learning Mode
            </CardTitle>
            <p className="text-sm text-muted-foreground">Select how you want to engage with this topic</p>
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
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${config.color} text-white`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{config.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs font-medium">Features:</div>
                          {config.features.map((feature, index) => (
                            <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                              {feature}
                            </div>
                          ))}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Best for:</span> {config.suitableFor}
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
                <h3 className="text-lg font-semibold">Ready to Start Your Learning Journey!</h3>
                <p className="text-sm text-muted-foreground">
                  You've selected {getLearningModeConfig(selectedMode).title} for{" "}
                  {availableSubStrands.find((ss) => ss.id === selectedSubStrand)?.name} in{" "}
                  {availableLearningAreas.find((la) => la.id === selectedLearningArea)?.name}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="secondary">
                    {getLearningAbilityConfig(learningAbility).title.split(" ")[0]} Learning
                  </Badge>
                  <Badge variant="outline">
                    {difficultyPreference.charAt(0).toUpperCase() + difficultyPreference.slice(1)} Difficulty
                  </Badge>
                </div>
              </div>
              <Button onClick={handleStartLearning} size="lg" className="w-full md:w-auto">
                <Brain className="h-4 w-4 mr-2" />
                Start AI-Powered Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
