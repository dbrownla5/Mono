/*
 * THE RESET — The Well Lived Citizen
 * Copy: verbatim from FOLDER_3_Website_Copy.md (locked).
 * Palette: parchment/ink/sage — NO cream/espresso/rust variables.
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

export default function TheReset() {
  return (
    <div style={{ backgroundColor: "var(--parchment)", minHeight: "100vh" }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{ backgroundColor: "var(--ink)", paddingTop: "10rem", paddingBottom: "7rem" }}>
        <div className="container">
          <div style={{ maxWidth: 720 }}>
            <span className="eyebrow eyebrow-light">Service 01</span>
            <h1 className="display-lg" style={{ color: "var(--parchment)", marginBottom: "2rem" }}>
              The Reset
            </h1>
            <p style={{ fontSize: "1.15rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
              A 4-hour working session designed to create immediate clarity, functionality, and momentum in the areas of life that have quietly become harder to stay on top of.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-sage">Book a Reset</Link>
              <Link href="/pricing" className="btn btn-outline-light">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IT IS ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "6rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "5rem", alignItems: "start" }}>
            <FadeUp>
              <span className="eyebrow eyebrow-sage">What It Is</span>
              <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "2rem" }}>
                The Reset is designed to create movement.
              </h2>
              <p className="body-lg" style={{ marginBottom: "1.5rem" }}>
                Not a complete overhaul. Not a multi-day project. A focused, intentional session that addresses the specific space or situation that has been quietly weighing on you.
              </p>
              <p className="body-lg" style={{ marginBottom: "1.5rem" }}>
                Four hours of working time. One clear objective. Real, visible progress by the time I leave.
              </p>
              <p className="body-lg">
                The Reset works because it is bounded. You know exactly what you are committing to. And you know exactly what you will have at the end.
              </p>
            </FadeUp>

            <FadeUp delay={80}>
              <div style={{ backgroundColor: "var(--parchment-mid)", padding: "2.5rem", boxShadow: "6px 6px 0px var(--sage)" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "1.5rem" }}>
                  Common Reset Projects
                </p>
                {[
                  "Closet resets and wardrobe functionality",
                  "Kitchen catch-up and pantry organization",
                  "Nursery setup and baby preparation",
                  "Post-move unpacking and settling",
                  "Room functionality and daily-use optimization",
                  "Donation sorting and resale preparation",
                  "Home office setup and workflow organization",
                  "Overflow rooms and storage areas",
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

      {/* ── HOW IT WORKS ── */}
      <section style={{ backgroundColor: "var(--parchment-mid)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow eyebrow-sage">How It Works</span>
            <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "3rem", maxWidth: 480 }}>
              Simple. Bounded. Effective.
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[
              { num: "01", title: "Book Your Session", body: "Choose a date and tell me what you want to address. I'll confirm the scope and arrive prepared." },
              { num: "02", title: "Working Session", body: "Four focused hours. I sort, organize, decide, and create systems that actually hold. You make the calls — I do the work." },
              { num: "03", title: "Visible Progress", body: "By the time I leave, the space functions differently. Not perfect. Better. And you know exactly what changed and why." },
              { num: "04", title: "What Happens Next", body: "Some clients book one Reset and are done. Others add House Calls for ongoing support. Either way, you're not starting from scratch anymore." },
            ].map((step, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div style={{ backgroundColor: "var(--parchment)", padding: "2rem", height: "100%" }}>
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", color: "var(--sage)", marginBottom: "1rem" }}>{step.num}</p>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.75rem" }}>{step.title}</p>
                  <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.7 }}>{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTE ON HOW WE WORK ── */}
      <section style={{ backgroundColor: "var(--sage)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ maxWidth: 680 }}>
              <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 300, color: "var(--ink)", lineHeight: 1.75, fontStyle: "italic", marginBottom: "1.5rem" }}>
                "I'd rather you tell me you're overwhelmed and reschedule than push through a session that doesn't serve you. This work only works when you're ready for it."
              </p>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)", opacity: 0.6 }}>
                — Dayna Brown, Founder
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── PRICING SNAPSHOT ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
              <div>
                <span className="eyebrow eyebrow-sage">Pricing</span>
                <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "1rem" }}>$495 flat.<br />Four hours.</h2>
                <p style={{ fontSize: "0.95rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: "2rem" }}>
                  No hourly creep. No ambiguity. You know what you're getting before I arrive. Travel within my primary service area is included.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Link href="/contact" className="btn btn-ink">Book a Reset</Link>
                  <Link href="/pricing" className="btn btn-outline-ink">Full Pricing Guide</Link>
                </div>
              </div>
              <div>
                {[
                  { label: "Session length", value: "4 hours" },
                  { label: "Rate", value: "$495 flat" },
                  { label: "Additional hours", value: "$125/hr" },
                  { label: "Service area", value: "Los Angeles + surrounding" },
                  { label: "Booking", value: "Schedule a call first" },
                  { label: "Cancellation", value: "48-hour notice" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.85rem 0", borderBottom: "1px solid var(--warm-gray-lt)", fontSize: "0.9rem" }}>
                    <span style={{ fontWeight: 300, color: "var(--sage-dark)" }}>{row.label}</span>
                    <span style={{ fontWeight: 600, color: "var(--ink)" }}>{row.value}</span>
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
            <h2 className="display-sm" style={{ color: "var(--ink)", marginBottom: "2.5rem" }}>Before you book</h2>
          </FadeUp>
          <div style={{ maxWidth: 720 }}>
            {[
              { q: "Do I need to be home during the session?", a: "You can be home, or not — it's genuinely up to you. Some clients prefer to be present for the decision-making; others prefer to leave and come back to a finished space. I'll talk through what works best for your situation before I arrive." },
              { q: "What if we don't finish in four hours?", a: "I'm not billing by the minute. If we're 15 minutes from something great, I finish it. If we're a full hour away, I'll have a quick conversation with you about what makes sense — extend at the hourly rate or schedule a follow-up. My standard is always fairness, and I ask the same in return." },
              { q: "What happens to the things that leave?", a: "I sort items into donation, resale, and discard as I go. Donation bags are ready to drop off. Resale candidates are flagged — you can add a resale pickup at the end of the session or schedule it separately." },
              { q: "Do I need to prepare anything?", a: "No. The intake form does the heavy lifting before I arrive — the more transparent you can be there, the better I can prepare. On the day, I just ask that you're available for the first 15 minutes so I can align on your priorities. After that, you can stay or go." },
              { q: "Can I book a Reset for someone else?", a: "Yes. Many clients book for a parent, a sibling, or a friend going through a transition. I also work with people navigating more difficult situations — leaving a hard place, managing a move someone else can't face, or needing a trusted person to handle something privately. These are handled on a case-by-case basis, always with safety and discretion for everyone involved. No one who reaches out is left without support." },
              { q: "Is this confidential?", a: "Completely. I work in private homes and treat everything I see with discretion. I don't photograph spaces without permission and I don't share client information." },
              { q: "What about electronics, batteries, and things I can't just throw away?", a: "There's a responsible process for everything. Electronics get wiped and routed to certified e-waste handlers. Batteries, old devices, anything that can't go in the trash — I know where it goes and how to get it there affordably. You don't have to figure that out. That's already handled." },
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
                Ready to create some momentum?
              </h2>
              <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(248,244,227,0.7)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
                Book a Reset and tell me what space has been quietly weighing on you. I'll take it from there.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/contact" className="btn btn-sage">Book a Reset</Link>
                <Link href="/pricing" className="btn btn-outline-light">See Pricing</Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
