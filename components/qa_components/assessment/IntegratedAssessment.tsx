'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Brain, Target, CheckCircle, ArrowLeft, ArrowRight, Home, BookOpen, Users, GraduationCap, School } from 'lucide-react';
import { psychometricQuestions } from './data/psychometricQuestions';
import { cbcQuestions } from '../../data/cbcQuestions';
import { questions as riasecQuestions } from '../../data/riasecQuestions';
import { IntegratedResults } from './IntegratedResults';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { integratedQuestions, createShuffledQuestions } from '../../data/integratedQuestions';

interface LearnerProfile {
  learnerName: string;
  currentGrade: string;
  schoolName: string;
  assessmentDate: string;
}

const shuffledQuestions = createShuffledQuestions();

export const IntegratedAssessment = () => {
  const navigate = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes
  const [isStarted, setIsStarted] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>({
    learnerName: '',
    currentGrade: '',
    schoolName: '',
    assessmentDate: new Date().toLocaleDateString()
  });

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

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log('Answer changed:', questionId, value); // Debug log
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
  };

  const handleNext = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinishAssessment = () => {
    const answeredQuestions = Object.keys(answers).length;
    const totalQuestions = shuffledQuestions.length;
    
    console.log('Assessment completion check:', { answeredQuestions, totalQuestions, answers });
    
    if (answeredQuestions < totalQuestions) {
      toast.error(`Please answer all questions. You have answered ${answeredQuestions} out of ${totalQuestions} questions.`);
      
      // Find and show missing questions
      const missingQuestions = shuffledQuestions
        .filter(q => !answers[q.id])
        .map((q, index) => `Question ${shuffledQuestions.indexOf(q) + 1}: ${q.text.substring(0, 50)}...`);
      
      console.log('Missing questions:', missingQuestions);
      
      if (missingQuestions.length <= 5) {
        toast.error(`Missing: ${missingQuestions.join(', ')}`);
      }
      return;
    }
    
    toast.success('CBC Integrated Assessment completed successfully!');
    setShowResults(true);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTimeRemaining(60 * 60);
    setIsStarted(false);
    setShowProfileForm(false);
  };

  const handleReturnToMain = () => {
    navigate.push('/assessment');
  };

  const handleStartAssessment = () => {
    if (!learnerProfile.learnerName || !learnerProfile.currentGrade || !learnerProfile.schoolName) {
      toast.error('Please fill in all learner profile information');
      return;
    }
    setShowProfileForm(false);
    setIsStarted(true);
  };

  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;
  const currentQ = shuffledQuestions[currentQuestion];
  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = shuffledQuestions.length;
  const isComplete = answeredQuestions === totalQuestions;
  const currentQuestionAnswered = answers[currentQ.id] !== undefined;

  if (showResults) {
    return <IntegratedResults 
      answers={answers} 
      questions={shuffledQuestions} 
      onRetake={handleRetake}
      learnerProfile={learnerProfile}
    />;
  }

  if (showProfileForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowProfileForm(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <School className="w-8 h-8 text-purple-600" />
                <CardTitle className="text-3xl font-bold text-purple-700">
                  Learner Profile Information
                </CardTitle>
              </div>
              <CardDescription className="text-lg">
                Please provide your details for the comprehensive assessment report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="learnerName">Full Name</Label>
                  <Input
                    id="learnerName"
                    placeholder="Enter your full name"
                    value={learnerProfile.learnerName}
                    onChange={(e) => setLearnerProfile(prev => ({ ...prev, learnerName: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentGrade">Current Grade</Label>
                  <Select 
                    value={learnerProfile.currentGrade} 
                    onValueChange={(value) => setLearnerProfile(prev => ({ ...prev, currentGrade: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grade 1">Grade 1</SelectItem>
                      <SelectItem value="Grade 2">Grade 2</SelectItem>
                      <SelectItem value="Grade 3">Grade 3</SelectItem>
                      <SelectItem value="Grade 4">Grade 4</SelectItem>
                      <SelectItem value="Grade 5">Grade 5</SelectItem>
                      <SelectItem value="Grade 6">Grade 6</SelectItem>
                      <SelectItem value="Grade 7">Grade 7</SelectItem>
                      <SelectItem value="Grade 8">Grade 8</SelectItem>
                      <SelectItem value="Grade 9">Grade 9</SelectItem>
                      <SelectItem value="Grade 10">Grade 10</SelectItem>
                      <SelectItem value="Grade 11">Grade 11</SelectItem>
                      <SelectItem value="Grade 12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    placeholder="Enter your school name"
                    value={learnerProfile.schoolName}
                    onChange={(e) => setLearnerProfile(prev => ({ ...prev, schoolName: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={handleStartAssessment}
                  size="lg" 
                  className="px-8 bg-purple-600 hover:bg-purple-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Begin CBC Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={handleReturnToMain}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Return to Main Page
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <GraduationCap className="w-8 h-8 text-purple-600" />
                <CardTitle className="text-3xl font-bold text-purple-700">
                  CBC Pathway Assessment for Grade 10-12 Transition
                </CardTitle>
              </div>
              <CardDescription className="text-lg">
                Comprehensive assessment integrating CBC Learning Areas, Core Values, Core Competencies, 
                Psychometric evaluation, and RIASEC career profiling for optimal Grade 10-12 pathway selection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assessment Overview */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">CBC Assessment Framework</h3>
                <div className="space-y-3 text-sm text-blue-700">
                  <p><strong>Purpose:</strong> Guide learners transitioning from Grade 1-9 to Grade 10-12 in selecting optimal CBE pathways</p>
                  <p><strong>Integration:</strong> CBC Learning Areas + Core Values + Core Competencies + Psychometric + RIASEC</p>
                  <p><strong>Duration:</strong> 60 minutes for 50 comprehensive questions</p>
                  <p><strong>Output:</strong> Detailed pathway recommendations and comprehensive report for learners, parents, teachers, and schools</p>
                </div>
              </div>

              {/* Assessment Components */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-semibold text-green-800">CBC Learning Areas</h4>
                  <p className="text-sm text-green-600">16 questions on academic subjects and core competencies</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">RIASEC Career Types</h4>
                  <p className="text-sm text-blue-600">17 questions on career interests and aptitudes</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-semibold text-purple-800">Psychometric Profile</h4>
                  <p className="text-sm text-purple-600">17 questions on cognitive abilities and personality</p>
                </div>
              </div>

              {/* CBC Core Values */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-green-800">CBC Core Values Integration</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="text-green-700"><strong>Love:</strong> Care & Compassion</div>
                  <div className="text-green-700"><strong>Unity:</strong> Working Together</div>
                  <div className="text-green-700"><strong>Responsibility:</strong> Accountability</div>
                  <div className="text-green-700"><strong>Respect:</strong> Human Dignity</div>
                  <div className="text-green-700"><strong>Integrity:</strong> Honesty & Truth</div>
                  <div className="text-green-700"><strong>Patriotism:</strong> National Pride</div>
                  <div className="text-green-700"><strong>Peace:</strong> Harmony</div>
                </div>
              </div>

              {/* CBE Pathways */}
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-yellow-800">Grade 10-12 CBE Pathways</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>STEM (10.3):</strong> Science, Technology, Engineering, Mathematics</p>
                    <p><strong>SSC (10.2):</strong> Social Sciences</p>
                    <p><strong>ASS (10.1):</strong> Arts and Sports Science</p>
                  </div>
                  <div>
                    <p><strong>LAN (10.4):</strong> Languages</p>
                    <p><strong>APS (10.5):</strong> Applied Sciences</p>
                    <p><strong>CTE (10.6):</strong> Career and Technical Education</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={() => setShowProfileForm(true)} 
                  size="lg" 
                  className="px-8 bg-purple-600 hover:bg-purple-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Start CBC Assessment
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
              <h3 className="text-xl font-semibold">CBC Integrated Assessment</h3>
              <p className="text-gray-600">{learnerProfile.learnerName} - {learnerProfile.currentGrade}</p>
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
              {answeredQuestions} / {totalQuestions} completed
            </div>
          </div>
        </div>

        <Progress value={progress} className="h-3" />

        {/* Enhanced Assessment Overview */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Integrated CBC Assessment Framework</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded">
              <strong className="text-green-700">CBC Learning Areas (16)</strong>
              <p className="text-gray-600">Mathematics, Sciences, Languages, Social Studies, Technical subjects</p>
            </div>
            <div className="bg-white p-3 rounded">
              <strong className="text-blue-700">RIASEC Career Types (17)</strong>
              <p className="text-gray-600">Realistic, Investigative, Artistic, Social, Enterprising, Conventional</p>
            </div>
            <div className="bg-white p-3 rounded">
              <strong className="text-purple-700">Psychometric Profile (17)</strong>
              <p className="text-gray-600">Cognitive abilities, Personality traits, Emotional intelligence, Behavior patterns</p>
            </div>
          </div>
        </div>

        {/* Question Card with enhanced display */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Question {currentQuestion + 1} of {shuffledQuestions.length}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className={
                  currentQ.sourceType === 'cbc' ? 'bg-green-50 text-green-700' :
                  currentQ.sourceType === 'riasec' ? 'bg-blue-50 text-blue-700' :
                  'bg-purple-50 text-purple-700'
                }>
                  {currentQ.sourceType.toUpperCase()}
                </Badge>
                <Badge variant="secondary">{currentQ.category}</Badge>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <strong>CBC Alignment:</strong> {currentQ.cbcAlignment}
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
                  { value: "5", label: "Strongly Agree", desc: "This describes me very well" },
                  { value: "4", label: "Agree", desc: "This describes me well" },
                  { value: "3", label: "Neutral", desc: "I'm unsure about this" },
                  { value: "2", label: "Disagree", desc: "This doesn't describe me well" },
                  { value: "1", label: "Strongly Disagree", desc: "This doesn't describe me at all" }
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
          </CardContent>
        </Card>

        {/* Enhanced Progress Summary */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Assessment Progress</span>
              <Badge variant="default">{Math.round(progress)}% Complete</Badge>
            </div>
            <Progress value={progress} className="h-3 mb-2" />
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-green-700">CBC Areas</div>
                <div>{Object.keys(answers).filter(id => id.startsWith('cbc_')).length}/16</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-blue-700">RIASEC Types</div>
                <div>{Object.keys(answers).filter(id => id.startsWith('riasec_')).length}/17</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-purple-700">Psychometric</div>
                <div>{Object.keys(answers).filter(id => id.startsWith('psycho_')).length}/17</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation with enhanced finish button */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentQuestion < shuffledQuestions.length - 1 ? (
            <Button 
              onClick={handleNext}
              disabled={!currentQuestionAnswered}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Next Question
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleFinishAssessment}
              disabled={!isComplete}
              className={`px-8 ${isComplete ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'}`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isComplete ? 'Complete Assessment' : `${totalQuestions - answeredQuestions} questions remaining`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
