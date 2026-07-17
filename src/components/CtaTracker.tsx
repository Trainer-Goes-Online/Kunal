"use client";

import { useEffect } from "react";
import { fireAddToCartOnce } from "@/lib/tracking";

/**
 * One delegated listener that fires AddToCart (Meta CAPI) + GA4 add_to_cart the
 * first time the user clicks ANY link heading to /checkout — hero, final CTA,
 * nav, sticky bar. Once-per-browser dedup lives in fireAddToCartOnce.
 */
export function CtaTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a");
      if (!a) return;
      try {
        const url = new URL((a as HTMLAnchorElement).href, window.location.href);
        if (url.pathname.replace(/\/+$/, "") === "/checkout") fireAddToCartOnce();
      } catch {
        /* ignore */
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
