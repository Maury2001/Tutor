"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Brain } from "lucide-react"

interface AIModel {
  provider: string
  name: string
  description: string
  speed: string
  quality: string
  cost: string
  recommended: boolean
  strengths: string[]
  bestFor: string[]
}

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
  preferences: any
  onPreferencesChange: (preferences: any) => void
  className?: string
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  preferences = {},
  onPreferencesChange,
  className = "",
}: ModelSelectorProps) {
  const [models, setModels] = useState<Record<string, AIModel>>({})
  const [fallbackStrategies, setFallbackStrategies] = useState<any>({})
  const [availableProviders, setAvailableProviders] = useState<any>({})
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const response = await fetch("/api/ai/models")
      const data = await response.json()
      setModels(data.models)
      setFallbackStrategies(data.fallbackStrategies)
      setAvailableProviders(data.availableProviders)
      setStats(data.stats)

      if (!selectedModel && data.recommendedModel) {
        onModelChange(data.recommendedModel)
      }
    } catch (error) {
      console.error("Failed to fetch models:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case "very fast":
        return "🚀"
      case "fast":
        return "⚡"
      case "medium":
        return "🏃"
      default:
        return "🐌"
    }
  }

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case "highest":
        return "💎"
      case "high":
        return "⭐"
      case "good":
        return "👍"
      default:
        return "✅"
    }
  }

  const getCostIcon = (cost: string) => {
    switch (cost) {
      case "free":
        return "🆓"
      case "low":
        return "💰"
      case "high":
        return "💎"
      default:
        return "💵"
    }
  }

  const getCostColor = (cost: string) => {
    switch (cost) {
      case "free":
        return "text-green-600 bg-green-100"
      case "low":
        return "text-blue-600 bg-blue-100"
      case "high":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const updatePreferences = (key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value }
    onPreferencesChange(newPreferences)
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>🤖 AI Model Selector</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading AI models...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🤖 AI Model Selector
          <Badge variant="outline">{stats.availableModels} available</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="models" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="preferences">Settings</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-4">
            {/* Quick Model Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Choose AI Model:</label>
              <Select value={selectedModel} onValueChange={onModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI model" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(models).map(([key, model]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                        <Badge className={getCostColor(model.cost)} variant="secondary">
                          {getCostIcon(model.cost)} {model.cost}
                        </Badge>
                        {model.recommended && <Badge variant="default">⭐ Recommended</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(models).map(([key, model]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all ${
                    selectedModel === key ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                  }`}
                  onClick={() => onModelChange(key)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {model.name}
                          {model.recommended && <Badge variant="default">⭐</Badge>}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                      </div>
                      <Badge className={getCostColor(model.cost)} variant="secondary">
                        {getCostIcon(model.cost)} {model.cost}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {/* Performance Indicators */}
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>
                            {getSpeedIcon(model.speed)} {model.speed}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Brain className="w-4 h-4 text-purple-500" />
                          <span>
                            {getQualityIcon(model.quality)} {model.quality}
                          </span>
                        </div>
                      </div>

                      {/* Strengths */}
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Strengths:</p>
                        <div className="flex flex-wrap gap-1">
                          {model.strengths.slice(0, 3).map((strength, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Best For */}
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Best for:</p>
                        <p className="text-xs text-gray-600">{model.bestFor.slice(0, 2).join(", ")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            {/* Temperature Setting */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Creativity Level (Temperature): {preferences.temperature || 0.7}
              </label>
              <Slider
                value={[preferences.temperature || 0.7]}
                onValueChange={(value) => updatePreferences("temperature", value[0])}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>More Focused</span>
                <span>More Creative</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Response Length: {preferences.maxTokens || 800} tokens
              </label>
              <Slider
                value={[preferences.maxTokens || 800]}
                onValueChange={(value) => updatePreferences("maxTokens", value[0])}
                max={2000}
                min={100}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Shorter</span>
                <span>Longer</span>
              </div>
            </div>

            {/* Fallback Strategy */}
            <div>
              <label className="text-sm font-medium mb-2 block">Fallback Strategy:</label>
              <Select
                value={preferences.fallbackStrategy || "balanced"}
                onValueChange={(value) => updatePreferences("fallbackStrategy", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fallbackStrategies).map(([key, strategy]: [string, any]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex flex-col">
                        <span>{strategy.name}</span>
                        <span className="text-xs text-gray-500">{strategy.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto-fallback Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto-fallback</label>
                <p className="text-xs text-gray-500">Automatically try other models if primary fails</p>
              </div>
              <Switch
                checked={preferences.autoFallback !== false}
                onCheckedChange={(checked) => updatePreferences("autoFallback", checked)}
              />
            </div>

            {/* Show Model Info */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Show Model Info</label>
                <p className="text-xs text-gray-500">Display which model generated each response</p>
              </div>
              <Switch
                checked={preferences.showModelInfo !== false}
                onCheckedChange={(checked) => updatePreferences("showModelInfo", checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            {/* Provider Status */}
            <div>
              <h3 className="font-medium mb-3">AI Provider Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">OpenAI</p>
                        <p className="text-sm text-gray-600">GPT Models</p>
                      </div>
                      <Badge variant={availableProviders.openai ? "default" : "secondary"}>
                        {availableProviders.openai ? "✅ Active" : "❌ Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Groq</p>
                        <p className="text-sm text-gray-600">Fast AI Models</p>
                      </div>
                      <Badge variant={availableProviders.groq ? "default" : "secondary"}>
                        {availableProviders.groq ? "✅ Active" : "❌ Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Model Statistics */}
            <div>
              <h3 className="font-medium mb-3">Model Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalModels}</div>
                  <div className="text-sm text-gray-600">Total Models</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.availableModels}</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.freeModels}</div>
                  <div className="text-sm text-gray-600">Free Models</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.paidModels}</div>
                  <div className="text-sm text-gray-600">Paid Models</div>
                </div>
              </div>
            </div>

            {/* Current Selection Info */}
            {selectedModel && models[selectedModel] && (
              <div>
                <h3 className="font-medium mb-3">Current Selection</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{models[selectedModel].name}</span>
                        <Badge className={getCostColor(models[selectedModel].cost)}>
                          {getCostIcon(models[selectedModel].cost)} {models[selectedModel].cost}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{models[selectedModel].description}</p>
                      <div className="flex gap-4 text-sm">
                        <span>
                          Speed: {getSpeedIcon(models[selectedModel].speed)} {models[selectedModel].speed}
                        </span>
                        <span>
                          Quality: {getQualityIcon(models[selectedModel].quality)} {models[selectedModel].quality}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
