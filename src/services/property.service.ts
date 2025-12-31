import { PaginatedResponse, PaginationParams } from "@/components/shared/types";
import { PropertyResponseDto, CreatePropertyDto, UpdatePropertyDto } from "@/db/dtos/properties.dto";
import axiosClient from "@/lib/axiosClient";


class PropertyService {
  private baseUrl = "/properties";

  // ✅ Get all properties with pagination
  async getAll(
    params: PaginationParams
  ): Promise<PaginatedResponse<PropertyResponseDto>> {
    const response = await axiosClient.get<PaginatedResponse<PropertyResponseDto>>(this.baseUrl, {
      params: params,
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

  // ✅ Update property
  async update(
    id: number,
    payload: UpdatePropertyDto
  ): Promise<PropertyResponseDto> {
    const response = await axiosClient.put<PropertyResponseDto>(
      `${this.baseUrl}/${id}`,
      payload
    );
    return response.data;
  }

  // ✅ Delete property
  async delete(id: number): Promise<void> {
    await axiosClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const propertyService = new PropertyService();
