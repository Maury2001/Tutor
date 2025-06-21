"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Cloud, DollarSign, Clock, Cpu, HardDrive, Play, Square, Settings, AlertTriangle } from "lucide-react"

interface GPUProvider {
  name: string
  regions: string[]
  instanceTypes: GPUInstanceType[]
}

interface GPUInstanceType {
  id: string
  name: string
  gpuType: string
  gpuCount: number
  memory: string
  vcpus: number
  pricePerHour: number
  maxTrainingTime: number
}

interface TrainingCluster {
  id: string
  provider: string
  instanceType: string
  instanceCount: number
  region: string
  status: "provisioning" | "ready" | "training" | "terminating" | "terminated"
  createdAt: Date
  totalCost: number
}

export function GPUClusterManager() {
  const [providers, setProviders] = useState<GPUProvider[]>([])
  const [clusters, setClusters] = useState<TrainingCluster[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [selectedInstanceType, setSelectedInstanceType] = useState<string>("")
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [instanceCount, setInstanceCount] = useState<number>(1)
  const [estimatedCost, setEstimatedCost] = useState<number>(0)
  const [estimatedHours, setEstimatedHours] = useState<number>(4)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    calculateEstimatedCost()
  }, [selectedProvider, selectedInstanceType, instanceCount, estimatedHours])

  const loadData = async () => {
    try {
      const [providersRes, clustersRes] = await Promise.all([
        fetch("/api/ai/training/gpu-providers"),
        fetch("/api/ai/training/clusters"),
      ])

      setProviders(await providersRes.json())
      setClusters(await clustersRes.json())
    } catch (error) {
      console.error("Failed to load GPU data:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateEstimatedCost = () => {
    if (!selectedProvider || !selectedInstanceType) {
      setEstimatedCost(0)
      return
    }

    const provider = providers.find((p) => p.name === selectedProvider)
    const instanceType = provider?.instanceTypes.find((t) => t.id === selectedInstanceType)

    if (instanceType) {
      const cost = estimatedHours * instanceType.pricePerHour * instanceCount
      setEstimatedCost(cost)
    }
  }

  const provisionCluster = async () => {
    try {
      const response = await fetch("/api/ai/training/provision-cluster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedProvider,
          instanceType: selectedInstanceType,
          instanceCount,
          region: selectedRegion,
        }),
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error("Failed to provision cluster:", error)
    }
  }

  const terminateCluster = async (clusterId: string) => {
    try {
      const response = await fetch(`/api/ai/training/clusters/${clusterId}/terminate`, {
        method: "POST",
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error("Failed to terminate cluster:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-500"
      case "training":
        return "bg-blue-500"
      case "provisioning":
        return "bg-yellow-500"
      case "terminating":
        return "bg-orange-500"
      case "terminated":
        return "bg-gray-500"
      default:
        return "bg-gray-400"
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "aws sagemaker":
        return "🟠"
      case "google cloud ai platform":
        return "🔵"
      case "runpod":
        return "🟣"
      case "vast.ai":
        return "🟢"
      default:
        return "☁️"
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading GPU clusters...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">GPU Cluster Management</h1>
        <p className="text-muted-foreground">Provision and manage cloud GPU clusters for AI model training</p>
      </div>

      <Tabs defaultValue="provision" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="provision">Provision Cluster</TabsTrigger>
          <TabsTrigger value="active">Active Clusters</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="provision" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New GPU Cluster</CardTitle>
              <CardDescription>Select your preferred cloud provider and instance configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="provider">Cloud Provider</Label>
                    <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem key={provider.name} value={provider.name}>
                            <div className="flex items-center gap-2">
                              <span>{getProviderIcon(provider.name)}</span>
                              {provider.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="instance-type">Instance Type</Label>
                    <Select value={selectedInstanceType} onValueChange={setSelectedInstanceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select instance type" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers
                          .find((p) => p.name === selectedProvider)
                          ?.instanceTypes.map((instance) => (
                            <SelectItem key={instance.id} value={instance.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{instance.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {instance.gpuType} • {instance.memory} • ${instance.pricePerHour}/hr
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers
                          .find((p) => p.name === selectedProvider)
                          ?.regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="instance-count">Instance Count</Label>
                    <Input
                      id="instance-count"
                      type="number"
                      min="1"
                      max="8"
                      value={instanceCount}
                      onChange={(e) => setInstanceCount(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="estimated-hours">Estimated Training Hours</Label>
                    <Input
                      id="estimated-hours"
                      type="number"
                      min="1"
                      max="168"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(Number.parseInt(e.target.value) || 4)}
                    />
                  </div>

                  {selectedInstanceType && (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Estimated Cost:</span>
                            <span className="font-bold text-lg">${estimatedCost.toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">GPU Type:</span>
                              <div className="font-medium">
                                {
                                  providers
                                    .find((p) => p.name === selectedProvider)
                                    ?.instanceTypes.find((t) => t.id === selectedInstanceType)?.gpuType
                                }
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Memory:</span>
                              <div className="font-medium">
                                {
                                  providers
                                    .find((p) => p.name === selectedProvider)
                                    ?.instanceTypes.find((t) => t.id === selectedInstanceType)?.memory
                                }
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">vCPUs:</span>
                              <div className="font-medium">
                                {
                                  providers
                                    .find((p) => p.name === selectedProvider)
                                    ?.instanceTypes.find((t) => t.id === selectedInstanceType)?.vcpus
                                }
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Price/Hour:</span>
                              <div className="font-medium">
                                $
                                {providers
                                  .find((p) => p.name === selectedProvider)
                                  ?.instanceTypes.find((t) => t.id === selectedInstanceType)
                                  ?.pricePerHour.toFixed(3)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <Button
                onClick={provisionCluster}
                disabled={!selectedProvider || !selectedInstanceType || !selectedRegion}
                className="w-full"
              >
                <Cloud className="h-4 w-4 mr-2" />
                Provision Cluster (${estimatedCost.toFixed(2)} estimated)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active GPU Clusters</h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-50">
                {clusters.filter((c) => c.status === "ready").length} Ready
              </Badge>
              <Badge variant="outline" className="bg-blue-50">
                {clusters.filter((c) => c.status === "training").length} Training
              </Badge>
            </div>
          </div>

          <div className="grid gap-4">
            {clusters.map((cluster) => (
              <Card key={cluster.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>{getProviderIcon(cluster.provider)}</span>
                        {cluster.id}
                      </CardTitle>
                      <CardDescription>
                        {cluster.instanceType} • {cluster.region} • {cluster.instanceCount} instance(s)
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(cluster.status)}>{cluster.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Runtime</div>
                        <div className="font-medium">
                          {Math.round((Date.now() - cluster.createdAt.getTime()) / (1000 * 60))} min
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Cost</div>
                        <div className="font-medium">${cluster.totalCost.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Provider</div>
                        <div className="font-medium">{cluster.provider}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="font-medium capitalize">{cluster.status}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {cluster.status === "ready" && (
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Start Training
                      </Button>
                    )}
                    {(cluster.status === "ready" || cluster.status === "training") && (
                      <Button size="sm" variant="destructive" onClick={() => terminateCluster(cluster.id)}>
                        <Square className="h-4 w-4 mr-2" />
                        Terminate
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Monitor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {clusters.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Cloud className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Clusters</h3>
                  <p className="text-muted-foreground text-center">
                    Provision your first GPU cluster to start training AI models
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <h2 className="text-xl font-semibold">GPU Pricing Comparison</h2>

          <div className="grid gap-4">
            {providers.map((provider) => (
              <Card key={provider.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{getProviderIcon(provider.name)}</span>
                    {provider.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {provider.instanceTypes.map((instance) => (
                      <div key={instance.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{instance.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {instance.gpuType} • {instance.memory} • {instance.vcpus} vCPUs
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${instance.pricePerHour}/hr</div>
                          <div className="text-sm text-muted-foreground">
                            ~${(instance.pricePerHour * 24).toFixed(0)}/day
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Cost Optimization Tips</h3>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Use spot instances when available for up to 90% savings</li>
                    <li>• Monitor training progress and terminate early if converged</li>
                    <li>• Consider smaller models for experimentation</li>
                    <li>• Use mixed precision training to reduce memory usage</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
