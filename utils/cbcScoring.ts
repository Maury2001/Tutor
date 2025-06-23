
import { cbcCategories } from '@/data/cbcQuestions';

export interface CBCScores {
  mathematics: number;
  english: number;
  kiswahili: number;
  science: number;
  socialStudies: number;
  religiousEducation: number;
  creativeArts: number;
  physicalEducation: number;
  healthEducation: number;
}

export function calculateCBCScores(answers: Record<number, number>): CBCScores {
  const scores: CBCScores = {
    mathematics: 0,
    english: 0,
    kiswahili: 0,
    science: 0,
    socialStudies: 0,
    religiousEducation: 0,
    creativeArts: 0,
    physicalEducation: 0,
    healthEducation: 0
  };

  // Calculate scores for each category
  Object.entries(answers).forEach(([questionId, rating]) => {
    const id = parseInt(questionId);
    
    // Mathematics (questions 1-8)
    if (id >= 1 && id <= 8) {
      scores.mathematics += rating;
    }
    // English (questions 9-14)
    else if (id >= 9 && id <= 14) {
      scores.english += rating;
    }
    // Kiswahili (questions 15-18)
    else if (id >= 15 && id <= 18) {
      scores.kiswahili += rating;
    }
    // Science (questions 19-26)
    else if (id >= 19 && id <= 26) {
      scores.science += rating;
    }
    // Social Studies (questions 27-32)
    else if (id >= 27 && id <= 32) {
      scores.socialStudies += rating;
    }
    // Religious Education (questions 33-35)
    else if (id >= 33 && id <= 35) {
      scores.religiousEducation += rating;
    }
    // Creative Arts (questions 36-38)
    else if (id >= 36 && id <= 38) {
      scores.creativeArts += rating;
    }
    // Physical Education (question 39)
    else if (id === 39) {
      scores.physicalEducation += rating;
    }
    // Health Education (question 40)
    else if (id === 40) {
      scores.healthEducation += rating;
    }
  });

  return scores;
}

export function getCBCPathwayRecommendations(scores: CBCScores) {
  const topThreeAreas = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([area]) => area);

  const recommendations = [];

  if (topThreeAreas.includes('mathematics') || topThreeAreas.includes('science')) {
    recommendations.push({
      pathway: "Science, Technology, Engineering and Mathematics (STEM)",
      description: "Strong analytical and problem-solving skills indicate potential in STEM fields",
      subjects: ["Advanced Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"]
    });
  }

  if (topThreeAreas.includes('english') || topThreeAreas.includes('kiswahili')) {
    recommendations.push({
      pathway: "Languages and Literature",
      description: "Excellent communication skills suggest success in language-based fields",
      subjects: ["Advanced English", "Kiswahili", "French/German", "Literature", "Communication"]
    });
  }

  if (topThreeAreas.includes('socialStudies')) {
    recommendations.push({
      pathway: "Social Sciences and Humanities", 
      description: "Interest in society and culture indicates aptitude for social sciences",
      subjects: ["History", "Geography", "Economics", "Philosophy", "Psychology"]
    });
  }

  if (topThreeAreas.includes('creativeArts')) {
    recommendations.push({
      pathway: "Arts and Creative Industries",
      description: "Creative expression abilities point to success in artistic fields",
      subjects: ["Fine Arts", "Music", "Drama", "Design Technology", "Film Studies"]
    });
  }

  if (topThreeAreas.includes('physicalEducation') || topThreeAreas.includes('healthEducation')) {
    recommendations.push({
      pathway: "Sports Science and Health",
      description: "Physical aptitude and health awareness suggest sports and wellness careers",
      subjects: ["Sports Science", "Physical Education", "Health Science", "Nutrition", "Psychology"]
    });
  }

  // Default recommendation if no strong areas
  if (recommendations.length === 0) {
    recommendations.push({
      pathway: "General Studies with Career Exploration",
      description: "Balanced interests across areas - explore different subjects to find your passion",
      subjects: ["Core Mathematics", "English", "Science", "Social Studies", "Career Guidance"]
    });
  }

  return recommendations;
}
