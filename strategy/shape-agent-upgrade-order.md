# Change-Order — Upgrade the shape + design-system agents (from the Kraft build)

**For:** the Claude Code agent running inside the forked `claude-systems` repo
(github.com/ManavLohia945/claude-systems) — **make all edits on the `update` branch.**

**Why this exists.** The `shape` agent's *first* output (after `no-brainer` supplies copy)
currently lands ~70%. Building the "Kraft With Kunal" VSL funnel surfaced dozens of UI/UX
corrections — the overwhelming majority were **mobile breakages** and "this looks average,"
plus a handful of pure **framework bugs**. This document distills every one of those
iterations into concrete edits, **routed to the correct file**, so the *next* first output
starts at ~90%.

**How to apply.** Each entry says *which file, which section,* and gives a **paste-ready
block** in that file's own voice. Keep existing numbering and voice — **append, don't
renumber** (the next free concept id is **C14**). Files are referenced repo-relative:

| Layer | File (repo-relative) | What lives here |
|---|---|---|
| Agent | `agents/atul/shape.md` | S.H.A.P.E. formula, craft rules, LEARN loop |
| Tier 2 — vocabulary (GROWS) | `refs/atul/shape/structure-library.md` | 13 category → component options + Append-log |
| Tier 1 — brain (stable) | `systems/atul/design-system.base.md` | Concepts C1–C13, Recipes R1–R12, anti-slop, checklist |
| Layer 3 — skin | `systems/atul/design-system.skin.tgo-wellness.md` | Tokens + literal CSS |

> If your fork's folder segment isn't `atul/`, adjust that segment only; the filenames and
> section names are the same. Precedence is unchanged: **a base concept beats a skin value.**

**Routing legend** (used below): `[BASE-C]` new/edited concept · `[BASE-R]` recipe ·
`[BASE-AS]` anti-slop · `[BASE-CHK]` checklist · `[LIB]` structure-library option + Append-log ·
`[SHAPE]` agent craft · `[SKIN]` tokens/CSS · `[COPY]` no-brainer (noted, not applied here).

---

## 1 · THE #1 UPGRADE — Responsive is a first-class state  `[BASE-C] [BASE-AS] [BASE-CHK] [SKIN]`

**Root finding:** the brain has **no responsive/mobile doctrine** — no overflow guard, no
mobile-first stacking rule, no object-fit/no-crop rule, no progressive-disclosure or
mobile-alignment rule. This single gap caused most of the iteration ledger in §6. Fix it at
the principle level so it stops recurring across projects.

### 1a. Add a new concept — `systems/atul/design-system.base.md`, in **`# LAYER 1 — Concepts`**, appended after C13

```
**C14 · Responsive is a first-class state, not an afterthought.** Every section is authored
mobile-first: it must read, stack and breathe on a 360–390px screen *before* it is decorated
for desktop. The small screen is the default composition; the wide screen is the enhancement.
*Why:* most funnel traffic is mobile; a section that only "works" at 1440 is broken for the
majority. Desktop-first layouts leak — horizontal scroll, collapsed media, crammed rows —
exactly where they're least forgiven.
*Rules (skin-agnostic):*
- **No horizontal overflow, ever.** `scrollWidth === innerWidth` at every breakpoint. Any
  grid/flex child that can hold long content gets `min-width:0`; wide media (tables, code,
  diagrams) scrolls inside its own `overflow-x:auto` box — the page body never does.
- **Stacking follows meaning; DOM order IS the mobile order.** When columns collapse to one,
  the reader gets source order — author that order to be correct on mobile (a summary that
  must lead goes first in the DOM, not repositioned by CSS `order` that fights it).
- **Supplied media is shown whole, never sliced by the frame.** For any asset the client
  provides (a designed thumbnail, a client's vertical video), fit the WHOLE frame in —
  prefer `object-fit:contain` on a toned backdrop over `cover` that guesses the crop. When a
  still is needed and none is supplied, derive one from the media itself (a seeked video
  frame) rather than leaving it blank.
- **Progressive disclosure on small screens.** Dense structures (a sticky bar, an order
  ledger, a trust row) shed detail gracefully as width drops — collapse to tap-to-expand,
  drop a tag, keep the essential label + action — never crammed, never clipped.
- **Text alignment is intentional per breakpoint.** Body copy is left-aligned for reading;
  centering is a deliberate choice for short focal lines, not a mobile default that turns
  paragraphs into ragged blocks.
- **Tap targets ≥ 44px; the primary action stays thumb-reachable.**
*Trap (cost real iterations):* a grid/flex child whose only content is an absolutely-
positioned fill-image (e.g. Next `<Image fill>`) COLLAPSES to ~0px if centered with
`margin:0 auto` — auto margins shrink-wrap a box with no in-flow content. Center such items
with `justify-self` + an explicit width, never auto margins.
*Seen:* Kraft (checkout → single column, summary-above-form on mobile; About portrait
un-collapsed via justify-self; VSL + testimonial thumbnails switched to contain; infographic
beats re-stacked with a framed media card + eyebrow).
```

