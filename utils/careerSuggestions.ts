
interface CareerSuggestion {
  title: string;
  description: string;
  types: string[];
}

export const getCareerSuggestions = (hollandCode: string): CareerSuggestion[] => {
  const careerDatabase: Record<string, CareerSuggestion[]> = {
    // Three-letter codes
    RIA: [
      { title: "Architect", description: "Design buildings and structures", types: ["R", "I", "A"] },
      { title: "Industrial Designer", description: "Create functional and aesthetic products", types: ["R", "I", "A"] },
    ],
    RIC: [
      { title: "Engineer", description: "Apply scientific principles to solve problems", types: ["R", "I", "C"] },
      { title: "Computer Programmer", description: "Write and maintain software code", types: ["R", "I", "C"] },
    ],
    RIE: [
      { title: "Systems Analyst", description: "Analyze computer systems and recommend improvements", types: ["R", "I", "E"] },
      { title: "Technical Consultant", description: "Provide expert technical advice", types: ["R", "I", "E"] },
    ],
    RIS: [
      { title: "Veterinarian", description: "Provide medical care for animals", types: ["R", "I", "S"] },
      { title: "Physical Therapist", description: "Help patients recover physical abilities", types: ["R", "I", "S"] },
    ],
    RAC: [
      { title: "Graphic Designer", description: "Create visual content for various media", types: ["R", "A", "C"] },
      { title: "Technical Illustrator", description: "Create detailed technical drawings", types: ["R", "A", "C"] },
    ],
    RAE: [
      { title: "Art Director", description: "Oversee visual aspects of media productions", types: ["R", "A", "E"] },
      { title: "Creative Director", description: "Lead creative teams and projects", types: ["R", "A", "E"] },
    ],
    RAS: [
      { title: "Art Therapist", description: "Use art to help people heal and express themselves", types: ["R", "A", "S"] },
      { title: "Recreation Therapist", description: "Use activities to help people recover", types: ["R", "A", "S"] },
    ],
    RCE: [
      { title: "Construction Manager", description: "Oversee building projects", types: ["R", "C", "E"] },
      { title: "Project Manager", description: "Plan and execute projects", types: ["R", "C", "E"] },
    ],
    RCS: [
      { title: "Safety Inspector", description: "Ensure workplace safety compliance", types: ["R", "C", "S"] },
      { title: "Quality Control Specialist", description: "Monitor product quality", types: ["R", "C", "S"] },
    ],
    RSE: [
      { title: "Police Officer", description: "Maintain public safety and order", types: ["R", "S", "E"] },
      { title: "Paramedic", description: "Provide emergency medical care", types: ["R", "S", "E"] },
    ],
    // Additional common combinations
    IAC: [
      { title: "Research Scientist", description: "Conduct scientific research and analysis", types: ["I", "A", "C"] },
      { title: "Data Analyst", description: "Analyze data to find insights", types: ["I", "A", "C"] },
    ],
    IAS: [
      { title: "Psychologist", description: "Study human behavior and mental processes", types: ["I", "A", "S"] },
      { title: "Social Researcher", description: "Study social trends and behaviors", types: ["I", "A", "S"] },
    ],
    IAE: [
      { title: "Market Research Analyst", description: "Study market conditions", types: ["I", "A", "E"] },
      { title: "Business Analyst", description: "Analyze business processes", types: ["I", "A", "E"] },
    ],
    ICE: [
      { title: "Financial Analyst", description: "Analyze financial data and trends", types: ["I", "C", "E"] },
      { title: "Investment Advisor", description: "Provide investment guidance", types: ["I", "C", "E"] },
    ],
    ICS: [
      { title: "Medical Researcher", description: "Conduct medical and health research", types: ["I", "C", "S"] },
      { title: "Epidemiologist", description: "Study disease patterns", types: ["I", "C", "S"] },
    ],
    ISE: [
      { title: "College Professor", description: "Teach and conduct research at universities", types: ["I", "S", "E"] },
      { title: "Training Manager", description: "Develop and manage training programs", types: ["I", "S", "E"] },
    ],
    ASE: [
      { title: "Teacher", description: "Educate students in various subjects", types: ["A", "S", "E"] },
      { title: "Counselor", description: "Help people with personal and emotional issues", types: ["A", "S", "E"] },
    ],
    ASC: [
      { title: "Librarian", description: "Manage information resources and help patrons", types: ["A", "S", "C"] },
      { title: "Museum Curator", description: "Manage museum collections and exhibits", types: ["A", "S", "C"] },
    ],
    ACE: [
      { title: "Marketing Manager", description: "Develop and execute marketing strategies", types: ["A", "C", "E"] },
      { title: "Public Relations Manager", description: "Manage public image and communications", types: ["A", "C", "E"] },
    ],
    SEC: [
      { title: "Human Resources Manager", description: "Manage employee relations and policies", types: ["S", "E", "C"] },
      { title: "Social Worker", description: "Help individuals and families in need", types: ["S", "E", "C"] },
    ],
    SCE: [
      { title: "School Administrator", description: "Manage educational institutions", types: ["S", "C", "E"] },
      { title: "Healthcare Administrator", description: "Manage healthcare facilities", types: ["S", "C", "E"] },
    ],
    ECR: [
      { title: "Sales Manager", description: "Lead sales teams and strategies", types: ["E", "C", "R"] },
      { title: "Real Estate Agent", description: "Help people buy and sell properties", types: ["E", "C", "R"] },
    ],
  };

  // Try to find exact match first
  if (careerDatabase[hollandCode]) {
    return careerDatabase[hollandCode];
  }

  // If no exact match, try partial matches
  const suggestions: CareerSuggestion[] = [];
  const codeLetters = hollandCode.split('');

  // Look for careers that match at least 2 out of 3 letters
  Object.entries(careerDatabase).forEach(([code, careers]) => {
    const matchCount = code.split('').filter(letter => codeLetters.includes(letter)).length;
    if (matchCount >= 2) {
      suggestions.push(...careers);
    }
  });

  // Remove duplicates and limit to 6 suggestions
  const uniqueSuggestions = suggestions.filter((career, index, self) => 
    index === self.findIndex(c => c.title === career.title)
  );

  return uniqueSuggestions.slice(0, 6);
};
