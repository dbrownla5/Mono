/*
 * CLOSEOUT — The Well Lived Citizen
 * The move is done — or almost done. Dayna stays behind.
 * Boxes, sells, manages storage, handles dispersal.
 * Voice: calm authority, no pressure, practical clarity.
 */
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FAQItem from "@/components/FAQItem";

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

const faqs = [
  {
    q: "What exactly is a Closeout?",
    a: "A Closeout is for the moment when a move — or a life transition — has reached its final chapter and there's still a house full of things to deal with. I stay behind, assess what's left, and manage the full dispersal: boxing, resale routing, donation coordination, storage management, and final walkthrough. You don't have to be there.",
  },
  {
    q: "Who is this for?",
    a: "Clients who are relocating and can't finish the process themselves. Families managing a parent's home after a transition. Anyone who has started a move and run out of time, energy, or proximity to finish it. If the house needs to be empty and you're not sure how to get there, this is the service.",
  },
  {
    q: "Do you handle storage units too?",
    a: "Yes. If there's an active storage unit connected to the transition, I can assess, sort, and manage it as part of the Closeout scope. Items worth reselling get routed appropriately. Items that aren't get donated or responsibly dispersed.",
  },
  {
    q: "What happens to things that can be resold?",
    a: "I assess each item honestly. Things with real resale value get routed to the right platform — consignment, resale apps, or direct sale depending on category and timing. You receive a report and payout on the agreed schedule. I won't list something I don't think will sell.",
  },
  {
    q: "How is this priced?",
    a: "Closeout is scoped and quoted per project. The size of the home, the volume of items, and the complexity of dispersal all factor in. I'll walk through the space first — in person or via photos and video — and give you a clear scope before anything starts.",
  },
  {
    q: "Do I need to be present?",
    a: "No. That's often the point. Many clients are already in a new city, managing a parent's estate from a distance, or simply don't have the capacity to be there. I handle the full process and keep you informed throughout.",
  },
];

