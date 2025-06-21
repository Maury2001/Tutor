"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Settings,
  Play,
  Plus,
  History,
  RefreshCw,
  DollarSign,
  Zap,
  GraduationCap,
  Palette,
  Wrench,
  FlaskRoundIcon as Flask,
  TrendingUp,
  Moon,
  ClipboardCheck,
  Undo2,
  Eye,
  Copy,
} from "lucide-react"

interface ConfigTemplate {
  id: number
  name: string
  description?: string
  category: string
  icon: string
  color: string
  is_system_template: boolean
  is_active: boolean
  config_data: any
  usage_stats: {
    applied_count: number
    last_applied?: string
  }
  created_at: string
  updated_at: string
}

interface TemplateApplication {
  id: number
  template_id: number
  applied_by: string
  application_reason?: string
  created_at: string
  auth: {
    users: {
      email: string
      raw_user_meta_data: any
    }
  }
}

interface Category {
  value: string
  label: string
  icon: string
}

const iconMap = {
  "dollar-sign": DollarSign,
  zap: Zap,
  "graduation-cap": GraduationCap,
  palette: Palette,
  wrench: Wrench,
  flask: Flask,
  "trending-up": TrendingUp,
  moon: Moon,
  "clipboard-check": ClipboardCheck,
  settings: Settings,
}

const colorMap = {
  green: "bg-green-100 text-green-800 border-green-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  pink: "bg-pink-100 text-pink-800 border-pink-200",
  red: "bg-red-100 text-red-800 border-red-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
  slate: "bg-slate-100 text-slate-800 border-slate-200",
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
}

export function AIConfigTemplates() {
  const [templates, setTemplates] = useState<ConfigTemplate[]>([])
  const [applications, setApplications] = useState<TemplateApplication[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ConfigTemplate | null>(null)
  const [applyReason, setApplyReason] = useState("")

  // New template form
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "general",
    icon: "settings",
    color: "blue",
    config_data: "{}",
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/ai-config/templates")
      const data = await response.json()

      if (data.success) {
        setTemplates(data.templates)
        setApplications(data.applications)
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyTemplate = async (templateId: number, reason: string) => {
    try {
      const response = await fetch(`/api/admin/ai-config/templates/${templateId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`Template "${data.template_name}" applied successfully! ${data.configs_updated} configurations updated.`)
        await fetchTemplates() // Refresh data
        setApplyReason("")
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      console.error("Failed to apply template:", error)
      alert(`Failed to apply template: ${error.message}`)
    }
  }

  const rollbackConfiguration = async (applicationId: number) => {
    try {
      const response = await fetch("/api/admin/ai-config/templates/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: applicationId }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`Configuration rolled back successfully! ${data.configs_restored} configurations restored.`)
        await fetchTemplates() // Refresh data
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      console.error("Failed to rollback configuration:", error)
      alert(`Failed to rollback configuration: ${error.message}`)
    }
  }

  const createTemplate = async () => {
    try {
      let configData
      try {
        configData = JSON.parse(newTemplate.config_data)
      } catch {
        alert("Invalid JSON in configuration data")
        return
      }

      const response = await fetch("/api/admin/ai-config/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTemplate,
          config_data: configData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Template created successfully!")
        setShowCreateDialog(false)
        setNewTemplate({
          name: "",
          description: "",
          category: "general",
          icon: "settings",
          color: "blue",
          config_data: "{}",
        })
        await fetchTemplates()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      console.error("Failed to create template:", error)
      alert(`Failed to create template: ${error.message}`)
    }
  }

  const duplicateTemplate = (template: ConfigTemplate) => {
    setNewTemplate({
      name: `${template.name} (Copy)`,
      description: template.description || "",
      category: template.category,
      icon: template.icon,
      color: template.color,
      config_data: JSON.stringify(template.config_data, null, 2),
    })
    setShowCreateDialog(true)
  }

  const filteredTemplates = templates.filter((template) => {
    if (selectedCategory === "all") return true
    return template.category === selectedCategory
  })

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Settings
    return IconComponent
  }

  const getColorClass = (color: string) => {
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading configuration templates...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            AI Configuration Templates
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Pre-defined configuration sets for different scenarios</p>
            <div className="flex gap-2">
              <Button onClick={fetchTemplates} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Configuration Template</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Template Name</Label>
                        <Input
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                          placeholder="Enter template name"
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select
                          value={newTemplate.category}
                          onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newTemplate.description}
                        onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                        placeholder="Describe what this template is for"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Icon</Label>
                        <Input
                          value={newTemplate.icon}
                          onChange={(e) => setNewTemplate({ ...newTemplate, icon: e.target.value })}
                          placeholder="Icon name (e.g., settings)"
                        />
                      </div>
                      <div>
                        <Label>Color</Label>
                        <Select
                          value={newTemplate.color}
                          onValueChange={(value) => setNewTemplate({ ...newTemplate, color: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(colorMap).map((color) => (
                              <SelectItem key={color} value={color}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${colorMap[color as keyof typeof colorMap]}`} />
                                  {color}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Configuration Data (JSON)</Label>
                      <Textarea
                        value={newTemplate.config_data}
                        onChange={(e) => setNewTemplate({ ...newTemplate, config_data: e.target.value })}
                        placeholder="Enter configuration JSON"
                        className="font-mono text-sm"
                        rows={10}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createTemplate}>Create Template</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Application History</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Templates
            </Button>
            {categories.map((category) => {
              const IconComponent = getIcon(category.icon)
              return (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <IconComponent className="h-4 w-4 mr-1" />
                  {category.label}
                </Button>
              )
            })}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const IconComponent = getIcon(template.icon)
              return (
                <Card key={template.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getColorClass(template.color)}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                            {template.is_system_template && (
                              <Badge variant="outline" className="text-xs">
                                System
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>

                    <div className="text-xs text-gray-500">
                      <div>Applied {template.usage_stats.applied_count} times</div>
                      {template.usage_stats.last_applied && (
                        <div>Last: {new Date(template.usage_stats.last_applied).toLocaleDateString()}</div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" className="flex-1">
                            <Play className="h-4 w-4 mr-1" />
                            Apply
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Apply Configuration Template</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will apply the "{template.name}" configuration template to your system. Current
                              settings will be backed up for rollback.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="my-4">
                            <Label>Reason for applying (optional)</Label>
                            <Textarea
                              value={applyReason}
                              onChange={(e) => setApplyReason(e.target.value)}
                              placeholder="Why are you applying this template?"
                              className="mt-1"
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => applyTemplate(template.id, applyReason)}>
                              Apply Template
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTemplate(template)
                          setShowPreviewDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button size="sm" variant="outline" onClick={() => duplicateTemplate(template)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-6 w-6" />
                Template Application History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Template Applied by {app.auth.users.email}</div>
                        <div className="text-sm text-gray-500">{new Date(app.created_at).toLocaleString()}</div>
                        {app.application_reason && (
                          <div className="text-sm text-gray-600 mt-1">Reason: {app.application_reason}</div>
                        )}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => rollbackConfiguration(app.id)}>
                        <Undo2 className="h-4 w-4 mr-1" />
                        Rollback
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Template Preview: {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Configuration</h4>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                  {JSON.stringify(selectedTemplate.config_data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
