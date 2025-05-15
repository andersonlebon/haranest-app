import {
  pgTable,
  bigserial,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

// Property Types
export const propertyTypeEnum = pgEnum("property_type", [
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
  "other"
]);

// Property Status
export const propertyStatusEnum = pgEnum("property_status", [
  "available",
  "sold",
  "pending",
  "rented",
  "off_market",
  "under_construction"
]);

// Engagement Types (likes, views, etc.)
export const engagementTypeEnum = pgEnum("engagement_type", [
  "like",
  "dislike",
  "view",
  "favorite",
  "buy_later"
]);

// Structure Type
export const propertyStructureEnum = pgEnum("property_structure", [
  "brick",
  "wood",
  "steel",
  "concrete",
  "mixed",
  "other"
]);

// Roofing Type
export const roofingTypeEnum = pgEnum("roofing_type", [
  "shingles",
  "tiles",
  "metal",
  "flat",
  "thatched",
  "other"
]);

// Exterior Materials
export const exteriorMaterialEnum = pgEnum("exterior_material", [
  "brick",
  "stone",
  "vinyl",
  "wood",
  "stucco",
  "cement",
  "glass",
  "other"
]);

// Property Features
export const propertyFeatureEnum = pgEnum("property_feature", [
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
  "basement"
]);


export const properties = pgTable("properties", {
  id: bigserial("id", { mode: "number" }).primaryKey(),

  profileId: bigserial("profile_id", { mode: "number" })
  .notNull()
  .references(() => profiles.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),

  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  commission: numeric("commission", { precision: 5, scale: 2 }),

  propertyType: propertyTypeEnum("property_type").notNull(),
  status: propertyStatusEnum("status").default("available").notNull(),

  size: numeric("size"),
  lotSize: numeric("lot_size"),
  rooms: integer("rooms"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  floors: integer("floors"),
  garage: boolean("garage").default(false),
  garageSize: numeric("garage_size"),
  basement: boolean("basement").default(false),

  yearBuilt: integer("year_built"),
  structureType: propertyStructureEnum("structure_type"),
  roofing: roofingTypeEnum("roofing"),
  exteriorMaterial: exteriorMaterialEnum("exterior_material"),

  priceLabel: text("price_label"),
  beforePriceLabel: text("before_price_label"),
  availableFrom: timestamp("available_from"),

  locationProvince: text("province"),
  locationDistrict: text("district"),
  locationTown: text("town"),
  locationCell: text("cell"),
  locationCity: text("city"),
  zip: text("zip"),
  latitude: numeric("latitude", { precision: 10, scale: 6 }),
  longitude: numeric("longitude", { precision: 10, scale: 6 }),

  isPublished: boolean("is_published").default(false),
  isFeatured: boolean("is_featured").default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
