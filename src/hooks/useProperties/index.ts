import { PaginatedResponse, PaginationParams } from "@/types/api";
import { PropertyResponseDto, CreatePropertyDto, UpdatePropertyDto } from "@/db/dtos/properties.dto";
import { propertyService } from "@/services/property.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


// Get paginated properties
export const useGetProperties = (params: PaginationParams) =>
  useQuery<PaginatedResponse<PropertyResponseDto>>({
    queryKey: ["properties", params],
    queryFn: () => propertyService.getAll(params),
  });

// Get a single property by ID
export const useGetProperty = (id: number) =>
  useQuery<PropertyResponseDto>({
    queryKey: ["property", id],
    queryFn: () => propertyService.getById(id),
    enabled: !!id,
  });

// Create property
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<PropertyResponseDto, Error, CreatePropertyDto>({
    mutationFn: (payload) => propertyService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["properties"] }),
  });
};

// Update property
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PropertyResponseDto, 
    Error, 
    { id: number; data: UpdatePropertyDto }
  >({
    mutationFn: ({ id, data }) => propertyService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", id] });
    },
  });
};

// Delete property
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => propertyService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["properties"] }),
  });
};
