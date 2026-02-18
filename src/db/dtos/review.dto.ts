import { InferSelectModel } from "drizzle-orm";
import { propertyReviews } from "../schema/property_reviews";

export type ReviewResponseDto = InferSelectModel<typeof propertyReviews>;

// For creating new property reviews (POST)
export type CreateReviewDto = Omit<
  InferSelectModel<typeof propertyReviews>,
  "id" | "createdAt" | "updatedAt"
>;

// For updating property reviews (PATCH)
export type UpdateReviewDto = Partial<CreateReviewDto>;
