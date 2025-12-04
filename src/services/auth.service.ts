'use server'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { profiles } from "@/db/schema/profiles";
import { db } from "@/config/drizzle.config";
import { eq } from "drizzle-orm";
import { UserRole } from "@/db/dtos/profiles.dto";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // Extract credentials
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Sign in with Supabase
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword(data);
  


  if (authError || !authData.user) {
   return { error: authError?.message, user: null, profile: null };
  }

  const user = authData.user;
  const userId = user.id;

  // Determine if email is verified
  const emailVerified = !!user.confirmed_at;

  // Load profile from Drizzle ORM
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  const userProfile = profile[0] ?? null;

  // If profile exists and email is verified but profile.isVerified is false, update it
  if (userProfile && emailVerified && !userProfile.isVerified) {
    await db
      .update(profiles)
      .set({ isVerified: true, updatedAt: new Date() })
      .where(eq(profiles.userId, userId));
    userProfile.isVerified = true;
  }

  // Optional return
  return {
    error: null,
    user,
    profile: userProfile,
  };
}


export async function signup(formData: FormData) {
  const supabase = await createClient()

  // Get form values
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = (formData.get("name") as string) || ""; // optional
  const phoneNumber = (formData.get("phoneNumber") as string) || null;
  const country = (formData.get("country") as string) || null;
  const city = (formData.get("city") as string) || null;
  const role = (formData.get("role") as UserRole) || "client";

  // 1️⃣ Create user in Supabase Auth
  const { data: authData, error: authError } =  await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError, profile: null, user: null };
  }

  const userId = authData.user.id;

  // 2️⃣ Create profile in Drizzle ORM
  const profile = await db.insert(profiles).values({
    userId,
    fullName,
    email,
    phoneNumber,
    country,
    city,
    role,
    isVerified: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { error: null, profile, user: authData.user };
}
