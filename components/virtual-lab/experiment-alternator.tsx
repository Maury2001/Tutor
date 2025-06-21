"use client"

import type React from "react"
import { useState } from "react"
import { PlasmolysisExperiment } from "./plasmolysis-experiment"
import { OsmosisExperiment } from "./osmosis-experiment"
import { Cell3DViewer } from "./cell-3d-viewer"

interface Experiment {
  id: string
  title: string
  description: string
  difficulty: string
  duration: string
  materials: string[]
  component: React.ComponentType<any>
}

const experiments: Experiment[] = [
  {
    id: "plasmolysis",
    title: "Plasmolysis Simulation",
    description: "Observe the effects of different solution concentrations on plant cells.",
    difficulty: "Beginner",
    duration: "10-15 minutes",
    materials: ["Microscope", "Plant cells", "Various salt solutions"],
    component: PlasmolysisExperiment,
  },
  {
    id: "osmosis",
    title: "Osmosis Simulation",
    description: "Explore the principles of osmosis and diffusion across a semi-permeable membrane.",
    difficulty: "Intermediate",
    duration: "15-20 minutes",
    materials: ["Semi-permeable membrane", "Water", "Sugar solutions"],
    component: OsmosisExperiment,
  },
  {
    id: "3d-cell-viewer",
    title: "3D Cell Structure",
    description: "Interactive 3D visualization of plasmolyzed cells with rotation and cross-section views",
    difficulty: "Advanced",
    duration: "15-20 minutes",
    materials: ["3D visualization software", "Interactive controls"],
    component: Cell3DViewer,
  },
]

interface ExperimentAlternatorProps {
  solutionConcentration: number
  isRunning: boolean
}

export const ExperimentAlternator: React.FC<ExperimentAlternatorProps> = ({ solutionConcentration, isRunning }) => {
  const [currentExperimentId, setCurrentExperimentId] = useState<string>(experiments[0].id)

  const handleExperimentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentExperimentId(event.target.value)
  }

  const renderCurrentExperiment = () => {
    switch (currentExperimentId) {
      case "plasmolysis":
        return <PlasmolysisExperiment solutionConcentration={solutionConcentration} isRunning={isRunning} />
      case "osmosis":
        return <OsmosisExperiment solutionConcentration={solutionConcentration} isRunning={isRunning} />
      case "3d-cell-viewer":
        return (
          <Cell3DViewer
            solutionConcentration={solutionConcentration}
            isRunning={isRunning}
            plasmolysisLevel={calculatePlasmolysisLevel(solutionConcentration)}
          />
        )
      default:
        return <p>Select an experiment.</p>
    }
  }

  const calculatePlasmolysisLevel = (solutionConcentration: number): number => {
    // Simple linear relationship for demonstration purposes
    return Math.min(1, Math.max(0, solutionConcentration / 10))
  }

  return (
    <div>
      <label htmlFor="experiment-select">Select Experiment:</label>
      <select id="experiment-select" value={currentExperimentId} onChange={handleExperimentChange}>
        {experiments.map((experiment) => (
          <option key={experiment.id} value={experiment.id}>
            {experiment.title}
          </option>
        ))}
      </select>
      <div>{renderCurrentExperiment()}</div>
    </div>
  )
}