### 1b. Add its inversion — same file, **`# Anti-slop`** list (append as item 15)

```
15. **¬C14** — desktop-first layouts that only work at 1440; horizontal scroll on the page
body; client media sliced by a fixed-aspect frame (`cover` on supplied assets); columns that
reflow into the wrong reading order on mobile; a grid item collapsed to 0px; crammed mobile
bars; paragraphs centered on phones.
```

### 1c. Add its checklist line — same file, **`# Self-review checklist`** (append)

```
- [ ] **C14** mobile-first: zero horizontal overflow at 360/390px; correct stack order;
  supplied media shown whole (no crop); dense rows disclose progressively; body copy left-aligned?
```

### 1d. Concrete breakpoint values + safety CSS — `systems/atul/design-system.skin.tgo-wellness.md`

Append to the end of **`## Tokens (OKLCH)`** (as a documented comment — CSS vars can't be used
inside `@media`, so these are the canonical values every section uses):

```
/* Responsive breakpoints (canonical; the brain's C14 is the principle, these are the values)
   ≤400px  micro phones — single-column everything, drop non-essential tags
   ≤520px  small        — form field-rows → 1 col
   ≤700px  2-up grids   → 1 col
   ≤820px  the primary desktop→mobile flip: side-by-side → stacked
   Guarantee at EVERY width: scrollWidth === innerWidth. */
```

Append to **`## Component CSS`** two reusable safety utilities:

```
/* C14 overflow-safety: let grid/flex children shrink below their content instead of
   forcing the page to scroll sideways. Apply to any multi-column container's children. */
.min0 > * { min-width: 0; }

/* C14 whole-media: show client-supplied media complete on a toned backdrop, never cropped. */
.media-contain { object-fit: contain; background: var(--stage-3, #0d0e11); }
```

---

## 2 · Motion / reveal hardening  `[BASE-C]`

C7 already mandates fail-open reveals, yet the *implementation* kept getting rebuilt wrong
(content stuck blank on fast scroll / anchor jumps). Give C7 a concrete recipe.

**Edit** `systems/atul/design-system.base.md`, **`# LAYER 1 — Concepts`**, the **C7** entry —
append these two lines to it:

```
*Fail-open, concretely:* the element renders VISIBLE server-side; JS only "arms" the hidden
state after mount, then reveals on the FIRST of — IntersectionObserver intersecting, a scroll
handler finding it above the fold, OR a rAF check for content already scrolled past (anchor
jumps / fast scroll / restored scroll position). Once revealed, disconnect. Never gate content
behind a bare `opacity:0` waiting on a class a slow/absent observer may never add; on
reduced-motion, skip arming entirely and leave everything visible.
*Craft:* drive reveal with `translate`/`scale` and hover with `transform` — a single shared
`transform` makes them fight and flicker.
```

---

## 3 · Framework / implementation pitfalls  `[SHAPE]`  (build craft — NOT the design brain)

These are React/Next.js traps that repeatedly turned a *correct design* into a *broken first
build*. They aren't design principles, so they go on the agent, not the brain.

**Edit** `agents/atul/shape.md`, under **`## Craft rules`**, add a subsection:

```
### Build-time gotchas (framework, not design — but they cost first-output quality)
When executing a build, honor these or a correct design ships broken:
- **`element.scrollLeft`/`scrollTop` round to integers.** An auto-scroll/marquee that adds
  < 1px per frame never moves (it rounds back to the same int). Keep a float accumulator
  (`let pos = el.scrollLeft; pos += SPEED; el.scrollLeft = pos`) and re-sync `pos = el.scrollLeft`
  while paused so manual scroll still works.
- **Never `setState` or read a ref's `.current` during render** (Next 16 react-hooks lints:
  "Cannot update ref during render", "Cannot access refs during render", "Avoid calling
  setState within an effect"). Compute derived values inline as consts; sync refs inside
  `useEffect`, not the body; make an embed `src` a static const rather than setStating it in
  an effect.
- **rAF loops must pause on `document.hidden`** (and on hover/touch/focus for user-driven
  motion), or they burn cycles and desync in background tabs.
- **A grid/flex item whose only child is an absolutely-positioned fill-image collapses to
  ~0px under `margin:auto`.** Center with `justify-self` + explicit width. (See brain C14.)
- **Client-supplied media has unknown aspect.** Default to `object-fit:contain` on a toned
  backdrop; use `cover` only when you control the asset's aspect and intend the crop.
```

---

## 4 · Component vocabulary upgrades  `[LIB]`

