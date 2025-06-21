"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  Lightbulb,
  Beaker,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Globe,
  Play,
  ArrowRight,
  Droplets,
  Filter,
  TestTube,
} from "lucide-react"
import Link from "next/link"

interface DemoStep {
  id: number
  title: string
  description: string
  completed: boolean
  data?: any
}

export function DemoExperimentCreation() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [progress, setProgress] = useState(0)

  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: "Choose Experiment Topic",
      description: "Let's create an experiment about Water Purification Methods - perfect for CBC curriculum!",
      completed: false,
      data: {
        topic: "Water Purification Methods",
        relevance: "Highly relevant to Kenya's water challenges and environmental science",
      },
    },
    {
      id: 2,
      title: "Set Learning Parameters",
      description: "Configure grade level, difficulty, and time constraints",
      completed: false,
      data: {
        gradeLevel: "Grade 7-9 (Junior Secondary)",
        difficulty: "Intermediate",
        timeConstraints: "60 minutes (2 class periods)",
        cbcStrand: "Living Things and Their Environment",
        cbcSubStrand: "Water and Health",
      },
    },
    {
      id: 3,
      title: "Define Learning Objectives",
      description: "AI helps create CBC-aligned learning objectives",
      completed: false,
      data: {
        objectives: [
          "Understand different water purification methods",
          "Compare effectiveness of various filtration techniques",
          "Analyze water quality before and after treatment",
          "Connect water purification to public health in Kenya",
        ],
      },
    },
    {
      id: 4,
      title: "List Available Materials",
      description: "Specify materials available in your virtual lab",
      completed: false,
      data: {
        materials: [
          "Virtual water samples (clean, muddy, contaminated)",
          "Digital filtration systems (sand, charcoal, cloth)",
          "pH testing strips (virtual)",
          "Microscope simulation",
          "Boiling apparatus (virtual)",
          "Chemical treatment options",
          "Data recording sheets",
        ],
      },
    },
    {
      id: 5,
      title: "AI Generates Experiment",
      description: "Watch as AI creates a complete, CBC-aligned experiment design",
      completed: false,
      data: null,
    },
  ]

  const [steps, setSteps] = useState(demoSteps)
  const [generatedExperiment, setGeneratedExperiment] = useState<any>(null)

  const simulateStepCompletion = async (stepIndex: number) => {
    setIsCreating(true)

    // Simulate AI processing time
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // Mark step as completed
    setSteps((prev) => prev.map((step, index) => (index === stepIndex ? { ...step, completed: true } : step)))

    setIsCreating(false)
    setProgress(0)

    // If this is the last step, generate the experiment
    if (stepIndex === 4) {
      generateDemoExperiment()
    }
  }

  const generateDemoExperiment = () => {
    const experiment = {
      title: "Water Purification Methods Investigation - Grade 7-9",
      description:
        "An intermediate level virtual experiment exploring water purification techniques aligned with CBC curriculum, focusing on Kenya's water challenges.",
      learningObjectives: [
        "Understand different water purification methods used in Kenya",
        "Compare effectiveness of various filtration techniques",
        "Analyze water quality before and after treatment",
        "Connect water purification to public health in Kenya",
        "Develop scientific inquiry and observation skills",
      ],
      cbcAlignment: {
        strand: "Living Things and Their Environment",
        subStrand: "Water and Health",
        specificOutcomes: [
          "Investigate methods of water purification",
          "Analyze the importance of clean water for health",
          "Demonstrate understanding of filtration processes",
          "Apply knowledge to solve local water challenges",
        ],
      },
      materials: [
        "Virtual water samples (clean, muddy, contaminated)",
        "Digital filtration systems (sand, charcoal, cloth)",
        "pH testing strips (virtual)",
        "Microscope simulation",
        "Boiling apparatus (virtual)",
        "Chemical treatment tablets",
        "Data recording sheets",
        "Timer and measurement tools",
      ],
      safetyPrecautions: [
        "Follow all virtual lab safety protocols",
        "Handle virtual chemicals with proper procedures",
        "Record all observations accurately",
        "Report any technical issues immediately",
        "Work systematically through each purification method",
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Initial Water Quality Assessment",
          description: "Test and record the quality of different water samples using virtual testing tools.",
          materials: ["Virtual water samples", "pH testing strips", "Microscope simulation"],
          safetyNotes: ["Handle virtual samples carefully", "Record baseline measurements"],
          expectedOutcome: "Complete baseline data for all water samples",
          troubleshooting: ["Ensure proper calibration of virtual instruments", "Take multiple readings for accuracy"],
        },
        {
          stepNumber: 2,
          title: "Physical Filtration Methods",
          description: "Test sand, charcoal, and cloth filtration methods on contaminated water samples.",
          materials: ["Digital filtration systems", "Contaminated water samples", "Collection containers"],
          safetyNotes: ["Follow proper filtration procedures", "Observe changes carefully"],
          expectedOutcome: "Filtered water samples using three different methods",
          troubleshooting: ["Check filter integrity", "Ensure proper flow rates"],
        },
        {
          stepNumber: 3,
          title: "Chemical Treatment Testing",
          description: "Apply chemical treatment methods including chlorination and water purification tablets.",
          materials: ["Chemical treatment options", "Treated water samples", "Testing equipment"],
          safetyNotes: ["Use proper chemical handling procedures", "Follow dosage instructions"],
          expectedOutcome: "Chemically treated water samples ready for testing",
          troubleshooting: ["Verify chemical concentrations", "Allow proper reaction time"],
        },
        {
          stepNumber: 4,
          title: "Heat Treatment (Boiling)",
          description: "Test the effectiveness of boiling as a water purification method.",
          materials: ["Virtual boiling apparatus", "Water samples", "Temperature monitoring"],
          safetyNotes: ["Monitor temperature carefully", "Ensure complete boiling process"],
          expectedOutcome: "Boiled water samples for comparison testing",
          troubleshooting: ["Maintain proper boiling temperature", "Time the process accurately"],
        },
        {
          stepNumber: 5,
          title: "Comparative Analysis",
          description: "Test all treated water samples and compare effectiveness of different methods.",
          materials: ["All treated samples", "Testing equipment", "Data analysis tools"],
          safetyNotes: ["Test all samples systematically", "Record detailed observations"],
          expectedOutcome: "Complete comparative data on all purification methods",
          troubleshooting: ["Ensure consistent testing procedures", "Verify all measurements"],
        },
        {
          stepNumber: 6,
          title: "Results Analysis and Conclusions",
          description: "Analyze results, draw conclusions, and connect findings to real-world applications in Kenya.",
          materials: ["Data analysis tools", "Presentation materials", "Research resources"],
          safetyNotes: ["Consider all evidence", "Connect to learning objectives"],
          expectedOutcome: "Valid conclusions about water purification effectiveness",
          troubleshooting: ["Review all data for accuracy", "Consider local context and applications"],
        },
      ],
      assessmentCriteria: [
        "Demonstrates understanding of water purification concepts",
        "Follows experimental procedures accurately and safely",
        "Records observations and data systematically",
        "Analyzes and compares different purification methods effectively",
        "Draws valid conclusions supported by evidence",
        "Connects findings to real-world applications in Kenya",
        "Shows understanding of public health implications",
      ],
      extensions: [
        "Research traditional water purification methods used in Kenya",
        "Design an improved water purification system for rural communities",
        "Investigate the cost-effectiveness of different methods",
        "Create a presentation for community water education",
        "Explore advanced purification technologies like UV treatment",
      ],
      realWorldApplications: [
        "Community water treatment in rural Kenya",
        "Household water purification methods",
        "Emergency water treatment during disasters",
        "Industrial water treatment processes",
        "Environmental conservation and water resource management",
      ],
    }

    setGeneratedExperiment(experiment)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg text-white">
            <Droplets className="h-8 w-8" />
          </div>
          Create Your First AI Experiment
        </h1>
        <p className="text-gray-600 text-lg">Let's create a "Water Purification Methods" experiment together!</p>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Experiment Creation Progress
          </CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : index === currentStep
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                {index < steps.length - 1 && <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />}
              </div>
            ))}
          </div>
          {isCreating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm">AI is processing...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={generatedExperiment ? "experiment" : "creation"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="creation">Step-by-Step Creation</TabsTrigger>
          <TabsTrigger value="experiment" disabled={!generatedExperiment}>
            Generated Experiment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="creation" className="space-y-6">
          {/* Current Step Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStep === 0 && <Lightbulb className="h-5 w-5" />}
                {currentStep === 1 && <Target className="h-5 w-5" />}
                {currentStep === 2 && <BookOpen className="h-5 w-5" />}
                {currentStep === 3 && <Beaker className="h-5 w-5" />}
                {currentStep === 4 && <Sparkles className="h-5 w-5" />}
                {steps[currentStep]?.title}
              </CardTitle>
              <CardDescription>{steps[currentStep]?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {steps[currentStep]?.data && (
                <div className="space-y-4">
                  {/* Step 1: Topic Selection */}
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Selected Topic:</h4>
                        <p className="text-lg font-medium text-blue-800">{steps[currentStep].data.topic}</p>
                        <p className="text-sm text-blue-600 mt-2">{steps[currentStep].data.relevance}</p>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>
                          Perfect choice! This topic aligns with CBC curriculum and addresses real Kenyan challenges.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Parameters */}
                  {currentStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Grade Level:</span>
                          <Badge variant="outline" className="ml-2">
                            {steps[currentStep].data.gradeLevel}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Difficulty:</span>
                          <Badge variant="secondary" className="ml-2">
                            {steps[currentStep].data.difficulty}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span>
                          <Badge variant="outline" className="ml-2">
                            {steps[currentStep].data.timeConstraints}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">CBC Strand:</span>
                          <Badge className="ml-2">{steps[currentStep].data.cbcStrand}</Badge>
                        </div>
                        <div>
                          <span className="font-medium">Sub-Strand:</span>
                          <Badge variant="secondary" className="ml-2">
                            {steps[currentStep].data.cbcSubStrand}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Learning Objectives */}
                  {currentStep === 2 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">AI-Generated Learning Objectives:</h4>
                      <ul className="space-y-2">
                        {steps[currentStep].data.objectives.map((objective: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Step 4: Materials */}
                  {currentStep === 3 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Virtual Lab Materials:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {steps[currentStep].data.materials.map((material: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Beaker className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{material}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 5: AI Generation */}
                  {currentStep === 4 && (
                    <div className="text-center space-y-4">
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                        <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold mb-2">Ready to Generate Your Experiment!</h4>
                        <p className="text-gray-600 mb-4">
                          AI will now create a complete, CBC-aligned experiment with safety protocols, step-by-step
                          procedures, and assessment criteria.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
                  Previous Step
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button onClick={nextStep} disabled={isCreating}>
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => simulateStepCompletion(currentStep)}
                    disabled={isCreating || steps[currentStep].completed}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isCreating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : steps[currentStep].completed ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Generated!
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Generate Experiment
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiment" className="space-y-6">
          {generatedExperiment && (
            <div className="space-y-6">
              {/* Experiment Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    {generatedExperiment.title}
                  </CardTitle>
                  <CardDescription>{generatedExperiment.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Learning Objectives</h4>
                      <ul className="space-y-1">
                        {generatedExperiment.learningObjectives.map((objective: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">CBC Alignment</h4>
                      <div className="space-y-2">
                        <Badge variant="outline">{generatedExperiment.cbcAlignment.strand}</Badge>
                        <Badge variant="secondary">{generatedExperiment.cbcAlignment.subStrand}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Materials and Safety */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TestTube className="h-5 w-5" />
                      Virtual Materials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {generatedExperiment.materials.map((material: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-sm">{material}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Safety Protocols
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {generatedExperiment.safetyPrecautions.map((precaution: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Experimental Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Experimental Procedure (6 Steps)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {generatedExperiment.steps.map((step: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                              {step.stepNumber}
                            </div>
                            <h4 className="font-semibold">{step.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{step.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <h5 className="font-medium mb-1">Materials Needed:</h5>
                              <ul className="space-y-1">
                                {step.materials.map((material: string, idx: number) => (
                                  <li key={idx}>• {material}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium mb-1">Expected Outcome:</h5>
                              <p className="text-gray-600">{step.expectedOutcome}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Real-World Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Real-World Applications in Kenya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedExperiment.realWorldApplications.map((application: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                        <Globe className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{application}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Success Message */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Experiment Successfully Created!</h3>
                    <p className="text-green-700 mb-4">
                      Your AI-designed "Water Purification Methods" experiment is ready for use. It's fully aligned with
                      CBC curriculum and includes safety protocols, step-by-step guidance, and real-world applications
                      relevant to Kenya.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Link href="/virtual-lab/water-purification-experiment">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Play className="h-4 w-4 mr-2" />
                          Start Experiment
                        </Button>
                      </Link>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Customize Further
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
