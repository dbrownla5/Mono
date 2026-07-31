/*
 * PILLAR 04 — CURATED RESALE & CONSIGNMENT
 * The Well Lived Citizen
 * Copy: verbatim from FOLDER_3 Service Page 04 (Source-Corrected & Locked)
 * Voice: conversion-first, trust-forward, no philosophy spiral
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className="fade-up">{children}</div>;
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-trigger" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span style={{ fontSize: "1.2rem", fontWeight: 300, flexShrink: 0, color: "var(--sage)" }}>{open ? "−" : "+"}</span>
      </button>
      <div className="faq-content" style={{ maxHeight: open ? 500 : 0 }}>
        <div className="faq-body">{a}</div>
      </div>
    </div>
  );
}

export default function CuratedResalePillar() {
  return (
    <div style={{ backgroundColor: "var(--parchment)", minHeight: "100vh" }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{ backgroundColor: "var(--ink)", paddingTop: "10rem", paddingBottom: "7rem" }}>
        <div className="container">
          <div style={{ maxWidth: 740 }}>
            <span className="eyebrow eyebrow-light">Pillar 04</span>
            <h1 className="display-lg" style={{ color: "var(--parchment)", marginBottom: "1.5rem" }}>
              Curated Resale<br />&amp; Consignment
            </h1>
            <p style={{ fontSize: "1.1rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.8, marginBottom: "0.75rem" }}>
              Trust-forward thoughtful curation.
            </p>
            <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(248,244,227,0.6)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
              For the things that still have value, story, or second-market potential — without asking you to become a part-time reseller.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-sage">Schedule a Resale Pickup</Link>
              <Link href="/pricing" className="btn btn-outline-light">View Commission Structure</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT THIS IS ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "6rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "5rem", alignItems: "start" }}>
            <FadeUp>
              <span className="eyebrow eyebrow-sage">What This Is</span>
              <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "2rem" }}>
                Best for items that deserve thoughtful placement.
              </h2>
              <p className="body-lg" style={{ marginBottom: "1.5rem" }}>
                This service is best for items that have been well cared for, still hold real market interest, or deserve thoughtful placement through story-led resale. It is built for clothing, designer accessories, jewelry, home decor, furniture, art, rare textiles, and story-rich vintage.
              </p>
              <p className="body-lg">
                The point is not volume. The point is thoughtful curation that creates the best next life for the item and the most realistic return for you.
              </p>
            </FadeUp>

            <FadeUp delay={80}>
              <div style={{ backgroundColor: "var(--parchment-mid)", padding: "2.5rem", boxShadow: "6px 6px 0px var(--sage)" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "1.5rem" }}>
                  The Work Includes
                </p>
                {[
                  "Pickup and intake",
                  "Evaluation and photography",
                  "Platform matching and pricing",
                  "Buyer communication",
                  "Routing and return logic",
                  "Donation reroute when appropriate",
                  "Monthly reporting",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", padding: "0.7rem 0", borderBottom: "1px solid var(--warm-gray-lt)" }}>
                    <span style={{ width: 5, height: 5, backgroundColor: "var(--sage)", flexShrink: 0, marginTop: "0.45rem" }} />
                    <span style={{ fontSize: "0.9rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── THE DOORWAY: FAST BAG FILL ── */}
      <section style={{ backgroundColor: "var(--ink)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
              <div>
                <div style={{ display: "inline-block", backgroundColor: "var(--sage)", padding: "0.25rem 0.75rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--parchment)" }}>Quick Book Entry</span>
                </div>
                <h2 className="display-md" style={{ color: "var(--parchment)", marginBottom: "1.5rem" }}>
                  The Fast Bag Fill
                </h2>
                <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                  A simple way to start letting clothing leave the house. The bags I send are large zip totes — they hold anywhere from three king-size pillows to three dresser drawers' worth of clothing. What you put in them is up to you.
                </p>
                <p style={{ fontSize: "0.95rem", fontWeight: 300, color: "rgba(248,244,227,0.65)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                  What I ask is that you have some sense of what’s in there. Not a spreadsheet — just a general idea. My job is to make the call on what sells, where, and when. That’s the gift I bring: years across retail, resale, high-end, and everything in between.
                </p>
                <p style={{ fontSize: "0.85rem", fontWeight: 300, color: "rgba(248,244,227,0.5)", lineHeight: 1.75, fontStyle: "italic", marginBottom: "1rem" }}>
                  What the bag is not for: a bag of old T-shirts you just don’t know what to do with. If that’s what you have, I can still help — but that’s a different conversation, and there’s a small fee for the haul. For regular clients, I’ll always take a look. That’s part of the relationship.
                </p>
                <p style={{ fontSize: "0.85rem", fontWeight: 300, color: "rgba(248,244,227,0.45)", lineHeight: 1.75, fontStyle: "italic" }}>
                  Clothing and accessories only. Home decor, furniture, art, and delicate valuables require a local consultation.
                </p>
              </div>
              <div>
                {[
                  { label: "City pickup", body: "Route-based stop-ins, building desk drops, UPS Access Points, or direct bag shipment." },
                  { label: "Same-day courier", body: "I work with 60–90 quart totes — the size that fits an Uber courier cleanly." },
                  { label: "Volume", body: "Fill what you have. I’ll tell you honestly if something isn’t worth the effort. That’s the whole point." },
                  { label: "Item standards", body: "These are things you took care of and know deserve another life. Please do not send dirty clothing, bio-risk textiles, or items with infestation concerns." },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "1.25rem 0", borderBottom: "1px solid rgba(248,244,227,0.1)" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--sage)", marginBottom: "0.4rem" }}>{item.label}</p>
                    <p style={{ fontSize: "0.88rem", fontWeight: 300, color: "rgba(248,244,227,0.65)", lineHeight: 1.7 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── WHERE ITEMS SELL ── */}
      <section style={{ backgroundColor: "var(--parchment-mid)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow eyebrow-sage">Where Items Sell</span>
            <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "1.5rem", maxWidth: 500 }}>
              Routed by category and market fit.
            </h2>
            <p className="body-lg" style={{ marginBottom: "3rem", maxWidth: 580 }}>
              Items are matched to the platform where they make the most sense — not just listed everywhere and hoped for.
            </p>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
            {[
              "Poshmark (Ambassador)",
              "eBay",
              "Etsy",
              "Facebook Marketplace",
              "Chairish",
              "Vinted",
              "Vestiaire",
              "Grailed",
              "Local high-end resale",
              "Private collector networks",
            ].map((platform, i) => (
              <FadeUp key={i} delay={i * 30}>
                <div style={{ backgroundColor: "var(--parchment)", padding: "1.25rem 1.5rem", borderLeft: "3px solid var(--sage)" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--ink)" }}>{platform}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── REALISTIC TIMELINES ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ maxWidth: 680 }}>
              <span className="eyebrow eyebrow-sage">Realistic Timelines</span>
              <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "2rem" }}>
                This is a long game, not a fast-cash service.
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {[
                  { label: "Intake Review", value: "7–10 business days once items arrive" },
                  { label: "Resale Timeline", value: "Most strong items sell within the first 90 days. Nearly everything with real demand finds its buyer within 6–9 months." },
                  { label: "Consignment Term", value: "Items are listed until sold; I'll check in at 180 days if anything hasn't moved" },
                  { label: "Monthly Report", value: "Sent by the 1st of each month" },
                  { label: "Payout", value: "Paid by the 5th via Venmo, Zelle, or check" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "2rem", alignItems: "baseline", padding: "1.25rem 0", borderBottom: "1px solid var(--warm-gray-lt)" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sage-dark)", minWidth: 140 }}>{item.label}</span>
                    <span style={{ fontSize: "0.95rem", fontWeight: 300, color: "var(--ink)", lineHeight: 1.6 }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.75, marginTop: "1.5rem", fontStyle: "italic" }}>
                Resale rewards patience, not urgency. If immediate cash is the priority, resale may not be the best route.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── COMMISSION STRUCTURE ── */}
      <section style={{ backgroundColor: "var(--sage)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
              <div>
                <span className="eyebrow" style={{ color: "var(--sage-dark)" }}>Commission Structure</span>
                <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "1.5rem" }}>
                  Judgment-first.<br />Not everything sells.
                </h2>
                <p style={{ fontSize: "0.95rem", fontWeight: 300, color: "var(--ink)", lineHeight: 1.75, marginBottom: "1.25rem", opacity: 0.85 }}>
                  I do not assume everything should be sold, and I do not assume everything is trash. I go through it piece by piece to decide what deserves effort and what is better donated.
                </p>
                <p style={{ fontSize: "0.85rem", fontWeight: 300, color: "var(--ink)", lineHeight: 1.75, marginBottom: "1.25rem", opacity: 0.7, fontStyle: "italic" }}>
                  Commission is based on net proceeds after platform and processing fees. Clean, non-sellable items route directly into approved donation channels without requiring separate client sorting.
                </p>
                <div style={{ backgroundColor: "rgba(28,25,23,0.07)", padding: "1rem 1.25rem", marginBottom: "1.5rem", borderLeft: "3px solid var(--sage-dark)" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "0.4rem" }}>Payout Rhythm</p>
                  <p style={{ fontSize: "0.88rem", fontWeight: 300, color: "var(--ink)", lineHeight: 1.7 }}>Monthly report sent by the 1st. Payment via Venmo, Zelle, or check by the 5th.</p>
                </div>
                <div style={{ backgroundColor: "rgba(28,25,23,0.07)", padding: "1rem 1.25rem", marginBottom: "2rem", borderLeft: "3px solid var(--sage-dark)" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "0.4rem" }}>Contract Required</p>
                  <p style={{ fontSize: "0.88rem", fontWeight: 300, color: "var(--ink)", lineHeight: 1.7 }}>Once your request is submitted and I accept, you’ll receive a consignment agreement to sign before pickup is confirmed. No bag moves without it.</p>
                </div>
                <Link href="/contact" className="btn btn-ink">Schedule a Resale Pickup</Link>
              </div>
              <div>
                {[
                  { category: "Clothing & Accessories", split: "55% to me / 45% to you" },
                  { category: "Designer & High-Value ($300+)", split: "50/50 split" },
                  { category: "Furniture & Significant Home Goods ($150+)", split: "50/50 split" },
                  { category: "Full Closet Liquidation (50+ items)", split: "Quoted as a volume project" },
                ].map((row, i) => (
                  <div key={i} style={{ padding: "1.5rem 0", borderBottom: "1px solid rgba(28,25,23,0.12)" }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink)", marginBottom: "0.35rem" }}>{row.category}</p>
                    <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--sage-dark)" }}>{row.split}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ backgroundColor: "var(--parchment-mid)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow eyebrow-sage">Common Questions</span>
            <h2 className="display-sm" style={{ color: "var(--ink)", marginBottom: "2.5rem" }}>Before you send anything</h2>
          </FadeUp>
          <div style={{ maxWidth: 720 }}>
            {[
              { q: "What items are best for this service?", a: "Clothing, designer accessories, jewelry, home decor, furniture, art, rare textiles, and story-rich vintage. Items that have been well cared for and still hold real market interest." },
              { q: "What can't go in the Fast Bag Fill?", a: "The Fast Bag Fill is exclusively for clothing and accessories. Home decor, furniture, art, and delicate valuables require a local consultation or project-level curation." },
              { q: "What if my items don't sell?", a: "I'll check in with you around the 180-day mark if anything hasn't moved. At that point we can talk through options — donation routing, return, or continued listing. I'll be honest with you about what's realistic before I start." },
              { q: "Do I get a report of what sold?", a: "Yes. Monthly reporting is included. You'll know what sold, on which platform, and what the net proceeds were." },
              { q: "Can I send items if I'm not in Los Angeles?", a: "Yes. For clothing, you can ship via prepaid label or courier directly. For furniture and larger home pieces, I'll coordinate a local consultation." },
              { q: "What happens to things that don't sell or can't be sold?", a: "Clean, non-sellable items route directly into approved donation channels without requiring separate client sorting. You don't have to manage that part." },
            ].map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: "var(--ink)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ maxWidth: 600 }}>
              <h2 className="display-md" style={{ color: "var(--parchment)", marginBottom: "1.5rem" }}>
                Ready to start letting things go?
              </h2>
              <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(248,244,227,0.7)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
                Schedule a resale pickup or send a Fast Bag Fill. I'll handle the rest.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/contact" className="btn btn-sage">Schedule a Resale Pickup</Link>
                <Link href="/pricing" className="btn btn-outline-light">See Commission Structure</Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
