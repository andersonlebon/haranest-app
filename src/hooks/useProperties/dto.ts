import { properties } from "@/db/schema/properties";

export type PropertyResponseDto = typeof properties.$inferSelect;
