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
npm run db:seed                 # DEV ONLY: taxonomy + 24 fictional doctors + bootstrap admin
npm run dev                     # http://localhost:3000
npm run build && npm start      # production
npm run typecheck               # tsc --noEmit
```

Production database (no fictional records):

```bash
npm run db:migrate              # schema
npm run db:taxonomy             # speciality registry + launch-city localities, nothing else
npm run db:staff -- you@domain  # first super administrator, no fictional data
npm run db:import:drdata -- --file data/private/drdata.csv --dry   # check the mapping report
npm run db:import:drdata -- --file data/private/drdata.csv         # load, published + unverified
npm run db:maintenance          # SEO route allowlist, retention jobs
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

All of it is in `lib/seo/structured-data.ts`, and every entity that recurs (organisation, website,
physician, clinic) carries a stable `@id` so the graph joins up across pages.

| Page | JSON-LD |
|---|---|
| Every page | `Organization` (logo, support + grievance `ContactPoint`, `sameAs` from `NEXT_PUBLIC_SOCIAL_LINKS`) and `WebSite` (`publisher`, `SearchAction`) |
| Doctor profile | `ProfilePage` (claimed) or `WebPage` (unclaimed) → `mainEntity` typed `Person` + `IndividualPhysician`: `medicalSpecialty`, registration as `identifier`, verified degrees as `hasCredential`, `availableService`, `hospitalAffiliation` of `MedicalClinic`s with `PostalAddress`, `openingHoursSpecification` parsed from the practice hours, `geo` only when the facility itself was geocoded |
| City × speciality, locality × speciality | `CollectionPage` with `about` = the schema.org `MedicalSpecialty`, `spatialCoverage`, and an `ItemList` of the doctors shown |
| National speciality | `CollectionPage` + `MedicalWebPage` (`lastReviewed`, `medicalAudience`) listing the open city pages |
| Health guide | `MedicalWebPage` (`lastReviewed`, `reviewedBy`) → `mainEntity` `Article` (author, publisher, image, `timeRequired`) |
| City, specialities and guides hubs | `CollectionPage` + `ItemList` of the pages under them |
| All | `BreadcrumbList` |

Three constraints:

1. `ProfilePage` is used **only** where the doctor is affiliated with and actively participates in
   the page — i.e. claimed. Unclaimed records get `WebPage`. Calling a page a profile does not earn
   the type.
2. **No `review` or `aggregateRating` markup on doctor pages.** Google's review snippet feature does
   not support a standalone `Person` the way it supports a qualifying local business. Promising
   stars on every doctor page would be selling something we cannot deliver.
3. Markup describes what is visible on the page, and nothing else. Practice phones are gated behind
   sign-in on the page, so `telephone` is never emitted; photos appear only with usage consent.

### Titles, descriptions, Open Graph

`lib/seo/meta.ts › pageMeta()` builds the `<head>` for every public page. Next does not deep-merge
`openGraph`/`twitter` across layouts (a page that sets `openGraph.title` silently loses the root's
`siteName` and `locale`), so the helper emits the whole block each time: canonical, robots, a title
kept to 60 characters (the brand suffix shrinks to "Doctor Index" and then drops before the page
title is cut), a description trimmed to 155 on a word boundary, `og:*` with `type`, `siteName`,
`locale`, `url`, image, and `twitter:card=summary_large_image`. Auth and flow pages use
`privateMeta()` (noindex, nofollow, nocache).

Social cards are generated on the server with `next/og` (`lib/seo/og.tsx`): a site card at
`/opengraph-image`, and per-entity cards for doctors, specialities and guides
(`opengraph-image.tsx` in each route folder) and for listings (`/og/listing/…`, a route handler,
because a file-based image cannot sit under a catch-all segment). Cards show only what the page
shows — no phone, no photo, no ratings. `app/manifest.ts` and `app/icon.svg` complete the set;
`GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` emit the verification tags when set.

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

A deploy never depends on the database being ready. During `next build` only, `lib/db/readiness.ts`
checks once that `DATABASE_URL` answers and the schema is migrated; if not, the build logs one
warning and prerenders the pages that read the database (home, hubs, sitemaps, social cards)
from an empty source instead of failing. Every such page carries `revalidate = 3600`, so it
regenerates from the live database within an hour of the first request once migrations and the
import have run — or immediately on a redeploy. At runtime nothing is swallowed: a database error
is an error.

`lib/types.ts` mirrors the plan's schema (§14); `lib/db/schema.ts` is its relational form.

### Geography and specialities

Specialities are a static registry (`lib/data/specialties.ts`, 43 entries, mirrored into the
`specialties` table by `npm run db:taxonomy`). Four carry medically reviewed guidance and can
index; the rest are open for profiles and browsing but their hub and listing pages stay `noindex`
until a reviewer signs the text off — the gate reads `specialty.guide`, not a flag.

Geography is data: `localities` rows carry state → city → locality, and `lib/data/geo.ts` builds the
registry (states, cities, lookups) from them, cached a minute in-process. Opening a city is a data
change. Forms use `components/PlacePicker.tsx` (state → city → locality selects fed by
`/api/places`); a place typed as "another city/locality" is created on first use by
`lib/services/places.ts`. `NEXT_PUBLIC_DEFAULT_*` names the launch city for header/footer links.