**Edit** `refs/atul/shape/structure-library.md` — add these options under the named
categories (keep the `name — interaction — why it fits — weight — instance/recipe —
[provenance]` format), then add the Append-log line at the bottom.

**Under `## 10 · TRANSACTION`:**
```
- Collapsed order-summary bar above the form — a single tap-to-expand bar (cart glyph ·
  "Order summary" · total · chevron) sits ABOVE the details form; expands (grid-rows
  0fr→1fr) to reveal itemized inclusions, the lit total, and payment-method tiles. Single
  column at all widths; the summary leads in the DOM so it's read first on mobile. — why it
  fits: on a phone the buyer wants "what am I paying + how much" before touching fields,
  without a tall ledger shoving the form off-screen — medium — Kraft /checkout
  OrderSummaryBar; R11 mobile-first variant — [SHIPPED]
```

**Under `## 6 · PROOF / TESTIMONIAL` (or `## 7 · BREADTH / RANGE`):**
```
- Continuous transformation marquee — a horizontal track that drifts slowly and endlessly
  (slides duplicated once; wrap at half-width for a seamless loop), stays hand-scrollable/
  swipeable, keeps prev/next arrows, and pauses on hover/touch/focus then resumes; honors
  reduced-motion (no drift; manual + arrows still work). — why it fits: a wall of before/after
  proof reads as "many, ongoing" when it moves; the motion itself signals volume — medium —
  Kraft BeforeAfterCarousel; R7 variant — [SHIPPED]
  (impl: scrollLeft rounds to int → drive the drift from a float accumulator, not += 0.4 on scrollLeft.)
```

**Under `## 8 · FOCAL-MEDIA / HOOK`:**
```
- Editorial infographic beat — a copy column paired with a framed, softly-glowing media card
  (image right on desktop, image ABOVE copy on mobile), led by a mono eyebrow tag; fail-open
  to clean centered text if the image is missing. — why it fits: a text-heavy persuasion beat
  gains a visual anchor without becoming a diagram; the frame + eyebrow make a bare supplied
  image feel authored — light→medium — Kraft InfographicBeat (Problem/Stakes/Plan); expresses
  C8/C13 — [SHIPPED]
- Whole-media thumbnail (no crop) + video-frame poster — focal media shown COMPLETE via
  object-fit:contain on a toned backdrop (never sliced by the frame); when no poster still is
  supplied, derive it from the video itself with a seeked `#t=` frame rather than a blank
  tile. — why it fits: client thumbnails and vertical client videos have unknown aspect;
  cropping decapitates faces and slices designed text — light — Kraft VSLFrame +
  VideoTestimonials; cross-links C14 — [SHIPPED]
```

**Append to `## Append-log (LEARN deposits)`:**
```
- 2026-07-22 — Kraft With Kunal VSL funnel (business@trainergoesonline.com). Filed [SHIPPED]:
  collapsed mobile-first checkout summary (§10), continuous transformation marquee (§6/§7),
  editorial infographic beat + whole-media/no-crop thumbnail (§8). Surfaced the responsive-
  doctrine gap → new brain concept C14 (+ ¬C14 + checklist); hardened C7 fail-open with a
  concrete recipe; added build-time gotchas to shape.md craft. Upgrade to [EMPIRICAL] once
  the funnel is live.
```

---

## 5 · Recipe refinements  `[BASE-R]`

**Edit** `systems/atul/design-system.base.md`, **`# LAYER 2 — Recipes`**.

**Replace the `### R11 · Checkout / order-summary surface` entry with (mobile-first):**
```
### R11 · Checkout / order-summary surface
*Expresses:* C9, C3, C5, C12, **C14**.
*Anatomy:* a quiet trust strip (secure · encrypted · not-a-sales-call). Then, MOBILE-FIRST, a
SINGLE column: a **collapsed order-summary bar above the form** (tap to expand → itemized
inclusions, struck→now line items where honest, the **Total as the lit value-moment** per C3,
+ payment-method tiles). Below it the **details form**; the pay button is the breathing
primary CTA. On wide screens it MAY relax into two columns (form ↔ summary), but on mobile the
summary must never force the buyer to scroll past a tall ledger to reach the fields. Legal
microcopy once, at the very bottom.
*Avoid:* a desktop-first two-column grid that overflows or buries the form on mobile; a
fabricated "total value / % off" stack when the offer isn't actually discounted; showing the
full program price on a deposit/assessment checkout.
*Skin hook:* dark spotlight stage (or the skin canvas) with local `--ink` re-theme; total +
pay button = `--accent`; method tiles = white.
```

