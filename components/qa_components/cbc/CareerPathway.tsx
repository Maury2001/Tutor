'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Briefcase, DollarSign, Users, MapPin } from 'lucide-react';

interface CareerPathwayProps {
  onNext: (data: any) => void;
  onPrevious?: () => void;
  data: any;
}

export const CareerPathway: React.FC<CareerPathwayProps> = ({ onNext, onPrevious, data }) => {
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);

  const careerCategories = [
    {
      name: "Healthcare & Medicine",
      careers: [
        { name: "Medical Doctor", salary: "KSh 200,000-500,000", demand: "High", location: "Nairobi, Mombasa, Kisumu" },
        { name: "Nurse", salary: "KSh 40,000-80,000", demand: "Very High", location: "All Counties" },
        { name: "Pharmacist", salary: "KSh 60,000-120,000", demand: "High", location: "Urban Areas" }
      ]
    },
    {
      name: "Technology & Innovation",
      careers: [
        { name: "Software Engineer", salary: "KSh 80,000-300,000", demand: "Very High", location: "Nairobi, Mombasa" },
        { name: "Data Scientist", salary: "KSh 100,000-400,000", demand: "High", location: "Nairobi" },
        { name: "ICT Specialist", salary: "KSh 50,000-150,000", demand: "High", location: "Major Towns" }
      ]
    },
    {
      name: "Business & Finance",
      careers: [
        { name: "Business Manager", salary: "KSh 70,000-250,000", demand: "Medium", location: "All Major Towns" },
        { name: "Financial Analyst", salary: "KSh 60,000-180,000", demand: "High", location: "Nairobi, Mombasa" },
        { name: "Entrepreneur", salary: "Variable", demand: "High", location: "Anywhere" }
      ]
    }
  ];

  const handleCareerToggle = (careerName: string) => {
    setSelectedCareers(prev => 
      prev.includes(careerName) 
        ? prev.filter(c => c !== careerName)
        : [...prev, careerName]
    );
  };

  const handleSubmit = () => {
    const careerData = {
      careerData: {
        selectedCareers,
        exploredCategories: careerCategories.length,
        timestamp: new Date().toISOString()
      }
    };
    console.log('Submitting career pathway data:', careerData);
    onNext(careerData);
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High': return 'bg-green-100 text-green-800';
      case 'High': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Career Pathway Exploration</h3>
        <p className="text-gray-600">
          Explore career options based on your selected CBE pathways and interests
        </p>
        <div className="mt-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {selectedCareers.length} Careers Selected
          </Badge>
        </div>
      </div>

      {careerCategories.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-purple-600">
              <TrendingUp className="w-5 h-5" />
              {category.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.careers.map((career) => {
              const isSelected = selectedCareers.includes(career.name);
              
              return (
                <Card 
                  key={career.name} 
                  className={`cursor-pointer transition-all border-2 ${
                    isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => handleCareerToggle(career.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {career.name}
                      </h4>
                      {isSelected && <Badge className="bg-purple-500">Selected</Badge>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="font-medium">Salary Range</p>
                          <p className="text-gray-600">{career.salary}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="font-medium">Market Demand</p>
                          <Badge className={getDemandColor(career.demand)}>
                            {career.demand}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-gray-600">{career.location}</p>
                        </div>
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
          className="ml-auto bg-purple-600 hover:bg-purple-700"
        >
          Next: AI Career Counselor
        </Button>
      </div>
    </div>
  );
};
