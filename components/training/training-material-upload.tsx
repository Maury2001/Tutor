"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { File, CheckCircle, Globe, BookOpen, Brain, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadedFile {
  file: {
    name: string
    size: number
    type: string
  }
  id: string
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
}

interface URLResource {
  url: string
  id: string
  title: string
  status: "processing" | "success" | "error"
  error?: string
}

const TRAINING_CATEGORIES = [
  "Mathematics",
  "Science",
  "English Language",
  "Kiswahili",
  "Social Studies",
  "Creative Arts",
  "Physical Education",
  "Religious Education",
  "Agriculture",
  "Home Science",
  "Pre-Technical Studies",
  "General Knowledge",
  "Assessment Methods",
  "Teaching Strategies",
]

const CONTENT_TYPES = [
  "Curriculum Guidelines",
  "Lesson Plans",
  "Assessment Rubrics",
  "Student Worksheets",
  "Teacher Guides",
  "Educational Research",
  "Best Practices",
  "Case Studies",
  "Sample Questions",
  "Learning Objectives",
]

// Sample CBC curriculum documents for demonstration
const SAMPLE_CBC_DOCUMENTS = [
  {
    name: "CBC Mathematics Grade 4 Curriculum.pdf",
    category: "Mathematics",
    contentType: "Curriculum Guidelines",
    description: "Official CBC Mathematics curriculum for Grade 4 including learning outcomes and assessment criteria",
    size: "2.3 MB",
  },
  {
    name: "Science Experiments Grade 5-6.docx",
    category: "Science",
    contentType: "Teacher Guides",
    description: "Collection of hands-on science experiments aligned with CBC competencies",
    size: "1.8 MB",
  },
  {
    name: "English Language Assessment Rubrics.pdf",
    category: "English Language",
    contentType: "Assessment Rubrics",
    description: "Comprehensive assessment rubrics for English language skills evaluation",
    size: "1.2 MB",
  },
  {
    name: "CBC Learning Outcomes All Subjects.xlsx",
    category: "General Knowledge",
    contentType: "Learning Objectives",
    description: "Complete matrix of learning outcomes across all CBC subjects and grades",
    size: "890 KB",
  },
]

const SAMPLE_CBC_URLS = [
  {
    url: "https://kicd.ac.ke/cbc-curriculum-designs",
    title: "KICD CBC Curriculum Designs",
    description: "Official CBC curriculum designs from Kenya Institute of Curriculum Development",
  },
  {
    url: "https://kicd.ac.ke/cbc-assessment-guidelines",
    title: "CBC Assessment Guidelines",
    description: "Comprehensive assessment guidelines for CBC implementation",
  },
  {
    url: "https://kicd.ac.ke/cbc-teacher-resources",
    title: "CBC Teacher Resources",
    description: "Teaching resources and materials for CBC educators",
  },
]

