
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Question {
  id: number;
  text: string;
  category: string;
}

interface AssessmentQuestionProps {
  question: Question;
  onAnswer: (rating: number) => void;
  questionNumber: number;
}

export const AssessmentQuestion: React.FC<AssessmentQuestionProps> = ({
  question,
  onAnswer,
  questionNumber,
}) => {
  const ratingOptions = [
    { value: 1, label: 'Strongly Dislike', color: 'bg-red-500' },
    { value: 2, label: 'Dislike', color: 'bg-orange-500' },
    { value: 3, label: 'Neutral', color: 'bg-gray-500' },
    { value: 4, label: 'Like', color: 'bg-blue-500' },
    { value: 5, label: 'Strongly Like', color: 'bg-green-500' },
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">
          Question {questionNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium text-gray-800 leading-relaxed">
          {question.text}
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600 text-center mb-4">
            How much would you enjoy this activity?
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {ratingOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => onAnswer(option.value)}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:scale-105 transition-transform"
              >
                <div className={`w-4 h-4 rounded-full ${option.color}`} />
                <span className="text-xs font-medium">{option.label}</span>
                <span className="text-lg font-bold">{option.value}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Category: {question.category}
        </div>
      </CardContent>
    </Card>
  );
};
