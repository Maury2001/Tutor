
export interface CBCPathway {
  code: string;
  name: string;
  track: string;
  subjects: string[];
  description: string;
  careers: string[];
  universities: string[];
  admissionRequirements: string[];
  jobMarketDemand: 'Very High' | 'High' | 'Moderate' | 'Growing';
  averageSalary: string;
}

export const cbcPathways: CBCPathway[] = [
  // STEM > PURE SCIENCES
  {
    code: "ST1017",
    name: "Advanced Mathematics, Home Science, Physics",
    track: "PURE SCIENCES",
    subjects: ["Advanced Mathematics", "Home Science", "Physics", "Chemistry", "Biology"],
    description: "Combines mathematical rigor with practical home science applications and physics principles",
    careers: ["Food Scientist", "Nutritionist", "Physics Teacher", "Research Scientist", "Quality Control Analyst"],
    universities: ["University of Nairobi", "JKUAT", "Kenyatta University"],
    admissionRequirements: ["KCSE Grade B+ overall", "B+ in Mathematics", "B+ in Physics"],
    jobMarketDemand: "High",
    averageSalary: "KSh 80,000 - 200,000"
  },
  {
    code: "ST1037",
    name: "Advanced Mathematics, General Science, Home Science",
    track: "PURE SCIENCES",
    subjects: ["Advanced Mathematics", "General Science", "Home Science", "Chemistry", "Biology"],
    description: "Broad scientific foundation with mathematical emphasis and practical applications",
    careers: ["Science Teacher", "Laboratory Technician", "Food Technologist", "Environmental Scientist"],
    universities: ["Moi University", "Egerton University", "Mount Kenya University"],
    admissionRequirements: ["KCSE Grade B overall", "B in Mathematics", "B in Sciences"],
    jobMarketDemand: "High",
    averageSalary: "KSh 60,000 - 150,000"
  },
  {
    code: "ST1029",
    name: "Advanced Mathematics, Computer Studies, General Science",
    track: "PURE SCIENCES",
    subjects: ["Advanced Mathematics", "Computer Studies", "General Science", "Physics", "Chemistry"],
    description: "Technology-focused pathway combining computational skills with scientific knowledge",
    careers: ["Software Developer", "Data Scientist", "ICT Teacher", "Systems Analyst", "Cybersecurity Specialist"],
    universities: ["Strathmore University", "USIU", "Daystar University"],
    admissionRequirements: ["KCSE Grade B+ overall", "A- in Mathematics", "B+ in Computer Studies"],
    jobMarketDemand: "Very High",
    averageSalary: "KSh 100,000 - 300,000"
  },
  {
    code: "ST1027",
    name: "Advanced Mathematics, Building & Construction, General Science",
    track: "PURE SCIENCES",
    subjects: ["Advanced Mathematics", "Building & Construction", "General Science", "Physics", "Chemistry"],
    description: "Engineering-oriented pathway focusing on construction and applied sciences",
    careers: ["Civil Engineer", "Architect", "Construction Manager", "Quantity Surveyor", "Structural Engineer"],
    universities: ["University of Nairobi", "JKUAT", "Technical University of Kenya"],
    admissionRequirements: ["KCSE Grade B+ overall", "A- in Mathematics", "B+ in Physics"],
    jobMarketDemand: "Very High",
    averageSalary: "KSh 120,000 - 350,000"
  },
  {
    code: "ST1025",
    name: "Advanced Mathematics, Chemistry, Physics",
    track: "PURE SCIENCES",
    subjects: ["Advanced Mathematics", "Chemistry", "Physics", "Biology", "Computer Studies"],
    description: "Core science pathway for medical and engineering careers",
    careers: ["Medical Doctor", "Pharmacist", "Chemical Engineer", "Physicist", "Biomedical Engineer"],
    universities: ["University of Nairobi", "Moi University", "JKUAT"],
    admissionRequirements: ["KCSE Grade A- overall", "A in Mathematics", "A- in Physics and Chemistry"],
    jobMarketDemand: "Very High",
    averageSalary: "KSh 200,000 - 500,000"
  },
  {
    code: "ST1020",
    name: "Advanced Mathematics, Biology, Business Studies",
    track: "PURE SCIENCES",
    subjects: ["Advanced Mathematics", "Biology", "Business Studies", "Chemistry", "Computer Studies"],
    description: "Interdisciplinary pathway combining life sciences with business applications",
    careers: ["Biotechnology Entrepreneur", "Pharmaceutical Sales", "Healthcare Administrator", "Biostatistician"],
    universities: ["Strathmore University", "USIU", "Kenyatta University"],
    admissionRequirements: ["KCSE Grade B+ overall", "B+ in Mathematics and Biology"],
    jobMarketDemand: "Growing",
    averageSalary: "KSh 90,000 - 250,000"
  },
  {
    code: "ST1003",
    name: "Advanced Mathematics, Biology, Business Studies",
    track: "PURE SCIENCES",
    subjects: ["Advanced Mathematics", "Biology", "Business Studies", "Chemistry", "English"],
    description: "Alternative combination focusing on biological sciences and entrepreneurship",
    careers: ["Biotech Entrepreneur", "Agricultural Business Manager", "Medical Equipment Sales"],
    universities: ["Egerton University", "University of Eldoret", "Maseno University"],
    admissionRequirements: ["KCSE Grade B overall", "B+ in Mathematics and Biology"],
    jobMarketDemand: "Growing",
    averageSalary: "KSh 70,000 - 200,000"
  },

  // STEM > APPLIED SCIENCES
  {
    code: "ST2007",
    name: "Business Studies, Computer Studies, Physics",
    track: "APPLIED SCIENCES",
    subjects: ["Business Studies", "Computer Studies", "Physics", "Mathematics", "English"],
    description: "Technology and business integration for modern digital economy",
    careers: ["IT Consultant", "Digital Marketing Manager", "E-commerce Specialist", "Tech Entrepreneur"],
    universities: ["Strathmore University", "USIU", "KCA University"],
    admissionRequirements: ["KCSE Grade B overall", "B+ in Mathematics", "B in Computer Studies"],
    jobMarketDemand: "Very High",
    averageSalary: "KSh 80,000 - 250,000"
  },
  {
    code: "ST2045",
    name: "Agriculture, Building & Construction, Business Studies",
    track: "APPLIED SCIENCES",
    subjects: ["Agriculture", "Building & Construction", "Business Studies", "Mathematics", "English"],
    description: "Practical pathway combining agricultural technology with construction and business",
    careers: ["Agricultural Engineer", "Construction Contractor", "Agribusiness Manager", "Farm Manager"],
    universities: ["Egerton University", "University of Eldoret", "Jomo Kenyatta University"],
    admissionRequirements: ["KCSE Grade C+ overall", "C+ in Mathematics", "C+ in Agriculture"],
    jobMarketDemand: "High",
    averageSalary: "KSh 60,000 - 180,000"
  },
  {
    code: "ST2070",
    name: "Agriculture, Aviation, Geography",
    track: "APPLIED SCIENCES",
    subjects: ["Agriculture", "Aviation", "Geography", "Mathematics", "English"],
    description: "Specialized pathway for agricultural aviation and spatial analysis",
    careers: ["Agricultural Pilot", "Drone Operator", "Precision Agriculture Specialist", "Geographic Information Systems Analyst"],
    universities: ["Kenya School of Flying", "University of Nairobi", "JKUAT"],
    admissionRequirements: ["KCSE Grade B- overall", "B in Mathematics", "Good eyesight and physical fitness"],
    jobMarketDemand: "Growing",
    averageSalary: "KSh 100,000 - 300,000"
  },
  {
    code: "ST2067",
    name: "Agriculture, Computer Studies, Physics",
    track: "APPLIED SCIENCES",
    subjects: ["Agriculture", "Computer Studies", "Physics", "Mathematics", "Chemistry"],
    description: "Modern agriculture with technological integration",
    careers: ["Agricultural Technologist", "Smart Farming Specialist", "Agricultural Software Developer"],
    universities: ["Egerton University", "JKUAT", "University of Eldoret"],
    admissionRequirements: ["KCSE Grade B overall", "B+ in Mathematics", "B in Computer Studies"],
    jobMarketDemand: "Growing",
    averageSalary: "KSh 70,000 - 200,000"
  },
  {
    code: "ST2091",
    name: "Advanced Mathematics, Agriculture, Home Science",
    track: "APPLIED SCIENCES",
    subjects: ["Advanced Mathematics", "Agriculture", "Home Science", "Chemistry", "Biology"],
    description: "Mathematical approach to agricultural and nutritional sciences",
    careers: ["Agricultural Researcher", "Food Safety Inspector", "Nutrition Consultant", "Agricultural Economist"],
    universities: ["Egerton University", "University of Nairobi", "Kenyatta University"],
    admissionRequirements: ["KCSE Grade B+ overall", "B+ in Mathematics", "B in Agriculture"],
    jobMarketDemand: "High",
    averageSalary: "KSh 80,000 - 220,000"
  },
  {
    code: "ST2075",
    name: "Agriculture, Geography, Physics",
    track: "APPLIED SCIENCES",
    subjects: ["Agriculture", "Geography", "Physics", "Mathematics", "Chemistry"],
    description: "Environmental and physical sciences applied to agriculture",
    careers: ["Environmental Consultant", "Soil Scientist", "Climate Change Analyst", "Agricultural Meteorologist"],
    universities: ["University of Nairobi", "Maseno University", "Moi University"],
    admissionRequirements: ["KCSE Grade B overall", "B+ in Mathematics", "B in Geography"],
    jobMarketDemand: "Growing",
    averageSalary: "KSh 75,000 - 200,000"
  },
  {
    code: "ST2019",
    name: "Computer Studies, Home Science, Wood Work",
    track: "APPLIED SCIENCES",
    subjects: ["Computer Studies", "Home Science", "Wood Work", "Mathematics", "English"],
    description: "Creative technology pathway combining digital skills with practical crafts",
    careers: ["Industrial Designer", "3D Printing Specialist", "Furniture Designer", "CAD Technician"],
    universities: ["Technical University of Kenya", "Dedan Kimathi University", "Multimedia University"],
    admissionRequirements: ["KCSE Grade C+ overall", "B in Computer Studies", "Practical skills assessment"],
    jobMarketDemand: "Moderate",
    averageSalary: "KSh 50,000 - 150,000"
  }
];

export const getPathwayByCode = (code: string): CBCPathway | undefined => {
  return cbcPathways.find(pathway => pathway.code === code);
};

export const getPathwaysByTrack = (track: string): CBCPathway[] => {
  return cbcPathways.filter(pathway => pathway.track === track);
};

export const searchPathways = (query: string): CBCPathway[] => {
  const lowercaseQuery = query.toLowerCase();
  return cbcPathways.filter(pathway => 
    pathway.name.toLowerCase().includes(lowercaseQuery) ||
    pathway.subjects.some(subject => subject.toLowerCase().includes(lowercaseQuery)) ||
    pathway.careers.some(career => career.toLowerCase().includes(lowercaseQuery))
  );
};
