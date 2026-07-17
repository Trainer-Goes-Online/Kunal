import crypto from "crypto";
import { brand } from "./config";

/** SHA-256 hex — used for all Meta user_data hashing + external_id. */
export function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

const hashNorm = (v: string) => (v ? sha256(v.trim().toLowerCase()) : "");
const hashPhone = (v: string) => {
  const digits = (v || "").replace(/\D/g, "");
  return digits ? sha256(digits) : "";
};
const hashCity = (v: string) => {
  const c = (v || "").toLowerCase().replace(/[^a-z]/g, "");
  return c ? sha256(c) : "";
};

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  countryCode: string;
  dialCode?: string;
  customerType?: string;
}

export interface UtmData {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
}

const GRAPH = "https://graph.facebook.com/v25.0";

/**
 * Fires ONE Meta CAPI **Purchase** event. Standard (non-restricted) variant with
 * full hashed PII. event_id = paymentId (Meta dedupes on it for 48h).
 * If your pixel is flagged Health & Wellness, switch to the custom-name +
 * PII-scrubbed variant (see META_ATC_IC_SOP §5).
 */
export async function sendMetaCapiEvent(args: {
  pixelId: string;
  accessToken: string;
  paymentId: string;
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
  /** Event name (default "Purchase"). Pass a custom name (e.g. "sales") for a second event. */
  eventName?: string;
  /** event_id override. Defaults to paymentId; pass a distinct id for a second event
      on the same payment so Meta does NOT dedupe it against the Purchase. */
  eventId?: string;
}): Promise<void> {
  const eventName = args.eventName ?? "Purchase";
  const eventId = args.eventId ?? args.paymentId;
  const userData: Record<string, unknown> = {
    em: [hashNorm(args.email)],
    ph: [hashPhone(args.phone)],
    fn: [hashNorm(args.firstName)],
    ln: [hashNorm(args.lastName)],
    ct: [hashCity(args.city)],
    country: [hashNorm(args.countryCode)],
    external_id: [hashNorm(args.email)],
  };
  if (args.fbc) userData.fbc = args.fbc;
  if (args.fbp) userData.fbp = args.fbp;
  if (args.clientIp) userData.client_ip_address = args.clientIp;
  if (args.clientUserAgent) userData.client_user_agent = args.clientUserAgent;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: args.eventSourceUrl,
        user_data: userData,
        custom_data: {
          currency: args.currency,
          value: args.value,
          content_ids: [brand.productSlug],
          content_name: brand.productName,
          content_type: "product",
        },
      },
    ],
  };

  const res = await fetch(`${GRAPH}/${args.pixelId}/events?access_token=${args.accessToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Meta CAPI ${eventName} failed ${res.status}: ${text.slice(0, 300)}`);
  }
}
