import axiosClient from "@/lib/axiosClient";

export interface ReviewDto {
  id: number;
  name: string;
  location?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  name: string;
  location?: string;
  comment: string;
  rating: number;
}

class ReviewService {
  private baseUrl = "/properties";

  // ✅ Get property reviews
  async getReviews(propertyId: string | number): Promise<ReviewDto[]> {
    const response = await axiosClient.get<{ data: ReviewDto[] }>(
      `${this.baseUrl}/${propertyId}/reviews`
    );
    return response.data.data || [];
  }

  // ✅ Create property review
  async createReview(
    propertyId: string | number,
    payload: CreateReviewPayload
  ): Promise<ReviewDto> {
    const response = await axiosClient.post<ReviewDto | { data: ReviewDto }>(
      `${this.baseUrl}/${propertyId}/reviews`,
      payload
    );
    // Handle both response formats
    return 'data' in response.data ? response.data.data : response.data;
  }
}

export const reviewService = new ReviewService();

