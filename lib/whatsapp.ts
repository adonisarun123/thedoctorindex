/**
 * WhatsApp alerts to doctors through the WhatsApp Business Cloud API (Meta).
 *
 * Business-initiated WhatsApp messages must use a template Meta has approved,
 * so nothing is sent until all of these are set:
 *   WHATSAPP_TOKEN             permanent system-user access token
 *   WHATSAPP_PHONE_NUMBER_ID   the sending number's id in WhatsApp Manager
 *   WHATSAPP_TEMPLATE_ENQUIRY  approved template name (Utility category)
 *   WHATSAPP_TEMPLATE_LANG     template language code, default "en"
 *
 * Template body to submit for approval (three variables):
 *   New appointment enquiry for {{1}} on The Doctor Index. Preferred time: {{2}}.
 *   The patient's contact details are in your dashboard: {{3}}
 *
 * Patient contact details and notes are never put in a WhatsApp message —
 * same rule as the email alert. The doctor opts in from Dashboard > Enquiries.
 */

export interface WaResult {
  delivered: boolean;
  provider: "whatsapp" | "none";
  error?: string;
}

export function whatsappConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_TEMPLATE_ENQUIRY);
}

/** Indian mobile in any common form → "+91XXXXXXXXXX"; other countries kept if already in +E.164. Null when unusable. */
export function normaliseWhatsappNumber(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (raw.startsWith("+") && !raw.startsWith("+91")) return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  const ten = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
  return /^[6-9]\d{9}$/.test(ten) ? `+91${ten}` : null;
}

/** The Cloud API request body for the enquiry template. Pure, for tests. */
export function enquiryTemplatePayload(to: string, doctorName: string, preferredDay: string | null, dashboardUrl: string, template = "enquiry", lang = "en") {
  const clip = (t: string, n: number) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);
  return {
    messaging_product: "whatsapp",
    to: to.replace(/^\+/, ""),
    type: "template",
    template: {
      name: template,
      language: { code: lang },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: clip(doctorName, 60) },
            { type: "text", text: clip(preferredDay?.trim() || "not given", 60) },
            { type: "text", text: dashboardUrl },
          ],
        },
      ],
    },
  };
}

export async function sendEnquiryWhatsapp(to: string, doctorName: string, preferredDay: string | null, dashboardUrl: string): Promise<WaResult> {
  if (!whatsappConfigured()) return { delivered: false, provider: "none", error: "not configured" };
  const body = enquiryTemplatePayload(to, doctorName, preferredDay, dashboardUrl, process.env.WHATSAPP_TEMPLATE_ENQUIRY!, process.env.WHATSAPP_TEMPLATE_LANG || "en");
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) return { delivered: true, provider: "whatsapp" };
    const err = await res.text().catch(() => "");
    return { delivered: false, provider: "whatsapp", error: `${res.status} ${err.slice(0, 200)}` };
  } catch (e) {
    return { delivered: false, provider: "whatsapp", error: e instanceof Error ? e.message : "request failed" };
  }
}
