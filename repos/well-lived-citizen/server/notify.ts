/**
 * Owner notification helper for The Well Lived Citizen.
 * Uses the Manus built-in Forge notification API to push
 * a message to the project owner (Dayna) when a new inquiry arrives.
 */

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

interface NotifyOptions {
  title: string;
  content: string;
}

/**
 * Send a notification to the project owner.
 * Silently fails — never throws — so a notification failure
 * does not break the inquiry submission flow.
 */
export async function notifyOwner({ title, content }: NotifyOptions): Promise<boolean> {
  if (!FORGE_API_URL || !FORGE_API_KEY) {
    console.warn("[notify] Forge API not configured — skipping owner notification");
    return false;
  }

  try {
    const res = await fetch(`${FORGE_API_URL}/notification/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FORGE_API_KEY}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      console.warn(`[notify] Notification API returned ${res.status}`);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("[notify] Failed to send owner notification:", err);
    return false;
  }
}
