export interface ReviewResponseDto {
  id: number;
  name: string;
  location?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewD {
  name: string;
  location?: string;
  comment: string;
  rating: number;
}
