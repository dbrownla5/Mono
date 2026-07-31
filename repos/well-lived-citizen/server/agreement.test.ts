/**
 * agreement.test.ts — vitest tests for consignment agreement tRPC procedures
 * The Well Lived Citizen
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock DB helpers ──────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  createAgreement: vi.fn(),
  getAgreementByToken: vi.fn(),
  getAgreementByInquiryId: vi.fn(),
  markAgreementSigned: vi.fn(),
  getInquiryById: vi.fn(),
}));

// ── Mock storage ──────────────────────────────────────────────────────────────
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "agreements/test/signed.pdf", url: "/manus-storage/agreements/test/signed.pdf" }),
}));

// ── Mock PDF generation ───────────────────────────────────────────────────────
vi.mock("./agreementPdf", () => ({
  generateAgreementPdf: vi.fn().mockResolvedValue(Buffer.from("fake-pdf-bytes")),
}));

// ── Mock notifications ────────────────────────────────────────────────────────
vi.mock("./notify", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import * as db from "./db";
import { agreementRouter } from "./routers/agreement";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeCaller(role: "admin" | "user" | null = "admin") {
  const user = role ? { id: 1, openId: "owner", name: "Dayna", email: "dayna@wlc.com", role, loginMethod: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() } : null;
  const req = { headers: {}, socket: { remoteAddress: "127.0.0.1" }, cookies: {} } as unknown as import("express").Request;
  const res = { cookie: vi.fn(), clearCookie: vi.fn() } as unknown as import("express").Response;
  return agreementRouter.createCaller({ user, req, res });
}

const FUTURE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
const PAST = new Date(Date.now() - 1000);

const MOCK_AGREEMENT = {
  id: 1,
  inquiryId: 42,
  token: "test-token-uuid",
  clientName: "Jane Doe",
  clientEmail: "jane@example.com",
  status: "pending" as const,
  signatureData: null,
  pdfStorageKey: null,
  pdfStorageUrl: null,
  signerIp: null,
  sentAt: new Date(),
  signedAt: null,
  expiresAt: FUTURE,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_INQUIRY = {
  id: 42,
  name: "Jane Doe",
  email: "jane@example.com",
  phone: null,
  neighborhood: null,
  service: "resale",
  urgency: null,
  situation: null,
  preferredContact: null,
  bestTime: null,
  hearAbout: null,
  status: "new" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("agreement.getByToken", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns agreement data for a valid pending token", async () => {
    vi.mocked(db.getAgreementByToken).mockResolvedValue(MOCK_AGREEMENT);
    const caller = makeCaller(null);
    const result = await caller.getByToken({ token: "test-token-uuid" });
    expect(result.clientName).toBe("Jane Doe");
    expect(result.status).toBe("pending");
  });

  it("throws NOT_FOUND for unknown token", async () => {
    vi.mocked(db.getAgreementByToken).mockResolvedValue(null);
    const caller = makeCaller(null);
    await expect(caller.getByToken({ token: "bad-token" })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("throws FORBIDDEN for expired token", async () => {
    vi.mocked(db.getAgreementByToken).mockResolvedValue({ ...MOCK_AGREEMENT, expiresAt: PAST });
    const caller = makeCaller(null);
    await expect(caller.getByToken({ token: "test-token-uuid" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("agreement.sign", () => {
  beforeEach(() => vi.clearAllMocks());

  it("successfully signs a pending agreement", async () => {
    vi.mocked(db.getAgreementByToken).mockResolvedValue(MOCK_AGREEMENT);
    vi.mocked(db.markAgreementSigned).mockResolvedValue(undefined);
    const caller = makeCaller(null);
    const result = await caller.sign({
      token: "test-token-uuid",
      signatureDataUrl: "data:image/png;base64,abc123",
      agreedToTerms: true,
    });
    expect(result.success).toBe(true);
    expect(db.markAgreementSigned).toHaveBeenCalledWith(
      "test-token-uuid",
      "data:image/png;base64,abc123",
      expect.any(String),
      expect.any(String),
      expect.any(String)
    );
  });

  it("throws CONFLICT if already signed", async () => {
    vi.mocked(db.getAgreementByToken).mockResolvedValue({ ...MOCK_AGREEMENT, status: "signed" });
    const caller = makeCaller(null);
    await expect(
      caller.sign({ token: "test-token-uuid", signatureDataUrl: "data:image/png;base64,abc123", agreedToTerms: true })
    ).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("throws FORBIDDEN if link expired", async () => {
    vi.mocked(db.getAgreementByToken).mockResolvedValue({ ...MOCK_AGREEMENT, expiresAt: PAST });
    const caller = makeCaller(null);
    await expect(
      caller.sign({ token: "test-token-uuid", signatureDataUrl: "data:image/png;base64,abc123", agreedToTerms: true })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("agreement.getByInquiryId (admin)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns agreement for admin user", async () => {
    vi.mocked(db.getAgreementByInquiryId).mockResolvedValue(MOCK_AGREEMENT);
    const caller = makeCaller("admin");
    const result = await caller.getByInquiryId({ inquiryId: 42 });
    expect(result?.clientName).toBe("Jane Doe");
  });

  it("returns null if no agreement exists", async () => {
    vi.mocked(db.getAgreementByInquiryId).mockResolvedValue(null);
    const caller = makeCaller("admin");
    const result = await caller.getByInquiryId({ inquiryId: 99 });
    expect(result).toBeNull();
  });

  it("throws FORBIDDEN for non-admin user", async () => {
    const caller = makeCaller("user");
    await expect(caller.getByInquiryId({ inquiryId: 42 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("agreement.send (admin)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates an agreement and returns signing URL", async () => {
    vi.mocked(db.getInquiryById).mockResolvedValue(MOCK_INQUIRY);
    vi.mocked(db.createAgreement).mockResolvedValue({ insertId: 1 } as unknown as ReturnType<typeof db.createAgreement> extends Promise<infer T> ? T : never);
    const caller = makeCaller("admin");
    const result = await caller.send({ inquiryId: 42, origin: "https://example.com" });
    expect(result.success).toBe(true);
    expect(result.signingUrl).toContain("https://example.com/sign/");
  });

  it("throws NOT_FOUND if inquiry does not exist", async () => {
    vi.mocked(db.getInquiryById).mockResolvedValue(null);
    const caller = makeCaller("admin");
    await expect(caller.send({ inquiryId: 999, origin: "https://example.com" })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("throws FORBIDDEN for non-admin user", async () => {
    const caller = makeCaller("user");
    await expect(caller.send({ inquiryId: 42, origin: "https://example.com" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
