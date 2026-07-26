/*
 * SIGN AGREEMENT — The Well Lived Citizen
 * Public page: client visits /sign/:token to review and sign their consignment agreement.
 * No authentication required — token is the access credential.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ── Signature Canvas ──────────────────────────────────────────────────────────

function SignatureCanvas({
  onSign,
  disabled,
}: {
  onSign: (dataUrl: string) => void;
  disabled?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    isDrawing.current = true;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, [disabled]);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing.current || disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#38302E";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    setHasSignature(true);
  }, [disabled]);

  const endDraw = useCallback(() => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSign(canvas.toDataURL("image/png"));
  }, [onSign]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseleave", endDraw);
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", endDraw);
    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDraw);
      canvas.removeEventListener("mouseleave", endDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", endDraw);
    };
  }, [startDraw, draw, endDraw]);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSign("");
  };

  return (
    <div>
      <div
        style={{
          border: "1.5px solid #D4CDC3",
          backgroundColor: "#FAFAF8",
          position: "relative",
          cursor: disabled ? "not-allowed" : "crosshair",
        }}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={160}
          style={{ display: "block", width: "100%", height: 160, touchAction: "none" }}
        />
        {!hasSignature && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "#9A998C", fontStyle: "italic" }}>
              Draw your signature here
            </span>
          </div>
        )}
      </div>
      {hasSignature && !disabled && (
        <button
          onClick={clear}
          style={{
            marginTop: "0.5rem",
            fontSize: "0.75rem",
            color: "#9A998C",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
          }}
        >
          Clear and redraw
        </button>
      )}
    </div>
  );
}

// ── Agreement Text ────────────────────────────────────────────────────────────

const AGREEMENT_SECTIONS = [
  {
    heading: "1. Scope of Service",
        body: "The Well Lived Citizen (\"Consultant\"), operated by Dayna Brown, agrees to provide curated resale and consignment services for items submitted by the Client. The Consultant will evaluate, photograph, research, and list items on appropriate resale platforms at her sole discretion.",
  },
  {
    heading: "2. Commission Structure",
    body: "The Consultant retains 55% of the gross sale price of each item sold. The Client receives 45% of the gross sale price. No upfront fees are charged. Commission is earned only upon a completed sale.",
  },
  {
    heading: "3. Item Evaluation & Acceptance",
    body: "The Consultant reserves the right to decline any item that, in her professional judgment, is unlikely to sell, is damaged beyond reasonable resale condition, or is a counterfeit or unauthorized reproduction. Items declined will be returned to the Client or donated at the Client's direction.",
  },
  {
    heading: "4. Pricing & Platform Selection",
    body: "The Consultant determines listing price and platform selection based on market research, seasonality, and professional judgment. The Client may request a price floor for specific items in writing prior to listing. The Consultant is not obligated to accept price floor requests that would make a listing commercially unviable.",
  },
  {
    heading: "5. Payout Schedule",
    body: "The Consultant will provide a sales report by the 1st of each month covering the prior month's completed sales. Payment of the Client's 45% share will be made by the 5th of each month via the Client's preferred payment method on file.",
  },
  {
    heading: "6. Item Care & Liability",
    body: "The Consultant will handle all items with reasonable care. The Consultant is not liable for normal wear, minor damage incurred during standard handling, or loss due to circumstances beyond her control. The Client warrants that all submitted items are their lawful property and free of any liens or encumbrances.",
  },
  {
    heading: "7. Unsold Items",
    body: "Items that remain unsold after 90 days may be returned to the Client, donated to a charitable organization, or relisted at a reduced price, at the Consultant's discretion and with reasonable notice to the Client.",
  },
  {
    heading: "8. Termination",
    body: "Either party may terminate this agreement with 7 days written notice. Upon termination, unsold items will be returned to the Client within a reasonable timeframe. Items already listed or in transit at the time of termination will be handled to completion.",
  },
  {
    heading: "9. Confidentiality",
    body: "The Consultant will not disclose Client information to third parties except as necessary to complete a sale (e.g., shipping address to a buyer). Client information is never sold or shared for marketing purposes.",
  },
  {
    heading: "10. Governing Law",
    body: "This agreement is governed by the laws of the State of California. Any disputes will be resolved in Los Angeles County.",
  },
];

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SignAgreement() {
  const params = useParams<{ token: string }>();
  const token = params.token ?? "";
  const [, navigate] = useLocation();

  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(false);

  const { data: agreement, isLoading, error } = trpc.agreement.getByToken.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  const signMutation = trpc.agreement.sign.useMutation({
    onSuccess: () => {
      setSigned(true);
      toast.success("Agreement signed. Thank you.");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (!signatureDataUrl) {
      toast.error("Please draw your signature before submitting.");
      return;
    }
    if (!agreed) {
      toast.error("Please check the box to confirm you agree to the terms.");
      return;
    }
    signMutation.mutate({ token, signatureDataUrl, agreedToTerms: true });
  };

  // ── Already signed ────────────────────────────────────────────────────────
  if (agreement?.status === "signed" || signed) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F8F4E3", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#A2A895", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F8F4E3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A2A895", marginBottom: "0.75rem" }}>
            Agreement Signed
          </p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 800, color: "#38302E", marginBottom: "1rem" }}>
            You're all set, {agreement?.clientName ?? "there"}.
          </h1>
          <p style={{ fontSize: "0.95rem", fontWeight: 300, color: "#6F6866", lineHeight: 1.75, marginBottom: "2rem" }}>
            Your signed consignment agreement has been recorded and a copy has been saved. I'll be in touch to confirm your pickup details.
          </p>
          <p style={{ fontSize: "0.8rem", color: "#9A998C" }}>
            — Dayna Brown, The Well Lived Citizen
          </p>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F8F4E3", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#9A998C", fontSize: "0.9rem" }}>Loading agreement…</p>
      </div>
    );
  }

  // ── Error / Not found ─────────────────────────────────────────────────────
  if (error || !agreement) {
    const msg = error?.message ?? "This agreement link is invalid or has expired.";
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F8F4E3", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A2A895", marginBottom: "1rem" }}>
            Link Unavailable
          </p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "#38302E", marginBottom: "1rem" }}>
            {msg}
          </h1>
          <p style={{ fontSize: "0.9rem", fontWeight: 300, color: "#6F6866", lineHeight: 1.75 }}>
            If you believe this is an error, please reach out directly and I'll send a fresh link.
          </p>
        </div>
      </div>
    );
  }

  const expiryDate = new Date(agreement.expiresAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  // ── Main signing view ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8F4E3" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#38302E", padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: "#F8F4E3" }}>
            WELL LIVED CITIZEN
          </div>
          <div style={{ fontSize: "0.65rem", color: "rgba(248,244,227,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.2rem" }}>
            Consignment Agreement
          </div>
        </div>
        <div style={{ fontSize: "0.72rem", color: "rgba(248,244,227,0.5)" }}>
          Expires {expiryDate}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        {/* Intro */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A2A895", marginBottom: "0.75rem" }}>
            For Your Review
          </p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, color: "#38302E", marginBottom: "1rem", lineHeight: 1.2 }}>
            Hi {agreement.clientName} —<br />here's your consignment agreement.
          </h1>
          <p style={{ fontSize: "0.95rem", fontWeight: 300, color: "#6F6866", lineHeight: 1.75 }}>
            Please read through the terms below. When you're ready, draw your signature at the bottom and submit. A copy will be saved for both of us.
          </p>
        </div>

        {/* Agreement text */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #E8E3D8", padding: "2.5rem", marginBottom: "2.5rem" }}>
          <div style={{ borderBottom: "2px solid #38302E", paddingBottom: "1.25rem", marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A2A895", marginBottom: "0.5rem" }}>
              The Well Lived Citizen
            </p>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "#38302E", margin: 0 }}>
              Consignment Agreement
            </h2>
          </div>

          {AGREEMENT_SECTIONS.map((section, i) => (
            <div key={i} style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#38302E", marginBottom: "0.4rem" }}>
                {section.heading}
              </p>
              <p style={{ fontSize: "0.875rem", fontWeight: 300, color: "#6F6866", lineHeight: 1.75, margin: 0 }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Signature block */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #E8E3D8", padding: "2rem", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A2A895", marginBottom: "1rem" }}>
            Your Signature
          </p>
          <SignatureCanvas
            onSign={setSignatureDataUrl}
            disabled={signMutation.isPending}
          />
        </div>

        {/* Consent checkbox */}
        <label
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
            cursor: "pointer",
            marginBottom: "2rem",
            padding: "1.25rem",
            backgroundColor: agreed ? "rgba(162,168,149,0.1)" : "#fff",
            border: `1.5px solid ${agreed ? "#A2A895" : "#D4CDC3"}`,
            transition: "all 0.15s ease",
          }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={signMutation.isPending}
            style={{ marginTop: "0.15rem", accentColor: "#A2A895", width: 16, height: 16, flexShrink: 0 }}
          />
          <span style={{ fontSize: "0.875rem", fontWeight: 300, color: "#38302E", lineHeight: 1.6 }}>
            I, <strong>{agreement.clientName}</strong>, have read and agree to the terms of this Consignment Agreement with The Well Lived Citizen. I understand that my electronic signature is legally binding.
          </span>
        </label>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={signMutation.isPending || !signatureDataUrl || !agreed}
          style={{
            width: "100%",
            padding: "1.1rem",
            backgroundColor: signMutation.isPending || !signatureDataUrl || !agreed ? "#D4CDC3" : "#38302E",
            color: "#F8F4E3",
            border: "none",
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: signMutation.isPending || !signatureDataUrl || !agreed ? "not-allowed" : "pointer",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: "background-color 0.15s ease",
          }}
        >
          {signMutation.isPending ? "Submitting…" : "Sign & Submit Agreement"}
        </button>

        <p style={{ fontSize: "0.75rem", color: "#9A998C", textAlign: "center", marginTop: "1rem", lineHeight: 1.6 }}>
          By submitting, you confirm your electronic signature is valid and binding.
          Your signed agreement will be stored securely.
        </p>
      </div>
    </div>
  );
}