export default function Closeout() {
  return (
    <div style={{ backgroundColor: "var(--parchment)", minHeight: "100vh" }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{ backgroundColor: "var(--ink)", paddingTop: "10rem", paddingBottom: "6rem" }}>
        <div className="container">
          <div style={{ maxWidth: 680 }}>
            <span className="eyebrow" style={{ color: "rgba(248,244,227,0.4)" }}>Service 04</span>
            <div style={{
              display: "inline-block",
              backgroundColor: "var(--sage)",
              padding: "0.3rem 0.8rem",
              marginBottom: "1.5rem",
            }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink)" }}>
                End-of-Move Dispersal
              </span>
            </div>
            <h1 className="display-lg" style={{ color: "var(--parchment)", marginBottom: "1.5rem" }}>
              Closeout
            </h1>
            <p style={{ fontSize: "1.15rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              The move is done — or almost done. There's still a house full of things that need to go somewhere, and you're not in a position to manage it yourself.
            </p>
            <p style={{ fontSize: "1.15rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
              I stay behind. I assess what's left, box what's worth keeping or selling, route items to the right resale channels, coordinate donation, and manage storage if there's a unit involved. You get a clear report and don't have to think about it again.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/contact" className="btn btn-sage">Get a Closeout Quote</Link>
              <span style={{ fontSize: "0.8rem", fontWeight: 300, color: "rgba(248,244,227,0.45)" }}>Scoped per project</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IT COVERS ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "6rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }} className="grid-cols-1 md:grid-cols-2">
            <FadeUp>
              <span className="eyebrow eyebrow-sage">What a Closeout Covers</span>
              <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "2rem" }}>
                Everything that comes after the movers leave.
              </h2>
              <p className="body-lg" style={{ marginBottom: "1.5rem" }}>
                A Closeout is a full-scope, end-of-transition service. It's designed for the moment when a move has reached its final chapter and there's still a property full of decisions to make — and no one left to make them.
              </p>
              <p className="body-lg" style={{ marginBottom: "1.5rem" }}>
                I assess what's there, make honest decisions about what's worth reselling versus donating versus discarding, and execute the full dispersal. If there's a storage unit connected to the transition, that's part of the scope too.
              </p>
              <p className="body-lg">
                You receive a clear report of what went where. Any resale proceeds are paid out on the agreed schedule.
              </p>
            </FadeUp>

            <FadeUp delay={100}>
              <div style={{ backgroundColor: "var(--parchment-mid)", padding: "3rem", boxShadow: "6px 6px 0px var(--sage)" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "1.5rem" }}>
                  A Closeout typically includes
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {[
                    "Full property assessment",
                    "Boxing and packing remaining items",
                    "Resale routing for items with value",
                    "Donation coordination",
                    "Storage unit assessment and management",
                    "Responsible dispersal of remaining items",
                    "Final walkthrough and property report",
                    "Resale payout on agreed schedule",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 0", borderBottom: "1px solid var(--warm-gray-lt)" }}>
                      <span style={{ color: "var(--sage)", flexShrink: 0, marginTop: "0.15rem" }}>—</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ backgroundColor: "var(--ink)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow eyebrow-light">Who It's For</span>
            <h2 className="display-md" style={{ color: "var(--parchment)", maxWidth: 640, marginBottom: "3rem" }}>
              The move happened. The house didn't fully empty.
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              { label: "Relocating clients", text: "You're already in the new city. The old house still has a full room of things that need to go somewhere." },
              { label: "Estate transitions", text: "A parent's home needs to be cleared. You're managing it from a distance and don't have the bandwidth to be there in person." },
              { label: "Incomplete moves", text: "The movers came and went. The things that didn't fit the truck — or the new life — are still there." },
              { label: "Storage situations", text: "There's a unit that's been accumulating for years. It's time to deal with it, but the process feels overwhelming." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 50}>
                <div style={{ backgroundColor: "rgba(248,244,227,0.06)", padding: "2rem", borderTop: "2px solid var(--sage)" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sage)", marginBottom: "0.75rem" }}>{item.label}</p>
                  <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "rgba(248,244,227,0.7)", lineHeight: 1.7 }}>{item.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESALE WITHIN CLOSEOUT ── */}
      <section style={{ backgroundColor: "var(--parchment-mid)", padding: "6rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="grid-cols-1 md:grid-cols-2">
            <FadeUp>
              <span className="eyebrow eyebrow-sage">Resale Within a Closeout</span>
              <h2 className="display-sm" style={{ color: "var(--ink)", marginBottom: "1.5rem" }}>
                Not everything goes to Goodwill.
              </h2>
              <p className="body-lg" style={{ marginBottom: "1.25rem" }}>
                Part of what I bring to a Closeout is the ability to make honest, experienced decisions about what's actually worth reselling. I've worked across retail, luxury, and resale long enough to know the difference between something that will sell and something that won't — and I won't waste your time or mine listing things that aren't going to move.
              </p>
              <p className="body-lg" style={{ marginBottom: "1.25rem" }}>
                Items with real value get routed to the right channel: consignment, resale apps, or direct sale depending on category, condition, and timing. You receive a report and payout on the agreed schedule.
              </p>
              <p className="body-lg">
                Items without resale value get donated responsibly or discarded. Nothing gets lost in a pile.
              </p>
            </FadeUp>
            <FadeUp delay={80}>
              <div style={{ backgroundColor: "var(--parchment)", padding: "2.5rem", boxShadow: "4px 4px 0 var(--warm-gray-md)" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "1rem" }}>
                  Resale terms within a Closeout
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { label: "Commission", value: "55% Dayna / 45% client on resale proceeds" },
                    { label: "Platforms", value: "Routed based on item category and market timing" },
                    { label: "Payout", value: "Monthly, on the date agreed at time of contract" },
                    { label: "Unsold items", value: "Check-in at 180 days; options discussed honestly" },
                    { label: "Agreement", value: "Signed consignment agreement required before pickup" },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--warm-gray-lt)" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>{row.label}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 300, color: "var(--ink-soft)", textAlign: "right" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow eyebrow-sage">Questions</span>
            <h2 className="display-sm" style={{ color: "var(--ink)", marginBottom: "3rem", maxWidth: 480 }}>
              What people usually ask before booking a Closeout.
            </h2>
          </FadeUp>
          <div style={{ maxWidth: 720 }}>
            {faqs.map((faq, i) => (
              <FadeUp key={i} delay={i * 40}>
                <FAQItem q={faq.q} a={faq.a} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: "var(--sage)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ maxWidth: 600 }}>
              <span className="eyebrow eyebrow-ink">Ready to Close It Out</span>
              <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "1.25rem" }}>
                Tell me what you're dealing with.
              </h2>
              <p style={{ fontSize: "1rem", fontWeight: 300, color: "var(--ink)", opacity: 0.8, lineHeight: 1.8, marginBottom: "2.5rem" }}>
                Every Closeout is different. Send me a message or schedule a call and I'll tell you what makes sense for your situation — scope, timeline, and what to expect.
              </p>
              <Link href="/contact" className="btn btn-ink">Get in Touch</Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
