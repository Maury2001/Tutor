"use client"

import { ExperimentAlternator } from "@/components/virtual-lab/experiment-alternator"

export default function OsmosisExperimentsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Complete Osmosis Laboratory</h1>
        <p className="text-gray-600">
          Interactive experiments covering all aspects of osmosis - from molecular movement to cellular effects
        </p>
      </div>

      {/* Main Experiment Interface */}
      <ExperimentAlternator />
    </div>
  )
}
