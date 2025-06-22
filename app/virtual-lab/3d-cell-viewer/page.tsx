"use client";

import { useState } from "react";
import { Cell3DViewer } from "@/components/virtual-lab/cell-3d-viewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Cell3DViewerPage() {
  const [solutionConcentration, setSolutionConcentration] = useState(1.0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Calculate plasmolysis level based on solution concentration
  const calculatePlasmolysisLevel = (concentration: number) => {
    if (concentration > 1.0) {
      return Math.min(0.8, (concentration - 1.0) * 0.4);
    } else if (concentration < 0.5) {
      return Math.max(-0.2, (concentration - 0.5) * 0.1);
    }
    return 0;
  };

  const getSolutionType = (concentration: number) => {
    if (concentration < 0.5) return "Hypotonic";
    if (concentration <= 1.5) return "Isotonic";
    return "Hypertonic";
  };

  const resetExperiment = () => {
    setSolutionConcentration(1.0);
    setTimeElapsed(0);
    setIsRunning(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Link href="/virtual-lab">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Virtual Lab
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">3D Cell Structure Viewer</h1>
        <p className="text-gray-600">
          Interactive 3D visualization of plant cell plasmolysis with real-time
          rotation and cross-sectional analysis
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Experiment Controls
            <Badge variant="outline" className="ml-2">
              {getSolutionType(solutionConcentration)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              variant={isRunning ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? "Pause" : "Start"} Experiment
            </Button>
            <Button onClick={resetExperiment} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <div className="text-sm text-gray-600">
              Plasmolysis Level:{" "}
              {(calculatePlasmolysisLevel(solutionConcentration) * 100).toFixed(
                1
              )}
              %
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Solution Concentration: {solutionConcentration.toFixed(1)}%
              Sucrose
            </label>
            <Slider
              value={[solutionConcentration]}
              onValueChange={(value) => setSolutionConcentration(value[0])}
              max={5.0}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>0.1% (Hypotonic)</span>
              <span>1.0% (Isotonic)</span>
              <span>5.0% (Hypertonic)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3D Viewer */}
      <Cell3DViewer
        solutionConcentration={solutionConcentration}
        isRunning={isRunning}
        plasmolysisLevel={calculatePlasmolysisLevel(solutionConcentration)}
      />

      {/* Educational Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>3D Visualization Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>
                  Better understanding of spatial relationships between cell
                  components
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>
                  Interactive rotation reveals hidden structural details
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Cross-sectional views show internal organization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Real-time visualization of plasmolysis progression</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Enhanced depth perception through lighting effects</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interaction Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Mouse Controls:</span>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Drag to rotate the cell in 3D space</li>
                  <li>• Use zoom slider to get closer views</li>
                  <li>• Click components to focus on specific parts</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold">View Modes:</span>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Solid: Realistic 3D rendering with lighting</li>
                  <li>• Wireframe: Structural outline view</li>
                  <li>• Cross-section: Internal structure analysis</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold">Auto-rotation:</span>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Enable for continuous 360° viewing</li>
                  <li>• Disable for manual control and detailed study</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
