/**
 * Email helper — The Well Lived Citizen
 * Uses Resend to send transactional emails to clients.
 * All calls are fire-and-forget; failures are logged but never thrown.
 *
 * Required env var: RESEND_API_KEY
 * From address: "The Well Lived Citizen <hello@thewelllivedcitizen.com>"
 * (or the Resend sandbox address during testing)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_ADDRESS = process.env.EMAIL_FROM ?? "The Well Lived Citizen <onboarding@resend.dev>";
const SITE_URL = process.env.SITE_URL ?? "https://thewelllivedcitizen.com";

function getClient(): Resend | null {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — email delivery disabled");
    return null;
  }
  return new Resend(RESEND_API_KEY);
}

// ── Agreement signing email ───────────────────────────────────────────────────

interface SendAgreementEmailOptions {
  clientName: string;
  clientEmail: string;
  signingToken: string;
  serviceLabel: string;
}

export async function sendAgreementEmail({
  clientName,
  clientEmail,
  signingToken,
  serviceLabel,
}: SendAgreementEmailOptions): Promise<boolean> {
  const client = getClient();
  if (!client) return false;

  const signingUrl = `${SITE_URL}/sign/${signingToken}`;
  const firstName = clientName.split(" ")[0] ?? clientName;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Consignment Agreement — The Well Lived Citizen</title>
</head>
<body style="margin:0;padding:0;background:#f8f4e3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f4e3;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a18;padding:36px 40px;text-align:left;">
              <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#8a9e7a;">
                The Well Lived Citizen
              </p>
              <p style="margin:6px 0 0;font-size:11px;font-weight:400;letter-spacing:0.1em;color:rgba(248,244,227,0.5);">
                A Well Dressed Citizen Company · Est. 2020
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:48px 40px;">
              <p style="margin:0 0 24px;font-size:22px;font-weight:700;color:#1a1a18;line-height:1.3;">
                Your consignment agreement is ready to sign.
              </p>
              <p style="margin:0 0 16px;font-size:15px;font-weight:400;color:#4a4a42;line-height:1.7;">
                Hi ${firstName},
              </p>
              <p style="margin:0 0 16px;font-size:15px;font-weight:400;color:#4a4a42;line-height:1.7;">
                Thank you for reaching out about <strong>${serviceLabel}</strong>. Before I can schedule a pickup, I need you to review and sign the consignment agreement below.
              </p>
              <p style="margin:0 0 16px;font-size:15px;font-weight:400;color:#4a4a42;line-height:1.7;">
                It takes about two minutes. You'll read the terms, draw your signature, and submit — that's it. Once signed, I'll be in touch to confirm next steps.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td style="background:#1a1a18;padding:0;">
                    <a href="${signingUrl}"
                       style="display:inline-block;padding:16px 32px;font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f8f4e3;text-decoration:none;">
                      Review &amp; Sign Agreement →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#8a8a7a;line-height:1.6;">
                Or copy this link into your browser:
              </p>
              <p style="margin:0 0 32px;font-size:12px;color:#8a9e7a;word-break:break-all;line-height:1.5;">
                ${signingUrl}
              </p>

              <hr style="border:none;border-top:1px solid #e8e4d3;margin:32px 0;" />

              <p style="margin:0;font-size:13px;color:#8a8a7a;line-height:1.7;">
                This link is valid for <strong>30 days</strong>. If you have any questions before signing, reply to this email or reach out directly.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0ece0;padding:24px 40px;text-align:left;">
              <p style="margin:0;font-size:11px;color:#8a8a7a;line-height:1.6;">
                The Well Lived Citizen · Los Angeles, CA<br />
                <a href="https://thewelllivedcitizen.com" style="color:#8a9e7a;text-decoration:none;">thewelllivedcitizen.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Hi ${firstName},

Your consignment agreement for ${serviceLabel} is ready to review and sign.

Sign here: ${signingUrl}

This link is valid for 30 days. Once signed, I'll be in touch to confirm next steps.

— Dayna
The Well Lived Citizen
  `.trim();

  try {
    const { error } = await client.emails.send({
      from: FROM_ADDRESS,
      to: clientEmail,
      subject: `Your consignment agreement — The Well Lived Citizen`,
      html,
      text,
    });
    if (error) {
      console.warn("[email] Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[email] Failed to send agreement email:", err);
    return false;
  }
}

// ── Inquiry confirmation email ────────────────────────────────────────────────

interface SendConfirmationEmailOptions {
  clientName: string;
  clientEmail: string;
  serviceLabel: string;
}

export async function sendInquiryConfirmationEmail({
  clientName,
  clientEmail,
  serviceLabel,
}: SendConfirmationEmailOptions): Promise<boolean> {
  const client = getClient();
  if (!client) return false;

  const firstName = clientName.split(" ")[0] ?? clientName;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inquiry Received — The Well Lived Citizen</title>
</head>
<body style="margin:0;padding:0;background:#f8f4e3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f4e3;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:#1a1a18;padding:36px 40px;">
              <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#8a9e7a;">
                The Well Lived Citizen
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:rgba(248,244,227,0.5);">
                A Well Dressed Citizen Company · Est. 2020
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:48px 40px;">
              <p style="margin:0 0 24px;font-size:22px;font-weight:700;color:#1a1a18;line-height:1.3;">
                Got it — I'll be in touch.
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#4a4a42;line-height:1.7;">
                Hi ${firstName},
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#4a4a42;line-height:1.7;">
                I received your inquiry about <strong>${serviceLabel}</strong>. I typically respond within a few hours, or by the next business day for non-urgent requests.
              </p>
              <p style="margin:0;font-size:15px;color:#4a4a42;line-height:1.7;">
                If anything changes or you have questions in the meantime, just reply to this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f0ece0;padding:24px 40px;">
              <p style="margin:0;font-size:11px;color:#8a8a7a;line-height:1.6;">
                The Well Lived Citizen · Los Angeles, CA<br />
                <a href="https://thewelllivedcitizen.com" style="color:#8a9e7a;text-decoration:none;">thewelllivedcitizen.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `Hi ${firstName},\n\nGot it — I received your inquiry about ${serviceLabel} and will be in touch shortly.\n\n— Dayna\nThe Well Lived Citizen`;

  try {
    const { error } = await client.emails.send({
      from: FROM_ADDRESS,
      to: clientEmail,
      subject: `Inquiry received — The Well Lived Citizen`,
      html,
      text,
    });
    if (error) {
      console.warn("[email] Resend confirmation error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[email] Failed to send confirmation email:", err);
    return false;
  }
}
