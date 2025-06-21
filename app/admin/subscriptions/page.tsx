"use client"

import { SubscriptionManagement } from "@/components/admin/subscription-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSubscriptionsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-gray-600">Manage school subscriptions and token allocations</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Subscriptions Dashboard</CardTitle>
          <CardDescription>
            View and manage all school subscriptions, allocate tokens, and upgrade packages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionManagement />
        </CardContent>
      </Card>
    </div>
  )
}
