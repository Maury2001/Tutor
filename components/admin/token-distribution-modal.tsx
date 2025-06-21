"use client"

import { useState } from "react"
import { Brain, Coins, Plus, Minus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface TokenDistributionModalProps {
  isOpen: boolean
  onClose: () => void
  aiModel: {
    id: string
    name: string
    subject: string
    tokensAvailable: number
    tokensDistributed: number
    activeUsers: number
  }
}

export function TokenDistributionModal({ isOpen, onClose, aiModel }: TokenDistributionModalProps) {
  const [selectedTab, setSelectedTab] = useState("distribute")
  const [searchTerm, setSearchTerm] = useState("")
  const [distributionAmount, setDistributionAmount] = useState(100)

  // Mock data for subscribers
  const [subscribers] = useState([
    {
      id: "1",
      name: "Hilltop High School",
      initials: "HHS",
      subscription: "Premium",
      currentTokens: 3450,
      allocatedTokens: 10000,
      students: 520,
      status: "active",
      lastUsed: "2024-01-15",
    },
    {
      id: "2",
      name: "Brookside Academy",
      initials: "BA",
      subscription: "Standard",
      currentTokens: 4200,
      allocatedTokens: 5000,
      students: 480,
      status: "active",
      lastUsed: "2024-01-14",
    },
    {
      id: "3",
      name: "Riverside Primary",
      initials: "RP",
      subscription: "Basic",
      currentTokens: 800,
      allocatedTokens: 2000,
      students: 280,
      status: "active",
      lastUsed: "2024-01-13",
    },
  ])

  const [tokenAllocations, setTokenAllocations] = useState(
    subscribers.reduce((acc, sub) => ({ ...acc, [sub.id]: 0 }), {} as Record<string, number>),
  )

  const handleTokenAllocation = (subscriberId: string, amount: number) => {
    const maxAllowable = Math.max(0, amount)
    const newAllocations = { ...tokenAllocations, [subscriberId]: maxAllowable }
    const newTotal = Object.values(newAllocations).reduce((sum, tokens) => sum + tokens, 0)
    const newRemaining = aiModel.tokensAvailable - aiModel.tokensDistributed - newTotal

    // Show warning if over-allocating but still allow the input
    if (newRemaining < 0) {
      console.warn(`Over-allocation detected: ${Math.abs(newRemaining)} tokens over limit`)
    }

    setTokenAllocations(newAllocations)
  }

  const totalTokensToDistribute = Object.values(tokenAllocations).reduce((sum, tokens) => sum + tokens, 0)
  const remainingTokens = aiModel.tokensAvailable - aiModel.tokensDistributed - totalTokensToDistribute

  const handleDistributeTokens = () => {
    // Here you would implement the actual token distribution logic
    console.log("Distributing tokens:", tokenAllocations)
    alert(
      `Successfully distributed ${totalTokensToDistribute} tokens to ${Object.keys(tokenAllocations).filter((id) => tokenAllocations[id] > 0).length} subscribers!`,
    )
    onClose()
  }

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.initials.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Token Distribution - {aiModel.name}</span>
          </DialogTitle>
          <DialogDescription>
            Manage and distribute AI tokens to subscribers for {aiModel.subject} learning
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Token Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Token Pool Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{aiModel.tokensAvailable.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{aiModel.tokensDistributed.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Already Distributed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{totalTokensToDistribute.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Pending Distribution</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{remainingTokens.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
              </div>
              <div className="mt-4">
                <Progress
                  value={((aiModel.tokensDistributed + totalTokensToDistribute) / aiModel.tokensAvailable) * 100}
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>{aiModel.tokensAvailable.toLocaleString()} tokens</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {remainingTokens < 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Over-Allocation Warning</h3>
                  <p className="text-sm text-red-700">
                    You are trying to distribute {Math.abs(remainingTokens).toLocaleString()} more tokens than
                    available. Please reduce allocations before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="distribute">Distribute Tokens</TabsTrigger>
              <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
              <TabsTrigger value="history">Distribution History</TabsTrigger>
            </TabsList>

            <TabsContent value="distribute" className="space-y-4">
              {/* Search and Filter */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search subscribers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Bulk Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bulk Token Distribution</CardTitle>
                  <CardDescription>Quickly distribute tokens to multiple subscribers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="bulk-amount">Amount per subscriber:</Label>
                      <Input
                        id="bulk-amount"
                        type="number"
                        value={distributionAmount}
                        onChange={(e) => setDistributionAmount(Number(e.target.value))}
                        className="w-24"
                        min="0"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        const totalBulkTokens = distributionAmount * filteredSubscribers.length
                        const availableForBulk = aiModel.tokensAvailable - aiModel.tokensDistributed

                        if (totalBulkTokens > availableForBulk) {
                          alert(
                            `Cannot distribute ${totalBulkTokens.toLocaleString()} tokens. Only ${availableForBulk.toLocaleString()} tokens available. Consider reducing the amount per subscriber.`,
                          )
                          return
                        }

                        const newAllocations = { ...tokenAllocations }
                        filteredSubscribers.forEach((sub) => {
                          newAllocations[sub.id] = distributionAmount
                        })
                        setTokenAllocations(newAllocations)
                      }}
                      variant="outline"
                      disabled={
                        distributionAmount * filteredSubscribers.length >
                        aiModel.tokensAvailable - aiModel.tokensDistributed
                      }
                    >
                      Apply to All Visible
                      {distributionAmount * filteredSubscribers.length >
                        aiModel.tokensAvailable - aiModel.tokensDistributed && (
                        <span className="ml-2 text-red-500">⚠️</span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Subscriber List */}
              <div className="grid grid-cols-1 gap-4">
                {filteredSubscribers.map((subscriber) => (
                  <Card key={subscriber.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">{subscriber.initials}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{subscriber.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{subscriber.students} students</span>
                              <Badge variant={subscriber.subscription === "Premium" ? "default" : "secondary"}>
                                {subscriber.subscription}
                              </Badge>
                              <span>Last used: {subscriber.lastUsed}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Current Tokens</div>
                            <div className="font-semibold">
                              {subscriber.currentTokens}/{subscriber.allocatedTokens}
                            </div>
                            <Progress
                              value={(subscriber.currentTokens / subscriber.allocatedTokens) * 100}
                              className="w-24 h-2 mt-1"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleTokenAllocation(subscriber.id, Math.max(0, tokenAllocations[subscriber.id] - 50))
                              }
                              disabled={tokenAllocations[subscriber.id] <= 0}
                              title={
                                tokenAllocations[subscriber.id] <= 0 ? "Cannot reduce below 0" : "Reduce by 50 tokens"
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <div className="relative">
                              <Input
                                type="number"
                                value={tokenAllocations[subscriber.id]}
                                onChange={(e) => handleTokenAllocation(subscriber.id, Number(e.target.value))}
                                className={`w-20 text-center ${
                                  tokenAllocations[subscriber.id] > 0 &&
                                  remainingTokens - tokenAllocations[subscriber.id] < 0
                                    ? "border-red-500 bg-red-50"
                                    : tokenAllocations[subscriber.id] > 0
                                      ? "border-green-500 bg-green-50"
                                      : ""
                                }`}
                                min="0"
                              />
                              {tokenAllocations[subscriber.id] > 0 &&
                                remainingTokens - tokenAllocations[subscriber.id] < 0 && (
                                  <div className="absolute -bottom-6 left-0 text-xs text-red-600 whitespace-nowrap">
                                    Exceeds limit by {Math.abs(remainingTokens - tokenAllocations[subscriber.id])}
                                  </div>
                                )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTokenAllocation(subscriber.id, tokenAllocations[subscriber.id] + 50)}
                              disabled={remainingTokens - 50 < 0 && tokenAllocations[subscriber.id] === 0}
                              title={
                                remainingTokens - 50 < 0 && tokenAllocations[subscriber.id] === 0
                                  ? "Not enough tokens remaining"
                                  : "Add 50 tokens"
                              }
                              className={remainingTokens - 50 < 0 ? "opacity-50" : ""}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Active Users:</span>
                        <span className="font-semibold">{aiModel.activeUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Tokens/User:</span>
                        <span className="font-semibold">
                          {Math.round(aiModel.tokensDistributed / aiModel.activeUsers)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilization Rate:</span>
                        <span className="font-semibold">
                          {Math.round((aiModel.tokensDistributed / aiModel.tokensAvailable) * 100)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Consumers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subscribers.slice(0, 3).map((sub, index) => (
                        <div key={sub.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">#{index + 1}</span>
                            <span className="text-sm">{sub.name}</span>
                          </div>
                          <span className="text-sm font-semibold">{sub.currentTokens} tokens</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Distributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">Hilltop High School</div>
                        <div className="text-sm text-gray-600">2024-01-15 10:30 AM</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">+500 tokens</div>
                        <div className="text-sm text-gray-600">Premium allocation</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">Brookside Academy</div>
                        <div className="text-sm text-gray-600">2024-01-14 2:15 PM</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">+300 tokens</div>
                        <div className="text-sm text-gray-600">Standard allocation</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="text-sm text-gray-600">
            {totalTokensToDistribute > 0 && (
              <span>Ready to distribute {totalTokensToDistribute.toLocaleString()} tokens</span>
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleDistributeTokens}
              disabled={totalTokensToDistribute === 0 || remainingTokens < 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Coins className="h-4 w-4 mr-2" />
              Distribute Tokens
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
