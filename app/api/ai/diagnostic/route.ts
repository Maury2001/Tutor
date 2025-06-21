import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function GET() {
  const diagnosticResults = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      openaiKeyExists: !!process.env.OPENAI_API_KEY,
      openaiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
      groqKeyExists: !!process.env.GROQ_API_KEY,
    },
    tests: [] as any[],
  }

  try {
    // Test 1: Simple OpenAI connection
    const startTime = Date.now()
    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: [{ role: "user", content: "Respond with 'OK' if you can hear me." }],
      maxTokens: 10,
    })

    diagnosticResults.tests.push({
      name: "OpenAI Connection Test",
      success: text.includes("OK"),
      responseTime: Date.now() - startTime,
      response: text,
    })
  } catch (error: any) {
    diagnosticResults.tests.push({
      name: "OpenAI Connection Test",
      success: false,
      error: error.message,
      errorCode: error.code || "unknown",
      errorType: error.type || "unknown",
    })
  }

  // Add network connectivity test
  try {
    const networkStart = Date.now()
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    })

    const data = await response.json()

    diagnosticResults.tests.push({
      name: "OpenAI API Network Test",
      success: response.ok,
      status: response.status,
      responseTime: Date.now() - networkStart,
      models: data.data ? data.data.length : 0,
    })
  } catch (error: any) {
    diagnosticResults.tests.push({
      name: "OpenAI API Network Test",
      success: false,
      error: error.message,
    })
  }

  return NextResponse.json(diagnosticResults)
}
