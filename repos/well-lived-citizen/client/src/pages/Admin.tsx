/*
 * ADMIN DASHBOARD — The Well Lived Citizen
 * Owner-only view of all submitted inquiries.
 * Login with ADMIN_SECRET env variable (default: wlc-admin-2026).
 */

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const serviceLabels: Record<string, string> = {
  "reset": "The Reset",
  "house-calls": "House Calls",
  "resale": "Resale & Consignment",
  "fast-bag": "Fast Bag Fill",
  "legacy": "Legacy Inventory",
  "not-sure": "Not Sure Yet",
};

const statusColors: Record<string, string> = {
  new: "#A2A392",
  contacted: "#788585",
  booked: "#505141",
  closed: "#6F6866",
  archived: "#D4CDC3",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  closed: "Closed",
  archived: "Archived",
};

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.adminLogin.useMutation({
    onSuccess: () => onLogin(),
    onError: () => setError("Incorrect password. Try again."),
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#38302E", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ backgroundColor: "white", padding: "3rem", width: "100%", maxWidth: 400 }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "0.5rem", color: "#38302E" }}>
          WELL LIVED CITIZEN
        </div>
        <p style={{ fontSize: "0.75rem", color: "#9A998C", marginBottom: "2rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Admin Access
        </p>
        <form onSubmit={e => { e.preventDefault(); loginMutation.mutate({ secret }); }}>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="Enter admin password"
            style={{ width: "100%", padding: "0.9rem 1rem", border: "1.5px solid #D4CDC3", fontSize: "0.9rem", fontFamily: "'Plus Jakarta Sans', sans-serif", outline: "none", marginBottom: "1rem", boxSizing: "border-box" }}
            autoFocus
          />
          {error && <p style={{ fontSize: "0.8rem", color: "#dc2626", marginBottom: "1rem" }}>{error}</p>}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            style={{ width: "100%", padding: "0.9rem", backgroundColor: "#38302E", color: "#F8F4E3", border: "none", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {loginMutation.isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AgreementPanel({ inquiryId }: { inquiryId: number }) {
  const utils = trpc.useUtils();
  const { data: agreement, isLoading } = trpc.agreement.getByInquiryId.useQuery({ inquiryId });
  const sendMutation = trpc.agreement.send.useMutation({
    onSuccess: (result) => {
      utils.agreement.getByInquiryId.invalidate({ inquiryId });
      toast.success("Agreement link generated.");
      // Copy link to clipboard
      navigator.clipboard.writeText(result.signingUrl).catch(() => {});
    },
    onError: (err) => toast.error(err.message || "Failed to generate agreement."),
  });

  const handleSend = () => {
    sendMutation.mutate({ inquiryId, origin: window.location.origin });
  };

  const agreementStatusColors: Record<string, string> = {
    pending: "#788585",
    signed: "#505141",
    expired: "#9A998C",
    cancelled: "#D4CDC3",
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9A998C", marginBottom: "0.75rem" }}>
        Consignment Agreement
      </h3>
      {isLoading ? (
        <p style={{ fontSize: "0.85rem", color: "#9A998C" }}>Loading…</p>
      ) : agreement ? (
        <div style={{ backgroundColor: "white", border: "1px solid #D4CDC3", padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{
                fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: agreementStatusColors[agreement.status] || "#9A998C",
                backgroundColor: "#F8F4E3", padding: "0.2rem 0.6rem",
              }}>
                {agreement.status.toUpperCase()}
              </span>
              {agreement.status === "signed" && agreement.signedAt && (
                <span style={{ fontSize: "0.78rem", color: "#9A998C" }}>
                  Signed {new Date(agreement.signedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {agreement.pdfStorageUrl && (
                <a
                  href={agreement.pdfStorageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "0.45rem 0.9rem", backgroundColor: "#505141", color: "#F8F4E3",
                    border: "none", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em",
                    textTransform: "uppercase", textDecoration: "none", fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Download PDF
                </a>
              )}
              {agreement.status !== "signed" && (
                <button
                  onClick={handleSend}
                  disabled={sendMutation.isPending}
                  style={{
                    padding: "0.45rem 0.9rem", backgroundColor: "#38302E", color: "#F8F4E3",
                    border: "none", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em",
                    textTransform: "uppercase", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {sendMutation.isPending ? "Generating…" : "Resend Link"}
                </button>
              )}
            </div>
          </div>
          {sendMutation.data?.signingUrl && (
            <div style={{ backgroundColor: "#F8F4E3", padding: "0.75rem 1rem", marginTop: "0.5rem" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A998C", marginBottom: "0.4rem" }}>Signing Link (copied to clipboard)</p>
              <p style={{ fontSize: "0.8rem", color: "#38302E", wordBreak: "break-all", fontFamily: "monospace" }}>
                {sendMutation.data.signingUrl}
              </p>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", borderTop: "1px solid #F8F4E3", marginTop: "0.75rem" }}>
            <div style={{ padding: "0.6rem 1rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9A998C", backgroundColor: "#F8F4E3" }}>Sent</div>
            <div style={{ padding: "0.6rem 1rem", fontSize: "0.82rem", color: "#38302E" }}>{new Date(agreement.sentAt).toLocaleString()}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr" }}>
            <div style={{ padding: "0.6rem 1rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9A998C", backgroundColor: "#F8F4E3" }}>Expires</div>
            <div style={{ padding: "0.6rem 1rem", fontSize: "0.82rem", color: "#38302E" }}>{new Date(agreement.expiresAt).toLocaleDateString()}</div>
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: "white", border: "1px solid #D4CDC3", padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontSize: "0.875rem", color: "#9A998C", margin: 0 }}>No agreement sent yet.</p>
          <button
            onClick={handleSend}
            disabled={sendMutation.isPending}
            style={{
              padding: "0.55rem 1.1rem", backgroundColor: "#38302E", color: "#F8F4E3",
              border: "none", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {sendMutation.isPending ? "Generating…" : "Generate & Copy Link"}
          </button>
          {sendMutation.data?.signingUrl && (
            <div style={{ width: "100%", backgroundColor: "#F8F4E3", padding: "0.75rem 1rem", marginTop: "0.25rem" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A998C", marginBottom: "0.4rem" }}>Signing Link (copied to clipboard)</p>
              <p style={{ fontSize: "0.8rem", color: "#38302E", wordBreak: "break-all", fontFamily: "monospace" }}>
                {sendMutation.data.signingUrl}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InquiryDetail({ id, onBack }: { id: number; onBack: () => void }) {
  const { data, isLoading } = trpc.inquiry.getById.useQuery({ id });
  const updateStatus = trpc.inquiry.updateStatus.useMutation({
    onSuccess: () => utils.inquiry.getById.invalidate({ id }),
  });
  const utils = trpc.useUtils();

  if (isLoading) return (
    <div style={{ padding: "3rem", color: "#9A998C", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.85rem" }}>
      Loading…
    </div>
  );
  if (!data) return (
    <div style={{ padding: "3rem", color: "#dc2626", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.85rem" }}>
      Inquiry not found.
    </div>
  );

  const fields = [
    { label: "Name", value: data.name },
    { label: "Email", value: data.email },
    { label: "Phone", value: data.phone },
    { label: "Neighborhood", value: data.neighborhood },
    { label: "Service", value: serviceLabels[data.service] || data.service },
    { label: "Urgency", value: data.urgency },
    { label: "Preferred Contact", value: data.preferredContact },
    { label: "Best Time", value: data.bestTime },
    { label: "How They Heard", value: data.hearAbout },
    { label: "Submitted", value: new Date(data.createdAt).toLocaleString() },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "#9A998C", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2rem", padding: 0 }}>
        ← Back to All Inquiries
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#38302E", margin: 0 }}>
            {data.name}
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#9A998C", marginTop: "0.25rem" }}>
            {serviceLabels[data.service] || data.service}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A998C" }}>Status:</span>
          <select
            value={data.status}
            onChange={e => updateStatus.mutate({ id: data.id, status: e.target.value as "new" | "contacted" | "booked" | "closed" | "archived" })}
            style={{ padding: "0.5rem 0.75rem", border: `2px solid ${statusColors[data.status] || "#D4CDC3"}`, backgroundColor: "white", fontSize: "0.8rem", fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer", fontWeight: 600 }}
          >
            {Object.entries(statusLabels).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Fields */}
      <div style={{ backgroundColor: "white", border: "1px solid #D4CDC3", marginBottom: "2rem" }}>
        {fields.filter(f => f.value).map((f, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", borderBottom: i < fields.length - 1 ? "1px solid #F8F4E3" : "none" }}>
            <div style={{ padding: "0.85rem 1rem", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A998C", backgroundColor: "#F8F4E3" }}>
              {f.label}
            </div>
            <div style={{ padding: "0.85rem 1rem", fontSize: "0.88rem", color: "#38302E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {f.value}
            </div>
          </div>
        ))}
      </div>

      {/* Situation */}
      {data.situation && (
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9A998C", marginBottom: "0.75rem" }}>
            Their Situation
          </h3>
          <div style={{ backgroundColor: "white", border: "1px solid #D4CDC3", padding: "1.25rem", fontSize: "0.9rem", color: "#38302E", lineHeight: 1.7 }}>
            {data.situation}
          </div>
        </div>
      )}

      {/* Consignment Agreement */}
      {(data.service === "resale" || data.service === "fast-bag") && (
        <AgreementPanel inquiryId={data.id} />
      )}

      {/* Attachments */}
      {data.attachments && data.attachments.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9A998C", marginBottom: "0.75rem" }}>
            Attachments ({data.attachments.length})
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem" }}>
            {data.attachments.map((att) => (
              <a
                key={att.id}
                href={att.storageUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", backgroundColor: "white", border: "1px solid #D4CDC3", padding: "1rem", textDecoration: "none" }}
              >
                {att.mimeType.startsWith("image/") ? (
                  <img src={att.storageUrl} alt={att.originalName} style={{ width: "100%", height: 120, objectFit: "cover", marginBottom: "0.5rem" }} />
                ) : (
                  <div style={{ width: "100%", height: 120, backgroundColor: "#F8F4E3", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem", fontSize: "2rem" }}>
                    📄
                  </div>
                )}
                <p style={{ fontSize: "0.75rem", color: "#38302E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {att.originalName}
                </p>
                <p style={{ fontSize: "0.65rem", color: "#9A998C", marginTop: "0.2rem" }}>
                  {(att.sizeBytes / 1024).toFixed(0)} KB
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
  });

  // Sync login state when me query resolves — must be in useEffect to avoid setState during render
  useEffect(() => {
    if (!isLoggedIn && meQuery.data?.role === "admin") {
      setIsLoggedIn(true);
    }
  }, [meQuery.data, isLoggedIn]);

  const { data: inquiries, isLoading } = trpc.inquiry.list.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { setIsLoggedIn(false); setSelectedId(null); },
  });

  // Check if already logged in via cookie
  if (meQuery.isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#38302E", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#F8F4E3", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.85rem" }}>Loading…</div>
      </div>
    );
  }

  if (!isLoggedIn && meQuery.data?.role !== "admin") {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  if (selectedId !== null) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F8F4E3", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ backgroundColor: "#38302E", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#F8F4E3", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>WLC Admin</span>
          <button onClick={() => logoutMutation.mutate()} style={{ background: "none", border: "none", color: "rgba(248,244,227,0.5)", fontSize: "0.72rem", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Sign Out
          </button>
        </div>
        <InquiryDetail id={selectedId} onBack={() => setSelectedId(null)} />
      </div>
    );
  }

  const filtered = (inquiries || []).filter(i =>
    statusFilter === "all" ? true : i.status === statusFilter
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8F4E3", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#38302E", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ color: "#F8F4E3", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>WLC Admin</span>
          <span style={{ color: "rgba(248,244,227,0.4)", fontSize: "0.72rem", marginLeft: "1rem" }}>Inquiry Dashboard</span>
        </div>
        <button onClick={() => logoutMutation.mutate()} style={{ background: "none", border: "none", color: "rgba(248,244,227,0.5)", fontSize: "0.72rem", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Sign Out
        </button>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
        {/* Summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {Object.entries(statusLabels).map(([status, label]) => {
            const count = (inquiries || []).filter(i => i.status === status).length;
            return (
              <div key={status} style={{ backgroundColor: "white", border: "1px solid #D4CDC3", padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: statusColors[status] || "#38302E" }}>{count}</div>
                <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A998C", marginTop: "0.25rem" }}>{label}</div>
              </div>
            );
          })}
          <div style={{ backgroundColor: "#38302E", border: "1px solid #38302E", padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#F8F4E3" }}>{(inquiries || []).length}</div>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(248,244,227,0.5)", marginTop: "0.25rem" }}>Total</div>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[["all", "All"], ...Object.entries(statusLabels)].map(([val, label]) => (
            <button key={val} onClick={() => setStatusFilter(val)} style={{
              padding: "0.4rem 0.9rem",
              border: `1.5px solid ${statusFilter === val ? "#38302E" : "#D4CDC3"}`,
              backgroundColor: statusFilter === val ? "#38302E" : "white",
              color: statusFilter === val ? "#F8F4E3" : "#38302E",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Inquiry list */}
        {isLoading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#9A998C", fontSize: "0.85rem" }}>Loading inquiries…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#9A998C", fontSize: "0.85rem" }}>
            {statusFilter === "all" ? "No inquiries yet." : `No ${statusLabels[statusFilter]?.toLowerCase()} inquiries.`}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {filtered.slice().reverse().map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => setSelectedId(inquiry.id)}
                style={{ backgroundColor: "white", border: "1px solid #D4CDC3", padding: "1.25rem 1.5rem", cursor: "pointer", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "1rem", transition: "border-color 0.15s ease" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#A2A392"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#D4CDC3"}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
                    <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#38302E" }}>{inquiry.name}</span>
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: statusColors[inquiry.status] || "#9A998C", backgroundColor: "#F8F4E3", padding: "0.15rem 0.5rem" }}>
                      {statusLabels[inquiry.status] || inquiry.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.78rem", color: "#9A998C" }}>{inquiry.email}</span>
                    <span style={{ fontSize: "0.78rem", color: "#A2A392", fontWeight: 500 }}>{serviceLabels[inquiry.service] || inquiry.service}</span>
                    {inquiry.neighborhood && <span style={{ fontSize: "0.78rem", color: "#9A998C" }}>{inquiry.neighborhood}</span>}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.72rem", color: "#9A998C" }}>
                    {new Date(inquiry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#D4CDC3", marginTop: "0.2rem" }}>
                    {new Date(inquiry.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
