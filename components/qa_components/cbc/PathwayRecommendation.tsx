'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Download, Share2 } from 'lucide-react';

const pathways = [
  {
    name: "STEM (Science, Technology, Engineering, Mathematics)",
    code: "STEM",
    description: "Focus on scientific and mathematical disciplines",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
    careers: ["Engineer", "Doctor", "Data Scientist", "Researcher"]
  },
  {
    name: "Arts and Sports Science",
    code: "ASS",
    description: "Creative arts and sports-related studies",
    subjects: ["Creative Arts", "Physical Education", "Psychology", "Biology"],
    careers: ["Artist", "Sports Coach", "Physiotherapist", "Art Teacher"]
  },
  {
    name: "Social Sciences",
    code: "SSC",
    description: "Study of human society and relationships",
    subjects: ["History", "Geography", "Psychology", "Sociology"],
    careers: ["Social Worker", "Lawyer", "Journalist", "Diplomat"]
  }
];

interface PathwayRecommendationProps {
  onNext: (data: any) => void;
  onPrevious?: () => void;
  data: any;
}

export const PathwayRecommendation: React.FC<PathwayRecommendationProps> = ({ onNext, onPrevious, data }) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis of assessment data
    const analyzeData = () => {
      setIsLoading(true);
      
      setTimeout(() => {
        // Mock pathway recommendations based on assessment data
        const mockRecommendations = pathways.map((pathway, index) => ({
          ...pathway,
          matchPercentage: Math.floor(Math.random() * 30) + 70, // 70-100% match
          reasoning: `Based on your strong performance in related learning areas and competencies, this pathway aligns well with your demonstrated skills and interests.`,
          rank: index + 1
        })).sort((a, b) => b.matchPercentage - a.matchPercentage);

        setRecommendations(mockRecommendations);
        setIsLoading(false);
      }, 3000);
    };

    analyzeData();
  }, [data]);

  const handleComplete = () => {
    onNext({ recommendations });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Assessment Results</h3>
          <p className="text-gray-600">
            Our AI is processing your responses to generate personalized pathway recommendations...
          </p>
        </div>
        
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h4 className="font-medium">Processing Assessment Data</h4>
              <Progress value={66} className="w-full max-w-sm mx-auto" />
              <p className="text-sm text-gray-500">This may take a few moments...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Personalized Pathway Recommendations</h3>
        <p className="text-gray-600">
          Based on your comprehensive CBC assessment, here are your recommended Grade 10-12 pathways
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((pathway, index) => (
          <Card key={pathway.code} className={`${index === 0 ? 'ring-2 ring-gold-400 bg-yellow-50' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{pathway.name}</CardTitle>
                    {index === 0 && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      Rank #{pathway.rank}
                    </Badge>
                  </div>
                  <CardDescription>{pathway.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{pathway.matchPercentage}%</div>
                  <div className="text-sm text-gray-500">Match</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Key Subjects</h5>
                <div className="flex flex-wrap gap-2">
                  {pathway.subjects.map((subject: string) => (
                    <Badge key={subject} variant="outline">{subject}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Career Opportunities</h5>
                <div className="flex flex-wrap gap-2">
                  {pathway.careers.map((career: string) => (
                    <Badge key={career} variant="secondary">{career}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-medium mb-1">Why this pathway?</h5>
                <p className="text-sm text-gray-600">{pathway.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h4 className="font-semibold">Ready to take the next step?</h4>
            <p className="text-gray-600">
              Download your comprehensive report or share it with your parents and teachers
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        {onPrevious && (
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
        )}
        <Button onClick={handleComplete} className="ml-auto">
          Complete Assessment
        </Button>
      </div>
    </div>
  );
};
