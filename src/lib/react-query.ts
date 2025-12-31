import { PropertyParams } from '@/db/dtos/properties.dto';
import { QueryClient } from '@tanstack/react-query';

// 🚀 Optimized React Query configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ⏱️ Timeout configuration
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3, // 3 retry attempts on error
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // 🎯 Revalidation configuration
      refetchOnWindowFocus: false, // Avoid unnecessary refetches
      refetchOnMount: true, // Refetch on mount
      refetchOnReconnect: true, // Refetch on reconnect
      
      // 🔄 Network configuration
      networkMode: 'online', // Only when online
    },
    mutations: {
      // 🔄 Mutation configuration
      retry: 1, // 1 retry attempt for mutations
      networkMode: 'online',
    },
  },
});

// 🎯 Query keys configuration (to avoid typing errors)
export const QUERY_KEYS = {
  properties: ['properties'] as const,
  property: (id: number) => ['property', id] as const,
  propertiesWithFilters: (filters: Partial<PropertyParams>) => ['properties', filters] as const,
} as const;
