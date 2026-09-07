import type { GoogleListing as Listing } from "@/lib/types";

/**
 * The doctor's Google listing, when the enrichment worker matched one.
 *
 * Google's Places policy: the place ID may be stored; ratings and reviews may
 * not, and whatever is shown must credit Google and link to the source. So
 * the card always links out, and the live rating count is fetched at render
 * only when GOOGLE_PLACES_RENDER_RATING=1 (a per-render Place Details call,
 * cached for a day). Review text is never shown here — it lives on Google.
 */

interface Live {
  rating: number | null;
  count: number | null;
}

async function liveRating(placeId: string): Promise<Live | null> {
  if (process.env.GOOGLE_PLACES_RENDER_RATING !== "1" || !process.env.GOOGLE_PLACES_API_KEY) return null;
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: { "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY, "X-Goog-FieldMask": "rating,userRatingCount" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { rating?: number; userRatingCount?: number };
    return { rating: typeof j.rating === "number" ? j.rating : null, count: typeof j.userRatingCount === "number" ? j.userRatingCount : null };
  } catch {
    return null;
  }
}

export async function GoogleListingCard({ listing, doctorName }: { listing: Listing; doctorName: string }) {
  const live = await liveRating(listing.placeId);
  return (
    <div className="pcard" style={{ borderStyle: "dashed" }}>
      <div className="eyebrow">On Google Maps</div>
      <div className="f" style={{ marginTop: "6px" }}>{listing.name || `Dr ${doctorName}`}</div>
      {listing.address ? <div className="a">{listing.address}</div> : null}
      <div className="h">
        {listing.addressMatch ? "Matches the practice address on file" : "Listing found by name; address differs from the record"} · checked {listing.checkedOn}
        {live && live.count !== null ? (
          <>
            <br />
            {live.rating !== null ? `${live.rating.toFixed(1)} ★ · ` : ""}
            {live.count.toLocaleString("en-IN")} {live.count === 1 ? "rating" : "ratings"} on Google
          </>
        ) : null}
      </div>
      <div className="acts">
        <a className="btn quiet" href={listing.mapsUri} target="_blank" rel="noopener nofollow">
          See reviews on Google ↗
        </a>
      </div>
      <p style={{ fontSize: "11.5px", color: "var(--muted)", margin: "10px 0 0" }}>
        Ratings and reviews there are Google's, not ours; Google checks for and removes fake content but does not verify reviews. Our own reviews below require visit evidence.
      </p>
    </div>
  );
}
