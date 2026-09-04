"use client";

import Link from "next/link";

/**
 * Route error boundary. Says what happened in plain terms, offers retry, and
 * never pretends the page loaded. The digest is shown so support can find the
 * server-side log without asking the person to describe it.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="wrap">
      <div className="state">
        <span className="eyebrow">Something went wrong on our side</span>
        <h1 style={{ marginTop: "10px" }}>This page did not load</h1>
        <p>
          The directory itself is fine — this is an error rendering one page. Retrying usually works.
          If it does not, the reference below lets us find the cause.
        </p>
        {error.digest ? (
          <p className="mono" style={{ fontSize: "12px" }}>
            Reference {error.digest}
          </p>
        ) : null}
        <div className="opts">
          <button className="btn solid" onClick={() => reset()}>
            Try again
          </button>
          <Link className="btn quiet" href="/">
            Go to the homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
