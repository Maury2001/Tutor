'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Clock, ArrowLeft, ArrowRight, Home, Brain, Target, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { psychometricQuestions } from '../../../components/qa_components/assessment/data/psychometricQuestions';
import { QuestionDisplay } from '../../../components/qa_components/assessment/components/QuestionDisplay';

const psychometricCategories = [
  {
    type: "cognitive",
    name: "Cognitive Abilities",
    description: "Problem-solving, memory, and analytical thinking",
    icon: Brain,
    color: "bg-blue-100 text-blue-800",
    questions: psychometricQuestions.filter(q => q.psychometricType === 'cognitive')
  },
  {
    type: "personality",
    name: "Personality Assessment", 
    description: "Leadership, motivation, and personal traits",
    icon: Target,
    color: "bg-green-100 text-green-800",
    questions: psychometricQuestions.filter(q => q.psychometricType === 'personality')
  },
  {
    type: "emotional",
    name: "Emotional Intelligence",
    description: "Understanding and managing emotions",
    icon: Zap,
    color: "bg-purple-100 text-purple-800",
    questions: psychometricQuestions.filter(q => q.psychometricType === 'emotional')
  },
  {
    type: "behavioral",
    name: "Behavioral Skills",
    description: "Adaptability and decision-making abilities",
    icon: CheckCircle,
    color: "bg-orange-100 text-orange-800",
    questions: psychometricQuestions.filter(q => q.psychometricType === 'behavioral')
  }
];

interface PsychomotorTestProps {
  onNext: (data: any) => void;
  onPrevious?: () => void;
  data: any;
}

export const PsychomotorTest: React.FC<PsychomotorTestProps> = ({ onNext, onPrevious, data }) => {
  const navigate = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(data.psychomotor_answers || {});
  const [showQuestions, setShowQuestions] = useState(false);

  const handleStartAssessment = () => {
    console.log('Starting psychometric question assessment');
    console.log('Total psychometric questions:', psychometricQuestions.length);
    psychometricCategories.forEach(cat => {
      console.log(`${cat.name}: ${cat.questions.length} questions`);
    });
    setShowQuestions(true);
    setCurrentQuestionIndex(0);
    toast.info('Starting psychometric assessment...');
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    console.log('Answer changed:', questionId, value);
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < psychometricQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleCompleteAssessment();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleCompleteAssessment = () => {
    console.log('Completing psychometric assessment with answers:', answers);
    toast.success('Psychometric assessment completed!');
    onNext({ 
      psychomotor: true,
      psychomotor_answers: answers,
      psychomotor_scores: calculatePsychometricScores(answers)
    });
  };

  const calculatePsychometricScores = (answers: Record<number, number>) => {
    const scores: Record<string, number> = {};
    
    psychometricCategories.forEach(category => {
      const categoryAnswers = category.questions
        .filter(q => answers[q.id])
        .map(q => answers[q.id]);
      
      if (categoryAnswers.length > 0) {
        scores[category.type] = categoryAnswers.reduce((sum, score) => sum + score, 0) / categoryAnswers.length;
      } else {
        scores[category.type] = 0;
      }
    });
    
    return scores;
  };

  const handleReturnToMain = () => {
    console.log('Return to main page clicked');
    navigate.push('/assessment');
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = psychometricQuestions.length;
  const progress = (answeredCount / totalQuestions) * 100;
  const isComplete = answeredCount >= Math.ceil(totalQuestions * 0.7); // 70% completion required

  console.log('Psychometric Assessment State:', {
    totalQuestions,
    answeredCount,
    isComplete,
    showQuestions,
    currentQuestionIndex,
    psychometricQuestions: psychometricQuestions.slice(0, 3) // Log first 3 questions for debugging
  });

  if (showQuestions) {
    const currentQuestion = psychometricQuestions[currentQuestionIndex];
    
    return (
      <div className="space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleReturnToMain}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Main Page
          </Button>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold">Psychometric Assessment</h3>
            <p className="text-gray-600 text-sm">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
        </div>

        {/* Question Display */}
        <QuestionDisplay
          question={currentQuestion}
          currentQuestion={currentQuestionIndex}
          totalQuestions={totalQuestions}
          selectedAnswer={answers[currentQuestion.id]}
          onAnswerChange={handleAnswerChange}
        />

        {/* Navigation Footer */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex gap-2">
            {onPrevious && (
              <Button 
                type="button"
                variant="outline" 
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Previous step clicked');
                  onPrevious();
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Step
              </Button>
            )}
            
            <Button 
              type="button"
              variant="outline" 
              onClick={handleReturnToMain}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Main Page
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              type="button"
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Question
            </Button>
            
            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button 
                type="button"
                onClick={handleNextQuestion}
                disabled={!answers[currentQuestion.id]}
                className="flex items-center gap-2"
              >
                Next Question
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={handleCompleteAssessment}
                disabled={!answers[currentQuestion.id]}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                Complete Assessment
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          type="button"
          variant="outline" 
          onClick={handleReturnToMain}
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Return to Main Page
        </Button>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold">Psychometric Assessment</h3>
          <p className="text-gray-600 text-sm">
            Complete psychological assessments to evaluate your cognitive abilities
          </p>
        </div>
        
        <div className="w-40"></div>
      </div>

      {/* Assessment Overview */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-700 flex items-center justify-center gap-2">
            <Brain className="w-6 h-6" />
            Psychometric Assessment Overview
          </CardTitle>
          <CardDescription className="text-lg">
            {totalQuestions} research-based questions across 4 key psychological domains
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {psychometricCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.type} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold">{category.name}</h4>
                    <Badge variant="outline" className={category.color}>
                      {category.questions.length} questions
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="text-center pt-4">
            <Button 
              type="button"
              onClick={handleStartAssessment}
              size="lg"
              className="px-8 bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Psychometric Assessment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Navigation Footer */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="flex gap-2">
          {onPrevious && (
            <Button 
              type="button"
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                console.log('Previous button clicked');
                onPrevious();
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Step
            </Button>
          )}
          
          <Button 
            type="button"
            variant="outline" 
            onClick={handleReturnToMain}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Main Page
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            type="button"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              console.log('Skip psychometric assessment clicked');
              toast.info('Skipping psychometric assessment');
              onNext({ psychomotor: false, psychomotor_answers: {} });
            }}
            className="text-gray-600"
          >
            Skip Assessment
          </Button>
          
          <Button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log('Continue without assessment clicked');
              toast.info('Continuing without full assessment');
              onNext({ 
                psychomotor: answeredCount > 0,
                psychomotor_answers: answers,
                psychomotor_scores: answeredCount > 0 ? calculatePsychometricScores(answers) : {}
              });
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
