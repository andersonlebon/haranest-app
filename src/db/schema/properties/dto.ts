import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { properties } from "./schema";

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
