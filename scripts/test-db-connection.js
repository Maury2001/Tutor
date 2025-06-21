const { neon } = require("@neondatabase/serverless")

async function testConnection() {
  try {
    if (!process.env.POSTGRES_URL) {
      console.error("❌ POSTGRES_URL environment variable is not set")
      process.exit(1)
    }

    console.log("🔄 Testing database connection...")

    const sql = neon(process.env.POSTGRES_URL)
    const result = await sql`SELECT NOW() as current_time, version() as db_version`

    console.log("✅ Database connection successful!")
    console.log("📊 Connection details:")
    console.log(`   Time: ${result[0].current_time}`)
    console.log(`   Version: ${result[0].db_version.split(" ")[0]}`)
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    process.exit(1)
  }
}

testConnection()
