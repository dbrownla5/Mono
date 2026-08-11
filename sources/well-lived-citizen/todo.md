# The Well Lived Citizen — Project TODO

## Full-Stack Conversion + File Storage

- [x] Design database schema: inquiries table + file_attachments table
- [x] Run pnpm db:push to push schema to remote database
- [x] Build server/db.ts helpers: insertInquiry, getInquiries, insertAttachment, getAttachmentsByInquiry
- [x] Build tRPC procedures: inquiry.submit, inquiry.list (admin), inquiry.getById (admin)
- [x] Build tRPC procedures: upload.getPresignedUrl or storagePut flow for file attachments
- [x] Migrate Contact.tsx intake form to use trpc.inquiry.submit.useMutation
- [x] Add file upload UI to intake form (optional photos/docs, max 5 files, 16MB each)
- [x] Build admin dashboard page (/admin) — owner-only, lists all inquiries
- [x] Admin inquiry detail view — shows all fields + file attachments with download links
- [x] Wire notifyOwner on new inquiry submission (optional enhancement — ADMIN_SECRET env var secured)
- [x] Update App.tsx routes to include /admin
- [x] Write vitest tests for inquiry.submit and inquiry.list procedures
- [x] Save checkpoint and deliver

## Voice & FAQ Updates (Session 3)

- [x] Convert all "we/our/us" language to first-person singular (I/my/me) across every page — site is a solo practice
- [x] Add FAQ entry to HomeReset page: "Do you do full moves? Are you licensed? Do you bring a team?"
- [x] Add same FAQ entry to main FAQ page

## E-Sign Consignment Agreement Flow

- [x] Add consignmentAgreements table to drizzle/schema.ts
- [x] Run pnpm db:push to push new table
- [x] Build server/db.ts helpers: createAgreement, getAgreementByToken, markAgreementSigned, getAgreementByInquiryId
- [x] Build server/routers/agreement.ts with tRPC procedures: getByToken, sign, getByInquiryId (admin), sendAgreement
- [x] Install pdf-lib for server-side PDF generation
- [x] Build server/agreementPdf.ts: generate PDF from agreement data + embedded signature
- [x] Build client/src/pages/SignAgreement.tsx: public signing page with signature canvas
- [x] Register /sign/:token route in App.tsx
- [x] Update Admin.tsx to show agreement status per inquiry and send/resend agreement button
- [x] Auto-send agreement link when resale inquiry is submitted (inquiry.submit mutation)
- [x] Write vitest tests for agreement procedures
- [x] Save checkpoint

## Pre-Launch Overnight Tasks

- [x] Wire Instagram (@thewelllivedcitizen, @thewelllivedcloset) and Poshmark links into Footer
- [x] Add social icon links to Nav mobile drawer
- [x] Add Open Graph and Twitter Card meta tags to index.html
- [x] Fix sitemap — generate proper XML sitemap at /sitemap.xml (not HTML)
- [x] Add robots.txt pointing to sitemap
- [x] Add payment methods section to Pricing page (Venmo, Zelle, Cash App, card)
- [x] Write 5–6 Instagram posts for personal account (back in LA announcement)
- [x] Write 3–4 Instagram posts for @thewelllivedcitizen (business launch)
- [x] Write 2–3 Instagram posts for @thewelllivedcloset (resale/closet launch)
- [x] TypeScript check, tests, save checkpoint

## Copy Rewrite — Dayna's Real Voice

- [x] Apply new hero subhead to Home.tsx ("Most people don't need a consultant...")
- [x] Apply "I touch everything. That's the point." tagline to hero
- [x] Replace Start Here intro paragraph with Dayna's real voice copy
- [x] Add services intro block below service list ("Every service on this site came from a real situation...")
- [x] Replace About strip headline with "I'm invisible but I'm not..." quote
- [x] Replace About strip body copy with retail ops / CEO / "I don't know what scares me" voice
- [x] Replace About.tsx founder statement with new copy from copy-draft.md
- [x] Replace About.tsx credentials box with factual credentials strip
- [x] TypeScript: 0 errors. Tests: 22/22 passing

## Voice Framework Rewrite (Session 5)

- [x] Apply new brand voice framework to Home.tsx hero — "Thoughtful stewardship for your household" / "invisible friction and deferred decisions"
- [x] Rewrite Start Here intro using elevator pitch register ("practical household stewardship... preserving continuity through every transition")
- [x] Rewrite House Calls card — "the kind of observant help a neighbor once offered"
- [x] Rewrite services overview intro — "elegant, real-world solutions for the practical realities people have learned to live with"
- [x] Rewrite About strip — "My background wasn't in homes. It was in seeing how entire systems work." / "competence is its own form of care"
- [x] Rewrite About.tsx founder narrative using 360-degree operational perspective framework
- [x] TypeScript: 0 errors. Tests: 22/22 passing

## Architecture Fix — Four Pillars (Session 5 continued)

- [x] Fix Nav: Pillar 04 corrected to Curated Resale & Consignment (was Closeout & Dispersal); Quick Books reduced to 3 (removed The Closeout)
- [x] Fix Services page: rewritten as correct two-layer architecture — four pillars + Quick Books section; removed standalone Closeout card; copy from locked docs
- [x] Fix Pricing page: removed standalone Closeout card; folded under Pillar 01 as scope add-on; renumbered to four pillars
- [x] Fix Footer: service links now reflect four pillars + All Services; removed Closeout as standalone link
- [x] TypeScript: 0 errors. Tests: 22/22 passing
