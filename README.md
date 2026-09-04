# The Doctor Index

A verified doctor directory for India. This repository is the **front-end application**: the public
site, its indexation rules, and a typed data layer that a real directory API can drop into.

Built from the project plan dated 4 September 2026. Bengaluru launch cluster, four specialities.

---

## What this repository is

The whole product surface and its back office, in one Next.js 15 application:

- **Public site** (plan §5.1): search, city/locality × speciality listings behind supply gates,
  doctor profiles with per-claim verification labels, health guides, policies — with the SEO
  architecture actually implemented: per-route metadata, gate-driven `noindex`, split sitemaps that
  agree with the gates, a route allowlist with staff overrides, 301/308 redirects for renamed and
  merged profiles, real 404s, and schema that switches on claim status.
- **Accounts** (§5.2): passwordless one-time-code sign-in for patients, doctors and staff (email
  now; SMS through the same interface). Patients get `/account`; doctors get `/dashboard` (profile,
  practices, reviews and replies, enquiries, analytics, verification, team); staff get `/admin`.
- **Admin console** (§5.3): submissions, claims, sensitive change requests, review moderation with
  risk scoring and private evidence, reports and corrections, enquiries, full doctor CRUD
  (staff-created profiles, registration and qualification checks, practices, status, merge),
  taxonomy, SEO routes, staff roles, and an append-only audit log of every write.
- **Data layer**: Drizzle ORM over PostgreSQL (Neon in production). A seed of 24 fictional doctors
  and a bootstrap super-admin, plus a **seed mode** that builds and runs the public site with no
  database at all (`DATA_SOURCE=seed`, or simply no `DATABASE_URL`).

**The seed data is fictional.** Every doctor, registration number, facility, college and review in
`lib/data/doctors.ts` was invented to exercise the design. No real practitioner is represented. A
banner says so on every page; remove it when real records land.

---

## Running it

```bash
npm install
cp .env.example .env.local      # then set the variables below
npm run db:migrate              # apply lib/db/migrations to DATABASE_URL
npm run db:seed                 # taxonomy, 24 fictional doctors, bootstrap admin
npm run dev                     # http://localhost:3000
npm run build && npm start      # production
npm run typecheck               # tsc --noEmit
```

Minimum `.env.local` for a database-backed run:

```
DATABASE_URL=postgresql://…                # Neon: the pooled URL with sslmode=require
AUTH_SECRET=<openssl rand -base64 48>      # signs the session cookie; required in production
CONTACT_HASH_PEPPER=<random string>        # hashes OTP codes and contact identifiers
STAFF_BOOTSTRAP_ADMIN_EMAIL=you@yourdomain # first super administrator, created by db:seed
EMAIL_PROVIDER=console                     # resend | postmark for real mail; console prints codes
NEXT_PUBLIC_SITE_URL=https://yourdomain
```

For a local Postgres without TLS add `DATABASE_SSL=disable`. `npm run db:reset` drops the schema and
refuses to run unless `DATABASE_ALLOW_DESTRUCTIVE_MIGRATIONS=1` and `APP_ENV` is not production.
Never commit `.env.local`; rotate any database password that has ever been pasted into a chat.

Sign in at `/admin/sign-in` with the bootstrap email. With `EMAIL_PROVIDER=console` the one-time
code is printed in the server log. Doctors and patients sign in at `/sign-in` and are routed by
role. The seed's claimed doctors have accounts `<firstname-lastname>@doctors.example`.

`.env.example` is the full provisioning list for the plan's architecture. Each variable is tagged
**[READ]** (consumed by `lib/env.ts`, the auth/mail/rate-limit modules or `next.config.ts`) or
**[RESERVED]** (named for the service it belongs to, not yet consumed).

---

## The backend, in one screen

