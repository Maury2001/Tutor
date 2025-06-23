'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Target, Award, TrendingUp, FileText, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssessmentResult {
  id: string;
  assessment_type: string;
  completed_at: string;
  scores: any;
}

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load assessment results
      const { data: assessmentData } = await supabase
        .from('assessment_results')
        .select('*')
        .order('completed_at', { ascending: false });

      if (assessmentData) setAssessments(assessmentData);

      // Load career materials
      const { data: materialsData } = await supabase
        .from('career_materials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (materialsData) setMaterials(materialsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentProgress = () => {
    const totalAssessments = 3; // CBC, RIASEC, RIASEC-CBC
    const completed = assessments.length;
    return (completed / totalAssessments) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, Student
            </h1>
            <p className="text-gray-600">Student Dashboard</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Student
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Assessments</p>
                  <p className="text-2xl font-bold">{assessments.length}/3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completion</p>
                  <p className="text-2xl font-bold">{Math.round(getAssessmentProgress())}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Materials</p>
                  <p className="text-2xl font-bold">{materials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Assessment Progress
            </CardTitle>
            <CardDescription>
              Complete all assessments to get personalized career pathway recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(getAssessmentProgress())}%</span>
                </div>
                <Progress value={getAssessmentProgress()} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="border-2 border-green-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">CBC Learning Areas</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Discover your learning preferences across CBC curriculum areas
                    </p>
                    <Button 
                      onClick={() => navigate('/cbc-assessment')} 
                      className="w-full"
                      variant={assessments.some(a => a.assessment_type === 'cbc') ? 'outline' : 'default'}
                    >
                      {assessments.some(a => a.assessment_type === 'cbc') ? 'Retake' : 'Start'} Assessment
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">RIASEC Career Interest</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Explore your career interests using the Holland Code system
                    </p>
                    <Button 
                      onClick={() => navigate('/riasec-assessment')} 
                      className="w-full"
                      variant={assessments.some(a => a.assessment_type === 'riasec') ? 'outline' : 'default'}
                    >
                      {assessments.some(a => a.assessment_type === 'riasec') ? 'Retake' : 'Start'} Assessment
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">RIASEC-CBC Combined</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Get Grade 9 pathway recommendations for CBC Senior School
                    </p>
                    <Button 
                      onClick={() => navigate('/riasec-cbc-assessment')} 
                      className="w-full"
                      variant={assessments.some(a => a.assessment_type === 'riasec_cbc') ? 'outline' : 'default'}
                    >
                      {assessments.some(a => a.assessment_type === 'riasec_cbc') ? 'Retake' : 'Start'} Assessment
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Results */}
        {assessments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Assessment Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessments.slice(0, 3).map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">
                        {assessment.assessment_type.toUpperCase()} Assessment
                      </h3>
                      <p className="text-sm text-gray-600">
                        Completed on {new Date(assessment.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Career Guidance Materials
            </CardTitle>
            <CardDescription>
              Explore resources to help with your career planning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.slice(0, 6).map((material: any) => (
                <Card key={material.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{material.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {material.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{material.category}</Badge>
                      <Button variant="ghost" size="sm">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
