import { NextRequest, NextResponse } from "next/server";
import { pricing, siteOrigin, capiHostAllowed } from "@/lib/config";
import { sendLeadEvent } from "@/lib/meta-events";
import { readCapiSignals, cleanEventId, cleanPII } from "@/lib/meta-request";

/**
 * /api/meta/schedule — EVENT 4 of 4: a call was successfully booked on
 * /book-a-call.
 *
 * The trigger is Calendly's own `calendly.event_scheduled` message (see
 * CalendarEmbed), NOT a pageview: this only fires when a slot is actually taken.
 * The browser fires the same Schedule through the Pixel with the same
 * `eventId`, so Meta deduplicates the pair. PII comes from the qualifier stash
 * the browser still holds, for the highest EMQ.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      lead?: unknown;
      eventSourceUrl?: string;
      eventId?: string;
    };
    const lead = cleanPII(body.lead);
    if (!lead.email) {
      return NextResponse.json({ ok: false, error: "email_required" }, { status: 400 });
    }

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

    const eventSourceUrl =
      typeof body.eventSourceUrl === "string" && body.eventSourceUrl
        ? body.eventSourceUrl
        : `${siteOrigin()}/book-a-call`;

    let capi: "sent" | "error" = "sent";
    try {
      await sendLeadEvent({
        pixelId,
        accessToken,
        eventName: "Schedule",
        idKey: "sched",
        eventId: cleanEventId(body.eventId),
        email: lead.email,
        phone: lead.phone ?? "",
        firstName: lead.firstName ?? "",
        lastName: lead.lastName ?? "",
        countryCode: lead.countryCode ?? "",
        eventSourceUrl,
        ...readCapiSignals(req),
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
