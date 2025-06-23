
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AssessmentProgress {
  sessionId: string;
  userId: string;
  assessmentType: string;
  currentStep: number;
  totalSteps: number;
  responses: any[];
  timeSpent: number;
  isCompleted: boolean;
  lastSaved: Date;
}

export const useProgressTracker = (assessmentType: string) => {
  const [progress, setProgress] = useState<AssessmentProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [assessmentType]);

  const loadProgress = async () => {
    setIsLoading(true);
    try {
      // Generate or retrieve session ID
      const sessionId = localStorage.getItem(`session_${assessmentType}`) || 
                       `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      localStorage.setItem(`session_${assessmentType}`, sessionId);

      // Check for existing progress
      const { data: existingProgress, error } = await supabase
        .from('assessment_progress')
        .select('*')
        .eq('session_id', sessionId)
        .eq('assessment_type', assessmentType)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading progress:', error);
      }

      if (existingProgress) {
        setProgress({
          sessionId,
          userId: existingProgress.user_id,
          assessmentType,
          currentStep: existingProgress.current_step,
          totalSteps: existingProgress.total_steps,
          responses: Array.isArray(existingProgress.responses) ? existingProgress.responses : [],
          timeSpent: existingProgress.time_spent || 0,
          isCompleted: existingProgress.is_completed,
          lastSaved: new Date(existingProgress.updated_at)
        });
      } else {
        // Create new progress record
        const newProgress = {
          sessionId,
          userId: 'anonymous', // Will be updated when user identifies
          assessmentType,
          currentStep: 0,
          totalSteps: assessmentType === 'riasec' ? 45 : 60,
          responses: [],
          timeSpent: 0,
          isCompleted: false,
          lastSaved: new Date()
        };
        setProgress(newProgress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (updates: Partial<AssessmentProgress>) => {
    if (!progress) return;

    const updatedProgress = { ...progress, ...updates, lastSaved: new Date() };
    setProgress(updatedProgress);

    try {
      const { error } = await supabase
        .from('assessment_progress')
        .upsert({
          session_id: updatedProgress.sessionId,
          user_id: updatedProgress.userId,
          assessment_type: updatedProgress.assessmentType,
          current_step: updatedProgress.currentStep,
          total_steps: updatedProgress.totalSteps,
          responses: updatedProgress.responses,
          time_spent: updatedProgress.timeSpent,
          is_completed: updatedProgress.isCompleted,
          updated_at: updatedProgress.lastSaved.toISOString()
        });

      if (error) {
        console.error('Error saving progress:', error);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const checkForDuplicateAssessment = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', userId)
        .eq('assessment_type', assessmentType)
        .gte('completed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Within 30 days

      if (error) {
        console.error('Error checking for duplicates:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return false;
    }
  };

  return {
    progress,
    saveProgress,
    checkForDuplicateAssessment,
    isLoading
  };
};
