# The Doctor Index

A verified doctor directory for India. This repository is the **front-end application**: the public
site, its indexation rules, and a typed data layer that a real directory API can drop into.

Built from the project plan dated 4 September 2026. Bengaluru launch cluster, four specialities.

---

## What this repository is, and is not

**It is** the whole patient-facing surface, with the SEO architecture the plan calls for actually
implemented rather than described: per-route metadata, gate-driven `noindex`, split sitemaps that
agree with those gates, 301 redirects for merged and renamed profiles, and schema that switches on
claim status.

**It is not** the back office. There is no database, no authentication, no verification queue, no
moderation console, no import pipeline. Those are the larger half of the plan and a separate build.
Where a control needs one of those services, it renders and explains what the real implementation
does instead of pretending to work — see `components/DemoAction.tsx`. Those call sites are the
integration checklist.

**The data is fictional.** Every doctor, registration number, facility, college and review in
`lib/data/doctors.ts` was invented to exercise the design. No real practitioner is represented and
nothing was taken from any third-party directory. A banner says so on every page; remove it when
real records land.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

Set `NEXT_PUBLIC_SITE_URL` on previews and staging. Canonicals, sitemaps and JSON-LD are all built
from it, so an unset value on a preview deployment means the preview declares production URLs.

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
  doctor/[slug]/                             profile — ProfilePage vs WebPage on claim status
  doctors/[state]/[city]/[...segments]/      1 segment = city × speciality, 2 = locality × speciality
  specialties/[specialty]/                   national hub, addressed by speciality (cardiology)
  search/                                    internal results, always noindex
  add-doctor/ claim-profile/                 registration-first flows, noindex+nofollow
  policies/[slug]/                           trust documents every badge links to
  sitemap.xml/ sitemaps/*.xml/               index + doctors / directory / editorial
  robots.ts  not-found.tsx  globals.css
components/                                  view layer; RouteMeta + RouteInspector are the SEO surface
lib/
  types.ts        domain model, mirrors the plan's relational schema
  site.ts         origin + canonical path builders — nothing hand-writes a URL
  ranking.ts      published 35/20/15/10/10/10 model; no field exists for payment
  data/           taxonomy, policies, seed records, and the access boundary in data/index.ts
  seo/            gates, structured data, sitemaps, redirect table
middleware.ts                                301s for renamed and merged slugs
```

The catch-all under `[city]` exists because Next.js will not accept two differently-named dynamic
segments at the same depth. Segment count decides which page it is.

---

## Swapping the seed data for a real API

`lib/data/index.ts` is the only boundary. Everything above it — routes, components, sitemaps —
consumes those functions, not the records. Replace the seed import with your fetch, keep the
signatures, and the site works unchanged. The functions are synchronous today and written to
promisify without touching call sites.

`lib/types.ts` mirrors the plan's schema (§14), so the API contract is already written down.

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

## Known gaps

- **Fonts load from Google Fonts over `<link>`.** For production, switch to `next/font` self-hosting
  — the block is written out in `app/layout.tsx` and `globals.css` already reads both. That removes a
  third-party request on the critical path.
- **No tests.** The gate functions in `lib/seo/gates.ts` and the ranking model in `lib/ranking.ts`
  are pure and are the first things that should get a suite.
- **No maps, telephony, analytics or enquiry handling.** Every such control is a `DemoAction`.
- **Accessibility has been built for but not audited.** WCAG 2.2 AA is a launch acceptance criterion
  in the plan; it needs a real keyboard and screen-reader pass.
- **Bengaluru only, four specialities.** The plan calls for 10–12 per launch city. Adding more is
  data in `lib/data/taxonomy.ts`, not code.
