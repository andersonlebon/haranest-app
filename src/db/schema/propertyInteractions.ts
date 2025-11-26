// schema/propertyInteractions.ts
import {
  pgTable,
  bigserial,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { properties } from "./properties";

// 1. Enum for interaction type
export const propertyInteractionTypeEnum = pgEnum("property_interaction_type", [
  "like",           // 👍
  "dislike",        // 👎
  "favorite",       // ❤️
  "view",           // 👁️
  "buy_later",      // 🕒
  "contacted",      // 📞 user contacted the seller
  "booked_visit",   // 📅 scheduled a visit
  "shared",         // 🔄 shared the property
  "reported",       // 🚫 reported for fraud/inappropriate
  "saved_note",     // 📝 user added a personal note
  "rated",          // ⭐ rated the property
  "applied",        // 📩 for business listings, user submitted investment interest
]);

// 2. Main table
export const propertyInteractions = pgTable("property_interactions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),

  profileId: bigserial("profile_id", { mode: "number" })
    .notNull()
    .references(() => profiles.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  propertyId: bigserial("profile_id", { mode: "number" })
    .notNull()
    .references(() => properties.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  interactionType: propertyInteractionTypeEnum("interaction_type").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});



export const propertyEngagements = pgTable("property_engagements", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  propertyId: bigserial("id", { mode: "number" })
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
