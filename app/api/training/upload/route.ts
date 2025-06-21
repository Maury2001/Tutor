import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract metadata
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const contentType = formData.get("contentType") as string
    const tags = formData.get("tags") as string
    const priority = formData.get("priority") as string

    // Extract files
    const files = formData.getAll("files") as File[]

    // Extract URL resources
    const urlResourcesString = formData.get("urlResources") as string
    const urlResources = urlResourcesString ? JSON.parse(urlResourcesString) : []

    // Validate required fields
    if (!title || !category || !contentType) {
      return NextResponse.json({ error: "Missing required fields: title, category, or contentType" }, { status: 400 })
    }

    // Validate file sizes (3MB limit)
    for (const file of files) {
      if (file.size > 3 * 1024 * 1024) {
        return NextResponse.json({ error: `File ${file.name} exceeds 3MB limit` }, { status: 400 })
      }
    }

    // Validate file types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "text/markdown",
    ]

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `File type ${file.type} is not supported` }, { status: 400 })
      }
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real implementation, you would:
    // 1. Upload files to cloud storage (AWS S3, Google Cloud, etc.)
    // 2. Process URLs to extract content
    // 3. Store metadata in database
    // 4. Queue files for AI model training
    // 5. Generate embeddings for semantic search
    // 6. Validate content quality and relevance

    const processedFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: `/training/files/${file.name}`, // Mock URL
      status: "processed",
    }))

    const processedUrls = urlResources.map((resource: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: resource.url,
      title: resource.title,
      status: "processed",
      contentLength: Math.floor(Math.random() * 10000) + 1000, // Mock content length
    }))

    // Mock training material record
    const trainingMaterial = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      category,
      contentType,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      priority,
      files: processedFiles,
      urls: processedUrls,
      status: "ready_for_training",
      createdAt: new Date().toISOString(),
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      fileCount: files.length,
      urlCount: urlResources.length,
    }

    return NextResponse.json({
      success: true,
      message: "Training materials uploaded successfully",
      data: trainingMaterial,
    })
  } catch (error) {
    console.error("Error uploading training materials:", error)
    return NextResponse.json({ error: "Failed to upload training materials" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Mock training materials data
    const materials = [
      {
        id: "1",
        title: "Grade 4 Mathematics Curriculum",
        category: "Mathematics",
        status: "ready_for_training",
        fileCount: 12,
        urlCount: 3,
        totalSize: 15728640, // 15MB
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        title: "Science Experiment Collection",
        category: "Science",
        status: "training",
        fileCount: 8,
        urlCount: 5,
        totalSize: 8388608, // 8MB
        createdAt: "2024-01-14T14:20:00Z",
      },
    ]

    return NextResponse.json({
      success: true,
      data: materials,
      total: materials.length,
    })
  } catch (error) {
    console.error("Error fetching training materials:", error)
    return NextResponse.json({ error: "Failed to fetch training materials" }, { status: 500 })
  }
}
