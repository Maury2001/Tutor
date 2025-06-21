"use client"

import { useState } from "react"
import { Brain, AlertTriangle, CheckCircle, XCircle, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function TestBulkDistribution() {
  const [bulkAmount, setBulkAmount] = useState(3000)
  const [testResults, setTestResults] = useState<string[]>([])

  // Mock AI Model Data
  const aiModel = {
    name: "CBC Math Tutor",
    tokensAvailable: 25000,
    tokensDistributed: 18500,
    tokensRemaining: 6500,
  }

  // Mock Subscribers
  const subscribers = [
    { id: "1", name: "Hilltop High School", initials: "HHS", students: 520, subscription: "Premium" },
    { id: "2", name: "Brookside Academy", initials: "BA", students: 480, subscription: "Standard" },
    { id: "3", name: "Riverside Primary", initials: "RP", students: 280, subscription: "Basic" },
    { id: "4", name: "Mountain View School", initials: "MVS", students: 350, subscription: "Standard" },
    { id: "5", name: "Coastal High School", initials: "CHS", students: 420, subscription: "Premium" },
  ]

  const addTestResult = (result: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const testBulkDistribution = (amount: number, subscriberCount: number) => {
    const totalRequired = amount * subscriberCount
    const isValid = totalRequired <= aiModel.tokensRemaining
    const excess = totalRequired - aiModel.tokensRemaining

    addTestResult(
      `Testing ${amount.toLocaleString()} tokens × ${subscriberCount} schools = ${totalRequired.toLocaleString()} tokens needed. ${
        isValid ? "✅ VALID - Within limits" : `❌ INVALID - Exceeds by ${excess.toLocaleString()} tokens`
      }`,
    )

    return { isValid, totalRequired, excess }
  }

  const runBulkTests = () => {
    setTestResults([])
    addTestResult("🧪 Starting Bulk Distribution Tests...")

    // Test 1: Valid bulk distribution
    addTestResult("📋 Test 1: Valid Distribution")
    testBulkDistribution(1000, 3)

    // Test 2: Exact limit
    addTestResult("📋 Test 2: Exact Limit")
    testBulkDistribution(2167, 3) // 6501 total, just over limit

    // Test 3: Moderate over-allocation
    addTestResult("📋 Test 3: Moderate Over-allocation")
    testBulkDistribution(3000, 3)

    // Test 4: Severe over-allocation
    addTestResult("📋 Test 4: Severe Over-allocation")
    testBulkDistribution(5000, 5)

    // Test 5: Edge case - single large allocation
    addTestResult("📋 Test 5: Single Large Allocation")
    testBulkDistribution(10000, 1)

    addTestResult("✅ All tests completed!")
  }

  const currentBulkTotal = bulkAmount * subscribers.length
  const isCurrentValid = currentBulkTotal <= aiModel.tokensRemaining
  const currentExcess = currentBulkTotal - aiModel.tokensRemaining

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <Brain className="h-8 w-8 text-purple-600" />
          <span>Bulk Distribution Testing Interface</span>
        </h1>
        <p className="text-gray-600">Test over-allocation prevention with excessive bulk amounts</p>
      </div>

      {/* AI Model Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>{aiModel.name} - Token Pool Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{aiModel.tokensAvailable.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{aiModel.tokensDistributed.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Already Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{aiModel.tokensRemaining.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{subscribers.length}</div>
              <div className="text-sm text-gray-600">Active Schools</div>
            </div>
          </div>
          <Progress value={(aiModel.tokensDistributed / aiModel.tokensAvailable) * 100} className="h-3" />
        </CardContent>
      </Card>

      {/* Interactive Bulk Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span>Interactive Bulk Distribution Test</span>
          </CardTitle>
          <CardDescription>
            Adjust the bulk amount to see real-time validation and over-allocation warnings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="bulk-test-amount">Tokens per school:</Label>
            <Input
              id="bulk-test-amount"
              type="number"
              value={bulkAmount}
              onChange={(e) => setBulkAmount(Number(e.target.value))}
              className="w-32"
              min="0"
              step="100"
            />
            <span className="text-sm text-gray-600">× {subscribers.length} schools</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{currentBulkTotal.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Required</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">{aiModel.tokensRemaining.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className={`text-center p-4 rounded-lg ${isCurrentValid ? "bg-green-50" : "bg-red-50"}`}>
              <div className={`text-xl font-bold ${isCurrentValid ? "text-green-600" : "text-red-600"}`}>
                {isCurrentValid ? "✅ VALID" : `❌ OVER BY ${currentExcess.toLocaleString()}`}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>

          {!isCurrentValid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">Over-Allocation Detected!</h3>
                  <p className="text-sm text-red-700 mt-1">
                    You're trying to distribute <strong>{currentBulkTotal.toLocaleString()} tokens</strong> but only{" "}
                    <strong>{aiModel.tokensRemaining.toLocaleString()} tokens</strong> are available.
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    <strong>Excess:</strong> {currentExcess.toLocaleString()} tokens
                  </p>
                  <p className="text-sm text-red-700 mt-2">
                    <strong>Suggestions:</strong>
                  </p>
                  <ul className="text-sm text-red-700 mt-1 ml-4 list-disc">
                    <li>
                      Reduce to {Math.floor(aiModel.tokensRemaining / subscribers.length).toLocaleString()} tokens per
                      school
                    </li>
                    <li>Distribute to fewer schools</li>
                    <li>Wait for more tokens to become available</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={() => testBulkDistribution(bulkAmount, subscribers.length)}
            disabled={!isCurrentValid}
            className={`w-full ${isCurrentValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"}`}
          >
            {isCurrentValid ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Apply Bulk Distribution
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Cannot Apply - Over Allocated
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Predefined Test Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Predefined Test Scenarios</CardTitle>
          <CardDescription>Run comprehensive tests with various bulk amounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                setBulkAmount(1000)
                testBulkDistribution(1000, subscribers.length)
              }}
              variant="outline"
              className="h-20 flex flex-col"
            >
              <span className="font-semibold">Safe Amount</span>
              <span className="text-sm text-gray-600">1,000 × 5 = 5,000</span>
              <Badge variant="default" className="mt-1">
                ✅ Valid
              </Badge>
            </Button>

            <Button
              onClick={() => {
                setBulkAmount(1300)
                testBulkDistribution(1300, subscribers.length)
              }}
              variant="outline"
              className="h-20 flex flex-col"
            >
              <span className="font-semibold">Exact Limit</span>
              <span className="text-sm text-gray-600">1,300 × 5 = 6,500</span>
              <Badge variant="secondary" className="mt-1">
                ⚠️ At Limit
              </Badge>
            </Button>

            <Button
              onClick={() => {
                setBulkAmount(2000)
                testBulkDistribution(2000, subscribers.length)
              }}
              variant="outline"
              className="h-20 flex flex-col"
            >
              <span className="font-semibold">Moderate Excess</span>
              <span className="text-sm text-gray-600">2,000 × 5 = 10,000</span>
              <Badge variant="destructive" className="mt-1">
                ❌ Over by 3,500
              </Badge>
            </Button>

            <Button
              onClick={() => {
                setBulkAmount(5000)
                testBulkDistribution(5000, subscribers.length)
              }}
              variant="outline"
              className="h-20 flex flex-col"
            >
              <span className="font-semibold">High Excess</span>
              <span className="text-sm text-gray-600">5,000 × 5 = 25,000</span>
              <Badge variant="destructive" className="mt-1">
                ❌ Over by 18,500
              </Badge>
            </Button>

            <Button
              onClick={() => {
                setBulkAmount(10000)
                testBulkDistribution(10000, subscribers.length)
              }}
              variant="outline"
              className="h-20 flex flex-col"
            >
              <span className="font-semibold">Extreme Excess</span>
              <span className="text-sm text-gray-600">10,000 × 5 = 50,000</span>
              <Badge variant="destructive" className="mt-1">
                ❌ Over by 43,500
              </Badge>
            </Button>

            <Button onClick={runBulkTests} className="h-20 flex flex-col bg-purple-600 hover:bg-purple-700">
              <span className="font-semibold">Run All Tests</span>
              <span className="text-sm">Comprehensive Testing</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* School List */}
      <Card>
        <CardHeader>
          <CardTitle>Target Schools ({subscribers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscribers.map((school) => (
              <div key={school.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">{school.initials}</span>
                </div>
                <div>
                  <div className="font-medium">{school.name}</div>
                  <div className="text-sm text-gray-600">
                    {school.students} students • {school.subscription}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
