import { pgTable, bigserial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { properties } from "./properties/schema";

export const propertyReviews = pgTable("property_reviews", {
  id: bigserial("id", { mode: "number" }).primaryKey(),

  propertyId: bigserial("property_id", { mode: "number" })
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),

  // Guest fields (no authentication required)
  name: text("name").notNull(),
  location: text("location"),
  rating: integer("rating").default(0),
  comment: text("comment").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});


