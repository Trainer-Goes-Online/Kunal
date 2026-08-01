"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CONFETTI_BASE_OPTIONS,
  CONFETTI_CANNONS,
  CONFETTI_COLORS,
  CONFETTI_DURATION_MS,
  CONFETTI_PARTICLES_PER_TICK,
} from "@/lib/constants";

/**
 * Checkout celebration — two physics-based confetti cannons firing inward from
 * the left and right screen edges the moment /checkout opens.
 *
 * Runs on canvas-confetti, which owns its own canvas, its own physics and its
 * own teardown; this component only schedules the shots. All tuning lives in
 * `constants.ts` so nothing numeric is buried in the render path.
 *
 * Silent under prefers-reduced-motion. `confetti.reset()` on unmount so a fast
 * back-navigation can't leave particles mid-flight.
 */
export function Confetti() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const endAt = Date.now() + CONFETTI_DURATION_MS;
    let raf = 0;

    const fire = () => {
      // Ramp down as the burst runs out, so it tapers instead of stopping dead.
      const remaining = Math.max(0, endAt - Date.now()) / CONFETTI_DURATION_MS;
      const particleCount = Math.ceil(CONFETTI_PARTICLES_PER_TICK * remaining) + 1;

      for (const cannon of CONFETTI_CANNONS) {
        confetti({
          ...CONFETTI_BASE_OPTIONS,
          ...cannon,
          particleCount,
          colors: CONFETTI_COLORS,
        });
      }

      if (Date.now() < endAt) raf = requestAnimationFrame(fire);
    };

    raf = requestAnimationFrame(fire);

    return () => {
      cancelAnimationFrame(raf);
      confetti.reset();
    };
  }, []);

  return null;
}
