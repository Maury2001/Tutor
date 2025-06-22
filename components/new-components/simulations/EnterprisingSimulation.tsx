
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, TrendingUp, DollarSign, Target, Users } from 'lucide-react';

interface EnterprisingSimulationProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const EnterprisingSimulation = ({ onComplete, onBack }: EnterprisingSimulationProps) => {
  const [pitchData, setPitchData] = useState({
    businessName: '',
    problem: '',
    solution: '',
    targetMarket: '',
    revenue: '',
    funding: ''
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const steps = [
    { title: 'Business Concept', fields: ['businessName', 'problem', 'solution'] },
    { title: 'Market Analysis', fields: ['targetMarket'] },
    { title: 'Financial Plan', fields: ['revenue', 'funding'] },
    { title: 'Final Pitch', fields: [] }
  ];

  const handleInputChange = (field: string, value: string) => {
    setPitchData(prev => ({ ...prev, [field]: value }));
  };

  const calculateStepScore = () => {
    const currentFields = steps[currentStep].fields;
    let stepScore = 0;
    
    currentFields.forEach(field => {
      const value = pitchData[field as keyof typeof pitchData];
      if (value && value.length > 10) {
        stepScore += 25 / currentFields.length;
      }
    });
    
    return stepScore;
  };

  const handleNextStep = () => {
    const stepScore = calculateStepScore();
    setScore(prev => prev + stepScore);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      presentPitch();
    }
  };

  const presentPitch = () => {
    let finalScore = score;
    let pitchFeedback = '';
    
    // Evaluate the complete pitch
    const completedFields = Object.values(pitchData).filter(value => value.length > 10).length;
    const completionBonus = (completedFields / 6) * 25;
    finalScore += completionBonus;
    
    if (finalScore >= 80) {
      pitchFeedback = 'Outstanding pitch! You have strong entrepreneurial instincts and presented a compelling business case.';
    } else if (finalScore >= 60) {
      pitchFeedback = 'Good pitch! You understand the basics of business planning and have entrepreneurial potential.';
    } else {
      pitchFeedback = 'Nice effort! Continue developing your business planning skills and entrepreneurial thinking.';
    }
    
    setFeedback(pitchFeedback);
    setTimeout(() => onComplete(Math.round(finalScore)), 3000);
  };

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={pitchData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Enter your business name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="problem">What problem does your business solve?</Label>
              <Textarea
                id="problem"
                value={pitchData.problem}
                onChange={(e) => handleInputChange('problem', e.target.value)}
                placeholder="Describe the problem your business addresses..."
                className="mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="solution">Your solution</Label>
              <Textarea
                id="solution"
                value={pitchData.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                placeholder="Explain your solution to the problem..."
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="targetMarket">Target Market</Label>
              <Textarea
                id="targetMarket"
                value={pitchData.targetMarket}
                onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                placeholder="Who are your customers? Describe your target market..."
                className="mt-2"
                rows={4}
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Market Research Tips:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Define your ideal customer</li>
                <li>• Estimate market size</li>
                <li>• Identify competitors</li>
                <li>• Understand customer needs</li>
              </ul>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="revenue">Revenue Model</Label>
              <Textarea
                id="revenue"
                value={pitchData.revenue}
                onChange={(e) => handleInputChange('revenue', e.target.value)}
                placeholder="How will your business make money? Describe your revenue streams..."
                className="mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="funding">Funding Requirements</Label>
              <Textarea
                id="funding"
                value={pitchData.funding}
                onChange={(e) => handleInputChange('funding', e.target.value)}
                placeholder="How much funding do you need and what will you use it for?"
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Your Business Pitch: {pitchData.businessName}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Problem:</h4>
                  <p className="text-red-100">{pitchData.problem}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Solution:</h4>
                  <p className="text-red-100">{pitchData.solution}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Target Market:</h4>
                  <p className="text-red-100">{pitchData.targetMarket}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Revenue Model:</h4>
                  <p className="text-red-100">{pitchData.revenue}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Funding:</h4>
                  <p className="text-red-100">{pitchData.funding}</p>
                </div>
              </div>
            </div>
            {feedback && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Investor Feedback:</h4>
                <p className="text-green-700">{feedback}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Simulations
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Business Pitch Challenge
            </h1>
            <p className="text-gray-600">Develop and present your business idea</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-red-600">{Math.round(score)}/100</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-red-500" />
                {steps[currentStep].title}
              </CardTitle>
              <div className="flex space-x-2 mt-4">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full ${
                      index <= currentStep ? 'bg-red-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {getCurrentStepContent()}
              
              <div className="mt-8">
                <Button
                  onClick={handleNextStep}
                  disabled={currentStep === 3 && !feedback}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                >
                  {currentStep === steps.length - 1 ? 'Present to Investors' : 'Next Step'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Entrepreneurship</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Business Careers:</h4>
                <div className="space-y-1 text-sm">
                  {[
                    'Entrepreneur',
                    'Business Analyst',
                    'Marketing Manager',
                    'Sales Director',
                    'Project Manager',
                    'Consultant'
                  ].map((career, index) => (
                    <div key={index} className="text-red-700">• {career}</div>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Key Skills:</h4>
                <div className="space-y-1 text-sm text-orange-700">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Strategic thinking
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Leadership
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Financial planning
                  </div>
                  <div>• Risk assessment</div>
                  <div>• Communication</div>
                  <div>• Innovation</div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Pitch Elements:</h4>
                <div className="space-y-1 text-sm text-yellow-700">
                  <div>✓ Clear problem statement</div>
                  <div>✓ Innovative solution</div>
                  <div>✓ Market opportunity</div>
                  <div>✓ Revenue model</div>
                  <div>✓ Funding requirements</div>
                  <div>✓ Compelling presentation</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-6xl mb-2">🚀</div>
                <p className="text-gray-600 text-sm">
                  Building the future
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnterprisingSimulation;
