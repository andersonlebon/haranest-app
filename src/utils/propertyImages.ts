import { API_URL } from '@/config';

/**
 * Upload property images via API route to Supabase Storage and return their public URLs
 * This uses a server-side API route to handle authentication and bypass RLS policies
 */
export async function uploadPropertyImages(files: File[], folder?: string): Promise<string[]> {
  if (!files || files.length === 0) return [];
  
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.details 
        ? `${errorData.error}: ${Array.isArray(errorData.details) ? errorData.details.join(", ") : errorData.details}`
        : errorData.error || `Upload failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // If there are warnings (partial failures), log them but still return URLs
    if (data.warnings) {
      console.warn("Upload warnings:", data.warnings);
  }
  
    return data.urls || [];
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to upload images');
  }
}

