"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Copy, Wand2, BookOpen, Users, Laptop, Target } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  generateSubjectPrompt,
  generateAssessmentPrompt,
  generateCrossCurricularPrompt,
  generateDifferentiatedPrompt,
  generateTechnologyPrompt,
  generateCommunityEngagementPrompt,
  SUBJECT_PROMPT_TEMPLATES,
  type CurriculumContext,
  type GradeLevel,
} from "@/lib/ai/curriculum-prompts"
import { GRADE_LEVELS } from "@/lib/cbc-curriculum"

const SUBJECTS = ["mathematics", "science", "languages", "socialStudies", "creativeArts", "agriculture", "homeScience"]

const PROMPT_TYPES = {
  subject: "Subject-Specific",
  assessment: "Assessment-Focused",
  crossCurricular: "Cross-Curricular",
  differentiated: "Differentiated Instruction",
  technology: "Technology Integration",
  community: "Community Engagement",
}

export default function CurriculumPromptGenerator() {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>("grade4")
  const [selectedSubject, setSelectedSubject] = useState("mathematics")
  const [promptType, setPromptType] = useState("subject")
  const [subjectPromptType, setSubjectPromptType] = useState("conceptExplanation")
  const [concept, setConcept] = useState("")
  const [topic, setTopic] = useState("")
  const [problem, setProblem] = useState("")
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [secondarySubjects, setSecondarySubjects] = useState<string[]>([])
  const [assessmentType, setAssessmentType] = useState<"formative" | "summative" | "diagnostic">("formative")

  // Differentiation options
  const [learnerNeeds, setLearnerNeeds] = useState({
    advancedLearners: false,
    strugglingLearners: false,
    englishLanguageLearners: false,
    specialNeeds: false,
  })

  // Technology options
  const [availableTech, setAvailableTech] = useState({
    computers: false,
    tablets: false,
    smartphones: false,
    internet: false,
    projector: false,
    basicTools: false,
  })

  const generatePrompt = () => {
    const context: CurriculumContext = {
      grade: selectedGrade,
      learningArea: {
        id: selectedSubject,
        name: selectedSubject,
        description: `${selectedSubject} learning area`,
      },
    }

    let prompt = ""

    switch (promptType) {
      case "subject":
        prompt = generateSubjectPrompt(selectedSubject, subjectPromptType, {
          grade: selectedGrade,
          concept,
          topic,
          problem,
        })
        break
      case "assessment":
        prompt = generateAssessmentPrompt(context, assessmentType)
        break
      case "crossCurricular":
        prompt = generateCrossCurricularPrompt(selectedSubject, secondarySubjects, context)
        break
      case "differentiated":
        prompt = generateDifferentiatedPrompt(context, learnerNeeds)
        break
      case "technology":
        prompt = generateTechnologyPrompt(context, availableTech)
        break
      case "community":
        prompt = generateCommunityEngagementPrompt(context)
        break
    }

    setGeneratedPrompt(prompt)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt)
  }

  const getSubjectPromptTypes = () => {
    const templates = SUBJECT_PROMPT_TEMPLATES[selectedSubject as keyof typeof SUBJECT_PROMPT_TEMPLATES]
    return templates ? Object.keys(templates) : []
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">CBC Curriculum Prompt Generator</h1>
        <p className="text-muted-foreground">
          Generate specialized AI prompts for different subjects and learning contexts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Prompt Configuration
            </CardTitle>
            <CardDescription>Configure the parameters for your curriculum-specific prompt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level</Label>
                <Select value={selectedGrade} onValueChange={(value) => setSelectedGrade(value as GradeLevel)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADE_LEVELS.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promptType">Prompt Type</Label>
              <Select value={promptType} onValueChange={setPromptType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROMPT_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject-specific options */}
            {promptType === "subject" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subjectPromptType">Subject Prompt Type</Label>
                  <Select value={subjectPromptType} onValueChange={setSubjectPromptType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubjectPromptTypes().map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, " $1")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="concept">Concept/Topic</Label>
                  <Input
                    id="concept"
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g., fractions, photosynthesis, storytelling"
                  />
                </div>

                {subjectPromptType === "problemSolving" && (
                  <div className="space-y-2">
                    <Label htmlFor="problem">Problem Statement</Label>
                    <Textarea
                      id="problem"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Enter the specific problem to solve"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Assessment options */}
            {promptType === "assessment" && (
              <div className="space-y-2">
                <Label htmlFor="assessmentType">Assessment Type</Label>
                <Select value={assessmentType} onValueChange={(value) => setAssessmentType(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formative">Formative Assessment</SelectItem>
                    <SelectItem value="summative">Summative Assessment</SelectItem>
                    <SelectItem value="diagnostic">Diagnostic Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Cross-curricular options */}
            {promptType === "crossCurricular" && (
              <div className="space-y-2">
                <Label>Secondary Subjects to Integrate</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SUBJECTS.filter((s) => s !== selectedSubject).map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={secondarySubjects.includes(subject)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSecondarySubjects([...secondarySubjects, subject])
                          } else {
                            setSecondarySubjects(secondarySubjects.filter((s) => s !== subject))
                          }
                        }}
                      />
                      <Label htmlFor={subject} className="text-sm">
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Differentiation options */}
            {promptType === "differentiated" && (
              <div className="space-y-2">
                <Label>Learner Needs</Label>
                <div className="space-y-2">
                  {Object.entries(learnerNeeds).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => setLearnerNeeds({ ...learnerNeeds, [key]: checked as boolean })}
                      />
                      <Label htmlFor={key} className="text-sm">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technology options */}
            {promptType === "technology" && (
              <div className="space-y-2">
                <Label>Available Technology</Label>
                <div className="space-y-2">
                  {Object.entries(availableTech).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => setAvailableTech({ ...availableTech, [key]: checked as boolean })}
                      />
                      <Label htmlFor={key} className="text-sm">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={generatePrompt} className="w-full">
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Prompt
            </Button>
          </CardContent>
        </Card>

        {/* Generated Prompt Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Generated Prompt
            </CardTitle>
            <CardDescription>Your customized curriculum prompt ready for use</CardDescription>
          </CardHeader>
          <CardContent>
            {generatedPrompt ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{selectedGrade.toUpperCase()}</Badge>
                    <Badge variant="outline">{selectedSubject}</Badge>
                    <Badge variant="outline">{PROMPT_TYPES[promptType as keyof typeof PROMPT_TYPES]}</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono">{generatedPrompt}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure your settings and click "Generate Prompt" to create a customized curriculum prompt.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              Subject-Specific
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Generate prompts tailored to specific subjects with appropriate pedagogical approaches and assessment
              methods.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Differentiated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create inclusive prompts that address diverse learner needs and provide multiple pathways to success.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Laptop className="h-5 w-5" />
              Technology-Enhanced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Integrate available technology resources to enhance learning while promoting digital literacy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
