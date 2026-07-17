# Skin — Kraft With Kunal (brass / graphite serif) · Layer 3 project override

> Per-project override of the default [TGO Wellness skin](./.claude/design-system.skin.tgo-wellness.md), for the **Kraft With Kunal** high-ticket VSL funnel. Follows the [design brain](./.claude/design-system.base.md) (Layers 1–2 are skin-agnostic; this file only decides palette, fonts, and literal CSS). **If a value here fights a concept, the concept wins.**
>
> **Status: DRAFT — awaiting Atul sign-off** (hue + serif). Approved direction by the project owner: masculine executive-premium, modeled on the `govind` precedent (calm serif), explicitly NOT the loud `tgo-dfy` Archivo Black/orange.

## Why this override exists (grounded in the brain)
- **C2 (one accent = the register):** the wellness default accent is forest green → reads *spa / wellness coach*. Kraft is boardroom, executive, "you built the career." The single spotlight accent must say *premium & considered* → **metallic brass-gold on a graphite/obsidian stage**.
- **C1 (three voices; serif = authored authority):** keep a **serif display** voice (anti-hype, authored), but shift Lora → a **higher-contrast, architectural serif** (Newsreader direction) for a sharper masculine read. **Archivo Black rejected** (inverts the "calm, not hype" mandate).
- Everything else — structure, motion, the verbatim breathing CTA / sticky bar / reveal CSS — is **inherited from the wellness skin unchanged**. This is a **token re-hue, not a rebuild** (C12).

## Tokens (OKLCH) — override block
The Kraft LP runs on the **dark stage** (VSL page). These override the wellness `[data-theme="dark"]` preset.

```css
:root {
  /* fonts */
  --f-display: 'Newsreader','Georgia',serif;      /* high-contrast authored serif (was Lora) */
  --f-sans: 'Inter Tight','Geist',-apple-system,system-ui,sans-serif;  /* kept */
  --f-mono: 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace; /* kept */
  /* radius + rhythm inherited from base/wellness */
  --radius-s:8px; --radius-m:14px; --radius-l:22px; --radius-xl:32px;
  --section-pad:clamp(56px,6.5vw,84px); --content-max:1200px;
  --ease-reveal:cubic-bezier(.2,.7,.2,1); --ease-btn:cubic-bezier(.2,.8,.2,1);
}

/* KRAFT dark stage — graphite/obsidian + brass. Default preset for this funnel. */
:root, [data-theme="dark"] {
  --canvas:   oklch(0.19 0.015 255);   /* graphite/obsidian, cool near-black (NOT green, NOT #000) */
  --canvas-2: oklch(0.23 0.018 255);   /* raised surface / cards */
  --sand:     oklch(0.27 0.02 255);
  --ink:   oklch(0.95 0.010 90);        /* warm off-white */
  --ink-2: oklch(0.80 0.015 90);
  --ink-3: oklch(0.66 0.020 90);        /* mono micro-labels / eyebrow */
  --hair:  oklch(0.55 0.02 255 / 0.28); /* hairline rules / ledger dividers */

  --accent:      oklch(0.76 0.12 85);   /* brass-gold — the one spotlight accent */
  --accent-deep: oklch(0.58 0.12 80);   /* value-moment depth, CTA hover */
  --accent-soft: oklch(0.88 0.06 85);
  --gold:        oklch(0.86 0.09 90);   /* lit value-moment (headline word, numbers) */
}
```

## Verbatim effect re-hue (inherit wellness CSS, swap the hues)
Reuse the wellness skin's `.cta-big` (breathing + shimmer), `.sticky-cta` (slide-up + shine), `.urgency-strip`, `.reveal`, `.eyebrow-pill`, `.nav`, `.btn` **verbatim**, with only these literal color swaps:
- CTA gradient `linear-gradient(180deg,#62cd4b,#357a25)` (green) → **brass** `linear-gradient(180deg, #C9A24B, #8A6D2B)`; shine stays warm gold `rgba(230,207,149,.48)`.
- Hero ambient glow `rgba(85,188,64,.18)` (green) → **brass** `rgba(201,162,75,.16)`, over the graphite stage.
- Accent headline word clip `linear-gradient(180deg,#b8e6a8,#55bc40,#2e6a1f)` → **brass** `linear-gradient(180deg, #E7CE93, #C9A24B 55%, #8A6D2B)`.
- `--gold`-based value words keep the gold clip (unchanged).
- Sticky bar / strip greens (`#142a0e`, `#1c3d14`) → graphite (`#17181C`, `#202227`); keep the gold hairline + shine.

## Concept-level exceptions to note (per brain's "note any exceptions")
- None that override a concept. This override only re-hues C2's accent and sharpens C1's serif — both still fully satisfy their concepts. Legibility (C12) preserved: graphite is near-black not `#000`, brass on graphite passes contrast for text-sized use; brass reserved for accents/headlue words/numbers, body stays `--ink`.

## Stack (inherited)
Next.js (App Router) + Razorpay (₹) for checkout · IntersectionObserver + `.reveal.in` for scroll reveals · fonts via `next/font` (Newsreader, Inter Tight, JetBrains Mono).
