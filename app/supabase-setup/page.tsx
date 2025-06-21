"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertCircle, Database, Key, Shield, Zap } from "lucide-react"

interface ConfigStatus {
  success: boolean
  configured: boolean
  status: {
    url: boolean
    anonKey: boolean
    serviceKey: boolean
    jwtSecret: boolean
  }
  missing: string[]
  message: string
}

interface ConnectionTest {
  success: boolean
  message: string
  tests: {
    database: { success: boolean; message: string }
    auth: { success: boolean; message: string }
    admin: { success: boolean; error?: string } | null
  }
  timestamp: string
}

export default function SupabaseSetupPage() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null)
  const [connectionTest, setConnectionTest] = useState<ConnectionTest | null>(null)
  const [loading, setLoading] = useState(false)

  const checkConfiguration = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/supabase/config-check")
      const data = await response.json()
      setConfigStatus(data)
    } catch (error) {
      console.error("Failed to check configuration:", error)
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/supabase/test-connection")
      const data = await response.json()
      setConnectionTest(data)
    } catch (error) {
      console.error("Failed to test connection:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConfiguration()
  }, [])

  const StatusIcon = ({ success }: { success: boolean }) =>
    success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Supabase Configuration</h1>
          <p className="text-gray-600">Setup and verify your Supabase database connection</p>
        </div>

        {/* Configuration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Configuration Status
            </CardTitle>
            <CardDescription>Check if all required Supabase environment variables are configured</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={checkConfiguration} disabled={loading}>
                {loading ? "Checking..." : "Check Configuration"}
              </Button>
            </div>

            {configStatus && (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{configStatus.message}</AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <StatusIcon success={configStatus.status.url} />
                    <span className="text-sm">Supabase URL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon success={configStatus.status.anonKey} />
                    <span className="text-sm">Anon Key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon success={configStatus.status.serviceKey} />
                    <span className="text-sm">Service Key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon success={configStatus.status.jwtSecret} />
                    <span className="text-sm">JWT Secret</span>
                  </div>
                </div>

                {configStatus.missing.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">Missing Configuration:</h4>
                    <div className="flex flex-wrap gap-2">
                      {configStatus.missing.map((item) => (
                        <Badge key={item} variant="destructive">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Connection Test
            </CardTitle>
            <CardDescription>Test the actual connection to your Supabase database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={testConnection} disabled={loading || !configStatus?.configured}>
                {loading ? "Testing..." : "Test Connection"}
              </Button>
            </div>

            {connectionTest && (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{connectionTest.message}</AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span className="font-medium">Database Connection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon success={connectionTest.tests.database.success} />
                      <span className="text-sm text-gray-600">{connectionTest.tests.database.message}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Authentication Service</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon success={connectionTest.tests.auth.success} />
                      <span className="text-sm text-gray-600">{connectionTest.tests.auth.message}</span>
                    </div>
                  </div>

                  {connectionTest.tests.admin && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        <span className="font-medium">Admin Access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon success={connectionTest.tests.admin.success} />
                        <span className="text-sm text-gray-600">
                          {connectionTest.tests.admin.success
                            ? "Admin access working"
                            : connectionTest.tests.admin.error}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  Last tested: {new Date(connectionTest.timestamp).toLocaleString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>Follow these steps to configure Supabase for your CBC Tutorbot Platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Create a Supabase Project</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Go to{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    supabase.com
                  </a>{" "}
                  and create a new project.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">2. Get Your Project Credentials</h4>
                <p className="text-sm text-gray-600 mb-2">
                  From your Supabase dashboard, go to Settings → API to find:
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Project URL</li>
                  <li>Anon/Public Key</li>
                  <li>Service Role Key (for admin operations)</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">3. Set Environment Variables</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Add these to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file:
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">
                  <div>NEXT_PUBLIC_SUPABASE_URL=your_project_url</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</div>
                  <div>SUPABASE_SERVICE_ROLE_KEY=your_service_role_key</div>
                  <div>SUPABASE_JWT_SECRET=your_jwt_secret</div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">4. Run Database Setup</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Execute the SQL scripts in the <code className="bg-gray-100 px-1 rounded">scripts/</code> folder to
                  set up your database schema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
