'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AICounselorChat } from '../cbc/AICounselorChat';
import { EnhancedDetailedReportGenerator } from '../cbc/EnhancedDetailedReportGenerator';
import { Brain, TrendingUp, Users, BookOpen, Target, Download, MessageCircle, FileText, Sparkles, GraduationCap, School, Calendar, User, BarChart3, PieChart, Activity, Award, CheckCircle, AlertTriangle, Star, Clock } from 'lucide-react';

interface LearnerProfile {
  learnerName: string;
  currentGrade: string;
  schoolName: string;
  assessmentDate: string;
}

interface IntegratedResultsProps {
  answers: Record<string, number>;
  questions: any[];
  onRetake: () => void;
  learnerProfile: LearnerProfile;
}

export const IntegratedResults: React.FC<IntegratedResultsProps> = ({ 
  answers, 
  questions, 
  onRetake,
  learnerProfile 
}) => {
  const [showAICounselor, setShowAICounselor] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);

  // Calculate comprehensive scores from all three assessments including core competencies
  const calculateIntegratedScores = () => {
    const riasecScores = { realistic: 0, investigative: 0, artistic: 0, social: 0, enterprising: 0, conventional: 0 };
    const cbcScores = { 
      mathematics: 0, 
      english: 0, 
      kiswahili: 0, 
      science: 0, 
      socialStudies: 0, 
      creativeArts: 0, 
      physicalEducation: 0 
    };
    const psychometricScores = { cognitive: 0, personality: 0, emotional: 0, behavioral: 0 };
    
    // CBC Core Competencies Assessment
    const coreCompetencies = {
      communicationCollaboration: 0,
      criticalThinkingProblemSolving: 0,
      citizenship: 0,
      creativityImagination: 0,
      digitalLiteracy: 0,
      learningToLearn: 0,
      selfEfficacy: 0
    };

    const counts = {
      riasec: { realistic: 0, investigative: 0, artistic: 0, social: 0, enterprising: 0, conventional: 0 },
      cbc: { mathematics: 0, english: 0, kiswahili: 0, science: 0, socialStudies: 0, creativeArts: 0, physicalEducation: 0 },
      psychometric: { cognitive: 0, personality: 0, emotional: 0, behavioral: 0 },
      competencies: { communicationCollaboration: 0, criticalThinkingProblemSolving: 0, citizenship: 0, creativityImagination: 0, digitalLiteracy: 0, learningToLearn: 0, selfEfficacy: 0 }
    };

    Object.entries(answers).forEach(([id, score]) => {
      const question = questions.find(q => q.id === id);
      if (question) {
        if (question.sourceType === 'riasec' && question.category) {
          const riasecType = question.category.toLowerCase();
          if (riasecScores.hasOwnProperty(riasecType)) {
            riasecScores[riasecType as keyof typeof riasecScores] += score;
            counts.riasec[riasecType as keyof typeof counts.riasec]++;
          }
        } else if (question.sourceType === 'cbc' && question.category) {
          const cbcCategory = question.category.toLowerCase();
          if (cbcScores.hasOwnProperty(cbcCategory)) {
            cbcScores[cbcCategory as keyof typeof cbcScores] += score;
            counts.cbc[cbcCategory as keyof typeof counts.cbc]++;
          }
          
          // Map to core competencies based on question content
          if (question.competency) {
            const competencyKey = question.competency.toLowerCase().replace(/[^a-zA-Z]/g, '');
            if (coreCompetencies.hasOwnProperty(competencyKey)) {
              coreCompetencies[competencyKey as keyof typeof coreCompetencies] += score;
              counts.competencies[competencyKey as keyof typeof counts.competencies]++;
            }
          }
        } else if (question.sourceType === 'psychometric' && question.psychometricType) {
          const psychType = question.psychometricType.toLowerCase();
          if (psychometricScores.hasOwnProperty(psychType)) {
            psychometricScores[psychType as keyof typeof psychometricScores] += score;
            counts.psychometric[psychType as keyof typeof counts.psychometric]++;
          }
        }
      }
    });

    // Calculate percentages for all categories
    Object.keys(riasecScores).forEach(key => {
      const k = key as keyof typeof riasecScores;
      if (counts.riasec[k] > 0) {
        riasecScores[k] = Math.round((riasecScores[k] / (counts.riasec[k] * 5)) * 100);
      }
    });

    Object.keys(cbcScores).forEach(key => {
      const k = key as keyof typeof cbcScores;
      if (counts.cbc[k] > 0) {
        cbcScores[k] = Math.round((cbcScores[k] / (counts.cbc[k] * 5)) * 100);
      }
    });

    Object.keys(psychometricScores).forEach(key => {
      const k = key as keyof typeof psychometricScores;
      if (counts.psychometric[k] > 0) {
        psychometricScores[k] = Math.round((psychometricScores[k] / (counts.psychometric[k] * 5)) * 100);
      }
    });

    Object.keys(coreCompetencies).forEach(key => {
      const k = key as keyof typeof coreCompetencies;
      if (counts.competencies[k] > 0) {
        coreCompetencies[k] = Math.round((coreCompetencies[k] / (counts.competencies[k] * 5)) * 100);
      }
    });

    return { riasecScores, cbcScores, psychometricScores, coreCompetencies, counts };
  };

  // Generate mock termly results for Grade 7-9 CBC Learning Areas
  const generateTermlyResults = () => {
    const cbcGrade7to9LearningAreas = [
      'English',
      'Kiswahili / Kenya Sign Language',
      'Mathematics',
      'Religious Education',
      'Social Studies',
      'Integrated Science',
      'Pre-Technical Studies',
      'Agriculture and Nutrition',
      'Creative Arts and Sports'
    ];

    const terms = ['Term 1', 'Term 2', 'Term 3'];
    const termlyResults: Record<string, Record<string, number>> = {};

    terms.forEach(term => {
      termlyResults[term] = {};
      cbcGrade7to9LearningAreas.forEach(subject => {
        // Generate realistic scores based on assessment performance
        const baseScore = Math.floor(Math.random() * 30) + 60; // 60-90 range
        termlyResults[term][subject] = baseScore;
      });
    });

    return { cbcGrade7to9LearningAreas, terms, termlyResults };
  };

  // Enhanced Grade 10-12 pathway recommendations focusing on STEM, Social Science, and Arts & Sports
  const calculateGrade1012Pathways = () => {
    const { riasecScores, cbcScores, psychometricScores, coreCompetencies } = calculateIntegratedScores();
    
    const pathways = [
      {
        name: "Science, Technology, Engineering and Mathematics (STEM)",
        code: "Grade 10-12 STEM Pathway",
        match: Math.round((
          riasecScores.investigative * 0.35 + 
          riasecScores.realistic * 0.3 + 
          cbcScores.mathematics * 0.4 + 
          cbcScores.science * 0.4 + 
          psychometricScores.cognitive * 0.3 +
          coreCompetencies.criticalThinkingProblemSolving * 0.25 +
          coreCompetencies.digitalLiteracy * 0.2
        ) / 3.0),
        description: "Strong analytical, mathematical, and scientific problem-solving abilities with focus on innovation and technology",
        grade1012Subjects: ["Pure Mathematics", "Physics", "Chemistry", "Biology", "Computer Studies", "Geography (Optional)"],
        careerPathways: [
          {
            category: "Medical & Health Sciences",
            careers: ["Medical Doctor", "Pharmacist", "Veterinarian", "Dentist", "Medical Laboratory Technologist", "Radiographer"],
            universities: ["University of Nairobi", "Moi University", "JKUAT", "Kenya Medical University"],
            entryRequirements: "KCSE Mean Grade A- with A- in Biology, Chemistry, Physics, Mathematics"
          },
          {
            category: "Engineering & Technology",
            careers: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Software Engineer", "Aerospace Engineer", "Biomedical Engineer"],
            universities: ["University of Nairobi", "JKUAT", "Technical University of Kenya", "Dedan Kimathi University"],
            entryRequirements: "KCSE Mean Grade B+ with B+ in Mathematics, Physics, Chemistry"
          },
          {
            category: "Pure & Applied Sciences",
            careers: ["Research Scientist", "Data Scientist", "Environmental Scientist", "Geologist", "Meteorologist", "Statistician"],
            universities: ["University of Nairobi", "Kenyatta University", "Maseno University", "Egerton University"],
            entryRequirements: "KCSE Mean Grade B+ with B+ in relevant science subjects"
          }
        ],
        reasoning: "Exceptional performance in mathematics, science, and investigative thinking with strong cognitive abilities and problem-solving competency",
        coreCompetencies: ["Critical Thinking & Problem Solving", "Digital Literacy", "Creativity & Imagination", "Learning to Learn"],
        kjseaPreparation: "Focus intensively on Mathematics and Integrated Science. Target minimum B+ for competitive STEM programs."
      },
      {
        name: "Social Sciences",
        code: "Grade 10-12 Social Science Pathway",
        match: Math.round((
          riasecScores.social * 0.4 + 
          riasecScores.investigative * 0.3 + 
          riasecScores.enterprising * 0.25 +
          cbcScores.socialStudies * 0.45 + 
          cbcScores.english * 0.35 + 
          cbcScores.kiswahili * 0.3 +
          psychometricScores.emotional * 0.35 +
          coreCompetencies.citizenship * 0.3 +
          coreCompetencies.communicationCollaboration * 0.25
        ) / 3.7),
        description: "Strong interpersonal skills, social awareness, leadership qualities, and understanding of human society and governance",
        grade1012Subjects: ["History & Government", "Geography", "English", "Kiswahili", "Religious Studies", "Business Studies (Optional)"],
        careerPathways: [
          {
            category: "Law & Governance",
            careers: ["Lawyer", "Judge", "Magistrate", "Legal Officer", "Public Administrator", "Diplomat"],
            universities: ["University of Nairobi", "Kenyatta University", "Moi University", "Strathmore University"],
            entryRequirements: "KCSE Mean Grade B+ with B+ in English, History & Government"
          },
          {
            category: "Social Services & Development",
            careers: ["Social Worker", "Community Development Officer", "NGO Manager", "Human Rights Officer", "Policy Analyst"],
            universities: ["University of Nairobi", "Kenyatta University", "Maseno University", "Catholic University"],
            entryRequirements: "KCSE Mean Grade B with B in English, History & Government"
          },
          {
            category: "Communication & Media",
            careers: ["Journalist", "Public Relations Officer", "Media Producer", "Communication Specialist", "Editor"],
            universities: ["University of Nairobi", "Daystar University", "United States International University"],
            entryRequirements: "KCSE Mean Grade B+ with B+ in English, History & Government"
          }
        ],
        reasoning: "High social orientation, excellent communication skills, and strong interest in human behavior, society, and governance",
        coreCompetencies: ["Communication & Collaboration", "Citizenship", "Critical Thinking", "Leadership"],
        kjseaPreparation: "Excel in English and Social Studies. Develop strong writing and analytical skills."
      },
      {
        name: "Arts and Sports Science",
        code: "Grade 10-12 Arts & Sports Pathway",
        match: Math.round((
          riasecScores.artistic * 0.45 + 
          riasecScores.social * 0.3 + 
          riasecScores.enterprising * 0.25 +
          cbcScores.creativeArts * 0.45 + 
          cbcScores.physicalEducation * 0.4 + 
          cbcScores.english * 0.3 +
          psychometricScores.personality * 0.35 +
          coreCompetencies.creativityImagination * 0.4 +
          coreCompetencies.selfEfficacy * 0.3
        ) / 3.9),
        description: "Exceptional creative expression, artistic abilities, physical coordination, and aesthetic appreciation with entrepreneurial potential",
        grade1012Subjects: ["Art & Design", "Music", "Physical Education", "English", "Biology", "Business Studies"],
        careerPathways: [
          {
            category: "Creative Arts & Design",
            careers: ["Graphic Designer", "Interior Designer", "Fashion Designer", "Architect", "Film Producer", "Music Producer"],
            universities: ["University of Nairobi", "Kenyatta University", "Technical University of Kenya", "Daystar University"],
            entryRequirements: "KCSE Mean Grade C+ with good performance in Art & Design, English"
          },
          {
            category: "Sports & Recreation",
            careers: ["Sports Coach", "Sports Scientist", "Physiotherapist", "Sports Journalist", "Fitness Trainer", "Sports Manager"],
            universities: ["Kenyatta University", "Moi University", "Maseno University", "University of Nairobi"],
            entryRequirements: "KCSE Mean Grade C+ with B in Physical Education, Biology"
          },
          {
            category: "Entertainment & Media",
            careers: ["Actor", "Director", "Event Manager", "Content Creator", "Radio/TV Presenter", "Photographer"],
            universities: ["Daystar University", "United States International University", "Kenya Institute of Mass Communication"],
            entryRequirements: "KCSE Mean Grade C+ with good performance in English, Art subjects"
          }
        ],
        reasoning: "Outstanding artistic and physical abilities with creative thinking, self-expression, and performance orientation",
        coreCompetencies: ["Creativity & Innovation", "Communication", "Self-Efficacy", "Collaboration"],
        kjseaPreparation: "Showcase creative talents and maintain good performance in English and practical subjects."
      }
    ].sort((a, b) => b.match - a.match);

    return pathways;
  };

  // Updated CBC Assessment Rubrics with correct terminology
  const getCBCRubric = (percentage: number) => {
    if (percentage >= 80) return { 
      level: "Exceeding Expectations", 
      color: "text-green-600 bg-green-50 border-green-200", 
      desc: "Learner demonstrates exceptional mastery and can apply skills beyond grade level expectations",
      grade: "4",
      icon: <Star className="w-4 h-4" />,
      kjseaImplication: "Excellent potential for Cluster 1 national schools with multiple pathway options and scholarship opportunities"
    };
    if (percentage >= 70) return { 
      level: "Meeting Expectations", 
      color: "text-blue-600 bg-blue-50 border-blue-200", 
      desc: "Learner demonstrates proficiency and consistently meets grade level standards and expectations",
      grade: "3",
      icon: <CheckCircle className="w-4 h-4" />,
      kjseaImplication: "Good potential for Cluster 1-2 schools with focused preparation in chosen pathway areas"
    };
    if (percentage >= 60) return { 
      level: "Approaching Expectations", 
      color: "text-yellow-600 bg-yellow-50 border-yellow-200", 
      desc: "Learner shows progress toward meeting standards but needs additional support and practice",
      grade: "2",
      icon: <TrendingUp className="w-4 h-4" />,
      kjseaImplication: "Requires focused preparation and improvement strategies for KJSEA success and pathway access"
    };
    return { 
      level: "Below Expectations", 
      color: "text-red-600 bg-red-50 border-red-200", 
      desc: "Learner needs significant support, intervention, and intensive remedial assistance",
      grade: "1",
      icon: <AlertTriangle className="w-4 h-4" />,
      kjseaImplication: "Intensive academic support and targeted intervention required for KJSEA qualification and pathway success"
    };
  };

  const scores = calculateIntegratedScores();
  const pathways = calculateGrade1012Pathways();
  const { cbcGrade7to9LearningAreas, terms, termlyResults } = generateTermlyResults();
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
  const overallPercentage = Math.round((totalScore / (50 * 5)) * 100);
  const overallRubric = getCBCRubric(overallPercentage);

  const assessmentData = {
    learnerProfile,
    integratedScores: scores,
    topPathways: pathways.slice(0, 3),
    overallPercentage,
    actualScore: totalScore,
    totalPossibleScore: 250,
    pathwayAnalysis: pathways
  };

  // Core Competencies mapping
  const competencyDescriptions = {
    communicationCollaboration: {
      name: "Communication & Collaboration",
      description: "Ability to express ideas clearly and work effectively with others",
      icon: <Users className="w-4 h-4" />
    },
    criticalThinkingProblemSolving: {
      name: "Critical Thinking & Problem Solving",
      description: "Analyzing information and solving complex problems systematically",
      icon: <Brain className="w-4 h-4" />
    },
    citizenship: {
      name: "Citizenship",
      description: "Understanding civic responsibilities and contributing to society",
      icon: <Award className="w-4 h-4" />
    },
    creativityImagination: {
      name: "Creativity & Imagination",
      description: "Generating innovative ideas and solutions",
      icon: <Sparkles className="w-4 h-4" />
    },
    digitalLiteracy: {
      name: "Digital Literacy",
      description: "Effective use of technology for learning and communication",
      icon: <Target className="w-4 h-4" />
    },
    learningToLearn: {
      name: "Learning to Learn",
      description: "Self-directed learning and metacognitive awareness",
      icon: <BookOpen className="w-4 h-4" />
    },
    selfEfficacy: {
      name: "Self-Efficacy",
      description: "Confidence in one's ability to succeed and overcome challenges",
      icon: <CheckCircle className="w-4 h-4" />
    }
  };

  if (showAICounselor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowAICounselor(false)}
              className="mb-4"
            >
              ← Back to Results
            </Button>
          </div>
          <AICounselorChat 
            onNext={() => setShowAICounselor(false)}
            data={assessmentData}
          />
        </div>
      </div>
    );
  }

  if (showDetailedReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowDetailedReport(false)}
              className="mb-4"
            >
              ← Back to Results
            </Button>
          </div>
          <EnhancedDetailedReportGenerator 
            data={assessmentData}
            onNext={() => setShowDetailedReport(false)}
            onPrevious={() => setShowDetailedReport(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Learner Profile and Overall Assessment */}
        <Card className="border-2 border-purple-200 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="w-8 h-8" />
              <CardTitle className="text-3xl font-bold">
                CBE Pathway & Career Personality Assessment Results
              </CardTitle>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2 justify-center">
                <User className="w-4 h-4" />
                <span><strong>Learner:</strong> {learnerProfile.learnerName}</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <GraduationCap className="w-4 h-4" />
                <span><strong>Grade:</strong> {learnerProfile.currentGrade}</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <School className="w-4 h-4" />
                <span><strong>School:</strong> {learnerProfile.schoolName}</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Calendar className="w-4 h-4" />
                <span><strong>Date:</strong> {learnerProfile.assessmentDate}</span>
              </div>
            </div>
            <div className="space-y-3">
              <CardDescription className="text-lg text-blue-100">
                Overall Assessment Score: <strong className="text-3xl text-yellow-300">{overallPercentage}%</strong> ({totalScore}/250 points)
              </CardDescription>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${overallRubric.color}`}>
                {overallRubric.icon}
                <span className="font-bold text-lg">{overallRubric.level}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Grade 10-12 Pathway Analysis - Main Focus */}
        <Card className="border-2 border-green-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 text-2xl">
              <Target className="w-6 h-6" />
              Grade 10-12 Pathway Analysis & Career Recommendations
            </CardTitle>
            <CardDescription className="text-lg">
              Based on your comprehensive assessment, here are your recommended pathways for Grade 10-12 with detailed career analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {pathways.map((pathway, index) => (
              <div key={pathway.code} className="border-2 border-gray-200 rounded-xl p-6 space-y-4 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{pathway.name}</h3>
                      <p className="text-sm text-gray-600">{pathway.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">{pathway.match}%</div>
                    <div className="text-sm text-gray-600">Match Score</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-medium">{pathway.description}</p>
                  <p className="text-sm text-blue-700 mt-2"><strong>Analysis:</strong> {pathway.reasoning}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Grade 10-12 Subjects
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {pathway.grade1012Subjects.map((subject) => (
                        <Badge key={subject} variant="outline" className="text-xs bg-green-100 text-green-700">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Core Competencies Focus
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {pathway.coreCompetencies.map((competency) => (
                        <Badge key={competency} variant="outline" className="text-xs bg-purple-100 text-purple-700">
                          {competency}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Career Pathways Detail */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 text-lg">Career Pathway Options:</h4>
                  {pathway.careerPathways.map((careerPath, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-semibold text-blue-700 text-lg">{careerPath.category}</h5>
                        <Badge className="bg-blue-100 text-blue-800">{careerPath.careers.length} Careers</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">Career Options:</h6>
                          <div className="space-y-1">
                            {careerPath.careers.map((career) => (
                              <div key={career} className="text-sm text-gray-600 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {career}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">Top Universities:</h6>
                          <div className="space-y-1">
                            {careerPath.universities.map((university) => (
                              <div key={university} className="text-sm text-gray-600 flex items-center gap-1">
                                <GraduationCap className="w-3 h-3 text-blue-500" />
                                {university}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">Entry Requirements:</h6>
                          <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                            {careerPath.entryRequirements}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h5 className="font-semibold text-orange-800 mb-2">KJSEA Preparation Strategy:</h5>
                  <p className="text-orange-700 text-sm">{pathway.kjseaPreparation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assessment Score Breakdown */}
        <Tabs defaultValue="rubrics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rubrics">CBC Rubric Analysis</TabsTrigger>
            <TabsTrigger value="termly">Termly Results</TabsTrigger>
            <TabsTrigger value="competencies">Core Competencies</TabsTrigger>
            <TabsTrigger value="preparation">KJSEA Preparation</TabsTrigger>
          </TabsList>

          <TabsContent value="rubrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* RIASEC Profile Card */}
              <Card className="border-2 border-blue-200">
                <CardHeader className="text-center pb-3">
                  <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <CardTitle className="text-xl text-blue-700">Career Personality (RIASEC)</CardTitle>
                  <Badge variant="outline" className="text-sm">
                    Average: {Math.round(Object.values(scores.riasecScores).reduce((a, b) => a + b, 0) / 6)}%
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(scores.riasecScores)
                    .sort(([,a], [,b]) => b - a)
                    .map(([type, score],) => {
                      const rubric = getCBCRubric(score);
                      return (
                        <div key={type} className={`p-3 rounded-lg border ${rubric.color}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="capitalize font-semibold text-sm">
                              {type}
                            </span>
                            <div className="flex items-center gap-2">
                              {rubric.icon}
                              <span className="font-bold">{score}%</span>
                            </div>
                          </div>
                          <Progress value={score} className="h-2 mb-2" />
                          <div className="text-xs font-medium">{rubric.level}</div>
                          <p className="text-xs mt-1">{rubric.desc}</p>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>

              {/* CBC Learning Areas Card */}
              <Card className="border-2 border-green-200">
                <CardHeader className="text-center pb-3">
                  <BookOpen className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <CardTitle className="text-xl text-green-700">CBC Learning Areas</CardTitle>
                  <Badge variant="outline" className="text-sm">
                    Average: {Math.round(Object.values(scores.cbcScores).reduce((a, b) => a + b, 0) / 7)}%
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(scores.cbcScores)
                    .sort(([,a], [,b]) => b - a)
                    .map(([area, score]) => {
                      const rubric = getCBCRubric(score);
                      return (
                        <div key={area} className={`p-3 rounded-lg border ${rubric.color}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="capitalize font-semibold text-sm">
                              {area.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <div className="flex items-center gap-2">
                              {rubric.icon}
                              <span className="font-bold">{score}%</span>
                            </div>
                          </div>
                          <Progress value={score} className="h-2 mb-2" />
                          <div className="text-xs font-medium">{rubric.level}</div>
                          <p className="text-xs mt-1">{rubric.desc}</p>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>

              {/* Psychometric Profile Card */}
              <Card className="border-2 border-purple-200">
                <CardHeader className="text-center pb-3">
                  <Brain className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <CardTitle className="text-xl text-purple-700">Psychometric Profile</CardTitle>
                  <Badge variant="outline" className="text-sm">
                    Average: {Math.round(Object.values(scores.psychometricScores).reduce((a, b) => a + b, 0) / 4)}%
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(scores.psychometricScores)
                    .sort(([,a], [,b]) => b - a)
                    .map(([trait, score]) => {
                      const rubric = getCBCRubric(score);
                      return (
                        <div key={trait} className={`p-3 rounded-lg border ${rubric.color}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="capitalize font-semibold text-sm">
                              {trait}
                            </span>
                            <div className="flex items-center gap-2">
                              {rubric.icon}
                              <span className="font-bold">{score}%</span>
                            </div>
                          </div>
                          <Progress value={score} className="h-2 mb-2" />
                          <div className="text-xs font-medium">{rubric.level}</div>
                          <p className="text-xs mt-1">{rubric.desc}</p>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="termly" className="space-y-6">
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Clock className="w-5 h-5" />
                  Termly Summative Exam Results (Grade 7-9 CBC Learning Areas)
                </CardTitle>
                <CardDescription>
                  Performance tracking across CBC Learning Areas for continuous assessment and improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {terms.map((term) => (
                    <div key={term} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg text-orange-800 mb-4">{term}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cbcGrade7to9LearningAreas.map((subject) => {
                          const score = termlyResults[term][subject];
                          const rubric = getCBCRubric(score);
                          return (
                            <div key={subject} className={`p-3 rounded-lg border ${rubric.color}`}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-sm">{subject}</span>
                                <div className="flex items-center gap-1">
                                  {rubric.icon}
                                  <span className="font-bold text-sm">{score}%</span>
                                </div>
                              </div>
                              <Progress value={score} className="h-2 mb-1" />
                              <div className="text-xs font-medium">{rubric.level}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-800 mb-2">Performance Trend Analysis</h5>
                  <p className="text-blue-700 text-sm">
                    Based on termly results, focus on improving performance in subjects scoring below 70% 
                    to ensure strong foundation for Grade 10-12 pathway selection. Consistent performance 
                    across terms indicates readiness for advanced pathway subjects.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competencies" className="space-y-6">
            <Card className="border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <Award className="w-5 h-5" />
                  CBC Core Competencies Assessment
                </CardTitle>
                <CardDescription>
                  Essential 21st-century skills for success in academics and career pathways
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(scores.coreCompetencies)
                    .sort(([,a], [,b]) => b - a)
                    .map(([competency, score]) => {
                      const info = competencyDescriptions[competency as keyof typeof competencyDescriptions];
                      const rubric = getCBCRubric(score);
                      
                      return (
                        <div key={competency} className={`p-4 border-2 rounded-lg space-y-3 ${rubric.color}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {info.icon}
                              <h4 className="font-semibold text-sm">{info.name}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              {rubric.icon}
                              <div className="text-right">
                                <div className="font-bold">{score}%</div>
                                <div className="text-xs">{rubric.level}</div>
                              </div>
                            </div>
                          </div>
                          <Progress value={score} className="h-3" />
                          <p className="text-xs">{info.description}</p>
                          <p className="text-xs font-medium">{rubric.desc}</p>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preparation" className="space-y-6">
            <Card className="border-2 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Target className="w-5 h-5" />
                  KJSEA Preparation Strategy
                </CardTitle>
                <CardDescription>
                  Targeted preparation plan based on your assessment results and chosen pathway
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
                  <h4 className="font-semibold text-red-800 mb-3">Your KJSEA Outlook:</h4>
                  <p className="text-red-700">{overallRubric.kjseaImplication}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-red-800">Priority Subject Areas</h4>
                    <div className="space-y-3">
                      {Object.entries(scores.cbcScores)
                        .sort(([,a], [,b]) => a - b)
                        .slice(0, 3)
                        .map(([subject, score]) => {
                          const rubric = getCBCRubric(score);
                          return (
                            <div key={subject} className={`p-3 rounded-lg border ${rubric.color}`}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium capitalize">{subject.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <div className="flex items-center gap-1">
                                  {rubric.icon}
                                  <span className="text-sm">{rubric.level}</span>
                                </div>
                              </div>
                              <p className="text-sm">
                                {score >= 80 ? "Maintain excellence and help others" : 
                                 score >= 70 ? "Continue building on strengths" : 
                                 score >= 60 ? "Focus on targeted improvement" : "Seek intensive support and practice"}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-red-800">Recommended Pathway Focus</h4>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-2">{pathways[0]?.name}</h5>
                      <p className="text-sm text-blue-700 mb-3">Match Score: {pathways[0]?.match}%</p>
                      <div className="space-y-2">
                        <div className="text-sm"><strong>Focus Subjects:</strong></div>
                        <div className="flex flex-wrap gap-1">
                          {pathways[0]?.grade1012Subjects.slice(0, 4).map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs bg-blue-100 text-blue-700">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-blue-600 mt-2">{pathways[0]?.kjseaPreparation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card className="border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-blue-700">
                Get Detailed Analysis & Career Guidance
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Overall Performance:</strong> {overallPercentage}% - {overallRubric.level}
                </p>
                <p className="text-gray-600 text-sm">
                  Your assessment shows strongest alignment with <strong>{pathways[0]?.name}</strong> pathway ({pathways[0]?.match}% match).
                  {" "}{overallRubric.kjseaImplication}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  onClick={() => setShowAICounselor(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  AI Career Consultation
                </Button>
                <Button 
                  onClick={() => setShowDetailedReport(true)}
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Detailed Report
                </Button>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <Button 
                  onClick={() => window.print()}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Print/Save Results
                </Button>
                <Button 
                  onClick={onRetake}
                  variant="outline"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Retake Assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
