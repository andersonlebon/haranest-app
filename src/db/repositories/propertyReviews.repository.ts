import { db } from "@/config/drizzle.config";
import { propertyReviews } from "../schema/property_reviews";
import { and, eq } from "drizzle-orm";
import { paginateQuery } from "@/utils/paginate";
import { PaginationParams } from "@/types";
import { PropertyRepository } from "./";
import { PropertyReviewFormValues } from "../validations";

export class PropertyReviewRepository {

  static async getAll(
    propertyId: number,
    params: PaginationParams 
   ) {
    const { page = 1, perPage = 10 } = params || {};
    const pagination = { page, perPage };

    const conditions = [];
    conditions.push(eq(propertyReviews.propertyId, propertyId));

    return paginateQuery(db, propertyReviews, pagination, {
      where: and(...conditions),
      orderBy: [{ column: propertyReviews.createdAt, direction: 'desc' }],
    });
  }

  static async findByReviewId(id: number) {
    const result = await db
      .select()
      .from(propertyReviews)
      .where(eq(propertyReviews.id, id))
      .limit(1);
    return result[0] || null;
  }

  static async create(data: PropertyReviewFormValues | Partial<typeof propertyReviews.$inferInsert>) {
    return await db.transaction(async (trx) => {
      // 1. Insert the new review
      const [inserted] = await trx
        .insert(propertyReviews)
        .values(data as typeof propertyReviews.$inferInsert)
        .returning();

      if (!inserted) return null;

      // 2. Calculate the new average rating for the property
      const { propertyId } = inserted;

      // Get all ratings for this property
      const ratingsResult = await trx
        .select({ rating: propertyReviews.rating })
        .from(propertyReviews)
        .where(eq(propertyReviews.propertyId, propertyId));

      // Calculate the average rating
      const ratings = ratingsResult.map(r => Number(r.rating) || 0);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, rate) => sum + rate, 0) / ratings.length
          : 0;

      // Update the Property's rating using PropertyRepository.
      await PropertyRepository.update(propertyId, { reviewRate: averageRating });
      return inserted;
    });
  }

  static async update(id: number, data: Partial<typeof propertyReviews.$inferInsert>) {
    const [updated] = await db
      .update(propertyReviews)
      .set(data as typeof propertyReviews.$inferInsert)
      .where(eq(propertyReviews.id, id))
      .returning();
    return updated;
  }

  static async delete(id: number) {
    await db.delete(propertyReviews).where(eq(propertyReviews.id, id));
  }
}