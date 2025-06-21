"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Cpu, Database, Globe, Key } from "lucide-react"
import { runAIDiagnostics } from "@/lib/ai/diagnostic-tool"

interface DiagnosticResult {
  success: boolean
  message: string
  details?: any
  timestamp: string
}

interface DiagnosticReport {
  apiKeyStatus: DiagnosticResult
  networkStatus: DiagnosticResult
  implementationStatus: DiagnosticResult
  databaseStatus: DiagnosticResult
  overallStatus: "healthy" | "degraded" | "critical"
  recommendations: string[]
}

export default function AIDiagnosticPage() {
  const [report, setReport] = useState<DiagnosticReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [customApiKey, setCustomApiKey] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    runInitialDiagnostics()
  }, [])

  const runInitialDiagnostics = async () => {
    setLoading(true)
    try {
      const diagnosticReport = await runAIDiagnostics()
      setReport(diagnosticReport)
    } catch (error) {
      console.error("Diagnostic error:", error)
    } finally {
      setLoading(false)
    }
  }

  const runCustomKeyDiagnostics = async () => {
    if (!customApiKey.trim()) return

    setLoading(true)
    try {
      const diagnosticReport = await runAIDiagnostics(customApiKey)
      setReport(diagnosticReport)
    } catch (error) {
      console.error("Diagnostic error with custom key:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getOverallStatusBadge = (status: "healthy" | "degraded" | "critical") => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500">Healthy</Badge>
      case "degraded":
        return <Badge className="bg-yellow-500">Degraded</Badge>
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>
    }
  }

  const getStatusColor = (status: boolean) => {
    return status ? "text-green-500" : "text-red-500"
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">AI Integration Diagnostic Tool</h1>
      <p className="text-gray-600 mb-8">
        This tool helps diagnose issues with AI integration, including API keys, network connectivity, and
        implementation.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-20">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : report ? (
              <div className="flex items-center gap-3">
                {getStatusIcon(report.apiKeyStatus.success)}
                <div>
                  <p className={`font-medium ${getStatusColor(report.apiKeyStatus.success)}`}>
                    {report.apiKeyStatus.success ? "Valid API Key" : "Invalid API Key"}
                  </p>
                  <p className="text-sm text-gray-500">{report.apiKeyStatus.message}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Run diagnostics to check API key status</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Network Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-20">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : report ? (
              <div className="flex items-center gap-3">
                {getStatusIcon(report.networkStatus.success)}
                <div>
                  <p className={`font-medium ${getStatusColor(report.networkStatus.success)}`}>
                    {report.networkStatus.success ? "Network Connected" : "Network Issues"}
                  </p>
                  <p className="text-sm text-gray-500">{report.networkStatus.message}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Run diagnostics to check network status</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-20">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : report ? (
              <div className="flex items-center gap-3">
                {getStatusIcon(report.databaseStatus.success)}
                <div>
                  <p className={`font-medium ${getStatusColor(report.databaseStatus.success)}`}>
                    {report.databaseStatus.success ? "Database Connected" : "Database Issues"}
                  </p>
                  <p className="text-sm text-gray-500">{report.databaseStatus.message}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Run diagnostics to check database status</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              AI Integration Diagnostics
            </CardTitle>
            {report && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Overall Status:</span>
                {getOverallStatusBadge(report.overallStatus)}
              </div>
            )}
          </div>
          <CardDescription>Comprehensive diagnostics for your AI integration</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Detailed Results</TabsTrigger>
              <TabsTrigger value="custom">Custom API Key</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                    <p>Running diagnostics...</p>
                  </div>
                </div>
              ) : report ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Diagnostic Summary</h3>
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <span>API Key</span>
                          <span className={getStatusColor(report.apiKeyStatus.success)}>
                            {report.apiKeyStatus.success ? "Valid" : "Invalid"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span>Network Connectivity</span>
                          <span className={getStatusColor(report.networkStatus.success)}>
                            {report.networkStatus.success ? "Connected" : "Issues Detected"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span>Implementation</span>
                          <span className={getStatusColor(report.implementationStatus.success)}>
                            {report.implementationStatus.success ? "Working" : "Issues Detected"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Database</span>
                          <span className={getStatusColor(report.databaseStatus.success)}>
                            {report.databaseStatus.success ? "Connected" : "Issues Detected"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Recommendations</h3>
                      {report.recommendations.length > 0 ? (
                        <div className="p-3 border rounded-md">
                          <ul className="list-disc list-inside space-y-1">
                            {report.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm">
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="p-3 border rounded-md">
                          <p className="text-sm text-green-600">No issues detected. All systems operational.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {report.overallStatus !== "healthy" && (
                    <Alert
                      className={
                        report.overallStatus === "critical"
                          ? "bg-red-50 border-red-200"
                          : "bg-yellow-50 border-yellow-200"
                      }
                    >
                      <AlertTriangle
                        className={report.overallStatus === "critical" ? "text-red-500" : "text-yellow-500"}
                      />
                      <AlertTitle>
                        {report.overallStatus === "critical" ? "Critical Issues Detected" : "Performance Degraded"}
                      </AlertTitle>
                      <AlertDescription>
                        {report.overallStatus === "critical"
                          ? "Your AI integration has critical issues that need immediate attention."
                          : "Your AI integration is working but with some issues that may affect performance."}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="mb-4">
                    Click the button below to run a comprehensive diagnostic on your AI integration
                  </p>
                  <Button onClick={runInitialDiagnostics}>Run Diagnostics</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details">
              {report ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">API Key Diagnostic</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          <span className={getStatusColor(report.apiKeyStatus.success)}>
                            {report.apiKeyStatus.success ? "Valid" : "Invalid"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Message:</span>
                          <p className="text-sm mt-1">{report.apiKeyStatus.message}</p>
                        </div>
                        {report.apiKeyStatus.details && (
                          <div>
                            <span className="font-medium">Details:</span>
                            <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(report.apiKeyStatus.details, null, 2)}
                            </pre>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Timestamp:</span>
                          <p className="text-xs text-gray-500 mt-1">{report.apiKeyStatus.timestamp}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Network Diagnostic</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          <span className={getStatusColor(report.networkStatus.success)}>
                            {report.networkStatus.success ? "Connected" : "Issues Detected"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Message:</span>
                          <p className="text-sm mt-1">{report.networkStatus.message}</p>
                        </div>
                        {report.networkStatus.details && (
                          <div>
                            <span className="font-medium">Details:</span>
                            <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(report.networkStatus.details, null, 2)}
                            </pre>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Timestamp:</span>
                          <p className="text-xs text-gray-500 mt-1">{report.networkStatus.timestamp}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Implementation Diagnostic</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          <span className={getStatusColor(report.implementationStatus.success)}>
                            {report.implementationStatus.success ? "Working" : "Issues Detected"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Message:</span>
                          <p className="text-sm mt-1">{report.implementationStatus.message}</p>
                        </div>
                        {report.implementationStatus.details && (
                          <div>
                            <span className="font-medium">Details:</span>
                            <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(report.implementationStatus.details, null, 2)}
                            </pre>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Timestamp:</span>
                          <p className="text-xs text-gray-500 mt-1">{report.implementationStatus.timestamp}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Database Diagnostic</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          <span className={getStatusColor(report.databaseStatus.success)}>
                            {report.databaseStatus.success ? "Connected" : "Issues Detected"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Message:</span>
                          <p className="text-sm mt-1">{report.databaseStatus.message}</p>
                        </div>
                        {report.databaseStatus.details && (
                          <div>
                            <span className="font-medium">Details:</span>
                            <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(report.databaseStatus.details, null, 2)}
                            </pre>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Timestamp:</span>
                          <p className="text-xs text-gray-500 mt-1">{report.databaseStatus.timestamp}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="mb-4">Run diagnostics first to see detailed results</p>
                  <Button onClick={runInitialDiagnostics}>Run Diagnostics</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm">
                    Use this section to test with a custom API key without changing your environment variables. This is
                    useful for troubleshooting or testing new API keys.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="Enter custom OpenAI API key"
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <Button onClick={runCustomKeyDiagnostics} disabled={loading || !customApiKey.trim()}>
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test Key"
                    )}
                  </Button>
                </div>

                {report && customApiKey && (
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Custom API Key Test Results</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(report.apiKeyStatus.success)}
                      <span className={getStatusColor(report.apiKeyStatus.success)}>
                        {report.apiKeyStatus.success ? "Valid API Key" : "Invalid API Key"}
                      </span>
                    </div>
                    <p className="text-sm">{report.apiKeyStatus.message}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={runInitialDiagnostics} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Again
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/admin/config")}>
            Go to Config
          </Button>
        </CardFooter>
      </Card>

      <div className="text-sm text-gray-500">
        <p>Last diagnostic run: {report ? new Date(report.apiKeyStatus.timestamp).toLocaleString() : "Never"}</p>
      </div>
    </div>
  )
}
