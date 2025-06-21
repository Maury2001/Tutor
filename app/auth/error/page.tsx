"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") as keyof typeof errorMessages

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
          <CardDescription>We encountered an issue while trying to sign you in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessages[error] || errorMessages.Default}</AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">This might be because:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Google OAuth is not properly configured</li>
              <li>Your account doesn't have the required permissions</li>
              <li>The authentication session has expired</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Try Again
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Brain className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium mb-2 text-blue-800">Demo Accounts Available:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>
                <strong>Student:</strong> john.student@cbctutorbot.com
              </p>
              <p>
                <strong>Teacher:</strong> mary.teacher@cbctutorbot.com
              </p>
              <p>
                <strong>Admin:</strong> admin.user@cbctutorbot.com
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
