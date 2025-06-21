"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Download, Calculator, Eye, Target, BookOpen } from "lucide-react"

interface OsmosisDataPoint {
  time: number
  cellSize: number
  waterMovement: number
  internalConcentration: number
  externalConcentration: number
  osmosisRate: number
  equilibrium: boolean
}

interface OsmosisDataAnalyzerProps {
  experimentData: OsmosisDataPoint[]
  experimentType: string
  onAnalysisComplete?: (analysis: any) => void
}

export function OsmosisDataAnalyzer({ experimentData, experimentType, onAnalysisComplete }: OsmosisDataAnalyzerProps) {
  const [analysis, setAnalysis] = useState<any>(null)
  const [selectedMetric, setSelectedMetric] = useState<string>("cellSize")
  const [showCalculations, setShowCalculations] = useState(false)

  useEffect(() => {
    if (experimentData.length > 0) {
      performAnalysis()
    }
  }, [experimentData])

  const performAnalysis = async () => {
    // Perform statistical analysis
    const analysisResult = {
      summary: calculateSummaryStats(),
      trends: identifyTrends(),
      correlations: calculateCorrelations(),
      predictions: makePredictions(),
      cbcAlignment: getCBCAlignment(),
      recommendations: generateRecommendations(),
    }

    setAnalysis(analysisResult)

    if (onAnalysisComplete) {
      onAnalysisComplete(analysisResult)
    }

    // Send to AI for enhanced analysis
    try {
      const response = await fetch("/api/virtual-lab/osmosis-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentType,
          data: experimentData,
          analysis: analysisResult,
        }),
      })

      if (response.ok) {
        const aiAnalysis = await response.json()
        setAnalysis((prev) => ({ ...prev, aiInsights: aiAnalysis.insights }))
      }
    } catch (error) {
      console.error("Failed to get AI analysis:", error)
    }
  }

  const calculateSummaryStats = () => {
    if (experimentData.length === 0) return null

    const cellSizes = experimentData.map((d) => d.cellSize)
    const osmosisRates = experimentData.map((d) => d.osmosisRate)
    const waterMovements = experimentData.map((d) => d.waterMovement)

    return {
      cellSize: {
        min: Math.min(...cellSizes),
        max: Math.max(...cellSizes),
        mean: cellSizes.reduce((a, b) => a + b, 0) / cellSizes.length,
        change: cellSizes[cellSizes.length - 1] - cellSizes[0],
      },
      osmosisRate: {
        min: Math.min(...osmosisRates),
        max: Math.max(...osmosisRates),
        mean: osmosisRates.reduce((a, b) => a + b, 0) / osmosisRates.length,
        peak: Math.max(...osmosisRates.map(Math.abs)),
      },
      waterMovement: {
        total: waterMovements[waterMovements.length - 1] || 0,
        rate:
          waterMovements.length > 1
            ? (waterMovements[waterMovements.length - 1] - waterMovements[0]) / experimentData.length
            : 0,
      },
      equilibriumTime: experimentData.find((d) => d.equilibrium)?.time || null,
    }
  }

  const identifyTrends = () => {
    if (experimentData.length < 3) return []

    const trends = []

    // Cell size trend
    const cellSizeSlope = calculateSlope(experimentData.map((d, i) => [i, d.cellSize]))
    if (Math.abs(cellSizeSlope) > 0.1) {
      trends.push({
        metric: "Cell Size",
        direction: cellSizeSlope > 0 ? "increasing" : "decreasing",
        strength: Math.abs(cellSizeSlope) > 1 ? "strong" : "moderate",
        interpretation:
          cellSizeSlope > 0 ? "Cell is swelling due to water influx" : "Cell is shrinking due to water efflux",
      })
    }

    // Osmosis rate trend
    const rateSlope = calculateSlope(experimentData.map((d, i) => [i, Math.abs(d.osmosisRate)]))
    if (Math.abs(rateSlope) > 0.01) {
      trends.push({
        metric: "Osmosis Rate",
        direction: rateSlope > 0 ? "increasing" : "decreasing",
        strength: Math.abs(rateSlope) > 0.1 ? "strong" : "moderate",
        interpretation: rateSlope < 0 ? "System approaching equilibrium" : "Osmotic gradient increasing",
      })
    }

    return trends
  }

  const calculateSlope = (points: number[][]) => {
    const n = points.length
    const sumX = points.reduce((sum, point) => sum + point[0], 0)
    const sumY = points.reduce((sum, point) => sum + point[1], 0)
    const sumXY = points.reduce((sum, point) => sum + point[0] * point[1], 0)
    const sumXX = points.reduce((sum, point) => sum + point[0] * point[0], 0)

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  }

  const calculateCorrelations = () => {
    if (experimentData.length < 3) return []

    const correlations = []

    // Cell size vs water movement
    const cellSizeWaterCorr = calculateCorrelation(
      experimentData.map((d) => d.cellSize),
      experimentData.map((d) => d.waterMovement),
    )

    if (Math.abs(cellSizeWaterCorr) > 0.5) {
      correlations.push({
        variables: "Cell Size vs Water Movement",
        coefficient: cellSizeWaterCorr,
        strength: Math.abs(cellSizeWaterCorr) > 0.8 ? "strong" : "moderate",
        interpretation:
          cellSizeWaterCorr > 0 ? "Cell size increases with water influx" : "Cell size decreases with water efflux",
      })
    }

    return correlations
  }

  const calculateCorrelation = (x: number[], y: number[]) => {
    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))

    return denominator === 0 ? 0 : numerator / denominator
  }

  const makePredictions = () => {
    if (experimentData.length < 3) return null

    const lastPoint = experimentData[experimentData.length - 1]
    const trend = identifyTrends().find((t) => t.metric === "Cell Size")

    if (!trend) return null

    const timeToEquilibrium = lastPoint.equilibrium
      ? 0
      : Math.abs(lastPoint.osmosisRate) > 0.1
        ? Math.ceil(Math.abs(lastPoint.osmosisRate) * 10)
        : 5

    return {
      equilibriumTime: timeToEquilibrium,
      finalCellSize:
        trend.direction === "increasing"
          ? Math.min(150, lastPoint.cellSize + 10)
          : Math.max(80, lastPoint.cellSize - 10),
      confidence: experimentData.length > 10 ? "high" : "moderate",
    }
  }

  const getCBCAlignment = () => {
    return {
      grade: "Grade 9",
      subject: "Integrated Science",
      strand: "Living Things and Their Environment",
      subStrand: "Cell Structure and Function",
      learningOutcomes: [
        "Explain the process of osmosis in living cells",
        "Describe factors affecting the rate of osmosis",
        "Analyze experimental data to draw conclusions",
        "Apply knowledge of osmosis to real-world situations",
      ],
      competencies: [
        "Scientific Investigation",
        "Data Analysis and Interpretation",
        "Critical Thinking",
        "Communication of Scientific Ideas",
      ],
    }
  }

  const generateRecommendations = () => {
    const recommendations = []

    if (analysis?.summary?.equilibriumTime === null) {
      recommendations.push({
        type: "experimental",
        title: "Extend Observation Time",
        description: "Continue the experiment to observe equilibrium",
        priority: "medium",
      })
    }

    if (experimentData.length < 10) {
      recommendations.push({
        type: "data",
        title: "Increase Data Points",
        description: "Take more frequent measurements for better analysis",
        priority: "high",
      })
    }

    const trends = identifyTrends()
    if (trends.length === 0) {
      recommendations.push({
        type: "experimental",
        title: "Adjust Concentrations",
        description: "Try different concentration gradients to observe clearer trends",
        priority: "medium",
      })
    }

    return recommendations
  }

  const exportData = () => {
    const csvContent = [
      ["Time", "Cell Size", "Water Movement", "Internal Conc.", "External Conc.", "Osmosis Rate"],
      ...experimentData.map((d) => [
        d.time,
        d.cellSize.toFixed(2),
        d.waterMovement.toFixed(2),
        d.internalConcentration.toFixed(1),
        d.externalConcentration.toFixed(1),
        d.osmosisRate.toFixed(3),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `osmosis_experiment_${experimentType}_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Analyzing experimental data...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Osmosis Data Analysis
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{experimentData.length} data points</Badge>
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analysis.summary?.cellSize?.change?.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-gray-600">Cell Size Change</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analysis.summary?.waterMovement?.total?.toFixed(2) || 0}
              </div>
              <div className="text-sm text-gray-600">Total Water Movement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analysis.summary?.equilibriumTime || "N/A"}</div>
              <div className="text-sm text-gray-600">Equilibrium Time (min)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analysis.trends?.length || 0}</div>
              <div className="text-sm text-gray-600">Trends Identified</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="calculations">Calculations</TabsTrigger>
          <TabsTrigger value="cbc">CBC Alignment</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Cell Size Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cell Size Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={experimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cellSize" stroke="#2563eb" strokeWidth={2} name="Cell Size (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Water Movement */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Water Movement</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={experimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="waterMovement"
                      stroke="#16a34a"
                      strokeWidth={2}
                      name="Water Movement (mL)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Concentration Changes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Concentration Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={experimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="internalConcentration"
                      stroke="#dc2626"
                      strokeWidth={2}
                      name="Internal (%)"
                    />
                    <Line
                      type="monotone"
                      dataKey="externalConcentration"
                      stroke="#ea580c"
                      strokeWidth={2}
                      name="External (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Osmosis Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Osmosis Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={experimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="osmosisRate" fill="#7c3aed" name="Osmosis Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Identified Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.trends?.length > 0 ? (
                <div className="space-y-4">
                  {analysis.trends.map((trend: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{trend.metric}</h4>
                        <Badge variant={trend.strength === "strong" ? "default" : "secondary"}>
                          {trend.strength} {trend.direction}
                        </Badge>
                      </div>
                      <p className="text-gray-700">{trend.interpretation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No significant trends detected. Try extending the experiment or adjusting parameters.
                </p>
              )}
            </CardContent>
          </Card>

          {analysis.correlations?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Correlations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.correlations.map((corr: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{corr.variables}</span>
                        <Badge variant="outline">r = {corr.coefficient.toFixed(3)}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{corr.interpretation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calculations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Osmosis Calculations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Water Potential Calculation</h4>
                  <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                    <div>Ψ = Ψₛ + Ψₚ</div>
                    <div className="mt-2 text-gray-600">
                      Where:
                      <br />Ψ = Water potential
                      <br />
                      Ψₛ = Solute potential = -iMRT
                      <br />
                      Ψₚ = Pressure potential
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Osmotic Pressure</h4>
                  <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                    <div>π = iMRT</div>
                    <div className="mt-2 text-gray-600">
                      Where:
                      <br />π = Osmotic pressure
                      <br />i = van't Hoff factor
                      <br />M = Molarity
                      <br />R = Gas constant (0.0831 L·bar/mol·K)
                      <br />T = Temperature (K)
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Rate of Osmosis</h4>
                  <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                    <div>Rate = ΔV/Δt</div>
                    <div className="mt-2 text-gray-600">
                      Current rate: {analysis.summary?.waterMovement?.rate?.toFixed(4) || 0} mL/min
                    </div>
                  </div>
                </div>

                {analysis.predictions && (
                  <div>
                    <h4 className="font-semibold mb-3">Predictions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 border rounded">
                        <div className="text-sm text-gray-600">Time to Equilibrium</div>
                        <div className="text-lg font-semibold">{analysis.predictions.equilibriumTime} minutes</div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-sm text-gray-600">Predicted Final Cell Size</div>
                        <div className="text-lg font-semibold">{analysis.predictions.finalCellSize.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cbc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                CBC Curriculum Alignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Curriculum Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Grade:</span>
                      <div className="font-medium">{analysis.cbcAlignment.grade}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Subject:</span>
                      <div className="font-medium">{analysis.cbcAlignment.subject}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Strand:</span>
                      <div className="font-medium">{analysis.cbcAlignment.strand}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Sub-strand:</span>
                      <div className="font-medium">{analysis.cbcAlignment.subStrand}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Learning Outcomes</h4>
                  <ul className="space-y-2">
                    {analysis.cbcAlignment.learningOutcomes.map((outcome: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Core Competencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.cbcAlignment.competencies.map((competency: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {competency}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.aiInsights ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{analysis.aiInsights}</div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating AI insights...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {analysis.recommendations?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{rec.title}</h5>
                        <Badge variant={rec.priority === "high" ? "destructive" : "secondary"}>{rec.priority}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
