import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { brand, pricing, canonicalCheckoutUrl } from "@/lib/config";
import { sendMetaCapiEvent, sha256 } from "@/lib/meta-capi";

// ───────────────────────────────────────────────────────────────────
// Razorpay webhook — server-to-server tracking authority.
// Fires Pabbly + Meta CAPI (Purchase) on payment.captured for OUR orders
// (notes.kind === "client_funnel"). Independent of whether the user came
// back to /thank-you — this is what covers UPI-app buyers who never return.
//   1. HMAC verify         → 400 on mismatch
//   2. event === captured  → ignore others
//   3. notes.kind gate     → ignore other funnels/apps
//   4. test-mode gate      → skip in ₹1 mode
//   5. Pabbly + CAPI fire
// ───────────────────────────────────────────────────────────────────

const FUNNEL_KIND = "client_funnel";

function safeParseNotes(notes: unknown): Record<string, string> {
  if (!notes || typeof notes !== "object" || Array.isArray(notes)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(notes as Record<string, unknown>)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

function safeParseJson<T = Record<string, string>>(value: string | undefined): T | Record<string, never> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? (parsed as T) : {};
  } catch {
    return {};
  }
}

interface CustNotes { fn?: string; ln?: string; em?: string; ph?: string; ct?: string; co?: string; dl?: string; tp?: string; }
interface UtmNotes { s?: string; m?: string; c?: string; n?: string; t?: string; }
interface RazorpayPaymentEntity {
  id: string;
  order_id: string;
  amount: number | string;
  currency: string;
  created_at: number;
  notes?: unknown;
}

