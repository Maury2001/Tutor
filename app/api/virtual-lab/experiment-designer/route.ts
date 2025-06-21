import { type NextRequest, NextResponse } from "next/server"

interface ExperimentDesignRequest {
  topic: string
  gradeLevel: string
  learningObjectives: string[]
  availableMaterials: string[]
  timeConstraints: string
  difficulty: "beginner" | "intermediate" | "advanced"
  cbcStrand?: string
  cbcSubStrand?: string
}

interface ExperimentStep {
  stepNumber: number
  title: string
  description: string
  materials: string[]
  safetyNotes: string[]
  expectedOutcome: string
  troubleshooting: string[]
}

interface ExperimentDesign {
  title: string
  description: string
  learningObjectives: string[]
  cbcAlignment: {
    strand: string
    subStrand: string
    specificOutcomes: string[]
  }
  materials: string[]
  safetyPrecautions: string[]
  steps: ExperimentStep[]
  assessmentCriteria: string[]
  extensions: string[]
  realWorldApplications: string[]
}

export async function POST(request: NextRequest) {
  try {
    const designRequest: ExperimentDesignRequest = await request.json()

    if (!designRequest.topic || !designRequest.gradeLevel) {
      return NextResponse.json({ error: "Topic and grade level are required" }, { status: 400 })
    }

    // Generate experiment design without external AI service
    const experimentDesign = generateExperimentDesign(designRequest)

    return NextResponse.json({
      success: true,
      experimentDesign,
      designId: `exp_${Date.now()}`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Experiment Designer Error:", error)
    return NextResponse.json({ error: "Failed to design experiment" }, { status: 500 })
  }
}

function generateExperimentDesign(request: ExperimentDesignRequest): ExperimentDesign {
  const {
    topic,
    gradeLevel,
    learningObjectives,
    availableMaterials,
    timeConstraints,
    difficulty,
    cbcStrand,
    cbcSubStrand,
  } = request

  // Generate topic-specific experiment design
  const topicLower = topic.toLowerCase()

  let experimentTitle = ""
  let description = ""
  let steps: ExperimentStep[] = []
  let materials: string[] = []
  let safetyPrecautions: string[] = []
  let assessmentCriteria: string[] = []
  let extensions: string[] = []
  let realWorldApplications: string[] = []

  // Cell Biology Experiments
  if (
    topicLower.includes("cell") ||
    topicLower.includes("microscopy") ||
    topicLower.includes("plant") ||
    topicLower.includes("animal")
  ) {
    experimentTitle = `${topic} Investigation - Virtual Microscopy Lab`
    description = `Explore cellular structures and compare different cell types using virtual microscopy tools aligned with CBC ${gradeLevel} curriculum.`

    materials = [
      "Virtual microscope interface",
      "Digital cell specimens (plant, animal, bacteria)",
      "Observation recording sheets",
      "Cell structure identification guide",
      "Magnification controls (10x, 40x, 100x)",
      ...availableMaterials,
    ]

    safetyPrecautions = [
      "Ensure stable internet connection for virtual lab access",
      "Follow proper virtual microscope handling procedures",
      "Record all observations accurately and systematically",
      "Report any technical issues to instructor immediately",
      "Maintain focus during detailed observations",
    ]

    steps = [
      {
        stepNumber: 1,
        title: "Virtual Microscope Setup",
        description: "Initialize the virtual microscope and familiarize yourself with the controls and interface.",
        materials: ["Virtual microscope interface", "User guide"],
        safetyNotes: ["Check all controls are working", "Ensure clear display quality"],
        expectedOutcome: "Microscope is ready for specimen observation",
        troubleshooting: ["Refresh browser if interface is slow", "Check internet connection stability"],
      },
      {
        stepNumber: 2,
        title: "Low Magnification Observation",
        description: "Start with 10x magnification to get an overview of the cell specimens.",
        materials: ["Digital specimens", "10x objective lens"],
        safetyNotes: ["Start with lowest magnification", "Focus carefully to avoid eye strain"],
        expectedOutcome: "General cell shape and size are visible",
        troubleshooting: ["Adjust brightness if image is too dark", "Use fine focus controls"],
      },
      {
        stepNumber: 3,
        title: "Detailed Structure Analysis",
        description: "Switch to higher magnifications (40x, 100x) to observe cellular organelles and structures.",
        materials: ["40x and 100x objectives", "Recording sheets"],
        safetyNotes: ["Change magnification gradually", "Record observations immediately"],
        expectedOutcome: "Cellular organelles are clearly visible and identifiable",
        troubleshooting: ["Re-focus when changing magnification", "Compare with reference images"],
      },
      {
        stepNumber: 4,
        title: "Comparative Analysis",
        description: "Compare plant and animal cells, noting similarities and differences in structure.",
        materials: ["Plant cell specimens", "Animal cell specimens", "Comparison chart"],
        safetyNotes: ["Use same magnification for fair comparison", "Note all observable differences"],
        expectedOutcome: "Clear understanding of plant vs animal cell differences",
        troubleshooting: ["Use side-by-side viewing if available", "Refer to identification guide"],
      },
      {
        stepNumber: 5,
        title: "Documentation and Analysis",
        description: "Create detailed drawings and analyze the function of observed structures.",
        materials: ["Drawing materials", "Analysis worksheets"],
        safetyNotes: ["Label all structures accurately", "Connect structure to function"],
        expectedOutcome: "Complete documentation with labeled diagrams and analysis",
        troubleshooting: ["Use reference materials for accurate labeling", "Ask for clarification if unsure"],
      },
    ]

    assessmentCriteria = [
      "Accurate identification of cellular structures",
      "Proper use of virtual microscopy tools",
      "Clear and detailed observational drawings",
      "Correct comparison of plant and animal cells",
      "Understanding of structure-function relationships",
    ]

    extensions = [
      "Investigate specialized cell types (nerve, muscle, blood)",
      "Explore bacterial cell structure and compare with eukaryotic cells",
      "Research how cell structure relates to organism function",
      "Create a digital presentation on cellular diversity",
    ]

    realWorldApplications = [
      "Medical diagnosis using microscopy in Kenyan hospitals",
      "Agricultural research for crop improvement",
      "Water quality testing for safe drinking water",
      "Food safety inspection in processing plants",
    ]
  }

  // Chemistry Experiments
  else if (
    topicLower.includes("atom") ||
    topicLower.includes("chemical") ||
    topicLower.includes("reaction") ||
    topicLower.includes("element")
  ) {
    experimentTitle = `${topic} Explorer - Virtual Chemistry Lab`
    description = `Investigate atomic structure and chemical reactions using interactive simulations aligned with CBC ${gradeLevel} curriculum.`

    materials = [
      "Virtual atom builder",
      "Periodic table interface",
      "Chemical reaction simulator",
      "Electron configuration tools",
      "Molecular modeling kit",
      ...availableMaterials,
    ]

    safetyPrecautions = [
      "Follow all virtual lab safety protocols",
      "Handle virtual chemicals according to safety guidelines",
      "Report any simulation errors immediately",
      "Maintain organized workspace during experiments",
      "Record all observations and data accurately",
    ]

    steps = generateChemistrySteps()
    assessmentCriteria = generateChemistryAssessment()
    extensions = generateChemistryExtensions()
    realWorldApplications = generateChemistryApplications()
  }

  // Physics Experiments
  else if (
    topicLower.includes("force") ||
    topicLower.includes("energy") ||
    topicLower.includes("motion") ||
    topicLower.includes("wave")
  ) {
    experimentTitle = `${topic} Investigation - Virtual Physics Lab`
    description = `Explore physical phenomena and laws using interactive simulations aligned with CBC ${gradeLevel} curriculum.`

    materials = [
      "Virtual physics simulator",
      "Force measurement tools",
      "Energy visualization interface",
      "Motion tracking system",
      "Data collection software",
      ...availableMaterials,
    ]

    safetyPrecautions = [
      "Follow virtual lab safety procedures",
      "Use measurement tools correctly",
      "Record data systematically",
      "Report technical issues promptly",
      "Maintain focus during experiments",
    ]

    steps = generatePhysicsSteps()
    assessmentCriteria = generatePhysicsAssessment()
    extensions = generatePhysicsExtensions()
    realWorldApplications = generatePhysicsApplications()
  }

  // Default General Science Experiment
  else {
    experimentTitle = `${topic} Investigation - Virtual Science Lab`
    description = `Explore ${topic} concepts through hands-on virtual experimentation aligned with CBC ${gradeLevel} curriculum.`

    materials = [
      "Virtual laboratory interface",
      "Digital measurement tools",
      "Observation recording sheets",
      "Data analysis software",
      "Reference materials",
      ...availableMaterials,
    ]

    safetyPrecautions = [
      "Follow all virtual lab safety protocols",
      "Use tools and equipment properly",
      "Record observations accurately",
      "Report any issues immediately",
      "Maintain organized workspace",
    ]

    steps = generateGeneralSteps(topic)
    assessmentCriteria = generateGeneralAssessment()
    extensions = generateGeneralExtensions(topic)
    realWorldApplications = generateGeneralApplications(topic)
  }

  return {
    title: experimentTitle,
    description,
    learningObjectives:
      learningObjectives.length > 0
        ? learningObjectives
        : [
            `Understand key concepts related to ${topic}`,
            `Develop scientific inquiry and observation skills`,
            `Apply knowledge to solve real-world problems`,
            `Demonstrate understanding through practical application`,
          ],
    cbcAlignment: {
      strand: cbcStrand || determineStrand(gradeLevel, topic),
      subStrand: cbcSubStrand || determineSubStrand(topic),
      specificOutcomes: [
        "Develop scientific inquiry skills",
        "Apply knowledge to solve problems",
        "Demonstrate understanding through practical application",
        "Connect learning to real-world contexts",
      ],
    },
    materials,
    safetyPrecautions,
    steps,
    assessmentCriteria,
    extensions,
    realWorldApplications,
  }
}

function generateChemistrySteps(): ExperimentStep[] {
  return [
    {
      stepNumber: 1,
      title: "Atomic Structure Exploration",
      description: "Build atoms of different elements and observe their structure.",
      materials: ["Virtual atom builder", "Periodic table"],
      safetyNotes: ["Start with simple atoms", "Follow electron filling rules"],
      expectedOutcome: "Understanding of atomic structure and electron arrangement",
      troubleshooting: ["Check electron count matches atomic number", "Verify shell filling order"],
    },
    {
      stepNumber: 2,
      title: "Chemical Bonding Investigation",
      description: "Explore how atoms bond to form compounds.",
      materials: ["Bonding simulator", "Molecular models"],
      safetyNotes: ["Understand electronegativity differences", "Follow bonding rules"],
      expectedOutcome: "Knowledge of ionic and covalent bonding",
      troubleshooting: ["Check valence electrons", "Verify bond types"],
    },
    {
      stepNumber: 3,
      title: "Chemical Reaction Simulation",
      description: "Observe and analyze chemical reactions virtually.",
      materials: ["Reaction simulator", "Equation balancer"],
      safetyNotes: ["Balance equations correctly", "Observe conservation of mass"],
      expectedOutcome: "Understanding of chemical reactions and conservation laws",
      troubleshooting: ["Check atom counts on both sides", "Verify reaction conditions"],
    },
  ]
}

function generatePhysicsSteps(): ExperimentStep[] {
  return [
    {
      stepNumber: 1,
      title: "Force and Motion Analysis",
      description: "Investigate the relationship between force, mass, and acceleration.",
      materials: ["Force simulator", "Motion tracker"],
      safetyNotes: ["Apply forces gradually", "Measure accurately"],
      expectedOutcome: "Understanding of Newton's laws of motion",
      troubleshooting: ["Check force directions", "Verify mass values"],
    },
    {
      stepNumber: 2,
      title: "Energy Transformation Study",
      description: "Explore different forms of energy and their transformations.",
      materials: ["Energy simulator", "Measurement tools"],
      safetyNotes: ["Track energy changes", "Apply conservation principles"],
      expectedOutcome: "Knowledge of energy conservation and transformation",
      troubleshooting: ["Account for all energy forms", "Check calculation accuracy"],
    },
  ]
}

function generateGeneralSteps(topic: string): ExperimentStep[] {
  return [
    {
      stepNumber: 1,
      title: "Initial Observation and Setup",
      description: `Prepare the virtual environment and make initial observations related to ${topic}.`,
      materials: ["Virtual lab interface", "Observation tools"],
      safetyNotes: ["Follow setup procedures", "Record initial conditions"],
      expectedOutcome: "Proper experimental setup and baseline observations",
      troubleshooting: ["Check all tools are working", "Verify initial conditions"],
    },
    {
      stepNumber: 2,
      title: "Data Collection and Analysis",
      description: `Collect relevant data and analyze patterns related to ${topic}.`,
      materials: ["Data collection tools", "Analysis software"],
      safetyNotes: ["Record data accurately", "Look for patterns"],
      expectedOutcome: "Systematic data collection and initial analysis",
      troubleshooting: ["Double-check measurements", "Look for trends"],
    },
    {
      stepNumber: 3,
      title: "Conclusion and Application",
      description: `Draw conclusions and connect findings to real-world applications of ${topic}.`,
      materials: ["Analysis worksheets", "Reference materials"],
      safetyNotes: ["Base conclusions on evidence", "Consider limitations"],
      expectedOutcome: "Valid conclusions and real-world connections",
      troubleshooting: ["Review all data", "Consider alternative explanations"],
    },
  ]
}

function generateChemistryAssessment(): string[] {
  return [
    "Accurate construction of atomic models",
    "Correct identification of chemical bonds",
    "Proper balancing of chemical equations",
    "Understanding of periodic trends",
    "Application of chemical principles",
  ]
}

function generatePhysicsAssessment(): string[] {
  return [
    "Correct application of physics laws",
    "Accurate measurement and calculation",
    "Understanding of force and motion relationships",
    "Proper analysis of energy transformations",
    "Connection to real-world phenomena",
  ]
}

function generateGeneralAssessment(): string[] {
  return [
    "Demonstrates understanding of key concepts",
    "Follows experimental procedures accurately",
    "Records observations systematically",
    "Draws valid conclusions from data",
    "Connects findings to real-world applications",
  ]
}

function generateChemistryExtensions(): string[] {
  return [
    "Investigate advanced chemical reactions",
    "Explore industrial chemistry applications",
    "Research green chemistry principles",
    "Study chemical processes in Kenya's industries",
  ]
}

function generatePhysicsExtensions(): string[] {
  return [
    "Explore advanced physics concepts",
    "Investigate renewable energy applications",
    "Study physics in Kenyan infrastructure",
    "Research modern physics applications",
  ]
}

function generateGeneralExtensions(topic: string): string[] {
  return [
    `Investigate advanced aspects of ${topic}`,
    `Research current developments in ${topic}`,
    `Explore applications in Kenyan context`,
    `Design follow-up experiments`,
  ]
}

function generateChemistryApplications(): string[] {
  return [
    "Pharmaceutical industry in Kenya",
    "Agricultural fertilizer production",
    "Water treatment and purification",
    "Food processing and preservation",
  ]
}

function generatePhysicsApplications(): string[] {
  return [
    "Renewable energy projects in Kenya",
    "Transportation and infrastructure",
    "Communication technology",
    "Medical imaging and treatment",
  ]
}

function generateGeneralApplications(topic: string): string[] {
  return [
    `${topic} applications in Kenyan industries`,
    `Environmental impact of ${topic}`,
    `${topic} in daily life and society`,
    `Future developments in ${topic} field`,
  ]
}

function determineStrand(gradeLevel: string, topic: string): string {
  const topicLower = topic.toLowerCase()

  if (gradeLevel.includes("4-6")) {
    return "Science and Technology"
  } else if (gradeLevel.includes("7-9")) {
    return "Integrated Science"
  } else {
    if (topicLower.includes("cell") || topicLower.includes("plant") || topicLower.includes("animal")) {
      return "Biology"
    } else if (topicLower.includes("atom") || topicLower.includes("chemical")) {
      return "Chemistry"
    } else if (topicLower.includes("force") || topicLower.includes("energy")) {
      return "Physics"
    }
    return "Science"
  }
}

function determineSubStrand(topic: string): string {
  const topicLower = topic.toLowerCase()

  if (topicLower.includes("cell") || topicLower.includes("plant") || topicLower.includes("animal")) {
    return "Living Things and Their Environment"
  } else if (topicLower.includes("atom") || topicLower.includes("chemical")) {
    return "Mixtures, Elements and Compounds"
  } else if (topicLower.includes("force") || topicLower.includes("energy")) {
    return "Force and Energy"
  } else if (topicLower.includes("space") || topicLower.includes("solar")) {
    return "The Universe"
  }

  return "Scientific Investigation"
}