**Append to the `### R7 · Proof / testimonial card` entry:**
```
Candidate variant (continuous marquee): for a SET of transformation cards, a slowly-drifting
seamless-loop track (structure-library §6/§7) reads as "many, ongoing." Promote to a named
variant if a second project reuses it.
Media note (C14): testimonial video posters and client thumbnails are shown WHOLE
(object-fit:contain), never cropped by the card; derive a still from a `#t=` video frame when
none is supplied.
```

---

## 6 · Full iteration ledger (the raw evidence)

Every correction from the Kraft build, with root cause and route. This is what "70% → 90%"
looks like in practice — the §1–§5 edits are designed to preempt these.

| # | Page / section | Device | What broke / looked average | Root cause | Route |
|---|---|---|---|---|---|
| 1 | LP nav / header | mobile | brand wrapped to 2 lines; ghost CTA overflowed <600px | no mobile stacking/disclosure rule | `[BASE-C C14]` |
| 2 | LP nav | mobile | brand not centered; 3 trust points on 3 lines; no icons | no trust-row disclosure pattern | `[BASE-C C14]` `[LIB §8/weld]` |
| 3 | Mechanism journey-spine | scroll | rail didn't pass through dot centers | recipe geometry underspecified | `[BASE-R R9]` `[LIB §1]` |
| 4 | Mechanism journey-spine | fast scroll | phase text vanished / lines broke | reveal not fail-open | `[BASE-C C7]` |
| 5 | Reveal primitive (global) | fast scroll / anchor | blank mid-sections | reveal not fail-open | `[BASE-C C7]` |
| 6 | Offer ledger | scroll | felt static; wanted staggered per-row reveal | motion vocabulary | `[LIB §3/§5]` |
| 7 | "Working with Kunal is" | all | wanted scroll+hover reveal (felt average) | vocabulary + translate-vs-transform craft | `[LIB §7]` `[BASE-C C7]` |
| 8 | Checkout | mobile | horizontal overflow (grid min-width) | no overflow guard | `[BASE-C C14]` `[SKIN .min0]` |
| 9 | Checkout | mobile | summary order, methods as text, stray copy, headline wrap | R11 anatomy not mobile-first | `[BASE-R R11]` |
| 10 | Checkout (rebuild) | all | collapsible summary above form (Palak hierarchy) | R11 mobile-first + new option | `[BASE-R R11]` `[LIB §10]` |
| 11 | Checkout pay button | all | "₹299& unlock" missing space | build typo | `[SHAPE]` |
| 12 | About Kunal | mobile | portrait missing (collapsed to 2px) | grid margin:auto + Image fill collapse | `[BASE-C C14 trap]` `[SHAPE]` |
| 13 | Infographic beats (§2/§3/§4) | mobile | "just image + text below," plain | no framed-media/eyebrow pattern | `[LIB §8]` `[BASE-C C14]` |
| 14 | VSL hero thumbnail | all | edges cut (cover; 4:3 image in 16:9 frame) | no no-crop media doctrine | `[BASE-C C14]` `[LIB §8]` |
| 15 | Video-testimonial thumbnails | all | heads cropped (cover on portrait video) | same | `[BASE-C C14]` `[LIB §8]` |
| 16 | Video testimonials | all | needed real per-video stills without ffmpeg | video-frame `#t=` poster | `[LIB §8]` |
| 17 | Before/after carousel | all | not moving; wanted continuous slow marquee + arrows | vocabulary + scrollLeft int-rounding | `[LIB §6/§7]` `[SHAPE]` |
| 18 | CalendarEmbed | build | setState-in-effect lint; static-src fix | framework | `[SHAPE]` |
| 19 | Payment methods | all | as webp logos on light tiles, not text | reinforces existing C12 | `[BASE-C C12]` (existing) |
| 20 | Sticky CTA | mobile | long label hidden <640px | progressive disclosure | `[BASE-C C14]` `[LIB §8]` |
| 21 | Hero VSL poster | all | dim placeholder vs real thumbnail; scrim/brightness | skin treatment | `[SKIN]` |
| 22 | Final CTA / various | — | copy too long | copy | `[COPY]` no-brainer |

---

## 7 · Priority & expected impact (apply in this order)

1. **C14 responsive doctrine** (§1) — `[BASE]` `[SKIN]`. Preempts ledger rows 1,2,8,9,12,13,14,15,20. *Biggest single lever.*
2. **C7 fail-open concrete recipe** (§2) — `[BASE]`. Preempts rows 4,5,7.
3. **shape.md build-time gotchas** (§3) — `[SHAPE]`. Preempts rows 11,12,17,18.
4. **R11 mobile-first + Tier-2 options** (§4,§5) — `[BASE-R]` `[LIB]`. Preempts rows 3,6,9,10,13,16,17.

Done well, a fresh funnel's *first* shape output should already stack cleanly on mobile, show
supplied media whole, reveal reliably, and assemble a mobile-first checkout — the ~90% target.

*Not applied here:* `[COPY]` items belong to the `no-brainer` agent, not shape/design.
