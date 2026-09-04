import assert from "node:assert/strict";
import { test } from "node:test";

import { formatKm, haversineKm, parseNear } from "../../lib/geo";

test("parseNear validates shape and range", () => {
  assert.deepEqual(parseNear("12.978,77.641"), { lat: 12.978, lng: 77.641 });
  assert.equal(parseNear("91,0"), null);
  assert.equal(parseNear("abc"), null);
  assert.equal(parseNear(undefined), null);
  assert.deepEqual(parseNear(["1,2", "3,4"]), { lat: 1, lng: 2 });
});

test("haversine: Indiranagar to Koramangala is about 5 km", () => {
  const km = haversineKm({ lat: 12.9784, lng: 77.6408 }, { lat: 12.9352, lng: 77.6245 });
  assert.ok(km > 4.5 && km < 5.5, `got ${km}`);
});

test("formatKm rounds sensibly", () => {
  assert.equal(formatKm(0.04), "100 m");
  assert.equal(formatKm(0.55), "600 m");
  assert.equal(formatKm(3.14159), "3.1 km");
  assert.equal(formatKm(12.6), "13 km");
});
