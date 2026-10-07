import Link from "next/link";

import { SPECIALTIES } from "@/lib/data/taxonomy";
import { displayName } from "@/lib/display-name";
import { initials } from "@/lib/news/format";
import type { StoryDoctor } from "@/lib/services/news";
import { paths } from "@/lib/site";

/**
 * The doctor a story is about, as the directory knows them. This is what
 * turns a news story into a route into the directory: a verified badge when
 * the registration was checked against the register, and — for an unclaimed
 * profile — the invitation to claim it, because the doctor (or their
 * colleagues) are the people most likely to read news about them.
 */
export function NewsDoctorCard({ d, subjectRole }: { d: StoryDoctor; subjectRole?: string }) {
  const name = displayName({ name: d.name, specialty: d.specialtyKey });
  const sp = SPECIALTIES[d.specialtyKey as keyof typeof SPECIALTIES];
  return (
    <div className="railcard doccard">
      <div className="eyebrow">{d.primary ? "In this story" : "Also mentioned"}</div>
      <div className="who">
        <div className="av" aria-hidden="true">
          {d.photoUrl ? <img src={d.photoUrl} alt="" width={64} height={64} /> : initials(d.name)}
        </div>
        <div>
          <div className="nm">{name}</div>
          <div className="sp">{subjectRole || sp?.one || sp?.name}</div>
        </div>
      </div>
      <div className="badges">
        {d.registrationChecked ? <span className="badge ok">Registration checked on the register</span> : <span className="badge neut">Registration not yet checked</span>}
        {d.claimed ? <span className="badge ok">Profile managed by the doctor</span> : null}
      </div>
      {d.tdiId ? <div className="sp mono" style={{ fontSize: "14px", color: "var(--muted)" }}>TDi ID {d.tdiId}</div> : null}
      <Link className="btn solid" href={paths.doctor(d.slug)}>View verified profile</Link>
      {!d.claimed ? (
        <>
          <p className="claimnote">Is this you? Claim the profile to add your photo, clinic hours and appointment booking.</p>
          <Link className="btn quiet" href={`${paths.claimProfile()}?profile=${encodeURIComponent(d.slug)}&src=news`}>Claim this profile</Link>
        </>
      ) : null}
    </div>
  );
}
