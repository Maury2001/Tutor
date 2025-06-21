"use client"

import { useState } from "react"
import {
  Users,
  Building,
  Brain,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Zap,
  School,
  UserCheck,
  Settings,
  BarChart3,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdminStats {
  totalUsers: number
  totalStudents: number
  totalTeachers: number
  totalSchools: number
  totalRevenue: number
  monthlyRevenue: number
  tokensAllocated: number
  tokensUsed: number
  activeSubscriptions: number
  systemHealth: number
}

export function ComprehensiveAdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 12847,
    totalStudents: 10589,
    totalTeachers: 1258,
    totalSchools: 145,
    totalRevenue: 245670,
    monthlyRevenue: 34580,
    tokensAllocated: 2500000,
    tokensUsed: 1847320,
    activeSubscriptions: 142,
    systemHealth: 98.5,
  })

  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Administrative Dashboard</h1>
        <p className="text-purple-100">Complete platform overview and management controls</p>
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded">🏫 {stats.totalSchools} Schools</span>
          <span className="bg-white/20 px-3 py-1 rounded">👥 {stats.totalUsers.toLocaleString()} Users</span>
          <span className="bg-white/20 px-3 py-1 rounded">💰 ${stats.monthlyRevenue.toLocaleString()} MRR</span>
          <span className="bg-white/20 px-3 py-1 rounded">🔥 {stats.systemHealth}% Uptime</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchools}</div>
            <p className="text-xs text-muted-foreground">+8 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+234 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Token Usage</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((stats.tokensUsed / stats.tokensAllocated) * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.tokensUsed.toLocaleString()} / {stats.tokensAllocated.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tokens">AI Tokens</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                System Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded border">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-green-600">{stats.systemHealth}%</div>
                  <div className="text-sm text-gray-600">System Uptime</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded border">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-blue-600">1.2s</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded border">
                  <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-purple-600">99.9%</div>
                  <div className="text-sm text-gray-600">API Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <School className="h-5 w-5 text-blue-600" />
                    <span>New school enrollment: Mombasa Academy</span>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span>Payment received: $2,450 from Nairobi Primary</span>
                  </div>
                  <span className="text-sm text-gray-500">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <span>Token allocation: 50,000 tokens to Kisumu High</span>
                  </div>
                  <span className="text-sm text-gray-500">6 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schools" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>School Management</CardTitle>
                <Button>
                  <Building className="h-4 w-4 mr-2" />
                  Add School
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Hilltop Primary", students: 520, plan: "Premium", status: "Active" },
                  { name: "Mombasa Academy", students: 680, plan: "Enterprise", status: "Active" },
                  { name: "Nairobi High", students: 450, plan: "Standard", status: "Active" },
                  { name: "Kisumu Primary", students: 380, plan: "Premium", status: "Trial" },
                ].map((school, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{school.name}</h4>
                        <Badge variant={school.status === "Active" ? "default" : "secondary"}>{school.status}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>Students: {school.students}</div>
                        <div>Plan: {school.plan}</div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-2">
                  <div>Active: 9,847</div>
                  <div>New this month: 234</div>
                  <div>Avg. engagement: 85%</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Teachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalTeachers.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-2">
                  <div>Active: 1,189</div>
                  <div>New this month: 23</div>
                  <div>Avg. materials: 12</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Administrators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">89</div>
                <div className="text-sm text-gray-600 mt-2">
                  <div>School admins: 67</div>
                  <div>System admins: 22</div>
                  <div>Super admins: 3</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Token Management & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-purple-50 rounded border">
                  <div className="text-2xl font-bold text-purple-600">{stats.tokensAllocated.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Allocated</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded border">
                  <div className="text-2xl font-bold text-blue-600">{stats.tokensUsed.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Tokens Used</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded border">
                  <div className="text-2xl font-bold text-green-600">
                    {(stats.tokensAllocated - stats.tokensUsed).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded border">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round((stats.tokensUsed / stats.tokensAllocated) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Usage Rate</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Token Usage</span>
                    <span>
                      {stats.tokensUsed.toLocaleString()} / {stats.tokensAllocated.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(stats.tokensUsed / stats.tokensAllocated) * 100} className="h-3" />
                </div>

                <div>
                  <h4 className="font-medium mb-3">Token Distribution by School Type:</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Premium Schools (45 schools)</span>
                        <span>1,250,000 tokens</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Enterprise Schools (12 schools)</span>
                        <span>890,000 tokens</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Standard Schools (88 schools)</span>
                        <span>360,000 tokens</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">${stats.monthlyRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Monthly Recurring Revenue</div>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Revenue by Plan:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Enterprise Plans</span>
                        <span>$18,450/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Premium Plans</span>
                        <span>$12,890/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Standard Plans</span>
                        <span>$3,240/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Subscription Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                    <div className="text-sm text-gray-600">Active Subscriptions</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Renewal Rate</span>
                      <span className="font-medium text-green-600">94.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Churn Rate</span>
                      <span className="font-medium text-red-600">5.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg. Contract Value</span>
                      <span className="font-medium">$1,890</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Upcoming Renewals:</h4>
                    <div className="space-y-1 text-sm">
                      <div>• 12 schools renewing this month</div>
                      <div>• $23,450 in renewal value</div>
                      <div>• 3 schools at risk of churn</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>System Uptime</span>
                    <span className="font-medium text-green-600">{stats.systemHealth}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Response Time</span>
                    <span className="font-medium">1.2s avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database Performance</span>
                    <span className="font-medium text-green-600">Excellent</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>CDN Performance</span>
                    <span className="font-medium text-green-600">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div className="text-sm">
                      <div className="font-medium">High Token Usage</div>
                      <div className="text-gray-600">3 schools approaching token limits</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded border border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="text-sm">
                      <div className="font-medium">System Update Complete</div>
                      <div className="text-gray-600">All services running latest version</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
