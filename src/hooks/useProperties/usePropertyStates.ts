import { useState, useCallback } from 'react';

export interface PropertyStates {
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isSuccess: boolean;
}

// Hook pour gérer les états des propriétés
export function usePropertyStates() {
  const [states, setStates] = useState<PropertyStates>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  // Fonction pour démarrer le loading
  const startLoading = useCallback(() => {
    setStates(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
    }));
  }, []);

  // Fonction pour marquer comme succès
  const setSuccess = useCallback(() => {
    setStates(prev => ({
      ...prev,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    }));
  }, []);

  // Fonction pour marquer comme erreur
  const setError = useCallback((error: string) => {
    setStates(prev => ({
      ...prev,
      isLoading: false,
      isError: true,
      error,
      isSuccess: false,
    }));
  }, []);

  // Fonction pour réinitialiser les états
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
