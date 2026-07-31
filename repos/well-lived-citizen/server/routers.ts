import { z } from "zod";
import { randomUUID } from "crypto";
import {
  getAllInquiries,
  getInquiryById,
  getAttachmentsByInquiryId,
  insertInquiry,
  updateInquiryStatus,
  upsertUser,
  getUserByOpenId,
  createAgreement,
} from "./db";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { COOKIE_NAME } from "../shared/const";
import { createSessionToken, verifySessionToken } from "./auth";
import { notifyOwner } from "./notify";
import { sendAgreementEmail, sendInquiryConfirmationEmail } from "./email";
import { agreementRouter } from "./routers/agreement";

// Human-readable service labels for emails
const SERVICE_LABELS: Record<string, string> = {
  "reset": "Home Reset & Move Support",
  "house-calls": "House Calls",
  "resale": "Curated Resale & Consignment",
  "fast-bag": "Fast Bag Fill",
  "legacy": "Legacy Planning & Inventory",
  "not-sure": "General Inquiry",
};

// ─── Inquiry Router ───────────────────────────────────────────────────────────

const inquiryRouter = router({
  // Public: submit a new intake inquiry
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email required"),
        phone: z.string().optional(),
        neighborhood: z.string().optional(),
        service: z.string().min(1, "Service selection required"),
        urgency: z.string().optional(),
        situation: z.string().optional(),
        preferredContact: z.string().optional(),
        bestTime: z.string().optional(),
        hearAbout: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await insertInquiry({
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        neighborhood: input.neighborhood ?? null,
        service: input.service,
        urgency: input.urgency ?? null,
        situation: input.situation ?? null,
        preferredContact: input.preferredContact ?? null,
        bestTime: input.bestTime ?? null,
        hearAbout: input.hearAbout ?? null,
        status: "new",
      });

      // Return the insertId so the frontend can upload files against it
      const insertId = (result as unknown as { insertId: number }).insertId;

      // Auto-create consignment agreement for resale / fast-bag inquiries
      let signingToken: string | null = null;
      const isResaleService = input.service === "resale" || input.service === "fast-bag";
      if (isResaleService && insertId) {
        try {
          const token = randomUUID();
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
          await createAgreement({
            inquiryId: insertId,
            token,
            clientName: input.name,
            clientEmail: input.email,
            expiresAt,
            sentAt: new Date(),
          });
          signingToken = token;
        } catch (err) {
          console.warn("[agreement] Failed to auto-create agreement:", err);
        }
      }

      // Send emails — all fire-and-forget, never block the response
      const serviceLabel = SERVICE_LABELS[input.service] ?? input.service;

      // 1. Confirmation email to client (all services)
      sendInquiryConfirmationEmail({
        clientName: input.name,
        clientEmail: input.email,
        serviceLabel,
      }).catch(() => {});

      // 2. Agreement signing email to client (resale / fast-bag only)
      if (signingToken) {
        sendAgreementEmail({
          clientName: input.name,
          clientEmail: input.email,
          signingToken,
          serviceLabel,
        }).catch(() => {});
      }

      // 3. Notify Dayna — fire-and-forget, never blocks the response
      notifyOwner({
        title: `New inquiry from ${input.name}`,
        content: [
          `Service: ${input.service}`,
          `Email: ${input.email}`,
          input.phone ? `Phone: ${input.phone}` : null,
          input.neighborhood ? `Neighborhood: ${input.neighborhood}` : null,
          input.urgency ? `Urgency: ${input.urgency}` : null,
          input.situation ? `\n"${input.situation}"` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      }).catch(() => {}); // explicit catch so no unhandled rejection

      return { success: true, inquiryId: insertId, signingToken };
    }),

  // Admin: list all inquiries
  list: adminProcedure.query(async () => {
    return getAllInquiries();
  }),

  // Admin: get a single inquiry with its attachments
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const inquiry = await getInquiryById(input.id);
      if (!inquiry) return null;
      const attachments = await getAttachmentsByInquiryId(input.id);
      return { ...inquiry, attachments };
    }),

  // Admin: update inquiry status
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "booked", "closed", "archived"]),
      })
    )
    .mutation(async ({ input }) => {
      await updateInquiryStatus(input.id, input.status);
      return { success: true };
    }),
});

// ─── Auth Router ──────────────────────────────────────────────────────────────

const authRouter = router({
  me: publicProcedure.query(({ ctx }) => ctx.user ?? null),

  // Simple owner login with a secret key (no OAuth needed for this private admin)
  adminLogin: publicProcedure
    .input(z.object({ secret: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const ownerSecret = process.env.ADMIN_SECRET;
      if (!ownerSecret) throw new Error("Admin access is not configured");
      if (input.secret !== ownerSecret) {
        throw new Error("Invalid credentials");
      }

      // Ensure owner user exists
      const ownerOpenId = process.env.OWNER_OPEN_ID || "owner";
      await upsertUser({
        openId: ownerOpenId,
        name: "Dayna Brown",
        email: "dayna@thewelllivedcitizen.com",
        role: "admin",
        lastSignedIn: new Date(),
      });

      const user = await getUserByOpenId(ownerOpenId);
      const token = await createSessionToken({ openId: ownerOpenId, role: "admin" });

      const isSecure = ctx.req.protocol === "https" ||
        ctx.req.headers["x-forwarded-proto"] === "https";

      ctx.res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: "/",
      });

      return { success: true, user };
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie(COOKIE_NAME, { path: "/" });
    return { success: true };
  }),
});

// ─── App Router ───────────────────────────────────────────────────────────────

export const appRouter = router({
  inquiry: inquiryRouter,
  auth: authRouter,
  agreement: agreementRouter,
});

export type AppRouter = typeof appRouter;
