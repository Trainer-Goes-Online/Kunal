# SHAPE Plan — Kraft With Kunal (High-Ticket Application Funnel)

> Mode: **BUILD**. Run: S.H.A.P.E. per section across 3 assets. Skin: dark/premium/executive (luxury-car), sans-serif, warm lighting for proof + clinical white for medical markers, restrained motion. Downstream: Next.js (App Router) + Tailwind.
>
> **Grounding note (honesty):** The Tier-1 design brain (`/workspace/.claude/design-system.base.md`) **does not exist in this workspace.** So recipe/concept references below (R2, R4, R5, R9, R12, C3, C7…) are cited from the Tier-2 library entries that name them, and all *execution detail* (exact tokens, motion curves, DOM) is **inferred by SHAPE and must be finalized by the design owner** — flagged inline as `[infer]`. Component *choices* and provenance are grounded in the live library.

---

## 1 · One-line verdict

**This funnel is mostly structured prose that earns exactly five real components — the four-phase Protocol is the textbook journey-spine case, the who-it's-for is a clean fit-check, the "even if" block is a FAQ ledger, the call-agenda and prep beats are numbered ledgers — while the agitate, blame-relief and reassurance beats are load-bearing *voice* that must stay text. Do not decorate the emotional beats; the video already carries the heat.**

Structured → component: **9 of 22 sections.** The rest are text (correct — forcing structure on the agitate/blame/reassurance prose would be slop and would flatten the calm executive register that is the whole high-ticket posture).

---

## 2 · Proposed skin tokens  ⚠️ NEEDS DESIGN-OWNER (Atul) SIGN-OFF — no fixed skin exists yet

These are sensible defaults for a dark executive/luxury-car aesthetic with the required warm-proof / clinical-marker split. **All values are `[infer]` — treat as a starting proposal, not locked.**

### Color
| Token | Value (proposed) | Use |
|---|---|---|
| `--stage` | `#0A0B0D` (near-black obsidian) | page floor |
| `--stage-2` | `#111318` | raised surfaces / cards |
| `--ink` | `#F2EFEA` (warm off-white) | primary text |
| `--muted` | `#8A9099` (slate) | secondary text, mono labels |
| `--hair` | `rgba(255,255,255,0.08)` | hairline rules, ledger dividers |
| `--warm` | `#C9A24B` (brass/amber gold) | **warm-lighting accent** — proof, testimonial, CTA, lit numbers |
| `--warm-glow` | `rgba(201,162,75,0.18)` | gradient-clip glow on key numbers (C3) |
| `--clinical` | `#E8EDF2` (cold steel-white) | **clinical-lighting accent** — medical markers, blood-work, before→after figures |
| `--clinical-line` | `rgba(232,237,242,0.14)` | marker-strip rules |

> Two-accent system is deliberate and load-bearing: **warm = human proof / money-outcome; clinical/cold = medical evidence.** The skin's job is to keep those two lighting worlds visually distinct. Flag this as a skin decision to file post-build (LEARN §4 below).

### Type (sans-serif only, per skin brief)
| Role | Proposed family | Notes |
|---|---|---|
| Display / headlines | `Archivo` or `Söhne Breit` (tight, confident sans) | `[infer]` — executive weight, not hype-black |
| Body | `Inter` / `Söhne` | calm, high legibility for 35–50 audience |
| Mono micro-labels / ordinals | `JetBrains Mono` / `IBM Plex Mono` | ledger ordinals, phase weeks, "audited" feel |

### Spacing / rhythm / motion
- **8px base grid.** Section vertical padding: mobile `64px`, desktop `120–160px` (calm luxury pacing, lots of air).
- Content max-width: `720px` (prose) / `1080px` (ledgers, grids).
- **Motion (restrained):** reveal-on-scroll = fade + 8px rise, 450–600ms ease-out, stagger ≤80ms. **Every reveal MUST fail-open** (content visible if JS never fires — server-render visible, animate only as progressive enhancement) and honor `prefers-reduced-motion: reduce` (drop transform/opacity animation, show instantly). Per library C7.

---

## 3 · Per-asset section-by-section plan

### ASSET 1 — VSL Landing page

