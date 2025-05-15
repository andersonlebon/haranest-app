import { DATABASE_URL } from "@/config";
import { defineConfig } from "drizzle-kit";

console.log("DATABASE_URL", DATABASE_URL);

export default defineConfig({
  dialect: 'postgresql',
  schema: "./src/db/schema",
  out: "./src/db/drizzle",
  dbCredentials: {
    url: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' 
  },

  extensionsFilters: ['postgis'],
  schemaFilter: 'public',
  tablesFilter: '*',

  introspect: {
    casing: 'camel',
  },

  migrations: {
    prefix: 'timestamp',
    table: '__drizzle_migrations__',
    schema: 'public',
  },

  entities: {
    roles: {
      provider: '',
      exclude: [],
      include: [],
    },
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});
