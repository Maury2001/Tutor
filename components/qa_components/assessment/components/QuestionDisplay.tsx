
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Question {
  id: number;
  text: string;
  category: string;
  riasecType?: string;
  cbcLearningArea?: string;
  cbcCoreValue?: string;
  cbcCompetency?: string;
  kenyanContext?: boolean;
}

interface QuestionDisplayProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer?: number;
  onAnswerChange: (questionId: number, value: string) => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerChange
}) => {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'riasec': return 'Career Interest';
      case 'cbc_learning': return 'Learning Area';
      case 'cbc_values': return 'Core Values';
      case 'cbc_competencies': return 'Competencies';
      default: return category;
    }
  };

  // Kid-friendly response options
  const responseOptions = [
    { value: "5", label: "Yes, that's totally me!", desc: "This really describes me well" },
    { value: "4", label: "Yes, mostly me", desc: "This describes me most of the time" },
    { value: "3", label: "Sometimes me", desc: "I'm not sure or this sometimes fits me" },
    { value: "2", label: "Not really me", desc: "This doesn't really describe me" },
    { value: "1", label: "No, not me at all", desc: "This definitely doesn't describe me" }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Question {currentQuestion + 1} of {totalQuestions}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="capitalize">
              {getCategoryLabel(question.category)}
            </Badge>
            {question.kenyanContext && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Kenya Focus
              </Badge>
            )}
            {question.cbcLearningArea && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {question.cbcLearningArea}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-lg font-medium text-gray-800">{question.text}</p>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800 font-medium">
            💡 Think about yourself: How much does this statement describe you?
          </p>
        </div>

        <RadioGroup
          value={selectedAnswer?.toString() || ""}
          onValueChange={(value) => onAnswerChange(question.id, value)}
        >
          <div className="grid grid-cols-1 gap-3">
            {responseOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all">
                <RadioGroupItem value={option.value} id={`q${question.id}-${option.value}`} className="mt-1" />
                <Label htmlFor={`q${question.id}-${option.value}`} className="flex-1 cursor-pointer">
                  <div className="font-semibold text-gray-800">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
