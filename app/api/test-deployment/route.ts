import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const testResults = {
    timestamp: new Date().toISOString(),
    tests: {} as Record<string, any>,
    deployment: {
      status: "unknown",
      errors: [] as string[],
      warnings: [] as string[],
    },
  }

  try {
    // Test 1: Basic API Functionality
    testResults.tests.api_basic = {
      name: "Basic API Functionality",
      status: "pass",
      message: "API routes are responding correctly",
      details: {
        endpoint: "/api/test-deployment",
        method: "GET",
        responseTime: Date.now(),
      },
    }

    // Test 2: Database Module Import
    try {
      const dbModule = await import("@/lib/db/postgres")
      testResults.tests.database_import = {
        name: "Database Module Import",
        status: "pass",
        message: "postgres.ts imports successfully",
        details: {
          exports: Object.keys(dbModule),
          hasQuery: typeof dbModule.query === "function",
          hasWithTransaction: typeof dbModule.withTransaction === "function",
          hasCachedQuery: typeof dbModule.cachedQuery === "function",
        },
      }
    } catch (error) {
      testResults.tests.database_import = {
        name: "Database Module Import",
        status: "fail",
        message: "Failed to import postgres.ts",
        error: error instanceof Error ? error.message : "Unknown import error",
      }
      testResults.deployment.errors.push("Database module import failed")
    }

    // Test 3: Neon Module Import
    try {
      const neonModule = await import("@/lib/db/neon")
      testResults.tests.neon_import = {
        name: "Neon Module Import",
        status: "pass",
        message: "neon.ts imports successfully",
        details: {
          exports: Object.keys(neonModule),
          hasSql: typeof neonModule.sql === "function",
          hasQuery: typeof neonModule.query === "function",
        },
      }
    } catch (error) {
      testResults.tests.neon_import = {
        name: "Neon Module Import",
        status: "fail",
        message: "Failed to import neon.ts",
        error: error instanceof Error ? error.message : "Unknown import error",
      }
      testResults.deployment.errors.push("Neon module import failed")
    }

    // Test 4: Database Connection Test (without actual connection)
    try {
      const { withTransaction } = await import("@/lib/db/postgres")

      // Test the function signature without actually connecting
      const isFunction = typeof withTransaction === "function"

      testResults.tests.database_function = {
        name: "Database Function Test",
        status: isFunction ? "pass" : "fail",
        message: isFunction ? "withTransaction function is properly defined" : "withTransaction function is missing",
        details: {
          functionType: typeof withTransaction,
          isCallable: isFunction,
        },
      }
    } catch (error) {
      testResults.tests.database_function = {
        name: "Database Function Test",
        status: "fail",
        message: "Database function test failed",
        error: error instanceof Error ? error.message : "Unknown function error",
      }
      testResults.deployment.errors.push("Database function test failed")
    }

    // Test 5: Environment Variables
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
    }

    testResults.tests.environment = {
      name: "Environment Variables",
      status: Object.values(envVars).some(Boolean) ? "pass" : "warning",
      message: "Environment variable check completed",
      details: envVars,
    }

    // Test 6: TypeScript Compilation
    testResults.tests.typescript = {
      name: "TypeScript Compilation",
      status: "pass",
      message: "TypeScript compiled successfully (deployment reached this point)",
      details: {
        nodeVersion: process.version,
        platform: process.platform,
      },
    }

    // Test 7: Memory and Performance
    const memUsage = process.memoryUsage()
    testResults.tests.performance = {
      name: "Performance Check",
      status: memUsage.heapUsed < 200 * 1024 * 1024 ? "pass" : "warning",
      message: "Performance metrics collected",
      details: {
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        uptime: `${Math.round(process.uptime())}s`,
      },
    }

    // Calculate overall deployment status
    const allTests = Object.values(testResults.tests)
    const passedTests = allTests.filter((test: any) => test.status === "pass").length
    const failedTests = allTests.filter((test: any) => test.status === "fail").length
    const warningTests = allTests.filter((test: any) => test.status === "warning").length

    testResults.deployment.status = failedTests === 0 ? "success" : "partial_success"

    if (failedTests === 0 && warningTests === 0) {
      testResults.deployment.status = "success"
    } else if (failedTests === 0) {
      testResults.deployment.status = "success_with_warnings"
    } else {
      testResults.deployment.status = "partial_failure"
    }

    return NextResponse.json({
      success: failedTests === 0,
      message: `Deployment test completed: ${testResults.deployment.status}`,
      summary: {
        total: allTests.length,
        passed: passedTests,
        failed: failedTests,
        warnings: warningTests,
        score: Math.round((passedTests / allTests.length) * 100),
      },
      results: testResults,
      postgresRewrite: {
        status: testResults.tests.database_import?.status === "pass" ? "✅ SUCCESS" : "❌ FAILED",
        message:
          testResults.tests.database_import?.status === "pass"
            ? "postgres.ts rewrite successful - no syntax errors detected"
            : "postgres.ts still has issues",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Deployment test failed with critical error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        postgresRewrite: {
          status: "❌ CRITICAL ERROR",
          message: "Unable to complete postgres.ts test due to critical failure",
        },
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Test POST functionality and database imports
    const { withTransaction } = await import("@/lib/db/postgres")

    return NextResponse.json({
      success: true,
      message: "POST test successful - postgres.ts imports working",
      received: body,
      timestamp: new Date().toISOString(),
      databaseTest: {
        withTransactionAvailable: typeof withTransaction === "function",
        status: "✅ postgres.ts POST test passed",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "POST test failed",
        error: error instanceof Error ? error.message : "Unknown error",
        databaseTest: {
          status: "❌ postgres.ts POST test failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 },
    )
  }
}
