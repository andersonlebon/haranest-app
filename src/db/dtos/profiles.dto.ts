import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { profiles, userRoleEnum } from "../schema/profiles";
import { PaginationParams } from "@/types/api";

// ----------------------
// For reading data (GET)
// ----------------------
export type ProfileResponseDto = InferSelectModel<typeof profiles>;

// ----------------------
// For creating new profiles (POST)
// ----------------------
export type CreateProfileDto = Omit<
  InferInsertModel<typeof profiles>,
  "id" | "createdAt" | "updatedAt"
>;

// ----------------------
// For updating profiles (PATCH)
// ----------------------
export type UpdateProfileDto = Partial<CreateProfileDto>;

// ----------------------
// For filtering/pagination params
// ----------------------
export interface ProfileParams extends PaginationParams {
  role?: (typeof userRoleEnum.enumValues)[number];
  country?: string;
  city?: string;
  isVerified?: boolean;
  isActive?: boolean;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export type UserRole = (typeof userRoleEnum.enumValues)[number];
