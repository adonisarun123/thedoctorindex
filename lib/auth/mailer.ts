/**
 * Outbound email. Provider is chosen by EMAIL_PROVIDER:
 *   resend   → Resend HTTP API (RESEND_API_KEY)
 *   postmark → Postmark HTTP API (POSTMARK_SERVER_TOKEN)
 *   console  → print to the server log (default when nothing is configured)
 *
 * SMS is stubbed behind the same interface; wire SMS_PROVIDER when the DLT
 * template is approved (see .env.example §8).
 */

export interface Message {
  to: string;
  subject: string;
  text: string;
}

const FROM = () =>
  `${process.env.EMAIL_FROM_NAME ?? "The Doctor Index"} <${process.env.EMAIL_FROM_ADDRESS ?? "no-reply@thedoctorindex.in"}>`;

/**
 * Whether a real provider is wired for each channel. The console fallback is
 * not one: it reports delivered only outside production, so callers must not
 * treat it as a usable channel when deciding what to offer a visitor.
 */
export function emailConfigured(): boolean {
  const provider = (process.env.EMAIL_PROVIDER ?? "").toLowerCase();
  if (provider === "resend") return Boolean(process.env.RESEND_API_KEY);
  if (provider === "postmark") return Boolean(process.env.POSTMARK_SERVER_TOKEN);
  if (provider === "smtp") return Boolean(process.env.SMTP_HOST);
  return false;
}

export function smsConfigured(): boolean {
  const provider = (process.env.SMS_PROVIDER ?? "").toLowerCase();
  if (provider !== "twilio") return false;
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return false;
  return Boolean(process.env.TWILIO_MESSAGING_SERVICE_SID || process.env.TWILIO_FROM_NUMBER);
}

export async function sendEmail(msg: Message): Promise<{ delivered: boolean; provider: string }> {
  const provider = (process.env.EMAIL_PROVIDER ?? "").toLowerCase();

  if (provider === "resend" && process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM(), to: [msg.to], subject: msg.subject, text: msg.text }),
    });
    return { delivered: res.ok, provider: "resend" };
  }

  if (provider === "postmark" && process.env.POSTMARK_SERVER_TOKEN) {
    const res = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: { "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ From: FROM(), To: msg.to, Subject: msg.subject, TextBody: msg.text, MessageStream: "outbound" }),
    });
    return { delivered: res.ok, provider: "postmark" };
  }

  if (provider === "smtp" && process.env.SMTP_HOST) {
    /**
     * Imported here rather than at module scope so nodemailer is pulled in only
     * by the deployment that actually sends over SMTP; the Resend and Postmark
     * paths are plain fetch and stay dependency-free.
     */
    const { createTransport } = await import("nodemailer");
    const port = Number(process.env.SMTP_PORT ?? 587);
    const transport = createTransport({
      host: process.env.SMTP_HOST,
      port,
      // Implicit TLS on 465; STARTTLS (upgraded after EHLO) on 587 and 25.
      secure: process.env.SMTP_SECURE === "1" || process.env.SMTP_SECURE === "true" || port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD ?? "" } : undefined,
    });
    try {
      await transport.sendMail({
        from: FROM(),
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        replyTo: process.env.EMAIL_REPLY_TO || undefined,
      });
      return { delivered: true, provider: "smtp" };
    } catch (e) {
      // The caller deletes the code row and tells the visitor to try again;
      // the reason belongs in the server log, never in the response.
      console.error(`[mail:smtp] send failed · ${(e as Error).message}`);
      return { delivered: false, provider: "smtp" };
    } finally {
      transport.close();
    }
  }
  // Development fallback. Never silently swallow in production.
  const line = `\n[mail:console] to=${msg.to}\nsubject: ${msg.subject}\n${msg.text}\n`;
  console.log(line);
  /**
   * A production build normally treats the console as undelivered, so requestOtp
   * deletes the code rather than stranding someone on a screen asking for a code
   * nobody sent. The e2e suite needs the opposite: it drives a real `next start`
   * build and reads codes back out of this log. EMAIL_CONSOLE_DELIVERS is that
   * opt-in — explicit, loud, and off by default, so a live deployment that forgets
   * to configure a provider still fails closed.
   */
  const testDelivery = process.env.EMAIL_CONSOLE_DELIVERS === "1";
  if (testDelivery && process.env.NODE_ENV === "production") {
    console.warn("[mail:console] EMAIL_CONSOLE_DELIVERS=1 — one-time codes exist only in this log. Test builds only, never a live site.");
  }
  return { delivered: testDelivery || process.env.NODE_ENV !== "production", provider: "console" };
}

export async function sendSms(to: string, text: string): Promise<{ delivered: boolean; provider: string }> {
  const provider = (process.env.SMS_PROVIDER ?? "").toLowerCase();
  if (provider === "twilio" && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const body = new URLSearchParams({ To: to, Body: text });
    if (process.env.TWILIO_MESSAGING_SERVICE_SID) body.set("MessagingServiceSid", process.env.TWILIO_MESSAGING_SERVICE_SID);
    else if (process.env.TWILIO_FROM_NUMBER) body.set("From", process.env.TWILIO_FROM_NUMBER);
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    return { delivered: res.ok, provider: "twilio" };
  }
  console.log(`\n[sms:console] to=${to}\n${text}\n`);
  return { delivered: process.env.NODE_ENV !== "production", provider: "console" };
}
