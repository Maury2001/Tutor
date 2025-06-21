import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the auth session cookie
  const sessionCookie = request.cookies.get("auth-session")
  let user = null

  if (sessionCookie) {
    try {
      user = JSON.parse(sessionCookie.value)
    } catch (error) {
      // Invalid session cookie
    }
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/auth/error", "/_next", "/favicon.ico", "/public"]

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route) || pathname === "/")

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (!user || user.role !== "admin") {
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Teacher routes protection
  if (pathname.startsWith("/teacher")) {
    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Student routes and dashboard protection
  if (pathname.startsWith("/student") || pathname.startsWith("/dashboard")) {
    if (!user) {
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
