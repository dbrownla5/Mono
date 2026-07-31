/*
 * NAV — The Well Lived Citizen
 * Fixed top nav. Parchment background. No blur. Solid and present.
 * Services dropdown: Layer 1 (Quick Books) + Layer 2 (Four Pillars)
 * Mobile: hamburger drawer with full architecture.
 */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";

const pillars = [
  { href: "/home-reset-move-support", label: "Home Reset & Move Support", num: "01" },
  { href: "/legacy-planning", label: "Legacy Planning & Inventory", num: "02" },
  { href: "/house-calls-pillar", label: "House Calls", num: "03" },
  { href: "/curated-resale-consignment", label: "Curated Resale & Consignment", num: "04" },
];

const quickBooks = [
  { href: "/the-reset", label: "The 4-Hour Reset" },
  { href: "/house-calls", label: "The 2-Hour House Call" },
  { href: "/fast-bag-fill", label: "The Fast Bag Fill" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const topLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQs" },
  ];

  const navLinkStyle = (href: string) => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: location === href ? "var(--sage)" : "var(--ink)",
    transition: "color 0.18s ease",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
  });

  return (
    <>
      <nav className={`nav-fixed ${scrolled ? "scrolled" : ""}`} style={{ height: 68 }}>
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img
              src="/manus-storage/logo-black_c5630162.png"
              alt="Well Lived Citizen"
              style={{ height: 30, width: "auto", display: "block", objectFit: "contain" }}
            />
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }} className="hidden md:flex">

            {/* Services dropdown */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                style={navLinkStyle("/services")}
                onClick={() => setServicesOpen(!servicesOpen)}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--sage)"; }}
                onMouseLeave={(e) => { if (!servicesOpen) (e.currentTarget as HTMLElement).style.color = "var(--ink)"; }}
              >
                Services ▾
              </button>

              {servicesOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 1.25rem)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "var(--parchment)",
                  border: "1px solid var(--warm-gray-lt)",
                  boxShadow: "4px 4px 0 var(--sage)",
                  width: 380,
                  zIndex: 200,
                  padding: "1.5rem",
                }}>
                  {/* Pillars */}
                  <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "0.75rem" }}>
                    The Four Pillars
                  </p>
                  {pillars.map((p) => (
                    <Link key={p.href} href={p.href} style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", padding: "0.6rem 0", borderBottom: "1px solid var(--warm-gray-lt)", textDecoration: "none" }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--sage)", minWidth: 18 }}>{p.num}</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--ink)", lineHeight: 1.4 }}>{p.label}</span>
                    </Link>
                  ))}

                  {/* Quick Books */}
                  <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginTop: "1.25rem", marginBottom: "0.75rem" }}>
                    Quick Books
                  </p>
                  {quickBooks.map((q) => (
                    <Link key={q.href} href={q.href} style={{ display: "block", padding: "0.5rem 0", borderBottom: "1px solid var(--warm-gray-lt)", textDecoration: "none" }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 400, color: "var(--ink-soft)", lineHeight: 1.4 }}>{q.label}</span>
                    </Link>
                  ))}

                  <Link href="/services" style={{ display: "block", marginTop: "1rem", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--sage-dark)", textDecoration: "none" }}>
                    View All Services →
                  </Link>
                </div>
              )}
            </div>

            {topLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={navLinkStyle(l.href)}
                onMouseEnter={(e) => { if (location !== l.href) (e.currentTarget as HTMLElement).style.color = "var(--sage)"; }}
                onMouseLeave={(e) => { if (location !== l.href) (e.currentTarget as HTMLElement).style.color = "var(--ink)"; }}
              >
                {l.label}
              </Link>
            ))}

            <Link href="/contact" className="btn btn-ink" style={{ padding: "0.6rem 1.4rem", fontSize: "0.65rem" }}>
              Schedule a Call
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", display: "flex", flexDirection: "column", gap: 5 }}
          >
            <span style={{ display: "block", width: 22, height: 1.5, backgroundColor: "var(--ink)", transition: "all 0.2s ease", transform: open ? "translateY(6.5px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 1.5, backgroundColor: "var(--ink)", transition: "all 0.2s ease", opacity: open ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 1.5, backgroundColor: "var(--ink)", transition: "all 0.2s ease", transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div style={{ position: "fixed", top: 68, left: 0, right: 0, bottom: 0, backgroundColor: "var(--parchment)", zIndex: 99, overflowY: "auto", padding: "2rem 1.5rem" }}>

          {/* Pillars */}
          <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "0.75rem" }}>
            The Four Pillars
          </p>
          {pillars.map((p) => (
            <div key={p.href}>
              <Link href={p.href} style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", padding: "1rem 0", textDecoration: "none" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--sage)", minWidth: 20 }}>{p.num}</span>
                <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>{p.label}</span>
              </Link>
              <div className="hr-warm" />
            </div>
          ))}

          {/* Quick Books */}
          <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginTop: "1.5rem", marginBottom: "0.75rem" }}>
            Quick Books
          </p>
          {quickBooks.map((q) => (
            <div key={q.href}>
              <Link href={q.href} style={{ display: "block", padding: "1rem 0", fontSize: "1rem", fontWeight: 400, color: "var(--ink-soft)", textDecoration: "none" }}>
                {q.label}
              </Link>
              <div className="hr-warm" />
            </div>
          ))}

          {/* Other links */}
          <div style={{ marginTop: "1.5rem" }}>
            {topLinks.map((l) => (
              <div key={l.href}>
                <Link href={l.href} style={{ display: "block", padding: "1rem 0", fontSize: "1rem", fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}>
                  {l.label}
                </Link>
                <div className="hr-warm" />
              </div>
            ))}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <Link href="/contact" className="btn btn-sage" style={{ width: "100%", justifyContent: "center" }}>
              Schedule a Call
            </Link>
          </div>

          {/* Social links */}
          <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--warm-gray-lt)", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-dark)", marginBottom: "0.25rem" }}>Follow</p>
            {[
              { href: "https://www.instagram.com/thewelllivedcitizen", label: "@thewelllivedcitizen" },
              { href: "https://www.instagram.com/thewelllivedcloset", label: "@thewelllivedcloset" },
              { href: "https://posh.mk/wUAQhT0Qj3b", label: "Poshmark Closet" },
            ].map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--sage-dark)", textDecoration: "none" }}>
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
