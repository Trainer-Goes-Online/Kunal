import { NextRequest, NextResponse } from "next/server";
import { pricing, canonicalCheckoutUrl } from "@/lib/config";
import { sendInitiateCheckoutEvent } from "@/lib/meta-events";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as {
      customer?: Record<string, string>;
      eventSourceUrl?: string;
    }));
    const customer = body.customer ?? {};
    const email = (customer.email ?? "").trim();
    if (!email) {
      return NextResponse.json({ ok: false, error: "email_required" }, { status: 400 });
    }

    if (!pricing.trackingEnabled) {
      return NextResponse.json({ ok: true, skipped: "test_mode" });
    }
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    if (!pixelId || !accessToken) {
      return NextResponse.json({ ok: true, skipped: "env_missing" });
    }

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
      await sendInitiateCheckoutEvent({
        pixelId,
        accessToken,
        email,
        phone: `${customer.dialCode ?? ""}${customer.phone ?? ""}`,
        firstName: customer.firstName ?? "",
        lastName: customer.lastName ?? "",
        city: customer.city ?? "",
        countryCode: customer.countryCode ?? "",
        eventSourceUrl,
        value: pricing.inr,
        currency: pricing.currency,
        fbc,
        fbp,
        clientIp,
        clientUserAgent,
      });
      console.log("[ic] InitiateCheckout sent");
    } catch (err) {
      capi = "error";
      console.error("[ic] error:", err);
    }
    return NextResponse.json({ ok: true, capi });
  } catch (err) {
    console.error("[ic] fatal:", err);
    return NextResponse.json({ ok: true, capi: "error" });
  }
}
