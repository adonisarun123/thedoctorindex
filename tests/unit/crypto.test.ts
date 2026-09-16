import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { test } from "node:test";

import { decrypt, encrypt } from "../../lib/auth/crypto";

test("encrypt/decrypt round-trips with a 32-byte base64 key", () => {
  process.env.FIELD_ENCRYPTION_KEY = randomBytes(32).toString("base64");
  assert.equal(decrypt(encrypt("JBSWY3DPEHPK3PXP")), "JBSWY3DPEHPK3PXP");
});

test("a key of the wrong length is normalised, not dropped", () => {
  process.env.FIELD_ENCRYPTION_KEY = randomBytes(48).toString("base64");
  assert.equal(decrypt(encrypt("secret")), "secret");
});

test("rotation: old,new both decrypt", () => {
  const oldKey = randomBytes(32).toString("base64");
  process.env.FIELD_ENCRYPTION_KEY = oldKey;
  const token = encrypt("hello");
  process.env.FIELD_ENCRYPTION_KEY = `${randomBytes(32).toString("base64")},${oldKey}`;
  assert.equal(decrypt(token), "hello");
});

test("falls back to AUTH_SECRET when no field key", () => {
  delete process.env.FIELD_ENCRYPTION_KEY;
  process.env.AUTH_SECRET = "x".repeat(32);
  assert.equal(decrypt(encrypt("hi")), "hi");
});
