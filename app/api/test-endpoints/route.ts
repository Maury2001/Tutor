import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXTAUTH_URL
      ? process.env.NEXTAUTH_URL
      : "http://localhost:3000"

  const results = {
    timestamp: new Date().toISOString(),
    baseUrl,
    environment: {
      has_postgres_url: !!(process.env.POSTGRES_URL || process.env.DATABASE_URL),
      has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      has_supabase_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      has_service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    tests: [] as any[],
  }

  // Test 1: Health Check
  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      headers: { "User-Agent": "API-Test" },
    })
    const data = await response.json()

    results.tests.push({
      endpoint: "/api/health",
      method: "GET",
      status: response.status,
      success: response.ok,
      data: data,
      error: null,
    })
  } catch (error) {
    results.tests.push({
      endpoint: "/api/health",
      method: "GET",
      status: 0,
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

  // Test 2: Database Setup (GET)
  try {
    const response = await fetch(`${baseUrl}/api/database/setup`, {
      headers: { "User-Agent": "API-Test" },
    })
    const data = await response.json()

    results.tests.push({
      endpoint: "/api/database/setup",
      method: "GET",
      status: response.status,
      success: response.ok,
      data: data,
      error: null,
    })
  } catch (error) {
    results.tests.push({
      endpoint: "/api/database/setup",
      method: "GET",
      status: 0,
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

  // Test 3: Supabase Test (GET)
  try {
    const response = await fetch(`${baseUrl}/api/database/test-supabase`, {
      headers: { "User-Agent": "API-Test" },
    })
    const data = await response.json()

    results.tests.push({
      endpoint: "/api/database/test-supabase",
      method: "GET",
      status: response.status,
      success: response.ok,
      data: data,
      error: null,
    })
  } catch (error) {
    results.tests.push({
      endpoint: "/api/database/test-supabase",
      method: "GET",
      status: 0,
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

  return NextResponse.json(results)
}
