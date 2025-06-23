
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Upload, BarChart3, Settings, Database, Users, BookOpen } from 'lucide-react';
import { AIModelMonitoring } from './AIModelMonitoring';
import { AITrainingMaterials } from './AITrainingMaterials';
import { QuestionnaireManagement } from './QuestionnaireManagement';
import { AIConfigTemplates } from './AIConfigTemplates';

export const AdminFullDashboard = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6" />
            System Administration Dashboard
          </CardTitle>
          <CardDescription>
            Comprehensive AI model management, training materials, and system monitoring
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="ai-monitoring" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-monitoring" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Monitoring
          </TabsTrigger>
          <TabsTrigger value="training-materials" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Training Materials
          </TabsTrigger>
          <TabsTrigger value="questionnaire" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Questionnaire
          </TabsTrigger>
          <TabsTrigger value="ai-config" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            AI Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-monitoring">
          <AIModelMonitoring />
        </TabsContent>

        <TabsContent value="training-materials">
          <AITrainingMaterials />
        </TabsContent>

        <TabsContent value="questionnaire">
          <QuestionnaireManagement />
        </TabsContent>

        <TabsContent value="ai-config">
          <AIConfigTemplates />
        </TabsContent>
      </Tabs>
    </div>
  );
};
