# MASTER HANDOFF — Kraft With Kunal, parallel section rebuild (SDP-referenced)

**Read this file end-to-end before touching any code.** You are rebuilding **ONE
section** of the Kraft With Kunal landing page to be **pixel-exact to the SDP
reference**, on the **existing brass-gold `.sdp-root` foundation** already in this
repo. Many sessions run in parallel, one per section, each owning a disjoint set of
files. The only variable you receive is a **section number**.

> **This is a REBUILD ON AN EXISTING FOUNDATION, not a from-scratch build.** The repo
> already has: (a) a verbatim SDP component-CSS port re-hued to brass under `.sdp-root`
> in `src/app/globals.css` (~L615+, from `design-system.skin.sdp-vsl.md`), (b) shared
> components `SdpHead`, `CtaLockup`, `ArrowGlyph` in `src/components/sdp.tsx`, and (c) a
> component per section already. **You consume all of that. You do not recreate tokens,
> primitives, or the CTA.** Your job: make your one section match SDP's real markup +
> spacing + type + animation exactly, and move its behavior to the delegated client file.

---

## 0. Client, offer, conversion actions
- **Brand:** Kraft With Kunal — 1:1 coaching for **Indian & NRI male executives 35–50,
  ₹25L+** whose body stopped keeping up.
- **Model:** paid **₹299 assessment** → high-ticket **6-month programme**. Funnel:
  **Landing → Checkout (₹299) → Book-a-call (Calendly) → Thank-you.** Landing CTAs → `/checkout`.
- **Kunal BUILT muscle — never "lost weight."** His copy says *built*; client weight-loss
  numbers are fine.

## 1. Stack & repo
- **Next.js 16 App Router, React 19, TypeScript, plain CSS.** Repo root =
  `/Users/manavlohia945/Documents/Kunal`. Build on **`main`**. **Read
  `node_modules/next/dist/docs/` before any Next API** (breaking changes; see `AGENTS.md`).
- The working backend (Razorpay/GA4/Meta/Clarity/Pabbly) and `/checkout`,`/book-a-call`,
  `/thank-you` must keep working — landing-only this run.

## 2. Reference (fidelity bar)
- SDP is cloned read-only at **`_reference/sdp/`** (gitignored). Live:
  https://sdp.sciencedrivenperformance.in/ . Landing monolith:
  `_reference/sdp/components/landing/LandingPage.tsx`; CSS `_reference/sdp/app/landing.css`.
- **Match SDP structure, hierarchy, type scale, spacing, animation. Only copy (Kraft)
  and palette (brass, already themed) differ.** Your brief names the exact SDP element +
  `file:line`. Open it, read the SHIPPED values, reproduce them. Shipped value wins over any guess.
- Never invent a section SDP lacks; never drop one it has — except **S-SKIP** (§7).

## 3. FOUNDATION — consume the existing `.sdp-root` system (DO NOT redefine)

The brass-gold design system already exists in `src/app/globals.css` under `.sdp-root`.
**Do not create new tokens, a new root class, or a parallel palette.** Consume these:

**Tokens (already defined, brass-gold, single-hue via `--brand`/`--brand-rgb`):**
`--brand:#C9A24B` · `--brand-bright:#E3C078` · `--brand-deep:#8A6D2B` · `--brand-rgb:201,162,75`
(use `rgba(var(--brand-rgb),.NN)` for tints — matches the existing file) · neutrals
`--bg #FFF` / `--bg-alt #F7F5F0` / `--ink` / `--ink-soft` / `--muted` / `--border` ·
dark `--bg-dark`/`--ink-dark`/… · radii `--r-sm/-/-lg/-xl` · gradients `--grad-brand`,
`--grad-cta`, `--hero-bloom` · shadows `--glow-cta`, `--shadow-card` · fonts
`--fh` (Bebas Neue, display) / `--fb` (Inter-Tight body; SDP uses **Manrope** — if your
section's body type must match SDP exactly, note it in your manifest, don't swap the token) ·
**container width `--sdp-cw:1040px`.**

