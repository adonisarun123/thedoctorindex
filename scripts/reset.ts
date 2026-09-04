import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });
config();

/**
 * Drops and recreates the public schema. Refuses to run unless
 * DATABASE_ALLOW_DESTRUCTIVE_MIGRATIONS=1 and APP_ENV is not production.
 */
async function main() {
  if (process.env.APP_ENV === "production" || process.env.DATABASE_ALLOW_DESTRUCTIVE_MIGRATIONS !== "1") {
    throw new Error("Refusing: set DATABASE_ALLOW_DESTRUCTIVE_MIGRATIONS=1 and APP_ENV != production");
  }
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL");
  const sql = postgres(url, { max: 1, ssl: process.env.DATABASE_SSL === "disable" ? false : "require" });
  await sql.unsafe("DROP SCHEMA IF EXISTS drizzle CASCADE; DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  console.log("Schema reset. Run db:migrate then db:seed.");
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
