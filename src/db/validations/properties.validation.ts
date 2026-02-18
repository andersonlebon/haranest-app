import { z } from "zod";
import { propertyFeatureEnum, rentOrSellEnum, propertyTypeEnum, propertyStatusEnum, propertyStructureEnum, roofingTypeEnum, exteriorMaterialEnum } from "@/db/schema/properties";
import { zodEnumFromPgEnum } from "@/db/types";


// Create Zod enums from pgEnums
export const propertyTypeZodEnum = zodEnumFromPgEnum(propertyTypeEnum);
export const propertyStatusZodEnum = zodEnumFromPgEnum(propertyStatusEnum);
export const propertyFeatureZodEnum = zodEnumFromPgEnum(propertyFeatureEnum);
export const rentOrSellZodEnum = zodEnumFromPgEnum(rentOrSellEnum);
export const propertyStructureZodEnum = zodEnumFromPgEnum(propertyStructureEnum);
export const roofingZodEnum = zodEnumFromPgEnum(roofingTypeEnum);
export const exteriorMaterialZodEnum = zodEnumFromPgEnum(exteriorMaterialEnum);

// Create property schema
export const propertySchema = z.object({
  profileId: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().positive(), 
  currency: z.string().default("USD"),
  commission: z.coerce.number().optional(),
  images: z.array(z.string()).default([]),
  videoPreviewUrl: z.string().optional(),
  reviewRate: z.coerce.number().int().default(0),
  amenities: z.array(z.string()).default([]),
  features: z.array(propertyFeatureZodEnum).default([]),
  
  rentOrSell: rentOrSellZodEnum.default("sell"),
  propertyType: propertyTypeZodEnum,
  status: propertyStatusZodEnum.default("available"),

  size: z.coerce.number().optional(),
  lotSize: z.coerce.number().optional(),
  rooms: z.coerce.number().int().optional(),
  bedrooms: z.coerce.number().int().optional(),
  bathrooms: z.coerce.number().int().optional(),
  floors: z.coerce.number().int().optional(),
  garage: z.boolean().default(false),
  garageSize: z.coerce.number().optional(),
  basement: z.boolean().default(false),

  yearBuilt: z.coerce.number().int().optional(),
  structureType: propertyStructureZodEnum.optional(),
  roofing: roofingZodEnum.optional(),
  exteriorMaterial: exteriorMaterialZodEnum.optional(),

  priceLabel: z.string().optional(),
  beforePriceLabel: z.string().optional(),
  availableFrom: z.string().datetime().optional(),

  locationProvince: z.string().optional(),
  locationDistrict: z.string().optional(),
  locationTown: z.string().optional(),
  locationCell: z.string().optional(),
  locationCity: z.string().optional(),
  zip: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),

  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
export const updatePropertySchema = propertySchema.partial();