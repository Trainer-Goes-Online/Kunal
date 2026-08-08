import { NextRequest, NextResponse } from "next/server";
import { validateFirstName, validateEmail, isDisqualified } from "@/lib/qualify";
import { sha256 } from "@/lib/meta-capi";
import { siteOrigin } from "@/lib/config";

/**
 * /api/lead — the CTA qualifier's six answers, forwarded to Pabbly.
 *
 * This funnel charges nothing, so there is no Razorpay webhook to carry the
 * applicant onward the way the paid funnel did. This route is its replacement:
 * it validates the payload, enriches it with everything the paid funnel sent
 * to Pabbly that still applies (UTMs, fbclid, _fbc/_fbp, IP, user agent,
 * hashed external_id, event_source_url), and POSTs one flat JSON object.
 *
 * FIELD NAMES MATCH THE PAID FUNNEL'S PABBLY PAYLOAD
 * (src/app/api/razorpay/webhook/route.ts) wherever the field still exists, so
 * both funnels can feed one Pabbly workflow and one sheet. What is gone is
 * gone because there is no checkout: no payment_id, order_id, amount,
 * currency, payment_date/time, purchase_event_id — and no city or last name,
 * neither of which this form asks for.
 *
 * `external_id` is sha256(lowercased email), exactly as the paid funnel
 * computes it, so the same person is the same id across both funnels and in
 * any Meta audience built from them.
 *
 * WHY THE COOKIES WORK HERE: the client sends this with sendBeacon (or fetch
 * with keepalive) to a same-origin path, so _fbc/_fbp ride along and the
 * server can read them. That is the whole reason the enrichment happens on
 * this side rather than in the browser.
 *
 * ENV — set in Vercel (server-side, NOT NEXT_PUBLIC_):
 *   PABBLY_LEAD_WEBHOOK_URL   the free funnel's Pabbly hook. Falls back to
 *                             LEAD_WEBHOOK_URL, then to the paid funnel's
 *                             PABBLY_WEBHOOK_URL.
 *   LEAD_WEBHOOK_SECRET       optional, sent as `x-webhook-secret`.
 *
 * With none of them set the route still answers 200 and still logs the lead.
 * That is deliberate: the client fires this un-awaited and navigates
 * immediately, so a non-200 would be invisible to the applicant. This route
 * must never be what decides whether someone reaches the calendar.
 */

/** Trim + cap. Everything here is free text arriving from a browser. */
function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    const firstName = clean(body.firstName, 60);
    const email = clean(body.email, 120).toLowerCase();
    const whatsapp = clean(body.whatsapp, 20).replace(/[^\d+]/g, "");
    const phoneDigits = whatsapp.replace(/\D/g, "");

    // Same rules the modal applies, re-applied here — a POST can arrive
    // without ever having passed through the modal.
    if (validateFirstName(firstName) || validateEmail(email) || phoneDigits.length < 6) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }

    const utm = (body.utm ?? {}) as Record<string, unknown>;
    const investment = clean(body.investment, 200);

    /* Recomputed server-side rather than trusted from the client. The browser
       sends `qualified`, but this decides the value Pabbly stores. */
    const qualified = !isDisqualified({ investment });

    const fbc = req.cookies.get("_fbc")?.value ?? "";
    const fbp = req.cookies.get("_fbp")?.value ?? "";
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "";
    const clientUserAgent = req.headers.get("user-agent") ?? "";

    const now = new Date();
    const pageUrl = clean(body.pageUrl, 500);

    /* Deterministic per applicant, so a resubmission updates one Pabbly row
       instead of creating a second. The paid funnel used the payment id;
       the email is the stable identifier here. */
    const leadId = sha256(`${email}|kwk_free_lead`).slice(0, 32);

    const pabblyPayload = {
      /* --- identity (the paid funnel's names, minus what we don't collect) --- */
      first_name: firstName,
      last_name: "",
      full_name: firstName,
      email,
      phone: whatsapp,
      country_code: clean(body.countryCode, 4),
      dial_code: clean(body.dialCode, 6),

      /* --- the seven answers, in the order they are asked --- */
      q1_first_name: firstName,
      q2_email: email,
      q3_whatsapp: whatsapp,
      q4_role: clean(body.role, 120),
      q5_goal: clean(body.goal, 200),
      q6_income: clean(body.income, 120),
      q7_investment: investment,

      /* --- outcome --- */
      funnel: "free",
      form: "cta_qualifier",
      qualified: qualified ? "true" : "false",
      status: qualified ? "booking" : "disqualified",
      /* Where this applicant was actually sent, so Pabbly can branch without
         re-implementing the rule. */
      redirected_to: qualified ? "/book-a-call" : "/thank-you-disqualified",

      /* --- attribution, identical field names to the paid payload --- */
      utm_source: clean(utm.source, 120),
      utm_medium: clean(utm.medium, 120),
      utm_campaign: clean(utm.campaign, 120),
      utm_content: clean(utm.content, 120),
      utm_term: clean(utm.term, 120),
      fbclid: clean(body.fbclid, 255),
      fbc,
      fbp,
      client_ip_address: clientIp,
      client_user_agent: clientUserAgent,
      /* sha256(lowercased email) — the paid funnel's exact formula, so one
         person resolves to one id across both funnels. */
      external_id: sha256(email),
      event_source_url: pageUrl || siteOrigin(),

      /* --- timestamps, matching the paid payload's shape --- */
      lead_id: leadId,
      created_at: now.toISOString(),
      submitted_date: now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
      submitted_time: now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }),
      submitted_timestamp: now.toISOString(),
      is_test: process.env.NODE_ENV === "production" ? "false" : "true",
    };

    console.log(
      `[lead] ${qualified ? "qualified" : "DISQUALIFIED"} lead_id=${leadId} ${JSON.stringify(
        pabblyPayload
      )}`
    );

    const hook =
      process.env.PABBLY_LEAD_WEBHOOK_URL ||
      process.env.LEAD_WEBHOOK_URL ||
      process.env.PABBLY_WEBHOOK_URL;
    if (!hook) {
      console.warn("[lead] PABBLY_LEAD_WEBHOOK_URL not set — Pabbly skipped");
      return NextResponse.json({ ok: true, forwarded: "no_webhook", qualified });
    }

    const secret = process.env.LEAD_WEBHOOK_SECRET;
    try {
      // 8s ceiling: the caller has already navigated away, but a hung fetch
      // would still hold a serverless invocation open until the platform
      // timeout.
      const res = await fetch(hook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(secret ? { "x-webhook-secret": secret } : {}),
        },
        body: JSON.stringify(pabblyPayload),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        console.error(`[lead] Pabbly rejected lead_id=${leadId} (${res.status})`);
        return NextResponse.json({ ok: true, forwarded: "error", qualified });
      }
      console.log(`[lead] Pabbly sent lead_id=${leadId} (${res.status})`);
    } catch (err) {
      console.error(`[lead] Pabbly error lead_id=${leadId}:`, err);
      return NextResponse.json({ ok: true, forwarded: "error", qualified });
    }

    return NextResponse.json({ ok: true, forwarded: "sent", qualified });
  } catch (err) {
    console.error("[lead] fatal:", err);
    return NextResponse.json({ ok: true, forwarded: "error" });
  }
}
