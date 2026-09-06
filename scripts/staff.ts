import { config } from "dotenv";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as s from "../lib/db/schema";

config({ path: ".env.local" });
config();

/**
 * `npm run db:staff -- you@domain` — create (or promote) the first super
 * administrator without seeding fictional doctors. Falls back to
 * STAFF_BOOTSTRAP_ADMIN_EMAIL. Sign in at /admin/sign-in with the email OTP;
 * production builds then require an authenticator app on first sign-in.
 */
async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL");
  const email = (process.argv[2] || process.env.STAFF_BOOTSTRAP_ADMIN_EMAIL || "").toLowerCase().trim();
  if (!email.includes("@")) throw new Error("usage: npm run db:staff -- you@domain");
  const client = postgres(url, { max: 1, ssl: process.env.DATABASE_SSL === "disable" ? false : "require", onnotice: () => {} });
  const db = drizzle(client, { schema: s });
  let [admin] = await db.select().from(s.users).where(sql`lower(${s.users.email}) = ${email}`);
  if (!admin) [admin] = await db.insert(s.users).values({ email, role: "staff", displayName: "Super administrator" }).returning();
  else if (admin.role !== "staff") await db.update(s.users).set({ role: "staff" }).where(eq(s.users.id, admin.id));
  await db.insert(s.staffMembers).values({ userId: admin.id, roles: ["super_admin"], active: true }).onConflictDoUpdate({ target: s.staffMembers.userId, set: { roles: ["super_admin"], active: true } });
  console.log(`super administrator: ${email}`);
  await client.end();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
