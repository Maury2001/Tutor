import { NextResponse } from "next/server"

// Enhanced responses for nutrition and digestion topics with context awareness
function getNutritionDigestionResponse(message: string, context: any) {
  const lowerMessage = message.toLowerCase()
  const currentTab = context?.currentTab || ""
  const selectedItems = {
    nutritionMode: context?.selectedNutritionMode,
    toothType: context?.selectedToothType,
    digestionStage: context?.selectedDigestionStage,
    animalType: context?.animalType,
    animationStage: context?.animationStage,
  }

  // Context-aware responses based on current tab
  if (currentTab === "nutrition-modes") {
    if (lowerMessage.includes("holozoic") || selectedItems.nutritionMode === "holozoic") {
      return "Excellent choice! Holozoic nutrition is fascinating - it's how most animals we know get their food. Think about a lion hunting in the Maasai Mara - it captures prey, tears it with sharp teeth, and digests it internally. How is this different from how a tapeworm gets nutrients?"
    }

    if (lowerMessage.includes("parasitic") || selectedItems.nutritionMode === "parasitic") {
      return "Parasitic nutrition is quite clever! These organisms have evolved to live off others without doing the hard work of hunting. Tsetse flies in Kenya are great examples - they feed on blood. What adaptations do you think parasites need to survive on their hosts?"
    }

    if (lowerMessage.includes("saprophytic") || selectedItems.nutritionMode === "saprophytic") {
      return "Saprophytic nutrition is nature's recycling system! Vultures in Kenya play this crucial role - they clean up the savanna by eating dead animals. Without them, diseases would spread. What would happen to ecosystems without these decomposers?"
    }

    if (lowerMessage.includes("symbiotic") || selectedItems.nutritionMode === "symbiotic") {
      return "Symbiotic relationships are beautiful examples of cooperation! Oxpeckers and rhinos in Kenya show this perfectly - the birds get food (ticks) while keeping rhinos healthy. Can you think of other win-win relationships in nature?"
    }
  }

  if (currentTab === "dentition") {
    if (selectedItems.animalType === "carnivore" || lowerMessage.includes("carnivore")) {
      return "Carnivore teeth are amazing tools! Look at a lion's skull - those massive canines can grip struggling prey, and the sharp molars slice meat like scissors. Notice how different this is from a cow's flat grinding teeth. What does this tell us about form following function?"
    }

    if (selectedItems.animalType === "herbivore" || lowerMessage.includes("herbivore")) {
      return "Herbivore dentition is perfectly designed for plant processing! Elephants in Amboseli have huge, ridged molars that work like millstones to grind tough grass. They even replace their teeth throughout life! Why do you think herbivores need such powerful grinding teeth?"
    }

    if (selectedItems.animalType === "omnivore" || lowerMessage.includes("omnivore")) {
      return "Omnivore teeth like ours are the ultimate compromise! We have sharp incisors for cutting, pointed canines for tearing, and flat molars for grinding. This versatility lets us eat everything from meat to fruits. What advantages does this dietary flexibility give humans?"
    }
  }

  if (currentTab === "tooth-types") {
    if (lowerMessage.includes("incisor") || selectedItems.toothType === "incisors") {
      return "Incisors are your cutting tools! Try this: bite into an apple and notice how your front teeth slice through the skin. Beavers have incredibly strong incisors that never stop growing - they use them to cut down trees! What would happen if we tried to use our molars for cutting?"
    }

    if (lowerMessage.includes("canine") || selectedItems.toothType === "canines") {
      return "Canines are fascinating! In humans, they're small, but in carnivores like leopards, they're huge daggers for killing prey. Feel your canines with your tongue - they're more pointed than your other teeth. Why do you think vegetarian animals often have very small canines?"
    }

    if (lowerMessage.includes("molar") || selectedItems.toothType === "molars") {
      return "Molars are your powerhouse grinders! They have multiple cusps that fit together perfectly to crush food. Chew something tough and notice how your molars work together like millstones. Elephants replace their molars six times in their lifetime - why do you think they need to do this?"
    }
  }

  if (currentTab === "digestion-process") {
    if (
      selectedItems.animationStage?.id === "mouth" ||
      lowerMessage.includes("mouth") ||
      lowerMessage.includes("ingestion")
    ) {
      return "The mouth is where the digestive adventure begins! Your saliva contains amylase that starts breaking down starch immediately. Try chewing a piece of bread for a long time - it starts tasting sweet as starch becomes sugar! What other important jobs does your mouth do besides chewing?"
    }

    if (
      selectedItems.animationStage?.id === "stomach" ||
      lowerMessage.includes("stomach") ||
      lowerMessage.includes("acid")
    ) {
      return "Your stomach is like a powerful chemical factory! The acid is so strong (pH 1.5-2) it could dissolve a nail, but your stomach lining protects you. Watch how the animation shows the churning motion - this mixes food with enzymes. What do you think would happen if your stomach acid wasn't strong enough?"
    }

    if (
      selectedItems.animationStage?.id === "small-intestine" ||
      lowerMessage.includes("absorption") ||
      lowerMessage.includes("villi")
    ) {
      return "The small intestine is absolutely incredible! It's 6 meters long with millions of tiny villi - if you could unfold it, it would cover a tennis court! Watch the animation particles showing nutrient absorption. Why do you think the body needs such a huge surface area for absorption?"
    }

    if (lowerMessage.includes("animation") || lowerMessage.includes("journey")) {
      return "The digestive animation shows the amazing 6-8 hour journey food takes through your body! Each stage has specific jobs - mechanical breakdown, chemical digestion, absorption, and waste removal. Which part of the journey surprises you most?"
    }
  }

  // General encouragement and guidance
  if (lowerMessage.includes("difficult") || lowerMessage.includes("hard") || lowerMessage.includes("confused")) {
    return "Don't worry - this is complex stuff, but you're doing great! Remember, every time you eat, your body performs these amazing processes automatically. Try connecting what you're learning to your own experience. What part would you like me to explain differently?"
  }

  if (lowerMessage.includes("why") || lowerMessage.includes("how")) {
    return "Great question! Understanding nutrition and digestion helps us appreciate how all life is connected. Every animal has evolved specific adaptations for getting and processing food. What specific aspect interests you most right now?"
  }

  if (lowerMessage.includes("kenya") || lowerMessage.includes("wildlife") || lowerMessage.includes("africa")) {
    return "Kenya's wildlife is perfect for studying nutrition! From lions hunting zebras (holozoic) to vultures cleaning up carcasses (saprophytic) to oxpeckers helping rhinos (symbiotic) - our ecosystems show every type of nutrition. Which Kenyan animal's feeding strategy interests you most?"
  }

  // Animation-specific responses
  if (lowerMessage.includes("speed") || lowerMessage.includes("fast") || lowerMessage.includes("slow")) {
    return "Good observation about the animation speed! In real life, digestion takes 6-8 hours, but we speed it up so you can see the whole process. Try different speeds to see how it affects your understanding - slower for detail, faster for the big picture!"
  }

  // Default contextual response
  const tabContext = {
    "nutrition-modes": "nutrition types and how different animals get their food",
    dentition: "how teeth are adapted for different diets",
    "tooth-types": "the structure and function of different teeth",
    "digestion-process": "how food travels through the human digestive system",
  }

  const currentContext = tabContext[currentTab as keyof typeof tabContext] || "animal nutrition and digestion"

  return `That's a thoughtful question about ${currentContext}! ${selectedItems.nutritionMode || selectedItems.toothType || selectedItems.digestionStage ? `I see you're exploring ${selectedItems.nutritionMode || selectedItems.toothType || selectedItems.digestionStage} - ` : ""}Every adaptation in nature has a purpose. What specific aspect would you like to explore deeper?`
}

