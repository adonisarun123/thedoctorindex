import Link from "next/link";

import { rank, type RankingContext } from "@/lib/ranking";
import { paths } from "@/lib/site";
import type { DoctorView } from "@/lib/types";

/**
 * Ranking breakdown — staff-only.
 *
 * The arithmetic behind a doctor's position in a listing. This is operational
 * detail: it belongs in the admin record, not on a patient-facing result,
 * where it reads as noise and invites gaming. The published methodology at
 * /policies/ranking is what patients see.
 */
export function RankingBreakdown({ doctor, ctx }: { doctor: DoctorView; ctx?: RankingContext }) {
  const score = rank(doctor, ctx ?? { specialty: doctor.specialty });

  const rows: Array<[string, number, number]> = [
    ["Query & speciality relevance", score.relevance, 35],
    ["Location match", score.location, 20],
    ["Registration & active practice", score.verification, 15],
    ["Profile completeness", score.completeness, 10],
    ["Freshness & contactability", score.freshness, 10],
    ["Review confidence", score.reviewConfidence, 10],
  ];

  return (
    <div className="panel pad" style={{ marginBottom: "18px" }}>
      <h3 style={{ marginTop: 0 }}>Why this position</h3>
      <div className="sub" style={{ marginBottom: "10px" }}>
        Scored for this doctor&apos;s own speciality with no query or locality bias. A real listing
        also scores the visitor&apos;s query and location, so a live position can differ.
      </div>
      <table className="table">
        <tbody>
          {rows.map(([label, value, max]) => (
            <tr key={label}>
              <td>{label}</td>
              <td className="num">
                {value} / {max}
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <b>Total</b>
            </td>
            <td className="num">
              <b>{score.total} / 100</b>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "8px" }}>
        Payment is not an input. <Link href={paths.policy("ranking")}>Published methodology</Link>
      </div>
    </div>
  );
}
