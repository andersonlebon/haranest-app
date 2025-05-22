import { supabase } from '@/utils/supabase/client';
import { PropertyResponseDto } from './dto';


export async function fetchProperties(): Promise<PropertyResponseDto[]> {
  const { data, error } = await supabase.from('properties').select('*');
  if (error) throw error;
  return data as PropertyResponseDto[];
}
