import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

/*
  THE WELL LIVED CITIZEN CO — Home Page
  Design: Manus original — Plus Jakarta Sans, cream/rust/charcoal palette, split hero, 2×2 grid
  Copy: Verbatim from index(1).html — do not edit without Dayna's approval
  Brand: The Well Lived Citizen Co
  Email: dayna@thewelllivedcitizenco.com
*/

const C = {
  cream: "#F5F0E8",
  warm:  "#FAF7F2",
  linen: "#EDE7DB",
  char:  "#1C1917",
  ink:   "#292524",
  stone: "#57534E",
  sand:  "#A8A29E",
  rust:  "#9A5B3C",
};

const ff = "'Plus Jakarta Sans', sans-serif";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663404262996/2jeAZUR3GbEyHwqo5QJU6E/hero-new-Y97oiEyh5ace8o58DbaN8M.webp";

// ── Nav registry ───────────────────────────────────────────────────────────
const NAV_LINKS: [string, string][] = [
  ["Services & Pricing", "/services"],
  ["About",              "/about"],
  ["Get in Touch",       "/contact"],
];

// ── Footer links registry ──────────────────────────────────────────────────
const FOOTER_LINKS: [string, string][] = [
  ["Services", "/services"],
  ["About",    "/about"],
  ["Contact",  "/contact"],
];

// ── Service card registry — one entry per service ─────────────────────────
interface ServiceCard {
  num:    string;
  href:   string;
  title:  string;
  body:   string[];
  note?:  string;
  prices: string[];
  cta:    string;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    num:   "01",
    href:  "/services/home-organization",
    title: "Home Organization & Modern Move",
    body: [
      "Your home, made to work for how you actually live.",
      "The room that keeps collecting piles.",
      "The move where the boxes are technically inside, but nothing feels settled.",
      "The move where you had to leave before everything was packed, and someone still needs to close out what is left behind.",
      "The professional landing in Los Angeles the same day as their boxes and the first day on the job.",
      "The family move where packing a three-bedroom house with four kids is its own full operation.",
      "The closet that no longer fits your life, your body, your season, or the way you actually get dressed.",
      "I come in, find the friction, and make the space work around how you naturally move through your day.",
    ],
    note:   "Packing, move prep, closeout support, and closet systems available—with or without you. Full inventory and custom systems available when needed.",
    prices: ["$150/hr · 3hr min", "Modern Move Reset $1,200/day"],
    cta:    "Get help with your move or home reset →",
  },
  {
    num:   "02",
    href:  "/services/legacy",
    title: "Legacy Planning & Inventory Catalog",
    body: [
      "The operational layer of what quietly adds up inside a home.",
      "You may already have the estate planner, the will, and the paperwork. My work lives in the operational middle — the drawers, the sealed backup bedding, the hundreds of dollars of taper candles never opened, the wedding china with missing plates that's no longer a dinner service and not sellable as incomplete. The everyday things that still carry use, meaning, or resale value while someone is still living in the home.",
      "I help find the gaps inside real household life — what still serves daily use, what deserves documentation or proper appraisal, and what we forgot was even in there. I focus on what can create value now — full stop. And yes, I find the drawers and closets that need a realistic plan before exhaustion turns into rushed decisions. We've all had a few \"but I love this\" and \"what if I need it.\"",
      "Sometimes a piece has a story worth keeping with it. When those worlds collide and I can preserve a history, a moment, give it a new life to someone who knows that's just as valuable as the item — that's why I love this piece of my business. It brings the story back to connection at its core. When that matters, I document that too.",
    ],
    note:   "Not legal estate planning or estate sale services.",
    prices: ["Single room or storage unit: $175/hr · 2hr min", "Whole home: project pricing after walkthrough"],
    cta:    "See how inventory and legacy support works →",
  },
  {
    num:   "03",
    href:  "/services/house-calls",
    title: "House Calls",
    body: [
      "For the things life leaves unfinished.",
      "That's the thing friends used to do.",
      "The thing neighbors don't always exist for anymore.",
      "The thing adult children need when they're in another city.",
      "Once I know how your home works, it becomes easy for me to help keep it working — home check-ins, tech setup, hands-on home improvements, donation drop-offs, and the practical loose ends that make everyday life easier when someone trusted is paying attention.",
    ],
    prices: ["$175/hr · 2hr min"],
    cta:    "Book practical help for your home →",
  },
  {
    num:   "04",
    href:  "/services/resale",
    title: "Curated Resale & Consignment",
    body: [
      "Is it cool? Is it sellable? Will they even take it?",
      "This is for clothing, designer bags, jewelry, and the pieces you know might still have value but do not want to spend hours platform-matching, measuring, negotiating, and managing yourself.",
      "With an established luxury and resale background, I go through it piece by piece, decide what is worth the effort, and match each item to the platform where it makes the most sense. Clean, non-sellable items can be responsibly donated as part of the process.",
      "You fill the waterproof bag, sign the agreement, and I handle the rest — pickup, styling, measurements, listing, buyer questions, returns, monthly check-ins, and payout on the agreed split.",
    ],
    prices: ["Commission-based · agreement included"],
    cta:    "Schedule the handoff for resale →",
  },
];

