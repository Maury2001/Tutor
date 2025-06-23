'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, User, BookOpen, Target, TrendingUp, MessageCircle } from 'lucide-react';
import { CBCSimulation } from './CBCSimulation';
import { CBEPathwayRecommendation } from './CBEPathwayRecommendation';
import { CareerGuidance } from './CareerGuidance';
import { AICounselorChat } from './AICounselorChat';
import { DetailedReportGenerator } from './DetailedReportGenerator';

interface StudentDashboardProps {
  onNext?: (stepData: any) => void;
  data?: any;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNext = () => {}, data = {} }) => {
  const [currentStep, setCurrentStep] = useState<'simulation' | 'pathway' | 'guidance' | 'ai-counselor' | 'report-generation'>('simulation');

  const handleSimulationComplete = (simulationData: any) => {
    setCurrentStep('pathway');
    onNext(simulationData);
  };

  const handlePathwayComplete = (pathwayData: any) => {
    setCurrentStep('guidance');
    onNext(pathwayData);
  };

  const handleGuidanceComplete = (guidanceData: any) => {
    setCurrentStep('ai-counselor');
    onNext(guidanceData);
  };

  if (currentStep === 'simulation') {
    return <CBCSimulation onNext={handleSimulationComplete} data={data} />;
  }

  if (currentStep === 'pathway') {
    return <CBEPathwayRecommendation onNext={handlePathwayComplete} data={data} />;
  }

  if (currentStep === 'guidance') {
    return <CareerGuidance />;
  }

  if (currentStep === 'ai-counselor') {
    return (
      <AICounselorChat 
        onNext={() => {  // Fixed: Changed to match expected signature
          setCurrentStep('report-generation');
          onNext({ ...data, aiCounseling: true }); // Pass simple flag instead of parameter
        }}
        data={data}
      />
    );
  }

  if (currentStep === 'report-generation') {
    return <DetailedReportGenerator data={data} onNext={() => {}} onPrevious={() => {}} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Student Dashboard</CardTitle>
          <CardDescription>Your personalized career guidance journey</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Welcome to your CBC Career Companion Dashboard!</p>
        </CardContent>
      </Card>
    </div>
  );
};
