"use client"

import { useState } from "react"
import { Zap, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DemoSchool {
  id: string
  name: string
  package: string
  tokensAllocated: number
  tokensUsed: number
  status: "active" | "low" | "critical"
}

export function TokenAllocationDemo() {
  const [schools, setSchools] = useState<DemoSchool[]>([
    {
      id: "1",
      name: "Hilltop High School",
      package: "School Pro",
      tokensAllocated: 1000,
      tokensUsed: 850,
      status: "low",
    },
    {
      id: "2",
      name: "Brookside Academy",
      package: "Enterprise",
      tokensAllocated: 10000,
      tokensUsed: 2300,
      status: "active",
    },
    {
      id: "3",
      name: "Riverside Primary",
      package: "Free Starter",
      tokensAllocated: 10,
      tokensUsed: 9,
      status: "critical",
    },
  ])

  const [selectedSchool, setSelectedSchool] = useState<DemoSchool | null>(null)
  const [tokenAmount, setTokenAmount] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAddTokens = (school: DemoSchool) => {
    setSelectedSchool(school)
    setIsModalOpen(true)
    setTokenAmount("")
  }

  const handleAllocateTokens = () => {
    if (!selectedSchool || !tokenAmount) return

    const tokensToAdd = Number.parseInt(tokenAmount)
    if (isNaN(tokensToAdd) || tokensToAdd <= 0) return

    setSchools((prev) =>
      prev.map((school) =>
        school.id === selectedSchool.id
          ? {
              ...school,
              tokensAllocated: school.tokensAllocated + tokensToAdd,
              status: getTokenStatus(school.tokensUsed, school.tokensAllocated + tokensToAdd),
            }
          : school,
      ),
    )

    setIsModalOpen(false)
    setSelectedSchool(null)
    setTokenAmount("")
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const getTokenStatus = (used: number, allocated: number): "active" | "low" | "critical" => {
    const percentage = (used / allocated) * 100
    if (percentage >= 90) return "critical"
    if (percentage >= 75) return "low"
    return "active"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "low":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUsagePercentage = (used: number, allocated: number) => {
    return Math.round((used / allocated) * 100)
  }

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Tokens successfully allocated to {selectedSchool?.name}!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4">
        {schools.map((school) => (
          <Card key={school.id} className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">
                      {school.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{school.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{school.package}</span>
                      <Badge className={getStatusColor(school.status)}>
                        {school.status === "critical"
                          ? "Critical - Low Tokens"
                          : school.status === "low"
                            ? "Low Tokens"
                            : "Active"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Token Usage</div>
                    <div className="font-semibold">
                      {school.tokensUsed.toLocaleString()}/{school.tokensAllocated.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getUsagePercentage(school.tokensUsed, school.tokensAllocated)}% used
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAddTokens(school)}
                    className={`${
                      school.status === "critical"
                        ? "bg-red-600 hover:bg-red-700"
                        : school.status === "low"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Add Tokens
                  </Button>
                </div>
              </div>

              {/* Token Usage Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Token Usage Progress</span>
                  <span>{getUsagePercentage(school.tokensUsed, school.tokensAllocated)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      school.status === "critical"
                        ? "bg-red-500"
                        : school.status === "low"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${getUsagePercentage(school.tokensUsed, school.tokensAllocated)}%` }}
                  ></div>
                </div>
              </div>

              {/* Warning Messages */}
              {school.status === "critical" && (
                <Alert className="mt-4 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Critical:</strong> Only {school.tokensAllocated - school.tokensUsed} tokens remaining!
                    School may lose access soon.
                  </AlertDescription>
                </Alert>
              )}

              {school.status === "low" && (
                <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Warning:</strong> Token usage is high. Consider allocating more tokens.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Token Allocation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>Allocate Tokens</span>
            </DialogTitle>
            <DialogDescription>
              Add additional tokens to <strong>{selectedSchool?.name}</strong>'s subscription
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Current Status:</div>
              <div className="font-semibold">
                {selectedSchool?.tokensUsed.toLocaleString()}/{selectedSchool?.tokensAllocated.toLocaleString()} tokens
                used
              </div>
              <div className="text-sm text-gray-600">
                {selectedSchool && selectedSchool.tokensAllocated - selectedSchool.tokensUsed} tokens remaining
              </div>
            </div>

            <div>
              <Label htmlFor="token-amount">Number of Tokens to Add</Label>
              <Input
                id="token-amount"
                type="number"
                placeholder="e.g., 500"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                className="mt-1"
                min="1"
              />
              <div className="text-xs text-gray-500 mt-1">Recommended: 500-1000 tokens for regular usage</div>
            </div>

            {tokenAmount && Number.parseInt(tokenAmount) > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>After allocation:</strong>
                </div>
                <div className="text-sm text-blue-700">
                  Total tokens:{" "}
                  {selectedSchool && (selectedSchool.tokensAllocated + Number.parseInt(tokenAmount)).toLocaleString()}
                </div>
                <div className="text-sm text-blue-700">
                  Available tokens:{" "}
                  {selectedSchool &&
                    (
                      selectedSchool.tokensAllocated +
                      Number.parseInt(tokenAmount) -
                      selectedSchool.tokensUsed
                    ).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAllocateTokens}
              disabled={!tokenAmount || Number.parseInt(tokenAmount) <= 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Allocate {tokenAmount} Tokens
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
