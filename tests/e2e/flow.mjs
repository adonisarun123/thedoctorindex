// End-to-end drive of The Doctor Index through the real UI.
//
//   E2E_BASE_URL      running build, e.g. http://localhost:3111
//   E2E_DATABASE_URL  the database that build uses (a throwaway one — the run creates users, doctors, reviews)
//   E2E_SERVER_LOG    file the server's stdout is written to; OTP codes are read from it (EMAIL_PROVIDER=console)
//
// Run:  npm run test:e2e     (see README "Tests")
import fs from "node:fs";
import { chromium } from "playwright";
import postgres from "postgres";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3111";
const LOG = process.env.E2E_SERVER_LOG ?? "/tmp/next.log";
const sql = postgres(process.env.E2E_DATABASE_URL ?? process.env.DATABASE_URL ?? "", { onnotice: () => {}, ssl: process.env.DATABASE_SSL === "disable" ? false : undefined });
const results = [];
const ok = (name, cond, detail = "") => { results.push({ name, pass: Boolean(cond), detail }); console.log(`${cond ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`); };

function latestOtpFor(email) {
  const log = fs.readFileSync(LOG, "utf8");
  const re = new RegExp(`\\[mail:console\\] to=${email.replace(/[.+]/g, "\\$&")}[\\s\\S]*?(\\d{6})`, "g");
  let m, last = null;
  while ((m = re.exec(log))) last = m[1];
  return last;
}

async function signIn(page, email, next = "/") {
  await page.goto(`${BASE}/sign-in?next=${encodeURIComponent(next)}`);
  await page.fill("#identifier", email);
  await page.click("form:has(#identifier) button[type=submit]");
  await page.waitForSelector("#code", { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 500));
  const code = latestOtpFor(email);
  if (!code) throw new Error("no OTP in log for " + email);
  await page.fill("#code", code);
  await Promise.all([page.waitForURL((u) => !u.pathname.startsWith("/sign-in"), { timeout: 20000 }), page.click("form:has(#code) button[type=submit]")]);
  return code;
}


async function settle(page, ms = 20000) {
  // A queue action either shows an inline notice or re-renders the queue without the card.
  await page.waitForFunction(() => document.querySelector(".notice.good, .notice.alert") !== null || true, null, { timeout: 1000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: ms }).catch(() => {});
  await new Promise((r) => setTimeout(r, 800));
}

async function adminSignIn(page, email) {
  await page.goto(`${BASE}/admin/sign-in`);
  await page.fill("#identifier", email);
  await page.click("form:has(#identifier) button[type=submit]");
  await page.waitForSelector("#code", { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 500));
  const code = latestOtpFor(email);
  await page.fill("#code", code);
  await Promise.all([page.waitForURL(/\/admin(\/|$|\?)/, { timeout: 20000 }), page.click("form:has(#code) button[type=submit]")]);
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForFunction(() => location.pathname === "/admin/security" || document.querySelector(".dash-nav") !== null, null, { timeout: 15000 }).catch(() => {});
  if (page.url().includes("/admin/security")) {
    // STAFF_MFA_REQUIRED: enrol an authenticator on first sign-in.
    await page.click('button:has-text("Set up authenticator")');
    await page.waitForSelector("img[alt*='QR code']", { timeout: 15000 });
    const key = (await page.locator(".mono").filter({ hasText: /^[A-Z2-7 ]{20,}$/ }).first().innerText()).replace(/\s+/g, "");
    await page.fill('input[name="code"]', totp(key));
    await Promise.all([page.waitForURL(/\/admin\?mfa=enrolled/, { timeout: 20000 }), page.click('button:has-text("Confirm and finish")')]);
    ok("mfa: staff enrolled an authenticator and passed the first code", true);
    globalThis.__adminTotpKey = key;
  }
}

import { createHmac } from "node:crypto";
function totp(secretB32) {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0, val = 0; const bytes = [];
  for (const ch of secretB32.toUpperCase().replace(/[^A-Z2-7]/g, "")) { val = (val << 5) | A.indexOf(ch); bits += 5; if (bits >= 8) { bytes.push((val >>> (bits - 8)) & 255); bits -= 8; } }
  const msg = Buffer.alloc(8); msg.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
  const h = createHmac("sha1", Buffer.from(bytes)).update(msg).digest();
  const o = h[h.length - 1] & 15;
  return String((((h[o] & 127) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3]) % 1e6).padStart(6, "0");
}

