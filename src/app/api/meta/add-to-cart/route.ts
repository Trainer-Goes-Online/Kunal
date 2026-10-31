import { NextRequest, NextResponse } from "next/server";
import { pricing, canonicalCheckoutUrl, capiHostAllowed } from "@/lib/config";
import { sendAddToCartEvent } from "@/lib/meta-events";
import { readCapiSignals, cleanEventId, cleanPII } from "@/lib/meta-request";

/**
 * /api/meta/add-to-cart — EVENT 1 of 4: landing-page CTA click.
 *
 * The browser fires the same AddToCart through the Pixel with the same
 * `eventId`, so Meta deduplicates the pair into ONE event. This server copy adds
 * the visitor id and, for a returning applicant, any PII still in their session.
 */
export async function POST(req: NextRequest) {
  try {
    if (!pricing.trackingEnabled) {
      return NextResponse.json({ ok: true, skipped: "test_mode" });
    }
    if (!capiHostAllowed(req.headers.get("host"))) {
      return NextResponse.json({ ok: true, skipped: "non_prod_host" });
    }
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    if (!pixelId || !accessToken) {
      return NextResponse.json({ ok: true, skipped: "env_missing" });
    }

    const body = (await req.json().catch(() => ({}))) as {
      eventSourceUrl?: string;
      eventId?: string;
      lead?: unknown;
    };
    const eventSourceUrl =
      typeof body.eventSourceUrl === "string" && body.eventSourceUrl
        ? body.eventSourceUrl
        : canonicalCheckoutUrl();

    let capi: "sent" | "error" = "sent";
    try {
      await sendAddToCartEvent({
        pixelId,
        accessToken,
        eventId: cleanEventId(body.eventId),
        eventSourceUrl,
        pii: cleanPII(body.lead),
        ...readCapiSignals(req),
      });
      console.log("[atc] AddToCart sent");
    } catch (err) {
      capi = "error";
      console.error("[atc] error:", err);
    }
    return NextResponse.json({ ok: true, capi });
  } catch (err) {
    console.error("[atc] fatal:", err);
    return NextResponse.json({ ok: true, capi: "error" });
  }
}
