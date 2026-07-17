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
