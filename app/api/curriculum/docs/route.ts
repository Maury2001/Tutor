import { NextResponse } from "next/server"

export async function GET() {
  const apiDocs = {
    title: "CBC Curriculum API Documentation",
    version: "1.0.0",
    baseUrl: "/api/curriculum",
    endpoints: [
      {
        path: "/",
        method: "GET",
        description: "Get curriculum summary or specific format",
        parameters: [{ name: "format", type: "string", options: ["stats", "grades"], required: false }],
        example: "/api/curriculum?format=stats",
      },
      {
        path: "/grades/{grade}",
        method: "GET",
        description: "Get learning areas for a specific grade",
        parameters: [{ name: "grade", type: "path", description: "Grade level (e.g., grade1, pp1)", required: true }],
        example: "/api/curriculum/grades/grade1",
      },
      {
        path: "/learning-areas/{id}",
        method: "GET",
        description: "Get details for a specific learning area",
        parameters: [
          { name: "id", type: "path", description: "Learning area ID", required: true },
          { name: "includeStrands", type: "query", description: "Include full strand details", required: false },
        ],
        example: "/api/curriculum/learning-areas/mathematics-grade1?includeStrands=true",
      },
      {
        path: "/strands/{id}",
        method: "GET",
        description: "Get details for a specific strand",
        parameters: [
          { name: "id", type: "path", description: "Strand ID", required: true },
          { name: "includeSubStrands", type: "query", description: "Include full sub-strand details", required: false },
        ],
        example: "/api/curriculum/strands/numbers-grade1?includeSubStrands=true",
      },
      {
        path: "/sub-strands/{id}",
        method: "GET",
        description: "Get details for a specific sub-strand",
        parameters: [
          { name: "id", type: "path", description: "Sub-strand ID", required: true },
          { name: "includeOutcomes", type: "query", description: "Include full outcome details", required: false },
        ],
        example: "/api/curriculum/sub-strands/whole-numbers-grade1?includeOutcomes=true",
      },
      {
        path: "/outcomes/{id}",
        method: "GET",
        description: "Get details for a specific learning outcome",
        parameters: [{ name: "id", type: "path", description: "Learning outcome ID", required: true }],
        example: "/api/curriculum/outcomes/number-recognition-grade1",
      },
      {
        path: "/search",
        method: "GET",
        description: "Search the curriculum",
        parameters: [
          { name: "q", type: "query", description: "Search query (min 2 characters)", required: true },
          { name: "grade", type: "query", description: "Filter by grade", required: false },
          { name: "learningArea", type: "query", description: "Filter by learning area ID", required: false },
          { name: "limit", type: "query", description: "Maximum number of results", required: false },
        ],
        example: "/api/curriculum/search?q=mathematics&grade=grade1&limit=10",
      },
      {
        path: "/learning-path",
        method: "GET",
        description: "Generate a learning path",
        parameters: [
          { name: "grade", type: "query", description: "Grade level", required: true },
          { name: "learningAreaId", type: "query", description: "Filter by learning area ID", required: false },
          { name: "strandId", type: "query", description: "Filter by strand ID", required: false },
        ],
        example: "/api/curriculum/learning-path?grade=grade1&learningAreaId=mathematics-grade1",
      },
    ],
  }

  return NextResponse.json(apiDocs)
}
