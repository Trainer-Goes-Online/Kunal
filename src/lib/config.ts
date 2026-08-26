/**
 * Central config — brand, pricing, and the tracking test-gate.
 * The assessment fee doubles as the Razorpay charge; set it to 1 to run in
 * TEST MODE (Pabbly + Meta CAPI are skipped).
 */

const feeInr = Number(process.env.NEXT_PUBLIC_ASSESSMENT_FEE ?? "299") || 299;

export const pricing = {
  inr: feeInr,
  paise: Math.round(feeInr * 100),
  currency: "INR" as const,
  /** false when fee <= 1 (₹1 test mode) — webhook + CAPI routes short-circuit. */
  trackingEnabled: feeInr > 1,
};

export const brand = {
  name: "Kraft With Kunal",
  productName: "Assessment with Kunal",
  productSlug: "kraft-assessment",
  paymentTimezone: "Asia/Kolkata",
};

/** Canonical site origin, no trailing slash. */
export function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://kraftwithkunal.com").replace(/\/+$/, "");
}

/** Canonical checkout URL used as CAPI event_source_url (no query string). */
export function canonicalCheckoutUrl(): string {
  return `${siteOrigin()}/checkout`;
}

/**
 * F8 host-gate — keep CAPI events out of the live pixel from anywhere that is
 * not the real site. A denylist (localhost + Vercel preview hosts) rather than
 * an allowlist, so a mis-set NEXT_PUBLIC_SITE_URL can never silence real
 * production traffic. `TRACKING_HOST_DENY` can extend it (comma-separated).
 */
export function capiHostAllowed(host: string | null | undefined): boolean {
  if (!host) return false; // no Host header → not a real browser request
  const h = host.split(":")[0].trim().toLowerCase();
  if (h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" || h.endsWith(".local")) return false;
  if (h.endsWith(".vercel.app")) return false; // preview + branch deploys
  const extra = (process.env.TRACKING_HOST_DENY ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (extra.includes(h)) return false;
  return true;
}
