import fs from "node:fs/promises";
import mysql from "mysql2/promise";

const BUSINESS_INFO_ID = 1;
const sourcePath = "/home/ubuntu/wlc_zip_review/skills/well-lived-citizen/references/business-info.json";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed business info.");
}

const raw = await fs.readFile(sourcePath, "utf8");
const seed = JSON.parse(raw);

const values = {
  id: BUSINESS_INFO_ID,
  businessName: seed.businessName || "The Well Lived Citizen",
  legalEntity: seed.legalEntity || "Well Dressed Citizen LLC",
  city: seed.city || "Los Angeles",
  serviceArea: "Los Angeles and surrounding areas.",
  primaryPhone: "(323) 433-1350",
  primaryPhoneRaw: "3234331350",
  workingPhone: "(310) 993-0204",
  workingPhoneRaw: "3109930204",
  zellePhone: seed.zellePhone || "(310) 993-0204",
  zellePhoneRaw: seed.zellePhoneRaw || "3109930204",
  primaryEmail: seed.primaryEmail || "dayna@thewelllivedcitizen.com",
  zelleEmail: seed.zelleEmail || seed.primaryEmail || "dayna@thewelllivedcitizen.com",
  venmoHandle: seed.venmoHandle || "",
  stripePaymentLink: seed.stripePaymentLink || "",
  calendarLink: seed.calendarLink || "",
  instagramMain: seed.instagramMain || "https://instagram.com/thewelllivedcitizen",
  instagramCloset: seed.instagramCloset || "https://instagram.com/thewelllivedcloset",
  instagramArchive: seed.instagramArchive || "https://instagram.com/welldressedcitizen",
  facebook: seed.facebook || "https://facebook.com/thewelllivedcitizen",
  poshmarkUrl: seed.poshmarkUrl || "https://posh.mk/HLUmmsrzq2b",
  ebayUrl: seed.ebayUrl || "https://ebay.us/m/cUjlUb",
  responseTime: seed.responseTime || "Within 24 hours. Text for urgent requests.",
  hoursNote: "By appointment. Text for urgent requests.",
  paymentNote: "Zelle using the email below.",
  homeOrganizationSummary: "Home Organization & Modern Move",
  legacySummary: "Legacy Planning & Inventory Catalog",
  houseCallsSummary: "House Calls",
  resaleSummary: "Curated Resale & Consignment",
};

const columns = Object.keys(values);
const placeholders = columns.map(() => "?").join(", ");
const updateClause = columns
  .filter((column) => column !== "id")
  .map((column) => `${column} = VALUES(${column})`)
  .join(", ");

const sql = `
  INSERT INTO businessInfo (${columns.join(", ")})
  VALUES (${placeholders})
  ON DUPLICATE KEY UPDATE ${updateClause}
`;

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  await connection.execute(sql, columns.map((column) => values[column]));
  const [rows] = await connection.execute(
    "SELECT id, businessName, primaryPhone, primaryPhoneRaw, workingPhone, workingPhoneRaw, primaryEmail, zelleEmail FROM businessInfo WHERE id = ? LIMIT 1",
    [BUSINESS_INFO_ID],
  );
  console.log(JSON.stringify(rows, null, 2));
} finally {
  await connection.end();
}
