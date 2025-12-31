/**
 * Centralized environment variables configuration
 * 
 * Do NOT use dotenv in the browser bundle. Next.js injects NEXT_PUBLIC_* at build time.
 * All environment variables should be accessed through this file.
 */

// Supabase Configuration
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
export const SUPABASE_STORAGE_BUCKET = 
  (process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET as string | undefined) || 'properties';

// Database Configuration
// IMPORTANT: Use server-only DATABASE_URL. Never expose this to the client.
export const DATABASE_URL = 
  (process.env.DATABASE_URL as string | undefined) ||
  (process.env.NEXT_PUBLIC_DATABASE_URL as string | undefined) ||
  '';

// API Configuration
export const API_URL = 
  (process.env.NEXT_PUBLIC_API_URL as string | undefined) || 
  'http://localhost:3000';

// Environment
export const NODE_ENV = process.env.NODE_ENV as 'development' | 'production' | 'test' | undefined;
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';