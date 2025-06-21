import { type NextRequest, NextResponse } from "next/server"

interface ExamConfig {
  title: string
  subject: string
  gradeLevel: string
  duration: number
  totalPoints: number
  instructions: string
  questionTypes: {
    multipleChoice: number
    shortAnswer: number
    essay: number
    trueFalse: number
  }
  difficulty: {
    easy: number
    medium: number
    hard: number
  }
  topics: string[]
}

interface Question {
  id: string
  type: "multiple-choice" | "short-answer" | "essay" | "true-false"
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  difficulty: "easy" | "medium" | "hard"
}

// Helper function to generate math questions based on topic
const generateMathQuestion = (
  topic: string,
  difficulty: "easy" | "medium" | "hard",
  type: string,
): Partial<Question> => {
  // Fractions questions
  if (topic.toLowerCase().includes("fraction")) {
    if (type === "multiple-choice") {
      if (difficulty === "easy") {
        return {
          question: "What is 1/4 + 1/4?",
          options: ["1/8", "1/2", "2/4", "1/1"],
          correctAnswer: 1,
        }
      } else if (difficulty === "medium") {
        return {
          question: "What is 2/3 + 3/4?",
          options: ["5/7", "17/12", "5/12", "1 5/12"],
          correctAnswer: 1,
        }
      } else {
        return {
          question:
            "If John ate 2/5 of a pizza and Mary ate 1/3 of the remaining pizza, what fraction of the original pizza is left?",
          options: ["1/3", "2/5", "8/15", "4/15"],
          correctAnswer: 2,
        }
      }
    } else if (type === "short-answer") {
      if (difficulty === "easy") {
        return {
          question: "Convert 3/6 to its simplest form.",
        }
      } else if (difficulty === "medium") {
        return {
          question: "Find the least common multiple of the denominators in the fractions 2/3 and 5/6.",
        }
      } else {
        return {
          question: "Explain how to convert a mixed number to an improper fraction using the example 2 3/4.",
        }
      }
    } else if (type === "true-false") {
      return {
        question: "The fraction 4/8 is equivalent to 1/2.",
        correctAnswer: "true",
      }
    }
  }

  // Decimals questions
  else if (topic.toLowerCase().includes("decimal")) {
    if (type === "multiple-choice") {
      if (difficulty === "easy") {
        return {
          question: "Which decimal is equal to 1/4?",
          options: ["0.25", "0.4", "0.5", "0.75"],
          correctAnswer: 0,
        }
      } else if (difficulty === "medium") {
        return {
          question: "What is 0.7 + 0.35?",
          options: ["0.42", "1.05", "1.05", "0.105"],
          correctAnswer: 1,
        }
      } else {
        return {
          question: "If a rectangle has a length of 3.5 cm and a width of 2.25 cm, what is its area?",
          options: ["5.75 cm²", "7.875 cm²", "5.25 cm²", "6.75 cm²"],
          correctAnswer: 1,
        }
      }
    } else if (type === "short-answer") {
      if (difficulty === "easy") {
        return {
          question: "Write 0.8 as a fraction in its simplest form.",
        }
      } else if (difficulty === "medium") {
        return {
          question: "Round 3.456 to the nearest hundredth.",
        }
      } else {
        return {
          question: "Explain the difference between 0.45 and 0.045 using place value.",
        }
      }
    }
  }

  // Geometry questions
  else if (topic.toLowerCase().includes("geometry")) {
    if (type === "multiple-choice") {
      if (difficulty === "easy") {
        return {
          question: "How many sides does a pentagon have?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 2,
        }
      } else if (difficulty === "medium") {
        return {
          question: "What is the sum of interior angles in a triangle?",
          options: ["90°", "180°", "270°", "360°"],
          correctAnswer: 1,
        }
      } else {
        return {
          question: "If a rectangle has a perimeter of 20 cm and a width of 4 cm, what is its length?",
          options: ["4 cm", "6 cm", "8 cm", "12 cm"],
          correctAnswer: 1,
        }
      }
    } else if (type === "essay") {
      return {
        question:
          "Explain the difference between perimeter and area. Give an example of when you would need to calculate each in real life.",
      }
    } else if (type === "true-false") {
      return {
        question: "A square is always a rectangle.",
        correctAnswer: "true",
      }
    }
  }

  // Measurement questions
  else if (topic.toLowerCase().includes("measurement")) {
    if (type === "multiple-choice") {
      if (difficulty === "easy") {
        return {
          question: "Which unit would you use to measure the weight of an apple?",
          options: ["Centimeter", "Liter", "Gram", "Second"],
          correctAnswer: 2,
        }
      } else if (difficulty === "medium") {
        return {
          question: "How many milliliters are in 2 liters?",
          options: ["20", "200", "2,000", "20,000"],
          correctAnswer: 2,
        }
      } else {
        return {
          question:
            "If a recipe calls for 250 ml of milk and you want to make 2.5 times the recipe, how much milk do you need?",
          options: ["500 ml", "625 ml", "525 ml", "725 ml"],
          correctAnswer: 1,
        }
      }
    } else if (type === "short-answer") {
      if (difficulty === "easy") {
        return {
          question: "List three units used to measure length.",
        }
      } else if (difficulty === "medium") {
        return {
          question: "Convert 3.5 kg to grams.",
        }
      } else {
        return {
          question: "Explain how to convert between units in the metric system using powers of 10.",
        }
      }
    }
  }

  // Problem Solving questions
  else if (topic.toLowerCase().includes("problem")) {
    if (type === "multiple-choice") {
      if (difficulty === "easy") {
        return {
          question: "Sarah has 15 apples. She gives 3 to John and 4 to Mary. How many apples does she have left?",
          options: ["7", "8", "9", "10"],
          correctAnswer: 1,
        }
      } else if (difficulty === "medium") {
        return {
          question: "A train travels at 60 km/h. How far will it travel in 2.5 hours?",
          options: ["120 km", "150 km", "180 km", "200 km"],
          correctAnswer: 1,
        }
      } else {
        return {
          question:
            "A rectangular garden is 8m long and 6m wide. A path of uniform width surrounds the garden. If the total area including the path is 88 sq m, what is the width of the path?",
          options: ["1m", "1.5m", "2m", "2.5m"],
          correctAnswer: 0,
        }
      }
    } else if (type === "essay") {
      return {
        question:
          "Describe the steps you would take to solve a word problem involving fractions. Use an example to illustrate your approach.",
      }
    }
  }

  // Default questions if topic doesn't match
  if (type === "multiple-choice") {
    return {
      question: `Which of the following best describes ${topic}?`,
      options: ["First option", "Second option", "Third option", "Fourth option"],
      correctAnswer: 0,
    }
  } else if (type === "short-answer") {
    return {
      question: `Explain the concept of ${topic} in your own words.`,
    }
  } else if (type === "essay") {
    return {
      question: `Write a detailed explanation of ${topic} and how it applies to real-life situations.`,
    }
  } else {
    return {
      question: `${topic} is an important concept in mathematics.`,
      correctAnswer: "true",
    }
  }
}

