
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Play, Clock } from 'lucide-react';

interface Simulation {
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  questions: any[];
}

interface SimulationCardProps {
  simulation: Simulation;
  isCompleted: boolean;
  isActive: boolean;
  progress: number;
  onStart: (simulationName: string, simulationData: Simulation) => void;
}

export const SimulationCard: React.FC<SimulationCardProps> = ({
  simulation,
  isCompleted,
  isActive,
  progress,
  onStart
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="font-medium">{simulation.name}</h4>
          {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
          {isActive && <Clock className="w-5 h-5 text-blue-500" />}
        </div>
        <p className="text-sm text-gray-600 mb-2">{simulation.description}</p>
        <div className="flex gap-2 mb-2">
          <Badge variant="secondary">
            Duration: {simulation.duration}
          </Badge>
          <Badge className={getDifficultyColor(simulation.difficulty)}>
            {simulation.difficulty}
          </Badge>
        </div>
        {progress > 0 && progress < 100 && (
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">{Math.round(progress)}% complete</p>
          </div>
        )}
      </div>
      
      <Button
        onClick={() => onStart(simulation.name, simulation)}
        disabled={isCompleted}
        variant={isCompleted ? "outline" : "default"}
        className="ml-4"
      >
        {isCompleted ? (
          "Completed"
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Start Simulation
          </>
        )}
      </Button>
    </div>
  );
};