| Concern | Where | Notes |
| --- | --- | --- |
| Schema | `lib/db/schema.ts`, `lib/db/migrations/` | Drizzle; `drizzle-kit generate` after schema edits. PostGIS/pg_trgm indexes are applied when available and skipped otherwise. |
| Sessions | `lib/auth/` | OTP hashed with a pepper, 5 attempts, per-contact and per-IP limits; HS256 JWT cookie carrying a server-side session id so sign-out and deactivation revoke immediately. |
| Guards | `requireUser`, `requireDoctor`, `requireStaff(...roles)` | Called **inside every page**, not only layouts — Next renders layouts and pages in parallel, so a layout check alone would stream page data to strangers. Middleware adds a cheap cookie gate on `/admin`, `/dashboard`, `/account`. |
| Data reads | `lib/data/index.ts` → `db-source.ts` or `seed-source.ts` | Public pages consume only this facade. |
| Writes | `lib/services/*` | Every write goes through a service that records an `audit_logs` row (actor, before, after, reason). Profile edits snapshot a revision and recompute the quality score. |
| Field grammar | `lib/services/doctors.ts#applyField` | `name`, `about`, `practice.<id>.hours`, `facility.<id>.address` … Sensitive fields (name, gender, speciality, registration, qualification) become change requests that a verification officer publishes; everything else publishes on save. |
| Accounts | `app/account/setup`, `lib/auth/session.ts#requireUser` | One-time code creates the account; before it can enquire, review, submit, claim or manage anything it must complete registration once — full name, mobile, email, locality, terms — and every guarded page/action checks `profileComplete`. Details are editable on `/account`; the sign-in channel is fixed. |
| Reviews | `lib/services/reviews.ts` | Registered account required; one per person per doctor; **proof of consultation is mandatory** (prescription, bill/receipt, appointment record — stored private, purged after `RETENTION_REVIEW_EVIDENCE_DAYS`). Publication is blocked until a moderator records the proof as valid; a rejected proof rejects the review. Automated risk flags prioritise the queue; a person decides. `REVIEW_EVIDENCE_REQUIRED=0` relaxes this for demos only. |
| Contact gating | `app/api/contact/[practice]` | Practice phone numbers are not in public HTML, RSC payloads, sitemaps or JSON-LD. A signed-in person fetches them per practice, rate-limited per account, and each release is counted as a call/directions action for the doctor's analytics. |
| Near me | `lib/geo.ts`, `components/NearMe.tsx` | Browser geolocation with the browser's own consent prompt, rounded to ~100 m, passed as `?near=lat,lng` and never stored server-side. Facilities without their own coordinates use the locality centroid and are marked approximate (`~`). |
| Files | `lib/services/files.ts`, `app/admin/files/[id]` | Private bytes in Postgres for the MVP (JPEG EXIF stripped); `storage_key` is the seam for object storage. Staff-only download, audited. |
| SEO routes | `lib/services/seo.ts`, `/admin/seo` | Recomputed from live supply against the gates; `force_index`/`force_noindex` overrides carry a reason. |
| Rate limits | `lib/security/rate-limit.ts` | Fixed windows in Postgres; same interface for a Redis swap. |
| Staff MFA | `lib/auth/totp.ts`, `/admin/security`, `/admin/mfa` | RFC 6238 TOTP (any authenticator app), secret AES-GCM encrypted at rest. `STAFF_MFA_REQUIRED` (default on in production) forces enrolment before the console opens; an enrolled member is asked once per session. A super admin can reset a lost authenticator from Staff. |
| Notifications | `lib/services/notify.ts` | Plain-text transactional mail on every decision that concerns a person: submission, claim, change request, review, reply, manager invite, new review/enquiry for the doctor. Never health detail, never someone else's contact. |
| Photographs | `lib/services/photos.ts`, `/photos/[id]` | Doctor or staff upload with recorded consent; sharp re-encodes to 512 px WebP (drops EXIF/GPS); served only while the profile is published and consent stands. |
| Maintenance | `lib/services/maintenance.ts`, `/api/cron/maintenance`, `npm run db:maintenance` | Purges review evidence past its date, expired OTPs/sessions/rate windows, anonymises old enquiries, trims raw events, recomputes quality scores and SEO routes. `vercel.json` schedules it nightly; any scheduler can call it with `Authorization: Bearer $CRON_SECRET`. |
| Geocoding | `scripts/geocode.ts`, admin practice form | `npm run db:geocode` fills facility coordinates via Nominatim (no key) or Google (`GEOCODING_API_KEY`), writing source and confidence; staff can paste coordinates by hand. Until then "near me" uses the locality centroid, labelled `~`. |

---

