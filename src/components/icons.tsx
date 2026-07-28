/* C11 — bespoke line-SVGs, one stroke weight, token-colored via currentColor. No emoji, no icon fonts. */

export function Arrow({ size = 18 }: { size?: number }) {
  return (
    <svg className="arrow" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Cross({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Plus({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function PlayTriangle({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5z" />
    </svg>
  );
}

export function RupeeMark({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 5h10M7 9h10M7 5c5 0 6 8 -0.5 8H8l8 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Coach({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function CalendarIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 10h16M8.5 3v4.5M15.5 3v4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------
   Keyed glyph registry — one stroke weight (1.6), 24-grid, currentColor.
   Consumed by the mechanism timeline, the programme grid and the four-costs
   dial via a string `icon` key on the content record, so copy data never
   imports JSX. Every path is drawable: `pathLength=1` + a dash offset lets
   the CSS scribe them on reveal without per-icon length maths.
------------------------------------------------------------------ */
const G = {
  stethoscope: (
    <>
      <path d="M5 3v5a4 4 0 0 0 8 0V3" pathLength={1} />
      <path d="M9 12v2a5 5 0 0 0 10 0v-1" pathLength={1} />
      <circle cx="19" cy="10" r="2.2" pathLength={1} />
    </>
  ),
  flame: (
    <path
      d="M12 3c3.5 3.2 5.5 5.9 5.5 8.9A5.5 5.5 0 0 1 12 21a5.5 5.5 0 0 1-5.5-6c0-1.7.8-3.2 2.2-4.6.3 1.4.9 2.2 1.8 2.5C10.2 9.7 10.8 6.6 12 3z"
      pathLength={1}
    />
  ),
  dumbbell: (
    <>
      <path d="M3 9v6M6.5 7v10M17.5 7v10M21 9v6" pathLength={1} />
      <path d="M6.5 12h11" pathLength={1} />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2.2" pathLength={1} />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" pathLength={1} />
      <path d="M12 15v2" pathLength={1} />
    </>
  ),
  plate: (
    <>
      <circle cx="12" cy="12" r="8.5" pathLength={1} />
      <circle cx="12" cy="12" r="4.4" pathLength={1} />
    </>
  ),
  chat: (
    <>
      <path d="M20 13.5a3 3 0 0 1-3 3H9l-4.5 3.5v-4A3 3 0 0 1 4 13.5v-6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z" pathLength={1} />
      <path d="M8.5 8.5h7M8.5 12h4.5" pathLength={1} />
    </>
  ),
  shieldBody: (
    <>
      <path d="M12 2.5l7.5 2.8v6.4c0 4.6-3.1 8.6-7.5 9.8-4.4-1.2-7.5-5.2-7.5-9.8V5.3z" pathLength={1} />
      <path d="M12 8v6M9 11h6" pathLength={1} />
    </>
  ),
  chart: (
    <>
      <path d="M3.5 20.5h17" pathLength={1} />
      <path d="M7 20.5v-5M12 20.5v-9M17 20.5v-13" pathLength={1} />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" pathLength={1} />
      <path d="M12 7v5.3l3.4 2" pathLength={1} />
    </>
  ),
  bolt: <path d="M13.5 2.5L5 13.5h5.5L9.5 21.5 19 10h-6z" pathLength={1} />,
  rupee: <path d="M7 5h10M7 9h10M7 5c5 0 6 8-.5 8H8l8 6" pathLength={1} />,
  shield: (
    <>
      <path d="M12 2.5l7.5 2.8v6.4c0 4.6-3.1 8.6-7.5 9.8-4.4-1.2-7.5-5.2-7.5-9.8V5.3z" pathLength={1} />
      <polyline points="9 12 11 14 15 10" pathLength={1} />
    </>
  ),
  star: (
    <path d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z" pathLength={1} />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" pathLength={1} />
      <path d="M3.5 12h17" pathLength={1} />
      <path d="M12 3.5c2.4 2.4 3.6 5.3 3.6 8.5S14.4 18.1 12 20.5c-2.4-2.4-3.6-5.3-3.6-8.5S9.6 5.9 12 3.5z" pathLength={1} />
    </>
  ),
} as const;

export type GlyphKey = keyof typeof G;

/** Look up a registry glyph by its content-data key. `draw` arms the scribe-in. */
export function Glyph({
  name,
  size = 24,
  draw = false,
}: {
  name: GlyphKey | string;
  size?: number;
  draw?: boolean;
}) {
  const body = G[name as GlyphKey];
  if (!body) return null;
  return (
    <svg
      className={draw ? "glyph glyph--draw" : "glyph"}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {body}
    </svg>
  );
}

/** Bespoke guarantee seal (C11) — a ringed stamp with a check. */
export function GuaranteeSeal({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
      <circle cx="32" cy="32" r="23" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
      <path d="M23 32.5l6 6L42 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
