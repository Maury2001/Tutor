
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RiasecCbcScores, CbcValuesScores, getCbcPathwayRecommendations, getHollandCode } from '@/utils/riasecCbcScoring';
import { Target, TrendingUp, BookOpen, Heart, Download, Share2 } from 'lucide-react';

interface RiasecCbcResultsProps {
  riasecScores: RiasecCbcScores;
  valuesScores: CbcValuesScores;
  onRetake: () => void;
}

export const RiasecCbcResults: React.FC<RiasecCbcResultsProps> = ({
  riasecScores,
  valuesScores,
  onRetake,
}) => {
  const maxRiasecScore = Math.max(...Object.values(riasecScores));
  const recommendations = getCbcPathwayRecommendations(riasecScores);
  const hollandCode = getHollandCode(riasecScores);

  const riasecTypes = [
    { key: 'realistic', name: 'Realistic', description: 'Practical, hands-on problem solvers', color: 'bg-green-500' },
    { key: 'investigative', name: 'Investigative', description: 'Analytical thinkers who enjoy research', color: 'bg-blue-500' },
    { key: 'artistic', name: 'Artistic', description: 'Creative and expressive individuals', color: 'bg-purple-500' },
    { key: 'social', name: 'Social', description: 'People-oriented helpers and teachers', color: 'bg-orange-500' },
    { key: 'enterprising', name: 'Enterprising', description: 'Persuasive leaders and entrepreneurs', color: 'bg-red-500' },
    { key: 'conventional', name: 'Conventional', description: 'Organized and detail-oriented workers', color: 'bg-gray-500' },
  ];

  const sortedRiasec = riasecTypes
    .map(type => ({
      ...type,
      score: riasecScores[type.key as keyof RiasecCbcScores],
      percentage: (riasecScores[type.key as keyof RiasecCbcScores] / maxRiasecScore) * 100,
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-8 h-8 text-green-600" />
            <CardTitle className="text-3xl font-bold text-green-700">
              Your CBC Career Pathway Profile
            </CardTitle>
          </div>
          <CardDescription className="text-lg">
            Grade 9 RIASEC Assessment Results for Senior School Pathway Selection
          </CardDescription>
          <div className="mt-4">
            <Badge variant="default" className="text-lg px-4 py-2">
              Holland Code: {hollandCode}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              RIASEC Interest Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedRiasec.map((type, index) => (
              <div key={type.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {index + 1}. {type.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {type.score} points
                  </span>
                </div>
                <Progress value={type.percentage} className="h-3" />
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              CBC Core Values Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Your responses show alignment with CBC core values through career interests
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(valuesScores).map(([value, score]) => (
                  <Badge key={value} variant="outline" className="p-2">
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Recommended CBC Pathways for Grade 10-12
          </CardTitle>
          <CardDescription>
            Based on your RIASEC profile, these pathways align best with your interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((pathway, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${index === 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg text-green-700 mb-1">
                      {pathway.pathway}
                    </h4>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="default">Code: {pathway.code}</Badge>
                      <Badge variant="secondary">{pathway.match} Match</Badge>
                      {index === 0 && <Badge variant="destructive">Top Recommendation</Badge>}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{pathway.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Learning Areas (Grade 10-12)</h5>
                    <div className="flex flex-wrap gap-1">
                      {pathway.learningAreas.map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Career Opportunities</h5>
                    <div className="flex flex-wrap gap-1">
                      {pathway.careers.slice(0, 4).map((career) => (
                        <Badge key={career} variant="secondary" className="text-xs">
                          {career}
                        </Badge>
                      ))}
                      {pathway.careers.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{pathway.careers.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Why this pathway?</strong> {pathway.reasoning}
                  </p>
                </div>
                
                <div className="mt-2">
                  <h6 className="font-medium text-sm mb-1">Career Clusters</h6>
                  <div className="flex flex-wrap gap-1">
                    {pathway.clusters.map((cluster) => (
                      <Badge key={cluster} variant="outline" className="text-xs">
                        {cluster}
                      </Badge>
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
            <h3 className="text-xl font-semibold">Next Steps for Grade 10 Preparation</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discuss these results with your parents, teachers, and career guidance counselor. 
              Consider visiting schools that offer your recommended pathways and explore career mentorship opportunities.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={onRetake} variant="outline" size="lg">
                Retake Assessment
              </Button>
              <Button size="lg" onClick={() => window.print()}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
