'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cbcQuestions } from '../../data/cbcQuestions';
import { Clock, BookOpen } from 'lucide-react';

interface CBCLearningAreasProps {
  onNext: (data: any) => void;
  onPrevious?: () => void;
  data: any;
}

export const CBCLearningAreas: React.FC<CBCLearningAreasProps> = ({ onNext, onPrevious, data }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(data.learningAreas || {});
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
  };

  const handleNext = () => {
    if (currentQuestion < cbcQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    onNext({ learningAreas: answers });
  };

  const currentQ = cbcQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / cbcQuestions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;
  const isComplete = answeredQuestions === cbcQuestions.length;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold">CBC Learning Areas Assessment</h3>
          <p className="text-gray-600">
            Grade 7-9 Rationalized Curriculum Simulation
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Clock className="w-5 h-5" />
            <span className={timeRemaining < 300 ? 'text-red-500' : 'text-green-600'}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {answeredQuestions} / {cbcQuestions.length} completed
          </div>
        </div>
      </div>

      <Progress value={progress} className="h-3" />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">
                Question {currentQuestion + 1} of {cbcQuestions.length}
              </CardTitle>
            </div>
            <div className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              {currentQ.category}
            </div>
          </div>
          <CardDescription className="text-base">
            Learning Area: {currentQ.learningArea}
          </CardDescription>
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
                { value: "5", label: "Strongly Agree", desc: "This perfectly describes my learning preference" },
                { value: "4", label: "Agree", desc: "This describes my learning preference well" },
                { value: "3", label: "Neutral", desc: "I'm unsure about this learning preference" },
                { value: "2", label: "Disagree", desc: "This does not describe my learning preference" },
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
          {currentQuestion < cbcQuestions.length - 1 ? (
            <Button 
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
            >
              Next Question
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!isComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Assessment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
