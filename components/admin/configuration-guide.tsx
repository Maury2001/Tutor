"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Key, Shield, Cloud, Copy, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ConfigurationGuide() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const envVars = {
    required: [
      {
        name: "DATABASE_URL",
        description: "PostgreSQL database connection string",
        example: "postgresql://user:password@host:5432/database",
        source: "Neon, Supabase, or other PostgreSQL provider",
      },
      {
        name: "SUPABASE_URL",
        description: "Supabase project URL",
        example: "https://your-project.supabase.co",
        source: "Supabase Dashboard → Settings → API",
      },
      {
        name: "SUPABASE_ANON_KEY",
        description: "Supabase anonymous key",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        source: "Supabase Dashboard → Settings → API",
      },
      {
        name: "OPENAI_API_KEY",
        description: "OpenAI API key for AI features",
        example: "sk-proj-...",
        source: "OpenAI Platform → API Keys",
      },
      {
        name: "NEXTAUTH_SECRET",
        description: "Secret for NextAuth.js sessions",
        example: "your-super-secret-key-here",
        source: "Generate with: openssl rand -base64 32",
      },
      {
        name: "NEXTAUTH_URL",
        description: "Base URL of your application",
        example: "https://your-app.vercel.app",
        source: "Your deployment URL",
      },
    ],
    optional: [
      {
        name: "GROQ_API_KEY",
        description: "Groq API key for alternative AI model",
        example: "gsk_...",
        source: "Groq Console → API Keys",
      },
      {
        name: "GOOGLE_CLIENT_ID",
        description: "Google OAuth client ID",
        example: "123456789-abc.apps.googleusercontent.com",
        source: "Google Cloud Console → APIs & Services → Credentials",
      },
      {
        name: "GOOGLE_CLIENT_SECRET",
        description: "Google OAuth client secret",
        example: "GOCSPX-...",
        source: "Google Cloud Console → APIs & Services → Credentials",
      },
      {
        name: "KV_URL",
        description: "Redis/Upstash KV database URL",
        example: "redis://...",
        source: "Upstash Console or Redis provider",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configuration Guide</h2>
        <p className="text-muted-foreground">
          Complete setup guide for all required environment variables and API keys
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Note:</strong> Never commit API keys to version control. Use environment variables and keep
          your .env files private.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="required" className="space-y-4">
        <TabsList>
          <TabsTrigger value="required">Required Variables</TabsTrigger>
          <TabsTrigger value="optional">Optional Variables</TabsTrigger>
          <TabsTrigger value="setup">Setup Instructions</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="required">
          <div className="space-y-4">
            {envVars.required.map((envVar, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    {envVar.name}
                    <Badge variant="destructive">Required</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{envVar.description}</p>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Example:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                        {envVar.name}={envVar.example}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`${envVar.name}=${envVar.example}`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Source:</label>
                    <p className="text-sm mt-1">{envVar.source}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optional">
          <div className="space-y-4">
            {envVars.optional.map((envVar, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    {envVar.name}
                    <Badge variant="secondary">Optional</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{envVar.description}</p>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Example:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                        {envVar.name}={envVar.example}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`${envVar.name}=${envVar.example}`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Source:</label>
                    <p className="text-sm mt-1">{envVar.source}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="setup">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Database Setup (Supabase)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Go to{" "}
                    <a
                      href="https://supabase.com"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      supabase.com
                    </a>{" "}
                    and create a new project
                  </li>
                  <li>Wait for the project to be ready (2-3 minutes)</li>
                  <li>Go to Settings → API to find your URL and keys</li>
                  <li>
                    Copy the Project URL to <code>SUPABASE_URL</code>
                  </li>
                  <li>
                    Copy the anon/public key to <code>SUPABASE_ANON_KEY</code>
                  </li>
                  <li>
                    Copy the service_role key to <code>SUPABASE_SERVICE_ROLE_KEY</code>
                  </li>
                  <li>Go to Settings → Database to find the connection string</li>
                  <li>
                    Copy the connection string to <code>DATABASE_URL</code>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  OpenAI API Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Go to{" "}
                    <a
                      href="https://platform.openai.com"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      platform.openai.com
                    </a>
                  </li>
                  <li>Sign in or create an account</li>
                  <li>Go to API Keys section</li>
                  <li>Click "Create new secret key"</li>
                  <li>Copy the key (starts with sk-proj-...)</li>
                  <li>
                    Add it as <code>OPENAI_API_KEY</code>
                  </li>
                  <li>Make sure you have billing set up for API usage</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  Vercel Deployment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Push your code to GitHub</li>
                  <li>
                    Go to{" "}
                    <a
                      href="https://vercel.com"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      vercel.com
                    </a>{" "}
                    and import your repository
                  </li>
                  <li>In the deployment settings, add all environment variables</li>
                  <li>
                    Set <code>NEXTAUTH_URL</code> to your Vercel app URL
                  </li>
                  <li>Deploy the application</li>
                  <li>Test all functionality after deployment</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="troubleshooting">
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Common Issues:</strong> Most configuration problems are due to missing or incorrect environment
                variables.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>AI Assistant Not Responding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Check these items:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>
                    Verify <code>OPENAI_API_KEY</code> is set correctly
                  </li>
                  <li>Check OpenAI account has sufficient credits</li>
                  <li>Ensure API key has proper permissions</li>
                  <li>Check browser console for error messages</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Connection Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Check these items:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>
                    Verify <code>DATABASE_URL</code> format is correct
                  </li>
                  <li>Check Supabase project is active and running</li>
                  <li>Ensure database has proper tables (run setup scripts)</li>
                  <li>Verify network connectivity to database</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentication Problems</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Check these items:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>
                    Verify <code>NEXTAUTH_SECRET</code> is set
                  </li>
                  <li>
                    Check <code>NEXTAUTH_URL</code> matches your domain
                  </li>
                  <li>Ensure OAuth providers are configured correctly</li>
                  <li>Check callback URLs in OAuth settings</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
