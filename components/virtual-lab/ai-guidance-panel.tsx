"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bot, Send, Lightbulb, Target, MessageCircle, Loader2 } from "lucide-react"

interface StudentProgress {
  completedSteps: number[]
  currentObservations: string[]
  challenges: string[]
}

interface AIGuidancePanelProps {
  experimentType: string
  gradeLevel: string
  currentStep: number
  studentProgress: StudentProgress
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export function AIGuidancePanel({ experimentType, gradeLevel, currentStep, studentProgress }: AIGuidancePanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [aiContext, setAiContext] = useState<any>({})

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      type: "ai",
      content: `Hello! I'm your AI lab assistant for ${experimentType}. I'm here to help you understand animal nutrition and digestion. Feel free to ask me anything about the experiment!`,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [experimentType])

  // Update AI context when student progress changes
  useEffect(() => {
    setAiContext({
      experimentType,
      gradeLevel,
      currentStep,
      studentProgress,
      timestamp: new Date().toISOString(),
    })
  }, [experimentType, gradeLevel, currentStep, studentProgress])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/virtual-lab/nutrition-digestion-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          context: aiContext,
        }),
      })

      const data = await response.json()

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.response || "I'm here to help! Could you rephrase your question?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I'm having trouble connecting right now, but I'm still here to help! Try asking about nutrition modes, dentition, or the digestion process.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestedQuestions = [
    "What's the difference between holozoic and parasitic nutrition?",
    "Why do carnivores have sharp teeth?",
    "How does the digestive animation work?",
    "What happens in the stomach during digestion?",
    "Can you explain symbiotic nutrition with examples?",
  ]

  const askSuggestedQuestion = (question: string) => {
    setInputMessage(question)
  }

  return (
    <Card className="h-full max-h-[800px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-blue-600" />
          AI Lab Assistant
        </CardTitle>
        <CardDescription className="text-sm">
          {experimentType} • {gradeLevel}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Progress Overview</span>
          </div>
          <div className="text-xs text-gray-600">
            <p>Completed sections: {studentProgress.completedSteps.length}/4</p>
            <p>Current step: {currentStep + 1}</p>
          </div>
        </div>

        <Separator />

        {/* Current Observations */}
        {studentProgress.currentObservations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Current Focus</span>
            </div>
            <div className="space-y-1">
              {studentProgress.currentObservations.slice(0, 3).map((observation, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {observation}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Ask Me Anything</span>
          </div>

          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-2 rounded-lg text-xs ${
                      message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800 border"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 border p-2 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="mt-2 space-y-2">
              <p className="text-xs text-gray-600">Try asking:</p>
              <div className="space-y-1">
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto p-2 text-left justify-start"
                    onClick={() => askSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="mt-3 flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about nutrition, teeth, or digestion..."
              className="text-xs resize-none"
              rows={2}
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={!inputMessage.trim() || isLoading} size="sm">
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
