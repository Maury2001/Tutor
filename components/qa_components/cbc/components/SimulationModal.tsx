
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calculator, Brain, Target, CheckCircle } from 'lucide-react';

interface Question {
  text: string;
  type: 'input' | 'multiple-choice';
  options?: string[];
  correctAnswer: string;
  hint: string;
}

interface SimulationData {
  name: string;
  questions: Question[];
  difficulty: string;
}

interface SimulationModalProps {
  showModal: boolean;
  simulationData: SimulationData | null;
  currentQuestion: number;
  currentAnswer: string;
  showFeedback: boolean;
  isCorrect: boolean;
  showHint: boolean;
  onClose: () => void;
  onAnswerChange: (value: string) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onShowHint: () => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  showModal,
  simulationData,
  currentQuestion,
  currentAnswer,
  showFeedback,
  isCorrect,
  showHint,
  onClose,
  onAnswerChange,
  onSubmitAnswer,
  onNextQuestion,
  onShowHint
}) => {
  if (!showModal || !simulationData) return null;

  const getCurrentQuestion = () => {
    return simulationData.questions[currentQuestion];
  };

  const renderQuestionInput = () => {
    const question = getCurrentQuestion();
    if (!question) return null;

    if (question.type === 'multiple-choice') {
      return (
        <RadioGroup value={currentAnswer} onValueChange={onAnswerChange} className="space-y-3">
          {question.options?.map((option: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    return (
      <div className="space-y-3">
        <Label htmlFor="answer">Your Answer:</Label>
        <Input
          id="answer"
          value={currentAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Enter your answer here..."
          className="text-lg"
        />
      </div>
    );
  };

  const question = getCurrentQuestion();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold">{simulationData.name}</h3>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {simulationData.questions.length}
            </span>
            <Badge variant="outline">
              {simulationData.difficulty}
            </Badge>
          </div>
          <Progress 
            value={((currentQuestion + 1) / simulationData.questions.length) * 100} 
            className="h-2" 
          />
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold">Challenge Question</h4>
            </div>
            
            <div className="space-y-4">
              <p className="text-lg font-medium">
                {question?.text}
              </p>
              
              {renderQuestionInput()}
              
              {showFeedback && (
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Target className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? 'Correct!' : 'Not quite right'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <p className="text-red-700">
                      The correct answer is: <strong>{question?.correctAnswer}</strong>
                    </p>
                  )}
                </div>
              )}
              
              {showHint && question?.hint && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800">
                    <strong>Hint:</strong> {question.hint}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-6">
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Exit Simulation
                </Button>
                {!showFeedback && question?.hint && (
                  <Button 
                    variant="outline"
                    onClick={onShowHint}
                    disabled={showHint}
                  >
                    {showHint ? 'Hint Shown' : 'Show Hint'}
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {!showFeedback ? (
                  <Button 
                    onClick={onSubmitAnswer}
                    disabled={!currentAnswer.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Answer
                    <Target className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={onNextQuestion}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {currentQuestion + 1 >= simulationData.questions.length ? 'Complete Simulation' : 'Next Question'}
                    <Target className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