const generateMockQuestions = (config: ExamConfig): Question[] => {
  const questions: Question[] = []
  let questionId = 1

  // Helper to get difficulty based on distribution
  const getDifficulty = (): "easy" | "medium" | "hard" => {
    const rand = Math.random() * 100
    if (rand < config.difficulty.easy) return "easy"
    if (rand < config.difficulty.easy + config.difficulty.medium) return "medium"
    return "hard"
  }

  // Generate multiple choice questions
  for (let i = 0; i < config.questionTypes.multipleChoice; i++) {
    const topic = config.topics[i % config.topics.length]
    const difficulty = getDifficulty()
    const questionData = generateMathQuestion(topic, difficulty, "multiple-choice")

    questions.push({
      id: `q${questionId++}`,
      type: "multiple-choice",
      question: questionData.question || `Question about ${topic}`,
      options: questionData.options || ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: questionData.correctAnswer !== undefined ? questionData.correctAnswer : 0,
      points: difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 5,
      difficulty,
    })
  }

  // Generate short answer questions
  for (let i = 0; i < config.questionTypes.shortAnswer; i++) {
    const topic = config.topics[(i + config.questionTypes.multipleChoice) % config.topics.length]
    const difficulty = getDifficulty()
    const questionData = generateMathQuestion(topic, difficulty, "short-answer")

    questions.push({
      id: `q${questionId++}`,
      type: "short-answer",
      question: questionData.question || `Explain ${topic} in your own words.`,
      points: difficulty === "easy" ? 5 : difficulty === "medium" ? 7 : 10,
      difficulty,
    })
  }

  // Generate essay questions
  for (let i = 0; i < config.questionTypes.essay; i++) {
    const topic =
      config.topics[(i + config.questionTypes.multipleChoice + config.questionTypes.shortAnswer) % config.topics.length]
    const difficulty = "hard" as const
    const questionData = generateMathQuestion(topic, difficulty, "essay")

    questions.push({
      id: `q${questionId++}`,
      type: "essay",
      question: questionData.question || `Write a detailed essay about ${topic} and its applications.`,
      points: 15,
      difficulty,
    })
  }

  // Generate true/false questions
  for (let i = 0; i < config.questionTypes.trueFalse; i++) {
    const topic =
      config.topics[
        (i + config.questionTypes.multipleChoice + config.questionTypes.shortAnswer + config.questionTypes.essay) %
          config.topics.length
      ]
    const difficulty = "easy" as const
    const questionData = generateMathQuestion(topic, difficulty, "true-false")

    questions.push({
      id: `q${questionId++}`,
      type: "true-false",
      question: questionData.question || `${topic} is an important concept in mathematics.`,
      correctAnswer: questionData.correctAnswer || "true",
      points: 1,
      difficulty,
    })
  }

  return questions
}

export async function POST(request: NextRequest) {
  try {
    const config: ExamConfig = await request.json()

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate questions based on configuration
    const questions = generateMockQuestions(config)

    return NextResponse.json({
      success: true,
      questions,
      examId: Math.random().toString(36).substr(2, 9),
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating exam:", error)
    return NextResponse.json({ error: "Failed to generate exam" }, { status: 500 })
  }
}
