# SHAPE · Build spec — the three remaining Kraft With Kunal pages

> Mode: **BUILD**. Skin: `design-system.project.md` (brass-gold on graphite/obsidian · Newsreader / Inter Tight / JetBrains Mono). Brain: `.claude/design-system.base.md`. Structure library read fresh (Tier-2).
> Flow: **LP → /checkout (pay {{ASSESSMENT_FEE}}) → /book-a-call (calendar) → /thank-you**.
> Rule of the gate: a section earns a component only where its meaning carries a structure. Everything else is clean text. Intensity scales with structural richness, not "make it pop."
> Provenance in tables uses the library's tags: `[EMP]` = `[EMPIRICAL]`, `[SHIP]` = `[SHIPPED]`, `[CUR]` = `[CURATED]`.

All three pages inherit the LP shell verbatim: `<Nav>` (or its brand lockup), the `--canvas` graphite stage, `<Reveal>` (fail-open), `<Colophon>`, and every token in `globals.css`. No new colors, no new fonts. These pages are **transaction / confirmation surfaces** — calm, one focal action each, no competing CTAs.

---

## PAGE 1 · /checkout  (R11 order-summary — §10 Transaction / §3 Accumulation)

The whole page is one component-worthy shape: *enter details → see the itemized total → pay*. It maps 1:1 to R11. Structureless supporting copy (deck, legal) stays text.

