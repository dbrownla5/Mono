/*
 * SERVICES — The Well Lived Citizen
 * Two-layer architecture: Four Pillars + Quick Books (entry points).
 * Closeout lives under Pillar 01. Not a standalone pillar.
 */

import { useEffect, useRef } from "react";
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

const PILLARS = [
  {
    num: "01",
    href: "/home-reset-move-support",
    title: "The Reset",
    subtitle: "Organization & Move Support",
    copy: "A focused working session designed to create immediate clarity, functionality, and momentum in the areas of life that have quietly become harder to stay on top of. Sometimes that's a closet. Sometimes it's a kitchen, a move-in, or a room that's slowly become harder to move through. The Reset creates movement — not perfection. Includes Closeout & Dispersal for end-of-move transitions.",
    ideal: ["Closets & kitchens", "Move-ins & move-outs", "Nursery setup", "Storage units", "Overflow spaces", "Donation sorting", "Resale preparation", "End-of-move closeout"],
    cta: "Book a Reset",
    ctaHref: "/the-reset",
    bg: "var(--ink)",
    color: "var(--parchment)",
  },
  {
    num: "02",
    href: "/legacy-planning",
    title: "Legacy Planning & Inventory",
    subtitle: "Documentation & Preservation",
    copy: "Creating clarity around the belongings and stories families should not lose track of — before urgency forces decisions to happen quickly. I help individuals and families thoughtfully document collections, household contents, and the stories attached to them.",
    ideal: ["Photographed inventory", "Collection mapping", "Story & memory capture", "Resale assessment", "Dispersal strategy", "Transition planning"],
    cta: "Schedule a Consultation",
    ctaHref: "/legacy-inventory",
    bg: "var(--parchment)",
    color: "var(--ink)",
  },
  {
    num: "03",
    href: "/house-calls-pillar",
    title: "House Calls",
    subtitle: "Ongoing Household Support",
    copy: "Practical help for the parts of life that quietly pile up. Technology setup, home safety updates, organization, resale prep, post-move settling, support after a transition — whatever the household needs. A House Call is thoughtful, capable help for the operational side of everyday life.",
    ideal: ["Tech setup & troubleshooting", "Home safety updates", "Space reorganization", "Post-move settling", "Support after loss or transition", "Belonging documentation"],
    cta: "Schedule a House Call",
    ctaHref: "/house-calls",
    bg: "var(--parchment-mid)",
    color: "var(--ink)",
  },
  {
    num: "04",
    href: "/curated-resale-consignment",
    title: "Curated Resale & Consignment",
    subtitle: "Value Recovery",
    copy: "Pickup or send your items. We identify the best resale route, manage listings, and recover value from the things you no longer need. Not everything belongs in a donation pile. Some items carry financial value. Some carry history. Some simply deserve a more intentional next stop.",
    ideal: ["Designer accessories", "Vintage & contemporary clothing", "Jewelry & art", "Lamps & decor", "Housewares & collections", "Inherited belongings"],
    cta: "Schedule a Pickup",
    ctaHref: "/fast-bag-fill",
    bg: "var(--sage)",
    color: "var(--ink)",
  },
];

const QUICK_BOOKS = [
  {
    href: "/the-reset",
    title: "The 4-Hour Reset",
    under: "Pillar 01 — Home Reset & Move Support",
    price: "$495 flat",
    copy: "Immediate clarity, functionality, and momentum for one room or task.",
  },
  {
    href: "/house-calls",
    title: "The 2-Hour House Call",
    under: "Pillar 03 — House Calls",
    price: "$175/hr · 2-hr minimum",
    copy: "Trusted, immediate help for the operational side of everyday life.",
  },
  {
    href: "/fast-bag-fill",
    title: "The Fast Bag Fill",
    under: "Pillar 04 — Curated Resale & Consignment",
    price: "Complimentary pickup",
    copy: "Fill a bag or pickup pile. I evaluate, route, and handle the next step.",
  },
];

