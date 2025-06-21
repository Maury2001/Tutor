"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpen,
  MessageCircle,
  Download,
  FileQuestion,
  Send,
  Bot,
  User,
  GraduationCap,
  Brain,
  Lightbulb,
} from "lucide-react"

// CBC Curriculum Structure
const CBC_GRADES = [
  { value: "pp1", label: "PP1 (Pre-Primary 1)" },
  { value: "pp2", label: "PP2 (Pre-Primary 2)" },
  { value: "grade1", label: "Grade 1" },
  { value: "grade2", label: "Grade 2" },
  { value: "grade3", label: "Grade 3" },
  { value: "grade4", label: "Grade 4" },
  { value: "grade5", label: "Grade 5" },
  { value: "grade6", label: "Grade 6" },
  { value: "grade7", label: "Grade 7" },
  { value: "grade8", label: "Grade 8" },
  { value: "grade9", label: "Grade 9" },
  { value: "grade10", label: "Grade 10" },
  { value: "grade11", label: "Grade 11" },
  { value: "grade12", label: "Grade 12" },
]

const CBC_LEARNING_AREAS = {
  pp1: [
    { value: "language-activities", label: "Language Activities" },
    { value: "mathematical-activities", label: "Mathematical Activities" },
    { value: "environmental-activities", label: "Environmental Activities" },
    { value: "psychomotor-creative", label: "Psychomotor and Creative Activities" },
    { value: "hygiene-nutrition", label: "Hygiene and Nutrition" },
  ],
  pp2: [
    { value: "literacy-activities", label: "Literacy Activities" },
    { value: "mathematical-activities", label: "Mathematical Activities" },
    { value: "environmental-activities", label: "Environmental Activities" },
    { value: "psychomotor-activities", label: "Psychomotor Activities" },
    { value: "hygiene-nutrition", label: "Hygiene and Nutrition" },
  ],
  grade1: [
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "mathematics", label: "Mathematics" },
    { value: "environmental-activities", label: "Environmental Activities" },
    { value: "creative-arts", label: "Creative Arts" },
    { value: "physical-education", label: "Physical Education" },
    { value: "christian-religious-education", label: "Christian Religious Education" },
    { value: "islamic-religious-education", label: "Islamic Religious Education" },
    { value: "hindu-religious-education", label: "Hindu Religious Education" },
  ],
  grade2: [
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "mathematics", label: "Mathematics" },
    { value: "environmental-activities", label: "Environmental Activities" },
    { value: "creative-arts", label: "Creative Arts" },
    { value: "physical-education", label: "Physical Education" },
    { value: "christian-religious-education", label: "Christian Religious Education" },
    { value: "islamic-religious-education", label: "Islamic Religious Education" },
    { value: "hindu-religious-education", label: "Hindu Religious Education" },
  ],
  grade3: [
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "mathematics", label: "Mathematics" },
    { value: "environmental-activities", label: "Environmental Activities" },
    { value: "creative-arts", label: "Creative Arts" },
    { value: "physical-education", label: "Physical Education" },
    { value: "christian-religious-education", label: "Christian Religious Education" },
    { value: "islamic-religious-education", label: "Islamic Religious Education" },
    { value: "hindu-religious-education", label: "Hindu Religious Education" },
  ],
  grade4: [
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "mathematics", label: "Mathematics" },
    { value: "science-technology", label: "Science and Technology" },
    { value: "social-studies", label: "Social Studies" },
    { value: "creative-arts", label: "Creative Arts" },
    { value: "physical-education", label: "Physical Education" },
    { value: "christian-religious-education", label: "Christian Religious Education" },
    { value: "islamic-religious-education", label: "Islamic Religious Education" },
    { value: "hindu-religious-education", label: "Hindu Religious Education" },
  ],
  grade5: [
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "mathematics", label: "Mathematics" },
    { value: "science-technology", label: "Science and Technology" },
    { value: "social-studies", label: "Social Studies" },
    { value: "creative-arts", label: "Creative Arts" },
    { value: "physical-education", label: "Physical Education" },
    { value: "christian-religious-education", label: "Christian Religious Education" },
    { value: "islamic-religious-education", label: "Islamic Religious Education" },
    { value: "hindu-religious-education", label: "Hindu Religious Education" },
  ],
  grade6: [
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "mathematics", label: "Mathematics" },
    { value: "science-technology", label: "Science and Technology" },
    { value: "social-studies", label: "Social Studies" },
    { value: "creative-arts", label: "Creative Arts" },
    { value: "physical-education", label: "Physical Education" },
    { value: "christian-religious-education", label: "Christian Religious Education" },
    { value: "islamic-religious-education", label: "Islamic Religious Education" },
    { value: "hindu-religious-education", label: "Hindu Religious Education" },
  ],
  grade7: [
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "mathematics", label: "Mathematics" },
    { value: "integrated-science", label: "Integrated Science" },
    { value: "social-studies", label: "Social Studies" },
    { value: "creative-arts", label: "Creative Arts" },
    { value: "physical-education", label: "Physical Education" },
    { value: "christian-religious-education", label: "Christian Religious Education" },
    { value: "islamic-religious-education", label: "Islamic Religious Education" },
    { value: "hindu-religious-education", label: "Hindu Religious Education" },
    { value: "agriculture", label: "Agriculture" },
    { value: "life-skills", label: "Life Skills" },
  ],
  grade8: [
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "mathematics", label: "Mathematics" },
    { value: "integrated-science", label: "Integrated Science" },
    { value: "social-studies", label: "Social Studies" },
    { value: "creative-arts", label: "Creative Arts" },
    { value: "physical-education", label: "Physical Education" },
    { value: "christian-religious-education", label: "Christian Religious Education" },
    { value: "islamic-religious-education", label: "Islamic Religious Education" },
    { value: "hindu-religious-education", label: "Hindu Religious Education" },
    { value: "agriculture", label: "Agriculture" },
    { value: "life-skills", label: "Life Skills" },
  ],
  grade9: [
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "mathematics", label: "Mathematics" },
    { value: "biology", label: "Biology" },
    { value: "chemistry", label: "Chemistry" },
    { value: "physics", label: "Physics" },
    { value: "history-government", label: "History and Government" },
    { value: "geography", label: "Geography" },
    { value: "christian-religious-education", label: "Christian Religious Education" },
    { value: "islamic-religious-education", label: "Islamic Religious Education" },
    { value: "hindu-religious-education", label: "Hindu Religious Education" },
    { value: "business-studies", label: "Business Studies" },
    { value: "agriculture", label: "Agriculture" },
    { value: "home-science", label: "Home Science" },
    { value: "art-design", label: "Art and Design" },
    { value: "music", label: "Music" },
    { value: "computer-studies", label: "Computer Studies" },
  ],
  grade10: [
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "mathematics", label: "Mathematics" },
    { value: "biology", label: "Biology" },
    { value: "chemistry", label: "Chemistry" },
    { value: "physics", label: "Physics" },
    { value: "history-government", label: "History and Government" },
    { value: "geography", label: "Geography" },
    { value: "christian-religious-education", label: "Christian Religious Education" },
    { value: "islamic-religious-education", label: "Islamic Religious Education" },
    { value: "hindu-religious-education", label: "Hindu Religious Education" },
    { value: "business-studies", label: "Business Studies" },
    { value: "agriculture", label: "Agriculture" },
    { value: "home-science", label: "Home Science" },
    { value: "art-design", label: "Art and Design" },
    { value: "music", label: "Music" },
    { value: "computer-studies", label: "Computer Studies" },
  ],
  grade11: [
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "mathematics", label: "Mathematics" },
    { value: "biology", label: "Biology" },
    { value: "chemistry", label: "Chemistry" },
    { value: "physics", label: "Physics" },
    { value: "history-government", label: "History and Government" },
    { value: "geography", label: "Geography" },
    { value: "christian-religious-education", label: "Christian Religious Education" },
    { value: "islamic-religious-education", label: "Islamic Religious Education" },
    { value: "hindu-religious-education", label: "Hindu Religious Education" },
    { value: "business-studies", label: "Business Studies" },
    { value: "agriculture", label: "Agriculture" },
    { value: "home-science", label: "Home Science" },
    { value: "art-design", label: "Art and Design" },
    { value: "music", label: "Music" },
    { value: "computer-studies", label: "Computer Studies" },
  ],
  grade12: [
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "mathematics", label: "Mathematics" },
    { value: "biology", label: "Biology" },
    { value: "chemistry", label: "Chemistry" },
    { value: "physics", label: "Physics" },
    { value: "history-government", label: "History and Government" },
    { value: "geography", label: "Geography" },
    { value: "christian-religious-education", label: "Christian Religious Education" },
    { value: "islamic-religious-education", label: "Islamic Religious Education" },
    { value: "hindu-religious-education", label: "Hindu Religious Education" },
    { value: "business-studies", label: "Business Studies" },
    { value: "agriculture", label: "Agriculture" },
    { value: "home-science", label: "Home Science" },
    { value: "art-design", label: "Art and Design" },
    { value: "music", label: "Music" },
    { value: "computer-studies", label: "Computer Studies" },
  ],
}

