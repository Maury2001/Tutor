"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff, RefreshCw, BookOpen, Users, Zap } from "lucide-react"

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    window.location.reload()
  }

  const offlineFeatures = [
    {
      icon: BookOpen,
      title: "Cached Lessons",
      description: "Access previously viewed curriculum content and lessons",
    },
    {
      icon: Users,
      title: "Student Progress",
      description: "View cached student progress and performance data",
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "Continue working with saved drafts and offline tools",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Connection Status Alert */}
        <Alert className={`border-2 ${isOnline ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
          <WifiOff className={`h-4 w-4 ${isOnline ? "text-green-600" : "text-orange-600"}`} />
          <AlertDescription className={isOnline ? "text-green-800" : "text-orange-800"}>
            {isOnline
              ? "Connection restored! You can now access all features."
              : "You are currently offline. Some features may be limited."}
          </AlertDescription>
        </Alert>

        {/* Main Offline Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <WifiOff className="w-10 h-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">You're Offline</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Don't worry! You can still access cached content and continue learning.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Retry Button */}
            <div className="text-center">
              <Button
                onClick={handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                disabled={!isOnline}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {isOnline ? "Reload Page" : `Retry Connection ${retryCount > 0 ? `(${retryCount})` : ""}`}
              </Button>
            </div>

            {/* Available Offline Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 text-center">Available Offline Features</h3>
              <div className="grid gap-4">
                {offlineFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Options */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="outline" onClick={() => window.history.back()} className="w-full">
                Go Back
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/dashboard")} className="w-full">
                Dashboard
              </Button>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Offline Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your progress is automatically saved locally</li>
                <li>• Changes will sync when connection is restored</li>
                <li>• Previously viewed content remains accessible</li>
                <li>• Check your network settings if issues persist</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
