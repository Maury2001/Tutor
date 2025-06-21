"use client"

import { useState, useMemo, useCallback, Suspense, lazy } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Brain,
  Zap,
  Trophy,
  TestTube,
  BarChart3,
  LogOut,
  Loader2,
  Menu,
  X,
} from "lucide-react"

// Lazy load heavy components
const LazyAdminActions = lazy(() => import("@/components/dashboard/admin-actions"))
const LazyProgressSection = lazy(() => import("@/components/dashboard/progress-section"))



// Optimized loading skeleton
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div>
                <div className="h-4 sm:h-6 w-32 sm:w-48 bg-gray-200 rounded animate-pulse mb-1 sm:mb-2"></div>
                <div className="h-3 sm:h-4 w-24 sm:w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-6 sm:h-8 w-16 sm:w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="h-48 sm:h-64 bg-gray-200 rounded-lg animate-pulse mb-6 sm:mb-8"></div>
      </div>
    </div>
  )
}

// Memoized user data
const createUserData = () => ({
  id: "user-123",
  name: "Admin",
  email: "workerpeter@gmail.com",
  role: "admin",
  gradeLevel: "Grade 8",
  avatar: "/placeholder-user.jpg",
  school: "Nairobi Primary School",
  class: "8A",
  isActive: true,
  lastLogin: new Date().toISOString(),
})

// Memoized stats data
const createStatsData = () => ({
  overallProgress: 78,
  completedLessons: 45,
  totalLessons: 60,
  currentStreak: 7,
  weeklyGoal: 85,
  badges: 12,
  points: 2450,
  rank: 3,
  studyTime: 120,
  accuracy: 92.5,
})

// Memoized quick actions with responsive icons
const QUICK_ACTIONS = [
  { icon: BookOpen, label: "Continue Learning", href: "/learning", color: "bg-blue-500", shortLabel: "Learn" },
  { icon: Brain, label: "AI Tutor", href: "/tutor/cbc", color: "bg-purple-500", shortLabel: "Tutor" },
  { icon: TestTube, label: "Virtual Lab", href: "/virtual-lab", color: "bg-green-500", shortLabel: "Lab" },
  { icon: Trophy, label: "Achievements", href: "/gamification", color: "bg-yellow-500", shortLabel: "Awards" },
  { icon: BarChart3, label: "Progress", href: "/analytics", color: "bg-indigo-500", shortLabel: "Stats" },
  { icon: Users, label: "Study Groups", href: "/collaboration", color: "bg-pink-500", shortLabel: "Groups" },
]

