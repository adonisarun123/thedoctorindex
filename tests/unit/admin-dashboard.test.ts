import assert from "node:assert/strict";
import { test } from "node:test";

import { summariseInbox, type InboxItem } from "../../lib/admin-dashboard";

const item = (kind: InboxItem["kind"], ageHours: number, slaHours: number, priority = 2): InboxItem => ({
  kind, id: `${kind}-${ageHours}`, subject: "Dr X", detail: "", createdAt: new Date(Date.now() - ageHours * 36e5),
  priority, slaHours, ageHours, breached: ageHours > slaHours, href: "#",
});

test("summariseInbox counts open and breached per queue and orders breached first", () => {
  const s = summariseInbox([item("claim", 60, 48), item("claim", 2, 48), item("enquiry", 1, 24), item("register", 200, 168)]);
  const claim = s.find((q) => q.kind === "claim")!;
  assert.equal(claim.open, 2);
  assert.equal(claim.breached, 1);
  assert.equal(Math.round(claim.oldestHours), 60);
  assert.equal(s[0].breached, 1);
  assert.equal(s.filter((q) => q.open === 0).length, 7);
});
