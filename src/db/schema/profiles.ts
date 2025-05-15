import {
  pgTable,
  bigserial,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "client",
  "seller",
  "agent",
  "investor",
  "business_owner",
  "admin",
]);

export const profiles = pgTable("profiles", {
  id: bigserial("id", { mode: "number" }).primaryKey(),

  userId: text("user_id").notNull(),

  role: userRoleEnum("role")
    .notNull()
    .default("client"),

  fullName: text("full_name"),
  email: text("email"),
  phoneNumber: text("phone_number"),
  country: text("country"),
  city: text("city"),
  address: text("address"),
  bio: text("bio"),

  avatarUrl: text("avatar_url"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
