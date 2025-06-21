"use client"

import { TokenAllocationDemo } from "@/components/admin/token-allocation-demo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Users, AlertTriangle } from "lucide-react"

export default function TokenDemoPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span>Token Allocation Demo</span>
          </h1>
          <p className="text-gray-600">Interactive demonstration of the "Add Tokens" functionality</p>
        </div>
      </div>

      {/* Instructions Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Users className="h-5 w-5" />
            <span>How to Use the "Add Tokens" Button</span>
          </CardTitle>
          <CardDescription className="text-blue-700">
            Follow these steps to allocate tokens to any school subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="text-blue-800">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Find the school</strong> that needs more tokens (look for red/yellow status badges)
            </li>
            <li>
              <strong>Click the "Add Tokens" button</strong> on the right side of the school card
            </li>
            <li>
              <strong>Enter the number of tokens</strong> to allocate (e.g., 500, 1000)
            </li>
            <li>
              <strong>Review the allocation preview</strong> showing new total and available tokens
            </li>
            <li>
              <strong>Click "Allocate Tokens"</strong> to confirm the allocation
            </li>
            <li>
              <strong>See the updated token balance</strong> immediately reflected in the dashboard
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Status Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Token Status Legend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>
                <strong>Active:</strong> Less than 75% tokens used
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>
                <strong>Low:</strong> 75-90% tokens used
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>
                <strong>Critical:</strong> Over 90% tokens used
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Token Allocation</CardTitle>
          <CardDescription>
            Try allocating tokens to the schools below. Notice how the status changes based on usage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TokenAllocationDemo />
        </CardContent>
      </Card>
    </div>
  )
}
