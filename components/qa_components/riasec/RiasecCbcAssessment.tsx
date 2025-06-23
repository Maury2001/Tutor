
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { riasecCbcQuestions, cbcValues } from '../../../components/data/riasecCbcQuestions';
import { RiasecCbcResults } from './RiasecCbcResults';
import { calculateRiasecCbcScores } from '@/utils/riasecCbcScoring';
import { Clock, Brain, Target, Heart } from 'lucide-react';

export const RiasecCbcAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes
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
    if (currentQuestion < riasecCbcQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinishAssessment = () => {
    setShowResults(true);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTimeRemaining(45 * 60);
    setIsStarted(false);
  };

  const progress = ((currentQuestion + 1) / riasecCbcQuestions.length) * 100;
  const currentQ = riasecCbcQuestions[currentQuestion];
  const answeredQuestions = Object.keys(answers).length;
  const isComplete = answeredQuestions === riasecCbcQuestions.length;

  if (showResults) {
    const { riasecScores, valuesScores } = calculateRiasecCbcScores(answers);
    return <RiasecCbcResults riasecScores={riasecScores} valuesScores={valuesScores} onRetake={handleRetake} />;
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Target className="w-8 h-8 text-green-600" />
                <CardTitle className="text-3xl font-bold text-green-700">
                  CBC RIASEC Career Pathway Assessment
                </CardTitle>
              </div>
              <CardDescription className="text-lg">
                Grade 9 Career Interest Assessment for CBC Pathway Selection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                    Assessment Overview
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>• 45 questions covering 6 career interest areas</p>
                    <p>• 45 minutes to complete</p>
                    <p>• CBC values integration</p>
                    <p>• Grade 10-12 pathway recommendations</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    CBC Core Values
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(cbcValues).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="p-1 text-center">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button onClick={() => setIsStarted(true)} size="lg" className="px-8">
                  <Target className="w-4 h-4 mr-2" />
                  Start Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold">CBC RIASEC Career Assessment</h3>
            <p className="text-gray-600">Grade 9 Pathway Selection Tool</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-medium">
              <Clock className="w-5 h-5" />
              <span className={timeRemaining < 300 ? 'text-red-500' : 'text-green-600'}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {answeredQuestions} / {riasecCbcQuestions.length} completed
            </div>
          </div>
        </div>

        <Progress value={progress} className="h-3" />

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Question {currentQuestion + 1} of {riasecCbcQuestions.length}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{currentQ.category}</Badge>
                {currentQ.cbcValue && (
                  <Badge variant="secondary">{currentQ.cbcValue}</Badge>
                )}
                {currentQ.learningArea && (
                  <Badge variant="default">{currentQ.learningArea}</Badge>
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
                  { value: "5", label: "Strongly Like", desc: "I would really enjoy this activity" },
                  { value: "4", label: "Like", desc: "I would enjoy this activity" },
                  { value: "3", label: "Neutral", desc: "I'm unsure about this activity" },
                  { value: "2", label: "Dislike", desc: "I would not enjoy this activity" },
                  { value: "1", label: "Strongly Dislike", desc: "I would really not enjoy this activity" }
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

            {currentQ.cbcValue && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>CBC Value:</strong> {cbcValues[currentQ.cbcValue]}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentQuestion < riasecCbcQuestions.length - 1 ? (
              <Button 
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
              >
                Next Question
              </Button>
            ) : (
              <Button 
                onClick={handleFinishAssessment}
                disabled={!isComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Assessment
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
