import crypto from "crypto";
import { brand } from "./config";
import { sha256 } from "./meta-capi";

const GRAPH = "https://graph.facebook.com/v25.0";

const hashNorm = (v: string) => (v ? sha256(v.trim().toLowerCase()) : "");
const hashPhone = (v: string) => {
  const d = (v || "").replace(/\D/g, "");
  return d ? sha256(d) : "";
};
const hashCity = (v: string) => {
  const c = (v || "").toLowerCase().replace(/[^a-z]/g, "");
  return c ? sha256(c) : "";
};

async function postEvent(pixelId: string, accessToken: string, event: Record<string, unknown>) {
  const res = await fetch(`${GRAPH}/${pixelId}/events?access_token=${accessToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [event] }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Meta CAPI ${event.event_name} failed ${res.status}: ${text.slice(0, 300)}`);
  }
}

/**
 * Request-side signals every event carries: click id, browser id, IP, UA, plus
 * the first-party visitor id cookie (`kwk_vid`). All optional — Meta just gets
 * less to match on when one is missing.
 */
export type CapiSignals = {
  fbc?: string;
  fbp?: string;
  clientIp?: string;
  clientUserAgent?: string;
  /** Raw first-party visitor id (kwk_vid cookie). Hashed into external_id. */
  visitorId?: string;
};

/** Optional customer PII. Every field that is present is hashed and sent. */
export type CapiPII = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  countryCode?: string;
};

/**
 * Builds Meta `user_data` with every identifier we have — this is what drives
 * Event Match Quality. external_id carries BOTH the hashed email (stable across
 * funnels and the Pabbly payload) and the hashed visitor id (present from the
 * very first click, so AddToCart and the later lead events share an id).
 */
function buildUserData(pii: CapiPII, s: CapiSignals): Record<string, unknown> {
  const u: Record<string, unknown> = {};
  const email = (pii.email ?? "").trim();
  if (email) u.em = [hashNorm(email)];
  if (pii.phone && hashPhone(pii.phone)) u.ph = [hashPhone(pii.phone)];
  if (pii.firstName) u.fn = [hashNorm(pii.firstName)];
  if (pii.lastName) u.ln = [hashNorm(pii.lastName)];
  if (pii.countryCode) u.country = [hashNorm(pii.countryCode)];
  const ext = [email ? hashNorm(email) : "", s.visitorId ? sha256(s.visitorId) : ""].filter(Boolean);
  if (ext.length) u.external_id = ext;
  if (s.fbc) u.fbc = s.fbc;
  if (s.fbp) u.fbp = s.fbp;
  if (s.clientIp) u.client_ip_address = s.clientIp;
  if (s.clientUserAgent) u.client_user_agent = s.clientUserAgent;
  return u;
}

/**
 * AddToCart — landing-page CTA click.
 *
 * `eventId` comes from the browser, which fires the SAME AddToCart through the
 * Pixel with the same id, so Meta deduplicates the pair into one event and
 * merges their user data (browser: fbp/fbc/IP/UA; server: the same plus the
 * visitor id and any PII a returning applicant already gave us).
 */
export async function sendAddToCartEvent(
  a: {
    pixelId: string;
    accessToken: string;
    eventId?: string;
    eventSourceUrl: string;
    pii?: CapiPII;
  } & CapiSignals
): Promise<void> {
  const eventId =
    a.eventId || (a.fbp ? sha256(`${a.fbp}|atc`) : `${crypto.randomBytes(8).toString("hex")}_atc`);
  await postEvent(a.pixelId, a.accessToken, {
    event_name: "AddToCart",
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: a.eventSourceUrl,
    user_data: buildUserData(a.pii ?? {}, a),
    /* No value / currency: the strategy call is free, so AddToCart is sent as
       a plain event. */
    custom_data: {
      content_ids: [brand.productSlug],
      content_name: brand.productName,
      content_type: "product",
    },
  });
}

/** InitiateCheckout — pay-button click on a filled form. Full hashed PII.
    Dormant: the free funnel has no checkout, kept for the paid variant. */
export async function sendInitiateCheckoutEvent(a: {
  pixelId: string;
  accessToken: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  city: string;
  countryCode: string;
  eventSourceUrl: string;
  value: number;
  currency: string;
  fbc?: string;
  fbp?: string;
  clientIp?: string;
  clientUserAgent?: string;
}): Promise<void> {
  const eventTime = Math.floor(Date.now() / 1000);
  const eventId = sha256(`${a.email.trim().toLowerCase()}|ic`);
  const userData: Record<string, unknown> = {
    em: [hashNorm(a.email)],
    ph: [hashPhone(a.phone)],
    fn: [hashNorm(a.firstName)],
    ln: [hashNorm(a.lastName)],
    ct: [hashCity(a.city)],
    country: [hashNorm(a.countryCode)],
    external_id: [hashNorm(a.email)],
  };
  if (a.fbc) userData.fbc = a.fbc;
  if (a.fbp) userData.fbp = a.fbp;
  if (a.clientIp) userData.client_ip_address = a.clientIp;
  if (a.clientUserAgent) userData.client_user_agent = a.clientUserAgent;

  const common = {
    event_time: eventTime,
    action_source: "website",
    event_source_url: a.eventSourceUrl,
    user_data: userData,
    custom_data: {
      currency: a.currency,
      value: a.value,
      content_ids: [brand.productSlug],
      content_name: brand.productName,
      content_type: "product",
    },
  };

  // Standard InitiateCheckout (authoritative — throws to the route on failure).
  await postEvent(a.pixelId, a.accessToken, { ...common, event_name: "InitiateCheckout", event_id: eventId });
  // Custom mirror "ic_event" — distinct event_id so Meta does NOT dedupe it against InitiateCheckout.
  try {
    await postEvent(a.pixelId, a.accessToken, { ...common, event_name: "ic_event", event_id: `${eventId}_custom` });
  } catch (err) {
    console.error("[ic] custom ic_event failed:", err);
  }
}

/**
 * Lead-side events for the FREE funnel — Lead, QualifiedLead (custom) and
 * Schedule. They carry the applicant's own PII (email, phone, first + last
 * name, country) plus the visitor id for the highest Event Match Quality.
 *
 * `eventId` is supplied by the browser, which fires the same event through the
 * Pixel with that id — Meta deduplicates the pair and merges the user data.
 * Without one (a direct POST), it falls back to sha256(email|idKey), which still
 * dedupes re-sends of the SAME event and never collapses two different ones.
 */
export async function sendLeadEvent(
  a: {
    pixelId: string;
    accessToken: string;
    eventName: string;
    idKey: string;
    eventId?: string;
    email: string;
    phone: string;
    firstName: string;
    lastName?: string;
    countryCode: string;
    eventSourceUrl: string;
  } & CapiSignals
): Promise<void> {
  const eventId = a.eventId || sha256(`${a.email.trim().toLowerCase()}|${a.idKey}`);
  await postEvent(a.pixelId, a.accessToken, {
    event_name: a.eventName,
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: a.eventSourceUrl,
    user_data: buildUserData(
      {
        email: a.email,
        phone: a.phone,
        firstName: a.firstName,
        lastName: a.lastName,
        countryCode: a.countryCode,
      },
      a
    ),
    custom_data: {
      content_name: brand.productName,
      content_ids: [brand.productSlug],
    },
  });
}