## The part that matters: indexation

The plan's central rule is that the moat is a reliable structured database, not the number of URLs
we can generate. Three things must therefore never disagree: **which pages get built**, **what each
page tells crawlers**, and **which URLs get submitted**. They are all driven by the same pure
functions in `lib/seo/gates.ts`.

| Page type | Gate | Where it is enforced |
|---|---|---|
| Doctor profile | Quality score ≥ 70 **and** practice currently confirmed | `robots` in `generateMetadata`, and membership of `sitemaps/doctors.xml` |
| City × speciality | ≥ 3 indexable doctors + original guidance | same |
| Locality × speciality | ≥ 5 indexable doctors + original guidance | same |
| National speciality | ≥ 3 indexable doctors + original guidance | same |
| Any filtered / sorted view | Never indexable | `hasFacetParams()` forces `noindex, follow`; canonical stays on the unfiltered URL |
| Internal search, claim and submission flows | Never indexable | page `robots` + `app/robots.ts` |
| Invalid speciality/location combination | No page at all | `notFound()` → genuine 404, never a soft empty listing |

Two deliberate distinctions:

- **Built ≠ indexed.** `generateStaticParams` prerenders every *valid* combination so patients get a
  fast page. Whether it is *submitted to Google* is the gate's decision. A locality page below
  threshold serves normally to anyone who reaches it and carries `noindex`.
- **`Disallow` ≠ `noindex`.** `robots.txt` blocks whole areas that must never be crawled. It is never
  used to keep a thin page out of the index, because a disallowed URL can't be read and its
  `noindex` would never be seen.

### The route inspector

Every page renders a machine-readable `RouteMeta` block declaring what it told crawlers and why. The
inspector (bottom-right in development, or `?inspect=1` anywhere) renders it: canonical, index rule,
the gate arithmetic behind that rule, structured-data type, and `lastmod` policy.

It is a debugging surface, not decoration. Because it reads the same gate output that produced the
meta tag and the sitemap entry, an indexation bug is visible in one click rather than one crawl.

Worth loading on:

- `/doctor/anand-deshpande-c4d660` — a stale unclaimed profile failing the quality gate
- `/doctors/karnataka/bengaluru/indiranagar/cardiologists` — a locality page below the supply gate
- `/doctors/karnataka/bengaluru/cardiologists?gender=F` — an indexable page turned into a facet

### Structured data

Three constraints, all in `lib/seo/structured-data.ts`:

1. `ProfilePage` is used **only** where the doctor is affiliated with and actively participates in
   the page — i.e. claimed. Unclaimed records get `WebPage`. Calling a page a profile does not earn
   the type.
2. **No `review` or `aggregateRating` markup on doctor pages.** Google's review snippet feature does
   not support a standalone `Person` the way it supports a qualifying local business. Promising
   stars on every doctor page would be selling something we cannot deliver.
3. Markup describes what is visible on the page, and nothing else.

---

## Layout

```
app/
  page.tsx                                   home
  doctors/                                   India → state → city browse hierarchy (closed places unlinked)
  doctors/[state]/[city]/[...segments]/      1 segment = city × speciality, 2 = locality × speciality
  doctor/[slug]/                             profile — ProfilePage vs WebPage on claim status
  doctor/[slug]/{review,report,correct,enquire}/  public action flows, noindex, canonical → profile
  specialties/ specialties/[specialty]/      index + national hub, addressed by speciality (cardiology)
  health-guides/ health-guides/[slug]/       editorial: named author + reviewer, Article schema
  about/  policies/[slug]/                   9 trust documents every badge links to
  search/                                    internal results, always noindex
  add-doctor/ claim-profile/                 registration-first flows, noindex+nofollow
  dashboard/sign-in/  dashboard/(app)/*      doctor dashboard: overview, profile, practices, reviews,
                                             analytics, verification, team — noindex, robots-disallowed
  sitemap.xml/ sitemaps/*.xml/               index + doctors / directory / editorial
  robots.ts  not-found.tsx  loading.tsx  error.tsx  globals.css
components/                                  view layer; RouteMeta + RouteInspector are the SEO surface
lib/
  types.ts        domain model, mirrors the plan's relational schema
  site.ts         origin + canonical path builders — nothing hand-writes a URL
  ranking.ts      published 35/20/15/10/10/10 model; no field exists for payment
  data/           taxonomy, policies, guides, dashboard seed, records, and the boundary in data/index.ts
  seo/            gates, structured data, sitemaps, redirect table
middleware.ts                                301s for renamed and merged slugs
```

