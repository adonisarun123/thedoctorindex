import assert from "node:assert/strict";
import { test } from "node:test";

import { emailConfigured, smsConfigured } from "../../lib/auth/mailer";

/**
 * The console fallback is not a delivery channel. These helpers are what
 * requestOtp() consults before it spends a rate limit or writes a code row,
 * so a misread here strands a visitor on a code screen for a code nobody sent.
 */

function withEnv(vars: Record<string, string | undefined>, fn: () => void) {
  const saved: Record<string, string | undefined> = {};
  for (const k of Object.keys(vars)) {
    saved[k] = process.env[k];
    if (vars[k] === undefined) delete process.env[k];
    else process.env[k] = vars[k];
  }
  try {
    fn();
  } finally {
    for (const k of Object.keys(saved)) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  }
}

test("console and unset providers are not configured channels", () => {
  withEnv({ EMAIL_PROVIDER: "console", SMS_PROVIDER: "console" }, () => {
    assert.equal(emailConfigured(), false);
    assert.equal(smsConfigured(), false);
  });
  withEnv({ EMAIL_PROVIDER: undefined, SMS_PROVIDER: undefined }, () => {
    assert.equal(emailConfigured(), false);
    assert.equal(smsConfigured(), false);
  });
});

test("a provider named without its credentials is not configured", () => {
  withEnv({ EMAIL_PROVIDER: "resend", RESEND_API_KEY: undefined }, () => assert.equal(emailConfigured(), false));
  withEnv({ EMAIL_PROVIDER: "postmark", POSTMARK_SERVER_TOKEN: undefined }, () => assert.equal(emailConfigured(), false));
  withEnv({ SMS_PROVIDER: "twilio", TWILIO_ACCOUNT_SID: "AC1", TWILIO_AUTH_TOKEN: undefined }, () => assert.equal(smsConfigured(), false));
});

test("twilio needs a sender as well as credentials", () => {
  const creds = { SMS_PROVIDER: "twilio", TWILIO_ACCOUNT_SID: "AC1", TWILIO_AUTH_TOKEN: "tok" };
  withEnv({ ...creds, TWILIO_MESSAGING_SERVICE_SID: undefined, TWILIO_FROM_NUMBER: undefined }, () => assert.equal(smsConfigured(), false));
  withEnv({ ...creds, TWILIO_FROM_NUMBER: "+15550000000", TWILIO_MESSAGING_SERVICE_SID: undefined }, () => assert.equal(smsConfigured(), true));
  withEnv({ ...creds, TWILIO_MESSAGING_SERVICE_SID: "MG1", TWILIO_FROM_NUMBER: undefined }, () => assert.equal(smsConfigured(), true));
});

test("msg91 is documented but unimplemented, so it is not a channel", () => {
  withEnv({ SMS_PROVIDER: "msg91", SMS_API_KEY: "k", SMS_SENDER_ID: "TDIIND" }, () => assert.equal(smsConfigured(), false));
});

test("smtp needs a host, and needs nothing else", () => {
  withEnv({ EMAIL_PROVIDER: "smtp", SMTP_HOST: undefined }, () => assert.equal(emailConfigured(), false));
  // Relays on a trusted network legitimately take no credentials, so a host alone counts.
  withEnv({ EMAIL_PROVIDER: "smtp", SMTP_HOST: "smtp.example.com", SMTP_USER: undefined }, () => assert.equal(emailConfigured(), true));
});
test("a fully credentialled provider is configured", () => {
  withEnv({ EMAIL_PROVIDER: "resend", RESEND_API_KEY: "re_test" }, () => assert.equal(emailConfigured(), true));
  withEnv({ EMAIL_PROVIDER: "postmark", POSTMARK_SERVER_TOKEN: "pm_test" }, () => assert.equal(emailConfigured(), true));
});
