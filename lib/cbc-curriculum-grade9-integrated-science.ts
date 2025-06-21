/**
 * Grade 9 Integrated Science Curriculum - 2024 Version
 * Kenya Institute of Curriculum Development (KICD)
 *
 * This file contains the complete curriculum structure for Grade 9 Integrated Science
 * as per the official KICD curriculum design document published in 2024.
 */

export interface Grade9IntegratedScienceStrand {
  id: string
  name: string
  description: string
  subStrands: Grade9SubStrand[]
  totalLessons: number
}

export interface Grade9SubStrand {
  id: string
  name: string
  lessons: number
  specificLearningOutcomes: string[]
  suggestedLearningExperiences: string[]
  keyInquiryQuestions: string[]
  coreCompetencies: string[]
  values: string[]
  pertinentIssues: string[]
  linksToOtherSubjects: string[]
  assessmentCriteria: AssessmentRubric[]
}

export interface AssessmentRubric {
  indicator: string
  exceedsExpectation: string
  meetsExpectation: string
  approachesExpectation: string
  belowExpectation: string
}

export const GRADE_9_INTEGRATED_SCIENCE_CURRICULUM: Grade9IntegratedScienceStrand[] = [
  {
    id: "strand-1-mixtures-elements-compounds",
    name: "Mixtures, Elements and Compounds",
    description: "Understanding atomic structure, metals, alloys, and water properties",
    totalLessons: 44,
    subStrands: [
      {
        id: "structure-of-atom",
        name: "Structure of the Atom",
        lessons: 14,
        specificLearningOutcomes: [
          "Describe the structure of the atom",
          "Determine the mass number of elements",
          "Draw the electron arrangement in atoms using dot or cross diagrams",
          "Classify elements into metals and non-metals",
          "Show interest in classifying elements into metals and non-metals",
        ],
        suggestedLearningExperiences: [
          "Discuss the meaning of the atom and illustrate its structure",
          "Work out the mass number of an element with peers",
          "Write the electron arrangements of elements",
          "Illustrate the electron arrangement in atoms using dot or cross diagrams collaboratively",
          "Use electron arrangement to classify elements into metals and non-metals",
          "Use digital media to observe animations or videos on the structure of an atom and electron arrangement",
          "Project: model the atomic structure of selected elements using locally available materials",
        ],
        keyInquiryQuestions: ["How is the structure of the atom important?"],
        coreCompetencies: [
          "Communication and collaboration: Speaking clearly and effectively while discussing atomic structure",
          "Creativity and imagination: Experimenting and creating models of atoms from locally available materials",
        ],
        values: [
          "Unity: Respecting others' opinions during group discussions",
          "Integrity: Displaying honesty while using digital devices to search for information",
        ],
        pertinentIssues: [
          "Socio-economic issues (cyber security): Observing cyber security measures when using digital media",
        ],
        linksToOtherSubjects: ["Mathematics: Working out the mass number of elements"],
        assessmentCriteria: [
          {
            indicator: "Ability to describe the structure of the atom",
            exceedsExpectation: "Describes the structure of the atom comprehensively",
            meetsExpectation: "Describes the structure of the atom sufficiently",
            approachesExpectation: "Describes the structure of the atom partially",
            belowExpectation: "Describes the structure of the atom superficially",
          },
          {
            indicator: "Ability to classify elements into metals and non-metals",
            exceedsExpectation: "Classifies all elements into metals and nonmetals",
            meetsExpectation: "Classifies most elements into metals and nonmetals",
            approachesExpectation: "Classifies some elements into metals and nonmetals",
            belowExpectation: "Classifies a few elements into metals and nonmetals with prompts",
          },
        ],
      },
      {
        id: "metals-and-alloys",
        name: "Metals and Alloys",
        lessons: 16,
        specificLearningOutcomes: [
          "Describe the physical properties of metals",
          "Describe the composition of alloys",
          "Identify the uses of metals and alloys in day to day life",
          "Explain the effects of rusting of metals",
          "Appreciate the importance of common alloys in day to day life",
        ],
        suggestedLearningExperiences: [
          "Identify metals and non-metals in their environment",
          "Carry out experiments to demonstrate the physical properties of metals",
          "Discuss the composition of common alloys with peers",
          "Identify items from the locality that have been made from alloys",
          "Discuss the uses of common metals and alloys",
          "Discuss causes, effects and ways of controlling rusting of metals",
          "Use digital or print media to search for information on physical properties of metals and common alloys",
        ],
        keyInquiryQuestions: ["How are alloys important in day-day life?"],
        coreCompetencies: [
          "Communication and collaboration: Working with peers to discuss composition of common alloys",
          "Digital literacy: Interacting with digital technology to search for information on metals and alloys",
        ],
        values: [
          "Respect: Accommodating others' opinions during group discussions",
          "Peace: Avoiding harming others when carrying out experiments",
        ],
        pertinentIssues: ["Financial Literacy: Appreciating the importance of metals and alloys in day to day life"],
        linksToOtherSubjects: [
          "Pre-Technical Studies: Learning about common metals and alloys used in workshops",
          "Agriculture and Nutrition: Using utensils made from metals and their alloys",
        ],
        assessmentCriteria: [
          {
            indicator: "Ability to outline uses of metals and alloys",
            exceedsExpectation: "Outlines uses of all metals and alloys correctly",
            meetsExpectation: "Outlines uses of most metals and alloys correctly",
            approachesExpectation: "Outlines uses of some metals and alloys correctly",
            belowExpectation: "Outlines uses of a few metals and alloys correctly with prompts",
          },
          {
            indicator: "Ability to explain the effect of rusting on metals",
            exceedsExpectation: "Explains the effect of rusting on metals in details comprehensively",
            meetsExpectation: "Explains the effect of rusting on metals sufficiently",
            approachesExpectation: "Explains the effect of rusting on metals cursory",
            belowExpectation: "Explains the effect of rusting on metals superficially",
          },
        ],
      },
      {
        id: "water-hardness",
        name: "Water Hardness",
        lessons: 14,
        specificLearningOutcomes: [
          "Describe the physical properties of water",
          "Distinguish between hard and soft water in nature",
          "Apply methods of softening hard water in day to day life",
          "Outline advantages and disadvantages of hard and soft water",
          "Appreciate the applications of soft and hard water in day to day life",
        ],
        suggestedLearningExperiences: [
          "Collect and observe water from different sources, compare them in terms of appearance, odour, taste and boiling point",
          "Carry out activities to compare the lathering abilities of various samples of unboiled water with soap",
          "Group the samples into hard and soft water",
          "Explain the meaning of hard and soft water",
          "Discuss the advantages and disadvantages of soft and hard water",
          "Perform various activities for softening hard water",
          "Use digital or print media to search for information on methods of softening hard water",
        ],
        keyInquiryQuestions: [
          "What is the importance of different types of water?",
          "Why is hard water preferred for drinking?",
        ],
        coreCompetencies: [
          "Learning to learn: Reflecting on experiences while applying methods of softening hard water",
          "Critical thinking and problem solving: Developing interpretation skills relating lathering ability to water hardness",
        ],
        values: [
          "Responsibility: Playing a role when carrying out experiments on softening hard water",
          "Respect: Giving each other opportunity to air views during group discussions",
        ],
        pertinentIssues: ["Financial literacy: Practicing how to save on soap by using soft water for laundry"],
        linksToOtherSubjects: ["Agriculture and Nutrition: Using soft water in laundry work"],
        assessmentCriteria: [
          {
            indicator: "Ability to outline advantages and disadvantages of hard and soft water",
            exceedsExpectation: "Outlines advantages and disadvantages of hard and soft water in details",
            meetsExpectation: "Outlines advantages and disadvantages of hard and soft water",
            approachesExpectation: "Outlines advantages and disadvantages of hard and soft water partially",
            belowExpectation: "Outlines advantages and disadvantages of hard and soft water superficially",
          },
          {
            indicator: "Ability to apply different methods to soften temporary hard water",
            exceedsExpectation: "Applies all appropriate methods to soften temporary hard water",
            meetsExpectation: "Applies appropriate methods to soften temporary hard water",
            approachesExpectation: "Applies an appropriate method to soften temporary hard water",
            belowExpectation: "Applies an inappropriate method to soften temporary hard water",
          },
        ],
      },
    ],
  },
  {
    id: "strand-2-living-things-environment",
    name: "Living Things and Their Environment",
    description: "Understanding nutrition, reproduction, and interdependence in living organisms",
    totalLessons: 72,
    subStrands: [
      {
        id: "nutrition-in-plants",
        name: "Nutrition in Plants",
        lessons: 18,
        specificLearningOutcomes: [
          "Identify external and internal parts of a leaf",
          "Explain adaptations of the leaf to photosynthesis",
          "Describe the process of photosynthesis",
          "Investigate the conditions necessary for photosynthesis",
          "Appreciate the process of photosynthesis in nature",
        ],
        suggestedLearningExperiences: [
          "Use a hand lens to observe fresh leaves of plants, draw and label the external parts",
          "Use print or non-print media to search for information on the internal structure of the leaf",
          "Discuss the adaptations of a leaf in relation to their roles in photosynthesis",
          "Observe the structure of the chloroplast on charts/photomicrographs",
          "Use print or non-print media to search for information on the process and products of photosynthesis",
          "Set-up experiments to show that light, carbon (IV) oxide and chlorophyll are necessary for photosynthesis",
        ],
        keyInquiryQuestions: ["What is the importance of photosynthesis in nature?"],
        coreCompetencies: [
          "Learning to learn: Searching for information on photosynthesis and sharing with peers",
          "Self-efficacy: Successfully carrying out experiments on conditions necessary for photosynthesis",
        ],
        values: [
          "Social justice: Sharing resources equitably while carrying out experiments",
          "Integrity: Displaying honesty while carrying out experiments and presenting results",
        ],
        pertinentIssues: [
          "Environmental conservation: Collecting only the required number of leaves to observe structure",
          "Safety: Observing safety precautions while carrying out experiments on photosynthesis",
        ],
        linksToOtherSubjects: ["Agriculture and Nutrition: Information on photosynthesis linked to food production"],
        assessmentCriteria: [
          {
            indicator: "Investigating the conditions necessary for photosynthesis",
            exceedsExpectation: "Investigates the conditions necessary for photosynthesis systematically",
            meetsExpectation: "Investigates the conditions necessary for photosynthesis",
            approachesExpectation: "Investigates the conditions necessary for photosynthesis inconclusively",
            belowExpectation: "Investigates the conditions necessary for photosynthesis inconclusively with prompts",
          },
        ],
      },
      {
        id: "nutrition-in-animals",
        name: "Nutrition in Animals",
        lessons: 16,
        specificLearningOutcomes: [
          "Outline modes of nutrition in animals",
          "Describe the structure and functions of different types of teeth",
          "Classify animals based on their dentition",
          "Describe the process of digestion in human beings",
          "Appreciate that animals have varied modes of nutrition",
        ],
        suggestedLearningExperiences: [
          "Use print or non-print media to search for information on modes of nutrition in animals",
          "Use specimens/charts/models/digital media to identify and draw different types of teeth",
          "Collaboratively discuss the functions of different types of teeth",
          "Use specimens/charts/models/digital media to study dentition in different animals",
          "Use print or non-print media to search for information on the process of digestion in human beings",
        ],
        keyInquiryQuestions: ["How do different animals feed?", "How is food digested in the human body?"],
        coreCompetencies: ["Communication and Collaboration: Listening to others while discussing digestion process"],
        values: [
          "Unity: Collaborating with others while studying dentition in different animals",
          "Respect: Appreciating others' opinions while discussing different modes of nutrition",
        ],
        pertinentIssues: ["Animal welfare: Caring for animals while studying different types of dentition"],
        linksToOtherSubjects: [
          "Agriculture and Nutrition: Information on nutrition in animals linked to feeding of animals",
        ],
        assessmentCriteria: [
          {
            indicator: "Describing the process of digestion in human beings",
            exceedsExpectation: "Describes the process of digestion in human beings systematically and extensively",
            meetsExpectation: "Describes the process of digestion in human beings",
            approachesExpectation: "Describes the process of digestion in human beings simplistically",
            belowExpectation: "Describes the process of digestion in human beings simplistically with prompts",
          },
        ],
      },
      {
        id: "reproduction-in-plants",
        name: "Reproduction in Plants",
        lessons: 20,
        specificLearningOutcomes: [
          "Outline functions of parts of a flower",
          "Describe pollination in plants",
          "Outline the adaptations of flowers to wind and insect pollination",
          "Explain fertilisation and fruit formation in flowering plants",
          "Categorise fruits and seeds based on their mode of dispersal",
          "Recognize the role of flowers in nature",
        ],
        suggestedLearningExperiences: [
          "Collaboratively discuss the functions of parts of a flower",
          "Use print or non-print media to search for information on meaning and types of pollination",
          "Use print or non-print media to search for information on adaptations of flowers to wind and insect pollination",
          "Study samples of flowers to discuss their adaptations to agents of pollination",
          "Watch animations or take an excursion to observe pollinating agents in action",
          "Use print and non-print media to search for information on fertilisation and fruit formation",
          "Observe different fruits and seeds from their locality and categorise them based on mode of dispersal",
        ],
        keyInquiryQuestions: ["How does reproduction in plants occur?"],
        coreCompetencies: [
          "Learning to learn: Searching for information on fertilisation and fruit formation",
          "Digital literacy: Using digital devices to search for information on agrochemicals effects",
        ],
        values: [
          "Social Justice: Collaboratively studying illustrations/animations on fertilisation and fruit formation",
        ],
        pertinentIssues: [
          "Biodiversity: Searching for information on the effect of agrochemicals on pollinating agents",
          "Safety and Security: Taking precautions while collecting flowers, fruits and seeds",
        ],
        linksToOtherSubjects: [
          "Agriculture and Nutrition: Information on fertilisation and fruit formation linked to crop production",
        ],
        assessmentCriteria: [
          {
            indicator: "Explaining pollination, fertilisation and fruit formation in flowering plants",
            exceedsExpectation:
              "Explains pollination, fertilisation and fruit formation in flowering plants comprehensively",
            meetsExpectation: "Explains pollination, fertilisation and fruit formation in flowering plants",
            approachesExpectation:
              "Explains pollination, fertilisation and fruit formation in flowering plants partially",
            belowExpectation:
              "Explains pollination, fertilisation and fruit formation in flowering plants partially with prompts",
          },
          {
            indicator: "Categorising fruits and seeds based on their mode of dispersal",
            exceedsExpectation: "Categorises fruits and seeds based on their mode of dispersal precisely",
            meetsExpectation: "Categorises fruits and seeds based on their mode of dispersal",
            approachesExpectation: "Categorises fruits and seeds based on their mode of dispersal partially",
            belowExpectation: "Categorises fruits and seeds based on their mode of dispersal partially with prompts",
          },
        ],
      },
      {
        id: "interdependence-of-life",
        name: "The Interdependence of Life",
        lessons: 18,
        specificLearningOutcomes: [
          "Explain the biotic and abiotic factors of the environment",
          "Construct food chains and food webs in the environment",
          "Describe the effect of human activities on the environment",
          "Appreciate the interdependence between living and non-living factors of the environment",
        ],
        suggestedLearningExperiences: [
          "Use print and non-print material to search for information biotic interrelationships",
          "Investigate the interrelationships between biotic factors of the environment in their locality",
          "Observe videos or animations showing the interrelationships between biotic factors",
          "Use print and non-print media to search for information on interrelationships between organisms in Kenya national parks",
          "Discuss the effect of abiotic factors on living organisms",
          "Search for information on the effect of human activities on the environment",
          "Carry out activities to identify living organisms and construct food chains and food webs",
          "Discuss the role of decomposers in an ecosystem and their importance in recycling nutrients",
        ],
        keyInquiryQuestions: ["What is the role of living and non-living factors in environments?"],
        coreCompetencies: [
          "Citizenship: Developing a sense of responsibility to the nation while studying Kenya national parks",
          "Critical thinking and problem solving: Showing open-mindedness while investigating interrelationships",
        ],
        values: [
          "Patriotism: Developing love for the country while studying Kenya national parks and game reserves",
          "Peace: Showing respect for diversity and heritage while studying interdependence",
        ],
        pertinentIssues: [
          "Environmental conservation: Discussing the role of decomposers in ecosystem and nutrient recycling",
        ],
        linksToOtherSubjects: ["Agriculture and Nutrition: Information on decomposers linked to production of manure"],
        assessmentCriteria: [
          {
            indicator: "Constructing food chains and food webs in the environment",
            exceedsExpectation: "Construct food chains and food webs in the environment skillfully",
            meetsExpectation: "Construct food chains and food webs in the environment",
            approachesExpectation: "Construct food chains and food webs in the environment partially",
            belowExpectation: "Construct food chains and food webs in the environment sketchily",
          },
        ],
      },
    ],
  },
  {
    id: "strand-3-force-energy",
    name: "Force and Energy",
    description: "Understanding curved mirrors and wave properties and applications",
    totalLessons: 34,
    subStrands: [
      {
        id: "curved-mirrors",
        name: "Curved Mirrors",
        lessons: 18,
        specificLearningOutcomes: [
          "Describe types of curved mirrors",
          "Draw ray diagrams to locate images formed by concave and convex mirrors",
          "Describe the characteristics of images formed by concave and convex mirrors",
          "Explain the uses of concave and convex mirrors in day to day life",
          "Appreciate the applications of curved mirrors in day to day life",
        ],
        suggestedLearningExperiences: [
          "Discuss the types of curved mirrors (concave, convex and parabolic surfaces)",
          "Discuss with peers the terms used in curved mirrors",
          "Carry out activities to locate position of images formed by concave and convex mirrors",
          "Illustrate image positions for various object positions in concave and convex mirrors",
          "Discuss the characteristics of images formed by curved mirrors",
          "Discuss the applications of concave and convex mirrors in day to day life",
          "Use digital or print media to explore more information on applications of curved mirrors",
        ],
        keyInquiryQuestions: ["How are curved mirrors used in day to day life?"],
        coreCompetencies: [
          "Self-efficacy: Exercising leadership skills while discussing characteristics of images",
          "Communication and Collaboration: Developing listening and writing skills while discussing curved mirror terms",
        ],
        values: [
          "Social justice: Exercising equity and according equal opportunity to group members",
          "Responsibility: Exercising excellence while illustrating image positions",
        ],
        pertinentIssues: [
          "Socio-economic issues: Relating concepts of reflection to safety and security in transport and surveillance",
        ],
        linksToOtherSubjects: [
          "Pre-technical studies: Relating concepts in curved mirrors to hairdressing and beauty therapy",
        ],
        assessmentCriteria: [
          {
            indicator: "Drawing ray diagrams to locate images formed by concave and convex mirrors",
            exceedsExpectation:
              "Draws ray diagrams to locate images formed by concave and convex mirrors correctly and systematically",
            meetsExpectation: "Draws ray diagrams to locate images formed by concave and convex mirrors correctly",
            approachesExpectation:
              "Draws ray diagrams to locate images formed by concave and convex mirrors, omitting some details",
            belowExpectation:
              "Draws ray diagrams to locate images formed by concave and convex mirrors omitting some details with prompts",
          },
          {
            indicator: "Describing the characteristics of images formed by concave and convex mirrors",
            exceedsExpectation:
              "Describes the characteristics of images formed by concave and convex mirrors correctly and consistently",
            meetsExpectation: "Describes the characteristics of images formed by concave and convex mirrors correctly",
            approachesExpectation:
              "Describes some characteristics of images formed by concave and convex mirrors correctly",
            belowExpectation:
              "Describes the characteristics of images formed by concave and convex mirrors with prompt",
          },
          {
            indicator: "Explaining the uses of concave and convex mirrors in day to day life",
            exceedsExpectation: "Explains the uses of concave and convex mirrors in day to day life extensively",
            meetsExpectation: "Explains the uses of concave and convex mirrors in day to day life sufficiently",
            approachesExpectation: "Correctly explains some uses of concave and convex mirrors in day to day life",
            belowExpectation: "With prompt, explains the uses of concave and convex mirrors in day to day life",
          },
        ],
      },
      {
        id: "waves",
        name: "Waves",
        lessons: 16,
        specificLearningOutcomes: [
          "Describe generation of waves in nature",
          "Classify waves as longitudinal and transverse",
          "Describe basic characteristic of waves in nature",
          "Describe remote sensing in relation to waves",
          "Describe applications of waves in day to day life",
          "Appreciate the applications of waves in day to day life",
        ],
        suggestedLearningExperiences: [
          "Brainstorm on the meaning of wave as used in science",
          "Carry out activities to demonstrate generation of waves in nature and classify them",
          "Carry out activities to demonstrate the parts of a wave",
          "Carry out activities in groups to demonstrate characteristics of waves",
          "Discuss remote sensing in relation to waves",
          "Use digital or print media to search for more information on relationship between remote sensing and waves",
          "Discuss the applications of waves in real life situations",
        ],
        keyInquiryQuestions: ["How are waves applied in our day to day life?"],
        coreCompetencies: [
          "Learning to learn: Doing investigations using digital or print media to search for information on remote sensing",
          "Creativity and Imagination: Experimenting with various activities to demonstrate generation of waves",
        ],
        values: [
          "Respect: Exercising open mindedness while embracing discussions on different ideas on wave applications",
          "Peace: Caring for others while carrying out activities in groups to demonstrate wave characteristics",
        ],
        pertinentIssues: [
          "Learner support programs: Exposure to career guidance services on various opportunities in remote sensing",
        ],
        linksToOtherSubjects: [
          "Creative Arts and Sports: Relating concepts of waves to transmission of sound from musical instruments",
        ],
        assessmentCriteria: [
          {
            indicator: "Describing generation of waves in nature",
            exceedsExpectation: "Describes generation of waves in nature comprehensively",
            meetsExpectation: "Describes generation of waves in nature correctly",
            approachesExpectation: "Describes generation of waves in nature partially",
            belowExpectation: "Describes the generation of waves in nature partially with prompt",
          },
          {
            indicator: "Ability to describe basic characteristics of waves in nature",
            exceedsExpectation: "Describes basic characteristics of waves in nature extensively",
            meetsExpectation: "Describes basic characteristics of waves in nature sufficiently",
            approachesExpectation: "Describes basic characteristics of waves in nature partially",
            belowExpectation: "Describes basic characteristics of waves in nature partially with prompt",
          },
          {
            indicator: "Ability to describe remote sensing in relation to waves",
            exceedsExpectation: "Describes remote sensing in relation to waves comprehensively",
            meetsExpectation: "Describes remote sensing in relation to waves correctly",
            approachesExpectation: "Describes remote sensing in relation to waves partially",
            belowExpectation: "Describes remote sensing in relation to waves partially with prompt",
          },
          {
            indicator: "Ability to describe applications of waves in day to day life",
            exceedsExpectation: "Describes applications of waves in day to day life extensively",
            meetsExpectation: "Describes applications of waves in day to day life sufficiently",
            approachesExpectation: "Describes some applications of waves in day to day life",
            belowExpectation: "Describes some applications of waves in day to day life with prompt",
          },
        ],
      },
    ],
  },
]

