import { NextRequest, NextResponse } from "next/server";
import { pricing, canonicalCheckoutUrl } from "@/lib/config";
import { sendAddToCartEvent } from "@/lib/meta-events";

export async function POST(req: NextRequest) {
  try {
    if (!pricing.trackingEnabled) {
      return NextResponse.json({ ok: true, skipped: "test_mode" });
    }
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    if (!pixelId || !accessToken) {
      return NextResponse.json({ ok: true, skipped: "env_missing" });
    }

    const body = await req.json().catch(() => ({} as { eventSourceUrl?: string }));
    const eventSourceUrl =
      typeof body.eventSourceUrl === "string" && body.eventSourceUrl
        ? body.eventSourceUrl
        : canonicalCheckoutUrl();

    const fbc = req.cookies.get("_fbc")?.value || undefined;
    const fbp = req.cookies.get("_fbp")?.value || undefined;
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      undefined;
    const clientUserAgent = req.headers.get("user-agent") ?? undefined;

    let capi: "sent" | "error" = "sent";
    try {
      await sendAddToCartEvent({
        pixelId,
        accessToken,
        eventSourceUrl,
        value: pricing.inr,
        currency: pricing.currency,
        fbc,
        fbp,
        clientIp,
        clientUserAgent,
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
