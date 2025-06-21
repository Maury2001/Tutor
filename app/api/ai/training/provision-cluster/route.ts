import { type NextRequest, NextResponse } from "next/server"
import { CloudGPUManager } from "@/lib/ai/model-training/cloud-gpu-providers"

const gpuManager = new CloudGPUManager()

export async function POST(request: NextRequest) {
  try {
    const { provider, instanceType, instanceCount, region } = await request.json()

    if (!provider || !instanceType || !region) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cluster = await gpuManager.provisionCluster(provider, instanceType, instanceCount || 1, region)

    return NextResponse.json(cluster)
  } catch (error) {
    console.error("Cluster provisioning error:", error)
    return NextResponse.json({ error: "Failed to provision cluster" }, { status: 500 })
  }
}
