/**
 * Static, non-copy configuration shared across components.
 *
 * Copy lives in `content.ts`; env-driven values live in `site.ts`. This file is
 * for fixed tuning constants that are neither.
 */

/* ------------------------------------------------------------------
   Checkout celebration — physics-based confetti cannons.
   Two side cannons fire inward from the left and right screen edges the
   moment /checkout opens. Values are canvas-confetti's own options.
------------------------------------------------------------------ */

/** Brass brand palette first, celebratory accents after. */
export const CONFETTI_COLORS = [
  "#C9A24B",
  "#E3C078",
  "#8A6D2B",
  "#E5342A",
  "#3F8F5B",
  "#4A90D9",
  "#F5F0E6",
];

/** How long both cannons keep firing, in milliseconds. */
export const CONFETTI_DURATION_MS = 1500;

/**
 * Particles emitted per animation frame, per cannon. Kept deliberately low:
 * at 5 the two cannons filled the viewport densely enough to obscure the
 * offer card they are meant to celebrate.
 */
export const CONFETTI_PARTICLES_PER_TICK = 2;

/** Shared physics for both cannons. */
export const CONFETTI_BASE_OPTIONS = {
  startVelocity: 48,
  spread: 55,
  ticks: 260,
  gravity: 0.95,
  decay: 0.91,
  scalar: 0.9,
  zIndex: 9998,
} as const;

/**
 * Cannon placement. `origin` is normalised viewport space (0-1) and `angle`
 * is degrees counter-clockwise from east, so 60 fires up-and-right from the
 * left edge and 120 fires up-and-left from the right edge — both toward the
 * centre of the screen.
 */
export const CONFETTI_CANNONS = [
  { angle: 60, origin: { x: 0, y: 0.65 } },
  { angle: 120, origin: { x: 1, y: 0.65 } },
] as const;