// Junior School Learning Outcomes
export const JUNIOR_SCHOOL_LEARNING_OUTCOMES = [
  "Apply literacy, numeracy and logical thinking skills for appropriate self-expression",
  "Communicate effectively, verbally and non-verbally, in diverse contexts",
  "Demonstrate social skills, spiritual and moral values for peaceful co-existence",
  "Explore, manipulate, manage and conserve the environment effectively for learning and sustainable development",
  "Practise relevant hygiene, sanitation and nutrition skills to promote health",
  "Demonstrate ethical behaviour and exhibit good citizenship as a civic responsibility",
  "Appreciate the country's rich and diverse cultural heritage for harmonious co-existence",
  "Manage pertinent and contemporary issues in society effectively",
  "Apply digital literacy skills for communication and learning",
]

// General Learning Outcomes for Integrated Science
export const INTEGRATED_SCIENCE_GENERAL_OUTCOMES = [
  "Acquire scientific knowledge, skills, values and attitudes to make informed choices on career pathways at Senior School",
  "Select, improvise and safely use basic scientific tools, apparatus, materials and chemicals effectively in everyday life",
  "Explore, manipulate, manage and conserve the environment for learning and sustainable development",
  "Practise relevant hygiene, sanitation and nutrition skills to promote good health",
  "Apply the understanding of body systems with a view to promote and maintain good health",
  "Develop capacity for scientific inquiry and problem solving in different situations",
  "Appreciate the use of scientific knowledge, skills, principles and practices in everyday life",
  "Apply acquired scientific knowledge, skills, principles and practices in everyday life",
]

