import { supabase } from '@/utils/supabase/client';
import { SUPABASE_STORAGE_BUCKET } from '@/config';

/**
 * Upload property images to Supabase Storage and return their public URLs
 */
export async function uploadPropertyImages(files: File[], folder?: string): Promise<string[]> {
  if (!files || files.length === 0) return [];
  
  const urls: string[] = [];
  const bucket = SUPABASE_STORAGE_BUCKET || 'properties';
  
  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dir = folder || 'properties';
    const path = `${dir}/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false, cacheControl: '3600', contentType: file.type });

    if (uploadError) {
      throw new Error(`Upload error: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    if (data?.publicUrl) {
      urls.push(data.publicUrl);
    }
  }
  
  return urls;
}

