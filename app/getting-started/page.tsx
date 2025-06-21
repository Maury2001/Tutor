"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Play, BookOpen, Brain, Microscope, Users, ArrowRight, Star, Target } from "lucide-react"
import { useState, useEffect } from "react"

export default function GettingStartedPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    // Load completed steps from localStorage or API
    const saved = localStorage.getItem(`getting-started-${user?.id}`)
    if (saved) {
      setCompletedSteps(JSON.parse(saved))
    }
  }, [user])

  const saveProgress = (steps: number[]) => {
    setCompletedSteps(steps)
    if (user) {
      localStorage.setItem(`getting-started-${user.id}`, JSON.stringify(steps))
    }
  }

  const steps = [
    {
      id: 1,
      title: "Welcome to CBC TutorBot",
      description: "Your account has been created successfully",
      action: "Get Started",
      completed: true,
      autoComplete: true,
    },
    {
      id: 2,
      title: "Complete Your Profile",
      description: "Add your grade level and learning preferences",
      action: "Update Profile",
      href: "/profile",
      completed: false,
      checkCompletion: () => user?.gradeLevel && user?.county,
    },
    {
      id: 3,
      title: "Try the AI Tutor",
      description: "Ask your first question to our CBC curriculum tutor",
      action: "Start Chatting",
      href: "/tutor/cbc",
      completed: false,
      feature: "ai-tutor",
    },
    {
      id: 4,
      title: "Explore Virtual Lab",
      description: "Experience your first interactive science experiment",
      action: "Enter Lab",
      href: "/virtual-lab",
      completed: false,
      feature: "virtual-lab",
    },
    {
      id: 5,
      title: "Practice Mathematics",
      description: "Try our interactive math practice exercises",
      action: "Start Practice",
      href: "/math-practice",
      completed: false,
      feature: "math-practice",
    },
    {
      id: 6,
      title: "Check Your Progress",
      description: "View your learning statistics and achievements",
      action: "View Stats",
      href: "/learning-stats",
      completed: false,
      feature: "progress-tracking",
    },
  ]

  useEffect(() => {
    // Auto-complete certain steps based on user data
    const newCompleted = [...completedSteps]
    let updated = false

    steps.forEach((step) => {
      if (step.checkCompletion && step.checkCompletion() && !newCompleted.includes(step.id)) {
        newCompleted.push(step.id)
        updated = true
      }
      if (step.autoComplete && !newCompleted.includes(step.id)) {
        newCompleted.push(step.id)
        updated = true
      }
    })

    if (updated) {
      saveProgress(newCompleted)
    }
  }, [user])

  const handleStepAction = (step: any) => {
    if (step.href) {
      // Mark step as completed when user clicks
      if (!completedSteps.includes(step.id)) {
        const newCompleted = [...completedSteps, step.id]
        saveProgress(newCompleted)
      }
      router.push(step.href)
    }
  }

  const markStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      const newCompleted = [...completedSteps, stepId]
      saveProgress(newCompleted)
    }
  }

  const completionPercentage = (completedSteps.length / steps.length) * 100
  const nextStep = steps.find((step) => !completedSteps.includes(step.id))

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Please log in to access the getting started guide.</p>
          <Button onClick={() => router.push("/auth/signin")} className="mt-4">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Getting Started</h1>
            <p className="text-gray-600">Welcome to your CBC learning journey, {user.name}!</p>
          </div>
          <Badge className={completionPercentage === 100 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
            {Math.round(completionPercentage)}% Complete
          </Badge>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Progress</span>
              <span className="text-sm font-normal text-gray-600">
                {completedSteps.length} of {steps.length} steps completed
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            {completionPercentage === 100 ? (
              <div className="text-center">
                <p className="text-green-600 font-medium">
                  🎉 Congratulations! You've completed the getting started guide!
                </p>
                <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {nextStep
                  ? `Next: ${nextStep.title}`
                  : "Great progress! Complete the remaining steps to unlock the full potential of CBC TutorBot."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Getting Started Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = step.id === nextStep?.id

            return (
              <Card
                key={step.id}
                className={`transition-all duration-200 ${
                  isCompleted
                    ? "bg-green-50 border-green-200"
                    : isCurrent
                      ? "border-blue-300 shadow-md ring-2 ring-blue-100"
                      : "hover:shadow-md cursor-pointer"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="font-semibold">{step.id}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                        {step.feature && (
                          <Badge variant="outline" className="mt-1">
                            {step.feature.replace("-", " ")}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isCompleted ? (
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      ) : (
                        <Button onClick={() => handleStepAction(step)} className={isCurrent ? "" : "opacity-75"}>
                          {step.action}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Feature Highlights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-600" />
              Platform Features
            </CardTitle>
            <CardDescription>Discover what makes CBC TutorBot special</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Learning</h3>
                <p className="text-sm text-gray-600">
                  Get personalized help from our AI tutor trained on the CBC curriculum
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Microscope className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Virtual Laboratory</h3>
                <p className="text-sm text-gray-600">
                  Conduct safe, interactive science experiments in our virtual lab
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Progress Tracking</h3>
                <p className="text-sm text-gray-600">
                  Monitor your learning journey with detailed analytics and achievements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="h-5 w-5 mr-2 text-blue-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Jump right into learning with these popular features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push("/tutor/cbc")}
              >
                <Brain className="h-6 w-6 text-blue-600" />
                <span>AI Tutor</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push("/virtual-lab")}
              >
                <Microscope className="h-6 w-6 text-green-600" />
                <span>Virtual Lab</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push("/math-practice")}
              >
                <BookOpen className="h-6 w-6 text-purple-600" />
                <span>Math Practice</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-orange-600" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2">Contact Support</h3>
                <p className="text-sm text-orange-600 mb-3">
                  Our team is here to help you get the most out of CBC TutorBot.
                </p>
                <Button variant="outline" size="sm">
                  Get Help
                </Button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Explore Features</h3>
                <p className="text-sm text-blue-600 mb-3">Take a tour of all the amazing features available to you.</p>
                <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
                  View Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
