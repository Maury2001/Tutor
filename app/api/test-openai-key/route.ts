import { type NextRequest, NextResponse } from "next/server"
import { OpenAI } from "openai"

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    // Use the provided API key or fall back to environment variable
    const openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    })

    // Make a simple test request
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say 'API key test successful' if you can read this message.",
        },
      ],
      max_tokens: 20,
      temperature: 0,
    })

    return NextResponse.json({
      success: true,
      message: "API key is working!",
      response: response.choices[0].message.content,
      model: response.model,
      usage: response.usage,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        type: error.type || "unknown_error",
      },
      { status: 400 },
    )
  }
}
