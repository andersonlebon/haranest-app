import { properties } from "@/db/schema/properties";
import { and, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { db } from "@/config/drizzle.config";
import { paginateQuery } from "@/utils/paginate";
import { PaginationParams } from "@/types/api";
import { PropertyFormValues } from "../validations/properties.validation";
import { PropertyParams } from "../dtos/properties.dto";

export class PropertyRepository {
   static async findAll(params: PaginationParams & { filters?: PropertyParams }) {
    const { filters, ...pagination } = params;
    const conditions = [];

    // ✅ Price range filter
    if (filters?.price?.length === 2) {
      const [min, max] = filters.price;
      conditions.push(gte(properties.price, min.toString()));
      conditions.push(lte(properties.price, max.toString()));
    }

    // ✅ Bedrooms & Bathrooms
    if (filters?.bedrooms && filters.bedrooms > 0)
      conditions.push(eq(properties.bedrooms, filters.bedrooms));

    if (filters?.bathrooms && filters.bathrooms > 0)
      conditions.push(eq(properties.bathrooms, filters.bathrooms));

    // ✅ Property Type
    if (filters?.propertyType)
      conditions.push(eq(properties.propertyType, filters.propertyType));

    // ✅ Search (title or description)
    if (filters?.search)
      conditions.push(ilike(properties.title, `%${filters.search}%`));

    // ✅ Array-based filters (amenities/features)
  // ✅ Array-based filters (amenities/features)
    if (filters?.amenities?.length) {
      conditions.push(
        sql`${properties.amenities} && ${filters.amenities as string[]}`
      );
    }
    
    if (filters?.features?.length) {
      conditions.push(
        sql`${properties.features} && ${filters.features as string[]}`
      );
    }

    return paginateQuery(db, properties, pagination, {
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: [{ column: properties.createdAt, direction: 'desc' }],
    });
  }


  static async findById(id: number) {
    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);
    return result[0] || null;
  }

  static async create(data: PropertyFormValues | Partial<typeof properties.$inferInsert>) {
    const [inserted] = await db.insert(properties).values(data as typeof properties.$inferInsert).returning();
    return inserted;
  }

  static async update(id: number, data: PropertyFormValues | Partial<typeof properties.$inferInsert>) {
    const [updated] = await db
      .update(properties)
      .set(data as typeof properties.$inferInsert)
      .where(eq(properties.id, id))
      .returning();
    return updated;
  }

  static async delete(id: number) {
    await db.delete(properties).where(eq(properties.id, id));
  }
}
