"use client";

import { useEffect } from "react";
import { fireAddToCartOnce } from "@/lib/tracking";

/**
 * One delegated listener that fires AddToCart (Meta CAPI) + GA4 add_to_cart the
 * first time the user clicks ANY CTA — hero, final CTA, nav, sticky bar.
 * Once-per-browser dedup lives in fireAddToCartOnce.
 *
 * Previously this matched links whose pathname was /checkout. This funnel takes
 * no payment and has no checkout step, so the trigger is now the CTA itself:
 * every one of them carries `data-qualify-open` (the attribute QualifyModal
 * intercepts). Matching the attribute rather than a destination also means the
 * event fires when the modal opens, not only if the link is followed.
 *
 * ⚠️ The event is still named AddToCart and /api/meta/add-to-cart still stamps
 * it with `pricing.inr` as its value. On a funnel that charges nothing that
 * value is fictional. Renaming it to Lead is a change to the Meta pixel's event
 * history and to whatever the ad sets optimise for, so it is left alone here —
 * decide it on the ads side, then change the route to match.
 */
export function CtaTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("[data-qualify-open]")) fireAddToCartOnce();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