| Section | Role (NO-BRAINER) | Recipe + concepts | Component (reuse / new) | Kraft skin tokens / effects | Notes |
|---|---|---|---|---|---|
| Top trust strip | reassure (pre-click) | R11, C10, C1 | **new `<TrustStrip>`** → `.trust-strip` | mono `--ink-3` uppercase, dot separators; brass lock glyph (`GuaranteeSeal`-family, C11); hairline `--hair` bottom rule | "Secure checkout · 256-bit SSL · {{ASSESSMENT_FEE}} fully refundable". Non-gated page-chrome. Full-width above masthead. |
| Masthead | offer framing | R1, C9, C13 | reuse `<Section>` + `<EyebrowPill>` + `.display` + `.deck` + `<Lit>` | eyebrow pill (brass ring); one lit word (`.lit`) in the headline; deck ≤620px `--ink-2` | Text, no structure of its own. Headline disarms ("Secure your assessment slot"), deck restates it's an application not enrolment. |
| Two-column body — LEFT: Your details | capture (frictionless) | R11, C9 numbered, C13 | **new `<FormField>`** rows inside a `.co-details` panel; a numbered "01 · Your details" step label | fields on `--canvas-2` inset, `--hair` borders, focus ring `color-mix(--accent 40%)`; mono field labels `--ink-3` | Fields: First / Last / Email / Phone (with country) / City. **Display-only for now** (no gateway wired) — inputs render + validate visually; submit is a no-op that routes to `/book-a-call` until Razorpay lands. Note in code. |
| Two-column body — RIGHT: Order summary | offer / value-moment | **R11 + R5 ledger**, C3, C9, C8 | **new `<OrderSummary>`** → `.co-summary` (built on the `.ledger` grid primitive) | one line item "Assessment with Kunal"; **Total due today = {{ASSESSMENT_FEE}} as the lit value-moment** (`.lit` + accent wash row per C3); ledger rules `--hair` | **No program price, no strike** — the fee is the only number, so it's the single lit figure (§4 single-lit-number folded into the ledger's total row). Do NOT invent a struck anchor (honesty / would be fake). Library: order-summary checkout `[EMP]` dfy `.co-*`. |
| Payment-method tiles | reassure / erase-cost | R11, **C12** third-party marks | **new** `.pay-tiles` / `.method-tile` | colored marks (UPI / Visa / Mastercard / Razorpay) on **light tiles** — never recolored to mono; tiles sit on the dark stage | C12 exactly: brand frames the marks, doesn't restyle them. Display-only chips for now. |
| Pay button + risk-reversal | CTA (Rush+Reassure) | R3, C2, C10 | reuse `.cta-big` **stretched full-width** + `.cta-micro`; guarantee microline | breathing brass pill (the page's ONE breathing instance); first-person label **with the fee in it** | Label: "Pay {{ASSESSMENT_FEE}} & pick my time". Micro: "Fully refunded if Kunal decides you're not a fit." One focal action — no second button. |
| Legal microcopy | reassure | C10, C13 | text (`.co-legal`, mono `--ink-3`) | — | No structure → text. "You're paying for a review of your situation, not enrolment." |

**Mobile stacking (decision):** the two columns stack to one. **Order-summary goes ABOVE the details form on mobile** — the lit **Total** is the value-moment (C3) and should be the first thing thumbed past, confirming *what* and *how much* before the person invests keystrokes. Pay button + microline stay pinned at the bottom of the flow. On desktop: details LEFT (≈1.1fr), summary RIGHT (≈0.9fr, sticky within the column).

**Fail-open / reduced-motion:** all reveals via `<Reveal>` (already fail-open). The pay button's `ctaBreath`/`ctaShine` already respect `prefers-reduced-motion` (existing CSS). No JS-gated content — the form and summary are server-rendered visible.

---

## PAGE 2 · /book-a-call  (calendar surface — §1 Sequence, §11 Urgency, §5 FAQ, C12 embed)

| Section | Role (NO-BRAINER) | Recipe + concepts | Component (reuse / new) | Kraft skin tokens / effects | Notes |
|---|---|---|---|---|---|
| 2-step progress strip | reassure (momentum) | C6/C7, C9, C1 | **new `<ProgressSteps>`** → `.progress-steps` / `.pstep` | step 1 "Pay" **done** = brass tick (`Check` in a filled `--accent` disc); step 2 "Book" = active, `--ink` ring; connector hairline `--hair`; all mono uppercase, calm | Two nodes only, no numbers-race. Pure page-chrome (not a gated section). *Library gap: no dedicated "progress stepper" entry — flag for LEARN (see gaps).* |
| Masthead | offer / next-step | R1, C9 | reuse `<Section>` + `<EyebrowPill>` + `.display` + `<Lit>` + `.deck` | lit word in headline ("Pick your **time** with Kunal") | Text. |
| Pick-a-slot card (calendar) | CTA / focal action | **R12 + C12** (embed framing) | **new `<CalendarEmbed>`** → `.cal-frame` + `.cal-loading` | calendar on a **neutral light inset panel** (C12 — brand frames, doesn't restyle Calendly); branded loading placeholder (brass spinner + "Loading your calendar…") until the iframe paints | Env **`NEXT_PUBLIC_CALENDLY_URL`**: when set → render `<iframe>`; when empty → the branded placeholder stays (fail-open, no blank hole). This is the page's single focal object. |
| Trust row | reassure | R2 trust-row, C10, C11 | reuse `.trust-row` (3 items) | mono `--ink-3`, hairline top rule | 3 specific facts: "Coached by Kunal himself · Straight yes/no · Fully refundable". Text-as-row, not gated. |
| "What your assessment covers" | mechanism / expectation-set | **§1 R9 numbered — LIGHT (cards, NOT the spine)**, C9, C3, C7 | **new `<NumberedCards>`** → `.ncards` / `.ncard` (3-up, staggered reveal) | big brass ordinals (`.lit`/`--accent` glow, C3); mono micro-label per card; `--canvas-2` cards, `--hair` borders; stagger via `data-delay` | Library: **"Numbered cards in a flow" `[EMP]` (dfy `.flow/.fstep`)** — deliberately the *lighter* §1 option. **Varies from the LP's heavy `.spine`** (journey scroll-spine already spent on the LP, per §1 vary-vs-neighbor + C2 scarcity). Three cards: what he reviews / what you'll walk away knowing / the honest verdict. |
| Loss-aversion urgency beat + CTA | Rush (why-now, restrained) | **§11 R10 — restrained**, C10 | reuse `.capacity` line (live dot) + `<CTAButton>`/`.cta-big` scrolling to the calendar | brass live dot `.capacity`; **no countdown, no red** — names the real number (`site.monthlySlots`) | Library: announcement/urgency `[EMP]` but honoring the skin's calm voice — reuse the LP's existing `.capacity` treatment, not a loud bar. Copy: "Only {N} assessments open each month — slots don't roll over." CTA nudges up to the calendar. |
| FAQ (2 items) | objection | **§5 R4**, C6, C8, C9 | reuse `.faq` (native `<details>`) | open = accent wash + left stripe + icon rotate-fill (existing); `Q.01/Q.02` ordinals; top one "Most asked" pill + open by default | Two objections only ("What if I can't make it?" / "Is the fee refundable?"). `[EMP]` ruled FAQ. Native `<details>` = fail-open by construction. |
| Final CTA band | CTA | R3, C2 | reuse the `FinalCTA` pattern (`.stage` + `<CTAButton>`) | brass breathing pill; anchors to the calendar, not a new checkout | One calm closing nudge back to the slot picker. |
| Footer | — | — | reuse `<Colophon>` | — | — |

**Mobile stacking:** progress strip stays full-width (labels persist, connector shrinks). Calendar card goes full-width (Calendly is responsive inside the light inset). `.ncards` collapses 3-up → 1-col stack (staggered reveal preserved). Trust row wraps.

**Fail-open / reduced-motion:** `<CalendarEmbed>` renders the branded placeholder **as the default server state** — the iframe is an enhancement; if `NEXT_PUBLIC_CALENDLY_URL` is unset or JS/network fails, the placeholder + a plain mailto/booking fallback line stay visible (no blank hole, per C12). Spinner keyframe gated behind `prefers-reduced-motion` (static "Loading…" when reduced). All reveals fail-open via `<Reveal>`. Native `<details>` needs no JS.

---

## PAGE 3 · /thank-you  (R12 confirmation — §9 Confirmation / Next-steps)

Calm closure. Per R12: **no new primary CTA** competing with the action just completed. The lit seal fills the visual space a hero/video would occupy — never a gap.

| Section | Role (NO-BRAINER) | Recipe + concepts | Component (reuse / new) | Kraft skin tokens / effects | Notes |
|---|---|---|---|---|---|
| Success seal + confirmed pill | reassure (post-action) | **R12**, C3, C11 | **new `<SuccessSeal>`** (extends `GuaranteeSeal` icon) + reuse `<EyebrowPill>` | brass seal with a **lit glow disc** (C3 gradient + `drop-shadow`); pill "Booking confirmed" | Seal is the single lit focal (fills the hero space, R12). Extend the existing `GuaranteeSeal` SVG — don't invent a new icon family (C11). |
| Headline + bridge | reassure | R1, C9, C10 | reuse `.display` + `<Lit>` + one-line deck | lit word ("Your assessment is **confirmed**") | Text — one reassurance bridge line into the checklists. No structure. |
| "What we'll cover" checklist (~5) | expectation-set (cut no-shows) | **§1 call-agenda ledger `[EMP]`** (sreshtha), C9, C11 | **new `<Checklist variant="check">`** → `.checklist` / `.check-row` | hairline `--hair` rows (no boxes); **brass check** (`Check` icon, `--accent`) per row; mono nothing-fancy | ~5 items: what Kunal reviews on the call. Ruled ledger, not a bullet stack (¬C9 avoided). |
| "Before we speak" prep (~4) | reduce no-shows | **§9 quick-prep numbered `[EMP]`** (deepali), C9, C3 | reuse `<Checklist variant="number">` (same component, numbered ordinals) | leading-zero brass ordinals (`--accent`) instead of checks — **varies the icon from the section above** (§6 vary-vs-neighbor logic) | ~4 prep items. Same primitive, different marker, so the two adjacent checklists don't read identically. |
| Add-to-calendar (optional) | reassure | R12, C10 | reuse `.btn--ghost` (NOT `.cta-big`) | ghost button, `--hair` border, no breath | Optional `.ics` / Google-cal affordance. Deliberately a **quiet ghost** button — R12 forbids a new loud primary CTA. |
| Calm footer | — | — | reuse `<Colophon>` | — | No competing CTA. |

**Mobile stacking:** single column throughout (seal → headline → checklist → prep → ghost button). Checklists are already single-column rows.

**Fail-open / reduced-motion:** the seal's glow-pulse animation gated behind `prefers-reduced-motion` (static lit seal when reduced). All content server-rendered visible; reveals via `<Reveal>`. Add-to-calendar is a real `href` (no JS dependency for the link itself).

---

## Component & route inventory

### New routes (App Router — one `page.tsx` each)
- `web/src/app/checkout/page.tsx`  → `/checkout`
- `web/src/app/book-a-call/page.tsx`  → `/book-a-call`
- `web/src/app/thank-you/page.tsx`  → `/thank-you`

> Note (from `web/AGENTS.md`): this is a modified Next.js — read `node_modules/next/dist/docs/` before writing route/page code; don't assume conventions from training.

### New shared components
| Component | File | Used by | Notes |
|---|---|---|---|
| `<TrustStrip>` | `components/TrustStrip.tsx` | checkout | mono secure/SSL/refund strip + brass lock glyph |
| `<FormField>` | `components/FormField.tsx` | checkout | labeled input row; **display-only** (no gateway yet) |
| `<OrderSummary>` | `components/OrderSummary.tsx` | checkout | R11 ledger; single line item; **lit Total** = `site.assessmentFee` |
| `<ProgressSteps>` | `components/ProgressSteps.tsx` | book-a-call | 2-step Pay ✓ → Book |
| `<CalendarEmbed>` | `components/CalendarEmbed.tsx` | book-a-call | `"use client"`; iframe when env set, branded placeholder otherwise |
| `<NumberedCards>` | `components/NumberedCards.tsx` | book-a-call | 3-up light R9 numbered cards, staggered |
| `<Checklist>` | `components/Checklist.tsx` | thank-you | `variant: "check" | "number"` — one primitive, two markers |
| `<SuccessSeal>` | `components/SuccessSeal.tsx` | thank-you | extends `GuaranteeSeal` icon + C3 glow |

### Reused as-is (no changes)
`<Section>`, `<EyebrowPill>`, `<Lit>`, `<CTAButton>` / `.cta-big`, `<Reveal>`, `<Colophon>`, `Check`/`Arrow`/`GuaranteeSeal` icons, and classes `.wrap .section .section--alt .stage .display .deck .eyebrow .ledger .trust-row .faq .capacity .btn .btn--ghost .mono .measure`.

### New CSS to add to `globals.css` (skin-consistent, tokens only)
`.trust-strip` · `.co-grid` / `.co-details` / `.co-summary` / `.co-total` · `.form-field` · `.pay-tiles` / `.method-tile` · `.progress-steps` / `.pstep` / `.pstep.done` · `.cal-frame` / `.cal-loading` · `.ncards` / `.ncard` / `.ncard-num` · `.checklist` / `.check-row` / `.check-mk` · `.success-seal`. All use existing `--canvas/--canvas-2/--hair/--accent/--ink*/--brass-*` tokens and the `--ease-*` curves — no new hues.

### New env vars
| Var | Purpose | Fallback behavior |
|---|---|---|
| `NEXT_PUBLIC_CALENDLY_URL` | book-a-call embed src | unset → branded `.cal-loading` placeholder + fallback booking line (fail-open) |
| (existing) `NEXT_PUBLIC_ASSESSMENT_FEE` | checkout Total + pay label | already in `site.ts` (`site.assessmentFee`) |
| (existing) `NEXT_PUBLIC_MONTHLY_ASSESSMENT_SLOTS` | urgency beat number | already in `site.ts` (`site.monthlySlots`) |

Checkout form is **display-only** for this build (no `NEXT_PUBLIC` gateway var yet); the submit handler routes to `/book-a-call` as a stand-in until Razorpay is wired. Add `site.bookUrl = "/book-a-call"` and `site.thankYouUrl = "/thank-you"` to `site.ts` alongside the existing `checkoutUrl`.

---

## Global honesty / craft notes
- **No fabricated anchor price** on checkout. There is one number (the fee); it is the lit Total. Inventing a struck "program value" to dramatize a discount would be the design equivalent of a fabricated claim (¬C10) — omitted deliberately.
- **Two adjacent structured beats vary their treatment:** book-a-call's numbered *cards* (light §1) deliberately differ from the LP's heavy journey *spine*; thank-you's two checklists differ by marker (check vs ordinal). No option is reused next to its sibling.
- **Every embed is framed, not restyled** (C12): Calendly on a light inset, payment marks on light tiles.
- **All three pages: one focal action, no competing CTAs** — checkout = pay; book = pick a slot; thank-you = *nothing* (R12), only a quiet ghost add-to-calendar.

## Gaps to flag for LEARN (curation)
1. **Progress stepper** (the Pay ✓ → Book 2-step strip) has **no dedicated entry** in the structure library. It's light page-chrome adjacent to §1 Sequence / R9, but distinct (a state-of-flow indicator, not content steps). Recommend filing it as a new **Weld** ("Checkout/booking progress strip") once `<ProgressSteps>` ships — tag `[SHIPPED]` until the funnel is live. Built honestly as a simple 2-node strip, not a hallucinated effect.
2. **Add-to-calendar affordance** (`.ics`/Google) is a small confirmation weld not currently catalogued under §9; candidate LEARN deposit after it ships.
