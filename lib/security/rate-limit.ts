import { sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { rateLimits } from "@/lib/db/schema";

/**
 * Fixed-window rate limiter backed by Postgres. Redis replaces this at scale
 * (REDIS_URL in .env.example); the interface stays the same.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds = Number(process.env.RATE_LIMIT_WINDOW_SECONDS ?? 60),
): Promise<{ ok: boolean; remaining: number }> {
  const db = getDb();
  const windowStart = new Date(Math.floor(Date.now() / (windowSeconds * 1000)) * windowSeconds * 1000);
  const rows = (await db.execute(sql`
    insert into ${rateLimits} (key, window_start, count)
    values (${key}, ${windowStart.toISOString()}::timestamptz, 1)
    on conflict (key, window_start) do update set count = ${rateLimits}.count + 1
    returning count
  `)) as unknown as Array<{ count: number }>;
  const count = Number(rows[0]?.count ?? 1);
  // Opportunistic cleanup of old windows.
  if (Math.random() < 0.02) {
    await db.execute(sql`delete from ${rateLimits} where window_start < now() - interval '1 day'`);
  }
  return { ok: count <= limit, remaining: Math.max(0, limit - count) };
}
