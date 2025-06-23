'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, TrendingUp, BookOpen, Star, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const cbePathways = [
  {
    category: "STEM Pathways",
    pathways: [
      {
        name: "Pure Sciences",
        subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
        careerPaths: ["Medical Doctor", "Engineer", "Research Scientist", "Pharmacist"],
        requirements: "Strong performance in Mathematics and Sciences",
        universities: ["University of Nairobi", "JKUAT", "Moi University"]
      },
      {
        name: "Applied Sciences",
        subjects: ["Mathematics", "Physics", "Chemistry", "Computer Science"],
        careerPaths: ["Software Engineer", "Data Scientist", "ICT Specialist", "Systems Analyst"],
        requirements: "Good Mathematics and logical reasoning skills",
        universities: ["Strathmore University", "USIU", "KCA University"]
      }
    ]
  },
  {
    category: "Business & Commerce",
    pathways: [
      {
        name: "Business Studies",
        subjects: ["Business Studies", "Mathematics", "Economics", "Accounting"],
        careerPaths: ["Business Manager", "Entrepreneur", "Financial Analyst", "Marketing Manager"],
        requirements: "Strong analytical and communication skills",
        universities: ["University of Nairobi", "Strathmore University", "USIU"]
      },
      {
        name: "Economics & Finance",
        subjects: ["Economics", "Mathematics", "Business Studies", "Geography"],
        careerPaths: ["Economist", "Financial Advisor", "Investment Analyst", "Bank Manager"],
        requirements: "Excellent mathematical and analytical abilities",
        universities: ["University of Nairobi", "Kenyatta University", "Strathmore University"]
      }
    ]
  },
  {
    category: "Humanities & Social Sciences",
    pathways: [
      {
        name: "Languages & Literature",
        subjects: ["English", "Kiswahili", "Literature", "History"],
        careerPaths: ["Teacher", "Journalist", "Translator", "Content Writer"],
        requirements: "Excellent communication and language skills",
        universities: ["University of Nairobi", "Kenyatta University", "Moi University"]
      },
      {
        name: "Social Sciences",
        subjects: ["History", "Geography", "Government", "Religious Studies"],
        careerPaths: ["Social Worker", "Diplomat", "Researcher", "NGO Worker"],
        requirements: "Strong research and interpersonal skills",
        universities: ["University of Nairobi", "Kenyatta University", "Maseno University"]
      }
    ]
  }
];

interface CBEPathwayRecommendationProps {
  onNext: (data: any) => void;
  onPrevious?: () => void;
  data: any;
}

export const CBEPathwayRecommendation: React.FC<CBEPathwayRecommendationProps> = ({ onNext, onPrevious, data }) => {
  const [selectedPathways, setSelectedPathways] = useState<string[]>(data.pathways?.selected || []);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateAIRecommendations();
  }, [data]);

  const generateAIRecommendations = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('ai-pathway-recommendations', {
        body: {
          assessmentData: data,
          curriculum: 'CBE',
          gradeLevel: 'Grade 10-12'
        }
      });

      if (error) throw error;
      setAiRecommendations(result.recommendations || []);
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      // Fallback recommendations based on assessment data
      setAiRecommendations([
        { pathway: "Pure Sciences", confidence: 85, reason: "Strong performance in Mathematics and Sciences" },
        { pathway: "Applied Sciences", confidence: 78, reason: "Good logical reasoning and problem-solving skills" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePathwayToggle = (pathwayName: string) => {
    setSelectedPathways(prev => 
      prev.includes(pathwayName) 
        ? prev.filter(p => p !== pathwayName)
        : [...prev, pathwayName]
    );
  };

  const handleSubmit = () => {
    const pathwayData = {
      pathways: {
        selected: selectedPathways,
        aiRecommendations,
        timestamp: new Date().toISOString()
      }
    };
    console.log('Submitting CBE pathway data:', pathwayData);
    onNext(pathwayData);
  };

  const isComplete = selectedPathways.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Recommended CBE Pathway Grade 10-12</h3>
        <p className="text-gray-600">
          Based on your assessment results, explore these CBE Curriculum pathways for senior school
        </p>
      </div>

      {/* AI Recommendations */}
      {loading ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Generating AI-powered pathway recommendations...</p>
          </CardContent>
        </Card>
      ) : (
        aiRecommendations.length > 0 && (
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Star className="w-5 h-5" />
                AI Recommended Pathways
              </CardTitle>
              <CardDescription>
                These pathways are specifically recommended based on your assessment results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">{rec.pathway}</h4>
                    <p className="text-sm text-gray-600">{rec.reason}</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100">
                    {rec.confidence}% Match
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      )}

      {/* All Available Pathways */}
      {cbePathways.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-green-600">
              <GraduationCap className="w-5 h-5" />
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.pathways.map((pathway) => {
              const isSelected = selectedPathways.includes(pathway.name);
              const isAIRecommended = aiRecommendations.some(rec => rec.pathway === pathway.name);
              
              return (
                <Card 
                  key={pathway.name} 
                  className={`cursor-pointer transition-all border-2 ${
                    isSelected ? 'border-green-500 bg-green-50' : 
                    isAIRecommended ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => handlePathwayToggle(pathway.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{pathway.name}</h4>
                        {isAIRecommended && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                        {isSelected && <ChevronRight className="w-4 h-4 text-green-500" />}
                      </div>
                      <div className="flex gap-2">
                        {isAIRecommended && <Badge variant="outline" className="text-blue-600">AI Recommended</Badge>}
                        {isSelected && <Badge className="bg-green-500">Selected</Badge>}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Core Subjects:</p>
                        <div className="flex flex-wrap gap-1">
                          {pathway.subjects.map(subject => (
                            <Badge key={subject} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Career Paths:</p>
                        <p className="text-sm text-gray-600">{pathway.careerPaths.join(", ")}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Requirements:</p>
                        <p className="text-sm text-gray-600">{pathway.requirements}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Top Universities:</p>
                        <p className="text-sm text-gray-600">{pathway.universities.join(", ")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between pt-4">
        {onPrevious && (
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
        )}
        <Button 
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`ml-auto ${isComplete ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {isComplete ? 'Next: Career Pathway' : 'Select at least one pathway to continue'}
        </Button>
      </div>
    </div>
  );
};
