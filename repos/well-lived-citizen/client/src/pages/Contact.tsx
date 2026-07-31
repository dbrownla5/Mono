/*
 * CONTACT / INTAKE FORM — The Well Lived Citizen
 * Uses tRPC to persist submissions to the database.
 * File uploads go to /api/upload/:inquiryId after submission.
 */

import { useState, useEffect, useRef } from "react";
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

type ServiceType = "" | "reset" | "house-calls" | "resale" | "fast-bag" | "legacy" | "not-sure";

const serviceLabels: Record<ServiceType, string> = {
  "": "",
  "reset": "The Reset (4-hour session)",
  "house-calls": "House Calls (hourly support)",
  "resale": "Resale & Consignment",
  "fast-bag": "Fast Bag Fill (pickup)",
  "legacy": "Legacy Inventory & Story Archive",
  "not-sure": "I'm not sure yet",
};

const serviceDescriptions: Record<ServiceType, string> = {
  "": "",
  "reset": "A focused 4-hour working session. $495 flat.",
  "house-calls": "Flexible hourly household support. $175/hr, 2-hour minimum.",
  "resale": "Full-service consignment for items with real value. Commission-based.",
  "fast-bag": "Fill a bag, I pick it up. Complimentary pickup.",
  "legacy": "Photographed inventory and story archive. Starting from $1,500.",
  "not-sure": "I'll help you figure out the right fit on a call.",
};

