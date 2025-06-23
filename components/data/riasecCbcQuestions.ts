
export interface RiasecCbcQuestion {
  id: number;
  text: string;
  category: 'realistic' | 'investigative' | 'artistic' | 'social' | 'enterprising' | 'conventional';
  cbcValue?: 'love' | 'unity' | 'responsibility' | 'respect' | 'integrity' | 'patriotism' | 'peace';
  learningArea?: string;
}

export const riasecCbcQuestions: RiasecCbcQuestion[] = [
  // Realistic (9 questions) - Updated to be more kid-friendly
  { 
    id: 1, 
    text: "I enjoy working with machines, tools, or building useful things with my hands.", 
    category: "realistic", 
    learningArea: "Science & Technology" 
  },
  { 
    id: 2, 
    text: "I like making useful things that people can actually use in their daily lives.", 
    category: "realistic", 
    cbcValue: "responsibility" 
  },
  { 
    id: 3, 
    text: "I enjoy using technical tools, equipment, or operating different types of machines safely.", 
    category: "realistic", 
    learningArea: "Pre-Technical Studies" 
  },
  { 
    id: 4, 
    text: "I feel proud when I can fix broken things around my home, school, or community.", 
    category: "realistic", 
    cbcValue: "responsibility" 
  },
  { 
    id: 5, 
    text: "I prefer working outside doing practical activities in nature rather than staying indoors.", 
    category: "realistic", 
    learningArea: "Agriculture" 
  },
  { 
    id: 6, 
    text: "I enjoy building structures, furniture, or useful items from wood, metal, or other materials.", 
    category: "realistic" 
  },
  { 
    id: 7, 
    text: "I like working with plants and animals on farms and learning about agricultural practices.", 
    category: "realistic", 
    learningArea: "Agriculture", 
    cbcValue: "love" 
  },
  { 
    id: 8, 
    text: "I enjoy using different tools and equipment to solve everyday practical problems.", 
    category: "realistic", 
    cbcValue: "responsibility" 
  },
  { 
    id: 9, 
    text: "I like taking apart electronic devices or machines and putting them back together.", 
    category: "realistic", 
    learningArea: "Science & Technology" 
  },

  // Investigative (8 questions) - Updated to be more kid-friendly
  { 
    id: 10, 
    text: "I love doing science experiments to discover new and exciting things about the world.", 
    category: "investigative", 
    learningArea: "Integrated Science" 
  },
  { 
    id: 11, 
    text: "I enjoy researching information carefully and using it to solve interesting problems.", 
    category: "investigative", 
    cbcValue: "integrity" 
  },
  { 
    id: 12, 
    text: "I like studying how things work in nature and learning about our environment.", 
    category: "investigative", 
    learningArea: "Integrated Science" 
  },
  { 
    id: 13, 
    text: "I enjoy using mathematics to solve challenging and complex problems step by step.", 
    category: "investigative", 
    learningArea: "Mathematics" 
  },
  { 
    id: 14, 
    text: "I like investigating problems that affect my community and finding practical solutions.", 
    category: "investigative", 
    cbcValue: "patriotism" 
  },
  { 
    id: 15, 
    text: "I enjoy studying different cultures, their histories, and learning about diverse communities.", 
    category: "investigative", 
    learningArea: "Social Studies" 
  },
  { 
    id: 16, 
    text: "I like looking at data and information carefully to find hidden patterns and connections.", 
    category: "investigative", 
    cbcValue: "integrity" 
  },
  { 
    id: 17, 
    text: "I love asking questions and finding answers based on facts, evidence, and careful research.", 
    category: "investigative", 
    learningArea: "Integrated Science" 
  },

  // Artistic (8 questions) - Updated to be more kid-friendly
  { 
    id: 18, 
    text: "I love creating beautiful artwork, drawings, and designs that express my creativity.", 
    category: "artistic", 
    learningArea: "Creative Arts" 
  },
  { 
    id: 19, 
    text: "I enjoy writing creative stories, poems, and scripts that come from my imagination.", 
    category: "artistic", 
    learningArea: "English/Kiswahili" 
  },
  { 
    id: 20, 
    text: "I love performing music, dance, or drama in front of other people and audiences.", 
    category: "artistic", 
    learningArea: "Creative Arts", 
    cbcValue: "love" 
  },
  { 
    id: 21, 
    text: "I enjoy designing posters and graphics for school events and community activities.", 
    category: "artistic", 
    cbcValue: "unity" 
  },
  { 
    id: 22, 
    text: "I like expressing my feelings and ideas through art and other creative activities.", 
    category: "artistic", 
    learningArea: "Creative Arts" 
  },
  { 
    id: 23, 
    text: "I enjoy taking beautiful photographs and making interesting videos or short films.", 
    category: "artistic", 
    cbcValue: "love" 
  },
  { 
    id: 24, 
    text: "I like decorating spaces and making them more beautiful and welcoming for everyone.", 
    category: "artistic", 
    learningArea: "Creative Arts" 
  },
  { 
    id: 25, 
    text: "I enjoy finding new and creative ways to present information and share ideas with others.", 
    category: "artistic", 
    cbcValue: "integrity" 
  },

  // Social (8 questions) - Updated to be more kid-friendly
  { 
    id: 26, 
    text: "I enjoy helping my classmates when they're struggling with their schoolwork or feeling upset.", 
    category: "social", 
    cbcValue: "love" 
  },
  { 
    id: 27, 
    text: "I like organizing fun activities and events that bring people together in harmony.", 
    category: "social", 
    cbcValue: "unity" 
  },
  { 
    id: 28, 
    text: "I enjoy taking care of younger children and helping them learn new things patiently.", 
    category: "social", 
    cbcValue: "responsibility" 
  },
  { 
    id: 29, 
    text: "I like listening to my friends' problems and offering them support and encouragement.", 
    category: "social", 
    cbcValue: "love" 
  },
  { 
    id: 30, 
    text: "I enjoy working peacefully with people from different backgrounds and cultures.", 
    category: "social", 
    cbcValue: "peace" 
  },
  { 
    id: 31, 
    text: "I like teaching other people new skills and sharing my knowledge with them.", 
    category: "social", 
    learningArea: "Any subject", 
    cbcValue: "responsibility" 
  },
  { 
    id: 32, 
    text: "I enjoy helping my classmates solve their disagreements and conflicts peacefully.", 
    category: "social", 
    cbcValue: "peace" 
  },
  { 
    id: 33, 
    text: "I like volunteering for community service projects to help make my community better.", 
    category: "social", 
    cbcValue: "patriotism" 
  },

  // Enterprising (8 questions) - Updated to be more kid-friendly
  { 
    id: 34, 
    text: "I enjoy leading group projects and motivating my teammates to do their best work.", 
    category: "enterprising", 
    cbcValue: "responsibility" 
  },
  { 
    id: 35, 
    text: "I like starting small businesses or entrepreneurial projects to make money and help people.", 
    category: "enterprising", 
    learningArea: "Business Studies" 
  },
  { 
    id: 36, 
    text: "I enjoy convincing others to support my ideas and join my projects enthusiastically.", 
    category: "enterprising", 
    cbcValue: "integrity" 
  },
  { 
    id: 37, 
    text: "I like organizing and managing school events, activities, and bringing people together.", 
    category: "enterprising", 
    cbcValue: "unity" 
  },
  { 
    id: 38, 
    text: "I'm willing to take smart risks and try new approaches to achieve important goals.", 
    category: "enterprising", 
    cbcValue: "responsibility" 
  },
  { 
    id: 39, 
    text: "I enjoy competing in academic contests, sports competitions, or representing my school.", 
    category: "enterprising", 
    cbcValue: "patriotism" 
  },
  { 
    id: 40, 
    text: "I like negotiating and finding fair solutions that work well for everyone involved.", 
    category: "enterprising", 
    cbcValue: "peace" 
  },
  { 
    id: 41, 
    text: "I feel confident presenting my ideas to groups of people and speaking in public.", 
    category: "enterprising", 
    cbcValue: "respect" 
  },

  // Conventional (6 questions) - Updated to be more kid-friendly
  { 
    id: 42, 
    text: "I like keeping detailed records and organizing information in a neat, systematic, and orderly way.", 
    category: "conventional", 
    cbcValue: "responsibility" 
  },
  { 
    id: 43, 
    text: "I enjoy following rules and procedures carefully to make sure things are done the right way.", 
    category: "conventional", 
    cbcValue: "respect" 
  },
  { 
    id: 44, 
    text: "I like managing schedules and making sure important deadlines are met on time.", 
    category: "conventional", 
    cbcValue: "responsibility" 
  },
  { 
    id: 45, 
    text: "I enjoy working with numbers, data, financial information, and mathematical calculations.", 
    category: "conventional", 
    learningArea: "Mathematics" 
  },
  { 
    id: 46, 
    text: "I like creating organized lists and keeping track of important information systematically.", 
    category: "conventional", 
    cbcValue: "responsibility" 
  },
  { 
    id: 47, 
    text: "I enjoy using computer programs to organize, analyze, and present information clearly.", 
    category: "conventional", 
    learningArea: "Computer Studies" 
  }
];

export const cbcValues = {
  love: "Love - Showing care, compassion, and kindness towards others",
  unity: "Unity - Working together harmoniously despite differences", 
  responsibility: "Responsibility - Being accountable for your actions and duties",
  respect: "Respect - Valuing others and treating them with dignity",
  integrity: "Integrity - Being honest, truthful, and morally upright",
  patriotism: "Patriotism - Love for and devotion to your country",
  peace: "Peace - Promoting harmony and resolving conflicts peacefully"
};
