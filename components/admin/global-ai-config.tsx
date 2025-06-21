"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Settings, Save, RefreshCw, CheckCircle, DollarSign, Activity, Clock } from "lucide-react"
import { AIConfigTemplates } from "./ai-config-templates"

interface GlobalConfig {
  id: number
  config_key: string
  config_value: any
  description?: string
  category: string
  is_active: boolean
}

interface ProviderConfig {
  id: number
  provider_name: string
  is_enabled: boolean
  priority: number
  config: any
  rate_limit: number
  cost_per_token: number
}

interface UsageStats {
  totalRequests: number
  totalTokens: number
  totalCost: number
  averageResponseTime: number
  successRate: number
  modelUsage: Record<string, number>
  providerUsage: Record<string, number>
  dailyUsage: Record<string, number>
}

export function GlobalAIConfig() {
  const [configs, setConfigs] = useState<GlobalConfig[]>([])
  const [providers, setProviders] = useState<ProviderConfig[]>([])
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [costInfo, setCostInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [updateReason, setUpdateReason] = useState("")

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/ai-config")
      const data = await response.json()

      if (data.success) {
        setConfigs(data.configs)
        setProviders(data.providers)
        setUsageStats(data.usageStats)
        setCostInfo(data.costInfo)
      }
    } catch (error) {
      console.error("Failed to fetch config:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = (key: string, value: any) => {
    setConfigs((prev) =>
      prev.map((config) => (config.config_key === key ? { ...config, config_value: value } : config)),
    )
  }

  const updateProvider = (id: number, field: string, value: any) => {
    setProviders((prev) => prev.map((provider) => (provider.id === id ? { ...provider, [field]: value } : provider)))
  }

  const saveConfig = async () => {
    try {
      setSaving(true)

      // Save global configs
      const configUpdates = configs.map((config) => ({
        key: config.config_key,
        value: config.config_value,
      }))

      const configResponse = await fetch("/api/admin/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          configs: configUpdates,
          reason: updateReason || "Admin configuration update",
        }),
      })

      // Save provider configs
      const providerResponse = await fetch("/api/admin/ai-config/providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providers }),
      })

      if (configResponse.ok && providerResponse.ok) {
        alert("Configuration saved successfully!")
        setUpdateReason("")
        await fetchConfig() // Refresh data
      } else {
        throw new Error("Failed to save configuration")
      }
    } catch (error) {
      console.error("Failed to save config:", error)
      alert("Failed to save configuration. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const getConfigValue = (key: string, defaultValue: any = null) => {
    const config = configs.find((c) => c.config_key === key)
    return config ? config.config_value : defaultValue
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading AI configuration...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Global AI Configuration
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Configure system-wide AI settings that apply to all users</p>
            <div className="flex gap-2">
              <Button onClick={fetchConfig} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button onClick={saveConfig} disabled={saving}>
                <Save className="h-4 w-4 mr-1" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Daily Cost</p>
                <p className="text-2xl font-bold">${costInfo?.currentCost?.toFixed(2) || "0.00"}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={(costInfo?.currentCost / costInfo?.limit) * 100} className="mt-2" />
            <p className="text-xs text-gray-500 mt-1">of ${costInfo?.limit} limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Requests</p>
                <p className="text-2xl font-bold">{usageStats?.totalRequests || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold">{usageStats?.successRate?.toFixed(1) || 0}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Response success</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold">{usageStats?.averageResponseTime?.toFixed(0) || 0}ms</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Response time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="limits">Limits & Control</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Default AI Model Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Default AI Model</Label>
                  <Select
                    value={getConfigValue("default_model", "llama3-70b-8192")}
                    onValueChange={(value) => updateConfig("default_model", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llama3-70b-8192">Llama 3 70B (Free)</SelectItem>
                      <SelectItem value="llama3-8b-8192">Llama 3 8B (Free)</SelectItem>
                      <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B (Free)</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini (Paid)</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o (Paid)</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Paid)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Fallback Strategy</Label>
                  <Select
                    value={getConfigValue("fallback_strategy", "balanced")}
                    onValueChange={(value) => updateConfig("fallback_strategy", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="speed_first">Speed First</SelectItem>
                      <SelectItem value="quality_first">Quality First</SelectItem>
                      <SelectItem value="free_only">Free Only</SelectItem>
                      <SelectItem value="same_provider">Same Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-fallback</Label>
                  <p className="text-sm text-gray-500">Automatically try other models if primary fails</p>
                </div>
                <Switch
                  checked={getConfigValue("auto_fallback", true)}
                  onCheckedChange={(checked) => updateConfig("auto_fallback", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Model Info</Label>
                  <p className="text-sm text-gray-500">Display which model generated each response</p>
                </div>
                <Switch
                  checked={getConfigValue("show_model_info", false)}
                  onCheckedChange={(checked) => updateConfig("show_model_info", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Response Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Temperature: {getConfigValue("temperature", 0.7)}</Label>
                <Slider
                  value={[getConfigValue("temperature", 0.7)]}
                  onValueChange={(value) => updateConfig("temperature", value[0])}
                  max={2}
                  min={0}
                  step={0.1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>More Focused</span>
                  <span>More Creative</span>
                </div>
              </div>

              <div>
                <Label>Max Tokens: {getConfigValue("max_tokens", 800)}</Label>
                <Slider
                  value={[getConfigValue("max_tokens", 800)]}
                  onValueChange={(value) => updateConfig("max_tokens", value[0])}
                  max={2000}
                  min={100}
                  step={100}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Shorter Responses</span>
                  <span>Longer Responses</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rate Limits & Cost Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Rate Limit (requests per user per hour)</Label>
                <Input
                  type="number"
                  value={getConfigValue("rate_limit_per_user", 100)}
                  onChange={(e) => updateConfig("rate_limit_per_user", Number.parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Daily Cost Limit (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={getConfigValue("daily_cost_limit", 50)}
                  onChange={(e) => updateConfig("daily_cost_limit", Number.parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Free Models Only</Label>
                  <p className="text-sm text-gray-500">Restrict to free models to avoid API costs</p>
                </div>
                <Switch
                  checked={getConfigValue("enable_free_models_only", false)}
                  onCheckedChange={(checked) => updateConfig("enable_free_models_only", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Disable AI services for maintenance</p>
                </div>
                <Switch
                  checked={getConfigValue("maintenance_mode", false)}
                  onCheckedChange={(checked) => updateConfig("maintenance_mode", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Provider Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold capitalize">{provider.provider_name}</h3>
                        <Badge variant={provider.is_enabled ? "default" : "secondary"}>
                          {provider.is_enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <Switch
                        checked={provider.is_enabled}
                        onCheckedChange={(checked) => updateProvider(provider.id, "is_enabled", checked)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Priority</Label>
                        <Input
                          type="number"
                          value={provider.priority}
                          onChange={(e) => updateProvider(provider.id, "priority", Number.parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Rate Limit</Label>
                        <Input
                          type="number"
                          value={provider.rate_limit}
                          onChange={(e) => updateProvider(provider.id, "rate_limit", Number.parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Cost per Token</Label>
                        <Input
                          type="number"
                          step="0.000001"
                          value={provider.cost_per_token}
                          onChange={(e) =>
                            updateProvider(provider.id, "cost_per_token", Number.parseFloat(e.target.value))
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Usage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usageStats &&
                    Object.entries(usageStats.modelUsage).map(([model, count]) => (
                      <div key={model} className="flex items-center justify-between">
                        <span className="text-sm">{model}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(count / usageStats.totalRequests) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Provider Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usageStats &&
                    Object.entries(usageStats.providerUsage).map(([provider, count]) => (
                      <div key={provider} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{provider}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(count / usageStats.totalRequests) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <AIConfigTemplates />
        </TabsContent>
      </Tabs>

      {/* Update Reason */}
      <Card>
        <CardHeader>
          <CardTitle>Change Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Reason for Changes (Optional)</Label>
            <Textarea
              value={updateReason}
              onChange={(e) => setUpdateReason(e.target.value)}
              placeholder="Describe why you're making these changes..."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
