import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { audioTranscript, studentId, language, context } = await request.json()

    if (!audioTranscript) {
      return NextResponse.json(
        {
          error: "Audio transcript is required",
        },
        { status: 400 },
      )
    }

    const voicePrompt = `Process voice interaction for CBC student in Kenya:

Audio Transcript: ${audioTranscript}
Student ID: ${studentId || "anonymous"}
Language: ${language || "English"}
Context: ${JSON.stringify(context || {})}

Provide voice-optimized response that:
1. Acknowledges the student's spoken input
2. Provides clear, conversational response
3. Uses appropriate language (English/Kiswahili)
4. Includes pronunciation guidance if needed
5. Encourages continued voice interaction
6. Adapts to CBC curriculum context
7. Provides audio-friendly explanations
8. Suggests voice-based activities

Voice Interaction Guidelines:
- Keep responses conversational and natural
- Use simple, clear language
- Include pauses for comprehension
- Encourage student to speak more
- Provide positive reinforcement
- Use culturally appropriate greetings
- Include interactive voice elements`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: voicePrompt,
      maxTokens: 800,
      temperature: 0.8,
    })

    // Generate voice-specific features
    const voiceFeatures = generateVoiceFeatures(audioTranscript, language)
    const pronunciationGuide = generatePronunciationGuide(text, language)

    return NextResponse.json({
      success: true,
      voiceInteraction: {
        spokenResponse: text,
        voiceFeatures,
        pronunciationGuide,
        suggestedVoiceActivities: generateVoiceActivities(context),
        languageSupport: generateLanguageSupport(language),
      },
      metadata: {
        studentId,
        language,
        transcriptLength: audioTranscript.length,
        processedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Voice Interaction API Error:", error)
    return NextResponse.json({ error: "Failed to process voice interaction" }, { status: 500 })
  }
}

function generateVoiceFeatures(transcript: string, language: string) {
  return {
    detectedEmotion: analyzeEmotion(transcript),
    confidenceLevel: analyzeConfidence(transcript),
    speechClarity: "good", // Would be determined by actual audio analysis
    languageAccuracy: language === "English" ? "high" : "medium",
    suggestedImprovement: "Practice speaking more slowly for better clarity",
  }
}

function generatePronunciationGuide(text: string, language: string) {
  // Extract difficult words and provide pronunciation guidance
  const difficultWords = extractDifficultWords(text)

  return difficultWords.map((word) => ({
    word,
    pronunciation: generatePhoneticSpelling(word),
    audioTip: `Break it down: ${word.split("").join("-")}`,
  }))
}

function generateVoiceActivities(context: any) {
  return [
    {
      activity: "Read Aloud",
      description: "Practice reading a short passage aloud",
      duration: "5 minutes",
    },
    {
      activity: "Voice Questions",
      description: "Answer questions using your voice",
      duration: "10 minutes",
    },
    {
      activity: "Pronunciation Practice",
      description: "Practice difficult words with voice feedback",
      duration: "8 minutes",
    },
  ]
}

function generateLanguageSupport(language: string) {
  if (language === "Kiswahili") {
    return {
      greetings: ["Habari", "Hujambo", "Mambo"],
      encouragement: ["Hongera!", "Vizuri sana!", "Endelea hivyo!"],
      commonPhrases: ["Asante sana", "Karibu", "Pole"],
    }
  }

  return {
    greetings: ["Hello", "Good morning", "How are you"],
    encouragement: ["Well done!", "Excellent!", "Keep it up!"],
    commonPhrases: ["Thank you", "Please", "Excuse me"],
  }
}

function analyzeEmotion(transcript: string): string {
  const positiveWords = ["happy", "excited", "good", "great", "love"]
  const negativeWords = ["sad", "frustrated", "difficult", "hard", "confused"]

  const positive = positiveWords.some((word) => transcript.toLowerCase().includes(word))
  const negative = negativeWords.some((word) => transcript.toLowerCase().includes(word))

  if (positive && !negative) return "positive"
  if (negative && !positive) return "negative"
  return "neutral"
}

function analyzeConfidence(transcript: string): string {
  const uncertainWords = ["maybe", "i think", "not sure", "probably"]
  const confidentWords = ["definitely", "sure", "certain", "know"]

  const uncertain = uncertainWords.some((word) => transcript.toLowerCase().includes(word))
  const confident = confidentWords.some((word) => transcript.toLowerCase().includes(word))

  if (confident && !uncertain) return "high"
  if (uncertain && !confident) return "low"
  return "medium"
}

function extractDifficultWords(text: string): string[] {
  // Simple implementation - in practice, use phonetic analysis
  const words = text.split(" ")
  return words.filter((word) => word.length > 8 || /[^a-zA-Z\s]/.test(word))
}

function generatePhoneticSpelling(word: string): string {
  // Simplified phonetic spelling - in practice, use proper phonetic dictionary
  return word.toLowerCase().replace(/ph/g, "f").replace(/gh/g, "f")
}
