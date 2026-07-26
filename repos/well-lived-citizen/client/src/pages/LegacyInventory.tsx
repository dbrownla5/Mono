/*
 * LEGACY INVENTORY & STORY ARCHIVE — The Well Lived Citizen
 * Voice: thoughtful, serious, emotionally perceptive. Premium service.
 * This is the most emotionally resonant service. Treat it accordingly.
 */

import { useEffect, useRef } from "react";
import { Link } from "wouter";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FAQItem from "@/components/FAQItem";

const LEGACY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663617904380/mgu6hYeV9ySpxKK6swiZX2/wlc-legacy-8TNSiz8DVsigPuNsteSL9T.webp";

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

export default function LegacyInventory() {
  return (
    <div style={{ backgroundColor: "var(--parchment)", minHeight: "100vh" }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        paddingTop: "10rem",
        paddingBottom: "0",
        backgroundColor: "var(--ink)",
        overflow: "hidden",
      }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "end",
          }} className="grid-cols-1 md:grid-cols-2">
            <div style={{ paddingBottom: "5rem" }}>
              <span className="eyebrow" style={{ color: "rgba(248,244,227,0.4)" }}>Service 05</span>
              <div style={{
                display: "inline-block",
                backgroundColor: "var(--sage)",
                padding: "0.3rem 0.8rem",
                marginBottom: "1.5rem",
              }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--parchment)" }}>
                  Documentation &amp; Preservation
                </span>
              </div>
              <h1 className="display-lg" style={{ color: "var(--parchment)", marginBottom: "1.5rem" }}>
                Legacy Inventory<br />&amp; Story Archive
              </h1>
              <p style={{ fontSize: "1.1rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.75, maxWidth: 460, marginBottom: "2.5rem" }}>
                Creating clarity around the belongings and stories families should not lose track of — before urgency forces decisions to happen quickly.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <Link href="/contact" className="btn btn-sage">Schedule a Consultation</Link>
                <span style={{ fontSize: "0.8rem", fontWeight: 300, color: "rgba(248,244,227,0.45)" }}>Starting from $1,500</span>
              </div>
            </div>
            <div style={{ alignSelf: "end" }}>
              <img
                src={LEGACY_IMG}
                alt="Legacy inventory and family archive"
                style={{ width: "100%", display: "block", objectFit: "cover", maxHeight: 500 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY THIS EXISTS ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "6rem 0" }}>
        <div className="container">
          <div style={{ maxWidth: 720 }}>
            <FadeUp>
              <span className="eyebrow eyebrow-sage">Why This Exists</span>
              <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "2rem" }}>
                Most families don't realize what they have until they're in the middle of losing it.
              </h2>
              <p className="body-lg" style={{ marginBottom: "1.5rem" }}>
                A parent's health changes. A house goes on the market. Someone passes, and suddenly there are rooms full of belongings that no one has ever properly looked at — and decisions that need to be made in days or weeks that should have taken months or years.
              </p>
              <p className="body-lg" style={{ marginBottom: "1.5rem" }}>
                Legacy Inventory is designed to address this before urgency arrives. It's a thoughtful, unhurried process of documenting what a household contains — the collections, the heirlooms, the things with stories attached, and the things that simply need to be accounted for.
              </p>
              <p className="body-lg">
                The result is clarity: a documented record of what exists, what it's worth, what the stories are, and what the options are for its future. This is not a task to rush. It's one of the most meaningful things a family can do together.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section style={{ backgroundColor: "var(--ink)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow" style={{ color: "rgba(248,244,227,0.45)" }}>What's Included</span>
            <h2 className="display-md" style={{ color: "var(--parchment)", marginBottom: "3rem", maxWidth: 480 }}>
              A complete picture of what a household holds.
            </h2>
          </FadeUp>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}>
            {[
              {
                title: "Photographed inventory",
                body: "Every significant item documented with clear, high-quality photography — organized by room, category, or collection.",
              },
              {
                title: "Collection mapping",
                body: "Identification and documentation of collections — art, jewelry, books, ceramics, vintage items — with notes on provenance where known.",
              },
              {
                title: "Story and memory capture",
                body: "Recorded or written notes on the stories attached to significant items — the history, the context, the people. This is often the most valuable part.",
              },
              {
                title: "Resale and value assessment",
                body: "Honest assessment of items with potential resale value, with routing recommendations and realistic market context.",
              },
              {
                title: "Dispersal strategy",
                body: "A thoughtful plan for what happens to items — who receives what, what sells, what donates, what stays. Developed with the family, not imposed on them.",
              },
              {
                title: "Transition planning",
                body: "For households in active transition — downsizing, estate, move — a coordinated plan for managing the process with as little friction as possible.",
              },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 50}>
                <div style={{
                  backgroundColor: "rgba(248,244,227,0.06)",
                  border: "1px solid rgba(248,244,227,0.12)",
                  padding: "2rem",
                }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--parchment)", marginBottom: "0.75rem" }}>{item.title}</h3>
                  <p style={{ fontSize: "0.85rem", fontWeight: 300, color: "rgba(248,244,227,0.65)", lineHeight: 1.7 }}>{item.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "6rem 0" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "start",
          }} className="grid-cols-1 md:grid-cols-2">
            <FadeUp>
              <span className="eyebrow eyebrow-sage">Who It's For</span>
              <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "2rem" }}>
                Families who want to get ahead of what's coming.
              </h2>
              <p className="body-lg" style={{ marginBottom: "2rem" }}>
                Legacy Inventory is for people who want to do this thoughtfully, not reactively. It's for the adult daughter who knows her mother's house is full of things that matter and wants to understand what they are before there's a crisis. It's for the collector who wants their collection properly documented. It's for anyone who wants to make sure the things they've spent a lifetime accumulating are handled with the care they deserve.
              </p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  "Adult children managing a parent's estate proactively",
                  "Individuals with significant collections",
                  "Families preparing for a downsizing",
                  "Anyone navigating an estate after a loss",
                  "Households preparing for a major move",
                  "People who want their belongings documented for insurance",
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: "0.85rem 0",
                    borderBottom: "1px solid var(--warm-gray-lt)",
                    fontSize: "0.95rem",
                    fontWeight: 400,
                    color: "var(--ink)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}>
                    <span style={{ width: 4, height: 4, backgroundColor: "var(--sage)", flexShrink: 0, display: "inline-block" }} />
                    {item}
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={100}>
              <div style={{
                backgroundColor: "var(--ink)",
                padding: "3rem",
                boxShadow: "8px 8px 0px var(--sage)",
              }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--parchment)", marginBottom: "1.5rem" }}>
                  A note on timing
                </h3>
                <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.75, marginBottom: "1.25rem" }}>
                  The families who get the most from Legacy Inventory are the ones who do it before they need to. Not because a health crisis has arrived, not because the house is already on the market, but because they want to be the kind of family that handles things thoughtfully.
                </p>
                <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.75, marginBottom: "1.25rem" }}>
                  If you're already in the middle of something urgent, I can still help. But the process will be different — more compressed, more reactive. I'll tell you honestly what's possible given the timeline.
                </p>
                <div style={{ borderTop: "1px solid rgba(248,244,227,0.15)", paddingTop: "1.25rem", marginTop: "1.5rem" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sage)" }}>
                    — Dayna Brown, Founder
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ backgroundColor: "var(--sage)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "start",
            }} className="grid-cols-1 md:grid-cols-2">
              <div>
                <span className="eyebrow" style={{ color: "var(--sage-dark)" }}>Pricing</span>
                <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "1.5rem" }}>
                  Starting from $1,500.
                </h2>
                <p style={{ fontSize: "1rem", fontWeight: 300, color: "var(--ink)", lineHeight: 1.75, marginBottom: "1.5rem", opacity: 0.8 }}>
                  Legacy Inventory is priced based on the scope of the household, the depth of documentation required, and the complexity of the collection. Every engagement begins with a consultation.
                </p>
                <p style={{ fontSize: "1rem", fontWeight: 300, color: "var(--ink)", lineHeight: 1.75, marginBottom: "2rem", opacity: 0.8 }}>
                  Pricing is always disclosed before work begins. There are no surprise fees.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Link href="/contact" className="btn btn-ink">Schedule a Consultation</Link>
                  <Link href="/pricing" className="btn btn-outline-ink">Full Pricing Guide</Link>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {[
                    { label: "Starting rate", value: "$1,500+" },
                    { label: "Scope", value: "Determined at consultation" },
                    { label: "Deliverables", value: "Photo inventory + written archive" },
                    { label: "Timeline", value: "1–4 weeks depending on scope" },
                    { label: "Service area", value: "Los Angeles + travel available" },
                    { label: "Booking", value: "Consultation required" },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.85rem 0",
                      borderBottom: "1px solid rgba(28,25,23,0.12)",
                      fontSize: "0.9rem",
                    }}>
                      <span style={{ fontWeight: 300, color: "var(--sage-dark)" }}>{row.label}</span>
                      <span style={{ fontWeight: 600, color: "var(--ink)" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow eyebrow-sage">Common Questions</span>
            <h2 className="display-sm" style={{ color: "var(--ink)", marginBottom: "2.5rem" }}>Before you reach out</h2>
          </FadeUp>
          <div style={{ maxWidth: 680 }}>
            {[
              {
                q: "Do I need to be in a crisis to use this service?",
                a: "No — and I'd prefer you weren't. The families who get the most from Legacy Inventory are the ones who do it proactively, before urgency arrives. If you're already in a difficult situation, I can still help, but the process will be different."
              },
              {
                q: "How long does it take?",
                a: "It depends on the scope of the household. A focused engagement covering one collection or a single room might take a few days. A full household inventory for a large home could take several weeks. I'll give you a realistic timeline at the consultation."
              },
              {
                q: "What do I receive at the end?",
                a: "A photographed inventory, a written archive of stories and provenance where captured, a resale assessment for items with value, and a dispersal strategy document. The format is designed to be useful — not just a spreadsheet."
              },
              {
                q: "Can this be done remotely or for a family member in another city?",
                a: "I'm based in Los Angeles, but I can travel for the right engagement. I've also worked with families who are managing a parent's household from a distance — I coordinate directly with whoever is on-site."
              },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 50}>
                <FAQItem q={item.q} a={item.a} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: "var(--ink)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem" }}>
              <div>
                <h2 className="display-sm" style={{ color: "var(--parchment)", marginBottom: "0.75rem" }}>
                  Ready to start the conversation?
                </h2>
                <p style={{ fontSize: "0.95rem", fontWeight: 300, color: "rgba(248,244,227,0.65)" }}>
                  Legacy Inventory begins with a consultation. There's no pressure and no commitment required.
                </p>
              </div>
              <Link href="/contact" className="btn btn-sage">Schedule a Consultation</Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
