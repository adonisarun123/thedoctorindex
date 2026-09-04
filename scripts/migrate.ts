import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({ path: ".env.local" });
config();

/**
 * Applies lib/db/migrations in journal order and records each in
 * drizzle.__drizzle_migrations. Safe to re-run. Uses DIRECT_URL (non-pooled)
 * when present — Neon's pooler is transaction-mode PgBouncer, and DDL is
 * happier on a direct connection.
 */
async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL");
  const sql = postgres(url, {
    max: 1,
    ssl: process.env.DATABASE_SSL === "disable" ? false : "require",
    onnotice: () => {},
  });
  const db = drizzle(sql);
  console.log("Applying migrations…");
  await migrate(db, { migrationsFolder: "lib/db/migrations" });
  console.log("Done.");
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