export async function GET() {
  try {
    return NextResponse.json({
      status: "Enhanced Nutrition & Digestion Assistant Ready",
      hasGroqKey: !!process.env.GROQ_API_KEY,
      model: "context-aware-nutrition-assistant",
      features: ["contextual responses", "kenyan wildlife examples", "animation guidance"],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      status: "Assistant Ready (Fallback Mode)",
      hasGroqKey: false,
      error: "Configuration check failed",
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, context } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Valid message is required",
          response: "Please ask me a question about animal nutrition or digestion!",
          fallback: true,
        },
        { status: 400 },
      )
    }

    // Try to use Groq API if available
    if (process.env.GROQ_API_KEY) {
      try {
        const contextInfo = context
          ? `Current context: Tab="${context.currentTab}", Selected="${context.selectedNutritionMode || context.selectedToothType || context.selectedDigestionStage || "none"}", Animal="${context.animalType || "none"}", Animation="${context.animationStage?.name || "none"}"`
          : "General discussion"

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              {
                role: "system",
                content: `You are an enthusiastic biology teacher specializing in animal nutrition and digestion for Grade 9 CBC students in Kenya. 

Your expertise covers:
- Modes of nutrition (holozoic, parasitic, saprophytic, symbiotic)
- Dentition patterns (homodont vs heterodont, carnivore vs herbivore vs omnivore)
- Types of teeth (incisors, canines, premolars, molars) and their functions
- Human digestion process (ingestion, digestion, absorption, assimilation, egestion)
- Kenyan wildlife examples and local ecosystem connections

Teaching style:
- Use Socratic questioning to guide discovery
- Connect concepts to students' daily experiences and Kenyan wildlife
- Provide specific examples from Kenya's ecosystems when relevant
- Encourage critical thinking about evolutionary adaptations
- Keep responses concise but engaging (2-3 sentences max)
- Use encouraging language appropriate for Grade 9 students
- Reference the interactive animation when discussing digestion

${contextInfo}`,
              },
              {
                role: "user",
                content: message,
              },
            ],
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const aiResponse = data.choices?.[0]?.message?.content

          if (aiResponse) {
            return NextResponse.json({
              response: aiResponse,
              fallback: false,
              model: "llama3-8b-8192",
              context: context || {},
              timestamp: new Date().toISOString(),
            })
          }
        }
      } catch (groqError) {
        console.log("Groq API unavailable, using enhanced fallback:", groqError)
      }
    }

    // Enhanced fallback response with context awareness
    const fallbackResponse = getNutritionDigestionResponse(message, context)

    return NextResponse.json({
      response: fallbackResponse,
      fallback: true,
      model: "context-aware-nutrition-assistant",
      context: context || {},
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Enhanced Nutrition & Digestion Assistant Error:", error)

    return NextResponse.json(
      {
        response:
          "I'm having a small technical hiccup, but let's keep exploring nutrition and digestion! Remember, every animal has evolved amazing adaptations for getting and processing food. What aspect interests you most?",
        fallback: true,
        error: "general_error",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  }
}
