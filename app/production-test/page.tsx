"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Server,
  Globe,
  Database,
  Zap,
  Monitor,
  Activity,
  Settings,
  Cloud,
} from "lucide-react"

interface TestResult {
  success: boolean
  message: string
  summary?: any
  results?: any
  deployment?: any
  error?: string
}

interface HealthResult {
  status: string
  healthScore: number
  message: string
  data?: any
  services?: any
  recommendations?: string[]
}

export default function ProductionTestPage() {
  const [testResults, setTestResults] = useState<TestResult | null>(null)
  const [healthResults, setHealthResults] = useState<HealthResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [healthLoading, setHealthLoading] = useState(false)

  const runProductionTest = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/production-test")
      const result = await response.json()
      setTestResults(result)
    } catch (error) {
      setTestResults({
        success: false,
        message: "Failed to run production test",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  const runHealthCheck = async () => {
    setHealthLoading(true)
    try {
      const response = await fetch("/api/production-health")
      const result = await response.json()
      setHealthResults(result)
    } catch (error) {
      setHealthResults({
        status: "unhealthy",
        healthScore: 0,
        message: "Health check failed",
        recommendations: ["Check server connectivity and try again"],
      })
    } finally {
      setHealthLoading(false)
    }
  }

  useEffect(() => {
    // Auto-run tests on page load
    runProductionTest()
    runHealthCheck()
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
        return <Monitor className="h-5 w-5 text-gray-500" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Cloud className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Production Environment Test</h1>
          </div>
          <p className="text-lg text-gray-600">
            Comprehensive testing of the live production deployment with package-lock.json fix
          </p>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Deployment Tests
              </CardTitle>
              <CardDescription>Test core functionality and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runProductionTest} disabled={loading} className="w-full">
                {loading ? "Running Tests..." : "Run Production Tests"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Health Check
              </CardTitle>
              <CardDescription>Monitor system health and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runHealthCheck} disabled={healthLoading} variant="outline" className="w-full">
                {healthLoading ? "Checking Health..." : "Run Health Check"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Health Score */}
        {healthResults && (
          <Card
            className={`border-2 ${healthResults.status === "healthy" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6" />
                Production Health Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{healthResults.healthScore}/100</span>
                <Badge variant={healthResults.status === "healthy" ? "default" : "destructive"}>
                  {healthResults.status.toUpperCase()}
                </Badge>
              </div>
              <Progress value={healthResults.healthScore} className="h-3" />
              <p className="text-sm text-gray-600">{healthResults.message}</p>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testResults && testResults.success && (
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Test Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{testResults.summary?.passed || 0}</div>
                    <div className="text-sm text-gray-600">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{testResults.summary?.warnings || 0}</div>
                    <div className="text-sm text-gray-600">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{testResults.summary?.failed || 0}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{testResults.summary?.score || 0}%</div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Tests */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testResults.results?.tests &&
                Object.entries(testResults.results.tests).map(([key, test]: [string, any]) => (
                  <Card key={key} className={`border ${getStatusColor(test.status)}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        {getStatusIcon(test.status)}
                        {test.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {test.details &&
                          Object.entries(test.details).map(([detailKey, detailValue]: [string, any]) => (
                            <div key={detailKey} className="flex justify-between text-sm">
                              <span className="capitalize">{detailKey.replace(/_/g, " ")}:</span>
                              <span className="font-mono text-xs">
                                {typeof detailValue === "boolean" ? (detailValue ? "✓" : "✗") : String(detailValue)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Environment Details */}
        {healthResults?.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Environment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(healthResults.data.environment).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                    <Badge variant="outline" className="text-xs">
                      {String(value) || "Not set"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(healthResults.data.performance).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                    <Badge variant="outline" className="text-xs">
                      {String(value)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(healthResults.data.integrations).map(([category, items]: [string, any]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm capitalize mb-1">{category}:</h4>
                    <div className="space-y-1 ml-2">
                      {Object.entries(items).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="capitalize">{key}:</span>
                          <Badge variant={value ? "default" : "secondary"} className="text-xs">
                            {value ? "✓" : "✗"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recommendations */}
        {healthResults?.recommendations && healthResults.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {healthResults.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Deployment Status */}
        {testResults?.deployment && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Deployment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-green-700 font-medium">{testResults.deployment.packageLockFix}</p>
                <p className="text-sm text-green-600">{testResults.deployment.recommendation}</p>
                <Badge variant="default" className="bg-green-600">
                  {testResults.deployment.status.replace(/_/g, " ").toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
