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

  // Development fallback. Never silently swallow in production.
  const line = `\n[mail:console] to=${msg.to}\nsubject: ${msg.subject}\n${msg.text}\n`;
  console.log(line);
  return { delivered: process.env.NODE_ENV !== "production", provider: "console" };
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
