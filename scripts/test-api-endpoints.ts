// Test script for database API endpoints
async function testDatabaseEndpoints() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  console.log("🧪 Testing Database API Endpoints...\n")

  // Test 1: Database Setup Endpoint (GET)
  console.log("1️⃣ Testing /api/database/setup (GET)...")
  try {
    const response = await fetch(`${baseUrl}/api/database/setup`)
    const data = await response.json()

    console.log("✅ Status:", response.status)
    console.log("📊 Response:", JSON.stringify(data, null, 2))

    if (data.success) {
      console.log("✅ Database connection: SUCCESS")
      if (data.statistics) {
        console.log(`📈 Users: ${data.statistics.users}`)
        console.log(`🏫 Schools: ${data.statistics.schools}`)
        console.log(`📚 Learning Areas: ${data.statistics.learning_areas}`)
        console.log(`🎯 Outcomes: ${data.statistics.curriculum_outcomes}`)
      }
    } else {
      console.log("❌ Database connection: FAILED")
      console.log("🚨 Error:", data.error)
    }
  } catch (error) {
    console.log("❌ Request failed:", error)
  }

  console.log("\n" + "=".repeat(50) + "\n")

  // Test 2: Database Setup Endpoint (POST)
  console.log("2️⃣ Testing /api/database/setup (POST)...")
  try {
    const response = await fetch(`${baseUrl}/api/database/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()

    console.log("✅ Status:", response.status)
    console.log("📊 Response:", JSON.stringify(data, null, 2))
  } catch (error) {
    console.log("❌ Request failed:", error)
  }

  console.log("\n" + "=".repeat(50) + "\n")

  // Test 3: Supabase Test Endpoint (GET)
  console.log("3️⃣ Testing /api/database/test-supabase (GET)...")
  try {
    const response = await fetch(`${baseUrl}/api/database/test-supabase`)
    const data = await response.json()

    console.log("✅ Status:", response.status)
    console.log("📊 Response:", JSON.stringify(data, null, 2))

    if (data.success) {
      console.log("✅ Supabase connection: SUCCESS")
      console.log(`📚 Learning Areas Count: ${data.learning_areas_count}`)
      if (data.sample_learning_areas) {
        console.log("📋 Sample Areas:", data.sample_learning_areas.map((a) => a.name).join(", "))
      }
    } else {
      console.log("❌ Supabase connection: FAILED")
      console.log("🚨 Error:", data.error)
    }
  } catch (error) {
    console.log("❌ Request failed:", error)
  }

  console.log("\n" + "=".repeat(50) + "\n")

  // Test 4: Supabase Test Endpoint (POST)
  console.log("4️⃣ Testing /api/database/test-supabase (POST)...")
  try {
    const response = await fetch(`${baseUrl}/api/database/test-supabase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()

    console.log("✅ Status:", response.status)
    console.log("📊 Response:", JSON.stringify(data, null, 2))

    if (data.success) {
      console.log("✅ Supabase write test: SUCCESS")
      console.log("✅ Test user created and deleted successfully")
    } else {
      console.log("❌ Supabase write test: FAILED")
      console.log("🚨 Error:", data.error)
    }
  } catch (error) {
    console.log("❌ Request failed:", error)
  }

  console.log("\n🏁 Testing completed!")
}

// Run the tests
testDatabaseEndpoints().catch(console.error)
