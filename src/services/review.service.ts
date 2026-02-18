import { CreateReviewDto, ReviewResponseDto } from "@/db/dtos/review.dto";
import axiosClient from "@/lib/axiosClient";
import { PaginatedResponse } from "@/types";


class ReviewService {
  private baseUrl = "/properties";

  // ✅ Get property reviews
  async getReviewsByPropertyId(propertyId: number): Promise<PaginatedResponse<ReviewResponseDto>> {
    const response = await axiosClient.get<PaginatedResponse<ReviewResponseDto>>(`${this.baseUrl}/${propertyId}/reviews`
    );
    return response.data
  }

  // ✅ Create property review
  async createReview(
     payload: CreateReviewDto
  ): Promise<ReviewResponseDto> {
    const propertyId = payload
    const response = await axiosClient.post<ReviewResponseDto>(
      `${this.baseUrl}/${propertyId}/reviews`,
      payload
    );
    // Handle both response formats
    return response.data
  }
}

export const reviewService = new ReviewService();