// Junior School Lesson Allocation
export const JUNIOR_SCHOOL_LESSON_ALLOCATION = [
  { learningArea: "English", lessons: 5 },
  { learningArea: "Kiswahili / Kenya Sign Language", lessons: 4 },
  { learningArea: "Mathematics", lessons: 5 },
  { learningArea: "Religious Education", lessons: 4 },
  { learningArea: "Social Studies", lessons: 4 },
  { learningArea: "Integrated Science", lessons: 5 },
  { learningArea: "Pre-Technical Studies", lessons: 4 },
  { learningArea: "Agriculture and Nutrition", lessons: 4 },
  { learningArea: "Creative Arts and Sports", lessons: 5 },
  { learningArea: "Pastoral /Religious Instructional Program", lessons: 1 },
]

// Community Service Learning (CSL) Milestones
export const CSL_MILESTONES = [
  {
    milestone: 1,
    name: "Problem Identification",
    description:
      "Learners study their community to understand the challenges faced and their effects on community members",
    challenges: [
      "Environmental degradation",
      "Lifestyle diseases, Communicable and non-communicable diseases",
      "Poverty",
      "Violence and conflicts in the community",
      "Food security issues",
    ],
  },
  {
    milestone: 2,
    name: "Designing a solution",
    description: "Learners create an intervention to address the challenge identified",
  },
  {
    milestone: 3,
    name: "Planning for the Project",
    description:
      "Learners share roles, create a list of activities to be undertaken, mobilise resources needed to create their intervention and set timelines for execution",
  },
  {
    milestone: 4,
    name: "Implementation",
    description: "The learners execute the project and keep evidence of work done",
  },
  {
    milestone: 5,
    name: "Showcasing /Exhibition and Report Writing",
    description:
      "Exhibitions involve showcasing learners' project items to the community and reflecting on the feedback. Learners write a report detailing their project activities and learnings from feedback",
  },
  {
    milestone: 6,
    name: "Reflection",
    description:
      "Learners review all project work to learn from the challenges faced. They link project work with academic concepts, noting how the concepts enabled them to do their project as well as how the project helped to deepen learning of the academic concepts",
  },
]

