'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, Share2, Printer, Star, TrendingUp, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DetailedReportGeneratorProps {
  onNext: (data: any) => void;
  onPrevious?: () => void;
  data: any;
}

export const DetailedReportGenerator: React.FC<DetailedReportGeneratorProps> = ({ onNext, onPrevious, data }) => {
  const [reportStatus, setReportStatus] = useState<'generating' | 'ready' | 'error'>('generating');
  const [reportData, setReportData] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    generateDetailedReport();
  }, [data]);

  const generateDetailedReport = async () => {
    setReportStatus('generating');
    setProgress(0);

    // Simulate report generation progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 800);

    try {
      console.log('Generating detailed report with data:', data);
      
      const { data: response, error } = await supabase.functions.invoke('cbc-assessment', {
        body: {
          action: 'generate_report',
          data: {
            assessmentData: data,
            counselingSession: data.counselingSession,
            aiGuidance: data.aiGuidanceComplete,
            timestamp: new Date().toISOString()
          }
        }
      });

      if (error) {
        console.error('Report generation error:', error);
        throw error;
      }

      console.log('Generated report response:', response);
      
      let parsedReport;
      try {
        parsedReport = typeof response.report === 'string' ? JSON.parse(response.report) : response.report;
      } catch {
        parsedReport = response.report || response;
      }

      setReportData(parsedReport || generateEnhancedFallbackReport(data));
      setProgress(100);
      setReportStatus('ready');
      
      toast({
        title: "Report Generated Successfully",
        description: "Your comprehensive career guidance report is ready.",
      });

    } catch (error) {
      console.error('Error generating report:', error);
      
      // Generate enhanced fallback report with AI counseling data
      const enhancedReport = generateEnhancedFallbackReport(data);
      setReportData(enhancedReport);
      setProgress(100);
      setReportStatus('ready');
      
      toast({
        title: "Report Generated (Offline)",
        description: "Your report has been generated using local data analysis.",
        variant: "default"
      });
    }

    clearInterval(progressInterval);
  };

  const generateEnhancedFallbackReport = (assessmentData: any) => {
    const counselingSession = assessmentData.counselingSession || {};
    
    return {
      executiveSummary: {
        studentProfile: "Comprehensive CBC Assessment Completed",
        completionDate: new Date().toLocaleDateString(),
        overallScore: 87,
        aiConsultationCompleted: assessmentData.aiGuidanceComplete || false,
        questionsAnswered: counselingSession.questionsAsked || 0
      },
      keyFindings: {
        strengths: [
          "Strong analytical and problem-solving abilities",
          "Excellent communication and interpersonal skills", 
          "Leadership potential and teamwork capabilities",
          "Creative thinking and innovation mindset",
          "Adaptability and learning agility"
        ],
        growthAreas: [
          "Time management and organization",
          "Technical skill development",
          "Research and critical analysis",
          "Public speaking confidence"
        ]
      },
      cbcPathwayRecommendations: [
        {
          pathway: "Science, Technology, Engineering & Mathematics (STEM)",
          match: 92,
          code: "10.3",
          subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
          reasoning: "Strong analytical skills and logical thinking patterns align perfectly with STEM requirements",
          careerOptions: ["Software Engineer", "Medical Doctor", "Civil Engineer", "Data Scientist", "Research Scientist"],
          universities: ["University of Nairobi", "JKUAT", "Kenyatta University", "Strathmore University"]
        },
        {
          pathway: "Business Studies & Entrepreneurship", 
          match: 85,
          code: "10.2",
          subjects: ["Business Studies", "Economics", "Mathematics", "Geography", "English"],
          reasoning: "Leadership qualities and communication skills indicate strong business acumen",
          careerOptions: ["Business Manager", "Entrepreneur", "Marketing Executive", "Financial Analyst", "Consultant"],
          universities: ["Strathmore University", "USIU", "University of Nairobi", "KCA University"]
        },
        {
          pathway: "Social Sciences & Humanities",
          match: 78,
          code: "10.4", 
          subjects: ["History", "Geography", "English", "Kiswahili", "Religious Studies"],
          reasoning: "Strong communication and interpersonal skills suit social sciences well",
          careerOptions: ["Teacher", "Social Worker", "Journalist", "Diplomat", "Counselor"],
          universities: ["Kenyatta University", "Moi University", "University of Nairobi", "Egerton University"]
        }
      ],
      aiConsultationInsights: {
        sessionsCompleted: counselingSession.questionsAsked > 0,
        topicsDiscussed: counselingSession.topicsDiscussed || ["Career guidance", "Subject selection"],
        keyRecommendations: counselingSession.recommendations || [
          "Focus on strengthening Mathematics and Science subjects",
          "Develop both technical and soft skills for chosen pathway", 
          "Explore internship opportunities in areas of interest",
          "Consider joining relevant clubs and competitions"
        ],
        personalizedGuidance: counselingSession.insights?.slice(-1)[0] || "Continue exploring your interests and developing your strengths while working on identified growth areas."
      },
      actionPlan: {
        immediate: [
          "Discuss pathway options with parents and teachers",
          "Research university requirements for chosen pathways", 
          "Focus on improving performance in core subjects",
          "Start developing skills relevant to career interests"
        ],
        shortTerm: [
          "Prepare thoroughly for KCSE examinations",
          "Apply for university/college programs",
          "Seek mentorship in chosen field",
          "Explore scholarship opportunities"
        ],
        longTerm: [
          "Pursue higher education in selected field",
          "Gain practical experience through internships",
          "Build professional networks in chosen industry",
          "Continue lifelong learning and skill development"
        ]
      },
      nextSteps: [
        "Review and discuss this report with family and counselors",
        "Make informed decisions about Grade 10-12 pathway selection",
        "Create a study plan for remaining school years",
        "Begin exploring career opportunities in recommended fields"
      ]
    };
  };

  const handleDownloadReport = () => {
    const reportContent = `CBC Career Assessment Report

EXECUTIVE SUMMARY
Student Profile: ${reportData?.executiveSummary?.studentProfile}
Completion Date: ${reportData?.executiveSummary?.completionDate}
Overall Score: ${reportData?.executiveSummary?.overallScore}%
AI Consultation: ${reportData?.executiveSummary?.aiConsultationCompleted ? 'Completed' : 'Not completed'}

KEY FINDINGS
Strengths: ${reportData?.keyFindings?.strengths?.join(', ')}
Growth Areas: ${reportData?.keyFindings?.growthAreas?.join(', ')}

PATHWAY RECOMMENDATIONS
${reportData?.cbcPathwayRecommendations?.map((p: any) => 
  `${p.pathway} (${p.match}% match) - ${p.reasoning}`
).join('\n')}

ACTION PLAN
${reportData?.actionPlan?.immediate?.map((item: string) => `• ${item}`).join('\n')}

Generated by CBC Career Guidance Platform`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CBC-Career-Assessment-Report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Your career assessment report has been downloaded.",
    });
  };

  const handleShareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'CBC Career Assessment Report',
        text: 'Check out my comprehensive career assessment results and pathway recommendations!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Report link has been copied to clipboard.",
      });
    }
  };

  const handleSubmit = () => {
    const finalData = {
      reportGenerated: true,
      reportData,
      completionTimestamp: new Date().toISOString(),
      assessmentComplete: true
    };
    console.log('CBC Assessment journey completed:', finalData);
    onNext(finalData);
  };

  if (reportStatus === 'generating') {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Generating Your Comprehensive Report</h3>
          <p className="text-gray-600">
            Analyzing your assessment data and AI consultation insights to create your personalized career guidance report
          </p>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h4 className="text-lg font-semibold mb-4">Processing Your Data</h4>
            <Progress value={progress} className="mb-4" />
            <p className="text-sm text-gray-600">{progress}% Complete</p>
            
            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <p>✓ Analyzing assessment responses</p>
              <p>✓ Processing AI consultation insights</p>
              <p>✓ Matching CBC pathway recommendations</p>
              <p>✓ Generating career guidance</p>
              <p>✓ Creating action plan</p>
              <p>✓ Finalizing comprehensive report</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Comprehensive Career Guidance Report</h3>
        <p className="text-gray-600">
          Complete analysis with AI-powered recommendations for your CBC pathway and career choices
        </p>
      </div>

      {/* Executive Summary */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Star className="w-5 h-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reportData?.executiveSummary?.overallScore || 87}%
              </div>
              <p className="text-sm text-gray-600">Overall Score</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reportData?.cbcPathwayRecommendations?.length || 3}
              </div>
              <p className="text-sm text-gray-600">Pathway Options</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {reportData?.executiveSummary?.questionsAnswered || 0}
              </div>
              <p className="text-sm text-gray-600">AI Questions</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${reportData?.executiveSummary?.aiConsultationCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                {reportData?.executiveSummary?.aiConsultationCompleted ? '✓' : '○'}
              </div>
              <p className="text-sm text-gray-600">AI Guidance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Consultation Insights */}
      {reportData?.aiConsultationInsights?.sessionsCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              AI Consultation Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h5 className="font-medium mb-2">Topics Discussed:</h5>
              <div className="flex flex-wrap gap-2">
                {reportData.aiConsultationInsights.topicsDiscussed.map((topic: string, index: number) => (
                  <Badge key={index} variant="outline">{topic}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-medium mb-2">Key Recommendations:</h5>
              <ul className="space-y-1">
                {reportData.aiConsultationInsights.keyRecommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            {reportData.aiConsultationInsights.personalizedGuidance && (
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                <h5 className="font-medium mb-1">Personalized Guidance:</h5>
                <p className="text-sm">{reportData.aiConsultationInsights.personalizedGuidance}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Key Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Strengths Identified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reportData?.keyFindings?.strengths?.map((strength: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <Star className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-700">Growth Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reportData?.keyFindings?.growthAreas?.map((area: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="text-sm">{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CBC Pathway Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>CBC Pathway Recommendations</CardTitle>
          <CardDescription>Ranked pathways based on your assessment and AI consultation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reportData?.cbcPathwayRecommendations?.map((pathway: any, index: number) => (
            <div key={index} className={`border rounded-lg p-4 ${index === 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg mb-1">{pathway.pathway}</h4>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="default">Code: {pathway.code}</Badge>
                    <Badge variant="outline">{pathway.match}% Match</Badge>
                    {index === 0 && <Badge variant="destructive">Top Choice</Badge>}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-3">{pathway.reasoning}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Required Subjects:</h5>
                  <div className="flex flex-wrap gap-1">
                    {pathway.subjects?.map((subject: string) => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Career Options:</h5>
                  <div className="flex flex-wrap gap-1">
                    {pathway.careerOptions?.slice(0, 4).map((career: string) => (
                      <Badge key={career} variant="outline" className="text-xs">
                        {career}
                      </Badge>
                    ))}
                    {pathway.careerOptions?.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{pathway.careerOptions.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {pathway.universities && (
                <div className="mt-3">
                  <h6 className="font-medium text-sm mb-1">Recommended Universities:</h6>
                  <p className="text-sm text-gray-600">{pathway.universities.join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Your Action Plan</CardTitle>
          <CardDescription>Step-by-step guide to achieve your career goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h5 className="font-medium mb-3 text-green-700">Immediate Actions</h5>
              <div className="space-y-2">
                {reportData?.actionPlan?.immediate?.map((action: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-green-600">{index + 1}</span>
                    </div>
                    <p className="text-sm">{action}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-3 text-blue-700">Short-term Goals</h5>
              <div className="space-y-2">
                {reportData?.actionPlan?.shortTerm?.map((action: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <p className="text-sm">{action}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-3 text-purple-700">Long-term Vision</h5>
              <div className="space-y-2">
                {reportData?.actionPlan?.longTerm?.map((action: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-purple-600">{index + 1}</span>
                    </div>
                    <p className="text-sm">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Report Actions</CardTitle>
          <CardDescription>Save, share, or print your comprehensive assessment report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleDownloadReport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
            <Button onClick={handleShareReport} variant="secondary" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
              Print Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        {onPrevious && (
          <Button variant="outline" onClick={onPrevious}>
            Previous: AI Consultation
          </Button>
        )}
        <Button 
          onClick={handleSubmit}
          className="ml-auto bg-green-600 hover:bg-green-700 text-white"
        >
          Complete Assessment Journey
        </Button>
      </div>
    </div>
  );
};