export default function Contact() {
  const [service, setService] = useState<ServiceType>("");
  const [submitted, setSubmitted] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    neighborhood: "",
    service: "" as ServiceType,
    urgency: "",
    situation: "",
    hearAbout: "",
    preferredContact: "",
    bestTime: "",
  });

  const submitMutation = trpc.inquiry.submit.useMutation({
    onSuccess: async (data) => {
      // Upload files if any were selected
      if (selectedFiles.length > 0 && data.inquiryId) {
        setUploadProgress("Uploading your files…");
        try {
          const formDataUpload = new FormData();
          selectedFiles.forEach((f) => formDataUpload.append("files", f));
          const res = await fetch(`/api/upload/${data.inquiryId}`, {
            method: "POST",
            body: formDataUpload,
          });
          if (!res.ok) throw new Error("Upload failed");
        } catch {
          setUploadError("Your inquiry was saved, but file upload failed. You can email files directly to dayna@thewelllivedcitizen.com.");
        } finally {
          setUploadProgress(null);
        }
      }
      setSubmitted(true);
    },
    onError: (err) => {
      console.error("Submission error:", err);
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "service") setService(value as ServiceType);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(f => f.size <= 16 * 1024 * 1024);
    if (valid.length < files.length) {
      setUploadError("Some files were too large (max 16MB each) and were removed.");
    }
    setSelectedFiles(prev => [...prev, ...valid].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    submitMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      neighborhood: formData.neighborhood || undefined,
      service: formData.service || "not-sure",
      urgency: formData.urgency || undefined,
      situation: formData.situation || undefined,
      preferredContact: formData.preferredContact || undefined,
      bestTime: formData.bestTime || undefined,
      hearAbout: formData.hearAbout || undefined,
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "0.9rem 1rem",
    backgroundColor: "white",
    border: "1.5px solid var(--warm-gray-lt)",
    fontSize: "0.9rem",
    fontWeight: 400,
    color: "var(--ink)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.18s ease",
    borderRadius: 0,
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--sage-dark)",
    marginBottom: "0.5rem",
  };

  const fieldStyle = { marginBottom: "1.75rem" };

  const isSubmitting = submitMutation.isPending || !!uploadProgress;

  return (
    <div style={{ backgroundColor: "var(--parchment)", minHeight: "100vh" }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{ backgroundColor: "var(--ink)", paddingTop: "10rem", paddingBottom: "6rem" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <div>
              <span className="eyebrow" style={{ color: "rgba(248,244,227,0.45)" }}>Get in Touch</span>
              <h1 className="display-lg" style={{ color: "var(--parchment)", marginBottom: "1.5rem" }}>
                Let's figure out<br />what you need.
              </h1>
              <p style={{ fontSize: "1.1rem", fontWeight: 300, color: "rgba(248,244,227,0.7)", lineHeight: 1.75 }}>
                Fill out the form and I'll be in touch within 24–48 hours to schedule a brief call. No pressure, no commitment — just a conversation.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ backgroundColor: "rgba(248,244,227,0.06)", border: "1px solid rgba(248,244,227,0.12)", padding: "2rem" }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--parchment)", marginBottom: "1.25rem" }}>
                  Prefer to reach out directly?
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <a href="tel:3234331350" style={{ fontSize: "0.9rem", fontWeight: 400, color: "rgba(248,244,227,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ color: "var(--sage)", fontSize: "0.7rem" }}>CALL</span>
                    (323) 433-1350
                  </a>
                  <a href="mailto:dayna@thewelllivedcitizen.com" style={{ fontSize: "0.9rem", fontWeight: 400, color: "rgba(248,244,227,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ color: "var(--sage)", fontSize: "0.7rem" }}>EMAIL</span>
                    dayna@thewelllivedcitizen.com
                  </a>
                </div>
              </div>
              <div style={{ backgroundColor: "var(--sage)", padding: "1.5rem 2rem" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--parchment)", lineHeight: 1.65 }}>
                  I respond to every inquiry personally. You won't get an auto-reply and then silence. If I'm unavailable, I'll tell you when to expect a response.
                </p>
                <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(248,244,227,0.7)", marginTop: "0.75rem" }}>
                  — Dayna
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORM / CONFIRMATION ── */}
      {!submitted ? (
        <section style={{ backgroundColor: "var(--parchment)", padding: "5rem 0" }}>
          <div className="container">
            <FadeUp>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "5rem", alignItems: "start" }}>
                {/* Left: context */}
                <div style={{ position: "sticky", top: "7rem" }}>
                  <span className="eyebrow eyebrow-sage">Intake Form</span>
                  <h2 className="display-sm" style={{ color: "var(--ink)", marginBottom: "1.5rem" }}>
                    Tell me a bit about what you're working with.
                  </h2>
                  <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "var(--sage-dark)", lineHeight: 1.75, marginBottom: "2rem" }}>
                    The more context you give me, the better I can prepare. Nothing here is binding — it just helps me understand your situation before the call.
                  </p>
                  {service && service !== "not-sure" && (
                    <div style={{ backgroundColor: "var(--ink)", padding: "1.5rem", marginTop: "1rem" }}>
                      <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: "0.5rem" }}>
                        {serviceLabels[service]}
                      </p>
                      <p style={{ fontSize: "0.85rem", fontWeight: 300, color: "rgba(248,244,227,0.75)", lineHeight: 1.65 }}>
                        {serviceDescriptions[service]}
                      </p>
                    </div>
                  )}
                  {submitMutation.isError && (
                    <div style={{ backgroundColor: "#fee2e2", border: "1px solid #fca5a5", padding: "1rem", marginTop: "1.5rem" }}>
                      <p style={{ fontSize: "0.85rem", color: "#dc2626" }}>
                        Something went wrong. Please try again or call (323) 433-1350.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: form */}
                <form onSubmit={handleSubmit}>
                  {/* Contact info */}
                  <div style={{ marginBottom: "3rem" }}>
                    <h3 style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--warm-gray-lt)" }}>
                      Your Information
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>First &amp; Last Name *</label>
                        <input required type="text" value={formData.name} onChange={e => handleChange("name", e.target.value)} style={inputStyle} placeholder="Your full name"
                          onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--sage)"}
                          onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--warm-gray-lt)"} />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Email Address *</label>
                        <input required type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} style={inputStyle} placeholder="your@email.com"
                          onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--sage)"}
                          onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--warm-gray-lt)"} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Phone Number</label>
                        <input type="tel" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} style={inputStyle} placeholder="(323) 000-0000"
                          onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--sage)"}
                          onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--warm-gray-lt)"} />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Neighborhood / Area</label>
                        <input type="text" value={formData.neighborhood} onChange={e => handleChange("neighborhood", e.target.value)} style={inputStyle} placeholder="e.g. Silver Lake, Brentwood"
                          onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--sage)"}
                          onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--warm-gray-lt)"} />
                      </div>
                    </div>
                  </div>

                  {/* Service interest */}
                  <div style={{ marginBottom: "3rem" }}>
                    <h3 style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--warm-gray-lt)" }}>
                      What You're Looking For
                    </h3>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Which service are you most interested in? *</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        {(Object.keys(serviceLabels) as ServiceType[]).filter(k => k !== "").map(key => (
                          <button key={key} type="button" onClick={() => handleChange("service", key)} style={{
                            padding: "0.85rem 1rem",
                            border: `1.5px solid ${service === key ? "var(--sage)" : "var(--warm-gray-lt)"}`,
                            backgroundColor: service === key ? "var(--sage)" : "white",
                            color: service === key ? "var(--parchment)" : "var(--ink)",
                            fontSize: "0.82rem",
                            fontWeight: service === key ? 600 : 400,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.18s ease",
                          }}>
                            {serviceLabels[key]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={fieldStyle}>
                      <label style={labelStyle}>How soon are you looking to get started?</label>
                      <select value={formData.urgency} onChange={e => handleChange("urgency", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}
                        onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "var(--sage)"}
                        onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "var(--warm-gray-lt)"}>
                        <option value="">Select one</option>
                        <option value="asap">As soon as possible</option>
                        <option value="2weeks">Within the next 2 weeks</option>
                        <option value="month">Within the next month</option>
                        <option value="exploring">Just exploring for now</option>
                      </select>
                    </div>

                    <div style={fieldStyle}>
                      <label style={labelStyle}>Tell me about your situation</label>
                      <textarea value={formData.situation} onChange={e => handleChange("situation", e.target.value)}
                        style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
                        placeholder={
                          service === "reset" ? "What space are you working with? What's been happening there?" :
                          service === "house-calls" ? "What does your household need attention on?" :
                          service === "resale" || service === "fast-bag" ? "What kinds of items do you have? Rough quantity?" :
                          service === "legacy" ? "Whose household is this? What's the context?" :
                          "What's going on? What do you need help with?"
                        }
                        onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "var(--sage)"}
                        onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "var(--warm-gray-lt)"} />
                    </div>

                    {/* File Upload */}
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Photos or documents (optional)</label>
                      <p style={{ fontSize: "0.78rem", color: "var(--sage-dark)", marginBottom: "0.75rem", lineHeight: 1.6 }}>
                        If it helps to show me the space, the pile, or the items — upload up to 5 photos or PDFs. Max 16MB each.
                      </p>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: "1.5px dashed var(--warm-gray-lt)",
                          padding: "1.5rem",
                          textAlign: "center",
                          cursor: "pointer",
                          backgroundColor: "white",
                          transition: "border-color 0.18s ease",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--sage)"}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--warm-gray-lt)"}
                      >
                        <p style={{ fontSize: "0.85rem", color: "var(--sage-dark)", fontWeight: 400 }}>
                          Click to select files
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "var(--warm-gray)", marginTop: "0.25rem" }}>
                          JPG, PNG, WEBP, HEIC, PDF
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </div>
                      {selectedFiles.length > 0 && (
                        <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {selectedFiles.map((f, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "white", border: "1px solid var(--warm-gray-lt)", padding: "0.6rem 0.85rem" }}>
                              <span style={{ fontSize: "0.82rem", color: "var(--ink)" }}>{f.name}</span>
                              <button type="button" onClick={() => removeFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sage-dark)", fontSize: "0.75rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {uploadError && (
                        <p style={{ fontSize: "0.78rem", color: "#dc2626", marginTop: "0.5rem" }}>{uploadError}</p>
                      )}
                    </div>
                  </div>

                  {/* Preferences */}
                  <div style={{ marginBottom: "3rem" }}>
                    <h3 style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--warm-gray-lt)" }}>
                      How to Reach You
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Preferred contact method</label>
                        <select value={formData.preferredContact} onChange={e => handleChange("preferredContact", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}
                          onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "var(--sage)"}
                          onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "var(--warm-gray-lt)"}>
                          <option value="">Select one</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone call</option>
                          <option value="text">Text message</option>
                          <option value="any">Any — whatever's fastest</option>
                        </select>
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Best time to reach you</label>
                        <select value={formData.bestTime} onChange={e => handleChange("bestTime", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}
                          onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "var(--sage)"}
                          onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "var(--warm-gray-lt)"}>
                          <option value="">Select one</option>
                          <option value="morning">Morning (before noon)</option>
                          <option value="afternoon">Afternoon (noon–5pm)</option>
                          <option value="evening">Evening (after 5pm)</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>How did you hear about us?</label>
                      <select value={formData.hearAbout} onChange={e => handleChange("hearAbout", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}
                        onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "var(--sage)"}
                        onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "var(--warm-gray-lt)"}>
                        <option value="">Select one</option>
                        <option value="referral">Word of mouth / referral</option>
                        <option value="instagram">Instagram</option>
                        <option value="google">Google search</option>
                        <option value="nextdoor">Nextdoor</option>
                        <option value="yelp">Yelp</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-sage"
                    style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem", padding: "1.1rem", opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
                  >
                    {isSubmitting
                      ? uploadProgress || "Sending…"
                      : "Send My Inquiry →"}
                  </button>
                  <p style={{ fontSize: "0.75rem", fontWeight: 300, color: "var(--sage-dark)", marginTop: "1rem", textAlign: "center" }}>
                    I'll respond personally within 24–48 hours.
                  </p>
                </form>
              </div>
            </FadeUp>
          </div>
        </section>
      ) : (
        <section style={{ backgroundColor: "var(--parchment)", padding: "8rem 0" }}>
          <div className="container">
            <FadeUp>
              <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
                <div style={{ width: 60, height: 60, backgroundColor: "var(--sage)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", fontSize: "1.5rem", color: "var(--parchment)" }}>
                  ✓
                </div>
                <h2 className="display-md" style={{ color: "var(--ink)", marginBottom: "1.5rem" }}>
                  Got it. I'll be in touch.
                </h2>
                <p style={{ fontSize: "1rem", fontWeight: 300, color: "var(--sage-dark)", lineHeight: 1.75, marginBottom: "2rem" }}>
                  Your inquiry has been saved and sent directly to Dayna. Expect a personal response within 24–48 hours. If you have something urgent, call directly at (323) 433-1350.
                </p>
                {uploadError && (
                  <p style={{ fontSize: "0.85rem", color: "#92400e", backgroundColor: "#fef3c7", padding: "1rem", marginBottom: "1.5rem" }}>
                    {uploadError}
                  </p>
                )}
                <Link href="/" className="btn btn-outline-ink">Back to Home</Link>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
