
interface IntegratedQuestion {
  id: string;
  text: string;
  category: string;
  sourceType: 'cbc' | 'riasec' | 'psychometric';
  cbcAlignment: string;
  options?: string[];
}

export const integratedQuestions: IntegratedQuestion[] = [
  // CBC Learning Areas (16 questions)
  {
    id: "cbc_1",
    text: "I enjoy solving complex mathematical problems and finding patterns in numbers",
    category: "Mathematics",
    sourceType: "cbc",
    cbcAlignment: "Mathematics and Integrated Science"
  },
  {
    id: "cbc_2", 
    text: "I find it easy to conduct scientific experiments and make observations",
    category: "Science",
    sourceType: "cbc",
    cbcAlignment: "Mathematics and Integrated Science"
  },
  {
    id: "cbc_3",
    text: "I can express myself clearly in both written and spoken English",
    category: "English",
    sourceType: "cbc", 
    cbcAlignment: "Languages"
  },
  {
    id: "cbc_4",
    text: "I enjoy learning about different cultures and historical events",
    category: "Social Studies",
    sourceType: "cbc",
    cbcAlignment: "Social Studies"
  },
  {
    id: "cbc_5",
    text: "I like working with technology and computer applications",
    category: "Computer Studies",
    sourceType: "cbc",
    cbcAlignment: "Pre-Technical and Pre-Career"
  },
  {
    id: "cbc_6",
    text: "I enjoy creating art, music, or other creative expressions",
    category: "Creative Arts",
    sourceType: "cbc",
    cbcAlignment: "Creative Arts"
  },
  {
    id: "cbc_7",
    text: "I like participating in physical activities and sports",
    category: "Physical Education",
    sourceType: "cbc",
    cbcAlignment: "Physical and Health Education"
  },
  {
    id: "cbc_8",
    text: "I understand the importance of nutrition and healthy living",
    category: "Health Education", 
    sourceType: "cbc",
    cbcAlignment: "Physical and Health Education"
  },
  {
    id: "cbc_9",
    text: "I can communicate effectively in Kiswahili",
    category: "Kiswahili",
    sourceType: "cbc",
    cbcAlignment: "Languages"
  },
  {
    id: "cbc_10",
    text: "I understand business concepts and entrepreneurship opportunities",
    category: "Business Studies",
    sourceType: "cbc",
    cbcAlignment: "Pre-Technical and Pre-Career"
  },
  {
    id: "cbc_11",
    text: "I enjoy working with plants, animals, and agricultural practices", 
    category: "Agriculture",
    sourceType: "cbc",
    cbcAlignment: "Pre-Technical and Pre-Career"
  },
  {
    id: "cbc_12",
    text: "I like building and constructing things with my hands",
    category: "Building & Construction",
    sourceType: "cbc", 
    cbcAlignment: "Pre-Technical and Pre-Career"
  },
  {
    id: "cbc_13",
    text: "I enjoy cooking, nutrition planning, and home management",
    category: "Home Science",
    sourceType: "cbc",
    cbcAlignment: "Pre-Technical and Pre-Career"
  },
  {
    id: "cbc_14",
    text: "I understand religious and moral values in society",
    category: "Religious Education",
    sourceType: "cbc",
    cbcAlignment: "Religious Education"
  },
  {
    id: "cbc_15",
    text: "I can analyze geographical features and environmental issues",
    category: "Geography",
    sourceType: "cbc",
    cbcAlignment: "Social Studies" 
  },
  {
    id: "cbc_16",
    text: "I enjoy working with wood, metal, or other materials to create objects",
    category: "Technical Skills",
    sourceType: "cbc",
    cbcAlignment: "Pre-Technical and Pre-Career"
  },

  // RIASEC Career Types (17 questions)
  {
    id: "riasec_1",
    text: "I would enjoy working outdoors with tools and machinery",
    category: "Realistic",
    sourceType: "riasec",
    cbcAlignment: "Pre-Technical and Pre-Career"
  },
  {
    id: "riasec_2",
    text: "I like to conduct research and analyze scientific data",
    category: "Investigative", 
    sourceType: "riasec",
    cbcAlignment: "Mathematics and Integrated Science"
  },
  {
    id: "riasec_3",
    text: "I enjoy expressing myself through creative arts and design",
    category: "Artistic",
    sourceType: "riasec",
    cbcAlignment: "Creative Arts"
  },
  {
    id: "riasec_4",
    text: "I like helping others and working in teams",
    category: "Social",
    sourceType: "riasec", 
    cbcAlignment: "Social Studies"
  },
  {
    id: "riasec_5",
    text: "I enjoy leading projects and persuading others",
    category: "Enterprising",
    sourceType: "riasec",
    cbcAlignment: "Pre-Technical and Pre-Career"
  },
  {
    id: "riasec_6", 
    text: "I like organizing data and following detailed procedures",
    category: "Conventional",
    sourceType: "riasec",
    cbcAlignment: "Mathematics and Integrated Science"
  },
  {
    id: "riasec_7",
    text: "I would enjoy repairing electronic devices or machines",
    category: "Realistic",
    sourceType: "riasec",
    cbcAlignment: "Pre-Technical and Pre-Career"
  },
  {
    id: "riasec_8",
    text: "I like solving complex puzzles and theoretical problems",
    category: "Investigative",
    sourceType: "riasec",
    cbcAlignment: "Mathematics and Integrated Science"
  },
  {
    id: "riasec_9",
    text: "I enjoy writing stories, poems, or creating digital content",
    category: "Artistic",
    sourceType: "riasec",
    cbcAlignment: "Languages"
  },
  {
    id: "riasec_10",
    text: "I like teaching or counseling others",
    category: "Social",
    sourceType: "riasec",
    cbcAlignment: "Social Studies"
  },
  {
    id: "riasec_11",
    text: "I enjoy starting new businesses or projects",
    category: "Enterprising", 
    sourceType: "riasec",
    cbcAlignment: "Pre-Technical and Pre-Career"
  },
  {
    id: "riasec_12",
    text: "I like keeping accurate records and managing databases",
    category: "Conventional",
    sourceType: "riasec",
    cbcAlignment: "Mathematics and Integrated Science"
  },
  {
    id: "riasec_13",
    text: "I enjoy physical activities and hands-on work",
    category: "Realistic",
    sourceType: "riasec",
    cbcAlignment: "Physical and Health Education"
  },
  {
    id: "riasec_14",
    text: "I like studying how things work and discovering new knowledge",
    category: "Investigative",
    sourceType: "riasec",
    cbcAlignment: "Mathematics and Integrated Science"
  },
  {
    id: "riasec_15",
    text: "I enjoy performing music, drama, or other artistic activities",
    category: "Artistic",
    sourceType: "riasec", 
    cbcAlignment: "Creative Arts"
  },
  {
    id: "riasec_16",
    text: "I like working with people to solve community problems",
    category: "Social",
    sourceType: "riasec",
    cbcAlignment: "Social Studies"
  },
  {
    id: "riasec_17",
    text: "I enjoy organizing events and managing resources efficiently",
    category: "Conventional",
    sourceType: "riasec",
    cbcAlignment: "Pre-Technical and Pre-Career"
  },

  // Psychometric Assessment (17 questions)
  {
    id: "psycho_1",
    text: "I can easily remember and recall detailed information",
    category: "Cognitive",
    sourceType: "psychometric",
    cbcAlignment: "Learning to Learn"
  },
  {
    id: "psycho_2", 
    text: "I work well under pressure and meet deadlines consistently",
    category: "Behavioral",
    sourceType: "psychometric",
    cbcAlignment: "Self-Efficacy"
  },
  {
    id: "psycho_3",
    text: "I can understand and manage my emotions effectively",
    category: "Emotional",
    sourceType: "psychometric", 
    cbcAlignment: "Self-Efficacy"
  },
  {
    id: "psycho_4",
    text: "I enjoy meeting new people and making friends easily",
    category: "Personality",
    sourceType: "psychometric",
    cbcAlignment: "Communication and Collaboration"
  },
  {
    id: "psycho_5",
    text: "I can analyze problems logically and find effective solutions",
    category: "Cognitive",
    sourceType: "psychometric",
    cbcAlignment: "Critical Thinking and Problem Solving"
  },
  {
    id: "psycho_6",
    text: "I adapt quickly to new situations and changes",
    category: "Behavioral",
    sourceType: "psychometric",
    cbcAlignment: "Learning to Learn"
  },
  {
    id: "psycho_7",
    text: "I can motivate myself to complete challenging tasks",
    category: "Emotional",
    sourceType: "psychometric",
    cbcAlignment: "Self-Efficacy"
  },
  {
    id: "psycho_8",
    text: "I prefer working alone rather than in groups",
    category: "Personality",
    sourceType: "psychometric",
    cbcAlignment: "Communication and Collaboration"
  },
  {
    id: "psycho_9",
    text: "I can learn new concepts quickly and apply them effectively",
    category: "Cognitive",
    sourceType: "psychometric",
    cbcAlignment: "Learning to Learn"
  },
  {
    id: "psycho_10",
    text: "I maintain consistent performance even when facing difficulties",
    category: "Behavioral",
    sourceType: "psychometric", 
    cbcAlignment: "Self-Efficacy"
  },
  {
    id: "psycho_11",
    text: "I can remain calm and composed in stressful situations",
    category: "Emotional",
    sourceType: "psychometric",
    cbcAlignment: "Self-Efficacy"
  },
  {
    id: "psycho_12",
    text: "I enjoy taking on leadership roles and responsibilities",
    category: "Personality",
    sourceType: "psychometric",
    cbcAlignment: "Communication and Collaboration"
  },
  {
    id: "psycho_13",
    text: "I can focus on tasks for extended periods without getting distracted",
    category: "Cognitive",
    sourceType: "psychometric",
    cbcAlignment: "Learning to Learn"
  },
  {
    id: "psycho_14", 
    text: "I take initiative and start projects without being asked",
    category: "Behavioral",
    sourceType: "psychometric",
    cbcAlignment: "Self-Efficacy"
  },
  {
    id: "psycho_15",
    text: "I can empathize with others and understand their feelings",
    category: "Emotional",
    sourceType: "psychometric",
    cbcAlignment: "Communication and Collaboration"
  },
  {
    id: "psycho_16",
    text: "I am naturally curious and enjoy exploring new ideas",
    category: "Personality",
    sourceType: "psychometric", 
    cbcAlignment: "Critical Thinking and Problem Solving"
  },
  {
    id: "psycho_17",
    text: "I can make decisions quickly when faced with multiple options",
    category: "Cognitive",
    sourceType: "psychometric",
    cbcAlignment: "Critical Thinking and Problem Solving"
  }
];

// Shuffle questions for varied experience but maintain balance
export const createShuffledQuestions = () => {
  const shuffled = [...integratedQuestions];
  
  // Group by source type to ensure balance
  const cbcQuestions = shuffled.filter(q => q.sourceType === 'cbc');
  const riasecQuestions = shuffled.filter(q => q.sourceType === 'riasec');  
  const psychoQuestions = shuffled.filter(q => q.sourceType === 'psychometric');
  
  // Shuffle each group
  const shuffleCBC = cbcQuestions.sort(() => Math.random() - 0.5);
  const shuffleRIASEC = riasecQuestions.sort(() => Math.random() - 0.5);
  const shufflePsycho = psychoQuestions.sort(() => Math.random() - 0.5);
  
  // Interleave questions to maintain variety
  const result = [];
  const maxLength = Math.max(shuffleCBC.length, shuffleRIASEC.length, shufflePsycho.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < shuffleCBC.length) result.push(shuffleCBC[i]);
    if (i < shuffleRIASEC.length) result.push(shuffleRIASEC[i]);
    if (i < shufflePsycho.length) result.push(shufflePsycho[i]);
  }
  
  return result;
};
