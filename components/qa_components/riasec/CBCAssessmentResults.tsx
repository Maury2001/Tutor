
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CBCScores } from '../../../app/assessment/riasec/page';
import { getCBCPathwayRecommendations } from '@/utils/cbcScoring';
import { BookOpen, Target, TrendingUp } from 'lucide-react';

interface CBCAssessmentResultsProps {
  scores: CBCScores;
  onRetake: () => void;
}

export const CBCAssessmentResults: React.FC<CBCAssessmentResultsProps> = ({
  scores,
  onRetake,
}) => {
  const maxScore = Math.max(...Object.values(scores));
  
  const sortedScores = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([key, value]) => ({
      area: key,
      score: value,
      percentage: (value / maxScore) * 100,
    }));

  const pathwayRecommendations = getCBCPathwayRecommendations(scores);
  const topThreeAreas = sortedScores.slice(0, 3);

  const areaDescriptions = {
    mathematics: {
      name: 'Mathematics',
      description: 'Strong analytical and problem-solving abilities with numbers and logical reasoning.',
      color: 'bg-green-500',
    },
    english: {
      name: 'English Language',
      description: 'Excellent communication skills and language comprehension abilities.',
      color: 'bg-blue-500',
    },
    kiswahili: {
      name: 'Kiswahili',
      description: 'Proficiency in national language and cultural understanding.',
      color: 'bg-purple-500',
    },
    science: {
      name: 'Integrated Science',
      description: 'Curiosity about natural phenomena and scientific inquiry skills.',
      color: 'bg-cyan-500',
    },
    socialStudies: {
      name: 'Social Studies',
      description: 'Understanding of society, culture, and human relationships.',
      color: 'bg-orange-500',
    },
    religiousEducation: {
      name: 'Religious Education',
      description: 'Interest in moral values, ethics, and spiritual development.',
      color: 'bg-indigo-500',
    },
    creativeArts: {
      name: 'Creative Arts',
      description: 'Artistic expression and creative thinking abilities.',
      color: 'bg-pink-500',
    },
    physicalEducation: {
      name: 'Physical Education',
      description: 'Physical fitness, sports skills, and motor coordination.',
      color: 'bg-red-500',
    },
    healthEducation: {
      name: 'Health Education',
      description: 'Understanding of health, wellness, and healthy lifestyle choices.',
      color: 'bg-emerald-500',
    },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-8 h-8 text-green-600" />
            <CardTitle className="text-3xl font-bold text-green-700">
              Your CBC Learning Profile
            </CardTitle>
          </div>
          <CardDescription className="text-lg">
            Based on your responses, here's your learning area preference profile
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Learning Area Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedScores.map((item, index) => {
              const areaInfo = areaDescriptions[item.area as keyof typeof areaDescriptions];
              return (
                <div key={item.area} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {index + 1}. {areaInfo.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.score} points
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-3" />
                  <p className="text-sm text-gray-600">{areaInfo.description}</p>
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
            {topThreeAreas.map((item, index) => {
              const areaInfo = areaDescriptions[item.area as keyof typeof areaDescriptions];
              return (
                <div key={item.area} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg">
                    {index + 1}. {areaInfo.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{areaInfo.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${areaInfo.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.score} points</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Recommended Grade 10-12 Pathways
          </CardTitle>
          <CardDescription>
            Based on your learning preferences, these pathways align with your strengths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pathwayRecommendations.map((pathway, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-lg text-green-700 mb-2">
                  {pathway.pathway}
                </h4>
                <p className="text-gray-600 text-sm mb-3">{pathway.description}</p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-800">Recommended Subjects:</p>
                  <div className="flex flex-wrap gap-1">
                    {pathway.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Next Steps</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discuss these results with your teachers, parents, and career guidance counselor to make informed decisions about your Grade 10-12 pathway selection.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={onRetake} variant="outline" size="lg">
                Retake Assessment
              </Button>
              <Button size="lg" onClick={() => window.print()}>
                Print Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
