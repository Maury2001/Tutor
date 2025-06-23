'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Mail, Printer, School, User, Calendar, GraduationCap, Target, Brain, BookOpen, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LearnerProfile {
  learnerName: string;
  currentGrade: string;
  schoolName: string;
  assessmentDate: string;
}

interface EnhancedDetailedReportGeneratorProps {
  data: {
    learnerProfile: LearnerProfile;
    integratedScores: any;
    topPathways: any[];
    overallPercentage: number;
    actualScore: number;
    totalPossibleScore: number;
    pathwayAnalysis: any[];
  };
  onNext: () => void;
  onPrevious: () => void;
}

export const EnhancedDetailedReportGenerator: React.FC<EnhancedDetailedReportGeneratorProps> = ({
  data,
  onNext,
  onPrevious
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation with comprehensive CBC analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      setReportGenerated(true);
      toast.success('Comprehensive CBC Report Generated Successfully!');
    } catch (error) {
      toast.error('Error generating report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const { learnerProfile, integratedScores, topPathways, overallPercentage, actualScore, totalPossibleScore, pathwayAnalysis } = data;

  const topPathway = topPathways && topPathways.length > 0 ? topPathways[0] : {
    name: 'No pathway available',
    match: 0,
    description: 'No description available',
    subjects: [],
    careers: [],
    universities: [],
    coreCompetencies: []
  };

  const reportSections = [
    {
      title: "Executive Summary",
      icon: <Target className="w-5 h-5" />,
      content: `${learnerProfile.learnerName} demonstrates strong aptitude for ${topPathway.name} with ${topPathway.match}% pathway alignment. Overall assessment score: ${overallPercentage}%`
    },
    {
      title: "CBC Learning Areas Analysis",
      icon: <BookOpen className="w-5 h-5" />,
      content: "Comprehensive evaluation across all CBC learning areas with strength identification and improvement recommendations"
    },
    {
      title: "Core Competencies Assessment",
      icon: <Brain className="w-5 h-5" />,
      content: "Analysis of critical thinking, communication, creativity, citizenship, digital literacy, learning to learn, and self-efficacy"
    },
    {
      title: "Core Values Integration",
      icon: <Award className="w-5 h-5" />,
      content: "Evaluation of Love, Unity, Responsibility, Respect, Integrity, Patriotism, and Peace demonstration"
    },
    {
      title: "RIASEC Career Profiling",
      icon: <Users className="w-5 h-5" />,
      content: "Detailed career interests analysis across Realistic, Investigative, Artistic, Social, Enterprising, and Conventional types"
    },
    {
      title: "Psychometric Evaluation",
      icon: <Brain className="w-5 h-5" />,
      content: "Cognitive abilities, personality traits, emotional intelligence, and behavioral patterns assessment"
    },
    {
      title: "Grade 10-12 Pathway Recommendations",
      icon: <GraduationCap className="w-5 h-5" />,
      content: "Detailed analysis of top 3 CBE pathways with subject selection and career prospects"
    },
    {
      title: "University and Career Guidance",
      icon: <School className="w-5 h-5" />,
      content: "Recommended universities, admission requirements, scholarship opportunities, and career development strategies"
    }
  ];

  if (!reportGenerated) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
              <CardTitle className="text-3xl font-bold text-blue-700">
                CBC Comprehensive Assessment Report
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Generate detailed report for learner, parents, teachers, and school administration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Learner Information Summary */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Learner Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span><strong>Name:</strong> {learnerProfile.learnerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-green-600" />
                  <span><strong>Current Grade:</strong> {learnerProfile.currentGrade}</span>
                </div>
                <div className="flex items-center gap-2">
                  <School className="w-4 h-4 text-purple-600" />
                  <span><strong>School:</strong> {learnerProfile.schoolName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span><strong>Assessment Date:</strong> {learnerProfile.assessmentDate}</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Overall Assessment Score</span>
                  <Badge variant="default" className="bg-green-600">{overallPercentage}%</Badge>
                </div>
                <Progress value={overallPercentage} className="h-3" />
                <p className="text-sm text-gray-600 mt-1">{actualScore} out of {totalPossibleScore} points</p>
              </div>
            </div>

            {/* Top Pathway Recommendation */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-green-800">Primary Pathway Recommendation</h3>
              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-lg text-green-700">{topPathway.name}</h4>
                  <Badge className="bg-green-600">{topPathway.match}% Match</Badge>
                </div>
                <p className="text-gray-700 mb-3">{topPathway.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Recommended Subjects</h5>
                    <div className="flex flex-wrap gap-1">
                      {(topPathway.subjects || []).slice(0, 4).map((subject: string) => (
                        <Badge key={subject} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Career Prospects</h5>
                    <div className="flex flex-wrap gap-1">
                      {(topPathway.careers || []).slice(0, 4).map((career: string) => (
                        <Badge key={career} variant="secondary" className="text-xs">
                          {career}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Sections Preview */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Report Sections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportSections.map((section, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="text-blue-600 mt-1">{section.icon}</div>
                    <div>
                      <h4 className="font-medium text-sm">{section.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{section.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={generateReport}
                disabled={isGenerating}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Comprehensive Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6" id="cbc-assessment-report">
      {/* Report Header */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="text-center bg-blue-50">
          <div className="flex items-center justify-center gap-2 mb-4">
            <School className="w-8 h-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl font-bold text-blue-700">
                CBC COMPREHENSIVE ASSESSMENT REPORT
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Grade 10-12 Pathway Selection & Career Guidance Report
              </CardDescription>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><strong>Learner:</strong> {learnerProfile.learnerName}</div>
            <div><strong>Grade:</strong> {learnerProfile.currentGrade}</div>
            <div><strong>School:</strong> {learnerProfile.schoolName}</div>
            <div><strong>Date:</strong> {learnerProfile.assessmentDate}</div>
          </div>
        </CardHeader>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Assessment Overview</h4>
            <p className="text-sm text-green-700">
              {learnerProfile.learnerName} completed a comprehensive 50-question integrated assessment covering CBC Learning Areas, 
              Core Competencies, Core Values, Psychometric evaluation, and RIASEC career profiling. The assessment achieved an 
              overall score of <strong>{overallPercentage}%</strong> ({actualScore}/{totalPossibleScore} points).
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Primary Recommendation</h4>
            <p className="text-sm text-blue-700">
              Based on comprehensive analysis, <strong>{topPathway.name} ({topPathway.code || 'N/A'})</strong> is the top recommended 
              pathway with <strong>{topPathway.match}% alignment</strong>. This recommendation is based on strong performance in 
              relevant learning areas, demonstrated core competencies, and career interest alignment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Assessment Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CBC Learning Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              CBC Learning Areas Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {integratedScores && integratedScores.cbcScores && Object.entries(integratedScores.cbcScores).map(([area, score]: [string, any]) => (
              <div key={area} className="flex justify-between items-center">
                <span className="text-sm capitalize">{area.replace(/([A-Z])/g, ' $1').trim()}</span>
                <div className="flex items-center gap-2">
                  <Progress value={score} className="w-20 h-2" />
                  <Badge variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "outline"}>
                    {score}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* RIASEC Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              RIASEC Career Interest Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {integratedScores && integratedScores.riasecScores && Object.entries(integratedScores.riasecScores).map(([type, score]: [string, any]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm capitalize">{type}</span>
                <div className="flex items-center gap-2">
                  <Progress value={score} className="w-20 h-2" />
                  <Badge variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "outline"}>
                    {score}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pathway Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-green-600" />
            CBE Pathway Recommendations (Grade 10-12)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(topPathways || []).map((pathway, index) => (
              <div key={index} className={`p-4 rounded-lg border ${index === 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-lg">{pathway.name}</h4>
                  <div className="flex gap-2">
                    <Badge variant="default">Code: {pathway.code || 'N/A'}</Badge>
                    <Badge variant="secondary">{pathway.match}% Match</Badge>
                    {index === 0 && <Badge className="bg-green-600">Recommended</Badge>}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{pathway.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Core Subjects</h5>
                    <div className="flex flex-wrap gap-1">
                      {(pathway.subjects || []).slice(0, 3).map((subject: string) => (
                        <Badge key={subject} variant="outline" className="text-xs">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-2">Career Options</h5>
                    <div className="flex flex-wrap gap-1">
                      {(pathway.careers || []).slice(0, 3).map((career: string) => (
                        <Badge key={career} variant="secondary" className="text-xs">{career}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-2">Universities</h5>
                    <div className="flex flex-wrap gap-1">
                      {(pathway.universities || []).slice(0, 2).map((university: string) => (
                        <Badge key={university} variant="outline" className="text-xs bg-blue-50">{university}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Next Steps & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">For the Learner</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Focus on strengthening performance in {topPathway.name} related subjects</li>
                <li>• Develop core competencies: {(topPathway.coreCompetencies || []).join(', ')}</li>
                <li>• Explore career options through job shadowing and internships</li>
                <li>• Begin university research and admission requirement planning</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">For Parents & Guardians</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Support pathway selection discussions with school counselors</li>
                <li>• Research scholarship and funding opportunities</li>
                <li>• Facilitate career exploration activities and mentorship</li>
                <li>• Plan for university application timelines and requirements</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">For Teachers & School</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Provide targeted support in recommended pathway subjects</li>
                <li>• Facilitate career guidance sessions and guest speaker programs</li>
                <li>• Monitor academic progress in pathway-relevant areas</li>
                <li>• Connect with universities and career professionals for student exposure</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => window.print()} className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print Report
            </Button>
            <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Save as PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email to Parents
            </Button>
            <Button variant="secondary" onClick={onPrevious}>
              Back to Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
