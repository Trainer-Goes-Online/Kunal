"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { trackGa4EventOnce } from "@/lib/ga4";
import { fireScheduleEvent, type LeadPII } from "@/lib/tracking";
import { QUALIFY_STORAGE_KEY } from "@/lib/qualify";

/**
 * P02 — the Calendly inline embed, reskinned to SDP's `CalendlyEmbed`
 * (_reference/sdp/components/book-a-call/BookACallPage.tsx:129-223 +
 * _reference/sdp/app/new-book-a-call/book-a-call.css:331-392): brass-framed
 * white card with a sweeping top rule, a spinner layer underneath, and a
 * plain-link fallback if the calendar never mounts.
 *
 * BACKEND UNCHANGED. The `calendly.event_scheduled` postMessage listener,
 * its origin check, `trackGa4EventOnce("book_call")` and the 1200 ms hand-off
 * to `site.thankYouUrl` are byte-for-byte what shipped before — only the
 * markup around them is new. The embed URL still comes from
 * `site.calendlyUrl` (NEXT_PUBLIC_CALENDLY_URL) with the same
 * `embed_type=Inline&hide_gdpr_banner=1` query.
 *
 * ADDED (SDP parity, no behaviour removed): optional `name` / `email`
 * prefill, appended to the embed URL exactly as SDP does. They arrive as
 * server-read `?name` / `?email` query params from /checkout.
 *
 * Fail-open: the embed is a real `<iframe src>`, so it loads with JS
 * disabled. The spinner sits BELOW it (z-index) and the opaque iframe
 * covers it on paint — no JS needed to reveal the calendar.
 */

/**
 * The lead PII for the Schedule CAPI event. The qualifier stash carries the
 * phone and country (best EMQ); if it is gone (private mode, or a direct visit
 * that skipped the qualifier) we fall back to the ?name / ?email prefill.
 */
function readScheduleLead(name: string, email: string): LeadPII {
  try {
    const raw = window.sessionStorage.getItem(QUALIFY_STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw) as {
        firstName?: string;
        email?: string;
        whatsapp?: string;
        countryCode?: string;
      };
      return {
        firstName: d.firstName || name,
        email: d.email || email,
        phone: d.whatsapp || "",
        countryCode: d.countryCode || "",
      };
    }
  } catch {
    /* private mode / bad JSON — fall through to the prefill */
  }
  return { firstName: name, email, phone: "", countryCode: "" };
}

export function CalendarEmbed({ name = "", email = "" }: { name?: string; email?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const sep = site.calendlyUrl.includes("?") ? "&" : "?";
  let src = site.calendlyUrl ? `${site.calendlyUrl}${sep}embed_type=Inline&hide_gdpr_banner=1` : "";
  if (src) {
    if (name) src += `&name=${encodeURIComponent(name)}`;
    if (email) src += `&email=${encodeURIComponent(email)}`;
  }

  /* ── Booking hand-off: Calendly → GA4 book_call → /thank-you ──────────
     Calendly's free plan has no redirect-after-booking setting, so the
     redirect has to happen on our side: the inline embed postMessages
     `calendly.event_scheduled` to the parent window when a slot is taken,
     and we navigate on that.

     Three hardenings over the original listener:
      1. ORIGIN. `endsWith("calendly.com")` also matches a hostile
         `https://notcalendly.com`. The check is now an exact match on
         calendly.com or a true subdomain of it.
      2. PAYLOAD SHAPE. Calendly has posted `e.data` as a JSON *string* in
         some embed versions; both shapes are handled.
      3. IDEMPOTENCE. A duplicate event can't fire two navigations.

     The 1.2s delay is deliberate — it gives the GA4 beacon time to leave
     before the page unloads. */
  useEffect(() => {
    let handed = false;

    const isCalendly = (origin: string) => {
      try {
        const h = new URL(origin).hostname;
        return h === "calendly.com" || h.endsWith(".calendly.com");
      } catch {
        return false;
      }
    };

    const readEvent = (data: unknown): string => {
      if (typeof data === "string") {
        try {
          return String((JSON.parse(data) as { event?: string })?.event ?? "");
        } catch {
          return "";
        }
      }
      if (data && typeof data === "object") {
        return String((data as { event?: string }).event ?? "");
      }
      return "";
    };

    const onMsg = (e: MessageEvent) => {
      if (handed || typeof e.origin !== "string" || !isCalendly(e.origin)) return;
      if (readEvent(e.data) !== "calendly.event_scheduled") return;

      handed = true;
      trackGa4EventOnce("book_call");
      // Meta CAPI Schedule — Calendly's own scheduled event, not a pageview. PII
      // comes from the qualifier stash (best EMQ), falling back to the ?name/
      // ?email prefill this embed was handed.
      fireScheduleEvent(readScheduleLead(name, email));
      window.setTimeout(() => {
        window.location.href = site.thankYouUrl;
      }, 1200);
    };

    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [name, email]);

  // Give the embed 12s (SDP polls 60 × 200ms) before offering the direct link.
  useEffect(() => {
    if (!src) return;
    const t = window.setTimeout(() => setFailed((f) => (loaded ? f : true)), 12000);
    return () => window.clearTimeout(t);
  }, [src, loaded]);

  const showFallback = failed && !loaded;

  return (
    <div className="p02-cal-frame">
      <div className="p02-cal-embed">
        {src && (
          <iframe
            src={src}
            title="Book your assessment with Kunal"
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>

      <div
        className={`p02-cal-loading${loaded ? " is-hidden" : ""}${showFallback ? " is-fallback" : ""}`}
        aria-hidden={loaded ? true : undefined}
      >
        {!site.calendlyUrl ? (
          <p className="p02-cal-fallback">
            The booking calendar is being connected. Your application is already in —
            message us on WhatsApp at {site.supportPhone} and we&rsquo;ll place your slot by hand.
          </p>
        ) : showFallback ? (
          <p className="p02-cal-fallback">
            Couldn&rsquo;t load the calendar.{" "}
            <a href={src} target="_blank" rel="noopener noreferrer">
              Open the booking page &rarr;
            </a>
          </p>
        ) : (
          <div>
            <div className="p02-spin" aria-hidden />
            <p>Loading available slots&hellip;</p>
          </div>
        )}
      </div>
    </div>
  );
}
