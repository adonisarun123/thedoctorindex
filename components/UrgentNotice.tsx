import type { RedFlag } from "@/lib/search/interpret";

/**
 * Shown above search results when a query reads like an emergency or a
 * mental-health crisis. Worded conditionally ("if this is happening now")
 * because the pattern match cannot tell a crisis from someone researching a
 * symptom, and a directory listing is the wrong first step for the former.
 */
export function UrgentNotice({ kind }: { kind: RedFlag }) {
  if (kind === "mental-health") {
    return (
      <div className="urgent" role="alert">
        <strong>You don&rsquo;t have to go through this alone.</strong>
        <p>
          If you are thinking about ending your life or hurting yourself, talk to someone now. <b>Tele-MANAS</b>, the
          Government of India&rsquo;s free mental-health helpline, answers 24×7 in Indian languages:{" "}
          <a href="tel:14416">14416</a> or <a href="tel:18008914416">1-800-891-4416</a>. If you are in immediate danger, call{" "}
          <a href="tel:112">112</a>.
        </p>
      </div>
    );
  }
  return (
    <div className="urgent" role="alert">
      <strong>If this is happening now and is severe, don&rsquo;t wait for an appointment.</strong>
      <p>
        Chest pain, trouble breathing, signs of a stroke, fainting, a seizure, heavy bleeding or poisoning need emergency care.
        Call <a href="tel:112">112</a> (national emergency) or <a href="tel:108">108</a> (ambulance), or go to the nearest hospital
        emergency department.
      </p>
    </div>
  );
}
