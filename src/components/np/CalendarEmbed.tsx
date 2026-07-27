"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { trackGa4EventOnce } from "@/lib/ga4";

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
export function CalendarEmbed({ name = "", email = "" }: { name?: string; email?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const sep = site.calendlyUrl.includes("?") ? "&" : "?";
  let src = site.calendlyUrl ? `${site.calendlyUrl}${sep}embed_type=Inline&hide_gdpr_banner=1` : "";
  if (src) {
    if (name) src += `&name=${encodeURIComponent(name)}`;
    if (email) src += `&email=${encodeURIComponent(email)}`;
  }

  // ── UNCHANGED backend: Calendly → GA4 book_call → /thank-you ──────────
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (typeof e.origin !== "string" || !e.origin.endsWith("calendly.com")) return;
      const ev = (e.data && (e.data as { event?: string }).event) || "";
      if (ev === "calendly.event_scheduled") {
        trackGa4EventOnce("book_call");
        window.setTimeout(() => {
          window.location.href = site.thankYouUrl;
        }, 1200);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

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
            The booking calendar is being connected. Your assessment fee is already
            received — reply to your confirmation email and we&rsquo;ll place your slot by hand.
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
