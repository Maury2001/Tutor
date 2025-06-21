"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  BookOpen,
  Users,
  Target,
  Clock,
  Award,
  Lightbulb,
  Microscope,
  Atom,
  Leaf,
  Zap,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Globe,
} from "lucide-react"
import {
  GRADE_9_INTEGRATED_SCIENCE_CURRICULUM,
  JUNIOR_SCHOOL_LEARNING_OUTCOMES,
  INTEGRATED_SCIENCE_GENERAL_OUTCOMES,
  JUNIOR_SCHOOL_LESSON_ALLOCATION,
  CSL_MILESTONES,
  getTotalLessons,
  getStrandSummary,
} from "@/lib/cbc-curriculum-grade9-integrated-science"

export function Grade9IntegratedScienceDashboard() {
  const [selectedStrand, setSelectedStrand] = useState<string | null>(null)
  const [selectedSubStrand, setSelectedSubStrand] = useState<string | null>(null)

  const totalLessons = getTotalLessons()
  const strandSummary = getStrandSummary()

  const getStrandIcon = (strandId: string) => {
    switch (strandId) {
      case "strand-1-mixtures-elements-compounds":
        return <Atom className="h-6 w-6 text-blue-600" />
      case "strand-2-living-things-environment":
        return <Leaf className="h-6 w-6 text-green-600" />
      case "strand-3-force-energy":
        return <Zap className="h-6 w-6 text-yellow-600" />
      default:
        return <Microscope className="h-6 w-6 text-purple-600" />
    }
  }

  const getAssessmentColor = (level: string) => {
    switch (level) {
      case "exceedsExpectation":
        return "bg-green-100 text-green-800 border-green-200"
      case "meetsExpectation":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "approachesExpectation":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "belowExpectation":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Microscope className="h-12 w-12" />
            <div>
              <CardTitle className="text-3xl">Grade 9 Integrated Science</CardTitle>
              <p className="text-blue-100">Kenya Institute of Curriculum Development - 2024</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalLessons}</div>
              <div className="text-sm text-blue-100">Total Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-blue-100">Main Strands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">9</div>
              <div className="text-sm text-blue-100">Sub-Strands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-blue-100">Lessons/Week</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strands">Strands</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="csl">CSL Project</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Curriculum Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {strandSummary.map((strand, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{strand.name}</span>
                      <Badge variant="outline">{strand.totalLessons} lessons</Badge>
                    </div>
                    <Progress value={(strand.totalLessons / totalLessons) * 100} className="h-2" />
                    <div className="text-xs text-muted-foreground">{strand.subStrandCount} sub-strands</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Junior School Lesson Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {JUNIOR_SCHOOL_LESSON_ALLOCATION.map((subject, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span
                        className={`text-sm ${subject.learningArea === "Integrated Science" ? "font-bold text-blue-600" : ""}`}
                      >
                        {subject.learningArea}
                      </span>
                      <Badge
                        variant={subject.learningArea === "Integrated Science" ? "default" : "outline"}
                        className={subject.learningArea === "Integrated Science" ? "bg-blue-600" : ""}
                      >
                        {subject.lessons}
                      </Badge>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total</span>
                      <Badge variant="secondary">41 lessons</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Essence Statement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Integrated science is a new learning area that enables learners to apply distinctive ways of logical
                valuing, thinking and working to understand natural phenomena in the biological, physical and
                technological world. The emphasis of science education at Junior School level is to enhance learners'
                scientific thinking through learning activities that involve the basic science process skills. The
                subject area is expected to create a scientific culture that inculcates scientific literacy to enable
                learners to make informed choices in their personal lives and approach life challenges in a systematic
                and logical manner.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strands" className="space-y-4">
          <div className="grid gap-4">
            {GRADE_9_INTEGRATED_SCIENCE_CURRICULUM.map((strand) => (
              <Card key={strand.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStrandIcon(strand.id)}
                      <div>
                        <CardTitle className="text-lg">{strand.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{strand.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-1">
                        {strand.totalLessons} lessons
                      </Badge>
                      <div className="text-xs text-muted-foreground">{strand.subStrands.length} sub-strands</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {strand.subStrands.map((subStrand) => (
                      <AccordionItem key={subStrand.id} value={subStrand.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center justify-between w-full mr-4">
                            <span className="font-medium">{subStrand.name}</span>
                            <Badge variant="outline">{subStrand.lessons} lessons</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Learning Outcomes
                              </h4>
                              <ul className="space-y-1 text-sm">
                                {subStrand.specificLearningOutcomes.map((outcome, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                                    {outcome}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" />
                                Key Inquiry Questions
                              </h4>
                              <ul className="space-y-1 text-sm">
                                {subStrand.keyInquiryQuestions.map((question, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <AlertCircle className="h-3 w-3 text-blue-600 mt-1 flex-shrink-0" />
                                    {question}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Core Competencies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {subStrand.coreCompetencies.map((competency, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {competency.split(":")[0]}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              Values
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {subStrand.values.map((value, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {value.split(":")[0]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Junior School Learning Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {JUNIOR_SCHOOL_LEARNING_OUTCOMES.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1 flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <p className="text-sm">{outcome}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="h-5 w-5" />
                  Integrated Science General Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {INTEGRATED_SCIENCE_GENERAL_OUTCOMES.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1 flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <p className="text-sm">{outcome}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Assessment Rubrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {GRADE_9_INTEGRATED_SCIENCE_CURRICULUM.map((strand) => (
                  <div key={strand.id}>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      {getStrandIcon(strand.id)}
                      {strand.name}
                    </h3>
                    <div className="space-y-4">
                      {strand.subStrands.map((subStrand) => (
                        <div key={subStrand.id}>
                          {subStrand.assessmentCriteria.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3">{subStrand.name}</h4>
                              <div className="space-y-3">
                                {subStrand.assessmentCriteria.map((criteria, index) => (
                                  <div key={index} className="border rounded-lg p-4">
                                    <h5 className="font-medium mb-3">{criteria.indicator}</h5>
                                    <div className="grid md:grid-cols-4 gap-2">
                                      <div className="space-y-1">
                                        <Badge className={getAssessmentColor("exceedsExpectation")}>Exceeds</Badge>
                                        <p className="text-xs">{criteria.exceedsExpectation}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <Badge className={getAssessmentColor("meetsExpectation")}>Meets</Badge>
                                        <p className="text-xs">{criteria.meetsExpectation}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <Badge className={getAssessmentColor("approachesExpectation")}>
                                          Approaches
                                        </Badge>
                                        <p className="text-xs">{criteria.approachesExpectation}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <Badge className={getAssessmentColor("belowExpectation")}>Below</Badge>
                                        <p className="text-xs">{criteria.belowExpectation}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Community Service Learning (CSL) Project
              </CardTitle>
              <p className="text-muted-foreground">
                Grade 9 learners undertake an integrated CSL project following a 6-step milestone approach
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CSL_MILESTONES.map((milestone) => (
                  <Card key={milestone.milestone} className="border-l-4 border-l-blue-600">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Badge variant="secondary" className="mt-1">
                          {milestone.milestone}
                        </Badge>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{milestone.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                          {milestone.challenges && (
                            <div>
                              <p className="text-sm font-medium mb-2">Community Challenges:</p>
                              <ul className="text-sm space-y-1">
                                {milestone.challenges.map((challenge, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <AlertCircle className="h-3 w-3 text-orange-600" />
                                    {challenge}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assessment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "Reflections",
                    "Game Playing",
                    "Pre-Post Testing",
                    "Model Making",
                    "Explorations",
                    "Experiments",
                    "Investigations",
                    "Conventions, Conferences and Debates",
                    "Teacher Observations",
                    "Project",
                    "Journals",
                    "Portfolio",
                    "Oral or Aural Questions",
                    "Learner's Profile",
                    "Written Tests",
                    "Anecdotal Records",
                  ].map((method, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                      {method}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "Laboratory Apparatus and Equipment",
                    "Textbooks",
                    "Models",
                    "Digital media",
                    "Print media",
                    "Digital Devices",
                    "Software",
                    "Recordings",
                    "Resource persons",
                  ].map((resource, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Non-Formal Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "Science historical sites visits",
                    "Digital research",
                    "Live learning experiences",
                    "Community problem solving",
                    "Science document analysis",
                    "Resource person talks",
                    "Science clubs and societies",
                    "Science and Engineering fairs",
                    "Exchange programs",
                    "Oral presentations",
                  ].map((activity, index) => (
                    <Badge key={index} variant="default" className="mr-2 mb-2 bg-green-600">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
