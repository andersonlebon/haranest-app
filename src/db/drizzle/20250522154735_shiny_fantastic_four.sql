CREATE TYPE "public"."rent_or_sell" AS ENUM('rent', 'sell');--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "currency" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "review_rate" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "rent_or_sell" "rent_or_sell" DEFAULT 'sell' NOT NULL;