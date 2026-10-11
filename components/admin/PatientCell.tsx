import Link from "next/link";

/**
 * The four patient facts staff need on any queue row: name, mobile, email,
 * area. Rendered the same way on enquiries, bookings and the patients page
 * so a staff member reads them in one place on every screen.
 */
export function PatientCell({ id, name, phone, email, area, note, hideArea = false }: { id?: string | null; name: string; phone: string; email: string; area: string; note?: string; /** Doctor accounts have no home area to show. */ hideArea?: boolean }) {
  const title = name || "—";
  return (
    <div className="pcell">
      <div className="pcell-n">{id ? <Link href={`/admin/patients?q=${encodeURIComponent(phone || email || name)}`}>{title}</Link> : title}{note ? <span className="pcell-note"> {note}</span> : null}</div>
      <div className="pcell-r">{phone ? <a className="mono" href={`tel:${phone}`}>{phone}</a> : <span className="pcell-missing">no mobile</span>}</div>
      <div className="pcell-r">{email ? <a href={`mailto:${email}`}>{email}</a> : <span className="pcell-missing">no email</span>}</div>
      {area ? <div className="pcell-r pcell-area">{area}</div> : hideArea ? null : <div className="pcell-r pcell-area"><span className="pcell-missing">area not given</span></div>}
    </div>
  );
}
