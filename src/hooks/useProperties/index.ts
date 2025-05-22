"use client"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';
import { PropertyResponseDto } from './dto';

export const usePropertiesQuery = () => {
  return useQuery<PropertyResponseDto[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      return data;
    },
  });
};

// export const useCreateProperty = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (newProperty: typeof properties.$inferInsert) => {
//       await db.insert(properties).values(newProperty);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['properties'] });
//     },
//   });
// };

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

