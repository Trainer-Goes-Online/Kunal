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

/** AddToCart — landing CTA click. No PII available at click time. */
export async function sendAddToCartEvent(a: {
  pixelId: string;
  accessToken: string;
  eventSourceUrl: string;
  value: number;
  currency: string;
  fbc?: string;
  fbp?: string;
  clientIp?: string;
  clientUserAgent?: string;
}): Promise<void> {
  const eventId = a.fbp ? sha256(`${a.fbp}|atc`) : `${crypto.randomBytes(8).toString("hex")}_atc`;
  const userData: Record<string, unknown> = {};
  if (a.fbc) userData.fbc = a.fbc;
  if (a.fbp) userData.fbp = a.fbp;
  if (a.clientIp) userData.client_ip_address = a.clientIp;
  if (a.clientUserAgent) userData.client_user_agent = a.clientUserAgent;

  await postEvent(a.pixelId, a.accessToken, {
    event_name: "AddToCart",
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
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
  });
}

/** InitiateCheckout — pay-button click on a filled form. Full hashed PII. */
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

  await postEvent(a.pixelId, a.accessToken, {
    event_name: "InitiateCheckout",
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
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
  });
}
