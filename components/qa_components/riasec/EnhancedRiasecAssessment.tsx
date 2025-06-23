'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAIValidation } from '@/hooks/useAIValidation';
import { useProgressTracker } from '@/hooks/useProgressTracker';
import { AssessmentValidator } from '../../../components/qa_components/ai/AssessmentValidator';
import { riasecCbcQuestions } from '../../../components/data/riasecCbcQuestions';
import { Clock, Brain, Target, AlertTriangle, Shield } from 'lucide-react';

export const EnhancedRiasecAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { validateAssessmentResponse, detectAnomalousPattern, isValidating } = useAIValidation();
  const { progress, saveProgress, checkForDuplicateAssessment, isLoading } = useProgressTracker('riasec-cbc');

  useEffect(() => {
    // Check for duplicate assessments on component mount
    checkDuplicates();
  }, []);

  useEffect(() => {
    // Save progress whenever answers change
    if (progress && Object.keys(answers).length > 0) {
      saveProgress({
        currentStep: currentQuestion,
        responses: Object.entries(answers).map(([id, value]) => ({ questionId: parseInt(id), response: value })),
        timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      });
    }
  }, [answers, currentQuestion]);

  const checkDuplicates = async () => {
    const userId = localStorage.getItem('userId') || 'anonymous';
    const hasDuplicate = await checkForDuplicateAssessment(userId);
    
    if (hasDuplicate) {
      setShowDuplicateWarning(true);
    }
  };

  const handleAnswerChange = async (questionId: number, value: string) => {
    const responseTime = new Date().getTime() - questionStartTime.getTime();
    const numValue = parseInt(value);
    
    // Update answers immediately for UI responsiveness
    setAnswers(prev => ({ ...prev, [questionId]: numValue }));
    
    // AI validation for suspicious patterns
    const userPattern = {
      averageResponseTime: responseTime,
      responsePattern: Object.values(answers),
      currentStreak: getCurrentStreak(numValue)
    };

    const validation = await validateAssessmentResponse(
      questionId,
      numValue,
      responseTime,
      userPattern
    );

    setValidationResult(validation);
  };

  const getCurrentStreak = (currentResponse: number) => {
    const recentResponses = Object.values(answers).slice(-5);
    let streak = 0;
    for (let i = recentResponses.length - 1; i >= 0; i--) {
      if (recentResponses[i] === currentResponse) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const handleNext = async () => {
    setIsProcessing(true);
    
    // Check for anomalous patterns every 10 questions
    if (currentQuestion % 10 === 0 && currentQuestion > 0) {
      const userResponses = Object.entries(answers).map(([id, value]) => ({
        questionId: parseInt(id),
        response: value,
        timestamp: new Date().toISOString()
      }));
      
      const anomalies = await detectAnomalousPattern(userResponses);
      
      if (anomalies.hasAnomalies) {
        console.log('Anomalous patterns detected:', anomalies.patterns);
        // Could show warning or require additional verification
      }
    }

    if (currentQuestion < riasecCbcQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setQuestionStartTime(new Date());
      setValidationResult(null);
    }
    
    setIsProcessing(false);
  };

  const handleValidationComplete = (isValid: boolean) => {
    if (isValid) {
      setValidationResult(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600">Loading AI-Enhanced Assessment...</p>
        </div>
      </div>
    );
  }

  const currentQ = riasecCbcQuestions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / riasecCbcQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Enhanced Header with AI Indicators */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Target className="w-6 h-6 text-green-600" />
              AI-Enhanced RIASEC Assessment
              <Badge variant="outline" className="ml-auto">
                <Shield className="w-3 h-3 mr-1" />
                AI Protected
              </Badge>
            </CardTitle>
            <CardDescription>
              Advanced career assessment with AI validation and progress tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {riasecCbcQuestions.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* AI Validation Display */}
        {validationResult && validationResult.confidence < 0.8 && (
          <AssessmentValidator
            validationResult={validationResult}
            onValidationComplete={handleValidationComplete}
          />
        )}

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Question {currentQuestion + 1}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{currentQ.category}</Badge>
                {currentQ.cbcValue && (
                  <Badge variant="secondary">{currentQ.cbcValue}</Badge>
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
              disabled={isValidating || isProcessing}
            >
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: "5", label: "Strongly Like", desc: "I would really enjoy this activity" },
                  { value: "4", label: "Like", desc: "I would enjoy this activity" },
                  { value: "3", label: "Neutral", desc: "I'm unsure about this activity" },
                  { value: "2", label: "Dislike", desc: "I would not enjoy this activity" },
                  { value: "1", label: "Strongly Dislike", desc: "I would really not enjoy this activity" }
                ].map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={option.value} id={`q${currentQ.id}-${option.value}`} />
                    <Label htmlFor={`q${currentQ.id}-${option.value}`} className="flex-1 cursor-pointer">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {isValidating && (
              <div className="flex items-center gap-2 text-blue-600">
                <Brain className="w-4 h-4 animate-pulse" />
                <span className="text-sm">AI validating response...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            disabled={currentQuestion === 0 || isProcessing}
          >
            Previous
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!answers[currentQ.id] || isValidating || isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              currentQuestion < riasecCbcQuestions.length - 1 ? 'Next Question' : 'Complete Assessment'
            )}
          </Button>
        </div>

        {/* Duplicate Assessment Warning */}
        <AlertDialog open={showDuplicateWarning} onOpenChange={setShowDuplicateWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Previous Assessment Detected
              </AlertDialogTitle>
              <AlertDialogDescription>
                Our AI system has detected that you may have completed this assessment recently. 
                Taking the same assessment multiple times within a short period may affect the accuracy of your results.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setShowDuplicateWarning(false)}>
                Continue Anyway
              </Button>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
