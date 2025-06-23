
import { useState, useCallback } from 'react';
import { errorHandler } from '@/utils/errorHandler';

export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const captureError = useCallback((error: Error) => {
    setError(error);
    errorHandler.handleError(error);
  }, []);

  return {
    error,
    resetError,
    captureError,
    hasError: error !== null
  };
};
