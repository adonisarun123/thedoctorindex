import Link from "next/link";

import { DemoAction } from "@/components/DemoAction";
import { TrustBadges } from "@/components/TrustBadges";
import { LOCALITIES, SPECIALTIES } from "@/lib/data/taxonomy";
import { rank, type RankingContext } from "@/lib/ranking";
import { paths } from "@/lib/site";
import type { DoctorView } from "@/lib/types";

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

function inr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function DoctorRow({ doctor, ctx }: { doctor: DoctorView; ctx: RankingContext }) {
  const specialty = SPECIALTIES[doctor.specialty];
  const practice = doctor.practices[0];
  const score = rank(doctor, ctx);

  return (
    <article className="row">
      <div className="av" aria-hidden="true">
        {initials(doctor.name)}
      </div>
      <div>
        <Link className="nm" href={paths.doctor(doctor.slug)}>
          Dr {doctor.name}
        </Link>
        <div className="sub">
          {specialty.one}
          {doctor.subspecialties.length ? ` · ${doctor.subspecialties.join(", ")}` : ""}
        </div>
        <div className="meta">
          {doctor.yearsOfExperience} yrs since practice start · {doctor.languages.join(", ")}
          <br />
          {practice.facility}, {LOCALITIES[practice.locality].name} ·{" "}
          {practice.feeInr !== null ? inr(practice.feeInr) : "Fee not confirmed"} ·{" "}
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
        <DemoAction
          label="Call practice"
          variant="outline"
          explains={`Dials ${practice.phone} and records a call_clicked event. Telephony and event capture are services outside this repository.`}
        />
        <DemoAction
          label="Directions"
          explains={`Opens directions to ${practice.facility} and records a directions_clicked event. Maps provider is not wired up in this build.`}
        />
      </div>
    </article>
  );
}
