/**
 * Property interface for component usage
 * Note: For API responses, use PropertyResponseDto from @/db/dtos/properties.dto
 */
export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  locationCity: string;
  locationProvince: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  rentOrSell?: string;
  lotSize?: number;
  rooms?: number;
  floors?: number;
  yearBuilt?: number;
  locationDistrict?: string;
  locationTown?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
  features?: string[];
}

