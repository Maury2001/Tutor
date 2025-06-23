
export const cbcSimulations = [
  {
    area: "Mathematics",
    grade: "Grade 7-9",
    simulations: [
      { 
        name: "Algebra Problem Solving", 
        description: "Interactive algebra scenarios with real-world applications", 
        duration: "15 min", 
        difficulty: "Medium",
        questions: [
          {
            text: "Solve for x: 2x + 5 = 15",
            type: "input",
            correctAnswer: "5",
            hint: "Subtract 5 from both sides, then divide by 2"
          },
          {
            text: "If y = 3x - 2, what is y when x = 4?",
            type: "input", 
            correctAnswer: "10",
            hint: "Substitute x = 4 into the equation"
          },
          {
            text: "Factor: x² + 7x + 12",
            type: "multiple-choice",
            options: ["(x + 3)(x + 4)", "(x + 2)(x + 6)", "(x + 1)(x + 12)", "(x + 7)(x + 12)"],
            correctAnswer: "(x + 3)(x + 4)",
            hint: "Find two numbers that multiply to 12 and add to 7"
          }
        ]
      },
      { 
        name: "Geometry Applications", 
        description: "Real-world geometry problems and spatial reasoning", 
        duration: "12 min", 
        difficulty: "Easy",
        questions: [
          {
            text: "Calculate the area of a rectangle with length 8m and width 5m",
            type: "input",
            correctAnswer: "40",
            hint: "Area = length × width"
          },
          {
            text: "Find the circumference of a circle with radius 7cm (use π = 3.14)",
            type: "input",
            correctAnswer: "43.96",
            hint: "Circumference = 2πr"
          },
          {
            text: "What is the volume of a cube with side length 4cm?",
            type: "input",
            correctAnswer: "64",
            hint: "Volume of cube = side³"
          }
        ]
      },
      { 
        name: "Statistics & Probability", 
        description: "Data analysis and probability scenarios", 
        duration: "18 min", 
        difficulty: "Hard",
        questions: [
          {
            text: "Calculate the mean of: 12, 15, 18, 22, 25",
            type: "input",
            correctAnswer: "18.4",
            hint: "Add all numbers and divide by how many there are"
          },
          {
            text: "What is the probability of rolling a 6 on a fair die?",
            type: "multiple-choice",
            options: ["1/6", "1/5", "1/4", "1/3"],
            correctAnswer: "1/6",
            hint: "There's 1 favorable outcome out of 6 possible outcomes"
          },
          {
            text: "A bag contains 3 red balls and 7 blue balls. What's the probability of drawing a red ball?",
            type: "multiple-choice",
            options: ["3/10", "3/7", "7/10", "1/3"],
            correctAnswer: "3/10",
            hint: "Probability = favorable outcomes / total outcomes"
          }
        ]
      }
    ]
  },
  {
    area: "Science & Technology",
    grade: "Grade 7-9",
    simulations: [
      { 
        name: "Chemistry Lab", 
        description: "Virtual chemistry experiments and reactions", 
        duration: "20 min", 
        difficulty: "Medium",
        questions: [
          {
            text: "What happens when you mix sodium and chlorine?",
            type: "multiple-choice",
            options: ["They form salt", "They explode", "Nothing happens", "They form water"],
            correctAnswer: "They form salt",
            hint: "Think about common table salt composition"
          },
          {
            text: "Balance this equation: H₂ + O₂ → H₂O",
            type: "input",
            correctAnswer: "2H₂ + O₂ → 2H₂O",
            hint: "Count atoms on both sides to balance"
          },
          {
            text: "What are the products of photosynthesis?",
            type: "multiple-choice",
            options: ["Glucose and oxygen", "Carbon dioxide and water", "Glucose and carbon dioxide", "Oxygen and water"],
            correctAnswer: "Glucose and oxygen",
            hint: "Plants produce food and release oxygen"
          }
        ]
      },
      { 
        name: "Physics Mechanics", 
        description: "Motion, forces, and energy simulations", 
        duration: "16 min", 
        difficulty: "Hard",
        questions: [
          {
            text: "Calculate force: F = ma, where m = 5kg and a = 2m/s²",
            type: "input",
            correctAnswer: "10",
            hint: "Force = mass × acceleration"
          },
          {
            text: "What is kinetic energy when m = 10kg and v = 5m/s?",
            type: "input",
            correctAnswer: "125",
            hint: "KE = ½mv²"
          },
          {
            text: "What does Newton's third law state?",
            type: "multiple-choice",
            options: ["For every action, there is an equal and opposite reaction", "Objects in motion stay in motion", "Force equals mass times acceleration", "Energy cannot be created or destroyed"],
            correctAnswer: "For every action, there is an equal and opposite reaction",
            hint: "Think about action and reaction pairs"
          }
        ]
      },
      { 
        name: "Biology Ecosystem", 
        description: "Ecosystem interactions and life processes", 
        duration: "14 min", 
        difficulty: "Easy",
        questions: [
          {
            text: "Name three components of an ecosystem",
            type: "input",
            correctAnswer: "producers, consumers, decomposers",
            hint: "Think about living things and their roles"
          },
          {
            text: "What is the role of producers in a food chain?",
            type: "multiple-choice",
            options: ["They make their own food", "They eat other animals", "They break down dead matter", "They control population"],
            correctAnswer: "They make their own food",
            hint: "Producers are usually plants"
          },
          {
            text: "How do plants make their own food?",
            type: "multiple-choice",
            options: ["Photosynthesis", "Respiration", "Digestion", "Absorption"],
            correctAnswer: "Photosynthesis",
            hint: "Plants use sunlight to make food"
          }
        ]
      }
    ]
  },
  {
    area: "Languages",
    grade: "Grade 7-9",
    simulations: [
      { 
        name: "English Communication", 
        description: "Interactive dialogue and comprehension scenarios", 
        duration: "10 min", 
        difficulty: "Easy",
        questions: [
          {
            text: "Choose the correct verb tense: 'I _____ to school yesterday'",
            type: "multiple-choice",
            options: ["went", "go", "going", "will go"],
            correctAnswer: "went",
            hint: "Yesterday indicates past tense"
          },
          {
            text: "What is the main idea of this paragraph: 'Dogs are loyal pets. They protect homes and provide companionship. Many families choose dogs as pets.'",
            type: "multiple-choice",
            options: ["Dogs are good pets", "Dogs protect homes", "Families like pets", "Dogs are loyal"],
            correctAnswer: "Dogs are good pets",
            hint: "Look for the overall message"
          },
          {
            text: "Write a formal letter greeting",
            type: "input",
            correctAnswer: "Dear Sir/Madam",
            hint: "Formal letters start with respectful greetings"
          }
        ]
      },
      { 
        name: "Kiswahili Mazungumzo", 
        description: "Conversational Kiswahili practice and grammar", 
        duration: "12 min", 
        difficulty: "Medium",
        questions: [
          {
            text: "Translate: 'Good morning' to Kiswahili",
            type: "input",
            correctAnswer: "Habari za asubuhi",
            hint: "Morning greetings in Kiswahili"
          },
          {
            text: "Complete: 'Mimi _____ mwalimu' (I am a teacher)",
            type: "multiple-choice",
            options: ["ni", "na", "wa", "ya"],
            correctAnswer: "ni",
            hint: "'Ni' means 'am' or 'is'"
          },
          {
            text: "Name five fruits in Kiswahili",
            type: "input",
            correctAnswer: "chungwa, ndizi, nanasi, papai, tikiti",
            hint: "Think of common fruits you know"
          }
        ]
      },
      { 
        name: "Creative Writing", 
        description: "Story composition and creative expression", 
        duration: "25 min", 
        difficulty: "Medium",
        questions: [
          {
            text: "Write an opening sentence for an adventure story",
            type: "input",
            correctAnswer: "The treasure map led them into the dark forest",
            hint: "Start with something exciting"
          },
          {
            text: "Describe a character using adjectives",
            type: "input",
            correctAnswer: "The tall, brave, intelligent girl",
            hint: "Use words that describe appearance and personality"
          },
          {
            text: "Create a dialogue between two friends",
            type: "input",
            correctAnswer: "Hello, how are you? I am fine, thank you",
            hint: "Show conversation with quotation marks"
          }
        ]
      }
    ]
  },
  {
    area: "Social Studies",
    grade: "Grade 7-9",
    simulations: [
      { 
        name: "Historical Timeline", 
        description: "Kenya's independence journey and key events", 
        duration: "15 min", 
        difficulty: "Medium",
        questions: [
          {
            text: "When did Kenya gain independence?",
            type: "input",
            correctAnswer: "1963",
            hint: "Kenya became independent in the 1960s"
          },
          {
            text: "Who was the first President of Kenya?",
            type: "multiple-choice",
            options: ["Jomo Kenyatta", "Daniel arap Moi", "Mwai Kibaki", "Uhuru Kenyatta"],
            correctAnswer: "Jomo Kenyatta",
            hint: "He was a key independence leader"
          },
          {
            text: "Name three freedom fighters in Kenya's history",
            type: "input",
            correctAnswer: "Jomo Kenyatta, Dedan Kimathi, Mekatilili wa Menza",
            hint: "Think of leaders who fought for independence"
          }
        ]
      },
      { 
        name: "Geography Mapping", 
        description: "East African geography and physical features", 
        duration: "13 min", 
        difficulty: "Easy",
        questions: [
          {
            text: "Name the highest mountain in Kenya",
            type: "input",
            correctAnswer: "Mount Kenya",
            hint: "The country is named after this mountain"
          },
          {
            text: "Which ocean borders Kenya to the east?",
            type: "multiple-choice",
            options: ["Indian Ocean", "Atlantic Ocean", "Pacific Ocean", "Arctic Ocean"],
            correctAnswer: "Indian Ocean",
            hint: "Kenya is on the eastern coast of Africa"
          },
          {
            text: "List three major rivers in Kenya",
            type: "input",
            correctAnswer: "Tana, Athi, Ewaso Ng'iro",
            hint: "Think of rivers that flow through Kenya"
          }
        ]
      },
      { 
        name: "Civic Education", 
        description: "Government structure and citizenship", 
        duration: "17 min", 
        difficulty: "Hard",
        questions: [
          {
            text: "Name the three arms of government",
            type: "input",
            correctAnswer: "Executive, Legislative, Judiciary",
            hint: "Think about who makes, executes, and interprets laws"
          },
          {
            text: "What are the duties of a good citizen?",
            type: "multiple-choice",
            options: ["Obey laws and pay taxes", "Only vote in elections", "Only respect others", "Only work hard"],
            correctAnswer: "Obey laws and pay taxes",
            hint: "Citizens have multiple responsibilities"
          },
          {
            text: "How is a president elected in Kenya?",
            type: "multiple-choice",
            options: ["Direct vote by citizens", "By parliament", "By governors", "By chiefs"],
            correctAnswer: "Direct vote by citizens",
            hint: "Citizens vote directly for their preferred candidate"
          }
        ]
      }
    ]
  }
];
