import { db } from "@/config/drizzle.config";
import { properties } from "../schema/properties";

export async function seedProperties() {
  const seedData: (typeof properties.$inferInsert)[] = [
    {
      profileId: 1,
      title: "Modern Villa in Kigali",
      description:
        "A luxurious modern villa located in Kigali city center with a private pool and smart home system.",
      price: "250000",
      currency: "USD",
      propertyType: "villa",
      rentOrSell: "sell",
      status: "available",
      features: ["swimming_pool", "garage", "air_conditioning"],
      locationCity: "Kigali",
      locationProvince: "Gasabo",
      size: "400",
      isPublished: true,
      isFeatured: true,
    },
    {
      profileId: 1,
      title: "Affordable Apartment in Remera",
      description:
        "A cozy 2-bedroom apartment in Remera, ideal for small families or working professionals.",
      price: "800",
      currency: "USD",
      propertyType: "apartment",
      rentOrSell: "rent",
      status: "available",
      features: ["furnished", "internet", "security"],
      locationCity: "Kigali",
      locationProvince: "Gasabo",
      size: "90",
      isPublished: true,
      isFeatured: false,
    },
    {
      profileId: 1,
      title: "Luxury Penthouse with City View",
      description:
        "An elegant 3-bedroom penthouse with panoramic city views, gym access, and underground parking.",
      price: "320000",
      currency: "USD",
      propertyType: "penthouse",
      rentOrSell: "sell",
      status: "available",
      features: ["gym", "balcony", "air_conditioning", "furnished"],
      locationCity: "Kigali",
      locationProvince: "Nyarugenge",
      size: "350",
      isPublished: true,
      isFeatured: true,
    },
  ];

  await db.insert(properties).values(seedData);
  console.log("✅ Properties seeded successfully!");
}
