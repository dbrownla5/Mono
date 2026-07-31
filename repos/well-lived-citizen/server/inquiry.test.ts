import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./trpc";

// Mock the database module so tests don't need a real DB
vi.mock("./db", () => ({
  insertInquiry: vi.fn().mockResolvedValue({ insertId: 42 }),
  getAllInquiries: vi.fn().mockResolvedValue([]),
  getInquiryById: vi.fn().mockResolvedValue(null),
  getAttachmentsByInquiryId: vi.fn().mockResolvedValue([]),
  updateInquiryStatus: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(null),
}));

function makePublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { cookie: vi.fn(), clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeAdminCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "owner",
      name: "Dayna Brown",
      email: "dayna@thewelllivedcitizen.com",
      loginMethod: null,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { cookie: vi.fn(), clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("inquiry.submit", () => {
  it("accepts a valid inquiry and returns an inquiryId", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.inquiry.submit({
      name: "Jane Smith",
      email: "jane@example.com",
      service: "reset",
      situation: "My closet has been a disaster since the move.",
    });
    expect(result.success).toBe(true);
    expect(result.inquiryId).toBe(42);
  });

  it("rejects an inquiry with an invalid email", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.inquiry.submit({
        name: "Jane Smith",
        email: "not-an-email",
        service: "reset",
      })
    ).rejects.toThrow();
  });

  it("rejects an inquiry with no name", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.inquiry.submit({
        name: "",
        email: "jane@example.com",
        service: "reset",
      })
    ).rejects.toThrow();
  });
});

describe("inquiry.list", () => {
  it("allows admin to list inquiries", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.inquiry.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("blocks non-admin from listing inquiries", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.inquiry.list()).rejects.toThrow();
  });
});

describe("auth.logout", () => {
  it("clears the session cookie and returns success", async () => {
    const ctx = makePublicCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
    expect((ctx.res.clearCookie as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1);
  });
});
