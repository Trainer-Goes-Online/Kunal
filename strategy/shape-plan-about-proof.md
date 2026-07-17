# SHAPE build plan — About Kunal + Proof rework

> Kraft With Kunal LP. Skin: brass-gold on graphite/obsidian (`design-system.project.md`).
> Grounded in the design brain (`.claude/design-system.base.md`) + structure-library Tier 2.
> Two deliverables: **(A) new ABOUT KUNAL section**, **(B) reworked PROOF section** (two sub-sections).

---

## Verdict (one line)

The About section is a *bio* (narrative prose → **text**) welded to a *credential set* (→ the §12 credential-pill component) plus two framed exhibits (portrait + cert). The Proof section is two adjacent **proof-sets** that must render as **different** components per the vary-vs-neighbor rule: video testimonials as a **framed-video-card grid**, transformations as a **carousel**.

---

# (A) ABOUT KUNAL

| Field | Value |
|---|---|
| **Role (NO-BRAINER)** | Authority / credibility beat — *why this coach is the right one*. |
| **Shape** | Mixed. The life story (skinny → built muscle, coach-not-doctor) is **narrative prose → no shape → TEXT** (§12 note: "a narrative 'my story' stays text"). The *credentials* (HYROX-certified, head-judge[flagged], years coaching, "coaches with your doctor not around him") are a **SET → structure**. Portrait + cert are **focal-still media → framed exhibits** (C4/R7 frame, not §8 VSL — they are stills, no play). |
| **Recipe + concepts** | R1 masthead · **§12 Authority credential-pill row** for the credential set · **R7 mat/ring frame** (minus play disc) for the portrait · **C12** (frame-don't-restyle) for the light-on-white HYROX cert · C4 (tinted layered depth) · C1 (serif story, mono credential chips) · C13 (capped measure). |
| **Component** | **NEW `<AboutKunal>`.** Two-column split (desktop). |

### Layout
- **Desktop:** two-column split (`grid-template-columns: minmax(0, 0.9fr) 1.1fr`, gap `clamp(32px,5vw,64px)`, `align-items:start`, `--content-max` wrap).
  - **Media column (left):** `public/kunal-portrait.jpg` in a premium frame — R7 mat treatment: `border:1px solid var(--hair)`, an **inner brass hairline ring** (`box-shadow: 0 0 0 1px rgba(201,162,75,.22) inset` + `inset 0 1px 0 rgba(255,255,255,.10)`), C4 layered warm drop (`0 40px 80px -30px rgba(0,0,0,.7), 0 0 40px -10px rgba(201,162,75,.18)`), `border-radius: var(--radius-l)`. Portrait is dark-studio → **blends into the stage** (no light inset needed here). `object-fit:cover`, portrait aspect (`aspect-ratio: 4/5`). `kunal-coach.jpg` is the optional approachable alt (not shipped by default).
  - **Copy column (right):** masthead (`eyebrow` "Who is Kunal" → `display` h2 with one `.lit` brass word → short deck) → **narrative prose** (2 short paras, calm executive voice, from `funnel-copy/05-about-kunal.md`, measure capped ~62ch) → **credential pill row** (§12) → the **HYROX cert** as a smaller framed credential beneath.
- **Credential pill row (§12, `[EMPIRICAL]`, sreshtha `.cred-pill`):** compact mono chips, e.g. `HYROX365 CERTIFIED` · `HEAD JUDGE*` · `10+ YRS COACHING` · `COACHES WITH YOUR DOCTOR`. Reuse `.trust-row .item` mono styling as the base; render as bordered lozenges (`border:1px solid var(--hair)`, `border-radius:999px`, brass icon via `currentColor`). **Head-judge is flagged** → keep the chip text swappable from content (do not hard-assert; drop the chip if Kunal can't confirm — honesty, no fabricated credential).
- **HYROX cert (`public/kunal-hydrox.jpg`, landscape ~3:2):** the image is **light-on-white** → per **C12**, frame it on a **light inset panel, do not restyle it**. Reuse the `.cal-frame` precedent (`background:#f6f4ef`, hairline border, `radius-l`) as a `.cred-frame`: cream inset + R7 brass ring + C4 depth, cert `object-fit:contain` with small padding so the white document sits inside a matted brass frame on the dark stage. Small mono caption below in `--ink-3`: `CREDENTIAL · HYROX365`.

### Mobile behavior
Single column stack, in this order: **portrait first → masthead+copy → credential pills (wrap to 2 rows) → cert last**. Cert scales to full column width. Reduce portrait aspect to `4/5` capped `max-height` so it doesn't dominate the fold.

### Fail-open / reduced-motion
- Whole section wrapped in `<Reveal>` (staggered children via `data-delay` 1/2/3) — already fail-open (server-rendered visible; JS only arms).
- No bespoke motion beyond the standard reveal. `prefers-reduced-motion` already handled by `.reveal` block. Portrait/cert are static images — nothing to gate.
- If a credential (head-judge) is unconfirmed, the chip is simply omitted from the content array — no empty slot, no placeholder.

---

# (B) PROOF — reworked (two sub-sections in one `#proof` shell)

**Remove** the current 3 `.case` case-file cards and the `cases` array usage in `Proof.tsx` — especially the **"Kunal himself" 108→71 card** (he never did a weight-loss journey; keeping it is a fabricated-proof violation). The lawyer/banker figures move out of cards entirely (they already survive as agitate lines in the FAQ `even-if` copy).

**Dual-authority intro ("Kunal isn't a doctor — his wife is…"):** this is an **authority/coach-positioning** beat, not proof. **Move it to (A) About Kunal** (it belongs with "coaches with your doctor, not around him"). The Proof masthead becomes purely proof-framed: eyebrow "Proof" → "Men who looked exactly like you — *before they started*." → a short deck pointing at the exhibits below.

### Sub-section 1 — Video testimonials

| Field | Value |
|---|---|
| **Role** | Instant-proof / social-proof (Cialdini) — confirm-it-works-for-ME. |
| **Shape** | Proof-set, video (4 client stories). |
| **Category** | §6 Proof/Testimonial → **Video testimonial card** (framed, poster + play), rendered via the **VSL frame pattern** (§8 focal-media applied to proof). `[EMPIRICAL]`. |
| **Recipe + concepts** | R7 (exhibit-frame: mat/ring, on-brand play disc, meta in mono) · C12 (poster→`<video>`, decorative overlays yield to native controls) · C4 depth · C6 (play disc scale/fill). |
| **Component** | **NEW `<VideoTestimonials>`** — reuses the `<VSLFrame>` play→`<video>` pattern and `.vsl` styling per card. |

- **Grid vs carousel (desktop):** **2×2 grid** (`repeat(2,1fr)`, gap `clamp(18px,2.4vw,24px)`, `max-width:900px` centered). Four items sit calmly as a matched exhibit wall — no carousel needed; a carousel here would hide half the proof. (Carousel is reserved for sub-section 2 to satisfy vary-vs-neighbor.)
- **Each card:** the `.vsl` frame (`aspect-ratio:16/9`, brass ring, C4 depth) with poster + **brass play disc** (`.vsl-disc`, ping pulse) → on click swaps to native `<video controls autoPlay>` exactly like `VSLFrame` (`.vsl--playing` drops the decorative vignette so native controls stay reachable — C12). Optional mono meta strip under each (`NAME · ROLE`, `--ink-3`) — only if we have it; otherwise omit (no fabricated identities).
- **Mobile:** **1-column stack** (each card full width, `aspect-ratio:16/9`). No swipe here — a short vertical stack of 4 reads fine and keeps each testimonial full-size. (Swipe is the transformation carousel's job.)
- **Fail-open:** each card reads `NEXT_PUBLIC_TESTIMONIAL_VIDEO_{1..4}`. Empty env → the disc renders in the **placeholder state** (like `VSLFrame`'s "Film coming soon"): badge reads **"Testimonial coming"**, disc is non-interactive (`aria-label="Testimonial coming soon"`), poster shows if a `NEXT_PUBLIC_TESTIMONIAL_POSTER_{n}` is set else the graphite gradient. Page never ships a broken/empty player.
- **Reduced-motion:** `.vsl-disc::after` ping already gated by the existing `prefers-reduced-motion` block. No new motion.

### Sub-section 2 — Before/after transformations

| Field | Value |
|---|---|
| **Role** | Instant-proof — the visual delta (before→after). |
| **Shape** | Proof-set with a visual transformation, 6 self-contained artifacts. |
| **Category** | §6 Proof/Testimonial → **Winner slider / carousel** (`[EMPIRICAL]`, dfy-new `WinnerSlider`). Chosen over exhibit-frame **to vary from sub-section 1** (rule: adjacent proof sections must not reuse the same option). |
| **Recipe + concepts** | R7 (frame-as-exhibit) · C4 (each cream card = a physical photo with tinted depth) · C12 (**do NOT recolor the cream cards** — frame the third-party/finished artifact, don't restyle) · C6 (eased prev/next + swipe) · C7 (motion fail-open). |
| **Component** | **NEW `<BeforeAfterCarousel>`** (client component). |

- **The six cards** `public/transformations/ba-1.jpg … ba-6.jpg` are finished, self-contained cream cards (1000×1000, before→after + baked client quote + first name). **Present as exhibits only — add NO captions of our own.**
- **Carousel (desktop):** show **two cards at a time** (they're detailed/readable at ~440px each), `prev`/`next` brass controls + **dots** (one per page). Each cream card sits on the dark stage as a **physical photo**: `border-radius:var(--radius-m)`, C4 warm layered drop (`0 30px 60px -28px rgba(0,0,0,.7)`) + a thin brass ring (`0 0 0 1px rgba(201,162,75,.20)`), slight tilt-free flat mat. **No color filter, no overlay tint** on the cream (C12 legibility — the cards are their own artwork).
- **Mobile:** **one card at a time**, **native swipe** (`scroll-snap-type:x mandatory`, `scroll-snap-align:center`) + dots; prev/next optional. Cards full column width.
- **Prev/next + dots:** bespoke brass line-icons (reuse `Arrow` for next, mirror for prev — C11, no icon-font). Active dot = brass, others = `--hair`.
- **Fail-open:** carousel is CSS-scroll-snap based → **works with zero JS** (a horizontally scrollable strip); JS only enhances with buttons/dot-sync. If JS never fires, all six cards remain reachable by scroll/swipe. Images have real `src` (local assets, always present) — no env dependency, no empty state.
- **Reduced-motion:** disable smooth-scroll animation on control clicks (`scroll-behavior:auto` under `prefers-reduced-motion`); snapping still works, just instant. No autoplay (never auto-advance — honors the calm skin voice + C7).

### Proof shell after rework
`#proof` keeps the `.section--alt` shell + a single masthead, then two sub-blocks with a light divider/eyebrow between them:
1. eyebrow `In their words` → `<VideoTestimonials>` (2×2)
2. eyebrow `The change, on the wall` → `<BeforeAfterCarousel>` (6 cream cards)
Closing line kept: "Full case files walked through with you on the assessment call." (`.lengths-note`).

---

# Section order after changes (confirmed)

```
Hero → Problem → Stakes → RelieveBlame → Mechanism
     → Proof [ Video testimonials  +  Before/After carousel ]
     → Offer → WhoFor → About Kunal → EvenIf → FinalCTA
     → Colophon (footer)  ·  StickyCTA (chrome)
```

`<AboutKunal>` is inserted **after `<WhoFor>` and before `<EvenIf>`** in `src/app/page.tsx`. Matches the requested order. No other reordering.

---

# Inventory

### New components to build (`src/components/`)
- **`AboutKunal.tsx`** — two-column split; portrait frame (R7) + prose (text) + `<CredentialPills>` (§12) + HYROX cert frame (C12 light inset). Server component (Reveal wraps children).
- **`VideoTestimonials.tsx`** — 2×2 (desktop) / 1-col (mobile) grid of framed video cards; extends the `VSLFrame` poster→`<video>` pattern. Client component (play state).
- **`BeforeAfterCarousel.tsx`** — scroll-snap carousel of the 6 cream cards, prev/next + dots, swipe on mobile. Client component. **Fail-open (CSS-scroll baseline).**
- (Optional helper) **`CredentialPills.tsx`** or inline in `AboutKunal` — the §12 chip row.

### Components / classes to REUSE
- `<Reveal>` / `.reveal` (fail-open stagger), `<Section>`/`.section`/`.section--alt`/`.wrap`/`.section-head`, `.eyebrow`, `.display`, `.lit`, `.deck`.
- `<VSLFrame>` **pattern** + `.vsl` / `.vsl-poster` / `.vsl-play` / `.vsl-disc` / `.vsl-badge` / `.vsl--playing` (video testimonials).
- `.trust-row .item` mono chip base → credential pills; `.cal-frame` (cream light inset) → the `.cred-frame` cert frame.
- Icons: `PlayTriangle` (play disc), `Arrow` (carousel next / mirrored prev), `Check`. C11 — no new emoji/icon-font.
- Tokens/effects: `--accent` brass, `--gold`, `--hair`, `--stage-1/2/3`, `--radius-m/l`, C4 shadow recipe, `--ease-btn`/`--ease-reveal`.

### New CSS classes to add (`globals.css`)
- `.about`, `.about-media`, `.about-copy`, `.about-frame` (R7 portrait mat), `.cred-pills`, `.cred-pill`, `.cred-frame` (cert light inset).
- `.vtestis` (2×2 grid) reusing `.vsl` per card; `.vtesti-meta` (optional mono).
- `.ba-carousel`, `.ba-track` (scroll-snap), `.ba-card` (cream exhibit + C4 depth, **no filter**), `.ba-nav`, `.ba-dots`.

### New env vars (`site.ts` + `.env.local.example`)
- `NEXT_PUBLIC_TESTIMONIAL_VIDEO_1` … `_4` — CDN URLs; empty → "Testimonial coming" placeholder.
- `NEXT_PUBLIC_TESTIMONIAL_POSTER_1` … `_4` — *(optional)* poster frames; empty → graphite gradient.
- Add to `site.ts` as `testimonials: [{ video, poster }, …]` (4 entries) with safe empty defaults, mirroring the `vslVideoUrl` pattern.

### Content changes (`content.ts`)
- **Delete** `cases` usage from Proof (retire the "Kunal himself" card entirely; lawyer/banker figures already live in `faqs`).
- **Add** `credentials` array for the pill row (with the head-judge entry flagged/omittable).
- **Add** `transformations` = `["/transformations/ba-1.jpg", … ba-6.jpg]` (paths only — cards are self-captioned).
- About prose sourced from `funnel-copy/05-about-kunal.md`.

---

# Gaps / flags (honesty)

1. **Head-judge credential is flagged** in the copy brief — render the chip as omittable content; do **not** assert it until Kunal confirms. Same discipline as the retired 108→71 card.
2. **Video testimonial CDN URLs + posters + per-client meta (name/role)** are not yet available → env placeholders + "Testimonial coming" fail-open. If we have no verified names, ship the cards **without meta** rather than invent identities.
3. **Cream-card carousel** deliberately adds **no captions/overlays** — the `ba-*.jpg` artifacts are finished. If a future card needs a caption, it belongs baked into the image, not in our DOM (C12 frame-don't-restyle).
4. No new structure invented where meaning is prose: the About **life story stays text**; only the credential *list*, the two framed stills, and the two proof-sets became components.
