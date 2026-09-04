import Link from "next/link";

import { getSessionUser } from "@/lib/auth/session";
import { paths } from "@/lib/site";

export const metadata = { title: "No profile linked", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NoProfilePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const user = await getSessionUser();
  const nodb = sp.reason === "nodb";
  return (
    <div className="wrap">
      <div className="state">
        <span className="eyebrow">Doctor dashboard</span>
        <h1 style={{ marginTop: "10px" }}>{nodb ? "The dashboard needs a database" : "No profile is linked to this account"}</h1>
        <p>
          {nodb
            ? "This deployment runs on fixture data with no DATABASE_URL, so there is nothing to sign in to. Set it, run the migrations and seed, and sign in as any claimed doctor."
            : user
              ? `You are signed in as ${user.email ?? user.phone}. Create a profile, or claim the one that already exists for your registration number. Once a verification officer approves it, it appears here.`
              : "Sign in with the email or mobile number your profile was created with."}
        </p>
        <div className="opts">
          {user ? (<><Link className="btn solid" href={paths.addDoctor()}>Create your profile</Link><Link className="btn" href={paths.claimProfile()}>Claim a profile</Link></>) : <Link className="btn solid" href="/sign-in?next=/dashboard">Sign in</Link>}
        </div>
      </div>
    </div>
  );
}
