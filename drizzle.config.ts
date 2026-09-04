import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });
config();

/**
 * drizzle-kit configuration.
 *
 *   npm run db:generate   # schema.ts → migrations/*.sql (offline)
 *   npm run db:migrate    # apply migrations to DATABASE_URL
 *   npm run db:seed       # load taxonomy, the fictional doctors, bootstrap admin
 *   npm run db:studio     # browse the database
 *
 * DIRECT_URL (non-pooled) is preferred for migrations on Neon; DATABASE_URL is
 * the fallback so a single-URL setup still works.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dbCredentials: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
  strict: true,
  verbose: true,
});
