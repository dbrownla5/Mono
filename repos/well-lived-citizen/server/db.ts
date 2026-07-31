import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  consignmentAgreements,
  fileAttachments,
  inquiries,
  InsertConsignmentAgreement,
  InsertFileAttachment,
  InsertInquiry,
  InsertUser,
  users,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  (["name", "email", "loginMethod"] as const).forEach((field) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  });

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export async function insertInquiry(data: InsertInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inquiries).values(data);
  return result[0];
}

export async function getAllInquiries() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(inquiries).orderBy(inquiries.createdAt);
}

export async function getInquiryById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateInquiryStatus(
  id: number,
  status: "new" | "contacted" | "booked" | "closed" | "archived"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
}

// ─── File Attachments ─────────────────────────────────────────────────────────

export async function insertFileAttachment(data: InsertFileAttachment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(fileAttachments).values(data);
  return result[0];
}

export async function getAttachmentsByInquiryId(inquiryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(fileAttachments)
    .where(eq(fileAttachments.inquiryId, inquiryId));
}

// ─── Consignment Agreements ───────────────────────────────────────────────────

export async function createAgreement(data: InsertConsignmentAgreement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(consignmentAgreements).values(data);
  return result[0];
}

export async function getAgreementByToken(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .select()
    .from(consignmentAgreements)
    .where(eq(consignmentAgreements.token, token))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAgreementByInquiryId(inquiryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .select()
    .from(consignmentAgreements)
    .where(eq(consignmentAgreements.inquiryId, inquiryId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function markAgreementSigned(
  token: string,
  signatureData: string,
  signerIp: string,
  pdfStorageKey: string,
  pdfStorageUrl: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(consignmentAgreements)
    .set({
      status: "signed",
      signatureData,
      signerIp,
      pdfStorageKey,
      pdfStorageUrl,
      signedAt: new Date(),
    })
    .where(eq(consignmentAgreements.token, token));
}

export async function updateAgreementStatus(
  id: number,
  status: "pending" | "signed" | "expired" | "cancelled"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(consignmentAgreements)
    .set({ status })
    .where(eq(consignmentAgreements.id, id));
}
