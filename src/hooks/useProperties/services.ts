import { supabase } from '@/utils/supabase/client';
import { PropertyResponseDto } from './dto';
import { PaginatedResponse, PaginationParams } from '@/components/shared/types';


export async function fetchProperties({
  page = 1,
  perPage = 10,
}: PaginationParams): Promise<PaginatedResponse<PropertyResponseDto[]>> {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const [dataQuery, countQuery] = await Promise.all([
    supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .range(from, to),
    supabase
      .from('properties')
      .select('*', { count: 'exact', head: true }),
  ]);

  if (dataQuery.error || countQuery.error) {
    throw dataQuery.error || countQuery.error;
  }

  const total = countQuery.count ?? 0;

  return {
    data: dataQuery.data ?? [],
    page,
    perPage,
    total,
    totalPages: Math.ceil(total / perPage),
  };
}
