"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ConfigStatus {
  nextAuthUrl: string
  port: string
  npmConfig: {
    registryUrl: string
    networkTimeout: string
    fetchRetries: string
  }
  databaseConfig: {
    host: string
    port: string
    database: string
  }
  supabaseConfig: {
    url: string
  }
  openaiConfig: {
    model: string
    temperature: number
    maxTokens: number
  }
  groqConfig: {
    model: string
  }
  authConfig: {
    nextAuthUrl: string
  }
  appConfig: {
    nodeEnv: string
    vercelEnv: string
    vercelUrl: string
  }
  isProduction: boolean
  isDevelopment: boolean
}

export default function ConfigStatusPage() {
  const [config, setConfig] = useState<ConfigStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch("/api/auto-config")
        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.status}`)
        }
        const data = await response.json()
        setConfig(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Configuration...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-3xl">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="text-destructive">Configuration Error</CardTitle>
            <CardDescription>There was a problem loading the configuration</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!config) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Auto-Filled Configuration Status</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Environment
              <Badge variant={config.isProduction ? "default" : "outline"}>
                {config.isProduction ? "Production" : "Development"}
              </Badge>
            </CardTitle>
            <CardDescription>Current environment settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Node Environment</p>
                  <p className="text-sm text-muted-foreground">{config.appConfig.nodeEnv}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Vercel Environment</p>
                  <p className="text-sm text-muted-foreground">{config.appConfig.vercelEnv}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">URL</p>
                <p className="text-sm text-muted-foreground break-all">{config.nextAuthUrl}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Port</p>
                <p className="text-sm text-muted-foreground">{config.port}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NPM Configuration</CardTitle>
            <CardDescription>Package manager settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium">Registry URL</p>
                <p className="text-sm text-muted-foreground break-all">{config.npmConfig.registryUrl}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Network Timeout</p>
                <p className="text-sm text-muted-foreground">{config.npmConfig.networkTimeout}ms</p>
              </div>
              <div>
                <p className="text-sm font-medium">Fetch Retries</p>
                <p className="text-sm text-muted-foreground">{config.npmConfig.fetchRetries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Configuration</CardTitle>
            <CardDescription>Database connection settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium">Host</p>
                <p className="text-sm text-muted-foreground">{config.databaseConfig.host}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Port</p>
                <p className="text-sm text-muted-foreground">{config.databaseConfig.port}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-sm text-muted-foreground">{config.databaseConfig.database}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Configuration</CardTitle>
            <CardDescription>AI model settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">OpenAI</h3>
                <div className="grid gap-2">
                  <div>
                    <p className="text-sm font-medium">Model</p>
                    <p className="text-sm text-muted-foreground">{config.openaiConfig.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-sm text-muted-foreground">{config.openaiConfig.temperature}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Max Tokens</p>
                    <p className="text-sm text-muted-foreground">{config.openaiConfig.maxTokens}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Groq</h3>
                <div>
                  <p className="text-sm font-medium">Model</p>
                  <p className="text-sm text-muted-foreground">{config.groqConfig.model}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => window.location.reload()}>Refresh Configuration</Button>
      </div>
    </div>
  )
}