| Section | Role (NO-BRAINER) | Shape | Category | Component (+ provenance) | Intensity | Why |
|---|---|---|---|---|---|---|
| **1.1 Hero** | N + B | **Focal media** (VSL embed) + headline | §8 Focal Media | **VSL frame** — poster + ripple play disc → swaps to `<video>` `[EMPIRICAL · most-recurring]` (R2). Headline/subhead = **text**. CTA = welded button (scarcity tag). | medium | The primary focal object of the page is the VSL. Headline is a single owned line → clean type, not a graphic. Do **not** use Watch-to-Unlock here — gating the button adds friction that fights the calm application posture (flagged: optional only if Atul wants intent-qualification). |
| **1.2 Problem / inner voice** | A (Agitate) | Agitate prose (lived moments) — **no shape** | — | **text** (govind Mirror precedent: agitate prose stays text). *Exception:* the marker line ("Sugar borderline · Fatty liver Grade 2 · BP 140/90 · pre-diabetic") is a genuine 4-item clinical set → light **clinical-marker strip** weld (cold `--clinical` chips, mono). | text (+ light weld) | Forcing a graphic on the four vignettes would decorate the emotional core and steal the video's job. The *markers* are the one real set → a restrained clinical chip row earns the cold-lighting skin. |
| **1.3 It was never discipline** | R (relieve blame — CENTRAL LEVER) | Reframe / stance — **no shape** | — | **text** (govind "why-nothing-held" precedent). The three failed attempts (gym / keto / sealed supplement) stay inline prose. | text | This is load-bearing *voice*. Its power is the "wrong map" reframe, not a layout. Decorating the central lever weakens it. Honesty rule: do not invent a fake before/after timeline here. |
| **1.4 The Protocol — 4 phases** | O (One mechanism) | **Sequence** (4 ordered phases w/ weeks) | §1 Sequence/Process | **Scroll-linked journey spine** `[EMPIRICAL]` (R9 / dfy `.journey`) — the original "wall-of-text process → momentum spine" win. | **heavy** | This IS the journey-spine case: 4 phases × week-ranges × per-phase detail = rich sequence. Momentum + low perceived effort is the section's real job. Richest structure on the page → heaviest treatment. |
| **1.4b Two lengths sub-beat** | O | **Contrast** (both/and — length is the only choice) | §2 Contrast | Light **twin-duration line** — 90-Day Reset (Phases 1–2) vs 6-Month Transformation (all four), "same engine, same coach." *Not* a weighted compare (neither is "recommended"; length is the reader's only variable). | light | It's a both/and, not a decision-to-win, so NOT the §2 weighted two-column. **Library gap** — see LEARN §1. Render as a light paired-label strip, not a pricing table (no price on page). |
| **1.5a Kunal's own file** | I / authority | **Authority** — two-arc credibility (₹50cr business + own 108→71kg transformation) | §12 Authority | **Dual-track balance** `[SHIPPED]` (govind `.auth-dual`) — two lit numbers either side of a divider ("built a ₹50cr business … *then* rebuilt his body with the same discipline"). | medium | Uncopyable both/and authority claim = exactly the dual-track pattern. Warm accent on the business figure, **clinical/cold** on the medical figures (108kg→71, sugar 280→normal). `[confirm figures]` before publish. |
| **1.5b Men like you** | I (light proof) | **Proof-set** (lawyer + banker, before→after numbers) | §6 Proof/Testimonial | **Numbers-first case-file cards** — exhibit-frame shape (mono meta "46 · Lawyer", lit before→after figures) but **rendered without photo** until media is verified. | medium | Deliberately LIGHT (heavy proof reserved for the call). **Honesty gap:** exhibit-frame/video options assume a poster — no verified photos exist yet (`[confirm]`). Render figures-only case files now; drop in posters when real. See LEARN §2. Vary-vs-neighbor respected (this is the only proof block on the page). |
| **1.6 Offer / four costs** | E + O | **Objection/cost-set** (Time · Effort · Risk · Money) | §1 (ruled ledger form) | **Ruled four-cost ledger** — mono cost-label rows (`TIME / EFFORT / RISK / MONEY`) each with the erase, on hairline dividers; reads as an accountable contract. | medium | The four Hormozi value-equation costs are a real labeled set of 4 → structure. **No exact library option for a "cost-erase quadrant"** — closest is the §1/R5 ruled ledger; used that. See LEARN §3. **Money row: no price** (reserved) — render as ROI/cost-of-inaction line. Guarantee (four-week rebuild) = **guarantee-chip weld**, not a row. |
| **1.7 Who it's for / isn't** | N (narrow gate) | **Contrast** (for-you ✓ vs not-for-you ✗) | §2 Contrast | **Honest fit-check** `[SHIPPED]` (saanchi `.fit-grid` — `.yes` / `.no`) | medium | Textbook takeaway-selling contrast; the disqualify column sharpens the yes. Exact pattern match. |
| **1.8 "Even if…" objections** | A (answer via even-if) | **Objection/Q&A set** (4 objections) | §5 Objection/Q&A | **Ruled FAQ ledger** `[EMPIRICAL]` (R4) — `Q.0X` ordinals, hairline rows, top objection "Most asked" open by default. | light–medium | Four objections in fixed order = the FAQ ledger's exact job. Physical/audited, marks the hero objection ("will it work for ME"). |
| **1.9 CTA (Rush + Reassure)** | R (welded) | **Urgency/scarcity** (8 clients/mo capacity) + closing CTA | §11 Urgency + Welds | **Scarcity tag on CTA** `[EMPIRICAL]` (real "8 slots this month" lozenge, live dot, number-only colored) + **Closing-stage background depth** `[SHIPPED]` (clatpossible finale mesh/floor/dot-grid). Kunal quote = **text**. | medium (content) / heavy (background) | Scarcity is REAL (Kunal's calendar) → name the number, never vague. Rush welded to Reassure on one button (guarantee-chip + "honest fit, no hard sell"). Finale earns the most background depth as the page's premium peak. |

**Page-chrome welds (not gated sections):** **Sticky CTA bar** `[EMPIRICAL]` — appears past hero, hides at 1.9; condensed "Book Your Assessment Call" + scarcity tag (no price). Mobile drops the tag.

---

### ASSET 2 — Application / Booking page

| Section | Role | Shape | Category | Component (+ provenance) | Intensity | Why |
|---|---|---|---|---|---|---|
| **2.1 Header** | N + B | Restate WHO + outcome — **no shape** | — | **text** (single lit number on "15–20 kg" via C3 `.em`, warm accent) | text (+ light number weld) | Prose restatement. Only the outcome figure earns a lit-number weld; the rest is calm type. |
| **2.2 Qualification form** | N (takeaway) | **Form / input set** — functional, not a gated meaning-structure | — (form UI) | **Clean multi-field form.** Income-bracket field carries a mono "why we ask" takeaway microline (`--warm` emphasis). NOT a component per the gate — it's UI. | light | A form isn't a structure the gate elevates; build as a clean, well-set form. The *takeaway framing* on the income question is the only design move. `[assumption: hard ₹25L+ gate per config]`. |
| **2.3 What happens on the call** | E (erase call risk) | **Sequence** (3-step call agenda) | §1 Sequence/Process | **Call-agenda ledger** `[EMPIRICAL]` (sreshtha `.agenda-row`) — numbered "here's what we'll cover" rows. | light–medium | Purpose-built for booking pages: sets expectations, cuts no-shows. Reassurance, not hype. Varied from 1.4's spine and 3.3's prep (all §1, three different components ✓). |
| **2.4 Reassurance** | E | Reassurance stance — **no shape** | — | **text** ("no hard sell" / "paid = serious room" reframe stays prose). | text | A stance, not a structure. Honesty: don't force a graphic onto reassurance. |
| **2.5 Calendar** | R (soft rush) | Embed + soft scarcity | §11 Urgency (light) | **Embedded calendar** (Calendly/Cal.com) + light **scarcity microline** ("calendar fills from the top", real capacity). | light | Functional embed. Scarcity stated softly (real 8/mo ceiling), not a countdown. |

---

### ASSET 3 — Confirmation / Thank-you page

| Section | Role | Shape | Category | Component (+ provenance) | Intensity | Why |
|---|---|---|---|---|---|---|
| **3.1 Confirmed** | E (reduce no-show) | **Confirmation / next-steps** | §9 Confirmation | **Success-seal + next-steps ledger** `[EMPIRICAL]` (R12 / dfy `.cb-*`) — lit warm seal (fills the space, never a gap), one-line bridge, add-to-calendar, **no competing CTA**. Pair **event date/timings strip** `[EMPIRICAL]` (deepali) once the booked slot is known. | medium | Calm closure = exactly R12's job. The date strip turns "you're booked" into a concrete commitment. |
| **3.2 Real slot / don't ghost** | E (reduce no-show) | Personal-scarcity reassurance — **no shape** | — | **text** ("1 of only 8, held for you, don't ghost") stays prose — its power is the businessman-to-businessman reciprocity, not a layout. | text | Decorating this weakens the personal appeal. If the booked date/time isn't already on 3.1, attach the light date strip here instead. |
| **3.3 Prep / get the most from call** | B + frame | **Sequence** (3 prep steps) | §9 Confirmation | **Quick-prep numbered steps** `[EMPIRICAL]` (deepali `.ty-*`) — 3 "do this before your call" items. Restated outcome (B) = text w/ lit "15–20 kg". | light | Primes the attendee, reduces no-shows. Different component from 2.3's agenda ledger though both §1/§9 numbered — varied ✓. |
| **3.4 While you wait (re-warm)** | I (light proof) | Light proof re-warm — reference links | §9 / §6 (light) | **Re-warm CTA card** — single card linking to the VSL re-watch + the (verified) lawyer/banker case files. Adapted from §9 community-card `[EMPIRICAL]`. Kunal quote = **text**. | light | Keeps the yes warm without a second heavy proof wall. `[confirm — link only to verifiable cases w/ corrected figures]`. Not adjacent to 1.5 proof and a different component → vary-vs-neighbor satisfied. |

---

## 4 · Structure gaps flagged for LEARN (patterns the library lacks)

1. **Twin-duration / "same-engine, length-is-your-only-choice" strip** (§2 Contrast) — a *both/and* where the reader picks a **length**, not a winner. Not the weighted two-column (nothing is "recommended"), not is/is-not (not a definition), not the dual-track balance (that's authority). A light paired-label duration selector. Used at 1.4b as an untagged inference. **File once built.**
2. **Numbers-only case-file card** (§6 Proof) — a proof card rendered from **before→after figures alone, with NO poster/photo**, honest for the pre-media stage of a high-ticket funnel (photos reserved for the call / not yet verified). Every current §6 option assumes a poster/video. Used at 1.5b. **File as a proof variant** — valuable for any funnel whose heavy proof is reserved.
3. **Four-cost erase-grid / value-equation quadrant** (Hormozi Time·Effort·Risk·Money) — a labeled 4-item cost-erase set. No dedicated library option; approximated with the §1/R5 ruled ledger at 1.6. Recurs in any Hormozi-offer beat → **worth a first-class entry.**
4. **Warm-vs-clinical dual-lighting skin rule** — the two-accent system (warm brass = human/money proof; cold steel-white = medical/marker evidence) is a *skin-level* pattern worth filing once built and Atul-approved, as it will recur in any health/medical high-ticket funnel.

*(All four are honestly flagged, not hallucinated into fragile bespoke effects — per SHAPE honesty rule. Nos. 1–3 were rendered with the nearest honest option and marked untagged/inferred.)*

---

## 5 · Build-order recommendation (Next.js App Router)

1. **Foundation** — Tailwind theme from the §2 tokens (pending Atul sign-off); global layout, fonts (`next/font`), and a shared `<Reveal>` primitive built on IntersectionObserver that **server-renders content visible** (fail-open) and short-circuits on `prefers-reduced-motion`. Lock this behavior first — every component depends on it.
2. **Shared primitives** — `<Section>` (padding rhythm), `<MonoLabel>`, `<LitNumber>` (C3 gradient-clip/glow), `<CTAButton>` (welded scarcity tag + guarantee chip), `<StickyCTA>`, `<MarkerStrip>` (clinical chips).
3. **Landing hero + VSL frame (1.1)** — highest priority, above the fold, primary focal object. Poster → `<video>` swap.
4. **Journey spine (1.4)** — the heaviest component; build early to de-risk the scroll-linked head/node motion (and its reduced-motion fallback: static lit numbered ledger).
5. **Remaining landing components** — fit-check (1.7), FAQ ledger (1.8), four-cost ledger (1.6), dual-track authority (1.5a) + case-file cards (1.5b), then the CTA finale (1.9) with closing-stage background depth. Text beats (1.2/1.3) are trivial and can land any time.
6. **Booking page (Asset 2)** — qualification form (2.2, with validation + the ₹25L gate logic), call-agenda ledger (2.3), calendar embed (2.5).
7. **Confirmation page (Asset 3)** — success-seal + date strip (3.1), prep steps (3.3), re-warm card (3.4).
8. **QA pass** — verify every reveal fails open with JS disabled, every animation respects reduced-motion, and all ledgers/grids stack cleanly on mobile (govind precedent: fixed-column ledgers squeeze on phones — use `minmax`/stack). Confirm **no price anywhere** and all `[confirm]` figures gated behind real verification before launch.