export default function Services() {
  return (
    <div style={{ backgroundColor: "var(--parchment)", minHeight: "100vh" }}>
      <Nav />

      {/* Page Hero */}
      <section style={{ backgroundColor: "var(--ink)", paddingTop: "10rem", paddingBottom: "5rem" }}>
        <div className="container">
          <span className="eyebrow" style={{ color: "rgba(248,244,227,0.45)" }}>The Well Lived Citizen</span>
          <h1 className="display-lg" style={{ color: "var(--parchment)", maxWidth: 600, marginBottom: "1.5rem" }}>
            Four areas of service.<br />One consistent approach.
          </h1>
          <p style={{ fontSize: "1.05rem", fontWeight: 300, color: "rgba(248,244,227,0.7)", maxWidth: 560, lineHeight: 1.7 }}>
            The Reset creates momentum. House Calls create continuity. Curated Resale creates release and value recovery. Legacy Inventory creates future clarity. Everything aligns around reducing friction thoughtfully.
          </p>
        </div>
      </section>

      {/* Four Pillars */}
      {PILLARS.map((s) => (
        <section key={s.num} style={{ backgroundColor: s.bg, padding: "5rem 0" }}>
          <div className="container">
            <FadeUp>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4rem",
                alignItems: "start",
              }} className="grid-cols-1 md:grid-cols-2">
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: s.num === "01" || s.num === "04" ? "rgba(248,244,227,0.4)" : "var(--sage-dark)" }}>
                      Pillar {s.num}
                    </span>
                  </div>
                  <h2 className="display-md" style={{ color: s.color, marginBottom: "0.5rem" }}>{s.title}</h2>
                  <p style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: s.num === "01" || s.num === "04" ? "rgba(248,244,227,0.5)" : "var(--sage-dark)", marginBottom: "1.5rem" }}>{s.subtitle}</p>
                  <p style={{ fontSize: "1rem", fontWeight: 300, color: s.num === "01" || s.num === "04" ? "rgba(248,244,227,0.8)" : "var(--ink-soft)", lineHeight: 1.8, marginBottom: "2rem" }}>{s.copy}</p>
                  <Link href={s.ctaHref} className={`btn ${s.num === "01" || s.num === "04" ? "btn-sage" : "btn-ink"}`}>{s.cta}</Link>
                </div>
                <div>
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: s.num === "01" || s.num === "04" ? "rgba(248,244,227,0.4)" : "var(--sage-dark)", marginBottom: "1.25rem" }}>
                    Ideal For
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {s.ideal.map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", borderBottom: `1px solid ${s.num === "01" || s.num === "04" ? "rgba(248,244,227,0.1)" : "var(--warm-gray-lt)"}` }}>
                        <span style={{ width: 5, height: 5, backgroundColor: s.num === "04" ? "var(--ink)" : "var(--sage)", flexShrink: 0 }} />
                        <span style={{ fontSize: "0.9rem", fontWeight: 300, color: s.num === "01" || s.num === "04" ? "rgba(248,244,227,0.7)" : "var(--ink-soft)" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "2rem" }}>
                    <Link href={s.href} style={{ fontSize: "0.8rem", fontWeight: 600, color: s.num === "01" || s.num === "04" ? "rgba(248,244,227,0.5)" : "var(--sage-dark)", textDecoration: "none", letterSpacing: "0.08em" }}>
                      Full service details →
                    </Link>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      ))}

      {/* Quick Books */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow eyebrow-sage">Fast Entry Points</span>
            <h2 className="display-md" style={{ color: "var(--ink)", maxWidth: 480, marginBottom: "0.75rem" }}>
              Not sure where to start?
            </h2>
            <p style={{ fontSize: "1rem", fontWeight: 300, color: "var(--sage-dark)", maxWidth: 560, lineHeight: 1.8, marginBottom: "3rem" }}>
              Most clients begin with one of these. Each is a quick-book entry point into a larger pillar — low friction, immediate action.
            </p>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5px", backgroundColor: "var(--warm-gray-lt)" }}>
            {QUICK_BOOKS.map((qb, i) => (
              <FadeUp key={qb.href} delay={i * 50}>
                <div style={{ backgroundColor: "var(--parchment)", padding: "2.5rem", height: "100%" }}>
                  <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "1rem" }}>{qb.under}</p>
                  <h3 className="display-sm" style={{ color: "var(--ink)", marginBottom: "0.75rem" }}>{qb.title}</h3>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--sage-dark)", marginBottom: "1rem" }}>{qb.price}</p>
                  <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: "1.75rem" }}>{qb.copy}</p>
                  <Link href={qb.href} className="btn btn-ink" style={{ fontSize: "0.75rem" }}>Book Now</Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "var(--ink)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ maxWidth: 560 }}>
              <h2 className="display-md" style={{ color: "var(--parchment)", marginBottom: "1.5rem" }}>
                Not sure which service fits?
              </h2>
              <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(248,244,227,0.65)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
                Schedule a call. We'll talk through what's going on and figure out the right starting point together.
              </p>
              <Link href="/contact" className="btn btn-sage">Schedule a Call</Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
