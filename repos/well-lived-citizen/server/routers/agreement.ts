/**
 * agreement.ts — tRPC router for consignment agreement e-sign flow
 * The Well Lived Citizen
 *
 * Procedures:
 *   agreement.getByToken      — public, fetches agreement for signing page
 *   agreement.sign            — public, submits signature + generates PDF
 *   agreement.getByInquiryId  — admin, fetches agreement status for a given inquiry
 *   agreement.send            — admin, creates/resends agreement for an inquiry
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { publicProcedure, protectedProcedure, router } from "../trpc";
import {
  createAgreement,
  getAgreementByToken,
  getAgreementByInquiryId,
  markAgreementSigned,
  getInquiryById,
} from "../db";
import { storagePut } from "../storage";
import { generateAgreementPdf } from "../agreementPdf";
import { notifyOwner } from "../notify";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getClientIp(req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    return first.trim();
  }
  return req.socket?.remoteAddress ?? "unknown";
}

// ── Router ───────────────────────────────────────────────────────────────────

export const agreementRouter = router({
  /**
   * Public: fetch agreement data for the signing page.
   * Returns null if not found or already signed/expired.
   */
  getByToken: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .query(async ({ input }) => {
      const agreement = await getAgreementByToken(input.token);
      if (!agreement) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agreement not found." });
      }
      // Check expiry
      if (agreement.expiresAt < new Date()) {
        throw new TRPCError({ code: "FORBIDDEN", message: "This agreement link has expired." });
      }
      // Return safe subset (no signature data, no PDF key)
      return {
        id: agreement.id,
        clientName: agreement.clientName,
        clientEmail: agreement.clientEmail,
        status: agreement.status,
        sentAt: agreement.sentAt,
        expiresAt: agreement.expiresAt,
        signedAt: agreement.signedAt ?? null,
      };
    }),

  /**
   * Public: submit the client's drawn signature.
   * Generates a PDF, stores it in S3, marks the agreement signed.
   */
  sign: publicProcedure
    .input(
      z.object({
        token: z.string().min(1),
        signatureDataUrl: z
          .string()
          .min(1)
          .refine((v) => v.startsWith("data:image/png;base64,"), {
            message: "Signature must be a PNG data URL.",
          }),
        agreedToTerms: z.literal(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const agreement = await getAgreementByToken(input.token);
      if (!agreement) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agreement not found." });
      }
      if (agreement.status === "signed") {
        throw new TRPCError({ code: "CONFLICT", message: "This agreement has already been signed." });
      }
      if (agreement.expiresAt < new Date()) {
        throw new TRPCError({ code: "FORBIDDEN", message: "This agreement link has expired." });
      }

      const signerIp = getClientIp(ctx.req as Parameters<typeof getClientIp>[0]);
      const signedAt = new Date();

      // Generate PDF
      const pdfBytes = await generateAgreementPdf({
        clientName: agreement.clientName,
        clientEmail: agreement.clientEmail,
        signedAt,
        signerIp,
        signatureDataUrl: input.signatureDataUrl,
        inquiryId: agreement.inquiryId,
      });

      // Store PDF in S3
      const pdfKey = `agreements/${agreement.token}/signed-agreement.pdf`;
      const { key: pdfStorageKey, url: pdfStorageUrl } = await storagePut(
        pdfKey,
        Buffer.from(pdfBytes),
        "application/pdf"
      );

      // Mark signed in DB
      await markAgreementSigned(
        input.token,
        input.signatureDataUrl,
        signerIp,
        pdfStorageKey,
        pdfStorageUrl
      );

      // Notify owner
      await notifyOwner({
        title: "Consignment Agreement Signed",
        content: `${agreement.clientName} (${agreement.clientEmail}) has signed the consignment agreement for inquiry #${agreement.inquiryId}. The signed PDF is ready in the admin dashboard.`,
      });

      return { success: true, signedAt };
    }),

  /**
   * Admin: fetch agreement status for a specific inquiry.
   */
  getByInquiryId: protectedProcedure
    .input(z.object({ inquiryId: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const agreement = await getAgreementByInquiryId(input.inquiryId);
      if (!agreement) return null;
      return {
        id: agreement.id,
        status: agreement.status,
        clientName: agreement.clientName,
        clientEmail: agreement.clientEmail,
        sentAt: agreement.sentAt,
        signedAt: agreement.signedAt ?? null,
        expiresAt: agreement.expiresAt,
        pdfStorageUrl: agreement.pdfStorageUrl ?? null,
        token: agreement.token,
      };
    }),

  /**
   * Admin: create or resend a consignment agreement for an inquiry.
   * Generates a new token (invalidating any previous pending agreement).
   */
  send: protectedProcedure
    .input(
      z.object({
        inquiryId: z.number().int().positive(),
        origin: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const inquiry = await getInquiryById(input.inquiryId);
      if (!inquiry) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Inquiry not found." });
      }

      const token = randomUUID();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await createAgreement({
        inquiryId: inquiry.id,
        token,
        clientName: inquiry.name,
        clientEmail: inquiry.email,
        expiresAt,
        sentAt: new Date(),
      });

      const signingUrl = `${input.origin}/sign/${token}`;

      return {
        success: true,
        token,
        signingUrl,
        expiresAt,
      };
    }),
});