const browser = await chromium.launch({ executablePath: process.env.E2E_CHROMIUM || undefined });
const shots = process.env.E2E_SHOTS_DIR ?? "tests/e2e/shots"; fs.mkdirSync(shots, { recursive: true });
const ctxPatient = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const ctxAdmin = await browser.newContext({ viewport: { width: 1380, height: 900 } });
const ctxDoctor = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const ctxAnon = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const patient = await ctxPatient.newPage();
const admin = await ctxAdmin.newPage();
const doctor = await ctxDoctor.newPage();

try {
  /* 1. Public profile page and the manage button */
  const [seedDoc] = await sql`select d.slug, d.name, d.id from doctors d where d.claimed = true and d.status='published' order by d.name limit 1`;
  await patient.goto(`${BASE}/doctor/${seedDoc.slug}`);
  const manageHref = await patient.getAttribute('a:has-text("Manage this profile")', "href");
  ok("profile: Manage this profile links to the dashboard", manageHref === "/dashboard", String(manageHref));
  await patient.screenshot({ path: `${shots}/01-profile.png`, fullPage: false });

  /* 2. Review requires sign-in */
  await patient.goto(`${BASE}/doctor/${seedDoc.slug}/review`);
  ok("review: anonymous visitor is asked to sign in", await patient.locator("#identifier").count() === 1);

  /* 3. Patient OTP sign-in, then submit a review with evidence */
  const patientEmail = "e2e.patient@example.com";
  await signIn(patient, patientEmail, `/doctor/${seedDoc.slug}/review`);
  ok("auth: OTP sign-in lands back on the review page", patient.url().includes(`/doctor/${seedDoc.slug}/review`), patient.url());
  await patient.locator('.stars[aria-label="communication"] label[title="5 of 5"]').click();
  await patient.locator('.stars[aria-label="explanation"] label[title="4 of 5"]').click();
  await patient.locator('.stars[aria-label="wait"] label[title="3 of 5"]').click();
  await patient.locator('.stars[aria-label="facility"] label[title="4 of 5"]').click();
  await patient.fill("#text", "Consulted for a recurring issue; the doctor listened, explained the plan clearly, and my number 9876543210 was noted for follow-up. Waited about 25 minutes.");
  const receipt = `${shots}/receipt.pdf`;
  fs.writeFileSync(receipt, "%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF");
  await patient.setInputFiles("#evidence", receipt);
  await patient.check('input[name="attest"]');
  await patient.locator("form:has(#text) button[type=submit], form:has(#note) button[type=submit], form:has(#about) button[type=submit]").first().click();
  await patient.waitForSelector(".notice.good, .notice.alert", { timeout: 20000 });
  const reviewMsg = await patient.locator(".notice.good, .notice.alert").first().innerText();
  ok("review: submitted with evidence", reviewMsg.startsWith("Done."), reviewMsg.slice(0, 120));
  await patient.screenshot({ path: `${shots}/02-review-submitted.png` });
  const [rv] = await sql`select id, status, evidence, risk_score, risk_flags from reviews where doctor_id = ${seedDoc.id} order by submitted_at desc limit 1`;
  ok("review: stored pending with evidence=supplied and phone flagged", rv?.status === "pending" && rv?.evidence === "supplied" && rv.risk_flags.includes("phone_number"), JSON.stringify(rv));

  /* 4. Patient submits an enquiry */
  await patient.goto(`${BASE}/doctor/${seedDoc.slug}/enquire`);
  await patient.fill("#note", "Would like a first consultation this week.");
  await patient.check('input[name="consent"]');
  await patient.locator("form:has(#text) button[type=submit], form:has(#note) button[type=submit], form:has(#about) button[type=submit]").first().click();
  await patient.waitForSelector(".notice.good, .notice.alert", { timeout: 20000 });
  ok("enquiry: submitted", (await patient.locator(".notice.good").count()) === 1);

  /* 5. Patient submits a new doctor profile (add-doctor flow) */
  await patient.goto(`${BASE}/add-doctor`);
  await patient.fill("#reg", "KMC-E2E-77123").catch(async () => patient.fill('input[name="registration"], #registration', "KMC-E2E-77123"));
  await patient.click('button:has-text("Check the register")');
  await patient.waitForSelector('button:has-text("Continue")', { timeout: 15000 });
  await patient.click('button:has-text("Continue")');
  await patient.fill("#name", "E2E Testdoctor");
  await patient.selectOption("#spec", "cardiology");
  await patient.fill("#start", "2012");
  await patient.fill("#languages", "English, Kannada");
  await patient.fill("#about", "Consultant cardiologist focused on hypertension review, preventive cardiology and post-angioplasty follow-up. Practises at a single clinic in Indiranagar on weekday mornings.");
  await patient.fill("#services", "ECG, Echocardiography, Hypertension review");
  await patient.fill("#facility", "E2E Heart Clinic");
  await patient.fill("#address", "12, 100 Feet Road");
  await patient.fill("#postal", "560038");
  await patient.fill("#days", "Mon–Fri");
  await patient.fill("#hours", "09:00–13:00");
  await patient.fill("#fee", "800");
  await patient.fill("#phone", "+91 80 4000 1234");
  await patient.check('input[name="c_publish"]');
  await patient.check('input[name="c_accurate"]');
  await patient.locator("form:has(#text) button[type=submit], form:has(#note) button[type=submit], form:has(#about) button[type=submit]").first().click();
  await patient.waitForSelector("text=Submitted for verification", { timeout: 20000 });
  ok("add-doctor: submission accepted", true);
  await patient.screenshot({ path: `${shots}/03-submission.png` });

  /* 6. Admin signs in and works the queues */
  await adminSignIn(admin, "admin@thedoctorindex.in");
  ok("admin: super admin signed in", admin.url().includes("/admin"), admin.url());
  await admin.screenshot({ path: `${shots}/04-admin-overview.png` });

  // approve submission
  await admin.goto(`${BASE}/admin/submissions`);
  const card = admin.locator(".qcard", { hasText: "E2E Testdoctor" }).first();
  ok("admin: submission visible in queue", (await card.count()) === 1);
  await card.locator('input[name="verify"]').check().catch(() => {});
  await card.locator('input[name="note"]').fill("Matched in KMC register (e2e)");
  await card.locator("button[type=submit]").click();
  await settle(admin);
  const [newDoc] = await sql`select id, slug, status, claimed, quality_score from doctors where name = 'E2E Testdoctor'`;
  ok("admin: approval created a published, claimed profile", newDoc?.status === "published" && newDoc?.claimed === true, JSON.stringify(newDoc));

  // review moderation: evidence + publish redacted
  await admin.goto(`${BASE}/admin/reviews`);
  const rcard = admin.locator(".qcard", { hasText: "9876543210" }).first();
  ok("admin: pending review appears with risk flags", (await rcard.count()) === 1 && (await rcard.locator("text=phone_number").count()) === 1);
  const fileLink = await rcard.locator('a:has-text("Open document")').getAttribute("href");
  const fileResp = await ctxAdmin.request.get(BASE + fileLink);
  ok("admin: private evidence file downloadable by staff", fileResp.status() === 200 && (fileResp.headers()["content-type"] || "").includes("pdf"), `${fileResp.status()} ${fileResp.headers()["content-type"]}`);
  const anonFile = await ctxPatient.request.get(BASE + fileLink, { maxRedirects: 0 });
  ok("admin: evidence file refused for non-staff", anonFile.status() === 307 || anonFile.status() === 404, String(anonFile.status()));
  await rcard.locator('select[name="outcome"]').selectOption("checked");
  await rcard.locator('button:has-text("Record evidence decision")').click();
  await settle(admin);
  await admin.goto(`${BASE}/admin/reviews`);
  const rcard2 = admin.locator(".qcard", { hasText: "9876543210" }).first();
  await rcard2.locator('select[name="decision"]').selectOption("redacted");
  await rcard2.locator('input[name="reason"]').fill("phone_number redacted");
  await rcard2.locator('textarea[name="publishedText"]').fill("Consulted for a recurring issue; the doctor listened, explained the plan clearly, and my number was noted for follow-up. Waited about 25 minutes.");
  await rcard2.locator('button:has-text("Apply decision")').click();
  await settle(admin);
  const [rv2] = await sql`select status, evidence, published_text from reviews where id = ${rv.id}`;
  ok("admin: review published redacted with evidence checked", rv2.status === "redacted" && rv2.evidence === "checked" && !rv2.published_text.includes("9876543210"), JSON.stringify(rv2));
  await patient.goto(`${BASE}/doctor/${seedDoc.slug}`);
  const publicHasPhone = (await patient.content()).includes("9876543210");
  const publicHasReview = (await patient.content()).includes("my number was noted for follow-up");
  ok("public: redacted review visible, phone number absent", publicHasReview && !publicHasPhone);

  // create a doctor directly from the admin panel
  await admin.goto(`${BASE}/admin/doctors/new`);
  await admin.fill('input[name="registration"]', "KMC-STAFF-5501");
  await admin.check('input[name="regVerified"]');
  await admin.fill('input[name="name"]', "Staffmade Example");
  await admin.selectOption('select[name="specialty"]', "dermatology");
  await admin.fill('input[name="start"]', "2010");
  await admin.fill('textarea[name="about"]', "Dermatologist with a clinic practice in Koramangala covering acne, eczema and psoriasis. Weekday evenings; walk-ins are not taken.");
  await admin.fill('input[name="services"]', "Acne treatment, Eczema care, Psoriasis management");
  await admin.fill('input[name="q0_degree"]', "MBBS");
  await admin.fill('input[name="q0_inst"]', "Bangalore Medical College");
  await admin.fill('input[name="q0_year"]', "2004");
  await admin.check('input[name="q0_verified"]');
  await admin.fill('input[name="facility"]', "Skin Clinic Koramangala");
  await admin.selectOption('select[name="locality"]', "koramangala");
  await admin.fill('input[name="address"]', "5th Block, 80 Feet Road");
  await admin.fill('input[name="postal"]', "560095");
  await admin.fill('input[name="days"]', "Mon–Sat");
  await admin.fill('input[name="hours"]', "17:00–20:00");
  await admin.fill('input[name="fee"]', "700");
  await admin.fill('input[name="phone"]', "+91 80 4111 2222");
  await admin.check('input[name="practiceConfirmed"]');
  await admin.check('input[name="publish"]');
  await Promise.all([admin.waitForURL(/\/admin\/doctors\/[0-9a-f-]+\?created=1/, { timeout: 20000 }), admin.click('button:has-text("Create profile")')]);
  ok("admin: staff-created profile redirects to its record", true, admin.url());
  await admin.screenshot({ path: `${shots}/05-admin-doctor.png`, fullPage: true });
  const [staffDoc] = await sql`select id, slug, status, quality_score from doctors where name = 'Staffmade Example'`;
  ok("admin: staff-created profile is published with a computed score", staffDoc?.status === "published" && staffDoc.quality_score > 0, JSON.stringify(staffDoc));

  // edit a field + change status from the record page
  await admin.fill('textarea[name="about"]', "Dermatologist with a clinic practice in Koramangala covering acne, eczema, psoriasis and hair loss. Weekday evenings; walk-ins are not taken.");
  await admin.fill('input[name="reason"]', "e2e edit");
  await admin.locator('form:has(textarea[name="about"]) button[type=submit]').click();
  await settle(admin);
  const [aud] = await sql`select count(*)::int as n from audit_logs where entity_id = ${staffDoc.id}`;
  ok("admin: field edit audited", aud.n >= 2, `${aud.n} audit rows`);

  // SEO recompute
  await admin.goto(`${BASE}/admin/seo`);
  await admin.click('button:has-text("Recompute")');
  await admin.waitForLoadState("networkidle");
  const seoRows = await admin.locator("table tbody tr").count();
  ok("admin: SEO routes recomputed", seoRows >= 30, `${seoRows} routes`);

  // staff management
  await admin.goto(`${BASE}/admin/staff`);
  await admin.fill('input[name="email"]', "moderator@thedoctorindex.in");
  await admin.fill('input[name="name"]', "Mod Erator");
  await admin.check('input[name="roles"][value="review_moderator"]');
  await admin.locator('form:has(input[name="email"]) button[type=submit]').click();
  await settle(admin);
  const [mod] = await sql`select roles, active from staff_members sm join users u on u.id = sm.user_id where u.email = 'moderator@thedoctorindex.in'`;
  ok("admin: staff member created with role", mod?.roles?.includes("review_moderator"), JSON.stringify(mod));

  // enquiry queue
  await admin.goto(`${BASE}/admin/enquiries`);
  ok("admin: enquiry in queue", (await admin.locator("table tbody tr", { hasText: "first consultation" }).count()) === 1);
  // audit log page renders
  await admin.goto(`${BASE}/admin/audit`);
  ok("admin: audit log renders", (await admin.locator(".qcard").count()) > 5);
  await admin.goto(`${BASE}/admin/taxonomy`);
  ok("admin: taxonomy renders", (await admin.content()).includes("Cardiology"));

  /* 7. Doctor dashboard: the submitter now owns the new profile */
  await signIn(doctor, patientEmail, "/dashboard");
  ok("dashboard: approved submitter lands on their dashboard", doctor.url().includes("/dashboard") && !doctor.url().includes("no-profile"), doctor.url());
  await doctor.goto(`${BASE}/dashboard/profile`);
  await doctor.fill('input[name="languages"]', "English, Kannada, Hindi");
  await doctor.fill('input[name="name"]', "E2E Testdoctor Renamed");
  await doctor.locator('form:has(input[name="languages"]) button[type=submit]').first().click();
  await doctor.waitForSelector(".notice", { timeout: 20000 });
  await doctor.screenshot({ path: `${shots}/06-dashboard-profile.png`, fullPage: true });
  const [after] = await sql`select name, languages from doctors where id = ${newDoc.id}`;
  const [chg] = await sql`select field, status, sensitive from profile_change_requests where doctor_id = ${newDoc.id} and field = 'name'`;
  ok("dashboard: non-sensitive field applied immediately", after.languages.includes("Hindi"), JSON.stringify(after.languages));
  ok("dashboard: name change queued as a sensitive change request", after.name === "E2E Testdoctor" && chg?.status === "pending", JSON.stringify({ name: after.name, chg }));

  // admin approves the name change → slug redirect
  await admin.goto(`${BASE}/admin/changes`);
  const ccard = admin.locator(".qcard", { hasText: "E2E Testdoctor" }).first();
  await ccard.locator('input[name="note"]').fill("matches register");
  await ccard.locator("button[type=submit]").click();
  await settle(admin);
  const [renamed] = await sql`select name, slug from doctors where id = ${newDoc.id}`;
  const [redir] = await sql`select from_path, to_path from slug_redirects where to_path like ${"%" + renamed.slug}`;
  ok("admin: name change published with slug redirect", renamed.name === "E2E Testdoctor Renamed" && redir?.from_path?.includes(newDoc.slug), JSON.stringify({ renamed, redir }));
  const oldUrl = await ctxPatient.request.get(`${BASE}/doctor/${newDoc.slug}`, { maxRedirects: 0 });
  ok("public: old profile URL 308s to the new slug", (oldUrl.status() === 301 || oldUrl.status() === 308) && String(oldUrl.headers()["location"]).endsWith(renamed.slug), `${oldUrl.status()} → ${oldUrl.headers()["location"]}`);
  const missing = await ctxPatient.request.get(`${BASE}/doctor/nobody-here-zzzzzz`, { maxRedirects: 0 });
  ok("public: unknown profile slug is a real 404", missing.status() === 404, String(missing.status()));

  // doctor replies to the review on the seed doctor? (seedDoc is owned by another user) — skip; instead test claim flow
  /* 8. Claim flow on an unclaimed profile */
  const [unclaimed] = await sql`select d.slug, d.id, m.number from doctors d join medical_registrations m on m.doctor_id = d.id where d.claimed = false and d.status = 'published' limit 1`;
  const ctxClaim = await browser.newContext();
const claimant = await ctxClaim.newPage();
await signIn(claimant, "e2e.claimant@example.com", `/doctor/${unclaimed.slug}`);
  await claimant.goto(`${BASE}/doctor/${unclaimed.slug}`);
  const claimHref = await claimant.getAttribute('a:has-text("Claim this profile")', "href");
  ok("profile: unclaimed profile routes Manage to the claim flow", String(claimHref).startsWith("/claim-profile"), String(claimHref));
  await claimant.goto(BASE + claimHref);
  await claimant.fill("#reg", unclaimed.number);
  await claimant.check('input[name="method"][value="practice_otp"]');
  await claimant.click("form:has(#reg) button[type=submit]");
  await claimant.waitForSelector(".notice.good, .notice.alert", { timeout: 20000 });
  const [claim] = await sql`select status from doctor_claims where doctor_id = ${unclaimed.id} order by created_at desc limit 1`;
  ok("claim: recorded as pending", claim?.status === "pending", JSON.stringify(claim));

  /* 9. Sign-out and access control */
  await admin.goto(`${BASE}/admin`);
  await admin.click('button:has-text("Sign out")');
  await admin.waitForLoadState("networkidle");
  const afterOut = await ctxAdmin.request.get(`${BASE}/admin`, { maxRedirects: 0 });
  ok("auth: signed-out admin is redirected", afterOut.status() === 307, String(afterOut.status()));
  const patientAdmin = await ctxPatient.request.get(`${BASE}/admin`, { maxRedirects: 0 });
  const patientAdminBody = await patientAdmin.text();
  ok("auth: patient session cannot read admin pages", !patientAdminBody.includes("published profiles"), String(patientAdmin.status()));

  /* 10. New: gated contact, theme, header, for-doctors, account, near me */
  const [{ slug: listSlug }] = await sql`select slug from specialties where key='cardiology'`;
  const listing = `${BASE}/doctors/karnataka/bengaluru/${listSlug}`;
  const anonHtml = await (await ctxAnon.request.get(listing)).text();
  const [{ phone: anyPhone }] = await sql`select phone from doctor_practices where phone is not null limit 1`;
  ok("contact: practice phone absent from public listing HTML", !anonHtml.includes(anyPhone.replace(/[^\d+]/g, "")) && !anonHtml.includes(anyPhone), anyPhone);
  const profHtml = await (await ctxAnon.request.get(`${BASE}/doctor/${seedDoc.slug}`)).text();
  ok("contact: practice phone absent from public profile HTML and JSON-LD", !profHtml.includes('"telephone"') && !/\+91 80 \d{4} \d{4}/.test(profHtml));
  const anonPage = await ctxAnon.newPage();
  await anonPage.goto(listing);
  const callHref = await anonPage.locator(".row .act a:has-text('Call practice')").first().getAttribute("href");
  ok("contact: anonymous Call practice goes to sign-in", String(callHref).startsWith("/sign-in?next="), String(callHref));
  ok("contact: anonymous Directions goes to sign-in", String(await anonPage.locator(".row .act a:has-text('Directions')").first().getAttribute("href")).startsWith("/sign-in"));
  const [{ id: anyPractice }] = await sql`select p.id from doctor_practices p join doctors d on d.id=p.doctor_id where d.status='published' and p.active and p.phone is not null limit 1`;
  const anonContact = await ctxAnon.request.get(`${BASE}/api/contact/${anyPractice}`);
  ok("contact: API refuses anonymous", anonContact.status() === 401, String(anonContact.status()));
  // signed-in patient
  await patient.goto(listing);
  await patient.waitForSelector(".row .act button:has-text('Call practice')", { timeout: 15000 });
  await patient.locator(".row .act button:has-text('Call practice')").first().click();
  await patient.waitForSelector(".row .act a[href^='tel:']", { timeout: 15000 });
  const tel = await patient.locator(".row .act a[href^='tel:']").first().getAttribute("href");
  ok("contact: signed-in patient gets the number on click", String(tel).startsWith("tel:+91"), String(tel));
  const [{ n: callEvents }] = await sql`select count(*)::int as n from events where kind='call_clicked'`;
  ok("contact: release counted as a call event", callEvents >= 1, `${callEvents}`);
  // header + theme
  ok("header: account menu shows Dashboard for the (now approved) doctor account", (await patient.locator(".hnav a:has-text('Dashboard')").count()) === 1);
  await claimant.goto(listing);
  await claimant.waitForSelector(".hnav a:has-text('My account')", { timeout: 10000 }).catch(() => {});
  ok("header: account menu shows My account for a patient", (await claimant.locator(".hnav a:has-text('My account')").count()) === 1);
  const forDoctors = await anonPage.locator(".hnav a.cta").getAttribute("href");
  ok("header: For doctors goes to the landing page", forDoctors === "/for-doctors", String(forDoctors));
  ok("header: Sign in link for anonymous", (await anonPage.locator(".hnav a:has-text('Sign in')").count()) === 1);
  await anonPage.locator(".hnav .themebtn").click();
  const themeAttr1 = await anonPage.evaluate(() => document.documentElement.getAttribute("data-theme"));
  await anonPage.locator(".hnav .themebtn").click();
  const themeAttr2 = await anonPage.evaluate(() => document.documentElement.getAttribute("data-theme"));
  await anonPage.reload();
  const themeAttr3 = await anonPage.evaluate(() => document.documentElement.getAttribute("data-theme"));
  ok("theme: toggle cycles auto → light → dark and persists across reload", themeAttr1 === "light" && themeAttr2 === "dark" && themeAttr3 === "dark", `${themeAttr1},${themeAttr2},${themeAttr3}`);
  await anonPage.locator(".hnav .themebtn").click();
  ok("theme: back to auto removes the attribute", (await anonPage.evaluate(() => document.documentElement.getAttribute("data-theme"))) === null);
  await anonPage.screenshot({ path: `${shots}/07-listing-anon.png` });
  // for-doctors + account
  await anonPage.goto(`${BASE}/for-doctors`);
  ok("for-doctors: page renders with dashboard sign-in", (await anonPage.locator(".tile a:has-text('Sign in')").first().getAttribute("href"))?.includes("next=%2Fdashboard") === true);
  await patient.goto(`${BASE}/account`);
  ok("account: patient sees their review and enquiry", (await patient.content()).includes("Your reviews") && (await patient.locator(".qcard").count()) >= 1);
  await patient.screenshot({ path: `${shots}/08-account.png`, fullPage: true });
  const anonAccount = await ctxAnon.request.get(`${BASE}/account`, { maxRedirects: 0 });
  ok("account: anonymous is redirected to sign-in", anonAccount.status() === 307);
  // near me
  const ctxGeo = await browser.newContext({ geolocation: { latitude: 12.9784, longitude: 77.6408 }, permissions: ["geolocation"] });
  const geo = await ctxGeo.newPage();
  await geo.goto(listing);
  await geo.locator("button:has-text('Near me')").click();
  await geo.waitForURL(/near=12\.978(,|%2C)77\.641/, { timeout: 15000 });
  const firstDist = await geo.locator(".row .meta .dist").first().innerText();
  const firstLoc = await geo.locator(".row .meta").first().innerText();
  ok("near me: results re-sorted by distance with km shown", /away/.test(firstDist) && firstLoc.includes("Indiranagar"), `${firstDist} | ${firstLoc.split("\n")[1]}`);
  ok("near me: banner shows and view is noindex", (await geo.locator(".nearme.on").count()) === 1 && (await geo.content()).includes('name="robots" content="noindex'));
  await geo.screenshot({ path: `${shots}/09-near-me.png` });
  await geo.goto(`${BASE}/search?q=cardiologist`);
  await geo.waitForSelector("a:has-text('Use last location')", { timeout: 10000 });
  await geo.locator("a:has-text('Use last location')").click();
  await geo.waitForURL(/near=/, { timeout: 15000 });
  ok("near me: search page honours the remembered location", (await geo.locator(".row .meta .dist").count()) >= 1);

  /* 11. MFA gate, photo upload, notifications, maintenance, manual geo */
  const adminCtx2 = await browser.newContext();
  const admin2 = await adminCtx2.newPage();
  await admin2.goto(`${BASE}/admin/sign-in`);
  await admin2.fill("#identifier", "admin@thedoctorindex.in");
  await admin2.click("form:has(#identifier) button[type=submit]");
  await admin2.waitForSelector("#code", { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 500));
  await admin2.fill("#code", latestOtpFor("admin@thedoctorindex.in"));
  await Promise.all([admin2.waitForURL(/\/admin\/mfa/, { timeout: 20000 }), admin2.click("form:has(#code) button[type=submit]")]);
  const gated = await adminCtx2.request.get(`${BASE}/admin/doctors`, { maxRedirects: 0 });
  ok("mfa: second session is held at the authenticator step, console not served", admin2.url().includes("/admin/mfa") && gated.status() === 307, `${gated.status()}`);
  await admin2.fill('input[name="code"]', "000000");
  await admin2.click('button:has-text("Continue")');
  await admin2.waitForSelector(".notice.alert", { timeout: 15000 });
  await admin2.fill('input[name="code"]', totp(globalThis.__adminTotpKey));
  await Promise.all([admin2.waitForURL((u) => u.pathname.startsWith("/admin") && !u.pathname.startsWith("/admin/mfa"), { timeout: 20000 }), admin2.click('button:has-text("Continue")')]);
  ok("mfa: wrong code rejected, right code opens the console", !admin2.url().includes("/admin/mfa"), admin2.url());

  // photo upload from the doctor dashboard (sharp → webp, served only with consent)
  const sharp = (await import("sharp")).default;
  await sharp({ create: { width: 640, height: 800, channels: 3, background: { r: 120, g: 90, b: 70 } } }).png().toFile(`${shots}/face.png`);
  await doctor.goto(`${BASE}/dashboard/profile`);
  await doctor.setInputFiles('input[name="photo"]', `${shots}/face.png`);
  await doctor.check('form:has(input[name="photo"]) input[name="consent"]');
  await doctor.locator('form:has(input[name="photo"]) button[type=submit]').click();
  await doctor.waitForSelector(".notice.good", { timeout: 20000 });
  const [ph] = await sql`select photo_file_id, photo_consent from doctors where id = ${newDoc.id}`;
  const photoResp = await ctxAnon.request.get(`${BASE}/photos/${ph.photo_file_id}`);
  ok("photo: uploaded, converted to webp and publicly served", ph.photo_consent && photoResp.status() === 200 && photoResp.headers()["content-type"] === "image/webp", `${photoResp.status()} ${photoResp.headers()["content-type"]}`);
  await doctor.goto(`${BASE}/doctor/${renamed.slug}`);
  ok("photo: appears on the public profile", (await doctor.locator(`.av img[src="/photos/${ph.photo_file_id}"]`).count()) >= 1);
  await doctor.goto(`${BASE}/dashboard/profile`);
  await doctor.locator('form:has(input[name="remove"]) button[type=submit]').click();
  await settle(doctor);
  const gone = await ctxAnon.request.get(`${BASE}/photos/${ph.photo_file_id}`);
  ok("photo: removal makes the URL 404", gone.status() === 404, String(gone.status()));

  // notifications went out (console mailer writes to the server log)
  const log = fs.readFileSync(LOG, "utf8");
  ok("notify: submitter emailed on approval", /Your profile is live/.test(log));
  ok("notify: reviewer emailed on redaction", /lightly edited/.test(log));
  ok("notify: doctor emailed on enquiry", /New appointment enquiry/.test(log));

  // maintenance endpoint refuses without the secret
  const cronNo = await ctxAnon.request.get(`${BASE}/api/cron/maintenance`);
  ok("cron: maintenance refuses without CRON_SECRET", cronNo.status() === 401, String(cronNo.status()));
  if (process.env.CRON_SECRET) {
    const cronYes = await ctxAnon.request.get(`${BASE}/api/cron/maintenance`, { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } });
    ok("cron: maintenance runs with the secret", cronYes.status() === 200 && (await cronYes.json()).seoRoutes >= 30, String(cronYes.status()));
  }

  // manual coordinates from the admin practice form feed near-me exactly
  await admin2.goto(`${BASE}/admin/doctors/${staffDoc.id}`);
  await admin2.fill('form:has(input[name="geo"]) input[name="geo"]', "12.9352,77.6245");
  await admin2.locator('form:has(input[name="geo"]) button[type=submit]').first().click();
  await settle(admin2);
  const [fac] = await sql`select f.lat, f.lng, f.geocode_source from facilities f join doctor_practices p on p.facility_id = f.id where p.doctor_id = ${staffDoc.id} limit 1`;
  ok("geo: manual coordinates saved with source=manual", fac.lat === "12.9352" && fac.geocode_source === "manual", JSON.stringify(fac));
} catch (e) {
  console.error("E2E ERROR", e);
  await admin.screenshot({ path: `${shots}/err-admin.png`, fullPage: true }).catch(() => {});
  await patient.screenshot({ path: `${shots}/err-patient.png`, fullPage: true }).catch(() => {});
  await doctor.screenshot({ path: `${shots}/err-doctor.png`, fullPage: true }).catch(() => {});
  results.push({ name: "script completed", pass: false, detail: String(e.message) });
} finally {
  await browser.close();
  await sql.end();
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  fs.writeFileSync(`${shots}/results.json`, JSON.stringify(results, null, 2));
  process.exit(failed.length ? 1 : 0);
}
