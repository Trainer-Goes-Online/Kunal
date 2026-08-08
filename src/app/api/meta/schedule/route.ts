import { NextRequest, NextResponse } from "next/server";
import { pricing, siteOrigin } from "@/lib/config";
import { sendLeadEvent } from "@/lib/meta-events";

/**
 * /api/meta/schedule — fired when a lead books the call on /book-a-call.
 *
 * The trigger is Calendly's own `calendly.event_scheduled` message (see
 * CalendarEmbed), NOT a pageview: this only fires when a slot is actually taken.
 * PII comes from the qualifier stash the browser still holds, so the Schedule
 * event matches at the highest EMQ available.
 */
type Lead = { email?: string; phone?: string; firstName?: string; countryCode?: string };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      lead?: Lead;
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
        : `${siteOrigin()}/book-a-call`;

    const fbc = req.cookies.get("_fbc")?.value || undefined;
    const fbp = req.cookies.get("_fbp")?.value || undefined;
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      undefined;
    const clientUserAgent = req.headers.get("user-agent") ?? undefined;

    let capi: "sent" | "error" = "sent";
    try {
      await sendLeadEvent({
        pixelId,
        accessToken,
        eventName: "Schedule",
        idKey: "sched",
        email,
        phone: lead.phone ?? "",
        firstName: lead.firstName ?? "",
        countryCode: lead.countryCode ?? "",
        eventSourceUrl,
        fbc,
        fbp,
        clientIp,
        clientUserAgent,
      });
      console.log("[sched] Schedule sent");
    } catch (err) {
      capi = "error";
      console.error("[sched] error:", err);
    }
    return NextResponse.json({ ok: true, capi });
  } catch (err) {
    console.error("[sched] fatal:", err);
    return NextResponse.json({ ok: true, capi: "error" });
  }
}
