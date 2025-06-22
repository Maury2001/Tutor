'use client'
import { useState } from 'react';
import AssessmentForm from '../../components/new-components/AssessmentForm';
import AssessmentQuestions from '../../components/new-components/AssessmentQuestions';
import AssessmentResults from '../../components/new-components/AssessmentResults';
import SimulationHub from '../../components/new-components/SimulationHub'
import AICareerConsultant from '../../components/new-components/AICareerConsultant';
import SelectedPathway from '../../components/new-components/SelectedPathway';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Target, Zap, TrendingUp, Bot, FileText } from 'lucide-react';

export interface UserData {
  name: string;
  email: string;
  grade: string;
}

export interface AssessmentData extends UserData {
  answers: number[];
  topCodes: string;
  scores: Record<string, number>;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'form' | 'assessment' | 'results' | 'simulations' | 'ai-consultant' | 'selected-pathway'>('intro');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  const handleFormSubmit = (data: UserData) => {
    setUserData(data);
    setCurrentStep('assessment');
  };

  const handleAssessmentComplete = (data: AssessmentData) => {
    setAssessmentData(data);
    setCurrentStep('results');
  };

  const handleExploreSimulations = () => {
    setCurrentStep('simulations');
  };

  const handleAIConsultant = () => {
    setCurrentStep('ai-consultant');
  };

  const handleSelectedPathway = () => {
    setCurrentStep('selected-pathway');
  };

  const handleStartOver = () => {
    setCurrentStep('intro');
    setUserData(null);
    setAssessmentData(null);
  };

  if (currentStep === 'form') {
    return <AssessmentForm onSubmit={handleFormSubmit} />;
  }

  if (currentStep === 'assessment' && userData) {
    return (
      <AssessmentQuestions 
        userData={userData} 
        onComplete={handleAssessmentComplete}
      />
    );
  }

  if (currentStep === 'results' && assessmentData) {
    return (
      <AssessmentResults 
        data={assessmentData}
        onExploreSimulations={handleExploreSimulations}
        onAIConsultant={handleAIConsultant}
        onSelectedPathway={handleSelectedPathway}
        onStartOver={handleStartOver}
      />
    );
  }

  if (currentStep === 'simulations' && assessmentData) {
    return (
      <SimulationHub 
        assessmentData={assessmentData}
        onBackToResults={() => setCurrentStep('results')}
      />
    );
  }

  if (currentStep === 'ai-consultant' && assessmentData) {
    return (
      <AICareerConsultant 
        assessmentData={assessmentData}
        onBack={() => setCurrentStep('results')}
      />
    );
  }

  if (currentStep === 'selected-pathway' && assessmentData) {
    return (
      <SelectedPathway 
        assessmentData={assessmentData}
        onBack={() => setCurrentStep('results')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            CBE PATHWAY & CAREER ASSESSMENT
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover your career interests and explore pathways that align with your personality. 
            Based on competency based curriculum portfolios, this assessment helps students find their ideal career direction.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Assessment</h3>
            <p className="text-gray-600">30 carefully crafted questions to identify your CBC portfolio profile</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Simulations</h3>
            <p className="text-gray-600">Hands-on experiences in different career fields</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="p-3 bg-indigo-100 rounded-full w-fit mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Career Pathways</h3>
            <p className="text-gray-600">Detailed recommendations and educational pathways</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <Bot className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Career Consultant</h3>
            <p className="text-gray-600">Personalized AI-powered career guidance and consultation</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-4">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Selected Pathway Grade 9-12</h3>
            <p className="text-gray-600">AI-generated pathway with cluster selection and career options</p>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => setCurrentStep('form')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Start Your Assessment
          </Button>
        </div>

        <div className="mt-16 bg-white/50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Understanding CBC Portfolio Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { code: 'R', name: 'Realistic', color: 'bg-green-500', description: 'Hands-on, practical, mechanical work' },
              { code: 'I', name: 'Investigative', color: 'bg-blue-500', description: 'Research, analysis, scientific inquiry' },
              { code: 'A', name: 'Artistic', color: 'bg-purple-500', description: 'Creative expression, design, arts' },
              { code: 'S', name: 'Social', color: 'bg-orange-500', description: 'Helping others, counseling, teaching' },
              { code: 'E', name: 'Enterprising', color: 'bg-red-500', description: 'Leadership, business, entrepreneurship' },
              { code: 'C', name: 'Conventional', color: 'bg-gray-500', description: 'Organization, data, systematic work' }
            ].map((type) => (
              <div key={type.code} className="bg-white rounded-lg p-4 shadow-sm">
                <div className={`w-12 h-12 ${type.color} rounded-full flex items-center justify-center text-white font-bold text-xl mb-3`}>
                  {type.code}
                </div>
                <h3 className="font-semibold text-lg">{type.name}</h3>
                <p className="text-gray-600 text-sm">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
