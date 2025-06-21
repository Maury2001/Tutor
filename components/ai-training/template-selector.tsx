"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Filter,
  Clock,
  Database,
  Target,
  BookOpen,
  Brain,
  TestTube,
  FileText,
  Stethoscope,
  Play,
  Download,
  Star,
  Users,
  Globe,
} from "lucide-react"
import {
  EDUCATIONAL_TEMPLATES,
  searchTemplates,
  type EducationalTemplate,
} from "@/lib/ai/model-training/educational-templates"

interface TemplateSelectorProps {
  onTemplateSelect: (template: EducationalTemplate) => void
  selectedTemplate?: EducationalTemplate | null
}

export function TemplateSelector({ onTemplateSelect, selectedTemplate }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedGrade, setSelectedGrade] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [filteredTemplates, setFilteredTemplates] = useState<EducationalTemplate[]>(EDUCATIONAL_TEMPLATES)

  useEffect(() => {
    filterTemplates()
  }, [searchQuery, selectedCategory, selectedGrade, selectedSubject])

  const filterTemplates = () => {
    let templates = EDUCATIONAL_TEMPLATES

    // Apply search filter
    if (searchQuery.trim()) {
      templates = searchTemplates(searchQuery)
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      templates = templates.filter((t) => t.category === selectedCategory)
    }

    // Apply grade filter
    if (selectedGrade !== "all") {
      templates = templates.filter((t) => t.gradeRange.includes(selectedGrade))
    }

    // Apply subject filter
    if (selectedSubject !== "all") {
      templates = templates.filter((t) => t.subjects.includes(selectedSubject))
    }

    setFilteredTemplates(templates)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tutoring":
        return <BookOpen className="h-4 w-4" />
      case "assessment":
        return <TestTube className="h-4 w-4" />
      case "content-generation":
        return <FileText className="h-4 w-4" />
      case "diagnostic":
        return <Stethoscope className="h-4 w-4" />
      case "specialized":
        return <Target className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportTemplate = (template: EducationalTemplate) => {
    const dataStr = JSON.stringify(template, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${template.id}-template.json`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Educational Training Templates</h2>
          <p className="text-muted-foreground">Pre-configured templates for specific educational tasks</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredTemplates.length} templates available
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="tutoring">Tutoring</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="content-generation">Content Generation</SelectItem>
                <SelectItem value="diagnostic">Diagnostic</SelectItem>
                <SelectItem value="specialized">Specialized</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {Array.from({ length: 8 }, (_, i) => (
                  <SelectItem key={i} value={`grade${i + 1}`}>
                    Grade {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="kiswahili">Kiswahili</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="social studies">Social Studies</SelectItem>
                <SelectItem value="creative arts">Creative Arts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate?.id === template.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => onTemplateSelect(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(template.category)}
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
                <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
              </div>
              <CardDescription className="text-sm line-clamp-2">{template.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{template.estimatedTrainingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span>{template.requiredDataSize.toLocaleString()} samples</span>
                </div>
              </div>

              {/* Grade Range */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Grade Range:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.gradeRange.map((grade) => (
                    <Badge key={grade} variant="outline" className="text-xs">
                      {grade.replace("grade", "G")}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Subjects */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Subjects:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-xs capitalize">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* CBC Alignment */}
              {template.cbcAlignment && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">🇰🇪 CBC Aligned</span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3} more
                  </Badge>
                )}
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTemplateSelect(template)
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    exportTemplate(template)
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedGrade("all")
                setSelectedSubject("all")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Selected Template Details */}
      {selectedTemplate && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              Selected Template: {selectedTemplate.name}
            </CardTitle>
            <CardDescription>Ready to start training with this configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="sample-data">Sample Data</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Training Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        Category: <Badge variant="outline">{selectedTemplate.category}</Badge>
                      </div>
                      <div>
                        Difficulty:{" "}
                        <Badge className={getDifficultyColor(selectedTemplate.difficulty)}>
                          {selectedTemplate.difficulty}
                        </Badge>
                      </div>
                      <div>Estimated Time: {selectedTemplate.estimatedTrainingTime}</div>
                      <div>Required Data: {selectedTemplate.requiredDataSize.toLocaleString()} samples</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Educational Focus</h4>
                    <div className="space-y-2 text-sm">
                      <div>Grades: {selectedTemplate.gradeRange.join(", ")}</div>
                      <div>Subjects: {selectedTemplate.subjects.join(", ")}</div>
                      <div>CBC Aligned: {selectedTemplate.cbcAlignment ? "✅ Yes" : "❌ No"}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="parameters">
                <ScrollArea className="h-64">
                  <pre className="text-xs bg-muted p-4 rounded">
                    {JSON.stringify(selectedTemplate.parameters, null, 2)}
                  </pre>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="instructions">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">System Prompt</h4>
                    <div className="bg-muted p-3 rounded text-sm">{selectedTemplate.systemPrompt}</div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Training Instructions</h4>
                    <ScrollArea className="h-32">
                      <div className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">
                        {selectedTemplate.trainingInstructions}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sample-data">
                <ScrollArea className="h-64">
                  <pre className="text-xs bg-muted p-4 rounded">
                    {JSON.stringify(selectedTemplate.sampleData, null, 2)}
                  </pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
