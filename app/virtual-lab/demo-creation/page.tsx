"use client"
import { DemoExperimentCreation } from "@/components/virtual-lab/demo-experiment-creation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DemoCreationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Link href="/virtual-lab">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Virtual Lab
            </Button>
          </Link>
        </div>

        <DemoExperimentCreation />
      </div>
    </div>
  )
}
