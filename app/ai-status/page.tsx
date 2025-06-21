"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DiagnosticResult {
  success: boolean
  diagnostics: any
  health: {
    status: string
    score: number
    summary: string
  }
  recommendations: string[]
}

export default function AIStatusPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai/diagnostic/comprehensive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      setDiagnostics(data)
      setLastChecked(new Date())
    } catch (error) {
      console.error("Diagnostic failed:", error)
      setDiagnostics({
        success: false,
        diagnostics: null,
        health: { status: "error", score: 0, summary: "Failed to run diagnostics" },
        recommendations: ["Check network connection", "Verify API endpoints"],
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500"
      case "healthy":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "degraded":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✅"
      case "healthy":
        return "🟢"
      case "error":
        return "❌"
      case "degraded":
        return "🟡"
      default:
        return "⚪"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI System Status</h1>
            <p className="text-gray-600 mt-2">Monitor and diagnose AI model connectivity</p>
          </div>
          <div className="flex items-center gap-4">
            {lastChecked && (
              <span className="text-sm text-gray-500">Last checked: {lastChecked.toLocaleTimeString()}</span>
            )}
            <Button onClick={runDiagnostics} disabled={loading}>
              {loading ? "🔄 Testing..." : "🔍 Run Diagnostics"}
            </Button>
          </div>
        </div>

        {diagnostics && (
          <div className="space-y-6">
            {/* Overall Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getStatusIcon(diagnostics.health.status)}</span>
                  Overall System Health
                  <Badge className={getStatusColor(diagnostics.health.status)}>
                    {diagnostics.health.score}% Operational
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{diagnostics.health.summary}</p>
              </CardContent>
            </Card>

            {/* AI Providers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🤖 OpenAI
                    <Badge className={getStatusColor(diagnostics.diagnostics.tests.openai.status)}>
                      {diagnostics.diagnostics.tests.openai.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Status:</strong> {getStatusIcon(diagnostics.diagnostics.tests.openai.status)}{" "}
                      {diagnostics.diagnostics.tests.openai.status}
                    </p>
                    {diagnostics.diagnostics.tests.openai.response && (
                      <p>
                        <strong>Response:</strong> {diagnostics.diagnostics.tests.openai.response}
                      </p>
                    )}
                    {diagnostics.diagnostics.tests.openai.error && (
                      <p className="text-red-600">
                        <strong>Error:</strong> {diagnostics.diagnostics.tests.openai.error}
                      </p>
                    )}
                    <p>
                      <strong>API Key:</strong>{" "}
                      {diagnostics.diagnostics.environment.openai_configured ? "✅ Configured" : "❌ Missing"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ⚡ Groq
                    <Badge className={getStatusColor(diagnostics.diagnostics.tests.groq.status)}>
                      {diagnostics.diagnostics.tests.groq.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Status:</strong> {getStatusIcon(diagnostics.diagnostics.tests.groq.status)}{" "}
                      {diagnostics.diagnostics.tests.groq.status}
                    </p>
                    {diagnostics.diagnostics.tests.groq.response && (
                      <p>
                        <strong>Response:</strong> {diagnostics.diagnostics.tests.groq.response}
                      </p>
                    )}
                    {diagnostics.diagnostics.tests.groq.error && (
                      <p className="text-red-600">
                        <strong>Error:</strong> {diagnostics.diagnostics.tests.groq.error}
                      </p>
                    )}
                    <p>
                      <strong>API Key:</strong>{" "}
                      {diagnostics.diagnostics.environment.groq_configured ? "✅ Configured" : "❌ Missing"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Agents */}
            <Card>
              <CardHeader>
                <CardTitle>🧠 AI Agents Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {diagnostics.diagnostics.tests.agents.map((agent: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getStatusIcon(agent.status)}</span>
                        <span className="font-medium">{agent.endpoint.split("/").pop()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{agent.endpoint}</p>
                      {agent.error && <p className="text-sm text-red-600 mt-1">{agent.error}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {diagnostics.recommendations.map((rec, index) => (
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="font-medium">Node Environment</p>
                    <p className="text-sm text-gray-600">{diagnostics.diagnostics.environment.node_env}</p>
                  </div>
                  <div>
                    <p className="font-medium">Vercel Environment</p>
                    <p className="text-sm text-gray-600">{diagnostics.diagnostics.environment.vercel_env || "Local"}</p>
                  </div>
                  <div>
                    <p className="font-medium">OpenAI Configured</p>
                    <p className="text-sm text-gray-600">
                      {diagnostics.diagnostics.environment.openai_configured ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Groq Configured</p>
                    <p className="text-sm text-gray-600">
                      {diagnostics.diagnostics.environment.groq_configured ? "Yes" : "No"}
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
              <p className="text-gray-600">Running comprehensive AI diagnostics...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
