import { createQueryStrings } from '@/utils/formats';
import { CreatePropertyDto, PropertyResponseDto } from '../../db/dtos/properties.dto';
import { PaginatedResponse, PaginationParams } from '@/components/shared/types';
import { supabase } from '@/utils/supabase/client';
import { SUPABASE_STORAGE_BUCKET } from '@/config';

export interface FiltersParams extends PaginationParams {
  price?: number[]; // [min, max]
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  features?: string[];
  search?: string;
}

export async function fetchProperties(params: FiltersParams): Promise<PaginatedResponse<PropertyResponseDto>> {
  try {
    const queryString = createQueryStrings(params);
    const controller = new AbortController();
    
    // Timeout after 30s to avoid aggressive cancellations in dev
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(`/api/properties${queryString}`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Error ${response.status}: ${response.statusText}`
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request took too long');
      }
      throw error;
    }
    throw new Error('Unknown error while fetching properties');
  }
}

// Service to fetch a specific property
export async function fetchProperty(id: number): Promise<PropertyResponseDto> {
  try {
    const response = await fetch(`/api/properties/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=600', // Longer cache for details
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Property not found (${response.status})`
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error while fetching property');
  }
}

 
export async function createProperty(data: CreatePropertyDto): Promise<PropertyResponseDto> {
  try {
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Error during creation (${response.status})`
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error while creating property');
  }
}

 
export async function updateProperty(id: number, data: Partial<PropertyResponseDto>): Promise<PropertyResponseDto> {
  try {
    const response = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Error during update (${response.status})`
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error while updating property');
  }
}

 
export async function deleteProperty(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/properties/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Error during deletion (${response.status})`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error while deleting property');
  }
}

// Upload images to Supabase Storage and return their public URLs
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

// --- Reviews API helpers -------------------------------------------------

export interface ReviewDto {
  id: number;
  name: string;
  location?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export async function getPropertyReviews(propertyId: string | number): Promise<ReviewDto[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`/api/properties/${propertyId}/reviews`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=60',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data || [];
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request took too long');
      }
      throw error;
    }
    throw new Error('Unknown error while fetching reviews');
  }
}

export interface CreateReviewPayload {
  name: string;
  location?: string;
  comment: string;
  rating: number;
}

export async function postPropertyReview(propertyId: string | number, payload: CreateReviewPayload): Promise<ReviewDto> {
  try {
    const response = await fetch(`/api/properties/${propertyId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error during creation (${response.status})`);
    }

    const json = await response.json();
    // API may return the created review under `data` or the body directly
    return json.data || json;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error while creating review");
  }
}
