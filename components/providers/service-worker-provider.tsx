"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "@/hooks/use-toast"

interface ServiceWorkerContextType {
  isSupported: boolean
  isRegistered: boolean
  isOnline: boolean
  updateAvailable: boolean
  registration: ServiceWorkerRegistration | null
  updateServiceWorker: () => void
  unregisterServiceWorker: () => void
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType | undefined>(undefined)

export function useServiceWorker() {
  const context = useContext(ServiceWorkerContext)
  if (context === undefined) {
    throw new Error("useServiceWorker must be used within a ServiceWorkerProvider")
  }
  return context
}

interface ServiceWorkerProviderProps {
  children: ReactNode
}

export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check if we're in a development or preview environment
    const isPreviewEnvironment =
      window.location.hostname.includes("vusercontent.net") ||
      window.location.hostname.includes("localhost") ||
      window.location.hostname.includes("127.0.0.1") ||
      process.env.NODE_ENV === "development"

    // Check if service workers are supported
    if ("serviceWorker" in navigator && !isPreviewEnvironment) {
      setIsSupported(true)
      registerServiceWorker()
    } else {
      console.log("Service Worker: Skipped registration (development/preview environment)")
      setIsSupported(false)
    }

    // Set up online/offline listeners regardless of service worker support
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "Connection Restored",
        description: "You're back online! All features are now available.",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You're Offline",
        description: "Some features may be limited while offline.",
        variant: "destructive",
      })
    }

    setIsOnline(navigator.onLine)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const registerServiceWorker = async () => {
    try {
      // First, check if the service worker endpoint is available
      const testResponse = await fetch("/sw", { method: "HEAD" })
      if (!testResponse.ok) {
        throw new Error("Service worker endpoint not available")
      }

      // Check content type
      const contentType = testResponse.headers.get("content-type")
      if (!contentType || !contentType.includes("javascript")) {
        throw new Error("Service worker has incorrect MIME type")
      }

      // Register the service worker
      const reg = await navigator.serviceWorker.register("/sw", {
        scope: "/",
        updateViaCache: "none",
      })

      setRegistration(reg)
      setIsRegistered(true)

      // Check for updates
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateAvailable(true)
              toast({
                title: "Update Available",
                description: "A new version is available. Click to update.",
                action: (
                  <button
                    onClick={updateServiceWorker}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Update
                  </button>
                ),
              })
            }
          })
        }
      })

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "CACHE_UPDATED") {
          toast({
            title: "Content Updated",
            description: "New content has been cached for offline use.",
          })
        }
      })

      console.log("Service Worker registered successfully")

      // Show success message only in production
      if (process.env.NODE_ENV === "production") {
        toast({
          title: "Offline Mode Enabled",
          description: "You can now use this app offline!",
        })
      }
    } catch (error) {
      console.warn("Service Worker registration failed:", error)

      // Don't show error toast in development/preview environments
      const isPreviewEnvironment =
        window.location.hostname.includes("vusercontent.net") || window.location.hostname.includes("localhost")

      if (!isPreviewEnvironment) {
        toast({
          title: "Offline Mode Unavailable",
          description: "Could not enable offline features, but the app will work normally.",
          variant: "destructive",
        })
      }

      setIsSupported(false)
      setIsRegistered(false)
    }
  }

  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" })
      window.location.reload()
    }
  }

  const unregisterServiceWorker = async () => {
    if (registration) {
      const success = await registration.unregister()
      if (success) {
        setIsRegistered(false)
        setRegistration(null)
        toast({
          title: "Service Worker Unregistered",
          description: "Offline features have been disabled.",
        })
      }
    }
  }

  const value: ServiceWorkerContextType = {
    isSupported,
    isRegistered,
    isOnline,
    updateAvailable,
    registration,
    updateServiceWorker,
    unregisterServiceWorker,
  }

  return <ServiceWorkerContext.Provider value={value}>{children}</ServiceWorkerContext.Provider>
}
