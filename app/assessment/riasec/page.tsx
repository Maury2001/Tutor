import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AssessmentQuestion } from '../../../components/qa_components/riasec/AssessmentQuestion';
import { CBCAssessmentResults } from '../../../components/qa_components/riasec/CBCAssessmentResults';
import { cbcQuestions } from '../../../components/data/cbcQuestions';
import { calculateCBCScores, CBCScores } from '@/utils/cbcScoring';
import { Clock, BookOpen, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

export type { CBCScores };

const CBCAssessment = () => {
  const navigate = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState<CBCScores | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeRemaining > 0 && !showResults) {
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
  }, [isTimerActive, timeRemaining, showResults]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartAssessment = () => {
    setIsTimerActive(true);
  };

  const handleAnswer = (rating: number) => {
    const questionId = cbcQuestions[currentQuestionIndex].id;
    setAnswers(prev => ({ ...prev, [questionId]: rating }));
    
    if (!isTimerActive) {
      setIsTimerActive(true);
    }
    
    if (currentQuestionIndex < cbcQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinishAssessment();
    }
  };

  const handleFinishAssessment = () => {
    const calculatedScores = calculateCBCScores(answers);
    setScores(calculatedScores);
    setShowResults(true);
    setIsTimerActive(false);
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setScores(null);
    setTimeRemaining(60 * 60);
    setIsTimerActive(false);
  };

  const progress = ((currentQuestionIndex + 1) / cbcQuestions.length) * 100;
  const currentQuestion = cbcQuestions[currentQuestionIndex];

  if (showResults && scores) {
    return <CBCAssessmentResults scores={scores} onRetake={handleRetake} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate.push('/assessment')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-8 h-8 text-green-600" />
              <CardTitle className="text-3xl font-bold text-green-700">
                CBC Learning Areas Assessment
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Discover your learning preferences across CBC curriculum areas (Grades 6-9)
            </CardDescription>
            
            <div className="flex justify-between items-center mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">
                  Time Remaining: {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="text-blue-800">
                <span className="font-medium">
                  Question {currentQuestionIndex + 1} of {cbcQuestions.length}
                </span>
              </div>
            </div>
            
            <Progress value={progress} className="h-3 mt-4" />
          </CardHeader>
        </Card>

        {!isTimerActive && currentQuestionIndex === 0 ? (
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Ready to Begin?</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  This assessment contains 40 questions covering all CBC learning areas. 
                  You have 60 minutes to complete it. Answer honestly based on your interests and preferences.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800">Mathematics</div>
                    <div className="text-green-600">8 questions</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800">Sciences</div>
                    <div className="text-blue-600">8 questions</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-800">Languages</div>
                    <div className="text-purple-600">10 questions</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium text-orange-800">Social Studies</div>
                    <div className="text-orange-600">6 questions</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="font-medium text-red-800">Creative Arts</div>
                    <div className="text-red-600">3 questions</div>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <div className="font-medium text-teal-800">PE & Health</div>
                    <div className="text-teal-600">5 questions</div>
                  </div>
                </div>
              </div>
              <Button onClick={handleStartAssessment} size="lg" className="px-8">
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AssessmentQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
          />
        )}

        {isTimerActive && (
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={handleFinishAssessment}
              className="mt-4"
            >
              Finish Assessment Early
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CBCAssessment;
