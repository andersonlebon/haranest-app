import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { properties, propertyTypeEnum } from "./schema";
import { PaginationParams } from "@/components/shared/types";

// For reading data (GET)
export type PropertyResponseDto = InferSelectModel<typeof properties>;

// For creating new properties (POST)
export type CreatePropertyDto = Omit<
  InferInsertModel<typeof properties>,
  "id" | "createdAt" | "updatedAt"
> & {
  images: string[];
};

// For updating properties (PATCH)
export type UpdatePropertyDto = Partial<CreatePropertyDto>;
export  interface PropertyParams extends PaginationParams {
  price: number[];
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  features: string[];
  propertyType?: (typeof propertyTypeEnum.enumValues)[number];

}