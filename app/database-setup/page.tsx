"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Database, Server, AlertCircle, RefreshCw, Play, Settings } from "lucide-react"

interface DatabaseStatus {
  success: boolean
  database_connected?: boolean
  tables_exist?: {
    users: boolean
    schools: boolean
    curriculum_learning_areas: boolean
  }
  total_tables?: number
  statistics?: {
    users: number
    schools: number
    learning_areas: number
    curriculum_outcomes: number
  }
  error?: string
  message?: string
}

interface SupabaseStatus {
  success: boolean
  supabase_connected?: boolean
  learning_areas_count?: number
  sample_learning_areas?: any[]
  error?: string
}

export default function DatabaseSetupPage() {
  const [postgresStatus, setPostgresStatus] = useState<DatabaseStatus | null>(null)
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)

  const checkPostgresStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/database/setup")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(`Expected JSON response, got: ${text.substring(0, 100)}...`)
      }

      const data = await response.json()
      setPostgresStatus(data)
    } catch (error) {
      console.error("Failed to check PostgreSQL status:", error)
      setPostgresStatus({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        message: "Failed to connect to database API",
        database_connected: false,
      })
    } finally {
      setLoading(false)
    }
  }

  const checkSupabaseStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/database/test-supabase")
      const data = await response.json()
      setSupabaseStatus(data)
    } catch (error) {
      setSupabaseStatus({
        success: false,
        error: "Failed to connect to Supabase",
      })
    } finally {
      setLoading(false)
    }
  }

  const runDatabaseSetup = async () => {
    try {
      setSetupLoading(true)
      const response = await fetch("/api/database/setup", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        // Refresh status after setup
        await checkPostgresStatus()
        await checkSupabaseStatus()
      }
    } catch (error) {
      console.error("Setup failed:", error)
    } finally {
      setSetupLoading(false)
    }
  }

  useEffect(() => {
    checkPostgresStatus()
    checkSupabaseStatus()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Setup</h1>
          <p className="text-muted-foreground">
            Configure and verify your PostgreSQL and Supabase database connections
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runDatabaseSetup}
            disabled={setupLoading}
            className="flex items-center gap-2"
            variant="default"
          >
            <Play className={`h-4 w-4 ${setupLoading ? "animate-spin" : ""}`} />
            {setupLoading ? "Setting up..." : "Run Setup"}
          </Button>
          <Button
            onClick={() => {
              checkPostgresStatus()
              checkSupabaseStatus()
            }}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PostgreSQL/Neon Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              PostgreSQL / Neon Database
            </CardTitle>
            <CardDescription>Primary database for application data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {postgresStatus ? (
              <>
                <div className="flex items-center gap-2">
                  {postgresStatus.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">{postgresStatus.success ? "Connected" : "Connection Failed"}</span>
                </div>

                {postgresStatus.success && postgresStatus.tables_exist && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Database Tables:</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {Object.entries(postgresStatus.tables_exist).map(([table, exists]) => (
                        <div key={table} className="flex items-center justify-between">
                          <span className="text-sm">{table}</span>
                          <Badge variant={exists ? "default" : "destructive"}>{exists ? "Exists" : "Missing"}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {postgresStatus.statistics && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Data Statistics:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Users:</span>
                        <span className="font-medium">{postgresStatus.statistics.users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Schools:</span>
                        <span className="font-medium">{postgresStatus.statistics.schools}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Learning Areas:</span>
                        <span className="font-medium">{postgresStatus.statistics.learning_areas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Outcomes:</span>
                        <span className="font-medium">{postgresStatus.statistics.curriculum_outcomes}</span>
                      </div>
                    </div>
                  </div>
                )}

                {postgresStatus.error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div className="text-sm text-red-700">
                      <p className="font-medium">Error:</p>
                      <p>{postgresStatus.error}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Checking connection...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supabase Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Supabase Database
            </CardTitle>
            <CardDescription>Alternative database with real-time features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {supabaseStatus ? (
              <>
                <div className="flex items-center gap-2">
                  {supabaseStatus.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">{supabaseStatus.success ? "Connected" : "Connection Failed"}</span>
                </div>

                {supabaseStatus.success && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Learning Areas:</span>
                      <span className="font-medium">{supabaseStatus.learning_areas_count || 0}</span>
                    </div>

                    {supabaseStatus.sample_learning_areas && supabaseStatus.sample_learning_areas.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm">Sample Areas:</h4>
                        <div className="flex flex-wrap gap-1">
                          {supabaseStatus.sample_learning_areas.slice(0, 3).map((area, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {area.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {supabaseStatus.error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div className="text-sm text-red-700">
                      <p className="font-medium">Error:</p>
                      <p>{supabaseStatus.error}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Checking connection...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Setup Instructions
          </CardTitle>
          <CardDescription>Follow these steps to configure your databases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Configure Environment Variables</h4>
                <p className="text-sm text-muted-foreground">
                  Set up POSTGRES_URL, SUPABASE_URL, and SUPABASE_ANON_KEY in your environment
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Run Database Setup</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Run Setup" to create tables and seed initial data
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Verify Connections</h4>
                <p className="text-sm text-muted-foreground">Check that both databases show "Connected" status above</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
