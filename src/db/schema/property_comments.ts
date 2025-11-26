import { pgTable, bigserial, text, timestamp } from "drizzle-orm/pg-core";
import { properties } from "./properties/schema";
import { profiles } from "./profiles";

export const propertyComments = pgTable("property_comments", {
  id: bigserial("id", { mode: "number" }).primaryKey(),

  propertyId:  bigserial("property_id", { mode: "number" })
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),

  profileId: bigserial("profile_id", { mode: "number" })
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),

  comment: text("comment").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
