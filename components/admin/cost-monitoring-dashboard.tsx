"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Settings } from "lucide-react"

interface UsageData {
  daily: number
  monthly: number
}

interface Limits {
  dailyLimit: number
  monthlyLimit: number
}

export function CostMonitoringDashboard() {
  const [usage, setUsage] = useState<UsageData>({ daily: 0, monthly: 0 })
  const [limits, setLimits] = useState<Limits>({ dailyLimit: 2, monthlyLimit: 25 })
  const [loading, setLoading] = useState(true)
  const [editingLimits, setEditingLimits] = useState(false)
  const [newLimits, setNewLimits] = useState({ dailyLimit: 2, monthlyLimit: 25 })

  const fetchUsageData = async () => {
    try {
      const response = await fetch("/api/ai/usage-monitor")
      const data = await response.json()

      if (data.success) {
        setUsage(data.usage)
        setLimits(data.limits)
      }
    } catch (error) {
      console.error("Failed to fetch usage data:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetDailyUsage = async () => {
    try {
      await fetch("/api/ai/usage-monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-daily" }),
      })
      fetchUsageData()
    } catch (error) {
      console.error("Failed to reset daily usage:", error)
    }
  }

  useEffect(() => {
    fetchUsageData()
    const interval = setInterval(fetchUsageData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Load saved limits from localStorage
    const savedLimits = localStorage.getItem("openai-spending-limits")
    if (savedLimits) {
      const parsed = JSON.parse(savedLimits)
      setLimits(parsed)
      setNewLimits(parsed)
    }
  }, [])

  const dailyPercentage = (usage.daily / limits.dailyLimit) * 100
  const monthlyPercentage = (usage.monthly / limits.monthlyLimit) * 100

  const getDailyStatus = () => {
    if (dailyPercentage >= 100) return { color: "destructive", icon: AlertTriangle, text: "Limit Exceeded" }
    if (dailyPercentage >= 80) return { color: "warning", icon: AlertTriangle, text: "High Usage" }
    return { color: "success", icon: CheckCircle, text: "Normal" }
  }

  const getMonthlyStatus = () => {
    if (monthlyPercentage >= 100) return { color: "destructive", icon: AlertTriangle, text: "Limit Exceeded" }
    if (monthlyPercentage >= 80) return { color: "warning", icon: AlertTriangle, text: "High Usage" }
    return { color: "success", icon: CheckCircle, text: "Normal" }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const dailyStatus = getDailyStatus()
  const monthlyStatus = getMonthlyStatus()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Usage</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${usage.daily.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">of ${limits.dailyLimit.toFixed(2)} limit</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Progress</span>
                <Badge variant={dailyStatus.color as any}>
                  <dailyStatus.icon className="h-3 w-3 mr-1" />
                  {dailyStatus.text}
                </Badge>
              </div>
              <Progress value={Math.min(dailyPercentage, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">{dailyPercentage.toFixed(1)}% used</p>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${usage.monthly.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">of ${limits.monthlyLimit.toFixed(2)} limit</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Progress</span>
                <Badge variant={monthlyStatus.color as any}>
                  <monthlyStatus.icon className="h-3 w-3 mr-1" />
                  {monthlyStatus.text}
                </Badge>
              </div>
              <Progress value={Math.min(monthlyPercentage, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">{monthlyPercentage.toFixed(1)}% used</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(dailyPercentage >= 80 || monthlyPercentage >= 80) && (
        <Alert variant={dailyPercentage >= 100 || monthlyPercentage >= 100 ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Usage Alert:</strong> You're approaching your spending limits.
            {dailyPercentage >= 100 || monthlyPercentage >= 100
              ? " API access may be restricted."
              : " Consider monitoring usage more closely."}
          </AlertDescription>
        </Alert>
      )}

      {/* Cost Management Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Management Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Optimize Model Usage</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use GPT-3.5-turbo for simple tasks</li>
                <li>• Reserve GPT-4 for complex reasoning</li>
                <li>• Implement response caching</li>
                <li>• Set max_tokens limits</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Monitor & Control</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Set up billing alerts</li>
                <li>• Review usage patterns daily</li>
                <li>• Implement rate limiting</li>
                <li>• Use usage quotas per user</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={resetDailyUsage} variant="outline" size="sm">
              Reset Daily Counter
            </Button>
            <Button
              onClick={() => window.open("https://platform.openai.com/settings/organization/billing", "_blank")}
              variant="outline"
              size="sm"
            >
              OpenAI Billing Dashboard
            </Button>
            <Button onClick={() => setEditingLimits(true)} variant="default" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure Limits
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Spending Limits Configuration Modal */}
      {editingLimits && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Configure Spending Limits</CardTitle>
              <CardDescription>Set your preferred daily and monthly OpenAI spending limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Limit ($)</label>
                <input
                  type="number"
                  value={newLimits.dailyLimit}
                  onChange={(e) =>
                    setNewLimits((prev) => ({ ...prev, dailyLimit: Number.parseFloat(e.target.value) || 0 }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-500">Recommended: $2-5 for development, $10-20 for production</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Limit ($)</label>
                <input
                  type="number"
                  value={newLimits.monthlyLimit}
                  onChange={(e) =>
                    setNewLimits((prev) => ({ ...prev, monthlyLimit: Number.parseFloat(e.target.value) || 0 }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-500">Recommended: $25-50 for small platforms, $100+ for large scale</p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-900 text-sm mb-1">💡 Limit Recommendations</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>
                    • <strong>Development:</strong> $2/day, $25/month
                  </li>
                  <li>
                    • <strong>Small School:</strong> $10/day, $100/month
                  </li>
                  <li>
                    • <strong>Large Platform:</strong> $50/day, $500/month
                  </li>
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    setLimits(newLimits)
                    setEditingLimits(false)
                    // Here you would typically save to your backend/localStorage
                    localStorage.setItem("openai-spending-limits", JSON.stringify(newLimits))
                  }}
                  className="flex-1"
                >
                  Save Limits
                </Button>
                <Button
                  onClick={() => {
                    setEditingLimits(false)
                    setNewLimits(limits)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
