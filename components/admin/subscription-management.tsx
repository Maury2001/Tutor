"use client"

import { useState } from "react"
import { Users, Zap, Crown, Gift, Plus, Edit, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type SubscriptionTier = "free" | "school" | "enterprise"

export interface SubscriptionPackage {
  id: string
  name: string
  tier: SubscriptionTier
  price: number
  currency: string
  billing: "monthly" | "yearly"
  features: {
    tokens: number
    virtualLabAccess: boolean
    virtualLabExperiments: number
    aiTutorAccess: boolean
    assessmentGenerator: boolean
    progressAnalytics: boolean
    parentReports: boolean
    prioritySupport: boolean
    customBranding: boolean
    apiAccess: boolean
  }
  limits: {
    maxStudents: number
    maxTeachers: number
    maxSchools: number
  }
  popular?: boolean
}

export interface SchoolSubscription {
  id: string
  schoolId: string
  schoolName: string
  packageId: string
  packageName: string
  tier: SubscriptionTier
  status: "active" | "expired" | "suspended" | "trial"
  tokensAllocated: number
  tokensUsed: number
  studentsCount: number
  teachersCount: number
  startDate: string
  endDate: string
  autoRenew: boolean
}

const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  {
    id: "free",
    name: "Free Starter",
    tier: "free",
    price: 0,
    currency: "USD",
    billing: "monthly",
    features: {
      tokens: 10,
      virtualLabAccess: false,
      virtualLabExperiments: 0,
      aiTutorAccess: true,
      assessmentGenerator: false,
      progressAnalytics: false,
      parentReports: false,
      prioritySupport: false,
      customBranding: false,
      apiAccess: false,
    },
    limits: {
      maxStudents: 50,
      maxTeachers: 5,
      maxSchools: 1,
    },
  },
  {
    id: "school",
    name: "School Pro",
    tier: "school",
    price: 99,
    currency: "USD",
    billing: "monthly",
    popular: true,
    features: {
      tokens: 1000,
      virtualLabAccess: true,
      virtualLabExperiments: 20,
      aiTutorAccess: true,
      assessmentGenerator: true,
      progressAnalytics: true,
      parentReports: true,
      prioritySupport: true,
      customBranding: false,
      apiAccess: false,
    },
    limits: {
      maxStudents: 500,
      maxTeachers: 50,
      maxSchools: 1,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tier: "enterprise",
    price: 299,
    currency: "USD",
    billing: "monthly",
    features: {
      tokens: 10000,
      virtualLabAccess: true,
      virtualLabExperiments: -1, // Unlimited
      aiTutorAccess: true,
      assessmentGenerator: true,
      progressAnalytics: true,
      parentReports: true,
      prioritySupport: true,
      customBranding: true,
      apiAccess: true,
    },
    limits: {
      maxStudents: -1, // Unlimited
      maxTeachers: -1, // Unlimited
      maxSchools: 10,
    },
  },
]

export function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<SchoolSubscription[]>([
    {
      id: "1",
      schoolId: "school-1",
      schoolName: "Hilltop High School",
      packageId: "school",
      packageName: "School Pro",
      tier: "school",
      status: "active",
      tokensAllocated: 1000,
      tokensUsed: 450,
      studentsCount: 520,
      teachersCount: 35,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      autoRenew: true,
    },
    {
      id: "2",
      schoolId: "school-2",
      schoolName: "Brookside Academy",
      packageId: "enterprise",
      packageName: "Enterprise",
      tier: "enterprise",
      status: "active",
      tokensAllocated: 10000,
      tokensUsed: 2300,
      studentsCount: 1200,
      teachersCount: 80,
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      autoRenew: true,
    },
    {
      id: "3",
      schoolId: "school-3",
      schoolName: "Riverside Primary",
      packageId: "free",
      packageName: "Free Starter",
      tier: "free",
      status: "active",
      tokensAllocated: 10,
      tokensUsed: 8,
      studentsCount: 150,
      teachersCount: 12,
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      autoRenew: false,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [tokenAllocationModal, setTokenAllocationModal] = useState<{
    open: boolean
    subscription: SchoolSubscription | null
  }>({ open: false, subscription: null })
  const [upgradeModal, setUpgradeModal] = useState<{
    open: boolean
    subscription: SchoolSubscription | null
  }>({ open: false, subscription: null })
  const [newTokens, setNewTokens] = useState("")

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.packageName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAllocateTokens = () => {
    if (!tokenAllocationModal.subscription || !newTokens) return

    const tokensToAdd = Number.parseInt(newTokens)
    if (isNaN(tokensToAdd) || tokensToAdd <= 0) return

    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === tokenAllocationModal.subscription!.id
          ? { ...sub, tokensAllocated: sub.tokensAllocated + tokensToAdd }
          : sub,
      ),
    )

    setTokenAllocationModal({ open: false, subscription: null })
    setNewTokens("")
  }

  const handleUpgradeSubscription = (newPackageId: string) => {
    if (!upgradeModal.subscription) return

    const newPackage = SUBSCRIPTION_PACKAGES.find((pkg) => pkg.id === newPackageId)
    if (!newPackage) return

    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === upgradeModal.subscription!.id
          ? {
              ...sub,
              packageId: newPackage.id,
              packageName: newPackage.name,
              tier: newPackage.tier,
              tokensAllocated: sub.tokensAllocated + newPackage.features.tokens,
            }
          : sub,
      ),
    )

    setUpgradeModal({ open: false, subscription: null })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "suspended":
        return "bg-orange-100 text-orange-800"
      case "trial":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case "free":
        return <Gift className="h-4 w-4" />
      case "school":
        return <Users className="h-4 w-4" />
      case "enterprise":
        return <Crown className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="subscriptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscriptions">Active Subscriptions</TabsTrigger>
          <TabsTrigger value="packages">Subscription Packages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search schools or packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          </div>

          {/* Subscriptions List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredSubscriptions.map((subscription) => (
              <Card key={subscription.id} className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {getTierIcon(subscription.tier)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{subscription.schoolName}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{subscription.packageName}</span>
                          <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Students</div>
                        <div className="font-semibold">{subscription.studentsCount}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Teachers</div>
                        <div className="font-semibold">{subscription.teachersCount}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Tokens</div>
                        <div className="font-semibold">
                          {subscription.tokensUsed}/{subscription.tokensAllocated}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setTokenAllocationModal({ open: true, subscription })}
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Add Tokens
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setUpgradeModal({ open: true, subscription })}>
                        <Edit className="h-4 w-4 mr-1" />
                        Upgrade
                      </Button>
                    </div>
                  </div>

                  {/* Token Usage Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Token Usage</span>
                      <span>{Math.round((subscription.tokensUsed / subscription.tokensAllocated) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(subscription.tokensUsed / subscription.tokensAllocated) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_PACKAGES.map((pkg) => (
              <Card key={pkg.id} className={`border-2 ${pkg.popular ? "border-blue-500 relative" : ""}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      {getTierIcon(pkg.tier)}
                      <span>{pkg.name}</span>
                    </CardTitle>
                  </div>
                  <div className="text-3xl font-bold">
                    ${pkg.price}
                    <span className="text-sm font-normal text-gray-600">/{pkg.billing}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tokens</span>
                      <span className="font-semibold">{pkg.features.tokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Virtual Lab</span>
                      <span className="font-semibold">
                        {pkg.features.virtualLabAccess
                          ? pkg.features.virtualLabExperiments === -1
                            ? "Unlimited"
                            : `${pkg.features.virtualLabExperiments} experiments`
                          : "No access"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Students</span>
                      <span className="font-semibold">
                        {pkg.limits.maxStudents === -1 ? "Unlimited" : pkg.limits.maxStudents}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Teachers</span>
                      <span className="font-semibold">
                        {pkg.limits.maxTeachers === -1 ? "Unlimited" : pkg.limits.maxTeachers}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Features:</h4>
                    <div className="space-y-1 text-sm">
                      {pkg.features.aiTutorAccess && <div>✅ AI Tutor Access</div>}
                      {pkg.features.assessmentGenerator && <div>✅ Assessment Generator</div>}
                      {pkg.features.progressAnalytics && <div>✅ Progress Analytics</div>}
                      {pkg.features.parentReports && <div>✅ Parent Reports</div>}
                      {pkg.features.prioritySupport && <div>✅ Priority Support</div>}
                      {pkg.features.customBranding && <div>✅ Custom Branding</div>}
                      {pkg.features.apiAccess && <div>✅ API Access</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$12,450</div>
                <p className="text-sm text-gray-600">Monthly recurring revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{subscriptions.filter((s) => s.status === "active").length}</div>
                <p className="text-sm text-gray-600">Schools with active plans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {subscriptions.reduce((acc, sub) => acc + sub.tokensUsed, 0).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Total tokens consumed</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Token Allocation Modal */}
      <Dialog
        open={tokenAllocationModal.open}
        onOpenChange={(open) => setTokenAllocationModal({ open, subscription: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate Additional Tokens</DialogTitle>
            <DialogDescription>
              Add tokens to {tokenAllocationModal.subscription?.schoolName}'s subscription
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tokens">Number of Tokens</Label>
              <Input
                id="tokens"
                type="number"
                placeholder="Enter number of tokens"
                value={newTokens}
                onChange={(e) => setNewTokens(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-600">
              Current allocation: {tokenAllocationModal.subscription?.tokensAllocated} tokens
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTokenAllocationModal({ open: false, subscription: null })}>
              Cancel
            </Button>
            <Button onClick={handleAllocateTokens}>Allocate Tokens</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Subscription Modal */}
      <Dialog open={upgradeModal.open} onOpenChange={(open) => setUpgradeModal({ open, subscription: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Subscription</DialogTitle>
            <DialogDescription>
              Change subscription package for {upgradeModal.subscription?.schoolName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="package">New Package</Label>
              <Select onValueChange={handleUpgradeSubscription}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a package" />
                </SelectTrigger>
                <SelectContent>
                  {SUBSCRIPTION_PACKAGES.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.name} - ${pkg.price}/{pkg.billing}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeModal({ open: false, subscription: null })}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