// ── Shared micro-components ────────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: ff, fontSize: 11, fontWeight: 600,
    letterSpacing: "0.2em", textTransform: "uppercase" as const,
    color: C.rust, marginBottom: 16,
  }}>{children}</div>
);

const PriceTag = ({ children }: { children: React.ReactNode }) => (
  <span style={{
    fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
    color: C.rust, background: "rgba(154,91,60,0.07)",
    padding: "4px 10px", border: "1px solid rgba(154,91,60,0.18)",
    fontFamily: ff,
  }}>{children}</span>
);

// ── Service card component ─────────────────────────────────────────────────
function SvcCard({ card }: { card: ServiceCard }) {
  return (
    <div style={{ background: C.warm, border: `1px solid ${C.linen}`, height: "100%", display: "flex", flexDirection: "column" as const }}>
      {/* Header */}
      <div style={{ padding: "40px 40px 24px" }}>
        <Label>{card.num}</Label>
        <h3 style={{ fontFamily: ff, fontSize: 22, fontWeight: 700, color: C.char, marginBottom: 20, letterSpacing: "-0.01em" }}>{card.title}</h3>
        {/* Body — tight line-height, generous paragraph gap */}
        {card.body.map((p, i) => (
          <p key={i} style={{
            fontFamily: ff, fontSize: 14, color: C.ink,
            lineHeight: 1.55,
            marginBottom: i === 0 ? 16 : i === card.body.length - 1 ? 0 : 10,
            fontWeight: i === 0 ? 500 : 400,
          }}>{p}</p>
        ))}
      </div>
      {/* Thin rule */}
      <div style={{ height: 1, background: C.linen, margin: "20px 40px" }} />
      {/* Note */}
      {card.note && (
        <p style={{ fontFamily: ff, fontSize: 12, color: C.stone, lineHeight: 1.65, margin: "0 40px 20px", fontStyle: "italic" }}>{card.note}</p>
      )}
      {/* Pricing */}
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, padding: "0 40px 24px" }}>
        {card.prices.map((p, i) => <PriceTag key={i}>{p}</PriceTag>)}
      </div>
      {/* Book CTA block — contrasting warm rust strip */}
      <Link href={card.href}>
        <div style={{
          marginTop: "auto",
          background: "rgba(154,91,60,0.08)",
          borderTop: `1px solid rgba(154,91,60,0.18)`,
          padding: "16px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", transition: "background 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(154,91,60,0.15)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(154,91,60,0.08)")}
        >
          <span style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.rust }}>
            {card.cta}
          </span>
          <span style={{ color: C.rust, fontSize: 16 }}>→</span>
        </div>
      </Link>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

