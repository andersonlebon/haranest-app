// Do NOT use dotenv in the browser bundle. Next.js injects NEXT_PUBLIC_* at build time.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

// IMPORTANT: Use server-only DATABASE_URL. Never expose this to the client.
export const DATABASE_URL = (process.env.DATABASE_URL as string | undefined) || '';

export const SUPABASE_STORAGE_BUCKET = (process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET as string | undefined) || 'properties';