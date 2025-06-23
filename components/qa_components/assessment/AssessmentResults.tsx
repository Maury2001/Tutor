'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  BookOpen, 
  Brain, 
  Zap, 
  TrendingUp, 
  Users, 
  MessageCircle,
  ChevronRight,
  Star,
  Award,
  Lightbulb,
  GraduationCap,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AssessmentResultsProps {
  results: {
    riasecScores: Record<string, number>;
    cbcLearningAreas: Record<string, number>;
    cbcCoreValues: Record<string, number>;
    cbcCompetencies: Record<string, number>;
    uploadedDocuments: Array<{name: string; size: number; type: string}>;
    completedAt: string;
    totalQuestions: number;
    answeredQuestions: number;
    gradeLevel: string;
    countryContext: string;
    curriculumFramework: string;
  };
  onRetake: () => void;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({ results, onRetake }) => {
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAICounselor, setShowAICounselor] = useState(false);

  // Safely handle the scores with null checks
  const riasecScores = results?.riasecScores || {};
  const cbcLearningAreas = results?.cbcLearningAreas || {};
  const cbcCoreValues = results?.cbcCoreValues || {};
  const cbcCompetencies = results?.cbcCompetencies || {};

  // Calculate top RIASEC interests
  const topRiasecInterests = Object.entries(riasecScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([type, score]) => ({ type, score, percentage: (score / 20) * 100 }));

  // Calculate top CBC learning areas
  const topCbcAreas = Object.entries(cbcLearningAreas)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([area, score]) => ({ area, score, percentage: (score / 15) * 100 }));

  // Calculate top values
  const topValues = Object.entries(cbcCoreValues)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([value, score]) => ({ value, score, percentage: (score / 10) * 100 }));

  // Calculate top competencies
  const topCompetencies = Object.entries(cbcCompetencies)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([competency, score]) => ({ competency, score, percentage: (score / 10) * 100 }));

  // Career pathway recommendations based on top interests
  const getPathwayRecommendations = () => {
    const topInterest = topRiasecInterests[0]?.type;
    const pathways = {
      realistic: {
        grade10: ['Technical & Applied Sciences', 'Agriculture', 'Engineering'],
        clusters: ['Engineering & Technology', 'Agriculture & Natural Resources', 'Manufacturing'],
        careers: ['Mechanical Engineer', 'Agricultural Scientist', 'Construction Manager', 'Electrician', 'Architect']
      },
      investigative: {
        grade10: ['Sciences', 'Mathematics', 'Computer Studies'],
        clusters: ['Science, Technology & Mathematics', 'Health Sciences'],
        careers: ['Research Scientist', 'Medical Doctor', 'Data Analyst', 'Pharmacist', 'Laboratory Technician']
      },
      artistic: {
        grade10: ['Creative Arts', 'Languages', 'Humanities'],
        clusters: ['Arts & Communication', 'Humanities & Social Sciences'],
        careers: ['Graphic Designer', 'Writer', 'Musician', 'Film Director', 'Interior Designer']
      },
      social: {
        grade10: ['Humanities', 'Languages', 'Social Sciences'],
        clusters: ['Education & Training', 'Human Services', 'Health Sciences'],
        careers: ['Teacher', 'Social Worker', 'Counselor', 'Nurse', 'Community Development Officer']
      },
      enterprising: {
        grade10: ['Business Studies', 'Economics', 'Mathematics'],
        clusters: ['Business & Entrepreneurship', 'Finance', 'Marketing & Sales'],
        careers: ['Business Manager', 'Entrepreneur', 'Sales Executive', 'Marketing Manager', 'Financial Advisor']
      },
      conventional: {
        grade10: ['Mathematics', 'Business Studies', 'Computer Studies'],
        clusters: ['Business & Administration', 'Finance', 'Information Technology'],
        careers: ['Accountant', 'Bank Manager', 'Administrative Assistant', 'Data Entry Clerk', 'Office Manager']
      }
    };
    return pathways[topInterest as keyof typeof pathways] || pathways.realistic;
  };

  const recommendations = getPathwayRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate.push('/assessment')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
                <div>
                  <CardTitle className="text-3xl font-bold text-green-700 flex items-center gap-3">
                    <Award className="w-8 h-8" />
                    Your Career Assessment Results
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    Comprehensive analysis of your interests, skills, and career pathway recommendations
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-2">
                  Completed: {new Date(results.completedAt).toLocaleDateString()}
                </Badge>
                <p className="text-sm text-gray-600">
                  {results.answeredQuestions}/{results.totalQuestions} questions answered
                </p>
                <p className="text-sm text-gray-500">
                  {results.gradeLevel} - {results.curriculumFramework}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pathways">Grade 10 Pathways</TabsTrigger>
            <TabsTrigger value="careers">Career Options</TabsTrigger>
            <TabsTrigger value="simulations">Simulations</TabsTrigger>
            <TabsTrigger value="counselor">AI Counselor</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* RIASEC Interests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Career Interests (RIASEC)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topRiasecInterests.map(({ type, score, percentage }) => (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{type}</span>
                        <span className="text-sm text-gray-600">{score}/20</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* CBC Learning Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    Learning Area Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topCbcAreas.map(({ area, score, percentage }) => (
                    <div key={area} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{area.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                        <span className="text-sm text-gray-600">{score}/15</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* CBC Core Values */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    Core Values
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topValues.map(({ value, score, percentage }) => (
                    <div key={value} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{value}</span>
                        <span className="text-sm text-gray-600">{score}/10</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* CBC Competencies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    Key Competencies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topCompetencies.map(({ competency, score, percentage }) => (
                    <div key={competency} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{competency.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                        <span className="text-sm text-gray-600">{score}/10</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Documents Uploaded */}
            {results.uploadedDocuments && results.uploadedDocuments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    Uploaded Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {results.uploadedDocuments.map((doc, index) => (
                      <Badge key={index} variant="outline" className="p-3 text-center justify-center">
                        {doc.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Grade 10 Pathways Tab */}
          <TabsContent value="pathways" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  Recommended Grade 10-12 Pathways
                </CardTitle>
                <CardDescription>
                  Based on your assessment results, these pathways align with your interests and strengths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.grade10.map((pathway, index) => (
                    <Card key={pathway} className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                          <span className="text-xl font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{pathway}</h3>
                        <Badge variant="secondary">Recommended</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Career Clusters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recommendations.clusters.map((cluster) => (
                    <Badge key={cluster} variant="outline" className="p-3 text-center justify-center">
                      {cluster}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Options Tab */}
          <TabsContent value="careers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Recommended Career Paths
                </CardTitle>
                <CardDescription>
                  Explore these careers that match your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.careers.map((career) => (
                    <Card key={career} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{career}</h3>
                          <p className="text-sm text-gray-600">High compatibility match</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Simulations Tab */}
          <TabsContent value="simulations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-purple-500" />
                  Interactive Career Simulations
                </CardTitle>
                <CardDescription>
                  Experience your recommended careers through interactive simulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.careers.slice(0, 6).map((career) => (
                    <Card key={career} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Zap className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2">{career}</h3>
                        <Button variant="outline" size="sm" className="w-full">
                          Try Simulation
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Counselor Tab */}
          <TabsContent value="counselor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                  AI Career Counselor
                </CardTitle>
                <CardDescription>
                  Get personalized guidance and ask questions about your career path
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Meet Your AI Career Counselor</h3>
                  <p className="text-gray-600 mb-6">
                    Ask questions about your assessment results, career options, or educational pathways
                  </p>
                  <Button 
                    size="lg" 
                    onClick={() => setShowAICounselor(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Counseling Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button variant="outline" onClick={onRetake}>
            Retake Assessment
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Users className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
};