At scale (tens of thousands of profiles) nothing loads "all doctors": listings are one capped
query per (speciality, place) hydrated by primary key (`lib/data/db-source.ts`), counts are GROUP BY
queries over the same indexable predicate the gates use, and doctor/city/state pages render on
demand with hourly revalidation instead of being prerendered.

### Importing doctors in bulk

Two importers, both provenance-first, both idempotent:

- `npm run db:import -- --file your.csv --source "<dataset>" [--dry] [--publish]` — generic CSV
  (template: `data/import-template.csv`). Every row needs a `source_url`; rows import as drafts.
- `npm run db:import:drdata -- --file data/private/drdata.csv [--dry] [--limit N] [--status draft]` —
  the DrData archive export. Maps DrData specialities onto the registry (`sourceLabels`), creates
  the geography it needs, and publishes each record **unclaimed and unverified**: registration
  and qualifications are stored as supplied in the `submitted` state with no checked-on date, so
  every page says "not yet checked" and the indexation gates keep the profile out of search
  results until staff verify it in `/admin/doctors`. `doctors.source = "import:drdata"`,
  `source_ref` = DrData id, `source_url` = DrData profile URL, plus an audit row per record carrying
  the archive's own QA flags. Re-running skips records already present. Runs the full archive
  in under a minute locally; a few minutes over a remote connection.

`data/private/` is git-ignored: datasets never enter the repository.

What may be imported: State Medical Council and NMC Indian Medical Register lookups, hospital and
clinic websites with their permission, your own archives, and records doctors submit themselves.
Aggregator sites (Practo, Justdial, Lybrate and similar) are not a permitted source — their terms
prohibit scraping, the data is unverified, and importing it would contradict the verification
promise on every page of this site.

### Enrichment: register matching and Google listings

`npm run db:enrich -- [--batch 800] [--minutes 40] [--dry] [--only nmc|google] [--slug x]` is the
background worker that turns imported records into checked ones. For each published doctor it
(1) confirms the registration number on file against the NMC Indian Medical Register, or fills one
in when exactly one register entry matches the name in the state's councils — a number that turns
out to belong to someone else is demoted and, when the name matches uniquely, replaced; anything
less certain goes to `/admin/enrichment` with the candidates — and (2) finds the doctor's or
clinic's Google listing, storing only the place ID plus the fields that explain the match. Ratings
and reviews are never stored (Places policy); the profile links to Google and can show the live
count with `GOOGLE_PLACES_RENDER_RATING=1`. Matches write `verification_checks`, an audit row and a
recomputed quality score. Dental, AYUSH and allied specialities are marked not applicable to the
NMC register.

`.github/workflows/enrich.yml` runs it hourly with a time limit and a per-day Google cap
(`GOOGLE_PLACES_DAILY_CAP`, default 1500). Secrets: `DATABASE_URL`, `DIRECT_URL`,
`GOOGLE_PLACES_API_KEY`. The register serves its certificate without the SSL.com intermediate, so
the script runs with `NODE_EXTRA_CA_CERTS` pointing at `lib/enrich/certs/` (trust added, never
relaxed). Profile pages are rebuilt from the record only: a summary sentence, a FAQ and FAQPage
markup from `lib/seo/profile-content.ts`, `sameAs` to the Google listing — no generated prose.

### Sitemaps and IndexNow

`/sitemap.xml` is an index of `/sitemaps/doctors.xml` (indexable profiles, split into further files
`/sitemaps/doctors/2…` under the protocol's 50,000-URL cap; `SITEMAP_MAX_URLS_PER_FILE`),
`/sitemaps/directory.xml` (states, cities and the place × speciality listings that clear their gate)
and `/sitemaps/editorial.xml`. Every file is regenerated hourly, so a profile that crosses the gate
is listed within the hour; `lastmod` comes only from a real verification or review date, `loc` is
entity-escaped, and the files carry the sitemaps.org 0.9 schema reference. Set `INDEXNOW_KEY` and
maintenance pushes the sitemap index plus profiles verified in the last two days to Bing, Yandex,
Naver and Seznam after every run (`/indexnow-key.txt` serves the key); Google reads `lastmod`.

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
sign-in, for-doctors, guides, policy, add-doctor and search pages in both themes, at desktop and
390 px mobile viewports.

Mobile: a phone-width layer at the end of `globals.css` (grids collapse — including the inline
desktop column templates in dashboard/admin forms — 42 px+ tap targets, 16 px inputs so iOS does
not zoom, tables scroll inside themselves, a fixed Call / Directions / Enquire bar on profiles, no
sticky header). Audited at iPhone width: zero horizontal overflow on every public, dashboard and
account page. Lighthouse mobile (simulated 4G): performance 96–99, FCP ≈ 0.8 s, CLS 0; the Google
Fonts stylesheet is preloaded and attached after first paint rather than render-blocking.

---

## Known gaps

- **Fonts are self-hosted.** The four woff2 files in `app/fonts/` (SIL OFL) are served from this origin by `next/font/local`; nothing loads from Google Fonts.
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
