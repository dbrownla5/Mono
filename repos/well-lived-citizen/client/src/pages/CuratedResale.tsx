/*
 * CURATED RESALE — The Well Lived Citizen
 * Voice: knowledgeable, practical, not precious. Not a consignment shop — a service.
 */

import { useEffect, useRef } from "react";
import { Link } from "wouter";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FAQItem from "@/components/FAQItem";

const RESALE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663617904380/mgu6hYeV9ySpxKK6swiZX2/wlc-resale-8VnpojbdWyhKVLn6rRGofZ.webp";

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

export default function CuratedResale() {
  return (
    <div style={{ backgroundColor: "var(--parchment)", minHeight: "100vh" }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        paddingTop: "10rem",
        paddingBottom: "6rem",
        backgroundColor: "var(--parchment)",
        overflow: "hidden",
      }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <span className="eyebrow eyebrow-sage">Service 03</span>
              <div style={{
                display: "inline-block",
                backgroundColor: "var(--ink)",
                padding: "0.3rem 0.8rem",
                marginBottom: "1.5rem",
              }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--parchment)" }}>
                  Consignment &amp; Resale
                </span>
              </div>
              <h1 className="display-lg" style={{ color: "var(--ink)", marginBottom: "1.5rem" }}>
                Curated Resale
              </h1>
              <p style={{ fontSize: "1.1rem", fontWeight: 300, color: "var(--sage-dark)", lineHeight: 1.75, maxWidth: 460, marginBottom: "2.5rem" }}>
                Not everything belongs in a donation pile. I identify what still holds value, research the right platform, and handle the listing — without asking you to become a part-time reseller.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <Link href="/contact" className="btn btn-sage">Schedule a Pickup</Link>
                <span style={{ fontSize: "0.8rem", fontWeight: 300, color: "var(--sage-dark)" }}>Commission-based · No upfront cost</span>
              </div>
            </div>
            <div>
              <img
                src={RESALE_IMG}
                alt="Curated resale items"
                style={{ width: "100%", display: "block", objectFit: "cover", boxShadow: "10px 10px 0px var(--ink)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IT IS ── */}
      <section style={{ backgroundColor: "var(--ink)", padding: "6rem 0" }}>
        <div className="container">
          <div style={{ maxWidth: 700 }}>
            <FadeUp>
              <span className="eyebrow" style={{ color: "rgba(248,244,227,0.45)" }}>What It Is</span>
              <h2 className="display-md" style={{ color: "var(--parchment)", marginBottom: "2rem" }}>
                Resale without the part-time job.
              </h2>
              <p style={{ fontSize: "1.05rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                Curated Resale is a full-service consignment offering for the things in your home that still hold real value — designer accessories, vintage and contemporary clothing, jewelry, art, lamps, inherited belongings, and household overflow.
              </p>
              <p style={{ fontSize: "1.05rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                I handle the evaluation, the research, the photography, the platform selection, and the listing. I communicate clearly throughout the process. You don't have to monitor anything or answer buyer questions.
              </p>
              <p style={{ fontSize: "1.05rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.75 }}>
                Items that sell generate a return. Items that don't sell are returned to you or donated at your direction. No surprises.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ backgroundColor: "var(--parchment)", padding: "6rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow eyebrow-sage">How It Works</span>
            <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "3rem", maxWidth: 480 }}>
              Five steps. Zero hassle on your end.
            </h2>
          </FadeUp>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              {
                num: "01",
                title: "Pickup or drop-off",
                body: "I schedule a pickup at your home. No prep required on your end — I handle the sorting and evaluation."
              },
              {
                num: "02",
                title: "Evaluation and research",
                body: "I assess condition, brand, and current market demand. I research comparable sold listings to set realistic, competitive prices — not wishful thinking."
              },
              {
                num: "03",
                title: "Photography and listing",
                body: "I photograph items and create listings on the platforms best suited to each item — Poshmark, eBay, The RealReal, Chairish, Facebook Marketplace, and others depending on category."
              },
              {
                num: "04",
                title: "Active management",
                body: "I manage buyer inquiries, price adjustments, and shipping. You don't have to monitor anything. I'll communicate when items sell."
              },
              {
                num: "05",
                title: "Payment and reporting",
                body: "When items sell, you receive your share of the proceeds. I provide a clear accounting of what sold, at what price, and what the commission was."
              },
            ].map((step, i) => (
              <FadeUp key={i} delay={i * 50}>
                <div className="hr-warm" />
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "3rem 1fr",
                  gap: "2rem",
                  padding: "2rem 0",
                  alignItems: "start",
                }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", color: "var(--sage)" }}>{step.num}</span>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>{step.title}</h3>
                    <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "var(--sage-dark)", lineHeight: 1.7 }}>{step.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
            <div className="hr-warm" />
          </div>
        </div>
      </section>

      {/* ── WHAT WE ACCEPT ── */}
      <section style={{ backgroundColor: "var(--sage)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <span className="eyebrow" style={{ color: "var(--sage-dark)" }}>What I Accept</span>
            <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "3rem", maxWidth: 480 }}>
              If it has value, I want to know about it.
            </h2>
          </FadeUp>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}>
            {[
              { cat: "Clothing", items: "Designer, vintage, contemporary, and quality basics in good condition." },
              { cat: "Accessories", items: "Handbags, scarves, belts, hats, and small leather goods." },
              { cat: "Jewelry", items: "Fine jewelry, costume jewelry, watches, and vintage pieces." },
              { cat: "Shoes", items: "Designer and quality footwear in wearable condition." },
              { cat: "Home & Decor", items: "Lamps, art, mirrors, ceramics, vintage decor, and quality furniture." },
              { cat: "Inherited Belongings", items: "Collections, heirlooms, and estate items — I assess and route appropriately." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 40}>
                <div style={{
                  backgroundColor: "white",
                  padding: "2rem",
                  border: "1px solid var(--warm-gray-lt)",
                }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>{item.cat}</h3>
                  <p style={{ fontSize: "0.85rem", fontWeight: 300, color: "var(--sage-dark)", lineHeight: 1.65 }}>{item.items}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={200}>
            <p style={{ fontSize: "0.85rem", fontWeight: 300, color: "var(--ink)", marginTop: "2rem", opacity: 0.7 }}>
              Not sure if something qualifies? Send me a photo. I'll give you an honest assessment.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── COMMISSION ── */}
      <section style={{ backgroundColor: "var(--ink)", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "5rem",
              alignItems: "center",
            }} className="grid-cols-1 md:grid-cols-2">
              <div>
                <span className="eyebrow" style={{ color: "rgba(248,244,227,0.45)" }}>Commission Structure</span>
                <h2 className="display-md" style={{ color: "var(--parchment)", marginBottom: "1.5rem" }}>
                  No upfront cost.<br />I earn when you earn.
                </h2>
                <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(248,244,227,0.7)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                  Curated Resale is commission-based. There is no upfront fee for standard consignment. My commission is calculated on the final sale price and varies by item category and platform.
                </p>
                <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(248,244,227,0.7)", lineHeight: 1.75, marginBottom: "2rem" }}>
                  For high-value collections or estate situations, I offer a flat-rate assessment and management option. Ask about this during your consultation.
                </p>
                <Link href="/contact" className="btn btn-sage">Schedule a Pickup</Link>
              </div>
              <div>
                <div style={{
                  backgroundColor: "rgba(248,244,227,0.06)",
                  border: "1px solid rgba(248,244,227,0.12)",
                  padding: "2.5rem",
                }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: "1.5rem" }}>
                    What to expect
                  </h3>
                  {[
                    "Commission disclosed before I accept items",
                    "Clear accounting of every sale",
                    "Items that don't sell are returned or donated at your direction",
                    "No surprise fees or deductions",
                    "Payment issued within 30 days of sale",
                  ].map((item, i) => (
                    <div key={i} style={{
                      padding: "0.75rem 0",
                      borderBottom: "1px solid rgba(248,244,227,0.1)",
                      fontSize: "0.88rem",
                      fontWeight: 300,
                      color: "rgba(248,244,227,0.7)",
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                    }}>
                      <span style={{ color: "var(--sage)", flexShrink: 0, marginTop: 2 }}>→</span>
                      {item}
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
            <h2 className="display-sm" style={{ color: "var(--ink)", marginBottom: "2.5rem" }}>Before you start</h2>
          </FadeUp>
          <div style={{ maxWidth: 680 }}>
            {[
              {
                q: "How quickly can items start selling?",
                a: "For standard items, you could see listings go live within 5–7 days of pickup. Sales timelines vary by item and platform — some things sell within days, others take weeks. I'll give you a realistic sense of what to expect for your specific items."
              },
              {
                q: "What if something doesn't sell?",
                a: "Items that don't sell within an agreed timeframe are returned to you or donated at your direction. I'll discuss this before I accept items so there are no surprises."
              },
              {
                q: "Do I need to clean or prep items before pickup?",
                a: "No. I handle the prep. Items should be in the condition they're in — I'll assess and handle cleaning or minor prep as needed."
              },
              {
                q: "Can I use Curated Resale for an estate or inherited collection?",
                a: "Yes. Estate and inherited collections are something I handle with particular care. I can assess, document, and route items appropriately — resale, donation, or preservation. A consultation call is recommended for larger collections."
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
                  Ready to start a resale pickup?
                </h2>
                <p style={{ fontSize: "0.95rem", fontWeight: 300, color: "rgba(248,244,227,0.65)" }}>
                  Schedule a call or send me a photo of what you have. I'll take it from there.
                </p>
              </div>
              <Link href="/contact" className="btn btn-sage">Schedule a Pickup</Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
