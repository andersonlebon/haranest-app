import { PaginatedResponse, PaginationParams } from "@/types";
import { PropertyResponseDto, CreatePropertyDto, UpdatePropertyDto } from "@/db/dtos/properties.dto";
import axiosClient from "@/lib/axiosClient";

export interface PropertyFiltersParams extends PaginationParams {
  price?: number[]; // [min, max]
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  features?: string[];
  search?: string;
}

class PropertyService {
  private baseUrl = "properties";

  // ✅ Get all properties with pagination and filters
  async getAll(
    params: PropertyFiltersParams
  ): Promise<PaginatedResponse<PropertyResponseDto>> {
    // Build query params with proper array handling
    const queryParams: Record<string, string | number> = {};
    
    if (params.page) queryParams.page = params.page;
    if (params.perPage) queryParams.perPage = params.perPage;
    if (params.search) queryParams.search = params.search;
    if (params.propertyType) queryParams.propertyType = params.propertyType;
    if (params.bedrooms) queryParams.bedrooms = params.bedrooms;
    if (params.bathrooms) queryParams.bathrooms = params.bathrooms;

    // Build params with array handling
    const requestParams: Record<string, string | number | string[] | number[]> = { ...queryParams };
    
    if (params.price?.length) {
      requestParams.price = params.price;
    }
    if (params.amenities?.length) {
      requestParams.amenities = params.amenities;
    }
    if (params.features?.length) {
      requestParams.features = params.features;
    }

    const response = await axiosClient.get<PaginatedResponse<PropertyResponseDto>>(this.baseUrl, {
      params: requestParams,
    });
    return response.data;
  }

  // ✅ Get single property by ID
  async getById(id: number): Promise<PropertyResponseDto> {
    const response = await axiosClient.get<PropertyResponseDto>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  // ✅ Create new property
  async create(payload: CreatePropertyDto): Promise<PropertyResponseDto> {
    const response = await axiosClient.post<PropertyResponseDto>(
      this.baseUrl,
      payload
    );
    return response.data;
  }

  // ✅ Update property (using PATCH to match API)
  async update(
    id: number,
    payload: UpdatePropertyDto
  ): Promise<PropertyResponseDto> {
    const response = await axiosClient.patch<PropertyResponseDto>(
      `${this.baseUrl}?id=${id}`,
      payload
    );
    return response.data;
  }

  // ✅ Delete property
  async delete(id: number): Promise<void> {
    await axiosClient.delete(`${this.baseUrl}?id=${id}`);
  }
}

export const propertyService = new PropertyService();
