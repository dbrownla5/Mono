import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  bigint,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Inquiries ────────────────────────────────────────────────────────────────
// Every submission from the intake form on the Contact page.
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),

  // Contact info
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  neighborhood: varchar("neighborhood", { length: 255 }),

  // Service interest
  service: varchar("service", { length: 64 }).notNull(),
  urgency: varchar("urgency", { length: 64 }),
  situation: text("situation"),

  // Preferences
  preferredContact: varchar("preferredContact", { length: 32 }),
  bestTime: varchar("bestTime", { length: 32 }),
  hearAbout: varchar("hearAbout", { length: 64 }),

  // Status tracking (for Dayna's admin view)
  status: mysqlEnum("status", ["new", "contacted", "booked", "closed", "archived"])
    .default("new")
    .notNull(),

  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

// ─── File Attachments ─────────────────────────────────────────────────────────
// Files uploaded by clients with their inquiry (photos of spaces, items, etc.)
export const fileAttachments = mysqlTable("file_attachments", {
  id: int("id").autoincrement().primaryKey(),
  inquiryId: int("inquiryId").notNull(),

  // S3 storage reference
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 1024 }).notNull(),

  // File metadata
  originalName: varchar("originalName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  sizeBytes: bigint("sizeBytes", { mode: "number" }).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FileAttachment = typeof fileAttachments.$inferSelect;
export type InsertFileAttachment = typeof fileAttachments.$inferInsert;

// ─── Consignment Agreements ───────────────────────────────────────────────────
// Generated when a resale/consignment inquiry is submitted.
// Client signs via a unique token-based URL; signed PDF is stored in S3.
export const consignmentAgreements = mysqlTable("consignment_agreements", {
  id: int("id").autoincrement().primaryKey(),
  inquiryId: int("inquiryId").notNull(),

  // Unique token for the public signing URL (UUID)
  token: varchar("token", { length: 128 }).notNull().unique(),

  // Client info captured at agreement generation time
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }).notNull(),

  // Agreement status
  status: mysqlEnum("status", ["pending", "signed", "expired", "cancelled"])
    .default("pending")
    .notNull(),

  // Signature data (base64 PNG of the drawn signature)
  signatureData: text("signatureData"),

  // Signed PDF stored in S3
  pdfStorageKey: varchar("pdfStorageKey", { length: 512 }),
  pdfStorageUrl: varchar("pdfStorageUrl", { length: 1024 }),

  // IP address of signer for audit trail
  signerIp: varchar("signerIp", { length: 64 }),

  // Timestamps
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  signedAt: timestamp("signedAt"),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ConsignmentAgreement = typeof consignmentAgreements.$inferSelect;
export type InsertConsignmentAgreement = typeof consignmentAgreements.$inferInsert;
