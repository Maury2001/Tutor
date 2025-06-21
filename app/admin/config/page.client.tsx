"use client"

import type React from "react"
import { Suspense } from "react"
import { ConfigDashboard } from "@/components/admin/config-dashboard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// Simple Error Boundary Component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>
  } catch (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load system configuration. Please refresh the page or contact support.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
}

function ConfigPageContent() {
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">System Configuration</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and configure system settings for the CBC Tutorbot Platform
          </p>
        </div>

        <div className="w-full">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading configuration...</span>
              </div>
            }
          >
            <ErrorBoundary>
              <ConfigDashboard />
            </ErrorBoundary>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default function ConfigPageClient() {
  return (
    <ErrorBoundary>
      <ConfigPageContent />
    </ErrorBoundary>
  )
}
