
export interface CBCQuestion {
  id: number;
  text: string;
  category: string;
  learningArea: string;
}

export const cbcQuestions: CBCQuestion[] = [
  // Mathematics (8 questions) - Updated for better understanding
  {
    id: 1,
    text: "I enjoy solving math puzzles and working through problems step by step to find the answer.",
    category: "Mathematics",
    learningArea: "Mathematical Reasoning"
  },
  {
    id: 2,
    text: "I like using numbers to solve everyday problems, like figuring out how much change I should get when shopping.",
    category: "Mathematics", 
    learningArea: "Number Operations"
  },
  {
    id: 3,
    text: "I find it fun to work with shapes, angles, and draw geometric figures like triangles and circles.",
    category: "Mathematics",
    learningArea: "Geometry"
  },
  {
    id: 4,
    text: "I enjoy collecting information and making charts or graphs to show what I discovered.",
    category: "Mathematics",
    learningArea: "Statistics"
  },
  {
    id: 5,
    text: "I like measuring things around me and figuring out how long, tall, or heavy they are.",
    category: "Mathematics",
    learningArea: "Measurement"
  },
  {
    id: 6,
    text: "I enjoy finding number patterns (like 2, 4, 6, 8...) and predicting what comes next.",
    category: "Mathematics",
    learningArea: "Algebra"
  },
  {
    id: 7,
    text: "I like using math formulas and calculations to solve real problems in my daily life.",
    category: "Mathematics",
    learningArea: "Application"
  },
  {
    id: 8,
    text: "I find it exciting to figure out the chances of something happening, like winning a game.",
    category: "Mathematics",
    learningArea: "Probability"
  },

  // English Language (6 questions) - Updated for better understanding
  {
    id: 9,
    text: "I love reading books, stories, and novels because they take me to different worlds.",
    category: "English",
    learningArea: "Reading Comprehension"
  },
  {
    id: 10,
    text: "I enjoy writing my own stories, poems, and creative pieces that come from my imagination.",
    category: "English",
    learningArea: "Creative Writing"
  },
  {
    id: 11,
    text: "I feel confident speaking in front of my class and presenting my ideas to other students.",
    category: "English",
    learningArea: "Oral Communication"
  },
  {
    id: 12,
    text: "I like learning new words and using them when I talk or write to express myself better.",
    category: "English",
    learningArea: "Vocabulary"
  },
  {
    id: 13,
    text: "I enjoy reading poems and stories, and figuring out their deeper meanings and messages.",
    category: "English",
    learningArea: "Literature"
  },
  {
    id: 14,
    text: "I like learning grammar rules and using them correctly to make my writing clear and proper.",
    category: "English",
    learningArea: "Grammar"
  },

  // Kiswahili (4 questions) - Updated for better understanding
  {
    id: 15,
    text: "I enjoy speaking Kiswahili and feel proud when I learn new Kiswahili words and phrases.",
    category: "Kiswahili",
    learningArea: "Oral Communication"
  },
  {
    id: 16,
    text: "I like reading Kiswahili books, stories, and poems because they help me understand our culture.",
    category: "Kiswahili",
    learningArea: "Reading"
  },
  {
    id: 17,
    text: "I enjoy writing compositions and essays in Kiswahili to express my thoughts and ideas.",
    category: "Kiswahili",
    learningArea: "Writing"
  },
  {
    id: 18,
    text: "I like learning about Kenyan culture and traditions through our Kiswahili lessons.",
    category: "Kiswahili",
    learningArea: "Cultural Studies"
  },

  // Science (8 questions) - Updated for better understanding
  {
    id: 19,
    text: "I love doing science experiments and watching what happens when I mix things or test ideas.",
    category: "Science",
    learningArea: "Scientific Method"
  },
  {
    id: 20,
    text: "I enjoy learning about different animals, where they live, and how they survive in nature.",
    category: "Science",
    learningArea: "Biology"
  },
  {
    id: 21,
    text: "I find it fascinating to learn how my body works and what I can do to stay healthy.",
    category: "Science",
    learningArea: "Human Biology"
  },
  {
    id: 22,
    text: "I love learning about planets, stars, and everything amazing that exists in space.",
    category: "Science",
    learningArea: "Astronomy"
  },
  {
    id: 23,
    text: "I enjoy mixing different substances safely and watching what new things happen in experiments.",
    category: "Science",
    learningArea: "Chemistry"
  },
  {
    id: 24,
    text: "I like learning about how things move, what forces make them work, and different types of energy.",
    category: "Science",
    learningArea: "Physics"
  },
  {
    id: 25,
    text: "I enjoy studying weather patterns and learning about different climates around the world.",
    category: "Science",
    learningArea: "Weather & Climate"
  },
  {
    id: 26,
    text: "I care about protecting our environment and want to learn how to help take care of nature.",
    category: "Science",
    learningArea: "Environmental Science"
  },

  // Social Studies (6 questions) - Updated for better understanding
  {
    id: 27,
    text: "I enjoy learning about Kenya's history and the amazing stories of our people from long ago.",
    category: "Social Studies",
    learningArea: "History"
  },
  {
    id: 28,
    text: "I like looking at maps and learning about different places, countries, and continents in the world.",
    category: "Social Studies",
    learningArea: "Geography"
  },
  {
    id: 29,
    text: "I enjoy learning about how our government works and how laws are made to help people.",
    category: "Social Studies",
    learningArea: "Civics"
  },
  {
    id: 30,
    text: "I like learning about different communities in Kenya and their special traditions and customs.",
    category: "Social Studies",
    learningArea: "Cultural Studies"
  },
  {
    id: 31,
    text: "I enjoy learning about buying, selling, businesses, and how money works in our country.",
    category: "Social Studies",
    learningArea: "Economics"
  },
  {
    id: 32,
    text: "I like learning about my rights and responsibilities as a Kenyan citizen and community member.",
    category: "Social Studies",
    learningArea: "Citizenship"
  },

  // Religious Education (3 questions) - Updated for better understanding
  {
    id: 33,
    text: "I enjoy learning about what's right and wrong, and how to be a good person who helps others.",
    category: "Religious Education",
    learningArea: "Moral Education"
  },
  {
    id: 34,
    text: "I like participating in religious activities and spiritual practices that make me feel peaceful.",
    category: "Religious Education",
    learningArea: "Spiritual Development"
  },
  {
    id: 35,
    text: "I enjoy learning about different religions and understanding how different people worship and pray.",
    category: "Religious Education",
    learningArea: "Comparative Religion"
  },

  // Creative Arts (3 questions) - Updated for better understanding
  {
    id: 36,
    text: "I love drawing, painting, and creating beautiful artwork that expresses my ideas and feelings.",
    category: "Creative Arts",
    learningArea: "Visual Arts"
  },
  {
    id: 37,
    text: "I enjoy singing, playing musical instruments, or making up my own songs and melodies.",
    category: "Creative Arts",
    learningArea: "Music"
  },
  {
    id: 38,
    text: "I love acting in plays, doing drama activities, and performing on stage for other people.",
    category: "Creative Arts",
    learningArea: "Performing Arts"
  },

  // Physical & Health Education (2 questions) - Updated for better understanding
  {
    id: 39,
    text: "I enjoy playing sports and doing physical activities that keep my body strong and healthy.",
    category: "Physical Education",
    learningArea: "Sports & Fitness"
  },
  {
    id: 40,
    text: "I like learning about healthy eating and different ways to take good care of my body.",
    category: "Health Education",
    learningArea: "Health & Wellness"
  }
];

export const cbcCategories = [
  "Mathematics",
  "English", 
  "Kiswahili",
  "Science",
  "Social Studies",
  "Religious Education",
  "Creative Arts",
  "Physical Education",
  "Health Education"
];
