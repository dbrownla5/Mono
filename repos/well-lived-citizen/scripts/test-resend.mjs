/**
 * Standalone Resend API key validation script.
 * Run with: node scripts/test-resend.mjs
 * Sends a test email to Resend's built-in test address (delivered@resend.dev)
 * which confirms the key is valid without delivering a real email.
 */

import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error("❌ RESEND_API_KEY is not set in the environment.");
  process.exit(1);
}

const resend = new Resend(key);

console.log("🔑 RESEND_API_KEY is set. Sending test email to delivered@resend.dev...");

try {
  const { data, error } = await resend.emails.send({
    from: "The Well Lived Citizen <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Test — Consignment Agreement Link",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h2 style="font-size: 1.25rem; font-weight: 600; color: #1a1a1a;">Test Email</h2>
        <p style="color: #555; line-height: 1.6;">
          This is a test email confirming that the Resend API key is valid and email delivery is working correctly for The Well Lived Citizen.
        </p>
        <p style="color: #555; line-height: 1.6;">
          <strong>Signing link (test):</strong><br/>
          <a href="https://thewelllivedcitizen.com/sign/test-token-123">
            https://thewelllivedcitizen.com/sign/test-token-123
          </a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 0.75rem; color: #999;">The Well Lived Citizen · Los Angeles, CA</p>
      </div>
    `,
  });

  if (error) {
    console.error("❌ Resend API returned an error:", error);
    process.exit(1);
  }

  console.log("✅ Test email sent successfully. Email ID:", data?.id);
  console.log("   The Resend API key is valid and email delivery is working.");
} catch (err) {
  console.error("❌ Unexpected error calling Resend API:", err.message);
  process.exit(1);
}
