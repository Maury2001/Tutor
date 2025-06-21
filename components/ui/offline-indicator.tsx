"use client"

import { useServiceWorker } from "@/components/providers/service-worker-provider"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, AlertCircle } from "lucide-react"

export function OfflineIndicator() {
  const { isOnline, isRegistered, isSupported } = useServiceWorker()

  // Only show indicator if we have meaningful status to display
  if (!isOnline || (isSupported && isRegistered)) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-2 px-3 py-2">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              Offline
            </>
          )}
        </Badge>
      </div>
    )
  }

  // Show development notice if service worker is not supported
  if (!isSupported && process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Badge variant="secondary" className="flex items-center gap-2 px-3 py-2">
          <AlertCircle className="h-4 w-4" />
          Dev Mode
        </Badge>
      </div>
    )
  }

  return null
}
