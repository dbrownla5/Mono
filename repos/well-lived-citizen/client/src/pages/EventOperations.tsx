/**
 * EVENT OPERATIONS — The Well Lived Citizen
 * Hidden SEO landing page. NOT linked in Nav or Footer.
 * Route: /event-operations
 * Purpose: Organic search traffic for event ops / retail merchandising gigs.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

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

// ── Inline contact form ────────────────────────────────────────────────────────

function EventContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", situation: "" });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.inquiry.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      service: "house-calls",
      situation: formData.situation || undefined,
      urgency: "ASAP",
    });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.85rem 1rem",
    border: "1.5px solid var(--warm-gray-lt)",
    backgroundColor: "white",
    fontSize: "0.9rem",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: "var(--ink)",
    outline: "none",
    boxSizing: "border-box",
  };

  if (submitted) {
    return (
      <div style={{ backgroundColor: "var(--sage)", padding: "2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>
          Got it — I'll be in touch.
        </p>
        <p style={{ fontSize: "0.9rem", color: "var(--ink)", opacity: 0.75 }}>
          I typically respond within a few hours for time-sensitive requests.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <p style={{ fontSize: "0.8rem", fontStyle: "italic", color: "var(--ink-soft)", marginBottom: "0.5rem" }}>
        Need an experienced operator on site this week? Let me know the timeline.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "0.4rem" }}>
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
            style={inputStyle}
            placeholder="Your name"
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "0.4rem" }}>
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
            style={inputStyle}
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div>
        <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "0.4rem" }}>
          Phone
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
          style={inputStyle}
          placeholder="Optional — for faster response"
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "0.4rem" }}>
          Tell me about the project
        </label>
        <textarea
          value={formData.situation}
          onChange={e => setFormData(p => ({ ...p, situation: e.target.value }))}
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
          placeholder="Event type, venue, dates, scope — whatever you have."
        />
      </div>
      <button
        type="submit"
        disabled={submitMutation.isPending}
        className="btn btn-ink"
        style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
      >
        {submitMutation.isPending ? "Sending…" : "Send Inquiry"}
      </button>
      {submitMutation.isError && (
        <p style={{ fontSize: "0.82rem", color: "#dc2626" }}>
          Something went wrong. Try again or email directly.
        </p>
      )}
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EventOperations() {
  return (
    <div style={{ backgroundColor: "var(--parchment)", minHeight: "100vh" }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{ backgroundColor: "var(--ink)", paddingTop: "10rem", paddingBottom: "7rem" }}>
        <div className="container">
          <div style={{ maxWidth: 720 }}>
            <span className="eyebrow eyebrow-light">Los Angeles · Available for Gig & Project Work</span>
            <h1 className="display-lg" style={{ color: "var(--parchment)", marginBottom: "2rem" }}>
              Event Operations, Breakdown &amp; Retail Merchandising
            </h1>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              Temporary Event &amp; Retail Operations
            </h2>
            <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(248,244,227,0.65)", lineHeight: 1.8 }}>
              The logistical setup and breakdown, handled.
            </p>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "6rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }} className="grid-cols-1 md:grid-cols-2">

            <FadeUp>
              <p className="body-lg" style={{ marginBottom: "1.5rem" }}>
                Before a venue opens and after the crowd leaves, there is a heavy operational layer that has to be managed. The merchandising needs to be set. The event needs logistical prep. And when it is over, the breakdown needs to happen fast and efficiently.
              </p>
              <p className="body-lg" style={{ marginBottom: "2rem" }}>
                With 14 years of executive retail operations and transformation leadership, I step in as high-level, temporary operational support for Los Angeles venues, pop-ups, and retail spaces. I am not a standard temp worker; I am an operations specialist who understands spatial logic, merchandising standards, and efficient breakdown systems.
              </p>

              {/* Available for */}
              <div style={{ marginBottom: "2.5rem" }}>
                <h3 style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "1rem" }}>
                  Available for Gig &amp; Project Support
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {[
                    "Hourly event prep and logistical setup",
                    "Post-event breakdown and load-out",
                    "Temporary and seasonal visual merchandising",
                    "Pop-up shop installation and resetting",
                    "Party and venue stage-setting",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem 0", borderBottom: "1px solid var(--warm-gray-lt)" }}>
                      <span style={{ width: 6, height: 6, backgroundColor: "var(--sage)", flexShrink: 0, marginTop: "0.45rem" }} />
                      <span style={{ fontSize: "0.95rem", fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "1rem" }}>
                  Pricing
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {[
                    { label: "Hourly Operations Support", value: "$150 / hr" },
                    { label: "Half-Day / Full-Day Buyouts", value: "Quoted by project and scope" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", padding: "0.85rem 0", borderBottom: "1px solid var(--warm-gray-lt)", alignItems: "baseline" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--ink)" }}>{item.label}</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--sage-dark)", whiteSpace: "nowrap" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Contact form */}
            <FadeUp delay={120}>
              <div style={{ backgroundColor: "var(--parchment-mid)", padding: "2.5rem", boxShadow: "6px 6px 0 var(--sage)" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "1.5rem" }}>
                  Get in Touch
                </p>
                <EventContactForm />
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── CREDIBILITY STRIP ── */}
      <section style={{ backgroundColor: "var(--ink)", padding: "4rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
              {[
                { num: "14+", label: "Years in retail operations & transformation leadership" },
                { num: "LA", label: "Based in Los Angeles, available locally and regionally" },
                { num: "Full", label: "Spectrum from setup to breakdown — one point of contact" },
              ].map((item, i) => (
                <div key={i} style={{ borderLeft: "3px solid var(--sage)", paddingLeft: "1.5rem" }}>
                  <p style={{ fontSize: "2rem", fontWeight: 800, color: "var(--parchment)", lineHeight: 1 }}>{item.num}</p>
                  <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "rgba(248,244,227,0.65)", lineHeight: 1.6, marginTop: "0.5rem" }}>{item.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: "var(--sage)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ maxWidth: 560 }}>
              <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "1.5rem" }}>
                Need someone on-site who knows what they're doing?
              </h2>
              <p style={{ fontSize: "1rem", fontWeight: 300, color: "var(--ink)", opacity: 0.8, lineHeight: 1.75, marginBottom: "2rem" }}>
                Use the form above or reach out directly. I respond quickly for time-sensitive requests.
              </p>
              <Link href="/contact" className="btn btn-ink">View All Services</Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
