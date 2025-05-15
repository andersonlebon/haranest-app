import { pgTable, bigserial, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { profiles } from "./profiles";

export const propertyComments = pgTable("property_comments", {
  id: bigserial("id", { mode: "number" }).primaryKey(),

  propertyId:  bigserial("property_id", { mode: "number" })
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),

  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),

  comment: text("comment").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
