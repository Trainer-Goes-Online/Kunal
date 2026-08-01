"use client";

import { useEffect, useState } from "react";
import { site, offer } from "@/lib/site";
import { Glyph } from "@/components/icons";

/**
 * P01 — the "special offer unlocked" block on /checkout.
 *
 * Structure follows the client's reference exactly: a celebratory strip naming
 * the coupon, then a card carrying a countdown, the unlocked-price row
 * (was-price struck through, percentage-off badge, price due) and a receipt
 * line confirming the code and the saving.
 *
 * The coupon code is static by design — the client asked for a fixed code, not
 * a generated one, so nothing here pretends to be a real per-visitor voucher.
 *
 * The countdown is stamped into localStorage, so a refresh continues the same
 * clock rather than restarting from full on every page load. At zero it LOOPS
 * to a fresh window at the client's request; the price is unaffected either
 * way, so nothing the copy promises is broken when it rolls over.
 *
 * Renders nothing until mounted (localStorage is client-only, and a
 * server-rendered digit would hydrate-mismatch).
 */
const KEY = "kwk.checkout.offer.deadline";

function mmss(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function OfferUnlocked() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const windowMs = offer.timerMinutes * 60_000;

    const stamp = (at: number) => {
      try {
        window.localStorage.setItem(KEY, String(at));
      } catch {
        /* private mode — the clock simply restarts next visit */
      }
      return at;
    };

    let deadline = Number(window.localStorage.getItem(KEY) || 0);
    // Missing, already elapsed, or absurd (clock change / tampered value).
    if (!deadline || deadline <= Date.now() || deadline - Date.now() > windowMs) {
      deadline = stamp(Date.now() + windowMs);
    }

    const tick = () => {
      let remaining = deadline - Date.now();
      // Client-specified: the countdown loops rather than resting at 00:00.
      // Rolling forward in whole windows (not just now + windowMs) keeps every
      // open tab on the same deadline instead of each one drifting apart.
      if (remaining <= 0) {
        const windowsPassed = Math.floor((Date.now() - deadline) / windowMs) + 1;
        deadline = stamp(deadline + windowsPassed * windowMs);
        remaining = deadline - Date.now();
      }
      setLeft(remaining);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="p01-offer-wrap">
      <div className="p01-unlock">
        <span className="p01-unlock-ico" aria-hidden>
          <Glyph name="gift" size={20} />
        </span>
        <div>
          <p className="p01-unlock-h">You just unlocked a special offer!</p>
          <p className="p01-unlock-s">
            Exclusive price applied just for you with code{" "}
            <span className="p01-unlock-code">{offer.code}</span>
          </p>
        </div>
      </div>

      <div className="p01-offer">
        <div className="p01-offer-timer">
          <span className="p01-offer-timer-l">
            <Glyph name="hourglass" size={15} /> Offer may end in:
          </span>
          <span className="p01-offer-clock" role="timer">
            {left === null ? mmss(offer.timerMinutes * 60_000) : mmss(left)}
          </span>
        </div>

        <div className="p01-offer-body">
          <div className="p01-offer-badge">
            <Glyph name="unlock" size={15} /> Special price unlocked!
          </div>

          <div className="p01-offer-prices">
            {offer.hasAnchor && (
              <>
                <span className="p01-offer-was">₹{offer.wasRaw.toLocaleString("en-IN")}</span>
                <span className="p01-offer-off">{offer.percentOff}% OFF</span>
              </>
            )}
            <span className="p01-offer-now">{site.assessmentFee}</span>
          </div>

          {offer.hasAnchor && (
            <div className="p01-offer-applied">
              <Glyph name="tag" size={15} />
              <span>
                <b>{offer.code}</b> applied — saving ₹
                {offer.savingRaw.toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
