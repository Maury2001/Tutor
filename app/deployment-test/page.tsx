"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Server, Database, Zap } from "lucide-react"

interface TestResult {
  success: boolean
  message: string
  data?: any
  error?: string
}

export default function DeploymentTestPage() {
  const [testResults, setTestResults] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastTest, setLastTest] = useState<string | null>(null)

  const runDeploymentTest = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/deployment-test")
      const result = await response.json()
      setTestResults(result)
      setLastTest(new Date().toISOString())
    } catch (error) {
      setTestResults({
        success: false,
        message: "Failed to run deployment test",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  const testPostEndpoint = async () => {
    try {
      const response = await fetch("/api/deployment-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "POST functionality", timestamp: new Date().toISOString() }),
      })
      const result = await response.json()
      console.log("POST test result:", result)
    } catch (error) {
      console.error("POST test failed:", error)
    }
  }

  useEffect(() => {
    // Auto-run test on page load
    runDeploymentTest()
  }, [])

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (status: boolean, label: string) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {label}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Server className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Deployment Test Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600">Comprehensive testing of the CBC Tutorbot Platform deployment</p>
          {lastTest && <p className="text-sm text-gray-500">Last tested: {new Date(lastTest).toLocaleString()}</p>}
        </div>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Test Controls
            </CardTitle>
            <CardDescription>Run comprehensive deployment tests to verify system functionality</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button onClick={runDeploymentTest} disabled={loading} className="flex items-center gap-2">
              {loading ? <Clock className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              {loading ? "Running Tests..." : "Run Deployment Test"}
            </Button>
            <Button onClick={testPostEndpoint} variant="outline" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Test POST Endpoint
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overall Status */}
            <Card
              className={`border-2 ${testResults.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(testResults.success)}
                  Overall Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-lg font-semibold ${testResults.success ? "text-green-700" : "text-red-700"}`}>
                  {testResults.message}
                </p>
                {testResults.data?.timestamp && (
                  <p className="text-sm text-gray-600 mt-2">{new Date(testResults.data.timestamp).toLocaleString()}</p>
                )}
              </CardContent>
            </Card>

            {/* Environment Info */}
            {testResults.data && (
              <Card>
                <CardHeader>
                  <CardTitle>Environment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Environment:</span>
                    <Badge>{testResults.data.environment}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Node Version:</span>
                    <Badge variant="outline">{testResults.data.nodeVersion}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform:</span>
                    <Badge variant="outline">{testResults.data.platform}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Core Tests */}
            {testResults.data?.tests && (
              <Card>
                <CardHeader>
                  <CardTitle>Core Functionality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(testResults.data.tests).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="capitalize">{key}:</span>
                      {getStatusBadge(value as boolean, value ? "Working" : "Failed")}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Integration Status */}
            {testResults.data?.integrations && (
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(testResults.data.integrations).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="capitalize">{key}:</span>
                      {getStatusBadge(value as boolean, value ? "Configured" : "Missing")}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Performance Metrics */}
            {testResults.data?.performance && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <Badge variant="outline">{Math.round(testResults.data.performance.uptime)}s</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory (RSS):</span>
                    <Badge variant="outline">
                      {Math.round(testResults.data.performance.memoryUsage.rss / 1024 / 1024)}MB
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Heap Used:</span>
                    <Badge variant="outline">
                      {Math.round(testResults.data.performance.memoryUsage.heapUsed / 1024 / 1024)}MB
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Deployment Info */}
            {testResults.data?.deployment && (
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(testResults.data.deployment).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                      <Badge variant="outline">{value as string}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Error Display */}
        {testResults && !testResults.success && testResults.error && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Error Details</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-red-600 whitespace-pre-wrap">{testResults.error}</pre>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-green-600">✅ If all tests pass:</h4>
              <p className="text-sm text-gray-600">
                Your deployment is successful! The package-lock.json fix worked correctly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-red-600">❌ If tests fail:</h4>
              <p className="text-sm text-gray-600">
                Check the error details above and verify your environment variables and dependencies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600">🔧 Next Steps:</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Configure missing integrations (Supabase, OpenAI, etc.)</li>
                <li>Set up environment variables</li>
                <li>Test individual features and pages</li>
                <li>Monitor performance and logs</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
