"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TestResults {
  success: boolean
  results: {
    timestamp: string
    environment: {
      openai_key: boolean
      groq_key: boolean
      node_env: string
    }
    tests: {
      openai: { status: string; response: string | null; error: string | null }
      groq: { status: string; response: string | null; error: string | null }
      fallback: { status: string; response: string | null; error: string | null }
    }
  }
  summary: {
    working_services: number
    total_services: number
    health_percentage: number
    status: string
    recommendations: string[]
  }
}

export default function AITestPage() {
  const [results, setResults] = useState<TestResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [chatTest, setChatTest] = useState("")
  const [chatResponse, setChatResponse] = useState("")
  const [chatLoading, setChatLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-ai-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testType: "comprehensive" }),
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Test failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const testChat = async () => {
    if (!chatTest.trim()) return

    setChatLoading(true)
    setChatResponse("")

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: chatTest }],
          userContext: "Test user",
        }),
      })
      const data = await response.json()
      setChatResponse(data.message || data.error || "No response received")
    } catch (error) {
      setChatResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setChatLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "not_configured":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✅"
      case "error":
        return "❌"
      case "not_configured":
        return "⚠️"
      default:
        return "⚪"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Models Test Dashboard</h1>
            <p className="text-gray-600 mt-2">Test and diagnose AI model functionality</p>
          </div>
          <Button onClick={runTests} disabled={loading}>
            {loading ? "🔄 Testing..." : "🧪 Run All Tests"}
          </Button>
        </div>

        {/* Live Chat Test */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🤖 Live Chat Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatTest}
                  onChange={(e) => setChatTest(e.target.value)}
                  placeholder="Ask the AI a question..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                  onKeyPress={(e) => e.key === "Enter" && testChat()}
                />
                <Button onClick={testChat} disabled={chatLoading || !chatTest.trim()}>
                  {chatLoading ? "🔄" : "Send"}
                </Button>
              </div>
              {chatResponse && (
                <div className="p-4 bg-gray-100 rounded-lg">
                  <strong>AI Response:</strong>
                  <p className="mt-2 whitespace-pre-wrap">{chatResponse}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-6">
            {/* Overall Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{results.summary.status === "operational" ? "🟢" : "🟡"}</span>
                  System Health: {results.summary.health_percentage}%
                  <Badge className={results.summary.status === "operational" ? "bg-green-500" : "bg-yellow-500"}>
                    {results.summary.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  {results.summary.working_services} of {results.summary.total_services} services operational
                </p>
              </CardContent>
            </Card>

            {/* Individual Service Tests */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🤖 OpenAI
                    <Badge className={getStatusColor(results.results.tests.openai.status)}>
                      {results.results.tests.openai.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Status:</strong> {getStatusIcon(results.results.tests.openai.status)}{" "}
                      {results.results.tests.openai.status}
                    </p>
                    <p>
                      <strong>API Key:</strong>{" "}
                      {results.results.environment.openai_key ? "✅ Configured" : "❌ Missing"}
                    </p>
                    {results.results.tests.openai.response && (
                      <p>
                        <strong>Response:</strong> {results.results.tests.openai.response}
                      </p>
                    )}
                    {results.results.tests.openai.error && (
                      <p className="text-red-600">
                        <strong>Error:</strong> {results.results.tests.openai.error}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ⚡ Groq
                    <Badge className={getStatusColor(results.results.tests.groq.status)}>
                      {results.results.tests.groq.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Status:</strong> {getStatusIcon(results.results.tests.groq.status)}{" "}
                      {results.results.tests.groq.status}
                    </p>
                    <p>
                      <strong>API Key:</strong> {results.results.environment.groq_key ? "✅ Configured" : "❌ Missing"}
                    </p>
                    {results.results.tests.groq.response && (
                      <p>
                        <strong>Response:</strong> {results.results.tests.groq.response}
                      </p>
                    )}
                    {results.results.tests.groq.error && (
                      <p className="text-red-600">
                        <strong>Error:</strong> {results.results.tests.groq.error}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🛡️ Fallback System
                    <Badge className={getStatusColor(results.results.tests.fallback.status)}>
                      {results.results.tests.fallback.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Status:</strong> {getStatusIcon(results.results.tests.fallback.status)}{" "}
                      {results.results.tests.fallback.status}
                    </p>
                    {results.results.tests.fallback.response && (
                      <p>
                        <strong>Response:</strong> {results.results.tests.fallback.response}
                      </p>
                    )}
                    {results.results.tests.fallback.error && (
                      <p className="text-red-600">
                        <strong>Error:</strong> {results.results.tests.fallback.error}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.summary.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Environment Info */}
            <Card>
              <CardHeader>
                <CardTitle>🔧 Environment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium">Node Environment</p>
                    <p className="text-sm text-gray-600">{results.results.environment.node_env}</p>
                  </div>
                  <div>
                    <p className="font-medium">OpenAI API Key</p>
                    <p className="text-sm text-gray-600">
                      {results.results.environment.openai_key ? "✅ Set" : "❌ Missing"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Groq API Key</p>
                    <p className="text-sm text-gray-600">
                      {results.results.environment.groq_key ? "✅ Set" : "❌ Missing"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Testing AI models and services...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
