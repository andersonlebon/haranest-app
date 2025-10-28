"use client"
import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreatePropertyDto, PropertyResponseDto } from './dto';
import { createProperty, deleteProperty, fetchProperties, fetchProperty, FiltersParams } from './services';
import { PaginatedResponse } from '@/components/shared/types';

 
export const usePropertiesQuery = (filters: FiltersParams) => {
  return useQuery<PaginatedResponse<PropertyResponseDto>>({
    queryKey: ['properties', filters], 
    queryFn: () => fetchProperties(filters),
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false, 
    retry: 3, 
  });
}

export const usePropertyQuery = (id: number) => {
  return useQuery<PropertyResponseDto>({
    queryKey: ['property', id],
    queryFn: () => fetchProperty(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes pour les détails
    gcTime: 30 * 60 * 1000, // 30 minutes en cache
  });
}

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: (newProperty) => {
      // Invalide et refetch la liste des propriétés
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      
      // Ajoute la nouvelle propriété au cache
      queryClient.setQueryData(['property', newProperty.id], newProperty);
    },
    onError: (error) => {
      console.error('Erreur lors de la création:', error);
    }
  });
};

 
export const useDeleteProperty = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

 
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PropertyResponseDto> }) => {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update property');
      }
      return response.json();
    },
    onSuccess: (updatedProperty) => {
      // Met à jour le cache de la propriété
      queryClient.setQueryData(['property', updatedProperty.id], updatedProperty);
      // Invalide la liste pour refetch
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    }
  });
};

// export const useDeleteProperty = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id: number) => {
//       await db.delete(properties).where(eq(properties.id, id));
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['properties'] });
//     },
//   });
// };