const Page = () => {
  const [selectedGrade, setSelectedGrade] = useState("grade4")
  const [selectedLearningArea, setSelectedLearningArea] = useState("")
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [learningContent, setLearningContent] = useState("")
  const messagesEndRef = useRef(null)

  const [isGuidedLearning, setIsGuidedLearning] = useState(false)
  const [currentLessonStep, setCurrentLessonStep] = useState(0)
  const [guidedContent, setGuidedContent] = useState("")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedGrade && selectedLearningArea) {
      startGuidedLearning()
    }
  }, [selectedGrade, selectedLearningArea])

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      role: "assistant",
      content: `🇰🇪 **Habari! Welcome to CBC Learning Platform**

I'm your AI tutor trained on the Kenyan CBC curriculum. I can help you with:

📚 **All Learning Areas** from PP1 to Grade 12
🎯 **Interactive Learning** with questions and examples
📝 **Quiz Generation** for any topic you study
📄 **Download Learning Materials** for offline study

**To get started:**
1. Select your grade level
2. Choose a learning area/subject
3. Ask me any question about the topic!

Ready to learn? 🚀`,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [])

  const startGuidedLearning = async () => {
    if (!selectedGrade || !selectedLearningArea) return

    setIsGuidedLearning(true)
    setCurrentLessonStep(0)

    const gradeLabel = CBC_GRADES.find((g) => g.value === selectedGrade)?.label || selectedGrade
    const subjectLabel =
      CBC_LEARNING_AREAS[selectedGrade]?.find((la) => la.value === selectedLearningArea)?.label || selectedLearningArea

    // Simulate AI processing for guided learning
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const guidedLearningContent = `🎓 **Welcome to Guided Learning: ${gradeLabel} - ${subjectLabel}**

📚 **Automated Learning Journey Started!**

I've detected that you've selected **${gradeLabel}** and **${subjectLabel}**. Let me guide you through a comprehensive learning experience!

## 📋 **Learning Path Overview:**

### **Step 1: Foundation Concepts** ✅ (Current)
Let's start with the fundamental concepts you need to master:

${getDetailedFoundationContent(selectedLearningArea, selectedGrade)}

### **Step 2: Practical Applications** (Next)
We'll explore real-world applications and examples

### **Step 3: Practice & Assessment** (Coming)
Interactive exercises and knowledge checks

### **Step 4: Advanced Concepts** (Final)
Deeper understanding and connections

---

## 🎯 **Current Focus: Foundation Concepts**

${getDetailedLessonContent(selectedLearningArea, selectedGrade)}

**🤔 Ready to continue?** 
- Type "next" to move to practical applications
- Type "explain [concept]" for deeper explanation
- Type "example" for more examples
- Type "quiz" for a quick knowledge check

💡 **Learning Tip:** Take your time to understand each concept before moving forward!`

    const guidedMessage = {
      id: Date.now(),
      role: "assistant",
      content: guidedLearningContent,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, guidedMessage])
    setGuidedContent(guidedLearningContent)
  }

  const getDetailedFoundationContent = (learningArea, grade) => {
    const foundations = {
      mathematics: `
**🧮 Mathematical Foundations:**
• **Number Systems**: Understanding place value, operations, and number relationships
• **Problem-Solving Strategies**: Breaking down complex problems into manageable steps
• **Mathematical Reasoning**: Logical thinking and pattern recognition
• **Real-world Connections**: How math applies to daily life situations`,

      english: `
**📖 English Language Foundations:**
• **Reading Comprehension**: Understanding texts, identifying main ideas, and making inferences
• **Grammar Mastery**: Sentence structure, parts of speech, and proper usage
• **Vocabulary Development**: Building word knowledge and understanding context
• **Communication Skills**: Speaking, listening, and effective expression`,

      "science-technology": `
**🔬 Science & Technology Foundations:**
• **Scientific Method**: Observation, hypothesis, experimentation, and conclusion
• **Basic Concepts**: Matter, energy, forces, and living systems
• **Technology Integration**: Understanding how science applies to technology
• **Environmental Awareness**: Conservation and sustainable practices`,

      "integrated-science": `
**🧪 Integrated Science Foundations:**
• **Scientific Inquiry**: Asking questions and seeking evidence-based answers
• **Cross-disciplinary Connections**: How biology, chemistry, and physics interact
• **Laboratory Skills**: Safe handling of equipment and materials
• **Data Analysis**: Interpreting results and drawing conclusions`,
    }

    return (
      foundations[learningArea] ||
      `
**📚 Subject Foundations:**
• **Core Concepts**: Essential knowledge and understanding
• **Skill Development**: Practical abilities and competencies
• **Critical Thinking**: Analysis and evaluation skills
• **Application**: Connecting learning to real situations`
    )
  }

  const getDetailedLessonContent = (learningArea, grade) => {
    const lessons = {
      mathematics: `
**📊 Today's Mathematics Lesson:**

**Topic**: Problem-Solving with Real Numbers

**🎯 Learning Objectives:**
1. Apply mathematical operations to solve real-world problems
2. Understand the relationship between different number types
3. Develop logical reasoning skills

**📝 Key Concepts:**
• **Whole Numbers**: 0, 1, 2, 3, 4, 5...
• **Integers**: ...-3, -2, -1, 0, 1, 2, 3...
• **Rational Numbers**: Numbers that can be expressed as fractions
• **Operations**: Addition, subtraction, multiplication, division

**🌟 Real-World Example:**
*Sarah has 150 shillings. She buys 3 notebooks at 35 shillings each. How much money does she have left?*

**Solution Steps:**
1. Cost of notebooks: 3 × 35 = 105 shillings
2. Money left: 150 - 105 = 45 shillings
3. Answer: Sarah has 45 shillings remaining

**💡 Practice Problems:**
1. If a bus travels 60 km/hour, how far will it travel in 2.5 hours?
2. A farmer harvests 240 kg of maize. If he sells 3/4 of it, how much does he keep?`,

      english: `
**📚 Today's English Lesson:**

**Topic**: Reading Comprehension and Critical Analysis

**🎯 Learning Objectives:**
1. Identify main ideas and supporting details in texts
2. Make inferences based on textual evidence
3. Analyze author's purpose and tone

**📖 Reading Strategy: SQ3R Method**
• **Survey**: Preview the text structure
• **Question**: Ask questions about the content
• **Read**: Read actively and purposefully
• **Recite**: Summarize key points
• **Review**: Reflect on understanding

**🌟 Sample Text Analysis:**
*"The baobab tree, known as the 'Tree of Life,' can live for over 1,000 years. Its massive trunk stores water during dry seasons, helping it survive in harsh African climates."*

**Analysis Questions:**
1. What is the main idea? (Baobab trees are remarkably adapted for survival)
2. What evidence supports this? (Long lifespan, water storage capability)
3. Why is it called 'Tree of Life'? (Provides resources for survival)

**💡 Vocabulary Focus:**
• **Massive**: Very large in size
• **Harsh**: Difficult or severe conditions
• **Adapted**: Changed to suit environment`,

      "integrated-science": `
**🔬 Today's Integrated Science Lesson:**

**Topic**: Structure of the Atom (Grade 9 Curriculum)

**🎯 Learning Objectives:**
1. Describe the basic structure of an atom
2. Identify protons, neutrons, and electrons
3. Understand atomic number and mass number

**⚛️ Atomic Structure Basics:**

**Components of an Atom:**
• **Nucleus**: Contains protons (+) and neutrons (neutral)
• **Electrons**: Negatively charged particles orbiting the nucleus
• **Atomic Number**: Number of protons (defines the element)
• **Mass Number**: Protons + neutrons

**🌟 Real-World Connection:**
Everything around you - your desk, the air you breathe, even your body - is made of atoms! Understanding atomic structure helps us understand:
- How elements form compounds
- Why materials have different properties
- How chemical reactions occur

**💡 Memory Aid:**
Think of an atom like a solar system:
- Nucleus = Sun (center, contains most mass)
- Electrons = Planets (orbit around the center)

**🔍 Example: Carbon Atom**
- Atomic Number: 6 (6 protons)
- Mass Number: 12 (6 protons + 6 neutrons)
- Electrons: 6 (equal to protons in neutral atom)

**🧪 Next Steps:**
We'll explore how atoms combine to form molecules and compounds!`,
    }

    return (
      lessons[learningArea] ||
      `
**📚 Today's Lesson:**

**🎯 Learning Objectives:**
1. Understand core concepts in this subject area
2. Apply knowledge to practical situations
3. Develop critical thinking skills

**📝 Key Points:**
• Foundation concepts and terminology
• Real-world applications and examples
• Practice exercises and activities
• Assessment and reflection opportunities

**💡 Learning Activities:**
• Interactive discussions and explanations
• Hands-on practice problems
• Real-world application examples
• Knowledge checks and assessments`
    )
  }

  const generateAIResponse = async (userMessage, grade, learningArea) => {
    setIsLoading(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const gradeLabel = CBC_GRADES.find((g) => g.value === grade)?.label || grade
    const subjectLabel = CBC_LEARNING_AREAS[grade]?.find((la) => la.value === learningArea)?.label || learningArea

    // Generate contextual response based on grade and subject
    let response = `🎓 **${gradeLabel} - ${subjectLabel}**\n\n`

    if (learningArea === "mathematics") {
      response += `🧮 **Mathematics Concepts for ${gradeLabel}:**

**Key Topics:**
• Number operations and place value
• Fractions, decimals, and percentages
• Geometry and measurement
• Data handling and statistics
• Problem-solving strategies

**Example Problem:**
If you have 3/4 of a pizza and you eat 1/3 of what you have, how much pizza is left?

**Solution:**
1. You eat: 1/3 × 3/4 = 3/12 = 1/4 of the whole pizza
2. Remaining: 3/4 - 1/4 = 2/4 = 1/2 of the pizza

**Real-world Application:**
This helps with sharing resources, cooking measurements, and financial calculations.

💡 **Ask me for more examples or specific topics!**`
    } else if (learningArea === "english") {
      response += `📖 **English Language Skills for ${gradeLabel}:**

**Key Areas:**
• Reading comprehension and fluency
• Writing skills and grammar
• Speaking and listening
• Vocabulary development
• Literature appreciation

**Example Activity:**
**Reading Comprehension:** "The sun rises in the east and sets in the west."

**Questions:**
1. Where does the sun rise?
2. Where does the sun set?
3. What happens between sunrise and sunset?

**Grammar Focus:**
- Subject: The sun
- Verb: rises/sets
- Prepositions: in, in the

💡 **Ask me about specific grammar rules or reading strategies!**`
    } else if (learningArea === "science-technology" || learningArea === "integrated-science") {
      response += `🔬 **Science Concepts for ${gradeLabel}:**

**Key Topics:**
• Living and non-living things
• Matter and materials
• Energy and forces
• Earth and space
• Scientific investigation

**Example Experiment:**
**Topic:** States of Matter

**Materials:** Ice cubes, water, heat source

**Procedure:**
1. Observe ice (solid state)
2. Heat ice to form water (liquid state)
3. Continue heating to form steam (gas state)

**Observation:** Matter changes state when heated or cooled

**Real-world Application:**
Understanding weather patterns, cooking, and industrial processes.

💡 **Ask me about specific experiments or scientific concepts!**`
    } else {
      response += `📚 **Learning Content for ${subjectLabel}:**

This subject covers important concepts that help develop:
• Critical thinking skills
• Cultural understanding
• Practical life skills
• Creative expression
• Physical development

**Key Learning Outcomes:**
• Understanding core concepts
• Applying knowledge in real situations
• Developing competencies for life
• Building character and values

💡 **Ask me specific questions about this subject for detailed explanations!**`
    }

    response += `\n\n🎯 **What would you like to explore next?**
• Ask for more examples
• Request practice questions
• Generate a quiz
• Download learning materials`

    setLearningContent(response)
    setIsLoading(false)

    return {
      id: Date.now(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    const aiResponse = await generateAIResponse(inputMessage, selectedGrade, selectedLearningArea)
    setMessages((prev) => [...prev, aiResponse])
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const generateQuiz = () => {
    const gradeLabel = CBC_GRADES.find((g) => g.value === selectedGrade)?.label || selectedGrade
    const subjectLabel =
      CBC_LEARNING_AREAS[selectedGrade]?.find((la) => la.value === selectedLearningArea)?.label || selectedLearningArea

    const quizMessage = {
      id: Date.now(),
      role: "assistant",
      content: `📝 **Quiz Generated: ${gradeLabel} - ${subjectLabel}**

**Question 1:** Multiple Choice
What is the main purpose of the CBC curriculum?
A) To focus only on academic subjects
B) To develop competencies for life and work
C) To prepare students for exams only
D) To teach traditional subjects

**Question 2:** Short Answer
Explain one way you can apply what you've learned in real life.

**Question 3:** Problem Solving
${
  selectedLearningArea === "mathematics"
    ? "Solve: If a shop sells 3/4 of its 240 items, how many items are left?"
    : "Describe the steps you would take to conduct a simple experiment about plants."
}

**Question 4:** Critical Thinking
How does this subject connect to other learning areas?

**Question 5:** Application
Give an example of how this knowledge helps in your community.

🎯 **Answer these questions and I'll provide feedback!**`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, quizMessage])
  }

  const downloadLearning = () => {
    const gradeLabel = CBC_GRADES.find((g) => g.value === selectedGrade)?.label || selectedGrade
    const subjectLabel =
      CBC_LEARNING_AREAS[selectedGrade]?.find((la) => la.value === selectedLearningArea)?.label || selectedLearningArea

    const content = `CBC LEARNING MATERIALS
Grade: ${gradeLabel}
Subject: ${subjectLabel}
Generated: ${new Date().toLocaleDateString()}

${learningContent || "Select a subject and start learning to generate downloadable content!"}

---
Generated by CBC Learning Platform
© 2024 Kenya CBC Curriculum`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${gradeLabel}-${subjectLabel}-Learning-Materials.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    const downloadMessage = {
      id: Date.now(),
      role: "assistant",
      content: `📄 **Download Complete!**

Your learning materials for **${gradeLabel} - ${subjectLabel}** have been downloaded successfully!

The file includes:
• Key concepts and topics
• Examples and explanations
• Practice questions
• Real-world applications

💡 **Tip:** Use these materials for offline study and revision!`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, downloadMessage])
  }

  const availableLearningAreas = CBC_LEARNING_AREAS[selectedGrade] || []

  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isGuidedLearning ? "bg-gradient-to-br from-blue-50 to-green-50" : ""}`}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-lg">
          <GraduationCap className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CBC Learning Platform</h1>
          {isGuidedLearning && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-pulse w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-800 font-medium">Guided Learning Active</span>
                <span className="text-green-600 text-sm">Step {currentLessonStep + 1} of 4</span>
              </div>
            </div>
          )}
          <p className="text-gray-600">Interactive AI Tutor for Kenyan CBC Curriculum</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Curriculum Selection Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Curriculum Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Grade Level</Label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {CBC_GRADES.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Learning Area</Label>
                <Select value={selectedLearningArea} onValueChange={setSelectedLearningArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLearningAreas.map((area) => (
                      <SelectItem key={area.value} value={area.value}>
                        {area.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button onClick={generateQuiz} className="w-full" variant="outline" disabled={!selectedLearningArea}>
                  <FileQuestion className="h-4 w-4 mr-2" />
                  Generate Quiz
                </Button>

                <Button onClick={downloadLearning} className="w-full" variant="outline" disabled={!learningContent}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Learning
                </Button>
              </div>

              {selectedGrade && selectedLearningArea && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Current Selection</span>
                  </div>
                  <Badge variant="secondary" className="mb-1">
                    {CBC_GRADES.find((g) => g.value === selectedGrade)?.label}
                  </Badge>
                  <br />
                  <Badge variant="outline">
                    {availableLearningAreas.find((la) => la.value === selectedLearningArea)?.label}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Interactive Learning Chat
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === "user" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                          }`}
                        >
                          {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                          <div className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                          <span className="text-sm text-gray-600">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      selectedLearningArea
                        ? `Ask me anything about ${availableLearningAreas.find((la) => la.value === selectedLearningArea)?.label}...`
                        : "Select a grade and subject first, then ask me anything!"
                    }
                    className="flex-1 min-h-[60px] resize-none"
                    disabled={!selectedLearningArea}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading || !selectedLearningArea}
                    className="px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Lightbulb className="h-3 w-3" />
                  <span>
                    Try asking: "Give me examples", "Explain this concept", "How do I solve this?", "Create practice
                    questions"
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page
