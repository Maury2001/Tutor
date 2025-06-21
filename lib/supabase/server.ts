import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "./types"
import { Pool } from "@neondatabase/serverless"

// Connection pooling for Neon database
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

export const getPool = () => {
  return pool
}

export const createClient = createServerClient
