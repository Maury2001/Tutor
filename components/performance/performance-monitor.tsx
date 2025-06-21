"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Clock,
  Zap,
  Database,
  Wifi,
  Monitor,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react"

interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte

  // Custom Metrics
  domContentLoaded?: number
  windowLoad?: number
  timeToInteractive?: number
  totalBlockingTime?: number

  // Resource Metrics
  jsSize?: number
  cssSize?: number
  imageSize?: number
  totalSize?: number
  requestCount?: number

  // Memory Metrics
  usedJSHeapSize?: number
  totalJSHeapSize?: number
  jsHeapSizeLimit?: number

  // Component Metrics
  componentRenderTime?: number
  hydrationTime?: number
}

interface ComponentTiming {
  name: string
  renderTime: number
  mountTime: number
  updateCount: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [componentTimings, setComponentTimings] = useState<ComponentTiming[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const startTimeRef = useRef<number>(Date.now())

  // Performance Observer for Core Web Vitals
  useEffect(() => {
    if (typeof window === "undefined") return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case "largest-contentful-paint":
            setMetrics((prev) => ({ ...prev, lcp: entry.startTime }))
            break
          case "first-input":
            setMetrics((prev) => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }))
            break
          case "layout-shift":
            if (!(entry as any).hadRecentInput) {
              setMetrics((prev) => ({ ...prev, cls: (prev.cls || 0) + (entry as any).value }))
            }
            break
          case "paint":
            if (entry.name === "first-contentful-paint") {
              setMetrics((prev) => ({ ...prev, fcp: entry.startTime }))
            }
            break
          case "navigation":
            const navEntry = entry as PerformanceNavigationTiming
            setMetrics((prev) => ({
              ...prev,
              ttfb: navEntry.responseStart - navEntry.requestStart,
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.navigationStart,
              windowLoad: navEntry.loadEventEnd - navEntry.navigationStart,
            }))
            break
        }
      }
    })

    try {
      observer.observe({
        entryTypes: ["largest-contentful-paint", "first-input", "layout-shift", "paint", "navigation"],
      })
    } catch (e) {
      console.warn("Performance Observer not fully supported:", e)
    }

    return () => observer.disconnect()
  }, [])

  // Memory monitoring
  useEffect(() => {
    const updateMemoryMetrics = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory
        setMetrics((prev) => ({
          ...prev,
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        }))
      }
    }

    updateMemoryMetrics()
    const interval = setInterval(updateMemoryMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  // Resource size calculation
  useEffect(() => {
    const calculateResourceSizes = () => {
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
      let jsSize = 0,
        cssSize = 0,
        imageSize = 0,
        totalSize = 0

      resources.forEach((resource) => {
        const size = resource.transferSize || 0
        totalSize += size

        if (resource.name.includes(".js")) jsSize += size
        else if (resource.name.includes(".css")) cssSize += size
        else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) imageSize += size
      })

      setMetrics((prev) => ({
        ...prev,
        jsSize,
        cssSize,
        imageSize,
        totalSize,
        requestCount: resources.length,
      }))
    }

    setTimeout(calculateResourceSizes, 2000)
  }, [])

  // Dashboard-specific performance test
  const runDashboardPerformanceTest = async () => {
    setIsMonitoring(true)
    const testStart = performance.now()

    try {
      // Test 1: Dashboard Load Time
      const dashboardLoadStart = performance.now()
      await new Promise((resolve) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = resolve
        img.src = "/placeholder.svg?test=" + Date.now()
      })
      const dashboardLoadTime = performance.now() - dashboardLoadStart

      // Test 2: Component Render Performance
      const componentRenderStart = performance.now()
      // Simulate component operations
      for (let i = 0; i < 1000; i++) {
        document.createElement("div")
      }
      const componentRenderTime = performance.now() - componentRenderStart

      // Test 3: Memory Usage Test
      const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0
      const largeArray = new Array(10000).fill(0).map((_, i) => ({ id: i, data: "test" }))
      const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0
      const memoryDelta = memoryAfter - memoryBefore

      // Test 4: API Response Time Simulation
      const apiStart = performance.now()
      await fetch("/api/health").catch(() => {})
      const apiTime = performance.now() - apiStart

      const results = [
        {
          name: "Dashboard Load Time",
          value: dashboardLoadTime,
          unit: "ms",
          status: dashboardLoadTime < 100 ? "excellent" : dashboardLoadTime < 300 ? "good" : "needs-improvement",
          target: "< 100ms",
        },
        {
          name: "Component Render Time",
          value: componentRenderTime,
          unit: "ms",
          status: componentRenderTime < 16 ? "excellent" : componentRenderTime < 50 ? "good" : "needs-improvement",
          target: "< 16ms (60fps)",
        },
        {
          name: "Memory Impact",
          value: memoryDelta / 1024 / 1024,
          unit: "MB",
          status:
            memoryDelta < 1024 * 1024 ? "excellent" : memoryDelta < 5 * 1024 * 1024 ? "good" : "needs-improvement",
          target: "< 1MB",
        },
        {
          name: "API Response Time",
          value: apiTime,
          unit: "ms",
          status: apiTime < 200 ? "excellent" : apiTime < 500 ? "good" : "needs-improvement",
          target: "< 200ms",
        },
        {
          name: "First Contentful Paint",
          value: metrics.fcp || 0,
          unit: "ms",
          status: (metrics.fcp || 0) < 1800 ? "excellent" : (metrics.fcp || 0) < 3000 ? "good" : "needs-improvement",
          target: "< 1.8s",
        },
        {
          name: "Largest Contentful Paint",
          value: metrics.lcp || 0,
          unit: "ms",
          status: (metrics.lcp || 0) < 2500 ? "excellent" : (metrics.lcp || 0) < 4000 ? "good" : "needs-improvement",
          target: "< 2.5s",
        },
      ]

      setTestResults(results)
    } catch (error) {
      console.error("Performance test failed:", error)
    } finally {
      setIsMonitoring(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "good":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-red-100 text-red-800"
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(1)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Dashboard Performance Monitor
          </CardTitle>
          <div className="flex space-x-2">
            <Button onClick={runDashboardPerformanceTest} disabled={isMonitoring}>
              {isMonitoring ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Performance Test
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="core-vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="test-results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Page Load</p>
                    <p className="text-2xl font-bold">{formatTime(metrics.windowLoad || 0)}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">First Paint</p>
                    <p className="text-2xl font-bold">{formatTime(metrics.fcp || 0)}</p>
                  </div>
                  <Zap className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Size</p>
                    <p className="text-2xl font-bold">{formatBytes(metrics.totalSize || 0)}</p>
                  </div>
                  <Database className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Requests</p>
                    <p className="text-2xl font-bold">{metrics.requestCount || 0}</p>
                  </div>
                  <Wifi className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="core-vitals">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Largest Contentful Paint</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{formatTime(metrics.lcp || 0)}</div>
                <Progress value={Math.min(((metrics.lcp || 0) / 2500) * 100, 100)} className="mb-2" />
                <p className="text-sm text-gray-600">Target: &lt; 2.5s</p>
                <Badge className={getStatusColor((metrics.lcp || 0) < 2500 ? "excellent" : "needs-improvement")}>
                  {(metrics.lcp || 0) < 2500 ? "Good" : "Needs Improvement"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">First Input Delay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{formatTime(metrics.fid || 0)}</div>
                <Progress value={Math.min(((metrics.fid || 0) / 100) * 100, 100)} className="mb-2" />
                <p className="text-sm text-gray-600">Target: &lt; 100ms</p>
                <Badge className={getStatusColor((metrics.fid || 0) < 100 ? "excellent" : "needs-improvement")}>
                  {(metrics.fid || 0) < 100 ? "Good" : "Needs Improvement"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cumulative Layout Shift</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{(metrics.cls || 0).toFixed(3)}</div>
                <Progress value={Math.min(((metrics.cls || 0) / 0.1) * 100, 100)} className="mb-2" />
                <p className="text-sm text-gray-600">Target: &lt; 0.1</p>
                <Badge className={getStatusColor((metrics.cls || 0) < 0.1 ? "excellent" : "needs-improvement")}>
                  {(metrics.cls || 0) < 0.1 ? "Good" : "Needs Improvement"}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>JavaScript</span>
                  <span className="font-mono">{formatBytes(metrics.jsSize || 0)}</span>
                </div>
                <Progress value={((metrics.jsSize || 0) / (metrics.totalSize || 1)) * 100} />

                <div className="flex justify-between items-center">
                  <span>CSS</span>
                  <span className="font-mono">{formatBytes(metrics.cssSize || 0)}</span>
                </div>
                <Progress value={((metrics.cssSize || 0) / (metrics.totalSize || 1)) * 100} />

                <div className="flex justify-between items-center">
                  <span>Images</span>
                  <span className="font-mono">{formatBytes(metrics.imageSize || 0)}</span>
                </div>
                <Progress value={((metrics.imageSize || 0) / (metrics.totalSize || 1)) * 100} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Requests</span>
                  <span className="font-mono">{metrics.requestCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Size</span>
                  <span className="font-mono">{formatBytes(metrics.totalSize || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time to First Byte</span>
                  <span className="font-mono">{formatTime(metrics.ttfb || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>DOM Content Loaded</span>
                  <span className="font-mono">{formatTime(metrics.domContentLoaded || 0)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="memory">
          <Card>
            <CardHeader>
              <CardTitle>Memory Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatBytes(metrics.usedJSHeapSize || 0)}</div>
                  <p className="text-sm text-gray-600">Used Heap</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatBytes(metrics.totalJSHeapSize || 0)}</div>
                  <p className="text-sm text-gray-600">Total Heap</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatBytes(metrics.jsHeapSizeLimit || 0)}</div>
                  <p className="text-sm text-gray-600">Heap Limit</p>
                </div>
              </div>
              <div className="mt-6">
                <Progress
                  value={((metrics.usedJSHeapSize || 0) / (metrics.jsHeapSizeLimit || 1)) * 100}
                  className="h-3"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Memory Usage: {(((metrics.usedJSHeapSize || 0) / (metrics.jsHeapSizeLimit || 1)) * 100).toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test-results">
          <Card>
            <CardHeader>
              <CardTitle>Performance Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <div className="text-center py-8">
                  <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Run a performance test to see results</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h4 className="font-medium">{result.name}</h4>
                          <p className="text-sm text-gray-600">Target: {result.target}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {result.value.toFixed(1)} {result.unit}
                        </div>
                        <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
