/**
 * Client-side tracking helpers — once-per-browser dedup, first-touch UTM/fbclid
 * capture, and the AddToCart / InitiateCheckout triggers that POST to our own
 * /api/meta/* routes (server does the CAPI hashing + Graph POST).
 */
import { trackGa4EventOnce } from "./ga4";

const PREFIX = "kwk_";

function ls(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function firedOnce(key: string): boolean {
  const s = ls();
  if (!s) return false;
  try {
    return s.getItem(PREFIX + key) != null;
  } catch {
    return false;
  }
}

export function stampOnce(key: string): void {
  const s = ls();
  if (!s) return;
  try {
    s.setItem(PREFIX + key, "1");
  } catch {
    /* ignore */
  }
}

export function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const esc = name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1");
  const m = document.cookie.match(new RegExp("(?:^|; )" + esc + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : "";
}

/** First-touch capture of utm_* + fbclid from the landing URL into localStorage. */
export function captureLandingParams(): void {
  if (typeof window === "undefined") return;
  const s = ls();
  if (!s) return;
  try {
    if (s.getItem(PREFIX + "landing_captured")) return;
    const q = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const has = keys.some((k) => q.get(k)) || q.get("fbclid");
    if (!has) return;
    s.setItem(
      PREFIX + "utm",
      JSON.stringify({
        source: q.get("utm_source") || "",
        medium: q.get("utm_medium") || "",
        campaign: q.get("utm_campaign") || "",
        content: q.get("utm_content") || "",
        term: q.get("utm_term") || "",
        fbclid: q.get("fbclid") || "",
      })
    );
    s.setItem(PREFIX + "landing_captured", "1");
  } catch {
    /* ignore */
  }
}

export interface UtmValues {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
}

export function restoreUtm(): UtmValues {
  const empty: UtmValues = { source: "", medium: "", campaign: "", content: "", term: "" };
  const s = ls();
  if (!s) return empty;
  try {
    const raw = s.getItem(PREFIX + "utm");
    if (!raw) return empty;
    const d = JSON.parse(raw);
    return {
      source: d.source || "",
      medium: d.medium || "",
      campaign: d.campaign || "",
      content: d.content || "",
      term: d.term || "",
    };
  } catch {
    return empty;
  }
}

export function restoreFbclid(): string {
  const s = ls();
  if (!s) return "";
  try {
    const raw = s.getItem(PREFIX + "utm");
    return raw ? JSON.parse(raw).fbclid || "" : "";
  } catch {
    return "";
  }
}

/**
 * sendBeacon (fallback: keepalive fetch) to a same-origin path. Best-effort by
 * design — the caller navigates immediately after, so nothing here is awaited or
 * retried, and _fbc/_fbp ride along because the path is same-origin.
 */
function postBeacon(path: string, payload: unknown): void {
  if (typeof window === "undefined") return;
  const body = JSON.stringify(payload);
  let sent = false;
  try {
    const blob = new Blob([body], { type: "application/json" });
    sent = Boolean(navigator.sendBeacon && navigator.sendBeacon(path, blob));
  } catch {
    sent = false;
  }
  if (!sent) {
    fetch(path, {
      method: "POST",
      body,
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  }
}

/** The qualifier PII carried to the lead-side CAPI events (highest EMQ). */
export interface LeadPII {
  firstName: string;
  email: string;
  /** Full number including the dial code. */
  phone: string;
  /** Two-letter country code, e.g. "IN". */
  countryCode: string;
}

/** AddToCart — first CTA click of the browser's lifetime. Meta CAPI + GA4. */
export function fireAddToCartOnce(): void {
  if (typeof window === "undefined") return;
  if (!firedOnce("atc_fired")) {
    stampOnce("atc_fired"); // optimistic — survives a tab-kill mid-navigation
    postBeacon("/api/meta/add-to-cart", { eventSourceUrl: window.location.href });
  }
  trackGa4EventOnce("add_to_cart");
}

/**
 * CompleteRegistration (+ QualifiedLead when `qualified`) via Meta CAPI —
 * fired on qualifier submit. Best-effort; the GA4 counterparts fire separately.
 */
export function fireRegistrationEvents(lead: LeadPII, qualified: boolean): void {
  if (typeof window === "undefined") return;
  postBeacon("/api/meta/registration", { lead, qualified, eventSourceUrl: window.location.href });
}

/** Schedule via Meta CAPI — a call was booked on /book-a-call. Best-effort. */
export function fireScheduleEvent(lead: LeadPII): void {
  if (typeof window === "undefined") return;
  postBeacon("/api/meta/schedule", { lead, eventSourceUrl: window.location.href });
}

/** InitiateCheckout (Meta CAPI) — once per browser, after form validation passes. */
export async function fireInitiateCheckoutOnce(customer: Record<string, string>): Promise<void> {
  if (typeof window === "undefined") return;
  if (firedOnce("ic_fired")) return;
  try {
    const res = await fetch("/api/meta/initiate-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer, eventSourceUrl: window.location.href }),
    });
    if (res.ok) stampOnce("ic_fired");
  } catch {
    /* never block payment */
  }
}
