'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, Zap, CheckCircle, TrendingUp, BookOpen, Users, Home, User, MessageCircle } from 'lucide-react';
import { AICounselorChat } from '../../../components/qa_components/cbc/AICounselorChat';
import { useRouter } from 'next/navigation';

interface PsychometricResultsProps {
  answers: Record<number, number>;
  questions: any[];
  onRetake: () => void;
}

export const PsychometricResults: React.FC<PsychometricResultsProps> = ({ 
  answers, 
  questions, 
  onRetake 
}) => {
  const navigate = useRouter();
  const [showAICounselor, setShowAICounselor] = React.useState(false);

  // Calculate scores for each category
  const calculateScores = () => {
    const initialScores = {
      cognitive: 0,
      personality: 0,
      behavioral: 0,
    };

    return questions.reduce((scores, question) => {
      const answerValue = answers[question.id] || 0;

      switch (question.category) {
        case 'Cognitive':
          scores.cognitive += answerValue;
          break;
        case 'Personality':
          scores.personality += answerValue;
          break;
        case 'Behavioral':
          scores.behavioral += answerValue;
          break;
        default:
          break;
      }

      return scores;
    }, initialScores);
  };

  const psychometricScores = calculateScores();

  // Determine pathway recommendations based on scores
  const determinePathwayRecommendations = () => {
    const recommendations = [];

    // Example logic - adjust based on your specific criteria
    if (psychometricScores.cognitive > 10 && psychometricScores.personality > 8) {
      recommendations.push({ name: 'STEM (10.3)', description: 'Science, Technology, Engineering, Mathematics' });
    }
    if (psychometricScores.personality > 12 && psychometricScores.behavioral > 10) {
      recommendations.push({ name: 'SSC (10.2)', description: 'Social Sciences' });
    }
    if (psychometricScores.behavioral > 15) {
      recommendations.push({ name: 'ASS (10.1)', description: 'Arts and Sports Science' });
    }

    return recommendations;
  };

  const pathwayRecommendations = determinePathwayRecommendations();

  // Generate psychometric profile summary
  const generatePsychometricProfile = () => {
    const profile = [];

    if (psychometricScores.cognitive > 12) {
      profile.push('Strong Cognitive Abilities');
    } else {
      profile.push('Needs Improvement in Cognitive Skills');
    }

    if (psychometricScores.personality > 10) {
      profile.push('Positive Personality Traits');
    } else {
      profile.push('Needs Improvement in Personality Traits');
    }

    if (psychometricScores.behavioral > 13) {
      profile.push('Adaptive Behavioral Patterns');
    } else {
      profile.push('Needs Improvement in Behavioral Patterns');
    }

    return profile;
  };

  const psychometricProfile = generatePsychometricProfile();

  // Calculate total score and possible score
  const actualScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
  const totalPossibleScore = questions.length * 5; // Assuming max score of 5 for each question

  if (showAICounselor) {
    return (
      <AICounselorChat 
        onNext={() => setShowAICounselor(false)}
        data={{
          psychometricScores,
          pathwayRecommendations,
          totalScore: actualScore,
          maxScore: totalPossibleScore,
          completionPercentage: Math.round((actualScore / totalPossibleScore) * 100),
          psychometricProfile
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate.push('/assessment')}
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
                Psychometric Assessment Results
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Analysis of cognitive abilities, personality traits, and behavioral patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <h4 className="text-2xl font-semibold text-gray-800">
                Overall Score: {actualScore} / {totalPossibleScore}
              </h4>
              <Progress value={Math.round((actualScore / totalPossibleScore) * 100)} className="h-4" />
              <p className="text-sm text-gray-600 mt-2">
                Completion: {Math.round((actualScore / totalPossibleScore) * 100)}%
              </p>
            </div>

            {/* Category Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    Cognitive Abilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-800">{psychometricScores.cognitive} / {questions.filter(q => q.category === 'Cognitive').length * 5}</p>
                  <Progress value={Math.round((psychometricScores.cognitive / (questions.filter(q => q.category === 'Cognitive').length * 5)) * 100)} className="h-2" />
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Personality Traits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-800">{psychometricScores.personality} / {questions.filter(q => q.category === 'Personality').length * 5}</p>
                  <Progress value={Math.round((psychometricScores.personality / (questions.filter(q => q.category === 'Personality').length * 5)) * 100)} className="h-2" />
                </CardContent>
              </Card>

              <Card className="bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Behavioral Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-purple-800">{psychometricScores.behavioral} / {questions.filter(q => q.category === 'Behavioral').length * 5}</p>
                  <Progress value={Math.round((psychometricScores.behavioral / (questions.filter(q => q.category === 'Behavioral').length * 5)) * 100)} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Pathway Recommendations */}
            {pathwayRecommendations.length > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Recommended CBE Pathways
                </h3>
                <ul className="list-disc list-inside space-y-2 text-blue-700">
                  {pathwayRecommendations.map((pathway, index) => (
                    <li key={index}>
                      <strong>{pathway.name}:</strong> {pathway.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Psychometric Profile Summary */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Psychometric Profile Summary
              </h3>
              <ul className="list-disc list-inside space-y-2 text-green-700">
                {psychometricProfile.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* AI Counselor Chat */}
            <div className="text-center">
              <Button 
                onClick={() => setShowAICounselor(true)}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with AI Career Counselor
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={onRetake}
                variant="outline"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
