import { NextRequest, NextResponse } from "next/server";
import {
  validateFullName,
  validateEmail,
  isDisqualified,
  failedRules,
  splitName,
  GATES_IN_FORM_ORDER,
  GATE_STYLE,
} from "@/lib/qualify";
import { sha256 } from "@/lib/meta-capi";
import { siteOrigin } from "@/lib/config";

/**
 * /api/lead — the coaching application's answers, forwarded to Pabbly.
 *
 * ⚠️ COLUMN NAMES CHANGED AGAIN with KWK_Application_Form_Final.pdf. The
 * answers are now q01_role … q11_decision_maker (plus q01_role_other). Gone:
 * q10_commitment and q11_attend_call, both questions the client deleted. Every
 * other q-number SHIFTED by one because Q01 is now professional role. Also new:
 * last_name / full_name are real values, since the form asks for a full name.
 * Re-capture the webhook response in Pabbly and re-map, or the answer columns
 * silently arrive empty.
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

    /* The form asks for one full name; split it so Pabbly and the emails get
       first / last separately, with the untouched original alongside. */
    const name = splitName(clean(body.fullName, 120) || clean(body.firstName, 120));
    const email = clean(body.email, 120).toLowerCase();
    const whatsapp = clean(body.whatsapp, 20).replace(/[^\d+]/g, "");
    const phoneDigits = whatsapp.replace(/\D/g, "");

    // Same rules the modal applies, re-applied here — a POST can arrive
    // without ever having passed through the modal.
    if (validateFullName(name.full) || validateEmail(email) || phoneDigits.length < 6) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }

    const utm = (body.utm ?? {}) as Record<string, unknown>;

    /* The eleven application answers. Free text gets a longer cap than the
       pick-one answers; `tried` is the multi-select, arriving pre-joined by
       the modal (see MULTI_SEPARATOR in qualify.ts). */
    const answers = {
      role: clean(body.role, 200),
      roleOther: clean(body.roleOther, 200),
      situation: clean(body.situation, 200),
      goal90: clean(body.goal90, 200),
      tried: clean(body.tried, 500),
      urgency: clean(body.urgency, 200),
      urgencyOther: clean(body.urgencyOther, 500),
      paidBefore: clean(body.paidBefore, 200),
      investReady: clean(body.investReady, 300),
      investLevel: clean(body.investLevel, 300),
      income: clean(body.income, 120),
      decisionMaker: clean(body.decisionMaker, 200),
    };

    /* Recomputed server-side rather than trusted from the client. The browser
       sends `qualified`, but this decides the value Pabbly stores. Four gates,
       all from the PDF's routing logic — see FAIL_RULES in qualify.ts. */
    const failed = failedRules(answers);
    const qualified = !isDisqualified(answers);
    /* Which gate tripped, so Pabbly can segment and the disqualified email can
       print one honest sentence instead of a generic brush-off. `_all` lists
       every failure when more than one applies. */
    const primary = failed[0];
    const reason = {
      disqualified_reason: primary?.code ?? "",
      disqualified_reason_all: failed.map((r) => r.code).join(","),
      disqualified_reason_text: primary?.text ?? "",
      disqualified_answer: primary ? (answers[primary.from as keyof typeof answers] ?? "") : "",
    };

    /* ---- The four gates, PRE-RENDERED ------------------------------------
       An earlier version shipped 28 separate gate1_label … gate4_border
       fields and expected the email template to assemble them. That is
       unmappable in Pabbly's UI, and the alternative — four IF/ELSE branches
       to pick a colour — is worse.

       So the whole checklist is rendered here, colours and ticks already
       decided, and travels as ONE value. The email maps a single tag,
       {{gates_html}}, and Pabbly needs no conditions at all. GATE_STYLE in
       qualify.ts stays the single source, so the email and
       /thank-you-disqualified cannot drift apart.

       The per-question fields below it are for a Sheet / CRM row, or for
       anyone who does want to build the conditions by hand. */

    const gateRows = GATES_IN_FORM_ORDER.map((rule) => {
      const met = !rule.failed(answers);
      const s = met ? GATE_STYLE.pass : GATE_STYLE.fail;
      return { rule, met, s, answer: answers[rule.from as keyof typeof answers] ?? "" };
    });

    /* Answers are fixed option strings today, but a direct POST can put
       anything in them, and this lands inside an email body. Escape it. */
    const esc = (v: string) =>
      v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    const gates_html = [
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:Helvetica,Arial,sans-serif;">',
      ...gateRows.map(
        ({ rule, s, answer }) =>
          `<tr><td style="padding:0 0 8px;">` +
            `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${s.bg};border:1px solid ${s.border};border-left:3px solid ${s.color};border-radius:0 10px 10px 0;">` +
              `<tr>` +
                `<td width="30" valign="top" style="padding:13px 0 13px 14px;font-size:17px;font-weight:bold;line-height:20px;color:${s.color};">${s.mark}</td>` +
                `<td style="padding:13px 16px 13px 6px;">` +
                  `<p style="margin:0 0 4px;font-size:14px;line-height:20px;font-weight:bold;color:#161310;">${esc(rule.label)}</p>` +
                  `<p style="margin:0;font-size:13px;line-height:19px;color:#8A8474;">${s.status} &middot; you answered: <span style="color:#161310;">${esc(answer) || "Not recorded"}</span></p>` +
                `</td>` +
              `</tr>` +
            `</table>` +
          `</td></tr>`
      ),
      "</table>",
    ].join("");

    const gates_text = gateRows
      .map(({ rule, s, answer }) => `[${s.mark}] ${rule.label}\n    ${s.status} - you answered: ${answer || "Not recorded"}`)
      .join("\n\n");

    const gates = {
      /** One tag, drop straight into the email body. Everything baked in. */
      gates_html,
      /** Same thing for the plain-text part. */
      gates_text,
      /** "Q8, Q10" — handy for a Sheet column or a filter step. */
      failed_questions: failed.map((r) => `Q${r.q}`).sort().join(", "),
      /** Per question, for a Sheet row or hand-built conditions. */
      gate_q1_answer: answers.role,
      gate_q1_status: gateRows.find((g) => g.rule.q === 1)?.s.status ?? "",
      gate_q8_answer: answers.investReady,
      gate_q8_status: gateRows.find((g) => g.rule.q === 8)?.s.status ?? "",
      gate_q10_answer: answers.income,
      gate_q10_status: gateRows.find((g) => g.rule.q === 10)?.s.status ?? "",
      gate_q11_answer: answers.decisionMaker,
      gate_q11_status: gateRows.find((g) => g.rule.q === 11)?.s.status ?? "",
    };

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
      /* --- identity --- */
      first_name: name.first,
      last_name: name.last,
      full_name: name.full,
      email,
      phone: whatsapp,
      country_code: clean(body.countryCode, 4),
      dial_code: clean(body.dialCode, 6),

      /* --- the ten application answers ---
         ⚠️ THE q-NUMBERS ARE STABLE IDENTIFIERS, NOT THE ON-SCREEN ORDER.
         They come from the client's application PDF and are deliberately left
         alone whenever the form is reshuffled, so an existing Pabbly mapping
         keeps working. Two consequences to expect:
           · q05 is absent. That was the "what has stopped you" free text, and
             the client removed the question. The gap is intentional; do not
             renumber q06+ to close it.
           · contact is asked LAST on screen but still arrives above as
             full_name / email / phone.
         `_other` fields are only filled when their parent answer is "Other". */
      q01_role: answers.role,
      q01_role_other: answers.roleOther,
      q02_situation: answers.situation,
      q03_goal_90d: answers.goal90,
      q04_tried: answers.tried,
      q06_urgency: answers.urgency,
      q06_urgency_other: answers.urgencyOther,
      q07_paid_before: answers.paidBefore,
      q08_invest_ready: answers.investReady,
      q09_invest_level: answers.investLevel,
      q10_income: answers.income,
      q11_decision_maker: answers.decisionMaker,

      /* --- outcome --- */
      funnel: "free",
      form: "cta_qualifier",
      qualified: qualified ? "true" : "false",
      status: qualified ? "booking" : "disqualified",
      /* Where this applicant was actually sent, so Pabbly can branch without
         re-implementing the rule. */
      redirected_to: qualified ? "/book-a-call" : "/thank-you-disqualified",
      /* Empty strings on a qualified lead. */
      ...reason,
      ...gates,

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
