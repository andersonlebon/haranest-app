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

export const structureTypes = [
  { value: "brick", label: "Brick" },
  { value: "wood", label: "Wood" },
  { value: "steel", label: "Steel" },
  { value: "concrete", label: "Concrete" },
  { value: "mixed", label: "Mixed" },
  { value: "other", label: "Other" },
] as const;

export const roofingTypes = [
  { value: "shingles", label: "Shingles" },
  { value: "tiles", label: "Tiles" },
  { value: "metal", label: "Metal" },
  { value: "flat", label: "Flat" },
  { value: "thatched", label: "Thatched" },
  { value: "other", label: "Other" },
] as const;

export const exteriorMaterials = [
  { value: "brick", label: "Brick" },
  { value: "stone", label: "Stone" },
  { value: "vinyl", label: "Vinyl" },
  { value: "wood", label: "Wood" },
  { value: "stucco", label: "Stucco" },
  { value: "cement", label: "Cement" },
  { value: "glass", label: "Glass" },
  { value: "other", label: "Other" },
] as const;

export const currencies = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "RWF", label: "RWF (Frw)" },
] as const;