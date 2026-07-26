/*
 * HOUSE CALLS — The Well Lived Citizen
 * Voice: practical, warm, capable, no-fuss. The 2-hour minimum service.
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

export default function HouseCalls() {
  return (
    <div style={{ backgroundColor: "var(--parchment)", minHeight: "100vh" }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{ backgroundColor: "var(--ink)", paddingTop: "10rem", paddingBottom: "6rem" }}>
        <div className="container">
          <div style={{ maxWidth: 680 }}>
            <span className="eyebrow" style={{ color: "rgba(248,244,227,0.4)" }}>Service 02</span>
            <div style={{
              display: "inline-block",
              backgroundColor: "var(--sage)",
              padding: "0.3rem 0.8rem",
              marginBottom: "1.5rem",
            }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink)" }}>
                Ongoing Household Support
              </span>
            </div>
            <h1 className="display-lg" style={{ color: "var(--parchment)", marginBottom: "1.5rem" }}>
              House Calls
            </h1>
            <p style={{ fontSize: "1.15rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              There's a whole category of home tasks that pile up not because you can't handle them, but because life moved faster than the list. The setup that never got finished. The thing that's been on the mental to-do since the move. The appointment that requires someone to actually be home.
            </p>
            <p style={{ fontSize: "1.15rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
              House Calls are for that. Not a crisis. Not caregiving. Practical, capable help for the operational side of everyday life — by someone who genuinely enjoys figuring it out.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/contact" className="btn btn-sage">Schedule a House Call</Link>
              <span style={{ fontSize: "0.8rem", fontWeight: 300, color: "rgba(248,244,227,0.45)" }}>$175/hr · 2-hour minimum</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IT IS ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "6rem 0" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "start",
          }} className="grid-cols-1 md:grid-cols-2">
            <FadeUp>
              <span className="eyebrow eyebrow-sage">What It Is</span>
              <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "2rem" }}>
                Practical help for the things life accumulates faster than anyone has time to address.
              </h2>
              <p className="body-lg" style={{ marginBottom: "1.5rem" }}>
                House Calls are flexible, hourly sessions for the operational side of household life — the things that don't fit neatly into a single category. Technology setup, home safety, vendor coordination, post-move settling, support during or after a transition.
              </p>
              <p className="body-lg" style={{ marginBottom: "1.5rem" }}>
                There's no discovery call required. You tell me what needs attention, I show up and handle it. Two-hour minimum, billed hourly after that.
              </p>
              <p className="body-lg">
                Some clients book a House Call once. Others build it into their monthly rhythm. Both are fine.
              </p>
            </FadeUp>
            <FadeUp delay={100}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{
                  backgroundColor: "var(--ink)",
                  padding: "2rem",
                  boxShadow: "6px 6px 0px var(--sage)",
                }}>
                  <p className="pull-quote" style={{ color: "rgba(248,244,227,0.85)", fontSize: "1rem" }}>
                    "The most common thing I hear after a House Call is: 'I can't believe I waited this long.' That's not a complaint. It's relief."
                  </p>
                  <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sage)", marginTop: "1.25rem" }}>
                    — Dayna Brown
                  </p>
                </div>
                <div style={{
                  backgroundColor: "var(--sage)",
                  padding: "1.75rem",
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--ink)", lineHeight: 1.7 }}>
                    <strong>No judgment about the state of things.</strong> House Calls are not an audit. I'm not here to assess how you've been living. I'm here to help you get things working again.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── WHAT WE HANDLE ── */}
      <section style={{ backgroundColor: "var(--ink)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow" style={{ color: "rgba(248,244,227,0.45)" }}>What I Handle</span>
            <h2 className="display-md" style={{ color: "var(--parchment)", marginBottom: "3rem", maxWidth: 500 }}>
              The list is longer than you'd expect.
            </h2>
          </FadeUp>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "0",
          }}>
            {[
              {
                category: "Technology & Setup",
                items: ["Printer, router, and device setup", "Phone and computer troubleshooting", "Smart home device installation", "Cable management and organization", "TV mounting coordination"],
              },
              {
                category: "Home Safety & Maintenance",
                items: ["Smoke and CO detector updates", "Light bulb and battery replacement", "AC vent cleaning coordination", "Safety assessment walk-through", "Handyperson coordination"],
              },
              {
                category: "Organization & Sorting",
                items: ["Paperwork and mail sorting", "Medicine cabinet and bathroom edit", "Garage and storage unit sorting", "Donation routing and drop-off", "Pre-move or post-move sorting"],
              },
              {
                category: "Transitions & Support",
                items: ["Post-move settling and unpacking", "Support after loss or major change", "Preparing a home for a new resident", "Downsizing assistance", "Estate support coordination"],
              },
              {
                category: "Ongoing Household",
                items: ["Recurring household tasks", "Seasonal organization", "Pre-event or pre-guest preparation", "Errand and coordination support", "Whatever the household needs"],
              },
              {
                category: "Belonging & Documentation",
                items: ["Item photography and cataloguing", "Heirloom identification", "Storage inventory", "Donation coordination", "Routing items to the right next place"],
              },
            ].map((cat, i) => (
              <FadeUp key={i} delay={i * 40}>
                <div style={{
                  padding: "2rem",
                  borderBottom: "1px solid rgba(248,244,227,0.1)",
                  borderRight: i % 2 === 0 ? "1px solid rgba(248,244,227,0.1)" : "none",
                }}>
                  <h3 style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sage)", marginBottom: "1.25rem" }}>
                    {cat.category}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {cat.items.map((item, j) => (
                      <p key={j} style={{ fontSize: "0.88rem", fontWeight: 300, color: "rgba(248,244,227,0.65)", lineHeight: 1.5 }}>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
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
              alignItems: "center",
            }} className="grid-cols-1 md:grid-cols-2">
              <div>
                <span className="eyebrow" style={{ color: "var(--sage-dark)" }}>Pricing</span>
                <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "1.5rem" }}>
                  $175/hr.<br />2-hour minimum.
                </h2>
                <p style={{ fontSize: "1rem", fontWeight: 300, color: "var(--ink)", lineHeight: 1.75, marginBottom: "1.5rem", opacity: 0.8 }}>
                  Billed in full hours. No partial billing. You'll always know the rate before I begin.
                </p>
                <p style={{ fontSize: "1rem", fontWeight: 300, color: "var(--ink)", lineHeight: 1.75, marginBottom: "2rem", opacity: 0.8 }}>
                  Monthly retainer packages are available for clients who want consistent, recurring support. Ask about these during your call.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Link href="/contact" className="btn btn-ink">Schedule a House Call</Link>
                  <Link href="/pricing" className="btn btn-outline-ink">Full Pricing Guide</Link>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { label: "Hourly rate", value: "$175/hr" },
                  { label: "Minimum booking", value: "2 hours" },
                  { label: "Monthly retainer", value: "Available — ask me" },
                  { label: "Service area", value: "Los Angeles + surrounding" },
                  { label: "Booking", value: "Schedule a call or book direct" },
                  { label: "Cancellation", value: "24-hour notice" },
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
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow eyebrow-sage">Common Questions</span>
            <h2 className="display-sm" style={{ color: "var(--ink)", marginBottom: "2.5rem" }}>Before you book</h2>
          </FadeUp>
          <div style={{ maxWidth: 680 }}>
            {[
              {
                q: "Is there a discovery call required?",
                a: "Not for House Calls. You can book directly or send a message with what you need. For larger or more complex situations, a brief call helps me prepare — but it's not required."
              },
              {
                q: "What if I'm not sure what I need?",
                a: "That's completely fine. Most clients book a House Call with a general sense of what needs attention — 'the office is a disaster' or 'I need help with my mom's house' — and I figure out the specifics when I arrive. You don't need a detailed list."
              },
              {
                q: "Can I book recurring House Calls?",
                a: "Yes. Monthly retainer packages are available for clients who want consistent support. These are priced individually based on frequency and scope. Ask about them during your call."
              },
              {
                q: "Do you work with older adults or people in transition?",
                a: "Yes, and I'm particularly thoughtful about this. I work with older adults who want support maintaining their homes, adult children who are helping a parent, and people navigating major life transitions. The pace and approach always match the situation."
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
                  Ready to schedule a House Call?
                </h2>
                <p style={{ fontSize: "0.95rem", fontWeight: 300, color: "rgba(248,244,227,0.65)" }}>
                  Tell me what needs attention. I'll take it from there.
                </p>
              </div>
              <Link href="/contact" className="btn btn-sage">Schedule a House Call</Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
