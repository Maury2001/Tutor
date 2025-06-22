import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AssessmentData } from '../../app/personal-assessment/page';
import { ArrowLeft, Zap, Beaker, Palette, Heart, TrendingUp, FileSpreadsheet, Play, Star, GraduationCap, Download, FileText } from 'lucide-react';
import RealisticSimulation from '../../components/new-components/simulations/RealisticSimulation';
import InvestigativeSimulation from '../../components/new-components/simulations/InvestigativeSimulation';
import ArtisticSimulation from '../../components/new-components/simulations/ArtisticSimulation';
import SocialSimulation from '../../components/new-components/simulations/SocialSimulation';
import EnterprisingSimulation from '../../components/new-components/simulations/EnterprisingSimulation';
import ConventionalSimulation from '../../components/new-components/simulations/ConventionalSimulation';
import FinalReport from '../../components/new-components/FinalReport';

interface SimulationHubProps {
  assessmentData: AssessmentData;
  onBackToResults: () => void;
}

interface SimulationResult {
  type: string;
  score: number;
  completed: boolean;
  skipped: boolean;
}

const simulations = {
  R: {
    name: 'CBC Practical Activities',
    description: 'Hands-on STEM learning through Science & Technology projects',
    icon: Zap,
    color: 'bg-green-500',
    component: RealisticSimulation,
    cbcAreas: ['Science & Technology', 'Pre-Technical Education', 'Agriculture']
  },
  I: {
    name: 'Scientific Investigation',
    description: 'Research and inquiry-based learning through environmental studies',
    icon: Beaker,
    color: 'bg-blue-500',
    component: InvestigativeSimulation,
    cbcAreas: ['Environmental Activities', 'Science & Technology', 'Geography']
  },
  A: {
    name: 'Creative Arts Studio',
    description: 'Express creativity through traditional and digital Kenyan arts',
    icon: Palette,
    color: 'bg-purple-500',
    component: ArtisticSimulation,
    cbcAreas: ['Creative Arts', 'Music & Movement', 'Digital Literacy']
  },
  S: {
    name: 'Community Helper',
    description: 'Develop empathy and communication through social scenarios',
    icon: Heart,
    color: 'bg-orange-500',
    component: SocialSimulation,
    cbcAreas: ['Social Studies', 'Life Skills', 'Religious Education']
  },
  E: {
    name: 'Young Entrepreneur',
    description: 'Build business skills through practical enterprise activities',
    icon: TrendingUp,
    color: 'bg-red-500',
    component: EnterprisingSimulation,
    cbcAreas: ['Pre-Career Education', 'Business Studies', 'Life Skills']
  },
  C: {
    name: 'Data Organization',
    description: 'Systematic thinking through digital literacy and mathematics',
    icon: FileSpreadsheet,
    color: 'bg-gray-500',
    component: ConventionalSimulation,
    cbcAreas: ['Mathematics', 'Digital Literacy', 'Record Keeping']
  }
};

