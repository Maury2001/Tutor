import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin-auth"
import { getServerSession } from "next-auth"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user || !isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { providers } = await request.json()

    if (!providers || !Array.isArray(providers)) {
      return NextResponse.json({ error: "Invalid provider data" }, { status: 400 })
    }

    const supabase = createClient()

    // Update each provider
    for (const provider of providers) {
      const { error } = await supabase
        .from("ai_provider_config")
        .update({
          is_enabled: provider.is_enabled,
          priority: provider.priority,
          config: provider.config,
          rate_limit: provider.rate_limit,
          cost_per_token: provider.cost_per_token,
        })
        .eq("id", provider.id)

      if (error) {
        throw new Error(`Failed to update provider ${provider.provider_name}: ${error.message}`)
      }
    }

    return NextResponse.json({
      message: "Providers updated successfully",
      success: true,
    })
  } catch (error: any) {
    console.error("Error updating AI providers:", error)
    return NextResponse.json({ error: error.message || "Failed to update AI providers" }, { status: 500 })
  }
}
