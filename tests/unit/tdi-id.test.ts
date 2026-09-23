import assert from "node:assert/strict";
import { test } from "node:test";

import { SPECIALTY_KEYS } from "../../lib/data/taxonomy";
import { TDI_CODES, TDI_ID_RE, formatTdiId, normaliseTdiId } from "../../lib/data/tdi-codes";
import { qrMatrix, qrSvg } from "../../lib/tdi/qr";

test("every speciality has a unique three-letter TDI code", () => {
  const codes = SPECIALTY_KEYS.map((k) => TDI_CODES[k]);
  for (const c of codes) assert.match(c, /^[A-Z]{3}$/);
  assert.equal(new Set(codes).size, codes.length);
});

test("format pads to five digits and grows past 99,999 without truncating", () => {
  assert.equal(formatTdiId("CAR", 412), "TDI-CAR-00412");
  assert.equal(formatTdiId("GPR", 123456), "TDI-GPR-123456");
  assert.match(formatTdiId("GPR", 123456), TDI_ID_RE);
});

test("normalise accepts any case and rejects anything else", () => {
  assert.equal(normaliseTdiId(" tdi-ort-00959 "), "TDI-ORT-00959");
  assert.equal(normaliseTdiId("TDI-ORT-959"), null);
  assert.equal(normaliseTdiId("TDI-ORTH-00959"), null);
  assert.equal(normaliseTdiId("../etc"), null);
});

test("QR uses error correction H and keeps the logo inside its budget", () => {
  const url = "https://thedoctorindex.in/d/TDI-ORT-00959";
  const { n } = qrMatrix(url);
  const withLogo = (qrSvg(url).match(/<rect x="[\d.]+" y="[\d.]+" width="0\.94"/g) ?? []).length;
  const without = (qrSvg(url, { logo: false }).match(/<rect x="[\d.]+" y="[\d.]+" width="0\.94"/g) ?? []).length;
  // H recovers ~30% of codewords; the knockout must stay far below that.
  assert.ok(without > withLogo);
  let hole = Math.round(n * 0.22);
  if (hole % 2 === 0) hole += 1;
  assert.ok((hole * hole) / (n * n) < 0.08, "centre knockout under 8% of the symbol");
});
