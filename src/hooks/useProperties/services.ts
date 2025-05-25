import { createQueryStrings } from '@/utils/formats';
import { PropertyResponseDto } from './dto';
import { PaginatedResponse, PaginationParams } from '@/components/shared/types';


export interface FiltersParams extends PaginationParams {
  price?: number[]; // [min, max]
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  features?: string[];
}

export async function fetchProperties(params: FiltersParams): Promise<PaginatedResponse<PropertyResponseDto>> {
  const queryString = createQueryStrings(params)
  const res = await fetch(`/api/properties${queryString}`);
  if (!res.ok) {
    throw new Error('Failed to fetch properties');
  }
  return res.json();
}
