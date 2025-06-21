"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Cloud, Bot, Shield, Settings } from "lucide-react"

interface ConfigCheck {
  name: string
  status: "success" | "error" | "warning" | "checking"
  message: string
  details?: string
  required: boolean
  category: "database" | "ai" | "auth" | "integrations" | "environment"
}

export default function ConfigVerificationPage() {
  const [checks, setChecks] = useState<ConfigCheck[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  const runAllChecks = async () => {
    setIsRunning(true)
    setProgress(0)
    setChecks([])

    const allChecks = [
      // Environment Variables
      { name: "NODE_ENV", test: () => checkEnvVar("NODE_ENV"), category: "environment", required: true },
      { name: "NEXTAUTH_URL", test: () => checkEnvVar("NEXTAUTH_URL"), category: "environment", required: true },
      { name: "NEXTAUTH_SECRET", test: () => checkEnvVar("NEXTAUTH_SECRET"), category: "auth", required: true },

      // Database Configuration
      {
        name: "Database URL",
        test: () => checkEnvVar("DATABASE_URL", "POSTGRES_URL"),
        category: "database",
        required: true,
      },
      {
        name: "Supabase URL",
        test: () => checkEnvVar("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"),
        category: "database",
        required: true,
      },
      {
        name: "Supabase Anon Key",
        test: () => checkEnvVar("SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
        category: "database",
        required: true,
      },
      {
        name: "Supabase Service Role",
        test: () => checkEnvVar("SUPABASE_SERVICE_ROLE_KEY"),
        category: "database",
        required: false,
      },

      // AI Configuration
      { name: "OpenAI API Key", test: () => checkEnvVar("OPENAI_API_KEY"), category: "ai", required: true },
      { name: "Groq API Key", test: () => checkEnvVar("GROQ_API_KEY"), category: "ai", required: false },

      // Authentication
      { name: "Google Client ID", test: () => checkEnvVar("GOOGLE_CLIENT_ID"), category: "auth", required: false },
      {
        name: "Google Client Secret",
        test: () => checkEnvVar("GOOGLE_CLIENT_SECRET"),
        category: "auth",
        required: false,
      },
      { name: "GitHub Client ID", test: () => checkEnvVar("GITHUB_CLIENT_ID"), category: "auth", required: false },

      // Integrations
      {
        name: "Redis/KV URL",
        test: () => checkEnvVar("KV_URL", "REDIS_URL"),
        category: "integrations",
        required: false,
      },
      { name: "Vercel Environment", test: () => checkVercelEnv(), category: "integrations", required: false },

      // API Endpoints
      { name: "Health Check", test: () => testApiEndpoint("/api/health"), category: "environment", required: true },
      {
        name: "Database Connection",
        test: () => testApiEndpoint("/api/database/test-supabase"),
        category: "database",
        required: true,
      },
      {
        name: "AI Assistant",
        test: () => testApiEndpoint("/api/virtual-lab/ai-assistant"),
        category: "ai",
        required: true,
      },
      { name: "Authentication", test: () => testApiEndpoint("/api/auth/status"), category: "auth", required: true },
    ]

    for (let i = 0; i < allChecks.length; i++) {
      const check = allChecks[i]
      setProgress((i / allChecks.length) * 100)

      try {
        const result = await check.test()
        setChecks((prev) => [...prev, { ...result, category: check.category as any, required: check.required }])
      } catch (error) {
        setChecks((prev) => [
          ...prev,
          {
            name: check.name,
            status: "error",
            message: `Check failed: ${error.message}`,
            category: check.category as any,
            required: check.required,
          },
        ])
      }

      // Small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    setProgress(100)
    setIsRunning(false)
  }

  const checkEnvVar = (...varNames: string[]) => {
    for (const varName of varNames) {
      if (process.env[`NEXT_PUBLIC_${varName}`] || typeof window === "undefined") {
        // For server-side or public vars, we can't directly check process.env in client
        // So we'll make an API call to verify
        return testEnvVar(varName)
      }
    }
    return {
      name: varNames.join(" or "),
      status: "error" as const,
      message: "Environment variable not found",
      details: `None of these variables are set: ${varNames.join(", ")}`,
    }
  }

  const testEnvVar = async (varName: string) => {
    try {
      const response = await fetch(`/api/config-check?var=${varName}`)
      const data = await response.json()

      // Special handling for OpenAI API key
      if (varName === "OPENAI_API_KEY" && data.exists) {
        // Test the actual API key by making a simple API call
        try {
          const testResponse = await fetch("/api/ai/diagnostic", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Test API key validity" }),
          })

          if (testResponse.status === 429) {
            return {
              name: varName,
              status: "warning" as const,
              message: "⚠️ Quota exceeded",
              details: "API key is valid but OpenAI quota exceeded. Please add credits to your account.",
            }
          }

          if (testResponse.ok) {
            return {
              name: varName,
              status: "success" as const,
              message: "✅ Configured and working",
              details: "API key is valid and can make requests",
            }
          } else {
            return {
              name: varName,
              status: "error" as const,
              message: "❌ Configured but not working",
              details: `API key exists but failed test: ${testResponse.status}`,
            }
          }
        } catch (error) {
          return {
            name: varName,
            status: "warning" as const,
            message: "⚠️ Configured but untested",
            details: "API key exists but couldn't test connectivity",
          }
        }
      }

      return {
        name: varName,
        status: data.exists ? ("success" as const) : ("error" as const),
        message: data.exists ? "✅ Configured" : "❌ Not set",
        details: data.details,
      }
    } catch (error) {
      return {
        name: varName,
        status: "error" as const,
        message: "❌ Check failed",
        details: error.message,
      }
    }
  }

  const checkVercelEnv = async () => {
    const vercelVars = ["VERCEL", "VERCEL_ENV", "VERCEL_URL"]
    const results = await Promise.all(vercelVars.map((v) => testEnvVar(v)))
    const hasVercel = results.some((r) => r.status === "success")

    return {
      name: "Vercel Environment",
      status: hasVercel ? ("success" as const) : ("warning" as const),
      message: hasVercel ? "✅ Running on Vercel" : "⚠️ Not on Vercel",
      details: hasVercel ? "Deployment environment detected" : "Running locally or on other platform",
    }
  }

  const testApiEndpoint = async (endpoint: string) => {
    try {
      const response = await fetch(endpoint, { method: "GET" })

      if (response.status === 429) {
        const data = await response.json().catch(() => ({}))
        return {
          name: endpoint,
          status: "warning" as const,
          message: "⚠️ Quota exceeded",
          details: data.action || "OpenAI quota exceeded - please add credits to your account",
        }
      }

      if (response.status === 401) {
        return {
          name: endpoint,
          status: "error" as const,
          message: "❌ Authentication failed",
          details: "Invalid API key - please check your OpenAI API key configuration",
        }
      }

      const isSuccess = response.ok

      return {
        name: endpoint,
        status: isSuccess ? ("success" as const) : ("error" as const),
        message: isSuccess ? `✅ Responding (${response.status})` : `❌ Error (${response.status})`,
        details: isSuccess ? "API endpoint is working" : `HTTP ${response.status}: ${response.statusText}`,
      }
    } catch (error) {
      return {
        name: endpoint,
        status: "error" as const,
        message: "❌ Connection failed",
        details: error.message,
      }
    }
  }

  const getStatusIcon = (status: ConfigCheck["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "checking":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
    }
  }

  const getStatusBadge = (status: ConfigCheck["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">OK</Badge>
      case "error":
        return <Badge variant="destructive">ERROR</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">WARNING</Badge>
      case "checking":
        return <Badge variant="secondary">CHECKING</Badge>
    }
  }

  const getCategoryIcon = (category: ConfigCheck["category"]) => {
    switch (category) {
      case "database":
        return <Database className="h-4 w-4" />
      case "ai":
        return <Bot className="h-4 w-4" />
      case "auth":
        return <Shield className="h-4 w-4" />
      case "integrations":
        return <Cloud className="h-4 w-4" />
      case "environment":
        return <Settings className="h-4 w-4" />
    }
  }

  const groupedChecks = checks.reduce(
    (acc, check) => {
      if (!acc[check.category]) acc[check.category] = []
      acc[check.category].push(check)
      return acc
    },
    {} as Record<string, ConfigCheck[]>,
  )

  const overallStatus = () => {
    const requiredChecks = checks.filter((c) => c.required)
    const failedRequired = requiredChecks.filter((c) => c.status === "error")
    const successCount = checks.filter((c) => c.status === "success").length

    if (failedRequired.length > 0) return "error"
    if (checks.some((c) => c.status === "warning")) return "warning"
    if (successCount === checks.length && checks.length > 0) return "success"
    return "unknown"
  }

  useEffect(() => {
    runAllChecks()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuration Verification</h1>
          <p className="text-muted-foreground">Check all API keys, database connections, and system configuration</p>
        </div>
        <Button onClick={runAllChecks} disabled={isRunning}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? "animate-spin" : ""}`} />
          {isRunning ? "Checking..." : "Run Checks"}
        </Button>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Running configuration checks...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      {checks.length > 0 && (
        <Alert
          className={
            overallStatus() === "success"
              ? "border-green-200 bg-green-50"
              : overallStatus() === "error"
                ? "border-red-200 bg-red-50"
                : "border-yellow-200 bg-yellow-50"
          }
        >
          <div className="flex items-center gap-2">
            {getStatusIcon(overallStatus() as any)}
            <AlertDescription>
              <strong>Overall Status: </strong>
              {overallStatus() === "success" && "All systems operational"}
              {overallStatus() === "error" && "Critical issues detected - some features may not work"}
              {overallStatus() === "warning" && "Minor issues detected - most features should work"}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="ai">AI Services</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4">
            {Object.entries(groupedChecks).map(([category, categoryChecks]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getCategoryIcon(category as any)}
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    <Badge variant="outline">
                      {categoryChecks.filter((c) => c.status === "success").length}/{categoryChecks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoryChecks.map((check, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(check.status)}
                          <span className="font-medium">{check.name}</span>
                          {check.required && (
                            <Badge variant="outline" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{check.message}</span>
                          {getStatusBadge(check.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {Object.entries(groupedChecks).map(([category, categoryChecks]) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getCategoryIcon(category as any)}
                  {category.charAt(0).toUpperCase() + category.slice(1)} Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryChecks.map((check, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(check.status)}
                          <h3 className="font-semibold">{check.name}</h3>
                          {check.required && <Badge variant="outline">Required</Badge>}
                        </div>
                        {getStatusBadge(check.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{check.message}</p>
                      {check.details && <div className="bg-gray-50 p-2 rounded text-xs font-mono">{check.details}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
