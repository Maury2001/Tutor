'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BarChart3, Users, BookOpen } from 'lucide-react';
import { TeacherMarksEntry } from './TeacherMarksEntry';
import { StudentPerformanceReports } from './StudentPerformanceReports';

export const EnhancedTeacherDashboard = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Teacher Dashboard
          </CardTitle>
          <CardDescription>
            Manage student assessments, enter termly marks, and generate comprehensive performance reports
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="marks-entry" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="marks-entry" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Marks Entry
          </TabsTrigger>
          <TabsTrigger value="performance-reports" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Performance Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marks-entry">
          <TeacherMarksEntry />
        </TabsContent>

        <TabsContent value="performance-reports">
          <StudentPerformanceReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};
