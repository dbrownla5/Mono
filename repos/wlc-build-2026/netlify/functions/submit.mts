// Lead capture — persists every contact-form and bag-pickup submission to the
// Supabase `leads` table (the CRM record of truth) AND emails the owner via
// Resend. Either path failing never loses the lead.
// Env (Netlify): SUPABASE_URL, SUPABASE_ANON_KEY, RESEND_API_KEY
// (optional CONTACT_TO / CONTACT_FROM).

export default async (req: Request): Promise<Response> => {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    });

  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  let b: Record<string, any> = {};
  try {
    b = await req.json();
  } catch {
    /* ignore – validated below */
  }

  if (!b.name || !b.email) {
    return json({ ok: false, error: "Name and email are required." }, 400);
  }

  // Persist the lead to Supabase first (the durable CRM record of truth).
  // Best-effort: a Supabase hiccup must never block the visitor.
  let captured = false;
  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_ANON_KEY;
  if (sbUrl && sbKey) {
    try {
      const sb = await fetch(`${sbUrl}/rest/v1/leads`, {
        method: "POST",
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          "content-type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          type: b.summary || b.type || "inquiry",
          name: b.name,
          email: b.email,
          phone: b.phone || null,
          neighborhood: b.neighborhood || null,
          summary: b.summary || null,
          situation: b.situation || null,
          bags_count: b.bagsCount || null,
          urgency: b.urgency || null,
          pickup_time_1: b.pickupTime1 || null,
          pickup_time_2: b.pickupTime2 || null,
          pickup_method: b.pickupMethod || null,
          source: "website",
          raw: b,
        }),
      });
      if (sb.ok) captured = true;
      else console.error("Supabase lead insert failed:", sb.status, await sb.text());
    } catch (err) {
      console.error("Supabase lead insert error (non-fatal):", err);
    }
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "dayna@thewelllivedcitizen.com";
  const from = process.env.CONTACT_FROM || "The Well Lived Citizen <onboarding@resend.dev>";

  const lines = [
    "New inquiry — The Well Lived Citizen",
    "",
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    b.phone ? `Phone: ${b.phone}` : "",
    b.neighborhood ? `Area: ${b.neighborhood}` : "",
    b.summary ? `Service / summary: ${b.summary}` : "",
    b.situation ? `Details: ${b.situation}` : "",
    b.bagsCount ? `Bags: ${b.bagsCount}` : "",
    b.urgency ? `Urgency: ${b.urgency}` : "",
    b.pickupTime1 ? `Pickup window 1: ${b.pickupTime1}` : "",
    b.pickupTime2 ? `Pickup window 2: ${b.pickupTime2}` : "",
    b.pickupMethod ? `Pickup method: ${b.pickupMethod}` : "",
  ].filter(Boolean);
  const text = lines.join("\n");

  // Success shape covers both the contact form and the bag-pickup gate.
  const ok = (emailed: boolean) =>
    json({ ok: true, emailed, opened: true, blocked: false });

  // No key yet — we can't actually email this lead. Log it (so it's recoverable
  // from Netlify logs) but DO NOT fake success: tell the visitor to reach Dayna
  // directly so the lead is never silently swallowed.
  if (!key) {
    console.log("LEAD (RESEND_API_KEY not set):\n" + text);
    // The lead is already saved in Supabase — never show the visitor an error.
    if (captured) return ok(false);
    return json(
      {
        ok: false,
        error:
          "I couldn't send this automatically right now — please email dayna@thewelllivedcitizen.com or text (323) 433-1350 and I'll get right back to you.",
      },
      503,
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: b.email,
        subject: `[WLC] New inquiry — ${b.name}${b.summary ? ` (${b.summary})` : ""}`,
        text,
      }),
    });
    if (!res.ok) {
      console.error("Resend error:", await res.text());
      if (captured) return ok(false);
      return json(
        {
          ok: false,
          error:
            "Something went wrong sending this — please email dayna@thewelllivedcitizen.com or text (323) 433-1350 so it doesn't get lost.",
        },
        502,
      );
    }
    return ok(true);
  } catch (err) {
    console.error("submit error:", err);
    if (captured) return ok(false);
    return json({ ok: false, error: "Unexpected error." }, 500);
  }
};
