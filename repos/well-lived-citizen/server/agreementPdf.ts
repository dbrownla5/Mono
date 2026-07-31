/**
 * agreementPdf.ts — The Well Lived Citizen
 * Generates a signed consignment agreement PDF using pdf-lib.
 * The PDF contains the full agreement text, client info, and the drawn signature.
 */

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from "pdf-lib";

export interface AgreementData {
  clientName: string;
  clientEmail: string;
  signedAt: Date;
  signerIp?: string;
  signatureDataUrl: string; // base64 PNG data URL
  inquiryId: number;
}

const BRAND_COLOR = rgb(0.22, 0.19, 0.18); // --ink (#38302E)
const SAGE_COLOR = rgb(0.63, 0.67, 0.58);  // --sage (#A2A895)
const LIGHT_GRAY = rgb(0.83, 0.80, 0.76);  // --warm-gray-lt

function drawHRule(page: PDFPage, y: number, margin: number, width: number) {
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 0.5,
    color: LIGHT_GRAY,
  });
}

function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function generateAgreementPdf(data: AgreementData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const PAGE_WIDTH = 612;  // US Letter
  const PAGE_HEIGHT = 792;
  const MARGIN = 60;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  function addPage() {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  }

  function checkSpace(needed: number) {
    if (y - needed < MARGIN + 40) addPage();
  }

  // ── Header ──────────────────────────────────────────────────────────────────
  page.drawText("THE WELL LIVED CITIZEN", {
    x: MARGIN,
    y,
    size: 9,
    font: boldFont,
    color: SAGE_COLOR,
  });
  y -= 18;

  page.drawText("Consignment Agreement", {
    x: MARGIN,
    y,
    size: 22,
    font: boldFont,
    color: BRAND_COLOR,
  });
  y -= 8;

  drawHRule(page, y, MARGIN, PAGE_WIDTH);
  y -= 20;

  // ── Client Info Block ────────────────────────────────────────────────────────
  const dateStr = data.signedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = data.signedAt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const infoRows = [
    ["Client Name", data.clientName],
    ["Client Email", data.clientEmail],
    ["Inquiry Reference", `#${data.inquiryId}`],
    ["Date Signed", `${dateStr} at ${timeStr}`],
    ...(data.signerIp ? [["IP Address", data.signerIp]] : []),
  ];

  for (const [label, value] of infoRows) {
    page.drawText(label, { x: MARGIN, y, size: 8, font: boldFont, color: SAGE_COLOR });
    page.drawText(value, { x: MARGIN + 130, y, size: 9, font: regularFont, color: BRAND_COLOR });
    y -= 16;
  }

  y -= 10;
  drawHRule(page, y, MARGIN, PAGE_WIDTH);
  y -= 24;

  // ── Agreement Body ───────────────────────────────────────────────────────────
  const sections: { heading: string; body: string }[] = [
    {
      heading: "1. Scope of Service",
      body: "The Well Lived Citizen (\"Consultant\"), operated by Dayna Brown, agrees to provide curated resale and consignment services for items submitted by the Client. The Consultant will evaluate, photograph, research, and list items on appropriate resale platforms at her sole discretion.",
    },
    {
      heading: "2. Commission Structure",
      body: "The Consultant retains 55% of the gross sale price of each item sold. The Client receives 45% of the gross sale price. No upfront fees are charged. Commission is earned only upon a completed sale.",
    },
    {
      heading: "3. Item Evaluation & Acceptance",
      body: "The Consultant reserves the right to decline any item that, in her professional judgment, is unlikely to sell, is damaged beyond reasonable resale condition, or is a counterfeit or unauthorized reproduction. Items declined will be returned to the Client or donated at the Client's direction.",
    },
    {
      heading: "4. Pricing & Platform Selection",
      body: "The Consultant determines listing price and platform selection based on market research, seasonality, and professional judgment. The Client may request a price floor for specific items in writing prior to listing. The Consultant is not obligated to accept price floor requests that would make a listing commercially unviable.",
    },
    {
      heading: "5. Payout Schedule",
      body: "The Consultant will provide a sales report by the 1st of each month covering the prior month's completed sales. Payment of the Client's 45% share will be made by the 5th of each month via the Client's preferred payment method on file.",
    },
    {
      heading: "6. Item Care & Liability",
      body: "The Consultant will handle all items with reasonable care. The Consultant is not liable for normal wear, minor damage incurred during standard handling, or loss due to circumstances beyond her control. The Client warrants that all submitted items are their lawful property and free of any liens or encumbrances.",
    },
    {
      heading: "7. Unsold Items",
      body: "Items that remain unsold after 90 days may be returned to the Client, donated to a charitable organization, or relisted at a reduced price, at the Consultant's discretion and with reasonable notice to the Client.",
    },
    {
      heading: "8. Termination",
      body: "Either party may terminate this agreement with 7 days written notice. Upon termination, unsold items will be returned to the Client within a reasonable timeframe. Items already listed or in transit at the time of termination will be handled to completion.",
    },
    {
      heading: "9. Confidentiality",
      body: "The Consultant will not disclose Client information to third parties except as necessary to complete a sale (e.g., shipping address to a buyer). Client information is never sold or shared for marketing purposes.",
    },
    {
      heading: "10. Governing Law",
      body: "This agreement is governed by the laws of the State of California. Any disputes will be resolved in Los Angeles County.",
    },
  ];

  for (const section of sections) {
    const headingHeight = 14;
    const bodyLines = wrapText(section.body, CONTENT_WIDTH, regularFont, 9);
    const sectionHeight = headingHeight + bodyLines.length * 13 + 16;

    checkSpace(sectionHeight);

    page.drawText(section.heading, {
      x: MARGIN,
      y,
      size: 10,
      font: boldFont,
      color: BRAND_COLOR,
    });
    y -= headingHeight;

    for (const line of bodyLines) {
      page.drawText(line, {
        x: MARGIN,
        y,
        size: 9,
        font: regularFont,
        color: BRAND_COLOR,
        opacity: 0.85,
      });
      y -= 13;
    }
    y -= 12;
  }

  // ── Signature Block ──────────────────────────────────────────────────────────
  checkSpace(180);

  drawHRule(page, y, MARGIN, PAGE_WIDTH);
  y -= 24;

  page.drawText("CLIENT SIGNATURE", {
    x: MARGIN,
    y,
    size: 8,
    font: boldFont,
    color: SAGE_COLOR,
  });
  y -= 20;

  // Embed the signature image
  try {
    const base64Data = data.signatureDataUrl.replace(/^data:image\/png;base64,/, "");
    const sigBytes = Buffer.from(base64Data, "base64");
    const sigImage = await pdfDoc.embedPng(sigBytes);
    const sigDims = sigImage.scaleToFit(240, 80);
    page.drawImage(sigImage, {
      x: MARGIN,
      y: y - sigDims.height,
      width: sigDims.width,
      height: sigDims.height,
    });
    y -= sigDims.height + 8;
  } catch {
    // Fallback: draw a placeholder line
    page.drawLine({
      start: { x: MARGIN, y: y - 40 },
      end: { x: MARGIN + 240, y: y - 40 },
      thickness: 1,
      color: BRAND_COLOR,
    });
    y -= 50;
  }

  page.drawText(data.clientName, {
    x: MARGIN,
    y,
    size: 10,
    font: boldFont,
    color: BRAND_COLOR,
  });
  y -= 14;

  page.drawText(`Signed electronically on ${dateStr} at ${timeStr}`, {
    x: MARGIN,
    y,
    size: 8,
    font: italicFont,
    color: BRAND_COLOR,
    opacity: 0.6,
  });
  y -= 14;

  if (data.signerIp) {
    page.drawText(`IP: ${data.signerIp}`, {
      x: MARGIN,
      y,
      size: 7,
      font: regularFont,
      color: BRAND_COLOR,
      opacity: 0.45,
    });
    y -= 12;
  }

  y -= 16;
  drawHRule(page, y, MARGIN, PAGE_WIDTH);
  y -= 16;

  // ── Footer ───────────────────────────────────────────────────────────────────
  page.drawText("The Well Lived Citizen  ·  Los Angeles, CA  ·  thewelllivedcitizen.com", {
    x: MARGIN,
    y,
    size: 7,
    font: regularFont,
    color: BRAND_COLOR,
    opacity: 0.4,
  });

  return pdfDoc.save();
}
