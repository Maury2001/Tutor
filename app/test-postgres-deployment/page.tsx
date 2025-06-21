"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertTriangle, Database, Code, Server, Zap, RefreshCw, FileCheck } from "lucide-react"

interface TestResult {
  success: boolean
  message: string
  summary?: any
  results?: any
  postgresRewrite?: any
  error?: string
}

export default function TestPostgresDeploymentPage() {
  const [testResults, setTestResults] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastTest, setLastTest] = useState<string | null>(null)

  const runDeploymentTest = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-deployment")
      const result = await response.json()
      setTestResults(result)
      setLastTest(new Date().toISOString())
    } catch (error) {
      setTestResults({
        success: false,
        message: "Failed to run deployment test",
        error: error instanceof Error ? error.message : "Unknown error",
        postgresRewrite: {
          status: "❌ TEST FAILED",
          message: "Unable to test postgres.ts due to network error",
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const testPostEndpoint = async () => {
    try {
      const response = await fetch("/api/test-deployment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test: "postgres.ts POST test",
          timestamp: new Date().toISOString(),
          purpose: "Testing database module imports in POST request",
        }),
      })
      const result = await response.json()
      console.log("POST test result:", result)

      // Update test results to show POST test status
      if (testResults) {
        setTestResults({
          ...testResults,
          postgresRewrite: {
            ...testResults.postgresRewrite,
            postTest: result.databaseTest?.status || "❌ POST test failed",
          },
        })
      }
    } catch (error) {
      console.error("POST test failed:", error)
    }
  }

  useEffect(() => {
    // Auto-run test on page load
    runDeploymentTest()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Server className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "text-green-700 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "fail":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Database className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">PostgreSQL Deployment Test</h1>
          </div>
          <p className="text-lg text-gray-600">
            Testing the rewritten postgres.ts file for syntax errors and functionality
          </p>
          {lastTest && <p className="text-sm text-gray-500">Last tested: {new Date(lastTest).toLocaleString()}</p>}
        </div>

        {/* PostgreSQL Status Card */}
        {testResults?.postgresRewrite && (
          <Card
            className={`border-2 ${
              testResults.postgresRewrite.status.includes("✅")
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-6 w-6" />
                PostgreSQL File Rewrite Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Status:</span>
                <Badge
                  variant={testResults.postgresRewrite.status.includes("✅") ? "default" : "destructive"}
                  className="text-sm"
                >
                  {testResults.postgresRewrite.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{testResults.postgresRewrite.message}</p>
              {testResults.postgresRewrite.postTest && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium">POST Test:</span>
                  <Badge variant="outline" className="text-xs">
                    {testResults.postgresRewrite.postTest}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Deployment Tests
              </CardTitle>
              <CardDescription>Test postgres.ts and deployment functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runDeploymentTest} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing Deployment...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Run Deployment Test
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                POST Endpoint Test
              </CardTitle>
              <CardDescription>Test database imports in POST requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testPostEndpoint} variant="outline" className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Test POST Endpoint
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Test Summary */}
        {testResults?.summary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Test Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{testResults.summary.passed}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{testResults.summary.warnings}</div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{testResults.summary.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{testResults.summary.score}%</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
              </div>
              <Progress value={testResults.summary.score} className="h-3" />
            </CardContent>
          </Card>
        )}

        {/* Individual Test Results */}
        {testResults?.results?.tests && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(testResults.results.tests).map(([key, test]: [string, any]) => (
              <Card key={key} className={`border ${getStatusColor(test.status)}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {getStatusIcon(test.status)}
                    {test.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm mb-2">{test.message}</p>
                  {test.details && (
                    <div className="space-y-1">
                      {Object.entries(test.details).map(([detailKey, detailValue]: [string, any]) => (
                        <div key={detailKey} className="flex justify-between text-xs">
                          <span className="capitalize">{detailKey.replace(/_/g, " ")}:</span>
                          <span className="font-mono">
                            {typeof detailValue === "boolean"
                              ? detailValue
                                ? "✓"
                                : "✗"
                              : Array.isArray(detailValue)
                                ? detailValue.join(", ")
                                : String(detailValue)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {test.error && (
                    <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
                      <strong>Error:</strong> {test.error}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error Display */}
        {testResults && !testResults.success && testResults.error && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Critical Error</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-red-600 whitespace-pre-wrap">{testResults.error}</pre>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results Interpretation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-green-600">✅ If postgres.ts tests pass:</h4>
              <p className="text-sm text-gray-600">
                The rewritten postgres.ts file is working correctly without syntax errors. Deployment should succeed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-red-600">❌ If postgres.ts tests fail:</h4>
              <p className="text-sm text-gray-600">
                There are still issues with the postgres.ts file. Check the error details and fix any remaining syntax
                issues.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600">🔧 Next Steps:</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>If all tests pass, proceed with production deployment</li>
                <li>Configure database environment variables if needed</li>
                <li>Test actual database connectivity</li>
                <li>Monitor deployment logs for any runtime issues</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
