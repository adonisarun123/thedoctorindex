import Link from "next/link";

import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { paths, HOME_CITY } from "@/lib/site";

/**
 * A genuine 404. Empty or nonsensical speciality-and-location combinations end
 * up here rather than being softened into an empty listing page, and a removed
 * profile is not redirected to the homepage.
 */
export default function NotFound() {
  return (
    <div className="wrap">
      <div className="doc">
        <h1>404 — no page at this address</h1>
        <div className="upd">HTTP 404</div>
        <p>
          This combination of speciality and location does not exist in the index, or the profile it
          pointed to has been removed. We return a real 404 rather than an empty listing page, and we
          do not redirect removed profiles to the homepage.
        </p>
        <p>
          A profile that was <em>merged</em> into another record redirects permanently to its
          successor, carrying its reviews and provenance with it.
        </p>
        <h2>Try one of these</h2>
        <div className="quick">
          {SPECIALTY_KEYS.map((k) => (
            <Link
              key={k}
              className="chip"
              href={paths.citySpecialty(HOME_CITY.stateSlug, HOME_CITY.slug, SPECIALTIES[k].slug)}
            >
              {SPECIALTIES[k].plural} in {HOME_CITY.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
