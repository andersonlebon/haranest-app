import { createQueryStrings } from '@/utils/formats';
import { CreatePropertyDto, PropertyResponseDto } from '../../db/schema/properties/dto';
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
    
    // Timeout après 30s pour éviter les annulations trop agressives en dev
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
        `Erreur ${response.status}: ${response.statusText}`
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('La requête a pris trop de temps');
      }
      throw error;
    }
    throw new Error('Erreur inconnue lors de la récupération des propriétés');
  }
}

//  ervice pour récupérer une propriété spécifique
export async function fetchProperty(id: number): Promise<PropertyResponseDto> {
  try {
    const response = await fetch(`/api/properties/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=600', // Cache plus long pour les détails
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Propriété non trouvée (${response.status})`
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur lors de la récupération de la propriété');
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
        `Erreur lors de la création (${response.status})`
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur lors de la création de la propriété');
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
        `Erreur lors de la mise à jour (${response.status})`
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur lors de la mise à jour de la propriété');
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
        `Erreur lors de la suppression (${response.status})`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur lors de la suppression de la propriété');
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
      throw new Error(`Erreur upload: ${uploadError.message}`);
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
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data || [];
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('La requête a pris trop de temps');
      }
      throw error;
    }
    throw new Error('Erreur inconnue lors de la récupération des avis');
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
      throw new Error(errorData.message || `Erreur lors de la création (${response.status})`);
    }

    const json = await response.json();
    // API may return the created review under `data` or the body directly
    return json.data || json;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erreur lors de la création de l'avis");
  }
}
