import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * Application-level encryption for secrets that must be readable later (TOTP
 * seeds). Key: FIELD_ENCRYPTION_KEY (32 bytes, base64) when set; otherwise
 * derived from AUTH_SECRET so a single-secret deployment still works. Rotate
 * by listing old,new in FIELD_ENCRYPTION_KEY — decrypt tries each.
 */
function keys(): Buffer[] {
  const raw = process.env.FIELD_ENCRYPTION_KEY?.trim();
  if (raw) return raw.split(",").map((k) => Buffer.from(k.trim(), "base64")).filter((b) => b.length === 32);
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET or FIELD_ENCRYPTION_KEY is required to encrypt secrets");
  return [createHash("sha256").update(`field:${secret}`).digest()];
}

export function encrypt(plain: string): string {
  const key = keys()[0];
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return `v1.${iv.toString("base64")}.${c.getAuthTag().toString("base64")}.${enc.toString("base64")}`;
}

export function decrypt(token: string): string {
  const [v, ivB, tagB, dataB] = token.split(".");
  if (v !== "v1") throw new Error("unknown ciphertext version");
  let last: unknown;
  for (const key of keys()) {
    try {
      const d = createDecipheriv("aes-256-gcm", key, Buffer.from(ivB, "base64"));
      d.setAuthTag(Buffer.from(tagB, "base64"));
      return Buffer.concat([d.update(Buffer.from(dataB, "base64")), d.final()]).toString("utf8");
    } catch (e) {
      last = e;
    }
  }
  throw last instanceof Error ? last : new Error("decrypt failed");
}
