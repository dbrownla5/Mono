/**
 * Email helper tests — The Well Lived Citizen
 * Validates that the Resend API key is configured and the email module
 * can be imported without errors. Actual sends are skipped in CI
 * (no RESEND_API_KEY) to avoid sending real emails during test runs.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Module import sanity ──────────────────────────────────────────────────────

describe("email module", () => {
  it("exports sendAgreementEmail and sendInquiryConfirmationEmail", async () => {
    const mod = await import("./email");
    expect(typeof mod.sendAgreementEmail).toBe("function");
    expect(typeof mod.sendInquiryConfirmationEmail).toBe("function");
  });
});

// ── Behaviour when RESEND_API_KEY is absent ───────────────────────────────────

describe("sendAgreementEmail (no API key)", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.RESEND_API_KEY;
  });

  it("returns false gracefully when RESEND_API_KEY is not set", async () => {
    const { sendAgreementEmail } = await import("./email");
    const result = await sendAgreementEmail({
      clientName: "Test Client",
      clientEmail: "test@example.com",
      signingToken: "abc-token-123",
      serviceLabel: "Curated Resale & Consignment",
    });
    expect(result).toBe(false);
  });
});

describe("sendInquiryConfirmationEmail (no API key)", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.RESEND_API_KEY;
  });

  it("returns false gracefully when RESEND_API_KEY is not set", async () => {
    const { sendInquiryConfirmationEmail } = await import("./email");
    const result = await sendInquiryConfirmationEmail({
      clientName: "Test Client",
      clientEmail: "test@example.com",
      serviceLabel: "Fast Bag Fill",
    });
    expect(result).toBe(false);
  });
});

// ── Live send test (only when RESEND_API_KEY is present) ─────────────────────

describe("sendAgreementEmail (live, skipped without key)", () => {
  it("sends a real email when RESEND_API_KEY is configured", async () => {
    if (!process.env.RESEND_API_KEY) {
      console.log("[email test] Skipping live send — RESEND_API_KEY not set");
      return;
    }
    const { sendAgreementEmail } = await import("./email");
    // Send to Resend's built-in test address so no real email is delivered
    const result = await sendAgreementEmail({
      clientName: "Dayna Brown",
      clientEmail: "delivered@resend.dev",
      signingToken: "test-token-vitest-" + Date.now(),
      serviceLabel: "Curated Resale & Consignment",
    });
    expect(result).toBe(true);
  });
});
