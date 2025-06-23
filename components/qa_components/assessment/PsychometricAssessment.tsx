'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Brain, Target, CheckCircle, ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { psychometricQuestions } from './data/psychometricQuestions';
import { PsychometricResults } from './PsychometricResults';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const PsychometricAssessment = () => {
  const navigate = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStarted && timeRemaining > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            handleFinishAssessment();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isStarted, timeRemaining, showResults]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
  };

  const handleNext = () => {
    if (currentQuestion < psychometricQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinishAssessment = () => {
    toast.success('Psychometric assessment completed!');
    setShowResults(true);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTimeRemaining(60 * 60);
    setIsStarted(false);
  };

  const handleReturnToMain = () => {
    navigate.push('/assessment');
  };

  const progress = ((currentQuestion + 1) / psychometricQuestions.length) * 100;
  const currentQ = psychometricQuestions[currentQuestion];
  const answeredQuestions = Object.keys(answers).length;
  const isComplete = answeredQuestions === psychometricQuestions.length;

  if (showResults) {
    return <PsychometricResults answers={answers} questions={psychometricQuestions} onRetake={handleRetake} />;
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={handleReturnToMain}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Return to Main Page
            </Button>
            <div className="w-40"></div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
                <CardTitle className="text-3xl font-bold text-purple-700">
                  Comprehensive Psychometric Assessment
                </CardTitle>
              </div>
              <CardDescription className="text-lg">
                Advanced psychological evaluation for Grade 10-12 pathway and career guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Assessment Overview
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>• 50 comprehensive psychometric questions</p>
                    <p>• 4 key psychological domains</p>
                    <p>• 60 minutes to complete</p>
                    <p>• CBC pathway recommendations</p>
                    <p>• Career cluster analysis</p>
                    <p>• AI-powered career counseling</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Assessment Domains</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Badge variant="outline" className="p-2 text-center">
                      Cognitive Abilities
                    </Badge>
                    <Badge variant="outline" className="p-2 text-center">
                      Personality Traits
                    </Badge>
                    <Badge variant="outline" className="p-2 text-center">
                      Emotional Intelligence
                    </Badge>
                    <Badge variant="outline" className="p-2 text-center">
                      Behavioral Skills
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button onClick={() => setIsStarted(true)} size="lg" className="px-8 bg-purple-600 hover:bg-purple-700">
                  <Brain className="w-4 h-4 mr-2" />
                  Start Psychometric Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleReturnToMain}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Main Page
            </Button>
            <div>
              <h3 className="text-xl font-semibold">Psychometric Assessment</h3>
              <p className="text-gray-600">Grade 9 Career & Pathway Evaluation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-medium">
              <Clock className="w-5 h-5" />
              <span className={timeRemaining < 600 ? 'text-red-500' : 'text-green-600'}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {answeredQuestions} / {psychometricQuestions.length} completed
            </div>
          </div>
        </div>

        <Progress value={progress} className="h-3" />

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Question {currentQuestion + 1} of {psychometricQuestions.length}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{currentQ.category}</Badge>
                {currentQ.cbcLearningArea && (
                  <Badge variant="secondary">{currentQ.cbcLearningArea}</Badge>
                )}
                {currentQ.riasecType && (
                  <Badge variant="default">{currentQ.riasecType}</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-lg">{currentQ.text}</p>
            </div>

            <RadioGroup
              value={answers[currentQ.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
            >
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: "5", label: "Strongly Agree", desc: "This completely describes me" },
                  { value: "4", label: "Agree", desc: "This mostly describes me" },
                  { value: "3", label: "Neutral", desc: "I'm unsure or this sometimes describes me" },
                  { value: "2", label: "Disagree", desc: "This rarely describes me" },
                  { value: "1", label: "Strongly Disagree", desc: "This does not describe me at all" }
                ].map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value} id={`q${currentQ.id}-${option.value}`} />
                    <Label htmlFor={`q${currentQ.id}-${option.value}`} className="flex-1 cursor-pointer">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {currentQ.cbcCoreValue && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>CBC Core Value:</strong> {currentQ.cbcCoreValue}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReturnToMain}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Main Page
            </Button>
          </div>
          
          <div className="flex gap-2">
            {currentQuestion < psychometricQuestions.length - 1 ? (
              <Button 
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleFinishAssessment}
                disabled={!isComplete}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                Complete Assessment
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
