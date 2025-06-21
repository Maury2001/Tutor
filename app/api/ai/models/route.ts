import { NextResponse } from "next/server"

// Available AI models configuration
const AI_MODELS = {
  "gpt-4o-mini": {
    provider: "openai",
    name: "GPT-4o Mini",
    description: "Fast and efficient OpenAI model, great for quick responses",
    speed: "fast",
    quality: "high",
    cost: "low",
    recommended: true,
    strengths: ["Speed", "Efficiency", "Good reasoning"],
    bestFor: ["Quick questions", "Basic explanations", "Practice problems"],
  },
  "gpt-4o": {
    provider: "openai",
    name: "GPT-4o",
    description: "Most capable OpenAI model with advanced reasoning",
    speed: "medium",
    quality: "highest",
    cost: "high",
    recommended: false,
    strengths: ["Best reasoning", "Complex problems", "Detailed explanations"],
    bestFor: ["Complex topics", "Essay writing", "Advanced concepts"],
  },
  "gpt-3.5-turbo": {
    provider: "openai",
    name: "GPT-3.5 Turbo",
    description: "Balanced OpenAI model for general use",
    speed: "fast",
    quality: "good",
    cost: "low",
    recommended: false,
    strengths: ["Balanced performance", "Good for conversations"],
    bestFor: ["General questions", "Homework help", "Study guidance"],
  },
  "llama3-70b-8192": {
    provider: "groq",
    name: "Llama 3 70B",
    description: "Large Llama model via Groq - excellent and free!",
    speed: "very fast",
    quality: "high",
    cost: "free",
    recommended: true,
    strengths: ["Free to use", "Very fast", "Good reasoning"],
    bestFor: ["All-purpose learning", "Free tier users", "Fast responses"],
  },
  "llama3-8b-8192": {
    provider: "groq",
    name: "Llama 3 8B",
    description: "Efficient Llama model via Groq",
    speed: "very fast",
    quality: "good",
    cost: "free",
    recommended: false,
    strengths: ["Ultra fast", "Free", "Lightweight"],
    bestFor: ["Quick answers", "Simple questions", "Speed priority"],
  },
  "mixtral-8x7b-32768": {
    provider: "groq",
    name: "Mixtral 8x7B",
    description: "Mixture of experts model via Groq",
    speed: "very fast",
    quality: "high",
    cost: "free",
    recommended: true,
    strengths: ["Multi-domain expertise", "Free", "Versatile"],
    bestFor: ["Multi-subject help", "Complex reasoning", "Free users"],
  },
  "gemma-7b-it": {
    provider: "groq",
    name: "Gemma 7B",
    description: "Google's Gemma model via Groq",
    speed: "very fast",
    quality: "good",
    cost: "free",
    recommended: false,
    strengths: ["Google technology", "Free", "Fast"],
    bestFor: ["Google ecosystem", "Quick responses", "Budget users"],
  },
}

const FALLBACK_STRATEGIES = {
  balanced: {
    name: "Balanced",
    description: "Mix of free and paid models for best overall experience",
    priority: ["Quality", "Speed", "Cost"],
  },
  speed_first: {
    name: "Speed First",
    description: "Prioritize fastest response times",
    priority: ["Speed", "Quality", "Cost"],
  },
  quality_first: {
    name: "Quality First",
    description: "Prioritize best possible answers",
    priority: ["Quality", "Speed", "Cost"],
  },
  free_only: {
    name: "Free Only",
    description: "Use only free models to avoid API costs",
    priority: ["Cost", "Quality", "Speed"],
  },
  same_provider: {
    name: "Same Provider",
    description: "Stay within the same AI provider for consistency",
    priority: ["Consistency", "Quality", "Speed"],
  },
}

export async function GET() {
  // Check which providers are available
  const availableProviders = {
    openai: !!process.env.OPENAI_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
  }

  // Filter models based on available API keys
  const availableModels = Object.entries(AI_MODELS).reduce(
    (acc, [key, model]) => {
      if (availableProviders[model.provider as keyof typeof availableProviders]) {
        acc[key] = model
      }
      return acc
    },
    {} as typeof AI_MODELS,
  )

  // Get recommended model
  const recommendedModel =
    Object.entries(availableModels).find(([_, model]) => model.recommended)?.[0] ||
    Object.keys(availableModels)[0] ||
    "fallback"

  return NextResponse.json({
    models: availableModels,
    allModels: AI_MODELS, // Include all models for comparison
    fallbackStrategies: FALLBACK_STRATEGIES,
    availableProviders,
    recommendedModel,
    stats: {
      totalModels: Object.keys(AI_MODELS).length,
      availableModels: Object.keys(availableModels).length,
      freeModels: Object.values(availableModels).filter((m) => m.cost === "free").length,
      paidModels: Object.values(availableModels).filter((m) => m.cost !== "free").length,
    },
  })
}