The catch-all under `[city]` exists because Next.js will not accept two differently-named dynamic
segments at the same depth. Segment count decides which page it is.

---

## Seed mode and the data facade

`lib/data/index.ts` is the only boundary the public site reads through. With `DATABASE_URL` set
it is backed by Postgres (`db-source.ts`); without it, or with `DATA_SOURCE=seed`, by the 24
fictional records in `lib/data/doctors.ts` (`seed-source.ts`). Both are async and interchangeable,
which is what lets CI build the site with no database and lets the dashboard, admin and forms
degrade to read-only notices rather than crash.

`lib/types.ts` mirrors the plan's schema (§14); `lib/db/schema.ts` is its relational form.

---

## Deliberate product decisions carried into the code

- **"Verified", never "Best".** A best-of page needs a published methodology, a minimum review volume
  and recency criteria before it can be defended. We do not use the word.
- **Separate badges, never one tick.** Registration, qualification, practice confirmation, claim and
  HPR are five independent signals, each with its source and check date. Wording in
  `components/TrustBadges.tsx` and `/policies/verification` must change together.
- **Experience is computed from a stored start year**, labelled as supplied by the doctor. The
  registration year is never converted into an experience claim.
- **Payment is not a ranking input**, and `lib/ranking.ts` has no parameter for one. Every result can
  show its own score breakdown.
- **Review confidence uses a minimum-confidence discount**, so one five-star review cannot outrank
  sustained feedback.
- **Removed profiles 404**, merged ones 301 to their successor. Nothing redirects to the homepage.

---

## Tests

```bash
npm test          # unit: TOTP (RFC 6238 vectors), geo, SEO gates, review risk scoring, slugs
npm run test:e2e  # Playwright drive of the whole product through the real UI
```

The e2e run needs a built app and a throwaway database: start `npm start` with
`EMAIL_PROVIDER=console` and its stdout captured to a file, then run with `E2E_BASE_URL`,
`E2E_DATABASE_URL`, `E2E_SERVER_LOG` (one-time codes are read from that log) and optionally
`CRON_SECRET`. It covers OTP sign-in, review with evidence → moderation, enquiry, submission →
approval → dashboard edit → change request → publish → slug redirect, staff-created doctor, SEO
recompute, staff roles, claim, gated contact, theme, account page, near-me, MFA enrolment and
gate, photo upload/removal, notifications, the cron endpoint, manual geocoding, first-run registration (name, mobile, email, locality, terms; duplicate mobile refused) and the mandatory-evidence moderation gate — 75 checks.
It creates data; never point it at production.

Accessibility: axe-core (WCAG 2.2 AA rules) runs clean on the home, listing, profile, review,
sign-in, for-doctors, guides, policy, add-doctor and search pages in both themes.

---

## Known gaps

- **Fonts load from Google Fonts over `<link>`.** For production, switch to `next/font` self-hosting
  — the block is written out in `app/layout.tsx` and `globals.css` already reads both.
- **Geocoder untested against a live provider.** `scripts/geocode.ts` was written and dry-run, but
  the build environment could not reach Nominatim or Google; run `npm run db:geocode -- --dry`
  first on your side.
- **Verification sources are manual.** Registration and qualification checks are recorded by staff
  against the register; the `VERIFY_*` API variables are reserved for automated lookups.
- **Object storage.** Evidence and photos live in Postgres `bytea` for the MVP. Move to S3/R2 via
  `files.storage_key` before volume grows.
- **SMS OTP is a stub** until `SMS_PROVIDER=twilio` credentials (and DLT registration) exist.
- **Screen-reader pass.** Automated WCAG checks pass; a manual keyboard and screen-reader session is
  still a launch acceptance criterion in the plan.
- **Bengaluru only, four specialities.** The plan calls for 10–12 per launch city. Adding more is
  data in `lib/data/taxonomy.ts` (then `npm run db:seed`), not code.
