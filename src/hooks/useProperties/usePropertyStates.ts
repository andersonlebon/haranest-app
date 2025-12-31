import { useState, useCallback } from 'react';

export interface PropertyStates {
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isSuccess: boolean;
}

// Hook to manage property states
export function usePropertyStates() {
  const [states, setStates] = useState<PropertyStates>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  // Function to start loading
  const startLoading = useCallback(() => {
    setStates(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
    }));
  }, []);

  // Function to mark as success
  const setSuccess = useCallback(() => {
    setStates(prev => ({
      ...prev,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    }));
  }, []);

  // Function to mark as error
  const setError = useCallback((error: string) => {
    setStates(prev => ({
      ...prev,
      isLoading: false,
      isError: true,
      error,
      isSuccess: false,
    }));
  }, []);

  // Function to reset states
  const resetStates = useCallback(() => {
    setStates({
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: false,
    });
  }, []);

  return {
    ...states,
    startLoading,
    setSuccess,
    setError,
    resetStates,
  };
}
