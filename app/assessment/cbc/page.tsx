'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentDashboard } from '../../../components/qa_components/cbc/StudentDashboard';
import { TeacherDashboard } from '../../../components/qa_components/cbc/TeacherDashboard';
import { CareerGuidance } from '../../../components/qa_components/cbc/CareerGuidance';
import { GraduationCap, Users, Compass, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

const CBCAssessment = () => {
  const route = useRouter();
  const [studentData, setStudentData] = useState({});

  const handleStudentProgress = (data: any) => {
    setStudentData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => route.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            CBC Kenya Curriculum Assessment Platform
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive assessment and pathway selection for learners from Grade 1-9, 
            with AI-powered career guidance for Grade 10-12 transition
          </p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Student Assessment
            </TabsTrigger>
            <TabsTrigger value="teacher" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Teacher Dashboard
            </TabsTrigger>
            <TabsTrigger value="guidance" className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Career Guidance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <StudentDashboard onNext={handleStudentProgress} data={studentData} />
          </TabsContent>

          <TabsContent value="teacher">
            <TeacherDashboard />
          </TabsContent>

          <TabsContent value="guidance">
            <CareerGuidance />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CBCAssessment;
