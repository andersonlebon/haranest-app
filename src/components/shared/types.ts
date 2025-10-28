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

 
export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}