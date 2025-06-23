'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

const competencies = [
  {
    category: "Communication and Collaboration",
    items: [
      { name: "Effective Communication", description: "Expressing ideas clearly in various formats" },
      { name: "Active Listening", description: "Understanding and responding appropriately" },
      { name: "Teamwork", description: "Working effectively with others" }
    ]
  },
  {
    category: "Critical Thinking and Problem Solving",
    items: [
      { name: "Analytical Thinking", description: "Breaking down complex problems" },
      { name: "Creative Solutions", description: "Generating innovative approaches" },
      { name: "Decision Making", description: "Making informed choices" }
    ]
  },
  {
    category: "Citizenship",
    items: [
      { name: "Social Responsibility", description: "Contributing positively to society" },
      { name: "Cultural Awareness", description: "Respecting diversity and inclusion" },
      { name: "Environmental Stewardship", description: "Caring for the environment" }
    ]
  }
];

interface CoreCompetenciesProps {
  onNext: (data: any) => void;
  onPrevious?: () => void;
  data: any;
}

export const CoreCompetencies: React.FC<CoreCompetenciesProps> = ({ onNext, onPrevious, data }) => {
  const [ratings, setRatings] = useState<Record<string, number>>(data.competencies || {});

  const handleRatingChange = (competencyName: string, value: number[]) => {
    setRatings(prev => ({ ...prev, [competencyName]: value[0] }));
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 80) return { label: "Excellent", color: "bg-green-500" };
    if (rating >= 60) return { label: "Good", color: "bg-blue-500" };
    if (rating >= 40) return { label: "Fair", color: "bg-yellow-500" };
    return { label: "Needs Improvement", color: "bg-red-500" };
  };

  const handleSubmit = () => {
    onNext({ competencies: ratings });
  };

  const totalCompetencies = competencies.reduce((acc, cat) => acc + cat.items.length, 0);
  const isComplete = Object.keys(ratings).length === totalCompetencies;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Core Competencies Assessment</h3>
        <p className="text-gray-600">
          Rate your competency level in each area based on your experiences and observations
        </p>
      </div>

      {competencies.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="text-lg text-green-600">{category.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.items.map((competency) => {
              const rating = ratings[competency.name] || 50;
              const ratingInfo = getRatingLabel(rating);
              
              return (
                <div key={competency.name} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{competency.name}</h4>
                      <p className="text-sm text-gray-600">{competency.description}</p>
                    </div>
                    <Badge className={`${ratingInfo.color} text-white ml-4`}>
                      {ratingInfo.label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Competency Level</span>
                      <span className="font-medium">{rating}%</span>
                    </div>
                    <Slider
                      value={[rating]}
                      onValueChange={(value) => handleRatingChange(competency.name, value)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
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
          className="ml-auto"
        >
          Next: Psychomotor Skills
        </Button>
      </div>
    </div>
  );
};
