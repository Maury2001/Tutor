
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Brain } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  recommendations: string[];
  flags: string[];
}

interface AssessmentValidatorProps {
  validationResult: ValidationResult;
  onValidationComplete: (isValid: boolean) => void;
}

export const AssessmentValidator: React.FC<AssessmentValidatorProps> = ({
  validationResult,
  onValidationComplete
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-blue-500" />
          AI Response Validation
          {validationResult.isValid ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          )}
        </CardTitle>
        <CardDescription>
          Our AI has analyzed your response pattern for authenticity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Confidence Score:</span>
          <div className="flex items-center gap-2">
            <span className={`font-bold ${getConfidenceColor(validationResult.confidence)}`}>
              {Math.round(validationResult.confidence * 100)}%
            </span>
            <Badge variant="outline" className={getConfidenceColor(validationResult.confidence)}>
              {getConfidenceLabel(validationResult.confidence)}
            </Badge>
          </div>
        </div>

        {validationResult.flags.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Detected Patterns:</h4>
            <div className="space-y-1">
              {validationResult.flags.map((flag, index) => (
                <Badge key={index} variant="secondary" className="mr-2">
                  {flag.replace('_', ' ').toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {validationResult.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {validationResult.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-600">{rec}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onValidationComplete(true)}
            className="flex-1"
          >
            Continue Assessment
          </Button>
          <Button
            variant="secondary"
            onClick={() => onValidationComplete(false)}
            className="flex-1"
          >
            Review Response
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
