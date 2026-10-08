import assert from "node:assert/strict";
import { test } from "node:test";

process.env.FIELD_ENCRYPTION_KEY = "";
process.env.AUTH_SECRET = "test-secret-for-sealed-search";

test("sealed search terms round-trip and never appear in the URL", async () => {
  const { openSearch, sealedSearchPath } = await import("../../lib/search/sealed");
  const path = sealedSearchPath({ q: "chest pain since morning", loc: "HSR Layout" });
  assert.match(path, /^\/search\?t=[A-Za-z0-9_-]+$/);
  assert.ok(!/chest|pain|hsr/i.test(decodeURIComponent(path)));
  assert.deepEqual(openSearch(path.split("t=")[1]), { q: "chest pain since morning", loc: "HSR Layout" });
});

test("tampered or empty tokens open to null", async () => {
  const { openSearch, sealedSearchPath } = await import("../../lib/search/sealed");
  const t = sealedSearchPath({ q: "rash", loc: "" }).split("t=")[1];
  assert.equal(openSearch(t.slice(0, -4) + "AAAA"), null);
  assert.equal(openSearch(""), null);
  assert.equal(sealedSearchPath({ q: " ", loc: "" }), "/search");
});
