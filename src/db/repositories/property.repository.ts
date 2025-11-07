import { properties } from "@/db/schema/properties/schema";
import { eq } from "drizzle-orm";
import { db } from "@/config/drizzle.config";
import { paginateQuery } from "@/utils/paginate";
import { PaginationParams } from "@/components/shared/types";
import { PropertyFormValues } from "../schema/properties/validation";

export class PropertyRepository {
  static async findAll(params: PaginationParams) {
    return paginateQuery(db, properties, params, {
      orderBy: [{ column: properties.createdAt, direction: "desc" }],
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
