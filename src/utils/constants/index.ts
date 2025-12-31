// Centralized enums used across create/edit forms and server validation
// These MUST mirror the enums defined in `src/db/schema/properties.ts`
export const propertyTypes = [
  "apartment",
  "house",
  "villa",
  "condo",
  "cabin",
  "townhouse",
  "studio",
  "duplex",
  "penthouse",
  "farmhouse",
  "bungalow",
  "mansion",
  "loft",
  "other",
] as const;

export const propertyFeatures = [
  "garage",
  "swimming_pool",
  "garden",
  "balcony",
  "air_conditioning",
  "security",
  "gym",
  "fireplace",
  "furnished",
  "internet",
  "solar_panels",
  "basement",
] as const;
export const statuses = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
  { value: "pending", label: "Pending" },
  { value: "rented", label: "Rented" },
  { value: "off_market", label: "Off Market" },
  { value: "under_construction", label: "Under Construction" },
];