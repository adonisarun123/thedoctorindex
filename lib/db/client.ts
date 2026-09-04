import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/lib/db/schema";

/**
 * Database client.
 *
 * One postgres.js pool per process, created lazily so a build in seed mode
 * (no DATABASE_URL) never opens a connection. Neon's pooled endpoint is
 * PgBouncer in transaction mode, so prepared statements are disabled.
 */

export type Db = PostgresJsDatabase<typeof schema>;

declare global {
  // eslint-disable-next-line no-var
  var __tdi_db: { sql: ReturnType<typeof postgres>; db: Db } | undefined;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb(): Db {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Set it, or run with DATA_SOURCE=seed.");
  }
  if (!globalThis.__tdi_db) {
    const sql = postgres(process.env.DATABASE_URL, {
      max: Number(process.env.DATABASE_POOL_MAX ?? 10),
      idle_timeout: Number(process.env.DATABASE_IDLE_TIMEOUT_MS ?? 30000) / 1000,
      prepare: false,
      ssl: process.env.DATABASE_SSL === "disable" ? false : "require",
      connection: {
        application_name: process.env.OTEL_SERVICE_NAME ?? "thedoctorindex-web",
      },
    });
    globalThis.__tdi_db = { sql, db: drizzle(sql, { schema }) };
  }
  return globalThis.__tdi_db.db;
}

export { schema };
