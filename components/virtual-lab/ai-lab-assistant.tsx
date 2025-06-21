"use client"
import { useState } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
  fallback?: boolean
  error?: string | null
}

interface AILabAssistantProps {
  experimentType?: string
  context?: Record<string, any>
}

export function AILabAssistant({ experimentType, context }: AILabAssistantProps) {
  const [inputMessage, setInputMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    console.log("AI Assistant - Experiment Type:", experimentType)
    console.log("AI Assistant - Context:", context)

    if (!inputMessage.trim()) return

    const userMessage = inputMessage.trim()
    setInputMessage("")
    setIsLoading(true)

    // Add user message to chat
    const newMessages = [...messages, { role: "user", content: userMessage }]
    setMessages(newMessages)

    try {
      const response = await fetch("/api/virtual-lab/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          experimentType: experimentType || "osmosis", // Default to osmosis if not specified
          context: {
            ...context,
            currentExperiment: experimentType,
            labType: "virtual-lab",
            subject: "biology",
          },
        }),
      })

      // Check if response is ok and content-type is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()

      // Handle both successful and fallback responses
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "I'm here to help with your experiment!",
          fallback: data.fallback || false,
          error: data.error || null,
        },
      ])

      // Show a subtle indicator if using fallback
      if (data.fallback) {
        console.log("AI Assistant using fallback response")
      }
    } catch (error) {
      console.error("Failed to send message:", error)

      // Provide experiment-specific fallback message with correct context
      const fallbackMessages = {
        osmosis:
          "Great question about osmosis! Watch how water moves across cell membranes from areas of low to high solute concentration. What changes do you observe in the cell size?",
        ecosystem:
          "Great question about ecosystems! Think about how different organisms interact with each other and their environment. What relationships do you notice?",
        microscopy:
          "Excellent microscopy question! Remember to start with low magnification and work your way up. What structures can you observe in your specimen?",
        digestion:
          "Good thinking about digestion! Follow the food's journey through the digestive system. What processes are happening at each stage?",
        default:
          "I'm having connection issues, but keep exploring! Use your observation skills and think about what you're seeing in the experiment.",
      }

      // Ensure we use the correct experiment type for fallback
      const currentExperimentType =
        experimentType === "digestion"
          ? "digestion"
          : experimentType === "ecosystem"
            ? "ecosystem"
            : experimentType === "microscopy"
              ? "microscopy"
              : "osmosis"

      const fallbackMessage = fallbackMessages[currentExperimentType] || fallbackMessages.default

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallbackMessage,
          fallback: true,
          error: "connection_error",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="mb-2">🧪 Lab Assistant Ready</div>
            <p className="text-sm">Ask me anything about your experiment!</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] p-3 rounded-lg shadow-sm ${
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : message.fallback
                    ? "bg-amber-50 border border-amber-200 text-amber-900 rounded-bl-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
              }`}
            >
              {message.fallback && (
                <div className="text-xs text-amber-600 mb-2 flex items-center gap-1">⚡ Smart Assistant Mode</div>
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
              {message.error && (
                <div className="text-xs text-gray-500 mt-1 opacity-75">Using built-in guidance system</div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-sm shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                Analyzing your question...
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex rounded-md shadow-sm">
          <input
            type="text"
            className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300"
            placeholder="Ask me anything about the lab..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
