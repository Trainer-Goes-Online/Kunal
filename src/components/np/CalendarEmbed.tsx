"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";
import { trackGa4EventOnce } from "@/lib/ga4";

/**
 * Booking calendar (Calendly). C12: the brand frames the embed on a neutral inset
 * with a branded loading placeholder — it doesn't restyle the widget. Listens for
 * Calendly's `event_scheduled` postMessage (origin-checked) to fire GA4 `book_call`
 * (once per browser) and advance to /thank-you.
 */
export function CalendarEmbed() {
  const sep = site.calendlyUrl.includes("?") ? "&" : "?";
  const src = site.calendlyUrl ? `${site.calendlyUrl}${sep}embed_type=Inline&hide_gdpr_banner=1` : "";

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

  if (!site.calendlyUrl) {
    return (
      <div className="cal-frame">
        <div className="cal-ph">
          <div>
            <div className="spin" aria-hidden />
            <div className="mono">Calendar loads here</div>
            <p style={{ marginTop: 10, color: "#555", fontSize: 13, maxWidth: 300 }}>
              Your Cal.com / Calendly scheduler drops in here once connected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cal-frame">
      <iframe src={src} title="Book your assessment" loading="lazy" />
    </div>
  );
}
