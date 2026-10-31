/**
 * Client-side tracking helpers — once-per-browser dedup, first-touch UTM/fbclid
 * capture, and the AddToCart / InitiateCheckout triggers that POST to our own
 * /api/meta/* routes (server does the CAPI hashing + Graph POST).
 */
import { trackGa4EventOnce } from "./ga4";
import { brand } from "./config";
import { QUALIFY_STORAGE_KEY } from "./qualify";

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

/** The qualifier PII carried to the lead-side Meta events (highest EMQ). */
export interface LeadPII {
  firstName: string;
  lastName?: string;
  email: string;
  /** Full number including the dial code. */
  phone: string;
  /** Two-letter country code, e.g. "IN". */
  countryCode: string;
}

/* =====================================================================
   META — the four funnel events, each fired TWICE with one shared event id:
   through the browser Pixel (fbq) and server-side through CAPI (/api/meta/*).
   Meta deduplicates each pair into ONE event and merges the user data from
   both sides, which is what lifts Event Match Quality.

     1  AddToCart      landing-page CTA click
     2  Lead           opt-in form submit (everyone)
     3  QualifiedLead  opt-in form submit, Q3 = one of the three tiers (custom)
     4  Schedule       call booked on /book-a-call (Calendly event_scheduled)

   ⚠️ NEXT_PUBLIC_META_PIXEL_ID (browser) and META_PIXEL_ID (server) must be
   the SAME pixel, or the pairs never dedupe and every event counts twice.
   ===================================================================== */

type Fbq = (...args: unknown[]) => void;

/** Unique id shared by the Pixel and CAPI copies of one event. */
export function newEventId(prefix: string): string {
  const rnd =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
  return `${prefix}_${rnd}`;
}

/**
 * First-party visitor id (`kwk_vid` cookie, 1 year). The server hashes it into
 * external_id on EVERY event, so the anonymous AddToCart and the later Lead /
 * Schedule events share an identifier — a real EMQ gain for AddToCart, which
 * otherwise has no customer data at all.
 */
export function ensureVisitorId(): string {
  if (typeof document === "undefined") return "";
  let vid = getCookie("kwk_vid");
  if (!vid) {
    vid = newEventId("v").slice(2, 34);
    try {
      document.cookie = `kwk_vid=${vid}; Max-Age=31536000; Path=/; SameSite=Lax${
        window.location.protocol === "https:" ? "; Secure" : ""
      }`;
    } catch {
      /* cookies blocked — external_id just falls back to the hashed email */
    }
  }
  return vid;
}

/** Browser Pixel copy of an event. No-op when the Pixel is absent or blocked. */
function pixelTrack(name: string, data: Record<string, unknown>, eventId: string, custom = false): void {
  try {
    const fbq = (window as unknown as { fbq?: Fbq }).fbq;
    if (typeof fbq === "function") fbq(custom ? "trackCustom" : "track", name, data, { eventID: eventId });
  } catch {
    /* never let tracking break the funnel */
  }
}

/** Matches the server's custom_data so the deduped pair agrees. */
function contentData(): Record<string, unknown> {
  return { content_name: brand.productName, content_ids: [brand.productSlug] };
}

/** The qualifier stash, if this session already submitted the form. */
function readStashedLead(): LeadPII | null {
  try {
    const raw = window.sessionStorage.getItem(QUALIFY_STORAGE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Record<string, string>;
    if (!d.email) return null;
    return {
      firstName: d.firstName || "",
      lastName: d.lastName || "",
      email: d.email,
      phone: d.whatsapp || "",
      countryCode: d.countryCode || "",
    };
  } catch {
    return null;
  }
}

/** EVENT 1 — AddToCart on the first landing-page CTA click of this browser. */
export function fireAddToCartOnce(): void {
  if (typeof window === "undefined") return;
  if (!firedOnce("atc_fired")) {
    stampOnce("atc_fired"); // optimistic — survives a tab-kill mid-navigation
    ensureVisitorId();
    const eventId = newEventId("atc");
    // No value / currency — the call is free, so the event is sent plain.
    pixelTrack("AddToCart", { ...contentData(), content_type: "product" }, eventId);
    postBeacon("/api/meta/add-to-cart", {
      eventId,
      lead: readStashedLead() ?? undefined,
      eventSourceUrl: window.location.href,
    });
  }
  trackGa4EventOnce("add_to_cart");
}

/**
 * EVENTS 2 + 3 — Lead (everyone) and QualifiedLead (Q3 = a coaching tier), on
 * opt-in form submit. Best-effort; the GA4 counterparts fire separately.
 */
export function fireLeadEvents(lead: LeadPII, qualified: boolean): void {
  if (typeof window === "undefined") return;
  ensureVisitorId();
  const leadEventId = newEventId("lead");
  const qualifiedEventId = qualified ? newEventId("ql") : undefined;
  pixelTrack("Lead", contentData(), leadEventId);
  if (qualifiedEventId) pixelTrack("QualifiedLead", contentData(), qualifiedEventId, true);
  postBeacon("/api/meta/registration", {
    lead,
    qualified,
    leadEventId,
    qualifiedEventId,
    eventSourceUrl: window.location.href,
  });
}

/** EVENT 4 — Schedule, when Calendly confirms a booked call on /book-a-call. */
export function fireScheduleEvent(lead: LeadPII): void {
  if (typeof window === "undefined") return;
  ensureVisitorId();
  const eventId = newEventId("sched");
  pixelTrack("Schedule", contentData(), eventId);
  postBeacon("/api/meta/schedule", { lead, eventId, eventSourceUrl: window.location.href });
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
