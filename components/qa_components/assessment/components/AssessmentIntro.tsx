
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Brain, BookOpen, Users, Heart, Clock } from 'lucide-react';

interface AssessmentIntroProps {
  onStart: () => void;
}

export const AssessmentIntro: React.FC<AssessmentIntroProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Target className="w-8 h-8 text-blue-600" />
              <CardTitle className="text-3xl font-bold text-blue-700">
                Grade 9 CBC Career Pathway Assessment
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Discover your interests, strengths, and future career pathways aligned with CBC curriculum
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  What This Assessment Covers
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" />• RIASEC Career Interests</p>
                  <p className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-green-500" />• CBC Learning Areas (Grade 7-9)</p>
                  <p className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" />• CBC Core Values & Competencies</p>
                  <p className="flex items-center gap-2"><Target className="w-4 h-4 text-orange-500" />• Grade 10-12 Pathway Selection</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-500" />
                  Assessment Process
                </h3>
                <div className="space-y-2 text-sm">
                  <p>• 60 comprehensive questions</p>
                  <p>• Document upload for additional insights</p>
                  <p>• AI-powered career guidance</p>
                  <p>• 75 minutes completion time</p>
                  <p>• Detailed pathway recommendations</p>
                  <p>• Career simulations and counseling</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">CBC Curriculum Focus:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Mathematics, Science, Languages (English/Kiswahili)</li>
                <li>Social Studies, Creative Arts, Physical Education</li>
                <li>Core Values: Love, Unity, Responsibility, Respect, Integrity, Patriotism, Peace</li>
                <li>Competencies: Communication, Critical Thinking, Creativity, Collaboration</li>
                <li>Kenyan job market alignment and career pathways</li>
              </ul>
            </div>
            
            <div className="text-center">
              <Button onClick={onStart} size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
                <Target className="w-4 h-4 mr-2" />
                Begin My CBC Career Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
