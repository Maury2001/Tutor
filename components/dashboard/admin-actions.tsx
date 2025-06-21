"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import {
  Settings,
  Database,
  TestTube,
  Brain,
  Monitor,
  BarChart3,
  Wrench,
  Zap,
  Upload,
  FileText,
  GraduationCap,
  Gamepad2,
} from "lucide-react"

const ADMIN_ACTIONS = [
  { icon: Settings, label: "User Management", href: "/admin", color: "bg-red-500" },
  { icon: Database, label: "Config Check", href: "/config-verification", color: "bg-blue-500" },
  { icon: TestTube, label: "Database Setup", href: "/database-setup", color: "bg-green-500" },
  { icon: Brain, label: "AI Training", href: "/ai-training", color: "bg-purple-500" },
  { icon: Monitor, label: "AI Diagnostic", href: "/ai-diagnostic", color: "bg-orange-500" },
  { icon: BarChart3, label: "AI Monitoring", href: "/teacher/ai-monitoring", color: "bg-cyan-500" },
  { icon: Wrench, label: "Production Test", href: "/production-test", color: "bg-gray-500" },
  { icon: Zap, label: "System Health", href: "/api/health", color: "bg-yellow-500" },
  { icon: Upload, label: "Upload Materials", href: "/upload", color: "bg-indigo-500" },
  { icon: FileText, label: "Curriculum API", href: "/curriculum-api", color: "bg-teal-500" },
  { icon: GraduationCap, label: "Exam Generator", href: "/exams", color: "bg-blue-600" },
  { icon: Gamepad2, label: "Gamification", href: "/gamification", color: "bg-pink-600" },
]

export default function AdminActions({ onNavigate, isLoading }) {
  return (
    <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-700">
          <Settings className="h-5 w-5 mr-2" />
          Administrative Actions
          <Badge className="ml-2 bg-purple-100 text-purple-800">Admin Only</Badge>
        </CardTitle>
        <CardDescription>System management and configuration tools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {ADMIN_ACTIONS.map((action, index) => (
            <Button
              key={`admin-${index}`}
              variant="outline"
              size="sm"
              className="h-16 flex-col space-y-1 hover:scale-105 transition-all duration-200 border-2"
              onClick={() => onNavigate(action.href)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <action.icon className={`h-4 w-4 text-white p-0.5 rounded ${action.color}`} />
              )}
              <span className="text-xs text-center leading-tight">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
