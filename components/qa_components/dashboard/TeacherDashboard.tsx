'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users, BookOpen, Target, TrendingUp, FileText } from 'lucide-react';

export const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    completedAssessments: 0,
    pendingAssessments: 0
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load students
      const { data: studentsData } = await supabase
        .from('app_users')
        .select('*')
        .eq('user_type', 'student');

      if (studentsData) {
        setStudents(studentsData);
        
        // Load assessment completion stats
        const { data: assessmentsData } = await supabase
          .from('assessment_results')
          .select('user_id')
          .in('user_id', studentsData.map(s => s.id));

        const completedStudents = new Set(assessmentsData?.map(a => a.user_id) || []);
        
        setStats({
          totalStudents: studentsData.length,
          completedAssessments: completedStudents.size,
          pendingAssessments: studentsData.length - completedStudents.size
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
              Welcome, Teacher
            </h1>
            <p className="text-gray-600">Teacher Dashboard</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Teacher
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedAssessments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingAssessments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Student Assessment Progress
            </CardTitle>
            <CardDescription>
              Monitor your students' career assessment completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.slice(0, 10).map((student: any) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{student.full_name}</h3>
                    <p className="text-sm text-gray-600">
                      Grade {student.grade_level} • {student.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {student.is_verified ? 'Verified' : 'Pending'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Progress
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Career Guidance Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Career Guidance Resources
            </CardTitle>
            <CardDescription>
              Tools and materials to support student career planning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <FileText className="w-8 h-8 text-green-500 mb-3" />
                  <h3 className="font-semibold mb-2">Assessment Reports</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Generate and download student assessment reports
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <Target className="w-8 h-8 text-blue-500 mb-3" />
                  <h3 className="font-semibold mb-2">Career Pathways</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Explore CBC senior school pathway options
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Pathways
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <BookOpen className="w-8 h-8 text-purple-500 mb-3" />
                  <h3 className="font-semibold mb-2">Learning Materials</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Access career guidance materials and resources
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Browse Materials
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
