import assert from "node:assert/strict";
import { test } from "node:test";

import { base32Decode, base32Encode, otpauthUri, totpAt, verifyTotp } from "../../lib/auth/totp";

// RFC 6238 appendix B, SHA-1, secret "12345678901234567890".
const SECRET = base32Encode(Buffer.from("12345678901234567890"));

test("base32 round-trips", () => {
  assert.equal(base32Decode(SECRET).toString(), "12345678901234567890");
});

test("matches the RFC 6238 test vectors", () => {
  assert.equal(totpAt(SECRET, Math.floor(59 / 30)), "287082");
  assert.equal(totpAt(SECRET, Math.floor(1111111109 / 30)), "081804");
  assert.equal(totpAt(SECRET, Math.floor(1234567890 / 30)), "005924");
});

test("verify accepts one step of drift and rejects garbage", () => {
  const now = 1111111109 * 1000;
  assert.equal(verifyTotp(SECRET, "081804", now), true);
  assert.equal(verifyTotp(SECRET, "081 804", now), true);
  assert.equal(verifyTotp(SECRET, "081804", now + 30_000), true);
  assert.equal(verifyTotp(SECRET, "081804", now + 90_000), false);
  assert.equal(verifyTotp(SECRET, "12345", now), false);
});

test("otpauth uri is well formed", () => {
  const u = otpauthUri("ABC", "a@b.in", "The Doctor Index");
  assert.match(u, /^otpauth:\/\/totp\/The%20Doctor%20Index:a%40b\.in\?secret=ABC&issuer=The%20Doctor%20Index/);
});
