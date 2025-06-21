/**
 * Updated CBC Curriculum Data Structure - 2024 Version
 *
 * Reflects the latest changes in Upper Primary Curriculum (2024)
 * Key changes from 2019:
 * - English: 4 → 5 lessons
 * - Agriculture → Agriculture and Nutrition: 3 → 4 lessons
 * - Creative Arts: 3 → 6 lessons (merged with Home Science)
 * - Home Science: Removed (merged into Creative Arts)
 * - Other Languages: Removed
 * - Total lessons: 40 → 35
 */

export interface LearningArea2024 {
  id: string
  name: string
  description: string
  weeklyLessons: number
  gradeLevel: string[]
  isCore: boolean
  changes?: {
    from2019?: string
    changeType: "increased" | "decreased" | "renamed" | "merged" | "removed" | "new"
    previousLessons?: number
  }
}

export const CBC_LEARNING_AREAS_2024: Record<string, LearningArea2024[]> = {
  upperPrimary: [
    {
      id: "english-2024",
      name: "English",
      description: "English language development and literacy skills",
      weeklyLessons: 5,
      gradeLevel: ["grade4", "grade5", "grade6"],
      isCore: true,
      changes: {
        changeType: "increased",
        previousLessons: 4,
      },
    },
    {
      id: "kiswahili-2024",
      name: "Kiswahili / Kenya Sign Language",
      description: "Kiswahili language and Kenya Sign Language development",
      weeklyLessons: 4,
      gradeLevel: ["grade4", "grade5", "grade6"],
      isCore: true,
      changes: {
        changeType: "increased", // No change, but keeping for consistency
        previousLessons: 4,
      },
    },
    {
      id: "mathematics-2024",
      name: "Mathematics",
      description: "Mathematical concepts and problem-solving skills",
      weeklyLessons: 5,
      gradeLevel: ["grade4", "grade5", "grade6"],
      isCore: true,
      changes: {
        changeType: "increased", // No change
        previousLessons: 5,
      },
    },
    {
      id: "religious-education-2024",
      name: "Religious Education",
      description: "Religious and moral education",
      weeklyLessons: 3,
      gradeLevel: ["grade4", "grade5", "grade6"],
      isCore: false,
      changes: {
        changeType: "increased", // No change
        previousLessons: 3,
      },
    },
    {
      id: "science-technology-2024",
      name: "Science & Technology",
      description: "Scientific concepts and technological applications",
      weeklyLessons: 4,
      gradeLevel: ["grade4", "grade5", "grade6"],
      isCore: true,
      changes: {
        changeType: "increased", // No change
        previousLessons: 4,
      },
    },
    {
      id: "social-studies-2024",
      name: "Social Studies",
      description: "Social sciences and citizenship education",
      weeklyLessons: 3,
      gradeLevel: ["grade4", "grade5", "grade6"],
      isCore: true,
      changes: {
        changeType: "increased", // No change
        previousLessons: 3,
      },
    },
    {
      id: "agriculture-nutrition-2024",
      name: "Agriculture and Nutrition",
      description: "Agricultural practices and nutritional education",
      weeklyLessons: 4,
      gradeLevel: ["grade4", "grade5", "grade6"],
      isCore: false,
      changes: {
        from2019: "Agriculture",
        changeType: "renamed",
        previousLessons: 3,
      },
    },
    {
      id: "creative-arts-2024",
      name: "Creative Arts",
      description: "Creative expression, arts, and practical life skills (includes former Home Science)",
      weeklyLessons: 6,
      gradeLevel: ["grade4", "grade5", "grade6"],
      isCore: false,
      changes: {
        from2019: "Creative Arts + Home Science",
        changeType: "merged",
        previousLessons: 3,
      },
    },
    {
      id: "pastoral-religious-2024",
      name: "Pastoral/Religious Instruction Programme",
      description: "Pastoral care and religious instruction",
      weeklyLessons: 1,
      gradeLevel: ["grade4", "grade5", "grade6"],
      isCore: false,
      changes: {
        changeType: "increased", // No change
        previousLessons: 1,
      },
    },
  ],
}

// Removed learning areas from 2019
export const REMOVED_LEARNING_AREAS_2019 = [
  {
    id: "home-science-2019",
    name: "Home Science",
    weeklyLessons: 3,
    reason: "Merged into Creative Arts",
  },
  {
    id: "other-languages-2019",
    name: "Other Languages",
    weeklyLessons: 2,
    reason: "Removed from curriculum",
  },
  {
    id: "physical-health-education-2019",
    name: "Physical & Health Education",
    weeklyLessons: 5,
    reason: "Restructured/integrated into other areas",
  },
]

export const CURRICULUM_CHANGES_SUMMARY_2024 = {
  totalLessons: {
    from: 40,
    to: 35,
    change: -5,
  },
  majorChanges: [
    "English lessons increased from 4 to 5 per week",
    "Agriculture renamed to 'Agriculture and Nutrition' with increase from 3 to 4 lessons",
    "Creative Arts expanded from 3 to 6 lessons (merged with Home Science)",
    "Home Science removed as separate subject (integrated into Creative Arts)",
    "Other Languages removed from curriculum",
    "Physical & Health Education restructured",
    "Total weekly lessons reduced from 40 to 35",
  ],
  implementationDate: "2024",
  source: "Kenya Institute of Curriculum Development (KICD)",
}

// Helper function to get learning area changes
export function getLearningAreaChanges(learningAreaId: string): string {
  const area = CBC_LEARNING_AREAS_2024.upperPrimary.find((la) => la.id === learningAreaId)
  if (!area?.changes) return "No changes"

  const { changeType, previousLessons, from2019 } = area.changes

  switch (changeType) {
    case "increased":
      return previousLessons !== area.weeklyLessons
        ? `Increased from ${previousLessons} to ${area.weeklyLessons} lessons`
        : "No change"
    case "renamed":
      return `Renamed from "${from2019}" and increased from ${previousLessons} to ${area.weeklyLessons} lessons`
    case "merged":
      return `Expanded from ${previousLessons} to ${area.weeklyLessons} lessons (merged with ${from2019?.split(" + ")[1]})`
    default:
      return "Updated in 2024 curriculum"
  }
}

// Export updated curriculum for grades 4-6
export function getUpdatedUpperPrimaryCurriculum() {
  return CBC_LEARNING_AREAS_2024.upperPrimary
}
