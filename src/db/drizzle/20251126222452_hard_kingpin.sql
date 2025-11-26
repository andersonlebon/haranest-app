CREATE TYPE "public"."user_role" AS ENUM('client', 'seller', 'agent', 'investor', 'business_owner', 'admin');--> statement-breakpoint
CREATE TYPE "public"."engagement_type" AS ENUM('like', 'dislike', 'view', 'favorite', 'buy_later');--> statement-breakpoint
CREATE TYPE "public"."exterior_material" AS ENUM('brick', 'stone', 'vinyl', 'wood', 'stucco', 'cement', 'glass', 'other');--> statement-breakpoint
CREATE TYPE "public"."property_feature" AS ENUM('garage', 'swimming_pool', 'garden', 'balcony', 'air_conditioning', 'security', 'gym', 'fireplace', 'furnished', 'internet', 'solar_panels', 'basement');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('available', 'sold', 'pending', 'rented', 'off_market', 'under_construction');--> statement-breakpoint
CREATE TYPE "public"."property_structure" AS ENUM('brick', 'wood', 'steel', 'concrete', 'mixed', 'other');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('apartment', 'house', 'villa', 'condo', 'cabin', 'townhouse', 'studio', 'duplex', 'penthouse', 'farmhouse', 'bungalow', 'mansion', 'loft', 'other', '');--> statement-breakpoint
CREATE TYPE "public"."rent_or_sell" AS ENUM('rent', 'sell');--> statement-breakpoint
CREATE TYPE "public"."roofing_type" AS ENUM('shingles', 'tiles', 'metal', 'flat', 'thatched', 'other');--> statement-breakpoint
CREATE TYPE "public"."property_interaction_type" AS ENUM('like', 'dislike', 'favorite', 'view', 'buy_later', 'contacted', 'booked_visit', 'shared', 'reported', 'saved_note', 'rated', 'applied');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role" "user_role" DEFAULT 'client' NOT NULL,
	"full_name" text,
	"email" text,
	"phone_number" text,
	"country" text,
	"city" text,
	"address" text,
	"bio" text,
	"avatar_url" text,
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"profile_id" bigserial NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"price" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"commission" numeric(5, 2),
	"images" text[] DEFAULT '{}',
	"video_preview_url" text,
	"review_rate" integer DEFAULT 0 NOT NULL,
	"amenities" text[] DEFAULT '{}',
	"features" "property_feature"[] DEFAULT '{}',
	"rent_or_sell" "rent_or_sell" DEFAULT 'sell' NOT NULL,
	"property_type" "property_type" NOT NULL,
	"status" "property_status" DEFAULT 'available' NOT NULL,
	"size" numeric,
	"lot_size" numeric,
	"rooms" integer,
	"bedrooms" integer,
	"bathrooms" integer,
	"floors" integer,
	"garage" boolean DEFAULT false,
	"garage_size" numeric,
	"basement" boolean DEFAULT false,
	"year_built" integer,
	"structure_type" "property_structure",
	"roofing" "roofing_type",
	"exterior_material" "exterior_material",
	"price_label" text,
	"before_price_label" text,
	"available_from" timestamp,
	"province" text,
	"district" text,
	"town" text,
	"cell" text,
	"city" text,
	"zip" text,
	"latitude" numeric(10, 6),
	"longitude" numeric(10, 6),
	"is_published" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "property_engagements" (
	"id" bigserial NOT NULL,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"dislikes" integer DEFAULT 0,
	"favorites" integer DEFAULT 0,
	"save_for_later" integer DEFAULT 0,
	"inquiries" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_interactions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"profile_id" bigserial NOT NULL,
	"interaction_type" "property_interaction_type" NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "property_comments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"property_id" bigserial NOT NULL,
	"profile_id" bigserial NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_reviews" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"property_id" bigserial NOT NULL,
	"name" text NOT NULL,
	"location" text,
	"rating" integer DEFAULT 0,
	"comment" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "property_engagements" ADD CONSTRAINT "property_engagements_id_properties_id_fk" FOREIGN KEY ("id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_interactions" ADD CONSTRAINT "property_interactions_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "property_interactions" ADD CONSTRAINT "property_interactions_profile_id_properties_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "property_comments" ADD CONSTRAINT "property_comments_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_comments" ADD CONSTRAINT "property_comments_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_reviews" ADD CONSTRAINT "property_reviews_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;