
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SimulationProgressProps {
  completedCount: number;
  totalSimulations: number;
  isComplete: boolean;
}

export const SimulationProgress: React.FC<SimulationProgressProps> = ({
  completedCount,
  totalSimulations,
  isComplete
}) => {
  return (
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold mb-2">CBC Learning Areas Simulation (Grade 7-9)</h3>
      <p className="text-gray-600">
        Experience interactive simulations across CBC learning areas to understand your strengths
      </p>
      <div className="mt-4">
        <Badge variant="outline" className="text-lg px-4 py-2">
          {completedCount} / {totalSimulations} Simulations Completed
        </Badge>
        {isComplete && (
          <Badge variant="default" className="ml-2 bg-green-500">
            Ready to Continue
          </Badge>
        )}
      </div>
      <Progress value={(completedCount / totalSimulations) * 100} className="w-full mt-3" />
    </div>
  );
};
