'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users, Target, BookOpen, TrendingUp, Heart } from 'lucide-react';

export const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const { data: childrenData } = await supabase
        .from('app_users')
        .select('*')
        .eq('user_type', 'student');

      if (childrenData) {
        setChildren(childrenData);
      }
    } catch (error) {
      console.error('Error loading children:', error);
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
              Welcome, Parent
            </h1>
            <p className="text-gray-600">Parent Dashboard</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Parent
          </Badge>
        </div>

        {/* Children Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Your Children's Progress
            </CardTitle>
            <CardDescription>
              Monitor your children's career assessment journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No children registered yet</p>
                <p className="text-sm text-gray-500">
                  Contact your child's school or register them directly to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {children.map((child: any) => (
                  <Card key={child.id} className="border-2">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{child.full_name}</h3>
                          <p className="text-gray-600">Grade {child.grade_level}</p>
                        </div>
                        <Badge variant={child.is_verified ? 'default' : 'secondary'}>
                          {child.is_verified ? 'Active' : 'Pending'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <Target className="w-6 h-6 text-green-500 mx-auto mb-1" />
                          <p className="text-sm font-medium">Assessments</p>
                          <p className="text-lg font-bold">0/3</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                          <p className="text-sm font-medium">Progress</p>
                          <p className="text-lg font-bold">0%</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <BookOpen className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                          <p className="text-sm font-medium">Pathways</p>
                          <p className="text-lg font-bold">Not Set</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                        <Button variant="outline" size="sm">
                          Download Report
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact Teacher
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Career Guidance Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Parent Resources
            </CardTitle>
            <CardDescription>
              Information and tools to support your child's career planning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <BookOpen className="w-8 h-8 text-green-500 mb-3" />
                  <h3 className="font-semibold mb-2">CBC Guide for Parents</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Understanding the new curriculum and pathway options
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Read Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <Target className="w-8 h-8 text-blue-500 mb-3" />
                  <h3 className="font-semibold mb-2">Career Planning Tips</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    How to support your child's career exploration
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <Users className="w-8 h-8 text-purple-500 mb-3" />
                  <h3 className="font-semibold mb-2">Parent Community</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Connect with other parents and share experiences
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Join Community
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
