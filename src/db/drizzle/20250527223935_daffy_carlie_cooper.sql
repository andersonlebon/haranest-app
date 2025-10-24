ALTER TABLE "properties" ADD COLUMN "amenities" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "features" "property_feature"[] DEFAULT '{}';