
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AssessmentData } from '@/pages/Index';
import { Trophy, Lightbulb, BookOpen, Users, Briefcase, Calculator, Zap, RotateCcw, Bot, FileText } from 'lucide-react';

interface AssessmentResultsProps {
  data: AssessmentData;
  onExploreSimulations: () => void;
  onAIConsultant: () => void;
  onSelectedPathway: () => void;
  onStartOver: () => void;
}

const riasecDetails = {
  R: {
    name: 'Realistic',
    icon: Trophy,
    color: 'bg-green-500',
    description: 'You prefer hands-on, practical work with tools, machines, and physical activities.',
    careers: ['Engineer', 'Technician', 'Mechanic', 'Electrician', 'Carpenter', 'Pilot'],
    pathway: 'STEM - Technical / Engineering'
  },
  I: {
    name: 'Investigative',
    icon: Lightbulb,
    color: 'bg-blue-500',
    description: 'You enjoy research, analysis, and solving complex problems through scientific methods.',
    careers: ['Scientist', 'Researcher', 'Doctor', 'Pharmacist', 'Mathematician', 'Psychologist'],
    pathway: 'STEM - Pure / Applied Sciences'
  },
  A: {
    name: 'Artistic',
    icon: BookOpen,
    color: 'bg-purple-500',
    description: 'You are drawn to creative expression, design, and artistic activities.',
    careers: ['Designer', 'Artist', 'Musician', 'Writer', 'Photographer', 'Animator'],
    pathway: 'Arts and Sports'
  },
  S: {
    name: 'Social',
    icon: Users,
    color: 'bg-orange-500',
    description: 'You enjoy helping others, teaching, and working in social environments.',
    careers: ['Teacher', 'Counselor', 'Social Worker', 'Nurse', 'Therapist', 'Coach'],
    pathway: 'Social Sciences / Humanities'
  },
  E: {
    name: 'Enterprising',
    icon: Briefcase,
    color: 'bg-red-500',
    description: 'You like leadership roles, business activities, and entrepreneurial ventures.',
    careers: ['Manager', 'Entrepreneur', 'Sales Rep', 'Lawyer', 'Politician', 'Marketing Specialist'],
    pathway: 'Business / Entrepreneurship'
  },
  C: {
    name: 'Conventional',
    icon: Calculator,
    color: 'bg-gray-500',
    description: 'You prefer organized, systematic work with data, details, and established procedures.',
    careers: ['Accountant', 'Administrator', 'Data Analyst', 'Banker', 'Secretary', 'Auditor'],
    pathway: 'ICT / Administration'
  }
};

const AssessmentResults = ({ data, onExploreSimulations, onAIConsultant, onSelectedPathway, onStartOver }: AssessmentResultsProps) => {
  const [primaryCode, secondaryCode] = data.topCodes.split(',') as [keyof typeof riasecDetails, keyof typeof riasecDetails];
  const primaryType = riasecDetails[primaryCode];
  const secondaryType = riasecDetails[secondaryCode];

  const maxScore = Math.max(...Object.values(data.scores));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your CBC Portfolio Profile Results
          </h1>
          <p className="text-xl text-gray-600">Hello {data.name}! Here's what we discovered about your career interests.</p>
        </div>

        {/* Primary and Secondary Types */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {[
            { type: primaryType, code: primaryCode, label: 'Primary Interest' },
            { type: secondaryType, code: secondaryCode, label: 'Secondary Interest' }
          ].map(({ type, code, label }) => {
            const Icon = type.icon;
            return (
              <Card key={code} className="shadow-xl">
                <CardHeader className="text-center">
                  <div className={`p-4 ${type.color} rounded-full w-fit mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{label}</CardTitle>
                  <p className="text-lg font-semibold">{type.name} ({code})</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{type.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Recommended Pathway:</h4>
                    <p className="text-blue-600 font-medium">{type.pathway}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Sample Careers:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {type.careers.map((career, index) => (
                        <div key={index} className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                          {career}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Score Breakdown */}
        <Card className="shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-center">Complete Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(riasecDetails).map(([code, details]) => {
                const Icon = details.icon;
                const score = data.scores[code as keyof typeof data.scores];
                const percentage = (score / maxScore) * 100;
                
                return (
                  <div key={code} className="text-center">
                    <div className={`p-3 ${details.color} rounded-full w-fit mx-auto mb-2`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold">{details.name}</h4>
                    <p className="text-2xl font-bold text-gray-800">{score}</p>
                    <Progress value={percentage} className="mt-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={onExploreSimulations}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Zap className="w-5 h-5 mr-2" />
              Explore Simulations
            </Button>
            
            <Button
              onClick={onAIConsultant}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Bot className="w-5 h-5 mr-2" />
              AI Career Consultant
            </Button>
            
            <Button
              onClick={onSelectedPathway}
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <FileText className="w-5 h-5 mr-2" />
              Selected Pathway Grade 9-12
            </Button>
          </div>
          
          <Button
            onClick={onStartOver}
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg rounded-xl"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Start New Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
