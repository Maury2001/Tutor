
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AIValidationResult {
  isValid: boolean;
  confidence: number;
  recommendations: string[];
  flags: string[];
}

export const useAIValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateAssessmentResponse = async (
    questionId: number,
    response: any,
    timeSpent: number,
    userPattern: any
  ): Promise<AIValidationResult> => {
    setIsValidating(true);
    
    try {
      console.log('Validating assessment response:', { questionId, response, timeSpent, userPattern });
      
      const { data, error } = await supabase.functions.invoke('ai-validation', {
        body: {
          action: 'validate_response',
          data: {
            questionId,
            response,
            timeSpent,
            userPattern,
            timestamp: new Date().toISOString()
          }
        }
      });

      if (error) {
        console.error('AI validation error:', error);
        throw error;
      }

      console.log('AI validation result:', data);
      return data.validation || {
        isValid: true,
        confidence: 0.8,
        recommendations: [],
        flags: []
      };
    } catch (error) {
      console.error('AI validation error:', error);
      
      // Enhanced fallback validation logic
      const fallbackValidation: AIValidationResult = {
        isValid: true,
        confidence: timeSpent > 1000 ? 0.8 : 0.6, // Higher confidence for longer response times
        recommendations: timeSpent < 500 ? ['Consider taking more time to read the question carefully'] : [],
        flags: timeSpent < 200 ? ['quick_answer'] : []
      };
      
      return fallbackValidation;
    } finally {
      setIsValidating(false);
    }
  };

  const detectAnomalousPattern = async (userResponses: any[]) => {
    try {
      console.log('Detecting anomalous patterns:', userResponses);
      
      const { data, error } = await supabase.functions.invoke('ai-validation', {
        body: {
          action: 'detect_patterns',
          data: { responses: userResponses }
        }
      });

      if (error) throw error;
      
      console.log('Pattern detection result:', data);
      return data.anomalies || { hasAnomalies: false, patterns: [] };
    } catch (error) {
      console.error('Pattern detection error:', error);
      
      // Simple fallback pattern detection
      const responseValues = userResponses.map(r => r.response);
      const uniqueValues = new Set(responseValues);
      const hasAnomalies = uniqueValues.size === 1 && userResponses.length > 5; // All same responses
      
      return { 
        hasAnomalies, 
        patterns: hasAnomalies ? ['uniform_responses'] : [] 
      };
    }
  };

  return {
    validateAssessmentResponse,
    detectAnomalousPattern,
    isValidating
  };
};
