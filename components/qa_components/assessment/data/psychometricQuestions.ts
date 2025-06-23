
export interface PsychometricQuestion {
  id: number;
  text: string;
  category: 'cognitive' | 'personality' | 'emotional' | 'behavioral';
  psychometricType: 'cognitive' | 'personality' | 'emotional' | 'behavioral';
  cbcLearningArea?: string;
  cbcCoreValue?: string;
  cbcCompetency?: string;
  riasecType?: 'realistic' | 'investigative' | 'artistic' | 'social' | 'enterprising' | 'conventional';
}

export const psychometricQuestions: PsychometricQuestion[] = [
  // Cognitive Abilities (15 questions) - Updated for better understanding
  {
    id: 101,
    text: "I can easily find patterns in numbers, like what comes next in a sequence (2, 4, 6, ?).",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcLearningArea: 'Mathematics',
    riasecType: 'investigative'
  },
  {
    id: 102,
    text: "I enjoy solving math puzzles and problems because they're fun challenges for me.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcLearningArea: 'Mathematics',
    riasecType: 'investigative'
  },
  {
    id: 103,
    text: "When someone tells me a story or teaches me something, I can remember the important details later.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcCompetency: 'Learning to Learn'
  },
  {
    id: 104,
    text: "When I have a problem to solve, I like to think about it step by step until I find the answer.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcCompetency: 'Critical Thinking',
    riasecType: 'investigative'
  },
  {
    id: 105,
    text: "I can understand big ideas even when I can't see or touch them (like gravity or friendship).",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcLearningArea: 'Science',
    riasecType: 'investigative'
  },
  {
    id: 106,
    text: "I like to ask 'Why does this happen?' and figure out the reasons behind things.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcCompetency: 'Critical Thinking'
  },
  {
    id: 107,
    text: "I understand pictures, maps, and diagrams quickly when I look at them.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcLearningArea: 'Creative Arts',
    riasecType: 'artistic'
  },
  {
    id: 108,
    text: "I'm good at imagining how puzzle pieces fit together or how furniture would look in a room.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    riasecType: 'realistic'
  },
  {
    id: 109,
    text: "I can concentrate on my homework or activities for a long time without getting distracted.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcCompetency: 'Self Efficacy'
  },
  {
    id: 110,
    text: "I learn new things quickly and don't need many explanations to understand them.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcCompetency: 'Learning to Learn'
  },
  {
    id: 111,
    text: "I enjoy reading books and writing stories because I'm good with words.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcLearningArea: 'English',
    cbcCompetency: 'Communication'
  },
  {
    id: 112,
    text: "I can take different ideas and put them together to create something completely new.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcCompetency: 'Creativity',
    riasecType: 'artistic'
  },
  {
    id: 113,
    text: "When I face a big problem, I break it into smaller parts to make it easier to solve.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcCompetency: 'Critical Thinking',
    riasecType: 'investigative'
  },
  {
    id: 114,
    text: "I enjoy using computers, tablets, and learning about new technology.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcCompetency: 'Digital Literacy',
    riasecType: 'realistic'
  },
  {
    id: 115,
    text: "I like making plans and figuring out the best way to do things before I start.",
    category: 'cognitive',
    psychometricType: 'cognitive',
    cbcCompetency: 'Critical Thinking',
    riasecType: 'enterprising'
  },

  // Personality Assessment (15 questions) - Updated for better understanding
  {
    id: 201,
    text: "When we work in groups, other students often ask me to be the leader.",
    category: 'personality',
    psychometricType: 'personality',
    cbcCoreValue: 'responsibility',
    riasecType: 'enterprising'
  },
  {
    id: 202,
    text: "I prefer working by myself rather than in groups because I can focus better.",
    category: 'personality',
    psychometricType: 'personality',
    riasecType: 'realistic'
  },
  {
    id: 203,
    text: "I feel comfortable speaking in front of my class or presenting to a large group.",
    category: 'personality',
    psychometricType: 'personality',
    cbcCompetency: 'Communication',
    riasecType: 'enterprising'
  },
  {
    id: 204,
    text: "I really enjoy helping my friends and classmates when they need support or encouragement.",
    category: 'personality',
    psychometricType: 'personality',
    cbcCoreValue: 'love',
    riasecType: 'social'
  },
  {
    id: 205,
    text: "I like keeping my school bag, desk, and room organized and paying attention to small details.",
    category: 'personality',
    psychometricType: 'personality',
    cbcCoreValue: 'responsibility',
    riasecType: 'conventional'
  },
  {
    id: 206,
    text: "I love being creative and making art, music, stories, or other creative projects.",
    category: 'personality',
    psychometricType: 'personality',
    cbcCompetency: 'Creativity',
    riasecType: 'artistic'
  },
  {
    id: 207,
    text: "I like competing in games, sports, or contests and always try my best to win.",
    category: 'personality',
    psychometricType: 'personality',
    riasecType: 'enterprising'
  },
  {
    id: 208,
    text: "When something is difficult, I keep trying until I figure it out or get it right.",
    category: 'personality',
    psychometricType: 'personality',
    cbcCoreValue: 'responsibility',
    cbcCompetency: 'Self Efficacy'
  },
  {
    id: 209,
    text: "I'm always curious and love learning about new topics that interest me.",
    category: 'personality',
    psychometricType: 'personality',
    cbcCompetency: 'Learning to Learn',
    riasecType: 'investigative'
  },
  {
    id: 210,
    text: "I prefer doing hands-on activities rather than just reading about how to do them.",
    category: 'personality',
    psychometricType: 'personality',
    riasecType: 'realistic'
  },
  {
    id: 211,
    text: "I can tell when someone is sad, worried, or upset, and I care about how they feel.",
    category: 'personality',
    psychometricType: 'personality',
    cbcCoreValue: 'love',
    riasecType: 'social'
  },
  {
    id: 212,
    text: "I can easily adjust when plans change or when things don't go the way I expected.",
    category: 'personality',
    psychometricType: 'personality',
    cbcCompetency: 'Self Efficacy'
  },
  {
    id: 213,
    text: "I believe in myself and feel confident that I can learn new things and succeed.",
    category: 'personality',
    psychometricType: 'personality',
    cbcCompetency: 'Self Efficacy',
    riasecType: 'enterprising'
  },
  {
    id: 214,
    text: "I like following instructions step by step and doing things the proper way.",
    category: 'personality',
    psychometricType: 'personality',
    riasecType: 'conventional'
  },
  {
    id: 215,
    text: "I enjoy coming up with new ideas and finding creative solutions to problems.",
    category: 'personality',
    psychometricType: 'personality',
    cbcCompetency: 'Creativity',
    riasecType: 'artistic'
  },

  // Emotional Intelligence (10 questions) - Updated for better understanding
  {
    id: 301,
    text: "I understand my own feelings and can control them when I need to stay calm or focused.",
    category: 'emotional',
    psychometricType: 'emotional',
    cbcCompetency: 'Self Efficacy'
  },
  {
    id: 302,
    text: "I can tell when my friends or family members are feeling worried, sad, or excited.",
    category: 'emotional',
    psychometricType: 'emotional',
    cbcCoreValue: 'love',
    riasecType: 'social'
  },
  {
    id: 303,
    text: "I stay calm and don't panic even when things get stressful or difficult around me.",
    category: 'emotional',
    psychometricType: 'emotional',
    cbcCompetency: 'Self Efficacy'
  },
  {
    id: 304,
    text: "I can motivate myself to finish hard tasks even when I don't feel like doing them.",
    category: 'emotional',
    psychometricType: 'emotional',
    cbcCompetency: 'Self Efficacy'
  },
  {
    id: 305,
    text: "When someone gives me feedback or advice, I listen carefully and try to improve.",
    category: 'emotional',
    psychometricType: 'emotional',
    cbcCoreValue: 'respect',
    cbcCompetency: 'Learning to Learn'
  },
  {
    id: 306,
    text: "I can make friends easily with many different kinds of people.",
    category: 'emotional',
    psychometricType: 'emotional',
    cbcCompetency: 'Communication',
    riasecType: 'social'
  },
  {
    id: 307,
    text: "When friends are arguing or fighting, I can help them solve their problems peacefully.",
    category: 'emotional',
    psychometricType: 'emotional',
    cbcCoreValue: 'peace',
    riasecType: 'social'
  },
  {
    id: 308,
    text: "I usually feel positive and happy, and I look on the bright side of things.",
    category: 'emotional',
    psychometricType: 'emotional',
    cbcCompetency: 'Self Efficacy'
  },
  {
    id: 309,
    text: "I can encourage others and help them feel better about themselves when they're down.",
    category: 'emotional',
    psychometricType: 'emotional',
    cbcCoreValue: 'unity',
    riasecType: 'enterprising'
  },
  {
    id: 310,
    text: "I enjoy working and playing with people who are different from me.",
    category: 'emotional',
    psychometricType: 'emotional',
    cbcCoreValue: 'unity',
    cbcCompetency: 'Citizenship'
  },

  // Behavioral Skills (10 questions) - Updated for better understanding
  {
    id: 401,
    text: "I like to start new projects without waiting for someone to tell me what to do.",
    category: 'behavioral',
    psychometricType: 'behavioral',
    cbcCompetency: 'Self Efficacy',
    riasecType: 'enterprising'
  },
  {
    id: 402,
    text: "I can finish my homework and projects on time, even when I have to work quickly.",
    category: 'behavioral',
    psychometricType: 'behavioral',
    cbcCoreValue: 'responsibility'
  },
  {
    id: 403,
    text: "I learn to use new apps, games, or technology tools quickly and easily.",
    category: 'behavioral',
    psychometricType: 'behavioral',
    cbcCompetency: 'Digital Literacy'
  },
  {
    id: 404,
    text: "I work well with others when we have group projects or team activities.",
    category: 'behavioral',
    psychometricType: 'behavioral',
    cbcCompetency: 'Collaboration',
    riasecType: 'social'
  },
  {
    id: 405,
    text: "I can explain my ideas clearly so that others understand what I mean.",
    category: 'behavioral',
    psychometricType: 'behavioral',
    cbcCompetency: 'Communication'
  },
  {
    id: 406,
    text: "I can make good decisions quickly when I need to choose what to do.",
    category: 'behavioral',
    psychometricType: 'behavioral',
    riasecType: 'enterprising'
  },
  {
    id: 407,
    text: "I check my work carefully to make sure it's done correctly before I turn it in.",
    category: 'behavioral',
    psychometricType: 'behavioral',
    cbcCoreValue: 'responsibility',
    riasecType: 'conventional'
  },
  {
    id: 408,
    text: "When I make a mistake, I admit it honestly and try to learn from what happened.",
    category: 'behavioral',
    psychometricType: 'behavioral',
    cbcCoreValue: 'integrity',
    cbcCompetency: 'Learning to Learn'
  },
  {
    id: 409,
    text: "I can do several different things at once without getting confused or overwhelmed.",
    category: 'behavioral',
    psychometricType: 'behavioral',
    cbcCompetency: 'Self Efficacy'
  },
  {
    id: 410,
    text: "I ask for help and advice when I want to get better at things I'm learning.",
    category: 'behavioral',
    psychometricType: 'behavioral',
    cbcCompetency: 'Learning to Learn'
  }
];
