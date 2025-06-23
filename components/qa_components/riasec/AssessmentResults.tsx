
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CBCScores } from '@/utils/cbcScoring';
import { getCBCPathwayRecommendations } from '@/utils/cbcScoring';

interface AssessmentResultsProps {
  scores: CBCScores;
  onRetake: () => void;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  scores,
  onRetake,
}) => {
  const maxScore = Math.max(...Object.values(scores));
  const totalScore = Object.values(scores).reduce((sum: number, score: number) => sum + score, 0);
  
  const sortedScores = Object.entries(scores)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(([key, value]) => ({
      type: key,
      score: value as number,
      percentage: ((value as number) / maxScore) * 100,
    }));

  const topThreeTypes = sortedScores.slice(0, 3);
  const pathwayRecommendations = getCBCPathwayRecommendations(scores);

  const typeDescriptions = {
    mathematics: {
      name: 'Mathematics',
      description: 'You prefer analytical thinking and problem-solving with numbers.',
      traits: ['Analytical', 'Logical', 'Problem-solving', 'Quantitative'],
    },
    english: {
      name: 'English Language', 
      description: 'You enjoy communication, reading, and language expression.',
      traits: ['Communication', 'Reading', 'Writing', 'Expression'],
    },
    kiswahili: {
      name: 'Kiswahili',
      description: 'You value cultural understanding and local language skills.',
      traits: ['Cultural', 'Communication', 'Heritage', 'Expression'],
    },
    science: {
      name: 'Integrated Science',
      description: 'You enjoy exploring natural phenomena and scientific inquiry.',
      traits: ['Investigative', 'Experimental', 'Curious', 'Analytical'],
    },
    socialStudies: {
      name: 'Social Studies',
      description: 'You are interested in society, culture, and human relationships.',
      traits: ['Social', 'Cultural', 'Historical', 'Civic'],
    },
    religiousEducation: {
      name: 'Religious Education',
      description: 'You value moral development and spiritual growth.',
      traits: ['Moral', 'Spiritual', 'Ethical', 'Reflective'],
    },
    creativeArts: {
      name: 'Creative Arts',
      description: 'You enjoy artistic expression and creative activities.',
      traits: ['Creative', 'Artistic', 'Expressive', 'Imaginative'],
    },
    physicalEducation: {
      name: 'Physical Education',
      description: 'You prefer physical activities and sports.',
      traits: ['Physical', 'Active', 'Competitive', 'Healthy'],
    },
    healthEducation: {
      name: 'Health Education',
      description: 'You are interested in wellness and healthy living.',
      traits: ['Health-conscious', 'Caring', 'Preventive', 'Wellness'],
    },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-700">
            Your CBC Learning Profile
          </CardTitle>
          <CardDescription className="text-lg">
            Based on your responses across CBC learning areas
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Area Scores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedScores.map((item, index) => {
              const typeInfo = typeDescriptions[item.type as keyof typeof typeDescriptions];
              return (
                <div key={item.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {index + 1}. {typeInfo.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.score} points
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-3" />
                  <p className="text-sm text-gray-600">{typeInfo.description}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Top 3 Learning Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topThreeTypes.map((item, index) => {
              const typeInfo = typeDescriptions[item.type as keyof typeof typeDescriptions];
              return (
                <div key={item.type} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg">
                    {index + 1}. {typeInfo.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{typeInfo.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {typeInfo.traits.map((trait) => (
                      <span
                        key={trait}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Grade 10-12 Pathways</CardTitle>
          <CardDescription>
            Based on your learning preferences, here are pathways to consider:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pathwayRecommendations.map((pathway, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-lg">{pathway.pathway}</h4>
                <p className="text-gray-600 text-sm">{pathway.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {pathway.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onRetake} size="lg">
          Retake Assessment
        </Button>
      </div>
    </div>
  );
};
