"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"

interface ConfigData {
  env: {
    IS_DEVELOPMENT: boolean
    IS_PRODUCTION: boolean
    IS_TEST: boolean
    IS_VERCEL: boolean
    IS_PREVIEW: boolean
  }
  baseUrl: string
  nextAuth: {
    url: string
  }
  database: {
    host: string
    port: string
    database: string
    configured: boolean
  }
  ai: {
    openai: {
      model: string
      temperature: number
      maxTokens: number
      configured: boolean
    }
    groq: {
      model: string
      configured: boolean
    }
  }
  authProviders: {
    google: {
      enabled: boolean
    }
    github: {
      enabled: boolean
    }
  }
  supabase: {
    configured: boolean
  }
  deployment: {
    nodeEnv: string
    vercelEnv?: string
    vercelUrl?: string
    port: string
  }
  packageManager: {
    registry: string
    networkTimeout: string
    fetchRetries: string
  }
}

export function ConfigDashboard() {
  const [config, setConfig] = useState<ConfigData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchConfig() {
    try {
      setLoading(true)
      const response = await fetch("/api/auto-config")
      if (!response.ok) {
        throw new Error(`Failed to fetch configuration: ${response.status}`)
      }
      const data = await response.json()
      setConfig(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load configuration")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button variant="outline" size="sm" onClick={fetchConfig} className="mt-2">
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </Alert>
    )
  }

  if (!config) return null

  const environmentBadge = config.env.IS_PRODUCTION ? (
    <Badge>Production</Badge>
  ) : config.env.IS_PREVIEW ? (
    <Badge variant="outline">Preview</Badge>
  ) : (
    <Badge variant="secondary">Development</Badge>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>System Configuration</CardTitle>
          {environmentBadge}
        </div>
        <CardDescription>Auto-detected configuration for CBC Tutorbot Platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="ai">AI Models</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatusCard
                  title="Database"
                  status={config.database.configured}
                  detail={
                    config.database.configured
                      ? `${config.database.host}:${config.database.port}/${config.database.database}`
                      : "Not configured"
                  }
                />
                <StatusCard
                  title="Authentication"
                  status={config.authProviders.google.enabled || config.authProviders.github.enabled}
                  detail={
                    config.authProviders.google.enabled && config.authProviders.github.enabled
                      ? "Google & GitHub"
                      : config.authProviders.google.enabled
                        ? "Google"
                        : config.authProviders.github.enabled
                          ? "GitHub"
                          : "Not configured"
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatusCard
                  title="OpenAI"
                  status={config.ai.openai.configured}
                  detail={config.ai.openai.configured ? config.ai.openai.model : "Not configured"}
                />
                <StatusCard
                  title="Groq"
                  status={config.ai.groq.configured}
                  detail={config.ai.groq.configured ? config.ai.groq.model : "Not configured"}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatusCard
                  title="Supabase"
                  status={config.supabase.configured}
                  detail={config.supabase.configured ? "Connected" : "Not configured"}
                />
                <StatusCard
                  title="Environment"
                  status={true}
                  detail={config.env.IS_PRODUCTION ? "Production" : config.env.IS_PREVIEW ? "Preview" : "Development"}
                />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Base URL</h3>
                <p className="text-sm text-muted-foreground break-all bg-muted p-2 rounded">{config.baseUrl}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="database">
            <div className="space-y-4">
              <StatusCard
                title="Database Connection"
                status={config.database.configured}
                detail={config.database.configured ? "Connected" : "Not configured"}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Host</h3>
                  <p className="text-sm text-muted-foreground">{config.database.host}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Port</h3>
                  <p className="text-sm text-muted-foreground">{config.database.port}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Database Name</h3>
                <p className="text-sm text-muted-foreground">{config.database.database}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">OpenAI</h3>
                <StatusCard
                  title="API Key"
                  status={config.ai.openai.configured}
                  detail={config.ai.openai.configured ? "Configured" : "Not configured"}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Model</h3>
                    <p className="text-sm text-muted-foreground">{config.ai.openai.model}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Temperature</h3>
                    <p className="text-sm text-muted-foreground">{config.ai.openai.temperature}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Max Tokens</h3>
                    <p className="text-sm text-muted-foreground">{config.ai.openai.maxTokens}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Groq</h3>
                <StatusCard
                  title="API Key"
                  status={config.ai.groq.configured}
                  detail={config.ai.groq.configured ? "Configured" : "Not configured"}
                />
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Model</h3>
                  <p className="text-sm text-muted-foreground">{config.ai.groq.model}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">AI Model Testing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TestAIModelCard
                    title="Test OpenAI"
                    model={config.ai.openai.model}
                    configured={config.ai.openai.configured}
                    endpoint="/api/ai/diagnostic"
                    testPrompt="Test OpenAI connection"
                  />
                  <TestAIModelCard
                    title="Test Groq"
                    model={config.ai.groq.model}
                    configured={config.ai.groq.configured}
                    endpoint="/api/ai/chat-stream"
                    testPrompt="Test Groq connection"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auth">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Authentication Providers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatusCard
                    title="Google OAuth"
                    status={config.authProviders.google.enabled}
                    detail={config.authProviders.google.enabled ? "Enabled" : "Not configured"}
                  />
                  <StatusCard
                    title="GitHub OAuth"
                    status={config.authProviders.github.enabled}
                    detail={config.authProviders.github.enabled ? "Enabled" : "Not configured"}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">NextAuth URL</h3>
                <p className="text-sm text-muted-foreground break-all bg-muted p-2 rounded">{config.nextAuth.url}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="deployment">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Node Environment</h3>
                  <p className="text-sm text-muted-foreground">{config.deployment.nodeEnv}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Port</h3>
                  <p className="text-sm text-muted-foreground">{config.deployment.port}</p>
                </div>
              </div>

              {config.env.IS_VERCEL && (
                <>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Vercel Environment</h3>
                    <p className="text-sm text-muted-foreground">{config.deployment.vercelEnv}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Vercel URL</h3>
                    <p className="text-sm text-muted-foreground break-all bg-muted p-2 rounded">
                      {config.deployment.vercelUrl}
                    </p>
                  </div>
                </>
              )}

              <div>
                <h3 className="text-sm font-medium mb-2">Package Manager</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-xs text-muted-foreground">Registry</h4>
                    <p className="text-sm break-all">{config.packageManager.registry}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-muted-foreground">Network Timeout</h4>
                    <p className="text-sm">{config.packageManager.networkTimeout}ms</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-muted-foreground">Fetch Retries</h4>
                    <p className="text-sm">{config.packageManager.fetchRetries}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">Auto-configured settings for CBC Tutorbot Platform</p>
        <Button size="sm" onClick={fetchConfig}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </CardFooter>
    </Card>
  )
}

function TestAIModelCard({
  title,
  model,
  configured,
  endpoint,
  testPrompt,
}: {
  title: string
  model: string
  configured: boolean
  endpoint: string
  testPrompt: string
}) {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const testModel = async () => {
    if (!configured) return

    setTesting(true)
    setResult(null)

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testPrompt }),
      })

      if (response.ok) {
        setResult("✅ AI model is working correctly")
      } else {
        setResult(`❌ Test failed: ${response.status}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{title}</h4>
        <Badge variant={configured ? "default" : "secondary"}>{configured ? "Ready" : "Not Configured"}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{model}</p>
      <Button onClick={testModel} disabled={!configured || testing} size="sm" className="w-full mb-2">
        {testing ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Testing...
          </>
        ) : (
          "Test Model"
        )}
      </Button>
      {result && <p className="text-xs mt-2 p-2 bg-muted rounded">{result}</p>}
    </div>
  )
}

function StatusCard({ title, status, detail }: { title: string; status: boolean; detail: string }) {
  return (
    <div className="flex items-start space-x-4 border rounded-lg p-4">
      <div className="mt-0.5">
        {status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </div>
    </div>
  )
}
