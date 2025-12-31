import { db } from "@/config/drizzle.config";
import { profiles } from "@/db/schema/profiles";
import { eq } from "drizzle-orm";
import { CreateProfileDto, UpdateProfileDto } from "../dtos/profiles.dto";

export class ProfileRepository {
  static async create(data: CreateProfileDto) {
    const result = await db.insert(profiles).values({
      ...data,
      role: data.role || "client",
      isVerified: data.isVerified ?? false,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return result[0];
  }

  static async findByUserId(userId: string) {
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    return profile[0] || null;
  }

  static async update(userId: string, data: UpdateProfileDto) {
    const result = await db
      .update(profiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();

    return result[0];
  }

  static async updateVerification(userId: string, isVerified: boolean) {
    const result = await db
      .update(profiles)
      .set({ isVerified, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();

    return result[0];
  }

  static async delete(userId: string) {
    const result = await db
      .delete(profiles)
      .where(eq(profiles.userId, userId))
      .returning();

    return result[0] || null;
  }

  static async findAll() {
    const allProfiles = await db.select().from(profiles);
    return allProfiles;
  }
}
