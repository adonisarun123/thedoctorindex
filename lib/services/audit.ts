import "server-only";

import { headers } from "next/headers";

import { ipHash } from "@/lib/auth/hash";
import { getDb } from "@/lib/db/client";
import { auditLogs } from "@/lib/db/schema";

/**
 * Every state change goes through here (plan §5.3, §16.5). The service layer
 * calls audit() after the write, inside the same transaction where one exists.
 */
export async function audit(entry: {
  actorUserId?: string | null;
  actorRole?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
  reason?: string | null;
}): Promise<void> {
  let ip: string | null = null;
  try {
    const h = await headers();
    ip = h.get("x-forwarded-for")?.split(",")[0] ?? null;
  } catch {
    /* outside a request (scripts) */
  }
  await getDb().insert(auditLogs).values({
    actorUserId: entry.actorUserId ?? null,
    actorRole: entry.actorRole ?? null,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId ?? null,
    before: entry.before ?? null,
    after: entry.after ?? null,
    reason: entry.reason ?? null,
    ipHash: ipHash(ip),
  });
}
