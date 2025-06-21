"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  MessageSquare,
  Target,
  Star,
  TrendingUp,
  Book,
  HelpCircle,
  RefreshCw,
  Trophy,
  Loader2,
} from "lucide-react"

interface LearningSession {
  id: string
  studentId: string
  curriculum: {
    grade: string
    learningArea: string
    strand: string
    subStrand: string
  }
  mode: "revision" | "guided" | "mastery"
  startTime: Date
  progress: number
  questionsAnswered: number
  correctAnswers: number
  currentDifficulty: number
  adaptations: string[]
  learningObjectives: string[]
  completedObjectives: string[]
}

interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: {
    difficulty?: number
    topic?: string
    isCorrect?: boolean
    adaptationReason?: string
    learningSupport?: string[]
  }
}

interface AdaptiveLearningInterfaceProps {
  session: LearningSession
  onSessionUpdate: (session: LearningSession) => void
  onGenerateQuiz: () => void
  onRequestHelp: (topic: string) => void
}

export function AdaptiveLearningInterface({
  session,
  onSessionUpdate,
  onGenerateQuiz,
  onRequestHelp,
}: AdaptiveLearningInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showQuizMode, setShowQuizMode] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<any>(null)
  const [confidence, setConfidence] = useState<"low" | "medium" | "high">("medium")
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState<string[]>([])

  // Initialize session with AI welcome message
  useEffect(() => {
    const welcomeMessage = generateWelcomeMessage(session)
    setMessages([welcomeMessage])
  }, [session])

  const generateWelcomeMessage = (session: LearningSession): ChatMessage => {
    const modeMessages = {
      revision: `🔄 **Revision Mode Activated!**\n\nI'm here to help you review and strengthen your understanding of **${session.curriculum.subStrand}** in ${session.curriculum.learningArea} for ${session.curriculum.grade.toUpperCase()}.\n\nI'll adapt my teaching style based on how you're doing. Let's start by reviewing what you remember about this topic!`,

      guided: `🎯 **Guided Learning Mode!**\n\nWelcome to your personalized learning journey in **${session.curriculum.subStrand}**! I'll guide you step-by-step through new concepts, making sure you understand each part before moving forward.\n\nI'll adjust the difficulty and teaching approach based on your responses. Ready to explore together?`,

      mastery: `🏆 **Mastery Check Mode!**\n\nTime to demonstrate your knowledge of **${session.curriculum.subStrand}**! I'll assess your understanding through targeted questions and challenges.\n\nDon't worry - this helps me understand your strengths and areas where you might need more support. Let's see what you know!`,
    }

    return {
      id: `welcome_${Date.now()}`,
      role: "system",
      content: modeMessages[session.mode],
      timestamp: new Date(),
      metadata: {
        difficulty: 5,
        topic: session.curriculum.subStrand,
      },
    }
  }

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: currentInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentInput("")
    setIsLoading(true)

    try {
      // Generate AI response with adaptive features
      const response = await generateAdaptiveResponse(userMessage, session, messages)

      setMessages((prev) => [...prev, response])

      // Update session based on response
      updateSessionProgress(response)

      // Check if adaptations are needed
      const adaptations = analyzeAndAdapt(response, session)
      if (adaptations.length > 0) {
        setAdaptiveRecommendations(adaptations)
      }
    } catch (error) {
      console.error("Error generating response:", error)

      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: "assistant",
        content: "I'm having trouble right now. Let me try a different approach to help you learn!",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAdaptiveResponse = async (
    userMessage: ChatMessage,
    session: LearningSession,
    history: ChatMessage[],
  ): Promise<ChatMessage> => {
    // Simulate adaptive AI response generation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Analyze user input for understanding level
    const userInput = userMessage.content.toLowerCase()
    const currentDifficulty = session.currentDifficulty
    const mode = session.mode

    let response = ""
    let newDifficulty = currentDifficulty
    let adaptationReason = ""
    let learningSupport: string[] = []

    // Adaptive logic based on mode and user response
    if (mode === "revision") {
      response = generateRevisionResponse(userInput, session)
      adaptationReason = "Reinforcing previously learned concepts"
      learningSupport = ["Visual aids available", "Practice exercises ready"]
    } else if (mode === "guided") {
      response = generateGuidedResponse(userInput, session, currentDifficulty)

      // Adapt difficulty based on response quality
      if (userInput.length < 10 || userInput.includes("don't know")) {
        newDifficulty = Math.max(1, currentDifficulty - 1)
        adaptationReason = "Reducing complexity to build confidence"
        learningSupport = ["Step-by-step breakdown", "Additional examples", "Encouraging feedback"]
      } else if (userInput.includes("easy") || userInput.includes("understand")) {
        newDifficulty = Math.min(10, currentDifficulty + 1)
        adaptationReason = "Increasing challenge level"
        learningSupport = ["Advanced concepts", "Challenge problems", "Extension activities"]
      }
    } else if (mode === "mastery") {
      response = generateMasteryResponse(userInput, session)
      adaptationReason = "Assessing knowledge and understanding"
      learningSupport = ["Immediate feedback", "Performance tracking", "Skill recommendations"]
    }

    // Update session difficulty if changed
    if (newDifficulty !== currentDifficulty) {
      session.currentDifficulty = newDifficulty
      session.adaptations.push(`Difficulty adjusted from ${currentDifficulty} to ${newDifficulty}: ${adaptationReason}`)
      onSessionUpdate(session)
    }

    return {
      id: `ai_${Date.now()}`,
      role: "assistant",
      content: response,
      timestamp: new Date(),
      metadata: {
        difficulty: newDifficulty,
        topic: session.curriculum.subStrand,
        adaptationReason,
        learningSupport,
      },
    }
  }

  const generateRevisionResponse = (userInput: string, session: LearningSession): string => {
    return `🔄 **Great! Let's review together.**

Based on your response, I can see you're working on understanding **${session.curriculum.subStrand}**. Let me help reinforce these concepts:

**Key Points to Remember:**
• This topic builds on what you've learned before
• Practice helps strengthen your understanding
• Every question helps you learn more!

**Quick Check:** Can you tell me one thing you remember about this topic? 

**Helpful Hint:** ${getTopicHint(session.curriculum.subStrand)}

I'm here to help you feel confident with this material! What would you like to review first?`
  }

  const generateGuidedResponse = (userInput: string, session: LearningSession, difficulty: number): string => {
    const difficultyAdjustment = difficulty <= 3 ? "simple" : difficulty <= 6 ? "moderate" : "advanced"

    return `🎯 **Perfect! Let's learn step by step.**

I can see you're ready to explore **${session.curriculum.subStrand}**. I'll guide you through this at a ${difficultyAdjustment} level.

**Learning Objective:** ${getRandomLearningObjective(session.curriculum.subStrand)}

**Step 1:** Let's start with the basics
${getConceptExplanation(session.curriculum.subStrand, difficulty)}

**Step 2:** Now let's try this together
${getInteractiveActivity(session.curriculum.subStrand, difficulty)}

**Your Turn:** ${getStudentChallenge(session.curriculum.subStrand, difficulty)}

Remember, I'm adapting to how you learn best. If something seems too easy or too hard, just let me know!`
  }

  const generateMasteryResponse = (userInput: string, session: LearningSession): string => {
    const accuracy = session.questionsAnswered > 0 ? (session.correctAnswers / session.questionsAnswered) * 100 : 0

    return `🏆 **Excellent work! Let's check your mastery.**

I can see you're demonstrating understanding of **${session.curriculum.subStrand}**. 

**Current Performance:** ${accuracy.toFixed(0)}% accuracy on ${session.questionsAnswered} questions

**Assessment Challenge:** ${getMasteryQuestion(session.curriculum.subStrand, session.currentDifficulty)}

**Success Criteria:**
✓ Clear understanding of key concepts
✓ Ability to apply knowledge
✓ Confident problem-solving

**Feedback:** ${getPerformanceFeedback(accuracy)}

Ready for the next challenge? Your confidence level helps me choose the right questions for you!`
  }

  // Helper functions for content generation
  const getTopicHint = (topic: string): string => {
    const hints: Record<string, string> = {
      counting: "Remember to count each object once and in order",
      addition: "When adding, think about combining groups together",
      reading: "Sound out each letter and blend them together",
      plants: "Plants need sunlight, water, and air to grow",
      default: "Take your time and think step by step",
    }
    return hints[topic] || hints.default
  }

  const getRandomLearningObjective = (topic: string): string => {
    const objectives: Record<string, string[]> = {
      counting: ["Count objects from 1 to 20", "Understand one-to-one correspondence"],
      addition: ["Add numbers up to 10", "Understand addition as combining groups"],
      reading: ["Recognize sight words", "Use phonics to decode new words"],
      default: ["Understand the key concepts", "Apply knowledge in practice"],
    }
    const topicObjectives = objectives[topic] || objectives.default
    return topicObjectives[Math.floor(Math.random() * topicObjectives.length)]
  }

  const getConceptExplanation = (topic: string, difficulty: number): string => {
    if (difficulty <= 3) {
      return "Let's start with something simple and build up your understanding."
    } else if (difficulty <= 6) {
      return "Now that you have the basics, let's explore this concept more deeply."
    } else {
      return "You're ready for advanced concepts. Let's challenge your thinking!"
    }
  }

  const getInteractiveActivity = (topic: string, difficulty: number): string => {
    return `Try this activity: ${getActivityForTopic(topic, difficulty)}`
  }

  const getStudentChallenge = (topic: string, difficulty: number): string => {
    return `Can you solve this problem: ${getChallengeForTopic(topic, difficulty)}?`
  }

  const getMasteryQuestion = (topic: string, difficulty: number): string => {
    const questions: Record<string, string[]> = {
      counting: ["Count these objects and tell me how many there are", "Show me how you count to 10"],
      addition: ["What is 3 + 4?", "If you have 2 apples and get 3 more, how many do you have?"],
      reading: ["Read this word: 'cat'", "What sound does the letter 'b' make?"],
      default: ["Show me what you know about this topic"],
    }
    const topicQuestions = questions[topic] || questions.default
    return topicQuestions[Math.floor(Math.random() * topicQuestions.length)]
  }

  const getActivityForTopic = (topic: string, difficulty: number): string => {
    const activities: Record<string, string> = {
      counting: "Count the objects in the picture",
      addition: "Use blocks to add these numbers",
      reading: "Point to the words as you read",
      default: "Practice with this example",
    }
    return activities[topic] || activities.default
  }

  const getChallengeForTopic = (topic: string, difficulty: number): string => {
    const challenges: Record<string, string> = {
      counting: `Count from 1 to ${Math.min(10 + difficulty, 20)}`,
      addition: `What is ${difficulty} + ${difficulty + 1}`,
      reading: "Read this simple sentence aloud",
      default: "Apply what you've learned to this new situation",
    }
    return challenges[topic] || challenges.default
  }

  const getPerformanceFeedback = (accuracy: number): string => {
    if (accuracy >= 80) {
      return "Excellent! You're showing strong mastery of this topic."
    } else if (accuracy >= 60) {
      return "Good work! You're making solid progress."
    } else if (accuracy >= 40) {
      return "You're learning! Let's practice a bit more together."
    } else {
      return "No worries! Learning takes time. Let's go step by step."
    }
  }

  const updateSessionProgress = (response: ChatMessage) => {
    const updatedSession = { ...session }
    updatedSession.questionsAnswered += 1
    updatedSession.progress = Math.min(100, updatedSession.progress + 10)

    // Update learning objectives completion based on response
    if (response.metadata?.topic && !updatedSession.completedObjectives.includes(response.metadata.topic)) {
      updatedSession.completedObjectives.push(response.metadata.topic)
    }

    onSessionUpdate(updatedSession)
  }

  const analyzeAndAdapt = (response: ChatMessage, session: LearningSession): string[] => {
    const adaptations: string[] = []

    if (session.questionsAnswered > 5 && session.correctAnswers / session.questionsAnswered < 0.5) {
      adaptations.push("Consider reviewing basic concepts")
      adaptations.push("Use more visual aids and examples")
    }

    if (session.currentDifficulty > 7 && session.mode === "guided") {
      adaptations.push("Break down complex concepts into smaller steps")
    }

    if (session.progress > 70 && session.mode === "revision") {
      adaptations.push("Ready for mastery check assessment")
    }

    return adaptations
  }

  const getModeIcon = (mode: string) => {
    const icons = {
      revision: RefreshCw,
      guided: Brain,
      mastery: Trophy,
    }
    return icons[mode as keyof typeof icons] || Brain
  }

  const ModeIcon = getModeIcon(session.mode)

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ModeIcon className="h-5 w-5" />
            {session.mode.charAt(0).toUpperCase() + session.mode.slice(1)} Learning Session
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline">{session.curriculum.grade.toUpperCase()}</Badge>
            <span>{session.curriculum.learningArea}</span>
            <span>•</span>
            <span>{session.curriculum.subStrand}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Progress</div>
              <Progress value={session.progress} className="h-2" />
              <div className="text-xs text-muted-foreground">{session.progress}% complete</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Questions</div>
              <div className="text-lg font-bold">{session.questionsAnswered}</div>
              <div className="text-xs text-muted-foreground">answered</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Accuracy</div>
              <div className="text-lg font-bold">
                {session.questionsAnswered > 0
                  ? Math.round((session.correctAnswers / session.questionsAnswered) * 100)
                  : 0}
                %
              </div>
              <div className="text-xs text-muted-foreground">correct</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Difficulty</div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i < session.currentDifficulty ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">Level {session.currentDifficulty}/10</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adaptive Recommendations */}
      {adaptiveRecommendations.length > 0 && (
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-medium">AI Recommendations:</div>
              <ul className="list-disc pl-4 space-y-1">
                {adaptiveRecommendations.map((rec, index) => (
                  <li key={index} className="text-sm">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Learning Assistant
            <Badge variant="secondary" className="ml-auto">
              Adaptive Learning Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 mb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.role === "system"
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-2 flex items-center gap-2">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.metadata?.difficulty && (
                      <Badge variant="outline" className="text-xs">
                        Level {message.metadata.difficulty}
                      </Badge>
                    )}
                    {message.metadata?.adaptationReason && (
                      <Badge variant="secondary" className="text-xs">
                        {message.metadata.adaptationReason}
                      </Badge>
                    )}
                  </div>
                  {message.metadata?.learningSupport && (
                    <div className="mt-2 text-xs">
                      <div className="font-medium">Learning Support:</div>
                      <ul className="list-disc pl-4">
                        {message.metadata.learningSupport.map((support, index) => (
                          <li key={index}>{support}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>AI is thinking and adapting...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="space-y-3">
            {/* Confidence Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">How confident do you feel?</span>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((level) => (
                  <Button
                    key={level}
                    variant={confidence === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfidence(level)}
                  >
                    {level === "low" && "😟"}
                    {level === "medium" && "😐"}
                    {level === "high" && "😊"}
                    <span className="ml-1 capitalize">{level}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your response or ask a question..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                disabled={isLoading}
                className="min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button onClick={handleSendMessage} disabled={!currentInput.trim() || isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                </Button>
                <Button variant="outline" size="sm" onClick={onGenerateQuiz}>
                  <Target className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => onRequestHelp(session.curriculum.subStrand)}>
              <HelpCircle className="h-4 w-4 mr-1" />
              Need Help
            </Button>
            <Button variant="outline" size="sm" onClick={onGenerateQuiz}>
              <Target className="h-4 w-4 mr-1" />
              Take Quiz
            </Button>
            <Button variant="outline" size="sm">
              <Book className="h-4 w-4 mr-1" />
              Study Notes
            </Button>
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-1" />
              Save Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
