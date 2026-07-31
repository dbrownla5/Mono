import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getUserByOpenId } from "./db";
import { verifySessionToken } from "./auth";
import { COOKIE_NAME } from "../shared/const";

export async function createContext({ req, res }: CreateExpressContextOptions) {
  let user = null;
  const token = req.cookies?.[COOKIE_NAME];
  if (token) {
    try {
      const payload = await verifySessionToken(token);
      if (payload?.openId) {
        user = await getUserByOpenId(payload.openId as string);
      }
    } catch {
      // Invalid token — treat as unauthenticated
    }
  }
  return { req, res, user };
}

export type TrpcContext = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<TrpcContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { ...ctx, user: ctx.user } });
});
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx: { ...ctx, user: ctx.user } });
});
