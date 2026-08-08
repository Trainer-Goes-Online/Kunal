import { NextRequest, NextResponse } from "next/server";
import { pricing, siteOrigin } from "@/lib/config";
import { sendLeadEvent } from "@/lib/meta-events";

/**
 * /api/meta/registration — fired once the qualifier form is submitted.
 *
 * CompleteRegistration fires for EVERY completed form, qualified or not.
 * QualifiedLead (a custom event) fires only when the client sends
 * `qualified: true` — i.e. the investment answer was one of the top three
 * options. The browser POSTs both in one request (sendBeacon during the
 * hand-off navigation), so the server fires them together off the same PII.
 *
 * Highest-EMQ: the qualifier's email/phone/first-name/country are hashed here,
 * plus raw _fbc/_fbp/IP/UA the same-origin request carries.
 */
type Lead = { email?: string; phone?: string; firstName?: string; countryCode?: string };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      lead?: Lead;
      qualified?: boolean;
      eventSourceUrl?: string;
    };
    const lead = body.lead ?? {};
    const email = (lead.email ?? "").trim();
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
        : siteOrigin();

    const fbc = req.cookies.get("_fbc")?.value || undefined;
    const fbp = req.cookies.get("_fbp")?.value || undefined;
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      undefined;
    const clientUserAgent = req.headers.get("user-agent") ?? undefined;

    const base = {
      pixelId,
      accessToken,
      email,
      phone: lead.phone ?? "",
      firstName: lead.firstName ?? "",
      countryCode: lead.countryCode ?? "",
      eventSourceUrl,
      fbc,
      fbp,
      clientIp,
      clientUserAgent,
    };

    const out: Record<string, string> = {};

    // CompleteRegistration — every completed form, qualified or not.
    try {
      await sendLeadEvent({ ...base, eventName: "CompleteRegistration", idKey: "cr" });
      out.cr = "sent";
      console.log("[reg] CompleteRegistration sent");
    } catch (err) {
      out.cr = "error";
      console.error("[reg] CompleteRegistration error:", err);
    }

    // QualifiedLead — custom event, only when the investment answer qualifies.
    if (body.qualified === true) {
      try {
        await sendLeadEvent({ ...base, eventName: "QualifiedLead", idKey: "ql" });
        out.ql = "sent";
        console.log("[reg] QualifiedLead sent");
      } catch (err) {
        out.ql = "error";
        console.error("[reg] QualifiedLead error:", err);
      }
    }

    return NextResponse.json({ ok: true, ...out });
  } catch (err) {
    console.error("[reg] fatal:", err);
    return NextResponse.json({ ok: true, capi: "error" });
  }
}