const SimulationHub = ({ assessmentData, onBackToResults }: SimulationHubProps) => {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [simulationResults, setSimulationResults] = useState<Record<string, SimulationResult>>({});
  const [showFinalReport, setShowFinalReport] = useState(false);

  const [primaryCode, secondaryCode] = assessmentData.topCodes.split(',');

  const handleSimulationComplete = (simulationType: string, score: number) => {
    console.log(`CBC Simulation ${simulationType} completed with score: ${score}`);
    setSimulationResults(prev => ({
      ...prev,
      [simulationType]: {
        type: simulationType,
        score,
        completed: true,
        skipped: false
      }
    }));
    setActiveSimulation(null);
    
    // Check if all simulations are done (completed or skipped)
    const totalSimulations = Object.keys(simulations).length;
    const currentResults = { ...simulationResults, [simulationType]: { type: simulationType, score, completed: true, skipped: false } };
    const completedCount = Object.values(currentResults).length;
    
    if (completedCount === totalSimulations) {
      setShowFinalReport(true);
    }
  };

  const handleSimulationSkip = (simulationType: string) => {
    console.log(`CBC Simulation ${simulationType} skipped`);
    setSimulationResults(prev => ({
      ...prev,
      [simulationType]: {
        type: simulationType,
        score: 0,
        completed: false,
        skipped: true
      }
    }));
    setActiveSimulation(null);
    
    // Check if all simulations are done
    const totalSimulations = Object.keys(simulations).length;
    const currentResults = { ...simulationResults, [simulationType]: { type: simulationType, score: 0, completed: false, skipped: true } };
    const completedCount = Object.values(currentResults).length;
    
    if (completedCount === totalSimulations) {
      setShowFinalReport(true);
    }
  };

  const completedSimulations = Object.values(simulationResults).filter(r => r.completed).length;
  const skippedSimulations = Object.values(simulationResults).filter(r => r.skipped).length;
  const totalAttempted = completedSimulations + skippedSimulations;

  if (showFinalReport) {
    return (
      <FinalReport
        assessmentData={assessmentData}
        simulationResults={simulationResults}
        onBackToHub={() => setShowFinalReport(false)}
        onBackToResults={onBackToResults}
      />
    );
  }

  if (activeSimulation) {
    const SimulationComponent = simulations[activeSimulation as keyof typeof simulations].component;
    return (
      <SimulationComponent
        onComplete={(score) => handleSimulationComplete(activeSimulation, score)}
        onSkip={() => handleSimulationSkip(activeSimulation)}
        onBack={() => setActiveSimulation(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBackToResults}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 justify-center">
              <GraduationCap className="w-10 h-10 text-blue-600" />
              CBC Learning Simulations
            </h1>
            <p className="text-gray-600 mt-2">Experience different learning areas through interactive activities</p>
            <div className="text-sm text-blue-600 font-medium mt-1">
              Competency Based Curriculum • Grades 1-9
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Progress</p>
            <p className="text-2xl font-bold text-green-600">{totalAttempted}/6</p>
            {totalAttempted === 6 && (
              <Button
                onClick={() => setShowFinalReport(true)}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <FileText className="w-4 h-4 mr-1" />
                View Report
              </Button>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        {totalAttempted > 0 && (
          <div className="bg-white rounded-xl p-4 mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedSimulations}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{skippedSimulations}</div>
                  <div className="text-sm text-gray-600">Skipped</div>
                </div>
              </div>
              {totalAttempted === 6 && (
                <Button
                  onClick={() => setShowFinalReport(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Final Report
                </Button>
              )}
            </div>
          </div>
        )}

        {/* CBC Information Banner */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-2">About CBC Learning Simulations</h2>
          <p className="text-blue-700 mb-3">
            These simulations are designed around Kenya's Competency Based Curriculum, helping learners develop 
            practical skills, critical thinking, and real-world problem-solving abilities across different learning areas.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/50 rounded-lg p-3">
              <strong className="text-blue-800">Grade 1-3:</strong> Foundation skills and basic concepts
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <strong className="text-blue-800">Grade 4-6:</strong> Intermediate application and analysis
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <strong className="text-blue-800">Grade 7-9:</strong> Advanced thinking and specialization
            </div>
          </div>
        </div>

        {/* Recommended Simulations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Recommended CBC Activities
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[primaryCode, secondaryCode].map((code) => {
              const sim = simulations[code as keyof typeof simulations];
              const Icon = sim.icon;
              const result = simulationResults[code];
              const isCompleted = result?.completed;
              const isSkipped = result?.skipped;
              
              return (
                <Card key={code} className="shadow-xl hover:shadow-2xl transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-3 ${sim.color} rounded-full`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {isCompleted && (
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Completed ✓ ({result.score}%)
                        </div>
                      )}
                      {isSkipped && (
                        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                          Skipped
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl">{sim.name}</CardTitle>
                    <p className="text-gray-600">{sim.description}</p>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-blue-600 mb-1">CBC Learning Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {sim.cbcAreas.map((area, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setActiveSimulation(code)}
                      className={`w-full ${sim.color} hover:opacity-90 text-white flex items-center gap-2`}
                    >
                      <Play className="w-4 h-4" />
                      {isCompleted ? 'Explore Again' : isSkipped ? 'Try Again' : 'Start Learning'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* All Simulations */}
        <div>
          <h2 className="text-2xl font-bold mb-4">All CBC Learning Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(simulations).map(([code, sim]) => {  
              const Icon = sim.icon;
              const result = simulationResults[code];
              const isCompleted = result?.completed;
              const isSkipped = result?.skipped;
              const isRecommended = [primaryCode, secondaryCode].includes(code);
              
              return (
                <Card key={code} className="shadow-lg hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-2 ${sim.color} rounded-full`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex gap-2">
                        {isRecommended && (
                          <Star className="w-4 h-4 text-yellow-500" />
                        )}
                        {isCompleted && (
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            ✓ {result.score}%
                          </div>
                        )}
                        {isSkipped && (
                          <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                            Skipped
                          </div>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{sim.name}</CardTitle>
                    <p className="text-gray-600 text-sm">{sim.description}</p>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {sim.cbcAreas.slice(0, 2).map((area, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {area}
                          </span>
                        ))}
                        {sim.cbcAreas.length > 2 && (
                          <span className="text-xs text-gray-500">+{sim.cbcAreas.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setActiveSimulation(code)}
                      variant="outline"
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isCompleted ? 'Replay' : isSkipped ? 'Retry' : 'Start'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationHub;