// Assessment Methods
export const ASSESSMENT_METHODS = [
  "Reflections",
  "Game Playing",
  "Pre-Post Testing",
  "Model Making",
  "Explorations",
  "Experiments",
  "Investigations",
  "Conventions, Conferences and Debates",
  "Teacher Observations",
  "Project",
  "Journals",
  "Portfolio",
  "Oral or Aural Questions",
  "Learner's Profile",
  "Written Tests",
  "Anecdotal Records",
]

// Learning Resources
export const LEARNING_RESOURCES = [
  "Laboratory Apparatus and Equipment",
  "Textbooks",
  "Models",
  "Digital media (Radio and TV education programmes, kenya education cloud and OERs)",
  "Print media (charts, pictures, journals, magazines)",
  "Digital Devices",
  "Software",
  "Recordings",
  "Resource persons",
]

// Non-Formal Activities
export const NON_FORMAL_ACTIVITIES = [
  "Visit the science historical sites",
  "Use digital devices to conduct scientific research",
  "Organising walks to have live learning experiences",
  "Developing simple guidelines on how to identify and solve some community problems",
  "Conducting science document analysis",
  "Participating in talks by resource persons on science concepts",
  "Participating in science clubs and societies",
  "Attending and Participating in Science and Engineering fairs",
  "Organising and participating in exchange programs",
  "Making oral presentations and demonstrations on science issues",
]

// Helper functions
export function getStrandById(strandId: string): Grade9IntegratedScienceStrand | undefined {
  return GRADE_9_INTEGRATED_SCIENCE_CURRICULUM.find((strand) => strand.id === strandId)
}

export function getSubStrandById(strandId: string, subStrandId: string): Grade9SubStrand | undefined {
  const strand = getStrandById(strandId)
  return strand?.subStrands.find((subStrand) => subStrand.id === subStrandId)
}

export function getTotalLessons(): number {
  return GRADE_9_INTEGRATED_SCIENCE_CURRICULUM.reduce((total, strand) => total + strand.totalLessons, 0)
}

export function getStrandSummary() {
  return GRADE_9_INTEGRATED_SCIENCE_CURRICULUM.map((strand) => ({
    name: strand.name,
    totalLessons: strand.totalLessons,
    subStrandCount: strand.subStrands.length,
  }))
}
