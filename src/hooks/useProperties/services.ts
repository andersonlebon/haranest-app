import { PropertyResponseDto } from './dto';
import { PaginatedResponse, PaginationParams } from '@/components/shared/types';


export async function fetchProperties({
  page = 1,
  perPage = 10,
}: PaginationParams): Promise<PaginatedResponse<PropertyResponseDto>> {
  const res = await fetch(`/api/properties?page=${page}&perPage=${perPage}`);
  if (!res.ok) {
    throw new Error('Failed to fetch properties');
  }
  return res.json();
}
