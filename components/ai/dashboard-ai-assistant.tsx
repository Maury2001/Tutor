"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, Send, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

// Add imports for model selection
import { ModelSelector } from "@/components/ai/model-selector"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: {
    modelUsed?: string
    modelInfo?: any
    fallbackUsed?: boolean
  }
}

export function DashboardAIAssistant() {
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your TutorBot AI assistant. How can I help you with your learning today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Add state for model selection
  const [selectedModel, setSelectedModel] = useState<string>("llama3-70b-8192")
  const [modelPreferences, setModelPreferences] = useState({
    temperature: 0.7,
    maxTokens: 800,
    fallbackStrategy: "balanced",
    autoFallback: true,
    showModelInfo: true,
  })
  const [showModelSelector, setShowModelSelector] = useState(false)

  const handleRetry = async () => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1)
      // Re-submit the last user message
      const lastUserMessage = messages.filter((m) => m.role === "user").pop()
      if (lastUserMessage) {
        setPrompt(lastUserMessage.content)
        // The form submission will handle the retry
      }
    }
  }

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Update the handleSubmit function to include model selection
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: prompt,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentPrompt = prompt
    setPrompt("")
    setIsLoading(true)

    try {
      // Call the real AI API with model selection
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          userContext: "Dashboard user",
          selectedModel: selectedModel,
          preferences: modelPreferences,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        metadata: {
          modelUsed: data.modelUsed,
          modelInfo: data.modelInfo,
          fallbackUsed: data.fallbackUsed,
        },
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error calling AI API:", error)

      // Fallback message on error
      const errorMessage: Message = {
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble responding right now. Please try again in a moment. In the meantime, you can explore the learning materials or practice exercises available in your dashboard.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border shadow-md">
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-md">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-md">TutorBot AI Assistant</CardTitle>
        </div>
        {/* Add settings button to the header */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowModelSelector(!showModelSelector)}
            title="AI Model Settings"
          >
            ⚙️
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <>
          <CardContent className={cn("p-0 transition-all", isExpanded ? "max-h-80" : "max-h-0")}>
            <div className="p-4 h-64 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn("mb-4 flex", message.role === "assistant" ? "justify-start" : "justify-end")}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/tutorbot-logo.png" alt="TutorBot AI" />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                        TB
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "px-4 py-2 rounded-lg max-w-[80%]",
                      message.role === "assistant"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {/* Update message display to show model info */}
                    {modelPreferences.showModelInfo && message.metadata?.modelInfo && (
                      <div className="mt-1 p-1 bg-gray-50 rounded text-xs border">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">🤖 {message.metadata.modelInfo.name}</span>
                          {message.metadata.fallbackUsed && <span className="text-orange-600">(fallback)</span>}
                        </div>
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder="Describe what you need help with..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="sm" disabled={isLoading || !prompt.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </>
      )}
      {/* Add model selector after the expanded content */}
      {showModelSelector && isExpanded && (
        <div className="border-t">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            preferences={modelPreferences}
            onPreferencesChange={setModelPreferences}
            className="border-0 shadow-none"
          />
        </div>
      )}
    </Card>
  )
}