// Responsive stats card component
const StatsCard = ({ title, value, subtitle, icon: Icon, gradient, isCompact = false }) => (
  <Card className={`${gradient} text-white transition-all duration-200 hover:scale-105`}>
    <CardContent className={`${isCompact ? "p-3 sm:p-6" : "p-6"}`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className={`text-white/80 ${isCompact ? "text-xs sm:text-sm" : "text-sm"} truncate`}>{title}</p>
          <p className={`font-bold text-white ${isCompact ? "text-lg sm:text-3xl" : "text-3xl"} truncate`}>{value}</p>
          {subtitle && <p className={`text-white/70 ${isCompact ? "text-xs" : "text-xs"} truncate`}>{subtitle}</p>}
        </div>
        <Icon className={`text-white/60 flex-shrink-0 ${isCompact ? "h-6 w-6 sm:h-8 sm:w-8" : "h-8 w-8"}`} />
      </div>
    </CardContent>
  </Card>
)

// Responsive quick action button
const QuickActionButton = ({ action, onClick, isLoading, isCompact = false }) => (
  <Button
    variant="outline"
    className={`${isCompact ? "h-16 sm:h-20" : "h-20"} w-full flex-col space-y-1 sm:space-y-2 hover:scale-105 transition-transform`}
    onClick={() => onClick(action.href)}
    disabled={isLoading}
  >
    {isLoading ? (
      <Loader2 className={`${isCompact ? "h-4 w-4 sm:h-6 sm:w-6" : "h-6 w-6"} animate-spin`} />
    ) : (
      <action.icon
        className={`text-white p-1 rounded ${action.color} ${isCompact ? "h-4 w-4 sm:h-6 sm:w-6" : "h-6 w-6"}`}
      />
    )}
    <span className={`text-center leading-tight ${isCompact ? "text-xs sm:text-sm" : "text-xs"}`}>
      <span className="sm:hidden">{action.shortLabel}</span>
      <span className="hidden sm:inline">{action.label}</span>
    </span>
  </Button>
)

export default function ResponsiveDashboard() {
  // Use lazy initialization for expensive computations
  const [user] = useState(createUserData)
  const [stats] = useState(createStatsData)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loadingHref, setLoadingHref] = useState<string | null>(null)

  // Optimize mounting
  useState(() => {
    setMounted(true)
  })

  // Memoized calculations
  const progressPercentage = useMemo(() => {
    const completed = Number(stats.completedLessons) || 0
    const total = Number(stats.totalLessons) || 1
    return Math.round((completed / total) * 100)
  }, [stats.completedLessons, stats.totalLessons])

  const getRoleColor = useCallback((role) => {
    const colors = {
      admin: "bg-red-100 text-red-800 border-red-200",
      teacher: "bg-blue-100 text-blue-800 border-blue-200",
      school: "bg-green-100 text-green-800 border-green-200",
      student: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[role?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200"
  }, [])

  const handleNavigation = useCallback((href:string) => {
    setIsLoading(true)
    // Use requestIdleCallback for non-urgent navigation
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        window.location.href = href
      })
    } else {
      setTimeout(() => {
        window.location.href = href
      }, 0)
    }
  }, [])

  const handleLogout = useCallback(() => {
    try {
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = "/auth/signin"
    } catch (error) {
      console.error("Logout failed:", error)
      window.location.reload()
    }
  }, [])

  const userInitials = useMemo(() => {
    const name = String(user.name || "User")
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }, [user.name])

  const isAdmin = useMemo(() => {
    const role = String(user.role || "").toLowerCase()
    const email = String(user.email || "").toLowerCase()
    return role === "admin" || email === "workerpeter@gmail.com"
  }, [user.role, user.email])

  // Show skeleton while mounting
  if (!mounted) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-xl font-semibold text-gray-900 truncate">
                    <span className="sm:hidden">Welcome!</span>
                    <span className="hidden sm:inline">Welcome back, {user.name} !</span>
                   
                  </h1>
                  <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
                    <span className="truncate max-w-24 sm:max-w-none">{user.school}</span>
                    <span className="hidden sm:inline">•</span>
                    <Badge className={`${getRoleColor(user.role)} text-xs px-1 sm:px-2`}>
                      {String(user.role || "user")
                        .charAt(0)
                        .toUpperCase() + String(user.role || "user").slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-lg sm:text-2xl font-bold text-gray-900">{stats.points.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-gray-500">Total Points</div>
              </div>
              <div className="text-right sm:hidden">
                <div className="text-sm font-bold text-gray-900">{stats.points.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Points</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs sm:text-sm">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Quick Actions</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                {QUICK_ACTIONS.map((action, index) => (
                  <button
                    key={`mobile-${index}`}
                    
                    onClick={() => {
                      handleNavigation(action.href)
                      setSidebarOpen(false)
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <action.icon className={`h-5 w-5 text-white p-1 rounded ${action.color}`} />
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Quick Stats - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            title="Overall Progress"
            value={`${stats.overallProgress}%`}
            icon={TrendingUp}
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
            isCompact={true}
          />
          <StatsCard
            title="Lessons"
            value={`${stats.completedLessons}/${stats.totalLessons}`}
            subtitle="Completed"
            icon={BookOpen}
            gradient="bg-gradient-to-r from-green-500 to-green-600"
            isCompact={true}
          />
          <StatsCard
            title="Streak"
            value={`${stats.currentStreak}`}
            subtitle="days"
            icon={Zap}
            gradient="bg-gradient-to-r from-yellow-500 to-yellow-600"
            isCompact={true}
          />
          <StatsCard
            title="Badges"
            value={stats.badges}
            subtitle="earned"
            icon={Award}
            gradient="bg-gradient-to-r from-purple-500 to-purple-600"
            isCompact={true}
          />
        </div>

        {/* Quick Actions - Responsive Layout */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
              {QUICK_ACTIONS.map((action, index) => (
                <QuickActionButton
                  key={`quick-${index}`}
                  action={action}
                  onClick={handleNavigation}
                  isLoading={loadingHref === action.href}
                  isCompact={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions - Lazy Loaded */}
        {isAdmin && (
          <Suspense fallback={<div className="h-48 sm:h-64 bg-gray-100 rounded-lg animate-pulse mb-6 sm:mb-8"></div>}>
            <LazyAdminActions onNavigate={handleNavigation} isLoading={isLoading} />
          </Suspense>
        )}

        {/* Progress Section - Lazy Loaded */}
        <Suspense fallback={<div className="h-64 sm:h-96 bg-gray-100 rounded-lg animate-pulse"></div>}>
          <LazyProgressSection />
        </Suspense>
      </div>
    </div>
  )
}
