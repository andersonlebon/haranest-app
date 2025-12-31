import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { DATABASE_URL } from '.';

 
const effectiveDatabaseUrl = DATABASE_URL;

// Ensure we never try to initialize with an empty URL
if (!effectiveDatabaseUrl) {
  throw new Error('DATABASE_URL is not set. Please define it in your server environment.');
}

// Reuse a singleton connection in dev to avoid multiple connections
const globalForDb = global as unknown as { __pg?: ReturnType<typeof postgres> };

export const client =
  globalForDb.__pg ||
  postgres(effectiveDatabaseUrl, {
    prepare: false,
    max: 5,
    idle_timeout: 20,
    connect_timeout: 30,
    ssl: {
  
      rejectUnauthorized: false,
    },
  });

if (!globalForDb.__pg) {
  globalForDb.__pg = client;
}

export const db = drizzle(client);