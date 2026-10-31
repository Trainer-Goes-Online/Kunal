import { NextRequest, NextResponse } from "next/server";
import { pricing, siteOrigin, capiHostAllowed } from "@/lib/config";
import { sendLeadEvent } from "@/lib/meta-events";
import { readCapiSignals, cleanEventId, cleanPII } from "@/lib/meta-request";

/**
 * /api/meta/registration — fired once the opt-in (qualifier) form is submitted.
 *
 *   EVENT 2 of 4  Lead           — EVERY completed form, qualified or not.
 *   EVENT 3 of 4  QualifiedLead  — custom event, only when the client sends
 *                                  `qualified: true`, i.e. Q3 was one of the
 *                                  three coaching tiers.
 *
 * The browser fires both through the Pixel too, with the same event ids
 * (`leadEventId`, `qualifiedEventId`), so Meta deduplicates each pair and
 * merges the user data. Highest EMQ: email, phone, first + last name, country,
 * external_id (email + visitor id), _fbc, _fbp, IP and UA.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      lead?: unknown;
      qualified?: boolean;
      eventSourceUrl?: string;
      leadEventId?: string;
      qualifiedEventId?: string;
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
        : siteOrigin();

    const base = {
      pixelId,
      accessToken,
      email: lead.email,
      phone: lead.phone ?? "",
      firstName: lead.firstName ?? "",
      lastName: lead.lastName ?? "",
      countryCode: lead.countryCode ?? "",
      eventSourceUrl,
      ...readCapiSignals(req),
    };

    const out: Record<string, string> = {};

    // Lead — every completed opt-in form, qualified or not.
    try {
      await sendLeadEvent({ ...base, eventName: "Lead", idKey: "lead", eventId: cleanEventId(body.leadEventId) });
      out.lead = "sent";
      console.log("[reg] Lead sent");
    } catch (err) {
      out.lead = "error";
      console.error("[reg] Lead error:", err);
    }

    // QualifiedLead — custom event, only when Q3 is one of the three tiers.
    if (body.qualified === true) {
      try {
        await sendLeadEvent({
          ...base,
          eventName: "QualifiedLead",
          idKey: "ql",
          eventId: cleanEventId(body.qualifiedEventId),
        });
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
