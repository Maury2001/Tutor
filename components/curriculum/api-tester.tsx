"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CurriculumApiTester() {
  const [endpoint, setEndpoint] = useState("/api/curriculum")
  const [params, setParams] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const url = `${endpoint}${params ? `?${params}` : ""}`
      const response = await fetch(url)

      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error (${response.status}): ${errorText}`)
      }

      // Check content type to ensure it's JSON
      const contentType = response.headers.get("content-type")
      if (contentType && !contentType.includes("application/json")) {
        const text = await response.text()
        setResult({
          warning: "Response is not JSON",
          contentType,
          text: text.substring(0, 500) + (text.length > 500 ? "..." : ""),
        })
        return
      }

      // Parse JSON response
      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleEndpointChange = (value: string) => {
    setEndpoint(value)
    setParams("")
    setResult(null)
  }

  const handleParamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(e.target.value)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>CBC Curriculum API Tester</CardTitle>
        <CardDescription>Test the curriculum API endpoints</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint">Endpoint</Label>
            <Select value={endpoint} onValueChange={handleEndpointChange}>
              <SelectTrigger id="endpoint">
                <SelectValue placeholder="Select endpoint" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="/api/curriculum">Curriculum Summary</SelectItem>
                <SelectItem value="/api/curriculum/grades/grade1">Grade 1</SelectItem>
                <SelectItem value="/api/curriculum/search">Search</SelectItem>
                <SelectItem value="/api/curriculum/learning-path">Learning Path</SelectItem>
                <SelectItem value="/api/curriculum/docs">API Documentation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="params">Query Parameters</Label>
            <Input
              id="params"
              placeholder="e.g. format=stats or q=mathematics"
              value={params}
              onChange={handleParamsChange}
            />
          </div>

          <Button onClick={fetchData} disabled={loading}>
            {loading ? "Loading..." : "Test API"}
          </Button>

          {error && <div className="text-red-500">{error}</div>}
        </div>
      </CardContent>

      {result && (
        <CardFooter className="flex flex-col items-start">
          <h3 className="text-lg font-medium">Response:</h3>
          <Tabs defaultValue="formatted" className="w-full mt-2">
            <TabsList>
              <TabsTrigger value="formatted">Formatted</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
            </TabsList>
            <TabsContent value="formatted" className="mt-2">
              <pre className="bg-slate-100 p-4 rounded-md overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </TabsContent>
            <TabsContent value="raw" className="mt-2">
              <pre className="bg-slate-100 p-4 rounded-md overflow-auto max-h-96">{JSON.stringify(result)}</pre>
            </TabsContent>
          </Tabs>
        </CardFooter>
      )}
    </Card>
  )
}