export default function Home() {
  const [vis, setVis] = useState<Record<string, boolean>>({});
  const refs = useRef<Record<string, Element | null>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setVis((p) => ({ ...p, [e.target.id]: true }));
      });
    }, { threshold: 0.1 });
    Object.values(refs.current).forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const reg = (id: string) => (el: Element | null) => {
    if (el) { (el as HTMLElement).id = id; refs.current[id] = el; }
  };

  const fi = (id: string): React.CSSProperties => ({
    opacity: vis[id] ? 1 : 0,
    transform: vis[id] ? "translateY(0)" : "translateY(28px)",
    transition: "opacity 0.8s ease, transform 0.8s ease",
  });

  return (
    <div style={{ background: C.cream, color: C.ink, minHeight: "100vh", fontFamily: ff }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: C.cream + "EE", backdropFilter: "blur(16px)",
        borderBottom: scrolled ? `1px solid ${C.linen}` : "1px solid transparent",
        transition: "border-color 0.3s",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/">
            <div style={{ cursor: "pointer", fontFamily: ff, fontSize: 15, fontWeight: 700, color: C.char, letterSpacing: "-0.01em" }}>
              The Well Lived Citizen Co
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden md:flex">
            {NAV_LINKS.map(([label, href]) => (
              <Link key={href} href={href}>
                <span style={{ fontFamily: ff, fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.stone, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.rust)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.stone)}
                >{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 4 }}
            className="flex md:hidden" aria-label="Menu"
          >
            <span style={{ width: 22, height: 1.5, background: C.char, display: "block", transition: "transform 0.2s", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <span style={{ width: 22, height: 1.5, background: C.char, display: "block", opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
            <span style={{ width: 22, height: 1.5, background: C.char, display: "block", transition: "transform 0.2s", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>
        </div>

        {menuOpen && (
          <div style={{ background: C.cream, borderTop: `1px solid ${C.linen}`, padding: "16px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
            {NAV_LINKS.map(([label, href]) => (
              <Link key={href} href={href}>
                <span onClick={() => setMenuOpen(false)} style={{ fontFamily: ff, fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.ink, cursor: "pointer", display: "block" }}>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ paddingTop: 64 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gridTemplateRows: isMobile ? `${Math.round(window.innerWidth * 0.56)}px auto` : undefined,
          minHeight: isMobile ? undefined : "calc(100vh - 64px)",
          width: "100%",
        }}>
          {/* Image — on mobile renders first (top) */}
          {isMobile && (
            <div style={{
              backgroundImage: `url(${HERO_IMG})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              height: Math.round(window.innerWidth * 0.56),
              width: "100%",
            }} />
          )}

          {/* Text */}
          <div style={{
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: isMobile ? "36px 24px 40px" : "60px 56px 60px 40px",
            animation: "fadeUp 1s ease forwards",
          }}>
            <div style={{ fontFamily: ff, fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.rust, marginBottom: 28 }}>
              Los Angeles · Concierge Home &amp; Life Services
            </div>
            <h1 style={{ fontSize: isMobile ? "clamp(28px, 8vw, 40px)" : "clamp(32px, 3.6vw, 52px)", fontWeight: 700, lineHeight: 1.1, color: C.char, marginBottom: 0, letterSpacing: "-0.02em" }}>
              When <em style={{ fontStyle: "italic", color: C.rust }}>"there has to be an easier way"</em> becomes a business.
            </h1>
            <div style={{ width: 64, height: 2, background: C.rust, margin: "32px 0", animation: "lineGrow 1.2s ease forwards", animationDelay: "0.4s" }} />
            <p style={{ fontFamily: ff, fontSize: 16, fontWeight: 400, lineHeight: 1.75, color: C.stone, maxWidth: 480, marginBottom: 40, fontStyle: "italic" }}>
              Welcome to the concierge for the things you don't want to handle.
            </p>
            <Link href="/services">
              <span style={{ display: "inline-block", fontFamily: ff, fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.rust, borderBottom: `1px solid ${C.rust}`, paddingBottom: 2, cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.65")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >See the work</span>
            </Link>
          </div>

          {/* Image — desktop only (right column) */}
          {!isMobile && (
            <div style={{
              backgroundImage: `url(${HERO_IMG})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              minHeight: 480,
            }} />
          )}
        </div>
      </section>


      {/* ── CHAOS INTRO ── */}
      <section style={{ padding: "72px 40px 0", background: C.warm }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontFamily: ff, fontSize: 15, fontWeight: 400, lineHeight: 1.9, color: C.stone, marginBottom: 16 }}>
            My daily flow already runs through shipping, logistics, tech fixes, resale, and real-world problem solving at scale.
          </p>
          <p style={{ fontFamily: ff, fontSize: 15, fontWeight: 400, lineHeight: 1.9, color: C.stone, marginBottom: 16 }}>
            I move fast where things are solvable, and when life gets stuck, I know how to move it through.
          </p>
          <p style={{ fontFamily: ff, fontSize: 19, fontWeight: 600, fontStyle: "italic", color: C.rust, marginBottom: 0 }}>
            I'm built for your chaos.
          </p>
        </div>
      </section>
      {/* ── PRIMARY CONVERSION FUNNELS ── */}
      <section style={{ padding: "56px 40px 80px", background: C.warm }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }} className="cta-grid">
            <div style={{ background: C.char, padding: "40px", color: C.cream }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: C.cream, fontFamily: ff }}>Ready to move on it?</h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, marginBottom: 20, color: "rgba(245,240,232,0.85)", fontFamily: ff }}>
                Book the 4-Hour Practical Reset for the room, task list, move landing, or household overflow that needs to stop catching immediately.
              </p>
              <Link href="/contact">
                <button style={{ padding: "12px 24px", background: C.rust, color: C.cream, border: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, cursor: "pointer", fontFamily: ff }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >Book 4-Hour Reset</button>
              </Link>
            </div>
            <div style={{ background: C.rust, padding: "40px", color: C.cream }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: C.cream, fontFamily: ff }}>Resale bag pickup</h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, marginBottom: 8, color: "rgba(245,240,232,0.9)", fontFamily: ff }}>
                Moving, closet cleanout, post-breakup, wardrobe reset — fill 2 to 4 totes and get them to me same day.
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 20, color: "rgba(245,240,232,0.75)", fontFamily: ff }}>Same-day pickup or courier handoff available.</p>
              <Link href="/contact">
                <button style={{ padding: "12px 24px", background: C.char, color: C.cream, border: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, cursor: "pointer", fontFamily: ff }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >Schedule Pickup</button>
              </Link>
            </div>
          </div>
          <div style={{ borderLeft: `3px solid ${C.rust}`, paddingLeft: 28, marginBottom: 0 }}>
            <h4 style={{ fontSize: 17, fontWeight: 600, color: C.char, marginBottom: 12, fontFamily: ff }}>Need to leave before everything is packed?</h4>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: C.stone, marginBottom: 12, fontFamily: ff }}>
              You go to the new city, the family home, the furnished rental, or the next place first. I stay behind to pack and close out the space, move what should store, route what should sell, ship what you still need in labeled boxes.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: C.stone, fontStyle: "italic", fontFamily: ff }}>
              Start with a scoped project fee built from hourly work blocks, then let the move continue flexibly in chunks without carrying the urgency yourself.
            </p>
          </div>
        </div>
      </section>      <div style={{ height: 1, background: C.linen }} />

      {/* ── SERVICE OVERVIEW ── */}
      <section ref={reg("svc") as any} style={{ padding: "100px 0", width: "100%", ...fi("svc") }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 56px" }}>
          <Label>The Work</Label>
          <h2 style={{ fontFamily: ff, fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 700, color: C.char, marginBottom: 12, letterSpacing: "-0.01em" }}>
            Choose where you are right now. The rest gets built around that.
          </h2>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <div className="svc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {SERVICE_CARDS.map((card) => <SvcCard key={card.num} card={card} />)}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section style={{ background: C.warm, padding: "80px 40px", borderTop: `1px solid ${C.linen}`, borderBottom: `1px solid ${C.linen}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" as const }}>
          <div style={{ fontFamily: ff, fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.rust, marginBottom: 28 }}>Client</div>
          <blockquote style={{ margin: 0 }}>
            <p style={{ fontFamily: ff, fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 400, lineHeight: 1.85, color: C.ink, fontStyle: "italic", marginBottom: 32 }}>
              &ldquo;I wake up and my clicker for all my lamps is on my bedside table. I get up and move it to the dresser by the door so every time I come back in I can turn any lamp from the doorway. My clothes are arranged by item and color, my purses on two long shelves and two short ones — I can see what I have and choose accordingly. My shoes are on four shelves where I can easily see them. The heat is set perfectly. The TV is set up with only one clicker to get to all the channels I want. Thank you for making life easier for me.&rdquo;
            </p>
            <footer style={{ fontFamily: ff, fontSize: 13, fontWeight: 600, color: C.stone, letterSpacing: "0.06em" }}>
              Gayle Williams &mdash; <span style={{ fontWeight: 400, fontStyle: "italic" }}>Seattle Client</span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section ref={reg("cta") as any} style={{ background: C.char, padding: "100px 40px", ...fi("cta") }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663404262996/2jeAZUR3GbEyHwqo5QJU6E/logo-white_3843d9eb.png"
            alt="The Well Lived Citizen Co"
            style={{ height: 72, width: "auto", display: "block", marginBottom: 40, opacity: 0.9 }}
          />
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="cta-grid">
          <h2 style={{ fontFamily: ff, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, lineHeight: 1.2, color: C.cream, letterSpacing: "-0.02em" }}>
            Not sure where to start? <em style={{ fontStyle: "italic", color: C.rust }}>Start anywhere.</em>
          </h2>
          <div>
            <p style={{ fontFamily: ff, fontSize: 15, fontWeight: 400, lineHeight: 1.8, color: "rgba(245,240,232,0.65)", marginBottom: 28 }}>
              No pressure. The whole point is to make your life easier to navigate from here.
            </p>
            <Link href="/services">
              <button style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "14px 32px", background: "transparent", color: C.cream, border: `1px solid rgba(245,240,232,0.35)`, cursor: "pointer", transition: "all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.cream; e.currentTarget.style.color = C.char; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.cream; }}
              >See All Services &amp; Pricing</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "40px", maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.linen}`, flexWrap: "wrap" as const, gap: 16 }}>
        <div>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663404262996/2jeAZUR3GbEyHwqo5QJU6E/logo-black_062f8361.png"
            alt="The Well Lived Citizen Co"
            style={{ height: 48, width: "auto", display: "block" }}
          />
          <div style={{ fontFamily: ff, fontSize: 11, color: C.sand, marginTop: 4 }}>Los Angeles, CA</div>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {FOOTER_LINKS.map(([label, href]) => (
            <Link key={href} href={href}>
              <span style={{ fontFamily: ff, fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.stone, cursor: "pointer" }}>{label}</span>
            </Link>
          ))}
        </div>
        <div style={{ fontFamily: ff, fontSize: 11, color: C.sand }}>© 2026 The Well Lived Citizen Co · Los Angeles, CA</div>
      </footer>

      {/* Keyframes — mobile CSS lives in index.css */}
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(36px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lineGrow { from { width: 0; } to { width: 64px; } }
      `}</style>
    </div>
  );
}
