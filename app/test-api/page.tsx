"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Play, Database, Server } from "lucide-react"

interface TestResult {
  endpoint: string
  status: number
  success: boolean
  data: any
  error: string | null
}

interface TestResults {
  timestamp: string
  baseUrl: string
  tests: TestResult[]
}

export default function TestAPIPage() {
  const [results, setResults] = useState<TestResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [individualTests, setIndividualTests] = useState<Record<string, any>>({})

  const runAllTests = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-endpoints")
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Test failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const runIndividualTest = async (endpoint: string, method: "GET" | "POST" = "GET") => {
    setLoading(true)
    try {
      const response = await fetch(endpoint, {
        method,
        headers: method === "POST" ? { "Content-Type": "application/json" } : {},
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        setIndividualTests((prev) => ({
          ...prev,
          [endpoint]: {
            status: response.status,
            success: false,
            data: { error: "Invalid response format", message: text.substring(0, 100) + "..." },
            timestamp: new Date().toISOString(),
          },
        }))
        return
      }

      // Parse JSON response
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        const text = await response.text()
        setIndividualTests((prev) => ({
          ...prev,
          [endpoint]: {
            status: response.status,
            success: false,
            data: { error: "JSON parse error", message: text.substring(0, 100) + "..." },
            timestamp: new Date().toISOString(),
          },
        }))
        return
      }

      setIndividualTests((prev) => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          success: response.ok,
          data,
          timestamp: new Date().toISOString(),
        },
      }))
    } catch (error) {
      setIndividualTests((prev) => ({
        ...prev,
        [endpoint]: {
          status: 0,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Endpoint Testing</h1>
          <p className="text-muted-foreground">Test database API endpoints to verify functionality</p>
        </div>
        <Button onClick={runAllTests} disabled={loading} className="flex items-center gap-2">
          <Play className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Run All Tests
        </Button>
      </div>

      {/* Individual Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Setup API
            </CardTitle>
            <CardDescription>/api/database/setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => runIndividualTest("/api/database/setup", "GET")}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Test GET
            </Button>
            <Button
              onClick={() => runIndividualTest("/api/database/setup", "POST")}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Test POST
            </Button>

            {individualTests["/api/database/setup"] && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-2 mb-1">
                  {individualTests["/api/database/setup"].success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>Status: {individualTests["/api/database/setup"].status}</span>
                </div>
                <pre className="text-xs overflow-auto max-h-32">
                  {JSON.stringify(individualTests["/api/database/setup"].data, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Supabase Test API
            </CardTitle>
            <CardDescription>/api/database/test-supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => runIndividualTest("/api/database/test-supabase", "GET")}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Test GET
            </Button>
            <Button
              onClick={() => runIndividualTest("/api/database/test-supabase", "POST")}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Test POST
            </Button>

            {individualTests["/api/database/test-supabase"] && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-2 mb-1">
                  {individualTests["/api/database/test-supabase"].success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>Status: {individualTests["/api/database/test-supabase"].status}</span>
                </div>
                <pre className="text-xs overflow-auto max-h-32">
                  {JSON.stringify(individualTests["/api/database/test-supabase"].data, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Tested at {new Date(results.timestamp).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.tests.map((test, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{test.endpoint}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={test.success ? "default" : "destructive"}>{test.status}</Badge>
                      {test.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  {test.error && <div className="text-red-600 text-sm mb-2">Error: {test.error}</div>}

                  <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-48">
                    {JSON.stringify(test.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
