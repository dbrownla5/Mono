/*
 * PILLAR 01 — HOME RESET & MOVE SUPPORT
 * The Well Lived Citizen
 * Copy: verbatim from FOLDER_3 Service Page 01 (Final Canonical Benchmark)
 * Voice: observational intelligence, conversion-first, no philosophy spiral
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
      <div className="faq-content" style={{ maxHeight: open ? 600 : 0 }}>
        <div className="faq-body">{a}</div>
      </div>
    </div>
  );
}

export default function HomeReset() {
  return (
    <div style={{ backgroundColor: "var(--parchment)", minHeight: "100vh" }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{ backgroundColor: "var(--ink)", paddingTop: "10rem", paddingBottom: "7rem" }}>
        <div className="container">
          <div style={{ maxWidth: 740 }}>
            <span className="eyebrow eyebrow-light">Pillar 01</span>
            <h1 className="display-lg" style={{ color: "var(--parchment)", marginBottom: "1.5rem" }}>
              Home Reset &amp;<br />Move Support
            </h1>
            <p style={{ fontSize: "1.2rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.8, marginBottom: "0.75rem" }}>
              The relief of the room.
            </p>
            <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(248,244,227,0.6)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
              Your home, made to work for how you actually live.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-sage">Schedule a Call</Link>
              <Link href="/pricing" className="btn btn-outline-light">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE FRICTION ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "6rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "5rem", alignItems: "start" }}>
            <FadeUp>
              <span className="eyebrow eyebrow-sage">Where I Start</span>
              <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "2rem" }}>
                What's actually frustrating you.
              </h2>
              <p className="body-lg" style={{ marginBottom: "1.5rem" }}>
                The room that keeps collecting piles. The kitchen that somehow slows every morning down. The move where the boxes made it through the door, but nothing feels settled. The closet that no longer fits your life, body, season, or the way you actually get dressed.
              </p>
              <p className="body-lg">
                The issue is the space itself. The room, layout, or systems are no longer supporting the way you naturally move through your day. I come in, find the friction, and make the space work around your real habits.
              </p>
            </FadeUp>

            <FadeUp delay={80}>
              <div style={{ backgroundColor: "var(--parchment-mid)", padding: "2.5rem", boxShadow: "6px 6px 0px var(--sage)" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "1.5rem" }}>
                  How to Work With Me
                </p>
                {[
                  "Side-by-side guided sessions",
                  "Hybrid decision blocks",
                  "Full key handoff",
                  "Solo resets while you're away",
                  "Packing and move prep with or without you",
                  "Closet and system continuity after landing",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", padding: "0.7rem 0", borderBottom: "1px solid var(--warm-gray-lt)" }}>
                    <span style={{ width: 5, height: 5, backgroundColor: "var(--sage)", flexShrink: 0, marginTop: "0.45rem" }} />
                    <span style={{ fontSize: "0.9rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
                <p style={{ fontSize: "0.8rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.7, marginTop: "1.25rem", fontStyle: "italic" }}>
                  The right style is the one that creates the easiest lasting outcome.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── TWO SERVICES ── */}
      <section style={{ backgroundColor: "var(--parchment-mid)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow eyebrow-sage">The Services</span>
            <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "3rem", maxWidth: 500 }}>
              Two ways this shows up.
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {/* The Home Reset */}
            <FadeUp delay={0}>
              <div style={{ backgroundColor: "var(--parchment)", padding: "2.5rem", height: "100%" }}>
                <div style={{ display: "inline-block", backgroundColor: "var(--sage)", padding: "0.25rem 0.75rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--parchment)" }}>The Home Reset</span>
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)", marginBottom: "1rem" }}>
                  Getting the space functional again.
                </h3>
                <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: "1rem" }}>
                  The goal is not a perfect before-and-after or turning your home into a showroom. The goal is a space that works around how you actually move through your day.
                </p>
                <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.75 }}>
                  Sometimes that means unpacking, routing, labeling, donating, storing, or simply getting one zone moving again. Think about the things sitting on the to-do list that never quite get handled. I come in for those.
                </p>
                <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--warm-gray-lt)" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--sage-dark)", letterSpacing: "0.05em" }}>Quick Book entry: <span style={{ color: "var(--ink)" }}>The 4-Hour Reset</span></p>
                </div>
              </div>
            </FadeUp>

            {/* Modern Move Support */}
            <FadeUp delay={80}>
              <div style={{ backgroundColor: "var(--ink)", padding: "2.5rem", height: "100%" }}>
                <div style={{ display: "inline-block", backgroundColor: "var(--sage)", padding: "0.25rem 0.75rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--parchment)" }}>Modern Move Support</span>
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--parchment)", marginBottom: "1rem" }}>
                  The move continues after the boxes arrive.
                </h3>
                <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "rgba(248,244,227,0.7)", lineHeight: 1.75, marginBottom: "1rem" }}>
                  For the move that technically happened, but still has loose ends everywhere. Or the move where you had to leave before everything was fully packed.
                </p>
                <div style={{ marginTop: "1.5rem" }}>
                  {[
                    { label: "The Closeout", body: "You go first. I stay behind to close out what's left — packing, storing, routing resale, shipping essentials, labeling boxes so the move continues in flexible chunks without you carrying the urgency." },
                    { label: "The Professional Landing", body: "For professionals arriving in Los Angeles the same day as their boxes. The bed gets built, the phone charger gets found, the workspace gets set, clothing for the coming week gets unpacked." },
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: "1.25rem" }}>
                      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--sage)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{item.label}</p>
                      <p style={{ fontSize: "0.85rem", fontWeight: 300, color: "rgba(248,244,227,0.65)", lineHeight: 1.7 }}>{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow eyebrow-sage">What's Included</span>
            <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "3rem", maxWidth: 500 }}>
              Everything needed to get the space working.
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {[
              { title: "Intake call & pre-planning", body: "Prior coordination and any pre-planning on my end before I arrive." },
              { title: "Layout logic & sourcing", body: "Recommendations for how the space should function and what it needs to get there." },
              { title: "Setup, install & label systems", body: "Full execution — not just advice. I do the work." },
              { title: "Tools & utility hardware", body: "Measuring tools, reusable sort bins, cord wraps, Velcro, adapters, and utility hardware included." },
              { title: "Problem-solving tools", body: "For deeper spaces — closets, offices, storage rooms — product support is quoted after walkthrough based on actual dimensions." },
              { title: "Labels", body: "Always included. Handwritten on-site by default. Printed sets provided for larger scopes — built on my own time so you're not paying hourly for typing and cutting." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 50}>
                <div style={{ backgroundColor: "var(--parchment-mid)", padding: "2rem" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.6rem" }}>{item.title}</h3>
                  <p style={{ fontSize: "0.85rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.7 }}>{item.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADD-ONS / BUNDLES ── */}
      <section style={{ backgroundColor: "var(--sage)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow" style={{ color: "var(--sage-dark)" }}>Optional Add-Ons</span>
            <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "1rem" }}>
              Landing bundles &amp; org supplies.
            </h2>
            <p style={{ fontSize: "1rem", fontWeight: 300, color: "var(--ink)", lineHeight: 1.75, marginBottom: "3rem", maxWidth: 560, opacity: 0.8 }}>
              Optional product budgets added to any move session or day rate so the home works before the first Target run. Everything is catered to the specific client and can be adjusted as I go.
            </p>
          </FadeUp>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
            {/* Landing Bundles */}
            <FadeUp>
              <div style={{ backgroundColor: "var(--parchment)", padding: "2.5rem" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "1.5rem" }}>
                  First-Night &amp; First-Week Landing Bundles
                </p>
                {[
                  { price: "$150", name: "Essentials Landing", desc: "Toilet paper, paper towels, basic utensils, water glasses, a wine or whiskey tumbler, laundry and dish detergent, trash bags, trash bins, two bath towels, two kitchen towels." },
                  { price: "$250", name: "Start-Up Landing", desc: "Everything in Essentials, plus a starter dish set, dish soap, hamper, hangers, and entry-point setup (keys, mail, shoes, bag drop)." },
                  { price: "$500", name: "Full Landing Bundle", desc: "Everything in Start-Up, plus sheets, pillows, a steamer, and a duvet. The sleep, shower, eat, charge, and get dressed tonight bundle." },
                ].map((bundle, i) => (
                  <div key={i} style={{ padding: "1.25rem 0", borderBottom: "1px solid var(--warm-gray-lt)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink)" }}>{bundle.name}</p>
                      <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--sage-dark)" }}>{bundle.price}</p>
                    </div>
                    <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.65 }}>{bundle.desc}</p>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* Org Bundles */}
            <FadeUp delay={80}>
              <div style={{ backgroundColor: "var(--parchment)", padding: "2.5rem" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "1.5rem" }}>
                  Pre-Buy Org Bundles
                </p>
                {[
                  { price: "$150", name: "Starter Org Bundle", desc: "5 bins, 3 bin latches, and a rolling cart. Good for a single closet or one focused zone." },
                  { price: "$250", name: "Mid Org Bundle", desc: "Covers a full closet, a small pantry, or a bathroom + linen combo." },
                  { price: "$500", name: "Full Org Bundle", desc: "Covers a full pantry, a primary closet + dresser, or a multi-zone reset in one session." },
                ].map((bundle, i) => (
                  <div key={i} style={{ padding: "1.25rem 0", borderBottom: "1px solid var(--warm-gray-lt)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink)" }}>{bundle.name}</p>
                      <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--sage-dark)" }}>{bundle.price}</p>
                    </div>
                    <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.65 }}>{bundle.desc}</p>
                  </div>
                ))}
                <p style={{ fontSize: "0.78rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.65, marginTop: "1.25rem", fontStyle: "italic" }}>
                  The actual item mix is adjusted based on intake and dialogue to fit the specific room or project.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
              <div>
                <span className="eyebrow eyebrow-sage">Pricing</span>
                <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "1rem" }}>
                  Clear rates.<br />No surprises.
                </h2>
                <p style={{ fontSize: "0.95rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: "2rem" }}>
                  Pricing is always disclosed before work begins. Every engagement starts with a call so I can scope it correctly.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Link href="/contact" className="btn btn-ink">Schedule a Call</Link>
                  <Link href="/pricing" className="btn btn-outline-ink">Full Pricing Guide</Link>
                </div>
              </div>
              <div>
                {[
                  { label: "Hourly rate", value: "$150/hr" },
                  { label: "Minimum", value: "3 hours" },
                  { label: "Modern Move Reset", value: "$1,200 flat" },
                  { label: "Move Reset scope", value: "Studio & 1BR, up to 8 hrs" },
                  { label: "Larger homes", value: "Scoped as projects" },
                  { label: "Service area", value: "Los Angeles + surrounding" },
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
              { q: "Do I need to be home?", a: "You can be home, or not. Some clients prefer to be present for the decision-making; others prefer to leave and come back to a finished space. I'll talk through what works best before I arrive." },
              { q: "What if the project is bigger than expected?", a: "I'm not billing by the minute. If we're 15 minutes from something great, I finish it. If we're a full hour away, I'll have a quick conversation with you about what makes sense. My standard is always fairness, and I ask the same in return." },
              { q: "What happens to things that leave?", a: "Items are sorted into donation, resale, and discard as I go. Donation bags are ready to drop off. Resale candidates are flagged — you can add a resale pickup at the end of the session or schedule it separately." },
              { q: "Do I need to prepare anything?", a: "No. The intake form does the heavy lifting before I arrive — the more transparent you can be there, the better I can prepare. On the day, just be available for the first 15 minutes so I can align on your priorities. After that, you can stay or go." },
              { q: "Can I book this for someone else?", a: "Yes. Many clients book for a parent, sibling, or friend going through a transition. I also work with people navigating more difficult situations — leaving a hard place, managing a move someone else can't face, or needing a trusted person to handle something privately. These are handled on a case-by-case basis, always with safety and discretion. No one who reaches out is left without support." },
              { q: "What's the difference between the hourly rate and the flat day rate?", a: "The $1,200 flat day rate is specifically for studio and 1-bedroom moves — up to 8 hours straight, no hourly creep. For larger homes or multi-room projects, I scope it as a project after a walkthrough call." },
              { q: "What about electronics, batteries, and things I can't just throw away?", a: "There's a responsible process for everything. Electronics get wiped and routed to certified e-waste handlers. Batteries, old devices, anything that can't go in the trash — I know where it goes and how to get it there affordably. You don't have to figure that out. That's already handled." },
              { q: "Do you do full moves? Do you move furniture? Do you bring a team?", a: "No — I don't do full moves and I don't move furniture. What I do is vendor oversight and coordination: I manage the move for you. That means handling the logistics, communicating with your movers, and making sure the right things happen in the right order so you don't have to be the one holding it all together.\n\nProject management is in my background. I'm comfortable running event coordination, breakdown and setup, and anything that requires multiple vendors or moving parts. For non-contractor repairs and tasks — things that require a drill, a wall anchor, or basic assembly — I do those myself, and everything I do follows the applicable codes for the City and State of California.\n\nI work well with other vendors and I have a network of people in the LA area I trust. I've just moved back, so I'm actively rebuilding and growing that network. In the meantime, my job is to find who you need — so you're not the one making calls, figuring out who's reliable, or managing a project you don't have time for. I have people on retainer who can assist with smaller tasks that need an extra set of hands. I'm equipped to handle different sizes and scopes." },
              { q: "Are you licensed? Is this a real business?", a: "Yes. The Well Lived Citizen is a registered business operating in Los Angeles, California. I'm insured, and everything I do that involves repairs, installations, or any work requiring tools follows the applicable codes for the City and State of California. If a project requires a licensed contractor — electrical, plumbing, structural — I'll tell you that clearly and connect you with the right person. I don't do work that requires a contractor's license, and I don't pretend otherwise." },
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
                Ready to make the space work?
              </h2>
              <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(248,244,227,0.7)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
                Schedule a call and tell me what's been sitting on the list. I'll figure out the right scope from there.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/contact" className="btn btn-sage">Schedule a Call</Link>
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
