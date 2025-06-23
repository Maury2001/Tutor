'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { SimulationModal } from './components/SimulationModal';
import { SimulationCard } from './components/SimulationCard';
import { SimulationProgress } from './components/SimulationProgress';
import { cbcSimulations } from './data/simulationData';

interface CBCSimulationProps {
  onNext: (data: any) => void;
  onPrevious?: () => void;
  data: any;
}

export const CBCSimulation: React.FC<CBCSimulationProps> = ({ onNext, onPrevious, data }) => {
  const [completedSimulations, setCompletedSimulations] = useState<Record<string, boolean>>(data.simulation || {});
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [simulationProgress, setSimulationProgress] = useState<Record<string, number>>({});
  const [showSimulationModal, setShowSimulationModal] = useState<boolean>(false);
  const [selectedSimulationData, setSelectedSimulationData] = useState<any>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleStartSimulation = (simulationName: string, simulationData: any) => {
    console.log('Starting simulation:', simulationName);
    setActiveSimulation(simulationName);
    setSelectedSimulationData(simulationData);
    setCurrentQuestion(0);
    setShowSimulationModal(true);
    setSimulationProgress(prev => ({ ...prev, [simulationName]: 0 }));
    setCurrentAnswer('');
    setShowFeedback(false);
    setShowHint(false);
  };

  const handleAnswerSubmit = () => {
    if (!activeSimulation || !selectedSimulationData || !currentAnswer.trim()) return;
    
    const currentQuestionData = selectedSimulationData.questions[currentQuestion];
    const correct = currentAnswer.toLowerCase().trim() === currentQuestionData.correctAnswer.toLowerCase().trim();
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    console.log(`Question ${currentQuestion + 1}: ${correct ? 'Correct' : 'Incorrect'}`);
  };

  const handleNextQuestion = () => {
    if (!activeSimulation || !selectedSimulationData) return;
    
    const nextQuestion = currentQuestion + 1;
    const totalQuestions = selectedSimulationData.questions.length;
    const progress = (nextQuestion / totalQuestions) * 100;
    
    setSimulationProgress(prev => ({ ...prev, [activeSimulation]: progress }));
    
    if (nextQuestion >= totalQuestions) {
      setCompletedSimulations(prev => ({ ...prev, [activeSimulation]: true }));
      setActiveSimulation(null);
      setShowSimulationModal(false);
      setCurrentQuestion(0);
      console.log(`Simulation ${activeSimulation} completed!`);
    } else {
      setCurrentQuestion(nextQuestion);
      setCurrentAnswer('');
      setShowFeedback(false);
      setShowHint(false);
    }
  };

  const handleCloseSimulation = () => {
    setShowSimulationModal(false);
    setActiveSimulation(null);
    setCurrentQuestion(0);
    setSelectedSimulationData(null);
    setCurrentAnswer('');
    setShowFeedback(false);
    setShowHint(false);
  };

  const handleSubmit = () => {
    console.log('Submitting CBC simulation data:', { simulation: completedSimulations });
    onNext({ simulation: completedSimulations });
  };

  const totalSimulations = cbcSimulations.reduce((acc, area) => acc + area.simulations.length, 0);
  const completedCount = Object.keys(completedSimulations).filter(key => completedSimulations[key]).length;
  const isComplete = completedCount >= Math.ceil(totalSimulations * 0.5);

  return (
    <div className="space-y-6">
      <SimulationProgress 
        completedCount={completedCount}
        totalSimulations={totalSimulations}
        isComplete={isComplete}
      />

      {cbcSimulations.map((area, areaIndex) => (
        <Card key={areaIndex}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-blue-600">
              <BookOpen className="w-5 h-5" />
              {area.area} - {area.grade}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {area.simulations.map((simulation) => {
              const isCompleted = completedSimulations[simulation.name];
              const isActive = activeSimulation === simulation.name;
              const progress = simulationProgress[simulation.name] || 0;
              
              return (
                <SimulationCard
                  key={simulation.name}
                  simulation={simulation}
                  isCompleted={isCompleted}
                  isActive={isActive}
                  progress={progress}
                  onStart={handleStartSimulation}
                />
              );
            })}
          </CardContent>
        </Card>
      ))}

      <SimulationModal
        showModal={showSimulationModal}
        simulationData={selectedSimulationData}
        currentQuestion={currentQuestion}
        currentAnswer={currentAnswer}
        showFeedback={showFeedback}
        isCorrect={isCorrect}
        showHint={showHint}
        onClose={handleCloseSimulation}
        onAnswerChange={setCurrentAnswer}
        onSubmitAnswer={handleAnswerSubmit}
        onNextQuestion={handleNextQuestion}
        onShowHint={() => setShowHint(true)}
      />

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
          {isComplete ? 'Next: CBE Pathway Recommendation' : `Complete ${Math.ceil(totalSimulations * 0.5) - completedCount} more simulations`}
        </Button>
      </div>
    </div>
  );
};
