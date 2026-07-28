"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * The "OFFER ENDS IN" countdown the funnel md asks for in the hero.
 *
 * Rendered to the client's supplied reference: a plain uppercase label, then a
 * red block holding four tabular cells — DAYS · HRS · MIN · SEC — each a big
 * white numeral over a small unit caption, split by dot separators.
 *
 * Window length is `NEXT_PUBLIC_OFFER_TIMER_HOURS` (default 5, "0" removes the
 * strip entirely). NOTE: with a 5-hour window the DAYS cell always reads 00 —
 * set the var to e.g. 144 for a six-day window if that cell should carry a
 * number.
 *
 * The deadline is stamped ONCE per visitor into localStorage, so a refresh or a
 * second tab continues the same countdown instead of restarting — a timer that
 * resets on every page load is the thing that reads as fake. At zero it does NOT
 * silently roll over to another window; it simply stops rendering.
 *
 * Renders nothing until mounted — localStorage is client-only, and a
 * server-rendered digit would hydrate-mismatch on the first paint.
 */
const KEY = "kwk.offer.deadline";

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export function OfferTimer() {
  const hours = Number(site.offerTimerHours) || 0;
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    if (hours <= 0) return;
    const windowMs = hours * 3600_000;

    let deadline = Number(window.localStorage.getItem(KEY) || 0);
    // Re-stamp only if missing or absurd (clock change / tampered value).
    if (!deadline || deadline - Date.now() > windowMs) {
      deadline = Date.now() + windowMs;
      try {
        window.localStorage.setItem(KEY, String(deadline));
      } catch {
        /* private mode — the countdown simply restarts next visit */
      }
    }

    const tick = () => setLeft(Math.max(0, deadline - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [hours]);

  if (hours <= 0 || left === null) return null;

  /* Window elapsed: render nothing. It does NOT silently roll over to another
     window (that is the thing that reads as fake), and it no longer falls back
     to the monthly-capacity line either — that line was removed from the CTA
     group at the client's request, so reintroducing it here would contradict
     the rest of the page. */
  if (left <= 0) return null;

  const s = Math.floor(left / 1000);
  const cells = [
    { v: pad(Math.floor(s / 86400)), k: "Days" },
    { v: pad(Math.floor((s % 86400) / 3600)), k: "Hrs" },
    { v: pad(Math.floor((s % 3600) / 60)), k: "Min" },
    { v: pad(s % 60), k: "Sec" },
  ];

  return (
    <div className="s04-timer" role="timer" aria-live="off">
      <span className="s04-timer-label">Offer ends in</span>
      <span className="s04-timer-clock">
        {cells.map((c, i) => (
          <span className="s04-timer-group" key={c.k}>
            <span className="s04-timer-cell">
              <b>{c.v}</b>
              <i>{c.k}</i>
            </span>
            {i < cells.length - 1 && <span className="s04-timer-sep" aria-hidden />}
          </span>
        ))}
      </span>
    </div>
  );
}
