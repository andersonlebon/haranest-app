import { pgTable, bigserial, integer, timestamp } from "drizzle-orm/pg-core";
import { properties } from "./properties";

export const propertyEngagements = pgTable("property_engagements", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  propertyId: bigserial("property_id", { mode: "number" })
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),

  views: integer("views").default(0),
  likes: integer("likes").default(0),
  dislikes: integer("dislikes").default(0),
  favorites: integer("favorites").default(0),
  saveForLater: integer("save_for_later").default(0),
  inquiries: integer("inquiries").default(0), // e.g., contact clicks or message interest
  shares: integer("shares").default(0), // how many times it was shared
  comments: integer("comments").default(0), // number of comments
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});