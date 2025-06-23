
export interface RiasecCbcScores {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

export interface CbcValuesScores {
  love: number;
  unity: number;
  responsibility: number;
  respect: number;
  integrity: number;
  patriotism: number;
  peace: number;
}

export const calculateRiasecCbcScores = (answers: Record<number, number>) => {
  const riasecScores: RiasecCbcScores = {
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0,
  };

  const valuesScores: CbcValuesScores = {
    love: 0,
    unity: 0,
    responsibility: 0,
    respect: 0,
    integrity: 0,
    patriotism: 0,
    peace: 0,
  };

  // Calculate RIASEC scores
  Object.entries(answers).forEach(([questionId, rating]) => {
    const id = parseInt(questionId);
    
    // Realistic (1-9)
    if (id >= 1 && id <= 9) riasecScores.realistic += rating;
    // Investigative (10-17)
    else if (id >= 10 && id <= 17) riasecScores.investigative += rating;
    // Artistic (18-25)
    else if (id >= 18 && id <= 25) riasecScores.artistic += rating;
    // Social (26-33)
    else if (id >= 26 && id <= 33) riasecScores.social += rating;
    // Enterprising (34-41)
    else if (id >= 34 && id <= 41) riasecScores.enterprising += rating;
    // Conventional (42-45)
    else if (id >= 42 && id <= 45) riasecScores.conventional += rating;
  });

  return { riasecScores, valuesScores };
};

export const getCbcPathwayRecommendations = (riasecScores: RiasecCbcScores) => {
  const recommendations = [];
  
  const sortedScores = Object.entries(riasecScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const topTypes = sortedScores.map(([type]) => type);

  // STEM Pathway
  if (topTypes.includes('realistic') || topTypes.includes('investigative')) {
    recommendations.push({
      pathway: "Science, Technology, Engineering and Mathematics (STEM)",
      code: "10.3",
      match: "High",
      description: "Strong analytical and problem-solving abilities align with STEM careers",
      learningAreas: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
      careers: ["Engineer", "Doctor", "Data Scientist", "Architect", "Software Developer", "Research Scientist"],
      clusters: ["STEM Cluster", "Technology Cluster", "Health Sciences Cluster"],
      reasoning: "Your interest in investigation, analysis, and practical problem-solving indicates strong potential in STEM fields."
    });
  }

  // Arts and Sports Science
  if (topTypes.includes('artistic') || topTypes.includes('social')) {
    recommendations.push({
      pathway: "Arts and Sports Science (ASS)",
      code: "10.1", 
      match: "High",
      description: "Creative expression and people-oriented skills suit arts and sports careers",
      learningAreas: ["Creative Arts & Design", "Physical & Health Education", "Psychology", "Biology", "Kiswahili"],
      careers: ["Graphic Designer", "Sports Coach", "Art Teacher", "Physiotherapist", "Event Planner", "Music Producer"],
      clusters: ["Creative Arts Cluster", "Sports & Recreation Cluster"],
      reasoning: "Your artistic abilities and social orientation make you well-suited for creative and sports-related careers."
    });
  }

  // Social Sciences
  if (topTypes.includes('social') || topTypes.includes('investigative')) {
    recommendations.push({
      pathway: "Social Sciences (SSC)",
      code: "10.2",
      match: "High", 
      description: "Interest in people and society aligns with social science careers",
      learningAreas: ["History & Government", "Geography", "Psychology", "Sociology", "Religious Studies"],
      careers: ["Social Worker", "Lawyer", "Journalist", "Diplomat", "Historian", "Anthropologist"],
      clusters: ["Social Sciences Cluster", "Communication Cluster"],
      reasoning: "Your social awareness and investigative nature suit careers focused on understanding and helping society."
    });
  }

  // Career and Technical Education
  if (topTypes.includes('realistic') || topTypes.includes('conventional')) {
    recommendations.push({
      pathway: "Career and Technical Education (CTE)",
      code: "10.6",
      match: "Medium",
      description: "Practical skills and systematic approach suit technical careers",
      learningAreas: ["Technical Studies", "Business Studies", "Computer Studies", "Entrepreneurship"],
      careers: ["Electrician", "Plumber", "Mechanic", "ICT Specialist", "Entrepreneur", "Craftsperson"],
      clusters: ["Technical Education Cluster", "Business Cluster"],
      reasoning: "Your practical orientation and attention to detail align well with technical and vocational careers."
    });
  }

  // Languages
  if (topTypes.includes('artistic') || topTypes.includes('social')) {
    recommendations.push({
      pathway: "Languages (LAN)",
      code: "10.4",
      match: "Medium",
      description: "Communication skills and cultural interest suit language careers",
      learningAreas: ["English", "Kiswahili", "Foreign Languages", "Literature", "Communication"],
      careers: ["Translator", "Teacher", "Writer", "Diplomat", "Content Creator", "Language Specialist"],
      clusters: ["Languages Cluster", "Communication Cluster"],
      reasoning: "Your expressive abilities and social skills make you well-suited for language and communication careers."
    });
  }

  // Applied Sciences
  if (topTypes.includes('investigative') || topTypes.includes('realistic')) {
    recommendations.push({
      pathway: "Applied Sciences (APS)",
      code: "10.5",
      match: "Medium",
      description: "Scientific interest and practical application suit applied science careers",
      learningAreas: ["Agriculture", "Home Science", "Environmental Science", "Applied Biology"],
      careers: ["Laboratory Technician", "Agricultural Officer", "Nutritionist", "Environmental Scientist"],
      clusters: ["Applied Sciences Cluster", "Agriculture Cluster"],
      reasoning: "Your scientific curiosity and practical approach align with applied science careers."
    });
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
};

export const getHollandCode = (riasecScores: RiasecCbcScores): string => {
  const sortedEntries = Object.entries(riasecScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  
  return sortedEntries.map(([type]) => type[0].toUpperCase()).join('');
};
