import { properties } from "@/db/schema/properties";
import { z } from "zod";
import { propertyFeatureEnum, rentOrSellEnum, propertyTypeEnum, propertyStatusEnum, propertyStructureEnum, roofingTypeEnum, exteriorMaterialEnum } from "@/db/schema/properties";

export type PropertyResponseDto = typeof properties.$inferSelect;

//  exxtents Partial<typeof properties> remove id and timestamps
export type CreatePropertyDto = Omit<Partial<typeof properties>, "id" | "createdAt" | "updatedAt"> & {
  images: string[]; // array of image URLs
};  


export const propertySchema = z.object({
  profileId: z.number().optional(),
  title: z.string().min(4, "Title is required"),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  currency: z.string().default("USD"),

  commission: z.number().optional(),
  images: z.array(z.string()).default([]),
  videoPreviewUrl: z.string().url().optional(),
  reviewRate: z.number().min(0).max(5).default(0),

  amenities: z.array(z.string()).default([]),
  features: z.array(z.enum(propertyFeatureEnum.enumValues)).default([]),

  rentOrSell: z.enum(rentOrSellEnum.enumValues).default("sell"),
  propertyType: z.enum(propertyTypeEnum.enumValues),
  status: z.enum(propertyStatusEnum.enumValues).default("available"),

  size: z.number().optional(),
  lotSize: z.number().optional(),
  rooms: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  floors: z.number().optional(),
  garage: z.boolean().default(false),
  garageSize: z.number().optional(),
  basement: z.boolean().default(false),

  yearBuilt: z.number().optional(),
  structureType: z.enum(propertyStructureEnum.enumValues).optional(),
  roofing: z.enum(roofingTypeEnum.enumValues).optional(),
  exteriorMaterial: z.enum(exteriorMaterialEnum.enumValues).optional(),

  priceLabel: z.string().optional(),
  beforePriceLabel: z.string().optional(),
  availableFrom: z.string().optional(),

  locationProvince: z.string().optional(),
  locationDistrict: z.string().optional(),
  locationTown: z.string().optional(),
  locationCell: z.string().optional(),
  locationCity: z.string().optional(),
  zip: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
