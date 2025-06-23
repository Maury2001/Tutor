'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Target, BookOpen, Users, Award, Lightbulb, Zap } from 'lucide-react';

interface DynamicQuestion {
  id: string;
  text: string;
  category: string;
  sourceType: 'cbc' | 'riasec' | 'psychometric';
  competency?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  adaptiveLevel: number;
  coreCompetencyFocus: string[];
}

interface DynamicQuestionSystemProps {
  onAnswerChange: (questionId: string, answer: number) => void;
  onComplete: () => void;
  currentAnswers: Record<string, number>;
}

export const DynamicQuestionSystem: React.FC<DynamicQuestionSystemProps> = ({
  onAnswerChange,
  onComplete,
  currentAnswers
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState<DynamicQuestion[]>([]);
  const [userPerformanceProfile, setUserPerformanceProfile] = useState({
    strengths: [] as string[],
    weaknesses: [] as string[],
    preferredLearningStyle: 'visual',
    responsePatterns: {} as Record<string, number[]>
  });
  const [coreCompetencyScore, setCoreCompetencyScore] = useState(0);

  // AI-powered dynamic question bank with core competency integration - 60 QUESTIONS TOTAL
  const generateDynamicQuestions = (userProfile: any): DynamicQuestion[] => {
    const baseQuestions: DynamicQuestion[] = [
      // CBC Core Competency Focused Questions (20 QUESTIONS - 10 MARKS ALLOCATED)
      {
        id: 'cbc_core_1',
        text: 'When facing a challenging problem in my studies, I break it down into smaller parts and analyze each part carefully.',
        category: 'criticalThinking',
        sourceType: 'cbc',
        competency: 'Critical Thinking & Problem Solving',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['criticalThinkingProblemSolving']
      },
      {
        id: 'cbc_core_2',
        text: 'I actively listen to my classmates and teachers, and I can express my ideas clearly in group discussions.',
        category: 'communication',
        sourceType: 'cbc',
        competency: 'Communication & Collaboration',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['communicationCollaboration']
      },
      {
        id: 'cbc_core_3',
        text: 'I enjoy coming up with creative solutions and thinking of new ways to approach tasks and projects.',
        category: 'creativity',
        sourceType: 'cbc',
        competency: 'Creativity & Imagination',
        difficulty: 'medium',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['creativityImagination']
      },
      {
        id: 'cbc_core_4',
        text: 'I am comfortable using digital tools, applications, and technology to enhance my learning and complete assignments.',
        category: 'digitalLiteracy',
        sourceType: 'cbc',
        competency: 'Digital Literacy',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['digitalLiteracy']
      },
      {
        id: 'cbc_core_5',
        text: 'I take responsibility for my community and actively participate in activities that benefit Kenya and its people.',
        category: 'citizenship',
        sourceType: 'cbc',
        competency: 'Citizenship',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['citizenship']
      },
      {
        id: 'cbc_core_6',
        text: 'I am curious about learning new things and I enjoy discovering knowledge through different methods and sources.',
        category: 'learningToLearn',
        sourceType: 'cbc',
        competency: 'Learning to Learn',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['learningToLearn']
      },
      {
        id: 'cbc_core_7',
        text: 'I believe in my abilities to achieve my goals and I persist even when tasks become challenging.',
        category: 'selfEfficacy',
        sourceType: 'cbc',
        competency: 'Self-Efficacy',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['selfEfficacy']
      },
      {
        id: 'cbc_core_8',
        text: 'I can evaluate information from multiple sources and make informed decisions based on evidence and reasoning.',
        category: 'criticalThinking',
        sourceType: 'cbc',
        competency: 'Critical Thinking & Problem Solving',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['criticalThinkingProblemSolving', 'learningToLearn']
      },
      {
        id: 'cbc_core_9',
        text: 'I work effectively in teams, respect diverse opinions, and contribute positively to group projects.',
        category: 'collaboration',
        sourceType: 'cbc',
        competency: 'Communication & Collaboration',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['communicationCollaboration', 'citizenship']
      },
      {
        id: 'cbc_core_10',
        text: 'I use creative thinking to develop innovative solutions that can positively impact my school and community.',
        category: 'innovation',
        sourceType: 'cbc',
        competency: 'Creativity & Imagination',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['creativityImagination', 'citizenship', 'selfEfficacy']
      },
      {
        id: 'cbc_core_11',
        text: 'I can organize my learning schedule and set realistic goals for myself.',
        category: 'selfManagement',
        sourceType: 'cbc',
        competency: 'Self-Efficacy',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['selfEfficacy', 'learningToLearn']
      },
      {
        id: 'cbc_core_12',
        text: 'I enjoy using computers, tablets, and smartphones to research and learn new topics.',
        category: 'digitalSkills',
        sourceType: 'cbc',
        competency: 'Digital Literacy',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['digitalLiteracy']
      },
      {
        id: 'cbc_core_13',
        text: 'When I disagree with someone, I can express my opinion respectfully and listen to their viewpoint.',
        category: 'communication',
        sourceType: 'cbc',
        competency: 'Communication & Collaboration',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['communicationCollaboration', 'citizenship']
      },
      {
        id: 'cbc_core_14',
        text: 'I can identify problems in my environment and think of practical solutions to help solve them.',
        category: 'problemSolving',
        sourceType: 'cbc',
        competency: 'Critical Thinking & Problem Solving',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['criticalThinkingProblemSolving', 'citizenship']
      },
      {
        id: 'cbc_core_15',
        text: 'I enjoy drawing, writing stories, singing, or doing other creative activities.',
        category: 'creativity',
        sourceType: 'cbc',
        competency: 'Creativity & Imagination',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['creativityImagination']
      },
      {
        id: 'cbc_core_16',
        text: 'I ask questions when I don\'t understand something and seek help from teachers or classmates.',
        category: 'learningApproach',
        sourceType: 'cbc',
        competency: 'Learning to Learn',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['learningToLearn', 'communicationCollaboration']
      },
      {
        id: 'cbc_core_17',
        text: 'I feel proud to be Kenyan and I want to contribute to making my country better.',
        category: 'patriotism',
        sourceType: 'cbc',
        competency: 'Citizenship',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['citizenship']
      },
      {
        id: 'cbc_core_18',
        text: 'I can work independently on projects and assignments without constant supervision.',
        category: 'independence',
        sourceType: 'cbc',
        competency: 'Self-Efficacy',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['selfEfficacy', 'learningToLearn']
      },
      {
        id: 'cbc_core_19',
        text: 'I can use the internet safely and I know how to protect my personal information online.',
        category: 'digitalSafety',
        sourceType: 'cbc',
        competency: 'Digital Literacy',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['digitalLiteracy', 'criticalThinkingProblemSolving']
      },
      {
        id: 'cbc_core_20',
        text: 'I can explain my ideas clearly to others and help them understand complex concepts.',
        category: 'communication',
        sourceType: 'cbc',
        competency: 'Communication & Collaboration',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['communicationCollaboration', 'learningToLearn']
      },

      // CBC Learning Areas Questions (20 QUESTIONS)
      {
        id: 'cbc_learning_1',
        text: 'I enjoy solving mathematical problems and understanding how numbers work in real life situations.',
        category: 'mathematics',
        sourceType: 'cbc',
        competency: 'Critical Thinking & Problem Solving',
        difficulty: 'medium',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['criticalThinkingProblemSolving']
      },
      {
        id: 'cbc_learning_2',
        text: 'Reading English stories and writing compositions brings me joy and satisfaction.',
        category: 'english',
        sourceType: 'cbc',
        competency: 'Communication & Collaboration',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['communicationCollaboration']
      },
      {
        id: 'cbc_learning_3',
        text: 'I find it easy to speak and understand Kiswahili in different situations.',
        category: 'kiswahili',
        sourceType: 'cbc',
        competency: 'Communication & Collaboration',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['communicationCollaboration', 'citizenship']
      },
      {
        id: 'cbc_learning_4',
        text: 'Learning about different countries, cultures, and societies fascinates me.',
        category: 'socialStudies',
        sourceType: 'cbc',
        competency: 'Citizenship',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['citizenship', 'learningToLearn']
      },
      {
        id: 'cbc_learning_5',
        text: 'I enjoy conducting experiments and discovering how things work in science.',
        category: 'integratedScience',
        sourceType: 'cbc',
        competency: 'Learning to Learn',
        difficulty: 'medium',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['learningToLearn', 'criticalThinkingProblemSolving']
      },
      {
        id: 'cbc_learning_6',
        text: 'Working with tools and building things with my hands excites me.',
        category: 'preTechnical',
        sourceType: 'cbc',
        competency: 'Creativity & Imagination',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['creativityImagination', 'criticalThinkingProblemSolving']
      },
      {
        id: 'cbc_learning_7',
        text: 'I find learning about farming, cooking, and nutrition very interesting and practical.',
        category: 'agricultureNutrition',
        sourceType: 'cbc',
        competency: 'Learning to Learn',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['learningToLearn', 'citizenship']
      },
      {
        id: 'cbc_learning_8',
        text: 'I love participating in music, art, drama, and sports activities.',
        category: 'creativeArts',
        sourceType: 'cbc',
        competency: 'Creativity & Imagination',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['creativityImagination']
      },
      {
        id: 'cbc_learning_9',
        text: 'Learning about different religions and moral values helps me understand life better.',
        category: 'religiousEducation',
        sourceType: 'cbc',
        competency: 'Citizenship',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['citizenship', 'communicationCollaboration']
      },
      {
        id: 'cbc_learning_10',
        text: 'I can connect what I learn in mathematics to solve problems in science and daily life.',
        category: 'integration',
        sourceType: 'cbc',
        competency: 'Critical Thinking & Problem Solving',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['criticalThinkingProblemSolving', 'learningToLearn']
      },
      // ... keep existing code (more CBC learning questions 11-20)
      {
        id: 'cbc_learning_11',
        text: 'I enjoy reading both English and Kiswahili books and can compare ideas from both languages.',
        category: 'languages',
        sourceType: 'cbc',
        competency: 'Communication & Collaboration',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['communicationCollaboration', 'learningToLearn']
      },
      {
        id: 'cbc_learning_12',
        text: 'Understanding Kenya\'s history and government systems interests me greatly.',
        category: 'socialStudies',
        sourceType: 'cbc',
        competency: 'Citizenship',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['citizenship', 'criticalThinkingProblemSolving']
      },
      {
        id: 'cbc_learning_13',
        text: 'I like to observe plants, animals, and natural phenomena around me.',
        category: 'integratedScience',
        sourceType: 'cbc',
        competency: 'Learning to Learn',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['learningToLearn']
      },
      {
        id: 'cbc_learning_14',
        text: 'I enjoy designing and creating things using different materials and techniques.',
        category: 'preTechnical',
        sourceType: 'cbc',
        competency: 'Creativity & Imagination',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['creativityImagination', 'criticalThinkingProblemSolving']
      },
      {
        id: 'cbc_learning_15',
        text: 'Learning about healthy eating and sustainable farming practices is important to me.',
        category: 'agricultureNutrition',
        sourceType: 'cbc',
        competency: 'Citizenship',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['citizenship', 'learningToLearn']
      },
      {
        id: 'cbc_learning_16',
        text: 'I feel confident expressing myself through art, music, or physical activities.',
        category: 'creativeArts',
        sourceType: 'cbc',
        competency: 'Self-Efficacy',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['selfEfficacy', 'creativityImagination']
      },
      {
        id: 'cbc_learning_17',
        text: 'I can apply moral and ethical principles in making decisions in my daily life.',
        category: 'religiousEducation',
        sourceType: 'cbc',
        competency: 'Citizenship',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['citizenship', 'criticalThinkingProblemSolving']
      },
      {
        id: 'cbc_learning_18',
        text: 'I can use mathematical concepts to analyze data and make predictions.',
        category: 'mathematics',
        sourceType: 'cbc',
        competency: 'Critical Thinking & Problem Solving',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['criticalThinkingProblemSolving', 'digitalLiteracy']
      },
      {
        id: 'cbc_learning_19',
        text: 'I enjoy writing creative stories and essays that reflect my thoughts and experiences.',
        category: 'english',
        sourceType: 'cbc',
        competency: 'Creativity & Imagination',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['creativityImagination', 'communicationCollaboration']
      },
      {
        id: 'cbc_learning_20',
        text: 'I can explain scientific concepts in simple terms to help others understand.',
        category: 'integratedScience',
        sourceType: 'cbc',
        competency: 'Communication & Collaboration',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['communicationCollaboration', 'learningToLearn']
      },

      // RIASEC Career Questions (10 QUESTIONS)
      {
        id: 'riasec_1',
        text: 'I would enjoy designing and building sustainable housing solutions for communities.',
        category: 'realistic',
        sourceType: 'riasec',
        difficulty: 'medium',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['creativityImagination', 'citizenship']
      },
      {
        id: 'riasec_2',
        text: 'Conducting research to find cures for diseases and improve human health appeals to me.',
        category: 'investigative',
        sourceType: 'riasec',
        difficulty: 'hard',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['criticalThinkingProblemSolving', 'learningToLearn']
      },
      {
        id: 'riasec_3',
        text: 'I would love to create digital art, music, or films that inspire and entertain people.',
        category: 'artistic',
        sourceType: 'riasec',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['creativityImagination', 'digitalLiteracy']
      },
      {
        id: 'riasec_4',
        text: 'Teaching young children and helping them develop their potential brings me joy.',
        category: 'social',
        sourceType: 'riasec',
        difficulty: 'medium',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['communicationCollaboration', 'citizenship']
      },
      {
        id: 'riasec_5',
        text: 'Starting my own business and creating innovative solutions for market problems excites me.',
        category: 'enterprising',
        sourceType: 'riasec',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['selfEfficacy', 'creativityImagination']
      },
      {
        id: 'riasec_6',
        text: 'I enjoy working with data, organizing information, and following detailed procedures.',
        category: 'conventional',
        sourceType: 'riasec',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['digitalLiteracy', 'criticalThinkingProblemSolving']
      },
      {
        id: 'riasec_7',
        text: 'I prefer hands-on work like repairing things, farming, or working with machinery.',
        category: 'realistic',
        sourceType: 'riasec',
        difficulty: 'easy',
        adaptiveLevel: 1,
        coreCompetencyFocus: ['criticalThinkingProblemSolving']
      },
      {
        id: 'riasec_8',
        text: 'I enjoy solving complex puzzles and understanding how systems work.',
        category: 'investigative',
        sourceType: 'riasec',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['criticalThinkingProblemSolving', 'learningToLearn']
      },
      {
        id: 'riasec_9',
        text: 'Helping people solve their problems and improve their lives is important to me.',
        category: 'social',
        sourceType: 'riasec',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['communicationCollaboration', 'citizenship']
      },
      {
        id: 'riasec_10',
        text: 'I enjoy leading group projects and motivating others to achieve common goals.',
        category: 'enterprising',
        sourceType: 'riasec',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['selfEfficacy', 'communicationCollaboration']
      },

      // Psychometric Questions (10 QUESTIONS)
      {
        id: 'psycho_1',
        text: 'When faced with multiple problems, I can prioritize them effectively and manage my time well.',
        category: 'cognitive',
        sourceType: 'psychometric',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['criticalThinkingProblemSolving', 'selfEfficacy']
      },
      {
        id: 'psycho_2',
        text: 'I remain calm under pressure and can help others manage their stress during challenging situations.',
        category: 'emotional',
        sourceType: 'psychometric',
        difficulty: 'hard',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['selfEfficacy', 'communicationCollaboration']
      },
      {
        id: 'psycho_3',
        text: 'I can quickly understand new concepts and apply them to different situations.',
        category: 'cognitive',
        sourceType: 'psychometric',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['learningToLearn', 'criticalThinkingProblemSolving']
      },
      {
        id: 'psycho_4',
        text: 'I am aware of my emotions and can control them appropriately in different situations.',
        category: 'emotional',
        sourceType: 'psychometric',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['selfEfficacy', 'communicationCollaboration']
      },
      {
        id: 'psycho_5',
        text: 'I can remember and follow complex instructions without getting confused.',
        category: 'cognitive',
        sourceType: 'psychometric',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['learningToLearn']
      },
      {
        id: 'psycho_6',
        text: 'I enjoy challenges and see failures as opportunities to learn and improve.',
        category: 'emotional',
        sourceType: 'psychometric',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['selfEfficacy', 'learningToLearn']
      },
      {
        id: 'psycho_7',
        text: 'I can analyze information from different sources and identify patterns or connections.',
        category: 'cognitive',
        sourceType: 'psychometric',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['criticalThinkingProblemSolving', 'digitalLiteracy']
      },
      {
        id: 'psycho_8',
        text: 'I can understand and respond appropriately to other people\'s emotions and needs.',
        category: 'emotional',
        sourceType: 'psychometric',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['communicationCollaboration', 'citizenship']
      },
      {
        id: 'psycho_9',
        text: 'I can focus on tasks for long periods without getting easily distracted.',
        category: 'cognitive',
        sourceType: 'psychometric',
        difficulty: 'medium',
        adaptiveLevel: 2,
        coreCompetencyFocus: ['selfEfficacy', 'learningToLearn']
      },
      {
        id: 'psycho_10',
        text: 'I can motivate myself to complete difficult tasks even when I don\'t feel like doing them.',
        category: 'emotional',
        sourceType: 'psychometric',
        difficulty: 'hard',
        adaptiveLevel: 3,
        coreCompetencyFocus: ['selfEfficacy', 'learningToLearn']
      }
    ];

    // AI-powered question selection based on user performance
    return baseQuestions.filter(question => {
      // Adaptive logic: select questions based on user's previous responses
      const userStrengths = userProfile.strengths || [];
      const userWeaknesses = userProfile.weaknesses || [];
      
      // If user is strong in an area, provide more challenging questions
      if (userStrengths.includes(question.category)) {
        return question.difficulty === 'hard' || question.adaptiveLevel >= 2;
      }
      
      // If user is weak in an area, provide foundational questions
      if (userWeaknesses.includes(question.category)) {
        return question.difficulty === 'easy' || question.difficulty === 'medium';
      }
      
      // Default selection for balanced approach
      return true;
    }).slice(0, 60); // Total of 60 questions
  };

  useEffect(() => {
    // Initialize adaptive question system
    const initialQuestions = generateDynamicQuestions(userPerformanceProfile);
    setAdaptiveQuestions(initialQuestions);
  }, []);

  useEffect(() => {
    // Analyze user performance and adapt questions
    if (Object.keys(currentAnswers).length > 0) {
      analyzeUserPerformance();
      calculateCoreCompetencyScore();
    }
  }, [currentAnswers]);

  const analyzeUserPerformance = () => {
    const answers = Object.entries(currentAnswers);
    const categoryPerformance: Record<string, number[]> = {};
    
    // Group answers by category
    answers.forEach(([questionId, score]) => {
      const question = adaptiveQuestions.find(q => q.id === questionId);
      if (question) {
        if (!categoryPerformance[question.category]) {
          categoryPerformance[question.category] = [];
        }
        categoryPerformance[question.category].push(score);
      }
    });

    // Calculate strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    Object.entries(categoryPerformance).forEach(([category, scores]) => {
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      if (average >= 4) {
        strengths.push(category);
      } else if (average <= 2) {
        weaknesses.push(category);
      }
    });

    setUserPerformanceProfile(prev => ({
      ...prev,
      strengths,
      weaknesses,
      responsePatterns: categoryPerformance
    }));

    // Regenerate questions based on new profile
    if (currentQuestionIndex < adaptiveQuestions.length - 5) {
      const newQuestions = generateDynamicQuestions({ strengths, weaknesses });
      setAdaptiveQuestions(prev => [
        ...prev.slice(0, currentQuestionIndex + 1),
        ...newQuestions.slice(currentQuestionIndex + 1)
      ]);
    }
  };

  const calculateCoreCompetencyScore = () => {
    // Calculate score for core competency questions (10 marks allocation)
    const coreCompetencyQuestions = adaptiveQuestions.filter(q => q.id.startsWith('cbc_core_'));
    const answeredCoreQuestions = coreCompetencyQuestions.filter(q => currentAnswers[q.id]);
    
    if (answeredCoreQuestions.length > 0) {
      const totalScore = answeredCoreQuestions.reduce((sum, question) => {
        return sum + (currentAnswers[question.id] || 0);
      }, 0);
      
      const maxPossibleScore = answeredCoreQuestions.length * 5; // Max score per question is 5
      const percentage = (totalScore / maxPossibleScore) * 100;
      const outOfTen = (percentage / 100) * 10; // Convert to 10 marks
      
      setCoreCompetencyScore(Math.round(outOfTen * 10) / 10); // Round to 1 decimal place
    }
  };

  const getCurrentQuestion = () => {
    return adaptiveQuestions[currentQuestionIndex];
  };

  const handleNext = () => {
    if (currentQuestionIndex < adaptiveQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getCompetencyIcon = (competency: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Critical Thinking & Problem Solving': <Brain className="w-4 h-4" />,
      'Communication & Collaboration': <Users className="w-4 h-4" />,
      'Creativity & Imagination': <Sparkles className="w-4 h-4" />,
      'Digital Literacy': <Target className="w-4 h-4" />,
      'Citizenship': <Award className="w-4 h-4" />,
      'Learning to Learn': <BookOpen className="w-4 h-4" />,
      'Self-Efficacy': <Lightbulb className="w-4 h-4" />
    };
    return icons[competency] || <Zap className="w-4 h-4" />;
  };

  if (adaptiveQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600">AI is preparing personalized questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const progress = ((currentQuestionIndex + 1) / adaptiveQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* AI Adaptive Header with Core Competency Score */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-700">AI-Adaptive Assessment</CardTitle>
                <CardDescription>
                  60 Questions • Core Competencies: {coreCompetencyScore}/10 marks
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                AI Powered
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Assessment Progress</span>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {adaptiveQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-3 mb-4" />
          
          {/* Core Competency Score Display */}
          <div className="bg-purple-50 p-3 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <span className="text-purple-700 font-medium">Core Competency Assessment</span>
              <Badge className="bg-purple-100 text-purple-800">
                {coreCompetencyScore}/10 marks
              </Badge>
            </div>
          </div>
          
          {/* Performance Indicators */}
          {userPerformanceProfile.strengths.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-medium">Strong Areas:</span>
              {userPerformanceProfile.strengths.slice(0, 3).map(strength => (
                <Badge key={strength} variant="outline" className="text-green-700 border-green-200">
                  {strength}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dynamic Question Card */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Question {currentQuestionIndex + 1}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize">
                {currentQuestion.category}
              </Badge>
              <Badge 
                variant="secondary"
                className={`${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}
              >
                {currentQuestion.difficulty}
              </Badge>
            </div>
          </div>
          
          {/* Core Competency Focus */}
          {currentQuestion.competency && (
            <div className="flex items-center gap-2 mt-2">
              {getCompetencyIcon(currentQuestion.competency)}
              <span className="text-sm font-medium text-purple-700">
                Core Competency: {currentQuestion.competency}
              </span>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <p className="text-lg font-medium">{currentQuestion.text}</p>
          </div>

          <RadioGroup
            value={currentAnswers[currentQuestion.id]?.toString() || ""}
            onValueChange={(value) => onAnswerChange(currentQuestion.id, parseInt(value))}
          >
            <div className="space-y-3">
              {[
                { value: "5", label: "Strongly Agree", desc: "This perfectly describes me" },
                { value: "4", label: "Agree", desc: "This mostly describes me" },
                { value: "3", label: "Neutral", desc: "I'm unsure about this" },
                { value: "2", label: "Disagree", desc: "This doesn't really describe me" },
                { value: "1", label: "Strongly Disagree", desc: "This definitely doesn't describe me" }
              ].map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <RadioGroupItem value={option.value} id={`q${currentQuestion.id}-${option.value}`} className="mt-1" />
                  <Label htmlFor={`q${currentQuestion.id}-${option.value}`} className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-800">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {/* Core Competency Integration Info */}
          {currentQuestion.coreCompetencyFocus.length > 0 && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <Award className="w-4 h-4" />
                This question assesses:
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentQuestion.coreCompetencyFocus.map(competency => (
                  <Badge key={competency} variant="outline" className="text-purple-700 border-purple-300">
                    {competency.replace(/([A-Z])/g, ' $1').trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={!currentAnswers[currentQuestion.id]}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {currentQuestionIndex < adaptiveQuestions.length - 1 ? 'Next Question' : 'Complete Assessment'}
        </Button>
      </div>
    </div>
  );
};
