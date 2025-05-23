"use client"
import { useQuery } from '@tanstack/react-query';
import { PropertyResponseDto } from './dto';
import { fetchProperties } from './services';
import { PaginatedResponse, PaginationParams } from '@/components/shared/types';

export const usePropertiesQuery = (paginationParams: PaginationParams) => {
  const { page, perPage } = paginationParams;

  return useQuery<PaginatedResponse<PropertyResponseDto>>({
    queryKey: ['properties', page, perPage],
    queryFn: () => fetchProperties(paginationParams),
  });
}

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

