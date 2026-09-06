import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as s from "../lib/db/schema";
import { syncTaxonomy } from "../lib/db/taxonomy-sync";

config({ path: ".env.local" });
config();

/**
 * `npm run db:taxonomy` — write the speciality registry (and seed localities)
 * into the database without touching doctors. Run after every deploy that
 * changes lib/data/specialties.ts, and before the first import.
 */
async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL");
  const client = postgres(url, { max: 1, ssl: process.env.DATABASE_SSL === "disable" ? false : "require", onnotice: () => {} });
  const r = await syncTaxonomy(drizzle(client, { schema: s }));
  console.log(`taxonomy: ${r.specialties} specialities, ${r.localities} localities synced`);
  await client.end();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