**Primitives (already defined — USE, don't redefine):**
- Bands: `.sdp-light` / `.sdp-light-alt` / `.sdp-dark` / `.sdp-dark-alt`; section wrapper
  `.sdp-section` (`padding:80px 0`); dark bands auto-retheme text.
- Container: wrap content in `.sdp-wrap` (or the section's inner div capped at `--sdp-cw`).
- Masthead: `<SdpHead eyebrow title sub/>` renders `.sdp-eyebrow.center` + `.sdp-h2`
  (accent word via `<em>`) + `.sdp-sub`. Hero uses `.sdp-h1`/`.sdp-h1-l1`/`.sdp-h1-l2`.
- Eyebrow pill (hero): `.sdp-eyebrow-pill` with `.glowdot`. Chips: `.sdp-marker-chip`.
- **CTA: reuse `<CtaLockup/>`** (brass button → `/checkout` + roadmap line + risk badges +
  calm capacity line). Do not build a new CTA. Import from `@/components/sdp`.
- **Type scale is already encoded** in those classes and matches SDP
  (`.sdp-h1-l1` clamp(34,5.6vw,70); `.sdp-h2` clamp(28,4.4vw,52); `.sdp-eyebrow` 11.5px/.18em;
  `.sdp-sub` 15px). Reuse the classes; only add bespoke type in your namespaced CSS if SDP's
  element needs a size these don't cover.

**Reveal (already defined):** emit **`data-sdp-reveal`** on animate-in elements, stagger via
inline `style={{'--d':'.14s'}}` (.06s–.42s). The class `.vis` is added by the delegated
client file. **Fail-open:** real visible HTML; if JS never runs, only the animation is missing.

**Breakpoints (match SDP):** `1280 / 960 / 768 / 640 / 420` (`max-width`). Major collapse at
**960**; full mobile pass at **640** (section pad → 48px). **Zero horizontal overflow at every
width** — give shrinkable grid/flex children `min-width:0`.

## 4. File ownership (what makes parallelism safe)
- **You create/edit ONLY:**
  1. Your section's **existing component file** named in §7 (e.g. `src/components/Hero.tsx`) —
     rebuild it as a **server component** (no `'use client'`, no `useEffect`, no state) emitting
     real HTML that consumes the foundation. (S01/S02 are NEW files — see §7.)
  2. A co-located **`src/components/sections/<Name>.css`** for any bespoke CSS your section
     needs beyond the primitives — **every class namespaced `.s<NN>-…`** (e.g. `.s04-marker`).
     Do NOT add CSS to `globals.css`.
- **You must NOT touch:** `src/app/globals.css`, `layout.tsx`, `page.tsx`,
  `src/components/ClientBehaviors.tsx`, `src/components/sdp.tsx`, `src/components/shared/*`,
  `src/lib/content.ts`, `src/lib/config.ts`, or any OTHER section's file. Need a token/config/
  content key/shared component you can't find? **List it in your manifest; the orchestrator adds it.**
- Namespacing prevents selector collisions; the orchestrator relocates your `<Name>.css`
  into `globals.css` in section order at consolidation.

## 5. Behavior — server components + ONE delegated client file
All interactivity is being consolidated into **`src/components/ClientBehaviors.tsx`**
(orchestrator-owned, mounted once). **Your section stays a server component and emits `data-*`
hooks; it must not carry client JS.** Contract:

| Behavior | Emit | Handled by |
|---|---|---|
| Reveal | `data-sdp-reveal` (+ inline `--d`) | IO adds `.vis` once |
| Count-up | `<span data-count-to="550" data-count-format="plain">550</span>` | RAF ease (SSR text = final) |
| Vimeo VSL | `<div class="sdp-video" data-vimeo-id="ID" data-vimeo-thumb="/…jpg" role="button" tabindex="0">poster+play</div>` | pre-boot near viewport; click/Enter plays w/ sound |
| Testimonial carousel | `[data-carousel="tcar"]` track/set + tiles `data-tslide-idx` | auto-scroll + drag + tap→VideoModal |
| Before/after carousel | `[data-carousel="bacar"]` track/set + cards `data-ba-idx` | auto-scroll + drag + tap→lightbox |
| FAQ accordion | `.sdp-q[role=button][aria-expanded]` + `.sdp-q-body` | delegated single-open toggle |
| Sticky CTA | `[data-sticky-cta]` + `.sdp-hero` sentinel | `.on` when hero leaves viewport |
| Smooth-scroll | `<a href="#calendar">` | delegated smooth-scroll |
| CTA tracking | `<a href*="/checkout">` (CtaLockup already does this) | GA4 add_to_cart + Meta AddToCart |

Need a behavior not listed? Describe it in your manifest — don't add a `'use client'` file.

## 6. Honesty / `<Gap>` — never invent a fact
Unconfirmed numbers/names/ratings/credentials/testimonials/terms/prices → a visible
**`<Gap q={N}/>`** chip (import from `@/components/shared/Gap`), keyed to the question below.
Never a plausible guess; never a drafted or borrowed testimonial.

**Known (use directly):** fee **₹299** (`config`/`site.assessmentFee`); Calendly
`calendly.com/kraftwithkunal/30min`; hero VSL **Vimeo `1210701586`**; **4** testimonial videos
(env `NEXT_PUBLIC_TESTIMONIAL_VIDEO_1..4`); **6** before/after cards `/transformations/ba-1..6.jpg`
(self-contained, anonymous — no overlaid delta captions); coach **Kunal Chalke**, HYROX-certified
+ head judge, `/kunal-coach.jpg`, cert `/kunal-hydrox.jpg`; monthly slots `site.monthlySlots`.

**Gap questions:** 1 client-count/years/success-stories · 2 aggregate rating+review count ·
3 consented client avatar photos · 4 flagship/"featured" testimonial w/ follower count (→ S-SKIP
omitted) · 5 money-back guarantee wording+terms · 6 programme price/range · 7 per-credential
hero stats · 8 names/roles/quotes for the 4 videos · 9 exact programme inclusion titles/count ·
10 coach bio specifics beyond `content.ts`.

## 7. SECTION INDEX (build ONLY your number)
Copy from `src/lib/content.ts` + `funnel-copy/*` where present, else `<Gap>`. SDP refs are in
`_reference/sdp/components/landing/LandingPage.tsx` (+ `landing.css`).

| # | Section — **owned file** | SDP ref (file:line) | Notes |
|---|---|---|---|
| **S01** | Trust banner — **NEW `src/components/sections/S01TrustBanner.tsx`** | `TrustBanner` 180-189 | not in repo yet; add. Gap Q1 |
| **S02** | Trust strip — **NEW `src/components/sections/S02TrustStrip.tsx`** | `TrustStrip` 199-228 | not in repo yet; add. Gap Q2,Q3 |
| **S03** | Header — **`src/components/Nav.tsx`** | `SiteHeader` 344-357 | strip to SDP's minimal logo header |
| **S04** | Hero + VSL — **`src/components/Hero.tsx`** (+ `VSLFrame.tsx`) | `Hero` 490-604, `VSLVideo` 368-488 | VSL `1210777174`→ours `1210701586`; cred cards Gap Q7; reuse `CtaLockup` |
| **S05** | Who-this-is-for — **`src/components/WhoFor.tsx`** | `WhoThisIsFor` 666-698 | reuse `CtaLockup` |
| **S06** | Proof: video testimonials + before/after — **`src/components/Proof.tsx`** (+ `Transformations.tsx`, `np/VideoTestimonials.tsx`, `np/BeforeAfterCarousel.tsx`) | `ProofSection` 1201-1225, `TestimonialCarousel` 774-961, `BeforeAfterGrid` 980-1199 | two `data-carousel`s; 4 videos + 6 ba; captions Gap Q8 |
| **S07** | Founder (dark) — **`src/components/Founder.tsx`** | `FounderAuthority` 1231-1282 | Kunal, `/kunal-coach.jpg` |
| **S08** | Mechanism — **`src/components/Mechanism.tsx`** | `Mechanism` 1295-1333 | 4 pillars |
| **S09** | Programme — **`src/components/Programme.tsx`** | `Programme` 1500-1539 | inclusions Gap Q9; reuse `CtaLockup` |
| **S10** | Guarantee (dark) — **`src/components/Guarantee.tsx`** | `Guarantee` 1566-1616 | terms Gap Q5 |
| **S11** | FAQ — **`src/components/EvenIf.tsx`** (rename/repurpose to FAQ) | `LandingFAQ` 1655-1710 | accordion; price Gap Q6; reuse `CtaLockup` |
| **S12** | Footer — **`src/components/Colophon.tsx`** | `LandingFooter` 1716-1740 | legal links |
| **S13** | Sticky CTA — **`src/components/StickyCTA.tsx`** | `StickyBottomStrip` 1746-1795 | `data-sticky-cta` |
| ~~S-SKIP~~ | ~~Featured influencer spotlight~~ | `SaketFeatured` 1342-1438 | **OMITTED** (Gap Q4) |

Announce ticker (`src/components/TopBeats.tsx`) already exists and is orchestrator-maintained —
not a section session. `FinalCTA.tsx` / `TwoChoices.tsx` are legacy; leave them (orchestrator
prunes at consolidation).

## 8. Consolidation (orchestrator)
Relocate each `sections/<Name>.css` into `globals.css` in section order; wire `page.tsx`
S01→S13; build `ClientBehaviors.tsx` and mount in `layout.tsx`; resolve every manifest;
brace-balance-check CSS; verify build + per-breakpoint (no overflow, renders, reveals fire,
embeds mount, CTAs navigate, fail-open with JS off). Final = standard Next structure, one globals.css.

## 9. END WITH A CONSOLIDATION MANIFEST (do not commit/push)
Print: **files created/edited** (only your section's); **tokens/config/content/shared you need
the orchestrator to add**; **SDP reference values matched** (`file:line` + exact numbers used);
**gaps emitted** (Q#s); **any deviation** + why.