export function TrainingMaterialUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [urlResources, setUrlResources] = useState<URLResource[]>([])
  const [currentUrl, setCurrentUrl] = useState("")
  const [isRetraining, setIsRetraining] = useState(false)
  const [retrainingProgress, setRetrainingProgress] = useState(0)
  const [retrainingStatus, setRetrainingStatus] = useState("")
  const [metadata, setMetadata] = useState({
    title: "CBC Mathematics Grade 4 Curriculum",
    description: "Official CBC Mathematics curriculum for Grade 4 including learning outcomes and assessment criteria",
    category: "Mathematics",
    contentType: "Curriculum Guidelines",
    tags: "cbc, mathematics, curriculum, official",
    priority: "high",
  })

  // Pre-populate with sample data for demonstration
  useState(() => {
    // Add sample document
    const mockFile = {
      name: "CBC Mathematics Grade 4 Curriculum.pdf",
      size: 2300000, // 2.3MB
      type: "application/pdf",
    }
    const newFile: UploadedFile = {
      file: mockFile,
      id: "demo-file-1",
      progress: 100,
      status: "success",
    }
    setFiles([newFile])

    // Add sample URL
    const newResource: URLResource = {
      url: "https://kicd.ac.ke/cbc-curriculum-designs",
      id: "demo-url-1",
      title: "KICD CBC Curriculum Designs",
      status: "success",
    }
    setUrlResources([newResource])
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "uploading" as const,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((uploadedFile) => {
      simulateUpload(uploadedFile.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxSize: 3 * 1024 * 1024, // 3MB
    multiple: true,
  })

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + Math.random() * 30, 100)
            if (newProgress >= 100) {
              clearInterval(interval)
              return { ...file, progress: 100, status: "success" }
            }
            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 500)
  }

  const addSampleDocument = (doc: (typeof SAMPLE_CBC_DOCUMENTS)[0]) => {
    // Create a mock file object for demonstration
    const mockFile = {
      name: doc.name,
      size: Math.floor(Math.random() * 2000000) + 500000, // Random size between 500KB and 2.5MB
      type: "application/pdf",
    }

    const newFile: UploadedFile = {
      file: mockFile,
      id: Math.random().toString(36).substr(2, 9),
      progress: 100,
      status: "success",
    }

    setFiles((prev) => [...prev, newFile])

    // Auto-fill metadata based on the document
    setMetadata({
      title: doc.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      description: doc.description,
      category: doc.category,
      contentType: doc.contentType,
      tags: `cbc, ${doc.category.toLowerCase()}, curriculum, official`,
      priority: "high",
    })
  }

  const addSampleUrl = (urlData: (typeof SAMPLE_CBC_URLS)[0]) => {
    const newResource: URLResource = {
      url: urlData.url,
      id: Math.random().toString(36).substr(2, 9),
      title: urlData.title,
      status: "processing",
    }

    setUrlResources((prev) => [...prev, newResource])

    // Simulate URL processing
    setTimeout(() => {
      setUrlResources((prev) =>
        prev.map((resource) => (resource.id === newResource.id ? { ...resource, status: "success" } : resource)),
      )
    }, 2000)
  }

  const addUrlResource = () => {
    if (!currentUrl.trim()) return

    const newResource: URLResource = {
      url: currentUrl,
      id: Math.random().toString(36).substr(2, 9),
      title: extractTitleFromUrl(currentUrl),
      status: "processing",
    }

    setUrlResources((prev) => [...prev, newResource])
    setCurrentUrl("")

    // Simulate URL processing
    setTimeout(() => {
      setUrlResources((prev) =>
        prev.map((resource) => (resource.id === newResource.id ? { ...resource, status: "success" } : resource)),
      )
    }, 2000)
  }

  const extractTitleFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname + urlObj.pathname
    } catch {
      return url
    }
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const removeUrlResource = (resourceId: string) => {
    setUrlResources((prev) => prev.filter((resource) => resource.id !== resourceId))
  }

  const handleSubmit = async () => {
    const formData = new FormData()

    // Add metadata
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // Add files
    files.forEach(({ file }) => {
      formData.append("files", file)
    })

    // Add URL resources
    formData.append("urlResources", JSON.stringify(urlResources))

    try {
      const response = await fetch("/api/training/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        // Reset form
        setFiles([])
        setUrlResources([])
        setMetadata({
          title: "",
          description: "",
          category: "",
          contentType: "",
          tags: "",
          priority: "medium",
        })
        alert("CBC training materials uploaded successfully! The AI models will be retrained with this new content.")
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    }
  }

  const simulateRetraining = () => {
    let progress = 0
    const statuses = [
      "Initializing model retraining...",
      "Processing uploaded materials...",
      "Extracting curriculum content...",
      "Updating Mathematics model...",
      "Validating model improvements...",
      "Running accuracy tests...",
      "Finalizing model updates...",
      "Retraining completed successfully!",
    ]

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5 // Random progress between 5-20%
      const statusIndex = Math.floor((progress / 100) * statuses.length)

      setRetrainingProgress(Math.min(progress, 100))
      setRetrainingStatus(statuses[Math.min(statusIndex, statuses.length - 1)])

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsRetraining(false)
          alert(
            "🎉 Model retraining completed successfully!\n\n" +
              "✅ CBC Mathematics Tutor: 89.5% → 94.2% (+4.7%)\n" +
              "✅ Assessment Generator: 85.2% → 88.9% (+3.7%)\n\n" +
              "The improved models are now active and ready to use!",
          )
        }, 1000)
      }
    }, 1000)
  }

  const handleSubmitAndRetrain = async () => {
    setIsRetraining(true)
    setRetrainingProgress(0)
    setRetrainingStatus("Starting model retraining...")

    const formData = new FormData()

    // Add metadata
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // Add files
    files.forEach(({ file }) => {
      formData.append("files", file)
    })

    // Add URL resources
    formData.append("urlResources", JSON.stringify(urlResources))

    // Add retraining flag
    formData.append("startRetraining", "true")

    // Get selected models
    const selectedModels = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .map((checkbox) => (checkbox as HTMLInputElement).id)
      .filter((id) => ["math", "science", "english", "assessment"].includes(id))

    formData.append("selectedModels", JSON.stringify(selectedModels))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Start retraining simulation
      simulateRetraining()
    } catch (error) {
      console.error("Upload and retraining failed:", error)
      setIsRetraining(false)
      alert("Upload and retraining failed. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Upload CBC Training Materials
          </CardTitle>
          <CardDescription>
            Upload CBC curriculum documents and resources to improve AI model performance
          </CardDescription>
        </CardHeader>
        <CardContent className="upload-zone-active">
          {/* Add drag-and-drop zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <File className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-sm text-gray-500 mt-1">or click to browse • PDF, DOC, DOCX, TXT, MD up to 3MB</p>
              </div>
              <Button variant="outline" type="button">
                Browse Files
              </Button>
            </div>
          </div>

          {/* Rest of the existing content */}
          {/* Retraining Progress */}
          {isRetraining && (
            <Alert className="border-blue-200 bg-blue-50">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Model Retraining in Progress</span>
                    <span className="text-sm">{retrainingProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={retrainingProgress} className="h-2" />
                  <p className="text-sm text-blue-700">{retrainingStatus}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Sample CBC Documents */}
          <Alert>
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Ready:</strong> CBC Mathematics curriculum materials are loaded and ready for retraining
            </AlertDescription>
          </Alert>

          {/* Metadata Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Training Set Title</Label>
              <Input
                id="title"
                value={metadata.title}
                onChange={(e) => setMetadata((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter training set title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={metadata.category}
                onValueChange={(value) => setMetadata((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {TRAINING_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={metadata.contentType}
                onValueChange={(value) => setMetadata((prev) => ({ ...prev, contentType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Training Priority</Label>
              <Select
                value={metadata.priority}
                onValueChange={(value) => setMetadata((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={metadata.description}
                onChange={(e) => setMetadata((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the training materials and their intended use"
                rows={3}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={metadata.tags}
                onChange={(e) => setMetadata((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g., cbc, grade4, mathematics, curriculum, official"
              />
            </div>
          </div>

          {/* Uploaded Materials Display */}
          <div className="space-y-4">
            <h3 className="font-medium">Ready Training Materials</h3>

            {/* Files */}
            {files.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Documents:</h4>
                {files.map((file) => (
                  <div key={file.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-green-50">
                    <File className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.file.name}</p>
                      <p className="text-sm text-gray-500">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* URLs */}
            {urlResources.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Online Resources:</h4>
                {urlResources.map((resource) => (
                  <div key={resource.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-blue-50">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{resource.title}</p>
                      <p className="text-sm text-gray-500 truncate">{resource.url}</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Model Retraining Section */}
          {(files.length > 0 || urlResources.length > 0) && !isRetraining && (
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-600" />
                  Retrain AI Models
                </CardTitle>
                <CardDescription>
                  Select which AI models should be retrained with the uploaded materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Model Selection */}
                <div className="space-y-3">
                  <Label>Select Models to Retrain:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: "math", name: "CBC Mathematics Tutor", category: "Mathematics", accuracy: "89.5%" },
                      { id: "science", name: "Science Experiment Guide", category: "Science", accuracy: "92.3%" },
                      { id: "english", name: "English Language Assistant", category: "English", accuracy: "87.1%" },
                      { id: "assessment", name: "Assessment Generator", category: "Assessment", accuracy: "85.2%" },
                    ].map((model) => (
                      <div key={model.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                        <input
                          type="checkbox"
                          id={model.id}
                          className="h-4 w-4 text-blue-600"
                          defaultChecked={metadata.category === model.category || model.id === "assessment"}
                        />
                        <div className="flex-1">
                          <label htmlFor={model.id} className="font-medium text-sm cursor-pointer">
                            {model.name}
                          </label>
                          <p className="text-xs text-gray-600">Current accuracy: {model.accuracy}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {model.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Training Options */}
                <div className="space-y-3">
                  <Label>Training Options:</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="incremental" className="h-4 w-4 text-blue-600" defaultChecked />
                      <label htmlFor="incremental" className="text-sm">
                        Incremental Training (faster, builds on existing knowledge)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="validation" className="h-4 w-4 text-blue-600" defaultChecked />
                      <label htmlFor="validation" className="text-sm">
                        Run validation tests after training
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="backup" className="h-4 w-4 text-blue-600" defaultChecked />
                      <label htmlFor="backup" className="text-sm">
                        Create backup of current models before retraining
                      </label>
                    </div>
                  </div>
                </div>

                {/* Training Priority */}
                <div className="space-y-2">
                  <Label htmlFor="trainingPriority">Training Priority:</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue placeholder="Select training priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority (background training)</SelectItem>
                      <SelectItem value="normal">Normal Priority</SelectItem>
                      <SelectItem value="high">High Priority (faster training)</SelectItem>
                      <SelectItem value="urgent">Urgent (immediate training)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <p>Training will begin immediately after saving materials</p>
                    <p>Estimated time: 15-45 minutes depending on material size</p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Save materials without retraining
                        handleSubmit()
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Materials Only
                    </Button>
                    <Button
                      onClick={() => {
                        // Save materials and start retraining
                        handleSubmitAndRetrain()
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isRetraining}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Save & Retrain Models
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
