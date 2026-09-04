/**
 * Emits JSON-LD. Kept as one component so every block on the site is
 * serialised the same way and is easy to find in an audit.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
