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
 * This is EVENT 1 of the four Meta funnel events (AddToCart → Lead →
 * QualifiedLead → Schedule). It fires through the Pixel and CAPI with one
 * shared event id (see src/lib/tracking.ts). It carries no value or currency:
 * the strategy call is free, so it is sent as a plain event.
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
