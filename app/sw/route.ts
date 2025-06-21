import { NextResponse } from "next/server"

export async function GET() {
  // Check if we're in a preview/development environment
  const isPreviewEnvironment = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview"

  if (isPreviewEnvironment) {
    // Return a minimal service worker for development
    const minimalSW = `
      console.log('Service Worker: Development mode - minimal functionality');
      
      self.addEventListener('install', (event) => {
        console.log('Service Worker: Installing (dev mode)');
        self.skipWaiting();
      });
      
      self.addEventListener('activate', (event) => {
        console.log('Service Worker: Activating (dev mode)');
        self.clients.claim();
      });
      
      self.addEventListener('fetch', (event) => {
        // In development, just pass through all requests
        return;
      });
    `

    return new NextResponse(minimalSW, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  }

  // Full service worker for production
  const swCode = `
const CACHE_NAME = "cbc-learning-platform-v1"
const OFFLINE_URL = "/offline"

// Assets to cache on install
const STATIC_CACHE_URLS = [
  "/",
  "/dashboard",
  "/tutor",
  "/curriculum",
  "/virtual-lab",
  "/offline",
  "/auth/signin",
  "/auth/signup"
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets")
        return cache.addAll(STATIC_CACHE_URLS.map(url => new Request(url, { cache: 'reload' })))
      })
      .then(() => {
        console.log("Service Worker: Skip waiting")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("Service Worker: Cache failed", error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache", cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log("Service Worker: Claiming clients")
        return self.clients.claim()
      })
  )
})

// Fetch event - handle requests with different strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  // Handle API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request))
    return
  }

  // Handle static assets
  if (request.destination === "style" || request.destination === "script" || request.destination === "image") {
    event.respondWith(handleStaticAssets(request))
    return
  }

  // Default: try network first, then cache
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
      .then(response => response || new Response('Not found', { status: 404 }))
  )
})

// Handle API requests - Network first with cache fallback
async function handleApiRequest(request) {
  const cache = await caches.open(CACHE_NAME)

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "You are currently offline. Please check your connection.",
        offline: true,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    const offlineResponse = await cache.match(OFFLINE_URL)
    if (offlineResponse) {
      return offlineResponse
    }

    return new Response("Offline", { status: 503 })
  }
}

// Handle static assets - Cache first
async function handleStaticAssets(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return new Response("", { status: 404 })
  }
}

// Message handling
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
`

  return new NextResponse(swCode, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}

export async function HEAD() {
  return new NextResponse(null, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
    },
  })
}
