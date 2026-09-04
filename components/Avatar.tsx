/**
 * Doctor avatar. Renders the photograph where one has been supplied with usage
 * consent; otherwise initials on a tint derived from the public ID, so the
 * same doctor always gets the same colour and a list of doctors reads as
 * distinct people rather than a column of identical discs.
 */
export function Avatar({
  name,
  id,
  photoUrl,
  size,
}: {
  name: string;
  id: string;
  photoUrl?: string | null;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const tint = (parseInt(id.slice(0, 2), 16) % 5) + 1;
  const style = size ? { width: size, height: size, fontSize: Math.round(size * 0.34) } : undefined;

  return (
    <div className="av" data-tint={tint} style={style} aria-hidden="true">
      {photoUrl ? <img src={photoUrl} alt="" /> : initials}
    </div>
  );
}