export async function POST(req: NextRequest) {
  // ─── 1. Signature verification ─────────────────────────────────
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] RAZORPAY_WEBHOOK_SECRET not configured");
    return NextResponse.json({ ok: false, error: "webhook_secret_missing" }, { status: 500 });
  }

  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const rawBody = await req.text();
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  if (!signature || signature !== expected) {
    console.warn("[webhook] signature mismatch — rejecting");
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 400 });
  }
  console.log("[webhook] signature verified");

  // ─── 2. Parse + event filter ───────────────────────────────────
  let body: { event?: string; payload?: { payment?: { entity?: RazorpayPaymentEntity } } };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const event = body.event ?? "";
  if (event !== "payment.captured") {
    console.log(`[webhook] event=${event} — not payment.captured, ignoring`);
    return NextResponse.json({ ok: true, ignored: true, reason: "event_not_captured", event });
  }

  const payment = body.payload?.payment?.entity;
  if (!payment || !payment.id) {
    console.error("[webhook] payment.captured but no payment entity");
    return NextResponse.json({ ok: false, error: "no_payment_entity" }, { status: 400 });
  }
  const paymentId = payment.id;

  // ─── 3. Kind gate — the funnel sentinel ────────────────────────
  const notes = safeParseNotes(payment.notes);
  const kind = notes.kind ?? "";
  if (kind !== FUNNEL_KIND) {
    console.log(`[webhook] paymentId=${paymentId} kind=${kind || "(empty)"} — not our funnel, ignoring`);
    return NextResponse.json({ ok: true, ignored: true, reason: "kind_mismatch", kind });
  }
  console.log(`[webhook] paymentId=${paymentId} kind matched: client_funnel`);

  // ─── 4. Test-mode gate ─────────────────────────────────────────
  if (!pricing.trackingEnabled) {
    console.log(`[webhook] paymentId=${paymentId} tracking disabled (₹1 test) — skipping`);
    return NextResponse.json({ ok: true, skipped: "test_mode", paymentId });
  }

  // ─── 5. Unpack notes ───────────────────────────────────────────
  const cust = safeParseJson<CustNotes>(notes.cust);
  const utm = safeParseJson<UtmNotes>(notes.utm);

  const firstName = cust.fn ?? "";
  const lastName = cust.ln ?? "";
  const email = cust.em ?? "";
  const phoneDigits = cust.ph ?? "";
  const city = cust.ct ?? "";
  const countryCode = cust.co ?? "";
  const dialCode = cust.dl ?? "";
  const customerType = cust.tp ?? "";
  const fullPhone = `${dialCode}${phoneDigits}`;

  const fbc = notes.fbc || undefined;
  const fbp = notes.fbp || undefined;
  const clientIp = notes.ip || undefined;
  const clientUserAgent = notes.ua || undefined;
  const eventSourceUrl = notes.esu || canonicalCheckoutUrl();
  const fbclid = notes.clid ?? "";

  const rawAmount = typeof payment.amount === "string" ? parseInt(payment.amount, 10) : payment.amount;
  const amountInRupees =
    typeof rawAmount === "number" && Number.isFinite(rawAmount) && rawAmount > 0
      ? Math.round(rawAmount / 100)
      : pricing.inr;
  const currency =
    typeof payment.currency === "string" && payment.currency.length > 0 ? payment.currency : pricing.currency;

  const paymentDate = payment.created_at ? new Date(payment.created_at * 1000) : new Date();
  const externalId = email ? sha256(email.trim().toLowerCase()) : "";

  // ─── 6. Build the Pabbly payload ───────────────────────────────
  const pabblyPayload = {
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`.trim(),
    email,
    phone: fullPhone,
    city,
    country_code: countryCode,
    customer_type: customerType,
    payment_id: paymentId,
    order_id: payment.order_id,
    amount: String(amountInRupees),
    currency,
    payment_date: paymentDate.toLocaleDateString("en-IN", { timeZone: brand.paymentTimezone }),
    payment_time: paymentDate.toLocaleTimeString("en-IN", { timeZone: brand.paymentTimezone }),
    payment_timestamp: paymentDate.toISOString(),
    utm_source: utm.s ?? "",
    utm_medium: utm.m ?? "",
    utm_campaign: utm.c ?? "",
    utm_content: utm.n ?? "",
    utm_term: utm.t ?? "",
    lead_id: paymentId,
    created_at: paymentDate.toISOString(),
    fbc: fbc ?? "",
    fbp: fbp ?? "",
    client_ip_address: clientIp ?? "",
    client_user_agent: clientUserAgent ?? "",
    external_id: externalId,
    event_source_url: eventSourceUrl,
    is_test: "false",
    purchase_event_id: paymentId,
    fbclid,
  };

  // ─── 7. Fire Pabbly ────────────────────────────────────────────
  let pabblyResult: "sent" | "skipped" | "error" = "skipped";
  const pabblyUrl = process.env.PABBLY_WEBHOOK_URL;
  if (pabblyUrl) {
    try {
      const r = await fetch(pabblyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pabblyPayload),
      });
      pabblyResult = r.ok ? "sent" : "error";
      console.log(`[webhook] paymentId=${paymentId} Pabbly ${pabblyResult} (${r.status})`);
    } catch (err) {
      pabblyResult = "error";
      console.error(`[webhook] paymentId=${paymentId} Pabbly error:`, err);
    }
  } else {
    console.warn("[webhook] PABBLY_WEBHOOK_URL not set — Pabbly skipped");
  }

  // ─── 8. Fire Meta CAPI — Purchase + custom "sales" ─────────────
  // Two events per captured payment: the standard "Purchase" (event_id = paymentId)
  // and a custom "sales" event (event_id = `${paymentId}_sales`, distinct so Meta
  // does NOT dedupe it against Purchase). Same user_data on both.
  let capiResult: "sent" | "skipped" | "error" = "skipped";
  let salesResult: "sent" | "skipped" | "error" = "skipped";
  const metaPixelId = process.env.META_PIXEL_ID;
  const metaAccessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (metaPixelId && metaAccessToken && email) {
    const baseEvent = {
      pixelId: metaPixelId,
      accessToken: metaAccessToken,
      paymentId,
      email,
      phone: fullPhone,
      firstName,
      lastName,
      city,
      countryCode,
      eventSourceUrl,
      value: amountInRupees,
      currency,
      fbc,
      fbp,
      clientIp,
      clientUserAgent,
    };
    try {
      await sendMetaCapiEvent({ ...baseEvent, eventName: "Purchase", eventId: paymentId });
      capiResult = "sent";
      console.log(`[webhook] paymentId=${paymentId} Meta CAPI Purchase sent`);
    } catch (err) {
      capiResult = "error";
      console.error(`[webhook] paymentId=${paymentId} Meta CAPI Purchase error:`, err);
    }
    try {
      await sendMetaCapiEvent({ ...baseEvent, eventName: "sales", eventId: `${paymentId}_sales` });
      salesResult = "sent";
      console.log(`[webhook] paymentId=${paymentId} Meta CAPI sales sent`);
    } catch (err) {
      salesResult = "error";
      console.error(`[webhook] paymentId=${paymentId} Meta CAPI sales error:`, err);
    }
  } else if (!metaPixelId || !metaAccessToken) {
    console.warn("[webhook] META_PIXEL_ID / META_CAPI_ACCESS_TOKEN not set — CAPI skipped");
  } else if (!email) {
    console.warn(`[webhook] paymentId=${paymentId} email missing from notes.cust — CAPI skipped`);
  }

  // ─── 9. Self-documenting confirmation ──────────────────────────
  return NextResponse.json({ ok: true, paymentId, kind, pabbly: pabblyResult, capi: capiResult, sales: salesResult });
}
