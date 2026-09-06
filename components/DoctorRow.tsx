import Link from "next/link";

import { Avatar } from "@/components/Avatar";
import { CallButton, DirectionsButton } from "@/components/ContactActions";
import { TrustBadges } from "@/components/TrustBadges";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { formatKm } from "@/lib/geo";
import { rank, type RankingContext } from "@/lib/ranking";
import { paths } from "@/lib/site";
import type { DoctorView } from "@/lib/types";

function inr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function DoctorRow({ doctor, ctx, distance = null }: { doctor: DoctorView; ctx: RankingContext; distance?: { km: number; practiceIndex: number; approximate: boolean } | null }) {
  const specialty = SPECIALTIES[doctor.specialty];
  // With a visitor location, lead with the nearest practice.
  const practice = doctor.practices[distance?.practiceIndex ?? 0] ?? null;
  const score = rank(doctor, ctx);

  return (
    <article className="row">
      <Avatar name={doctor.name} id={doctor.id} size={56} photoUrl={doctor.photoUrl} />
      <div>
        <Link className="nm" href={paths.doctor(doctor.slug)}>
          Dr {doctor.name}
        </Link>
        <div className="sub">
          {specialty.one}
          {doctor.subspecialties.length ? ` · ${doctor.subspecialties.join(", ")}` : ""}
        </div>
        <div className="meta">
          {doctor.practiceStartYear ? `${doctor.yearsOfExperience} yrs since practice start` : "Experience not stated"}{doctor.languages.length ? ` · ${doctor.languages.join(", ")}` : ""}
          <br />
          {distance ? (
            <span className="dist" title={distance.approximate ? "Straight-line distance to the locality centre; the clinic itself is not yet geocoded" : "Straight-line distance to the clinic"}>
              {formatKm(distance.km)}{distance.approximate ? "~" : ""} away ·{" "}
            </span>
          ) : null}
          {practice ? (
            <>
              {practice.facility}, {practice.localityName} ·{" "}
              {practice.feeInr !== null ? inr(practice.feeInr) : "Fee not confirmed"} ·{" "}
            </>
          ) : (
            <>Practice location not yet on record · </>
          )}
          {doctor.modes.join(" / ")}
        </div>
        <TrustBadges doctor={doctor} />

        <details className="why">
          <summary>Why this position</summary>
          <table>
            <tbody>
              <tr><td>Query &amp; speciality relevance</td><td>{score.relevance} / 35</td></tr>
              <tr><td>Location match</td><td>{score.location} / 20</td></tr>
              <tr><td>Registration &amp; active practice</td><td>{score.verification} / 15</td></tr>
              <tr><td>Profile completeness</td><td>{score.completeness} / 10</td></tr>
              <tr><td>Freshness &amp; contactability</td><td>{score.freshness} / 10</td></tr>
              <tr><td>Review confidence</td><td>{score.reviewConfidence} / 10</td></tr>
            </tbody>
          </table>
          <div className="bar">
            <i style={{ width: `${score.total}%` }} />
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "6px" }}>
            Payment is not an input. <Link href={paths.policy("ranking")}>Full methodology</Link>
          </div>
        </details>
      </div>
      <div className="act">
        <div className="rating">
          {doctor.rating.count ? (
            <>
              <b>{doctor.rating.average.toFixed(1)}</b> / 5 · {doctor.rating.count} reviews
            </>
          ) : (
            "No reviews yet"
          )}
        </div>
        <Link className="btn solid" href={paths.doctor(doctor.slug)}>
          View profile
        </Link>
        {practice ? (
          <>
            <CallButton practiceId={practice.id} variant="outline" />
            <DirectionsButton practiceId={practice.id} variant="quiet" />
          </>
        ) : null}
      </div>
    </article>
  );
}
