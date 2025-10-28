import { QueryClient } from '@tanstack/react-query';

// 🚀 Configuration optimisée de React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ⏱️ Configuration des timeouts
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3, // 3 tentatives en cas d'erreur
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // 🎯 Configuration de la revalidation
      refetchOnWindowFocus: false, // Évite les refetch inutiles
      refetchOnMount: true, // Refetch au montage
      refetchOnReconnect: true, // Refetch lors de la reconnexion
      
      // 🔄 Configuration du réseau
      networkMode: 'online', // Seulement quand en ligne
    },
    mutations: {
      // 🔄 Configuration des mutations
      retry: 1, // 1 tentative pour les mutations
      networkMode: 'online',
    },
  },
});

// 🎯 Configuration des query keys (pour éviter les erreurs de typage)
export const QUERY_KEYS = {
  properties: ['properties'] as const,
  property: (id: number) => ['property', id] as const,
  propertiesWithFilters: (filters: any) => ['properties', filters] as const,
} as const;
