# SHAPE Build Spec — Kraft With Kunal · VSL Landing Page

> Supersedes the earlier `shape-plan.md`. Grounded in the design brain (`/Users/manavlohia945/Documents/Kunal/.claude/design-system.base.md`, C1–C13 / R1–R12), the default skin (`design-system.skin.tgo-wellness.md`), and Tier-2 `~/.claude/shape/structure-library.md` (read fresh). Copy source: `funnel-copy/01-landing-vsl.md` (approved).
> **This is a spec, not code.** Main thread implements in Next.js App Router + TS + Tailwind.

---

## 1 · One-line verdict

**Four of ten sections carry real structure and earn components — the 4-phase Protocol is the one scarce signature (scroll-linked journey spine); the three agitation beats (Problem, Stakes, Relieve-blame) are structureless persuasion and must stay as clean editorial text.** Elevating them would be the govind-Mirror mistake (forcing a graphic onto prose). The single highest-risk failure on this page is honesty, not layout: every proof number is flagged "confirm before publish" and must be env-swappable, never asserted.

---

## 2 · Skin decision — **RECOMMEND a per-project override** (needs Atul sign-off)

**Decision: override the default wellness skin with a restrained `Kunal/design-system.project.md`, modeled on the govind precedent (calm masculine-premium serif) — NOT the loud dfy precedent (Archivo Black / hype orange).**

**Why (grounded in the brain):**
- **C2 — the one accent carries the register.** The wellness default's primary accent is **forest green** (`oklch(.72 .18 142)`), which reads *spa / nature / wellness coach*. Kraft's positioning is executive-to-executive, boardroom, "you built the career" — green fights that. The accent is spent like a spotlight; it must say *premium and considered*, not *wellness retreat*. A metallic **brass-gold on a graphite/obsidian stage** carries masculine premium (this is exactly why govind chose obsidian + brass over the green default for its calm, no-guru executive register).
- **C1 — keep the serif display voice; reject Archivo Black.** The audience is "NOT hype." The display voice must read *authored authority*, which is the serif job (C1). So we keep a serif — but shift it from Lora (soft, warm, wellness-humanist) toward a **higher-contrast, more architectural serif** (Newsreader direction, as govind did) so authorship reads sharper and more masculine without becoming loud. dfy's Archivo Black would invert the "calm, not hype" mandate — explicitly rejected.
- The dark "forest VSL" preset's *structure* (dark stage, gold value-moments, the verbatim breathing CTA / sticky bar / reveal CSS) is reused wholesale — we are re-hueing tokens, not re-architecting. C12 makes this a token swap, not a rebuild.

**Proposed token deltas (minimal — for Atul sign-off, do not over-build):**

| Token | Wellness default | Kraft override (proposed) | Rationale |
|---|---|---|---|
| `--canvas` (dark stage) | forest green-black `oklch(.18 .04 150)` | **graphite/obsidian** `oklch(.19 .015 250)`-ish (near-neutral cool ink, not green) | executive, not spa |
| `--accent` | forest green `oklch(.72 .18 142)` | **brass-gold** `oklch(.76 .12 85)` (promote the existing `--gold` to primary accent) | C2 register |
| `--accent-deep` | `oklch(.52 .15 142)` | deeper brass `oklch(.58 .12 80)` | value-moment depth |
| `--f-display` | Lora (soft serif) | **Newsreader / high-contrast serif** direction | C1 sharper authored authority |
| `--f-sans`, `--f-mono` | Inter Tight / JetBrains Mono | **keep** | neutral body + credibility voice unchanged |
| Light preset | warm cream `oklch(.97 .015 85)` | keep cream, but neutral-warm (drop the green in `--ink`) | legibility, calm |

**Flagged for Atul:** the override file `Kunal/design-system.project.md` does not exist yet and needs owner sign-off on hue + serif before build. If Atul prefers to ship on the default wellness dark preset for speed, the page still works — but the green accent will read wellness-coach, not executive; note that trade-off. **Recommendation stands: override.** Either way, the whole LP runs on the **dark stage preset** (VSL page, forest/obsidian), not the light cream preset.

---

## 3 · Per-section build table

Signature moment (the ONE scarce showpiece per C2): **the 4-phase Protocol → R9 scroll-linked journey spine.** Everything else stays lighter than it, on purpose.

| # | Section | NO-BRAINER role | Shape | Recipe + concepts | Intensity | Skin tokens / effects | Notes |
|---|---|---|---|---|---|---|---|
| 1 | **Hero (VSL)** | Hook / entry | Focal-media | R2 + R3 · C2 C3 C5 C10 C13 | heavy (focal) | dark stage + stacked radial glow; eyebrow-pill (gated audience line); serif headline with ONE lit accent word ("**matches it**") gradient-clip C3; VSL frame poster + ripple play disc = the lit focal; breathing `.cta-big`; hairline trust row (3 specific facts) | Video not ready → poster placeholder + play disc; swaps to `<video>` from env. CTA → checkout URL. |
| 2 | **The Problem** | Problem / agitate | **no shape → text** | R1 shell only · C1 C9 C13 | text | well-set editorial prose, capped measure; optional drop-cap; pull-quote weld on "**the most disciplined man in every room**" | Lived-moment agitation prose. Forcing a "daily-routine" graphic = ¬C7 decoration. **Text.** |
| 3 | **The Stakes** | Problem / agitate (cost of inaction) | **no shape → text** | R1 shell · C1 C9 | text | editorial text; emphasis (not a component) on "**waiting isn't free**" | Markers are flagged *unverified/general* — a "health dashboard" graphic would fabricate specificity (¬C10). **Text.** |
| 4 | **Relieve the blame** | Relieve-blame (central lever) | **no shape → text** | R1 shell · C1 C9 | text | editorial prose; C9 **pull-quote** on the reframe: "*It was never your discipline… it was the plan.*" | The three failed attempts are agitation examples, not a §2 compare (no winner to elevate). The payoff is one line → pull-quote, not a graphic. **Text.** (govind left its equivalent as text.) |
| 5 | **The Mechanism — 4-phase Protocol** | Mechanism | **SEQUENCE** (dated phases) | **R9 scroll-linked journey spine** (§1 heavy) · C9 C3 C1 C7 C13 | **heavy — THE signature** | rail with glowing head positioned by scroll `--fill`; big serif ordinals **Phase 01–04** as lit focal (C3 brass glow); mono micro-label per node ("Weeks 1–4"); node ignites (pop + ripple) as head reaches it; cards muted→lit in step | Fail-open is critical (see risks). The **"two lengths" (90-Day / 6-Month)** = a light **§12 dual-track balance** sub-beat ("same engine, same coach") — a *both/and* duality, **NOT** a §2/R6 weighted compare (there is no winner; "the length is the only choice"). Keep it subordinate to the spine. |
| 6 | **Light Proof** | Proof (light — men like the reader) | **PROOF / case-set** | **Exhibit-frame case-file cards** (§6) · R7 · C4 C1 C9 C11 | medium | 3 case cards (lawyer / banker / Kunal) — before→after image in a mat/ring (placeholder), mono meta uppercase, the weight delta as **§4 single lit number** (C3); dual-authority intro ("his wife is the doctor") stays **text** above the cards | Adjacent-proof rule N/A (only one proof section). **All figures env/placeholder + flagged confirm-before-publish**; never assert. "Full case files on the call" = honest deferral. |
| 7 | **The Offer** | Offer | **ACCUMULATION + labeled SET** (split) | R5 (no-price variant) + a varied 4-item grid + guarantee weld · C9 C8 C3 C10 | medium | **(a) Deliverables ledger** — R5 hairline rows, mono `# / What` headers, **no Value/Total column** (price withheld — "value shown not invoiced"); checks pop late. **(b)** reframe "*you are not paying for a plan*" = **text** pull-quote. **(c) Erase the four costs** — Effort/Time/Risk/Money as a **2×2 labeled grid** (mono labels), *varied from the ledger above* per adjacent-same-category rule; the Money cell honestly says "no number on this page." **(d)** four-week guarantee = **Guarantee-seal weld** (bespoke seal, C11). | Two accumulation beats adjacent → **must differ**: ledger (a) vs 2×2 grid (c). No price/Total anywhere (reserved for the call). |
| 8 | **Who this is for** | Qualify / Name-the-WHO | **CONTRAST (fit-check)** | **Honest fit-check ✓/✗** (§2) · C8 C10 | medium | two columns: ✓ "for you if" **lit/elevated** vs ✗ "not for you if" **dimmed/desaturated** (C8 weights the yes); the "under ₹25L → not for you" line as an authored closing rule (mono micro-tag) | Not adjacent to any other §2 (relieve-blame is text) → no vary-clash. |
| 9 | **Even if** | Objection | **OBJECTION / Q&A** | **Ruled FAQ ledger** (§5) · R4 · C9 C6 C8 C1 | medium | hairline rows, `Q.01`–`Q.04` serif/mono ordinals; open = brass wash + left stripe + indent + icon rotate/fill; mark "**I've failed every time before**" as "Most asked" + **open by default** (C8) | Physical open-state (¬C6 guard). Reduced-motion → instant. |
| 10 | **The CTA (Rush+Reassure)** | CTA | Prose + CTA beat | R3 + guarantee weld · C2 C3 C4 C6 C7 C10 | medium-heavy | scarcity+reassure copy = **text**; the **breathing `.cta-big`** (only breathing instance on the page) with price from env + arrow; refund/"no hard sell" microline welded beneath; **quiet capacity line** (real slots number, mono) — *calm, inline, NOT a flashing strip* | Rush is capacity-scarcity, executive-calm. Sticky bar hides here (R8) so it never duplicates a visible CTA. |

---

## 4 · Page-chrome

- **Masthead / nav (R1, `.nav`):** minimal sticky bar, backdrop-blur, brand mark (Kraft With Kunal) left, one quiet ghost CTA "Book your assessment" right. No menu — single-action page.
- **Urgency strip (R10):** **RECOMMEND OMIT by default.** The audience raises its guard at hype (C10) and the skin voice is calm (dfy deliberately omits urgency for the same reason). Scarcity is carried *calmly at the CTA* (capacity, named number). If Atul wants a top strip, constrain it to R10 rules — mono uppercase, names the real `MONTHLY_ASSESSMENT_SLOTS` number, no red, slow shine — never "limited time!!!". Flagged as optional.
- **Sticky CTA bar (R8, `.sticky-cta`):** **YES.** Hidden until past the hero (`translateY(120%)` → in), **hides again at the final CTA** (§10) so it never doubles a visible CTA. Condensed "Book your assessment — ₹{fee}" + arrow; brass top-hairline + slow shine. Mobile: drop any tag, keep label + button.
- **Footer / colophon (C9):** editorial colophon — brand, one line on Kunal + his wife/doctor framing, honest microcopy, legal/refund note. **No fabricated trust badges, no "trusted by thousands"** (¬C10). Optional closing-stage background depth weld behind the final CTA (Welds — clatpossible pattern) if the finale wants the page's peak depth; keep it calm.

---

## 5 · Next.js component inventory

**Shared primitives**
- `<Reveal>` — IntersectionObserver → `.reveal.in`; **fail-open** (content visible if JS never fires); honors `prefers-reduced-motion`. (C7)
- `<Section>` — R1 shell: spacing rhythm, alternating surface tone, centered masthead (mono eyebrow → serif headline w/ lit word → sans deck).
- `<CTAButton>` — R3; `breathing` prop (true ONLY on hero + final CTA instances); price injected from `NEXT_PUBLIC_ASSESSMENT_FEE`; arrow token; links to checkout URL.
- `<LitNumber>` — C3 gradient-clip + glow (case weights, key figures).
- `<MonoLabel>` / `<Eyebrow>` — mono micro-labels / eyebrow-pill.
- `<Ledger>` / `<LedgerRow>` — R5 hairline ledger (deliverables no-price variant; reused for four-costs if grid rejected).
- `<CaseFileCard>` — R7 exhibit-frame: before/after image slot (placeholder), mono meta, `<LitNumber>` delta, hover-lift.
- `<JourneySpine>` / `<JourneyNode>` — **R9 scroll-linked signature**; `--fill` set from scroll progress; node ignite (pop + ripple); fail-open.
- `<FitGrid>` — §2 fit-check, ✓ elevated / ✗ dimmed (C8).
- `<FAQLedger>` / `<FAQRow>` — R4 accordion, ordinals, physical open-state, "Most asked" default-open.
- `<GuaranteeSeal>` — bespoke SVG seal weld (C11), token-colored.
- `<VSLFrame>` — R2/§8 poster + ripple play disc → swaps to `<video>` from env; vignette yields to native controls when playing (C12).
- `<StickyCTABar>` — R8 (`.sticky-cta`).
- `<Nav>`, `<Colophon>` (footer).

**Section components:** `Hero`, `ProblemProse`(text), `StakesProse`(text), `RelieveBlameProse`(text+pullquote), `MechanismProtocol`(JourneySpine + TwoLengths dual-track), `LightProof`(authority text + 3× CaseFileCard), `Offer`(Ledger + reframe text + FourCostsGrid + GuaranteeSeal), `WhoFor`(FitGrid), `EvenIf`(FAQLedger), `FinalCTA`.

**Env vars / media placeholders**
- `NEXT_PUBLIC_ASSESSMENT_FEE` — shown in both CTA buttons + sticky bar. Single source of truth; never hard-code.
- `NEXT_PUBLIC_VSL_VIDEO_URL` — hero video (placeholder until shared).
- **`NEXT_PUBLIC_VSL_POSTER`** *(new — flag: not in copy's env list; poster frame needed for the placeholder state)*.
- **`NEXT_PUBLIC_CHECKOUT_URL`** *(new — flag: CTA target; checkout page not built yet)*.
- `NEXT_PUBLIC_MONTHLY_ASSESSMENT_SLOTS` — the calm capacity line at the CTA.
- Media placeholders (Kunal sharing post-meeting): Kunal photo + 108→71 before/after; lawyer 94→~68; banker 135→85; engineer; logo/brand. Every slot = swappable placeholder.
- **Confirm-before-publish figures** (do NOT assert until verified): lawyer ~68kg (not 78), Kunal 108→71, banker 135→85. No client-volume claim ("247 clients" is unverified — excluded).

---

## 6 · Build order + at-risk checklist items

**Build order:** (1) skin override token file + globals (await Atul sign-off; can start on default dark preset in parallel) → (2) primitives `<Reveal>` `<Section>` `<CTAButton>` `<LitNumber>` → (3) Hero + VSLFrame (highest-visibility, placeholder video) → (4) the three text sections (fast) → (5) **JourneySpine** (the signature — most build effort, fail-open first) → (6) LightProof case cards → (7) Offer ledger + four-costs grid + guarantee seal → (8) FitGrid → (9) FAQ ledger → (10) FinalCTA + StickyCTABar + nav + colophon.

**Self-review items most at risk on THIS page:**
- **C7 fail-open** — the scroll-linked spine and every `.reveal` must render content if JS never fires; scroll-`--fill` must degrade to fully-visible. Highest risk (heavy motion showpiece).
- **¬C10 honesty** — all proof numbers env-swappable + flagged, never asserted; no "247 clients"; the "no price on this page" is honest, not evasive.
- **¬C8 mis-weighting** — the two-lengths must read *both/and* (no false winner); the fit-grid must weight the ✓ side.
- **C2 accent scarcity** — with brass promoted to primary, don't let gold spread; spend it on the one lit word, the case numbers, the CTA.
- **Gate discipline (over-elevation)** — resist forcing graphics onto Problem / Stakes / Relieve-blame. They are text.
- **C1** — serif never below headline; keep three voices; if the override serif sharpens, don't let it drift into dfy-style hype weight.
- **C6** — FAQ + spine open/ignite states are physical/eased, not binary toggles.

---

## Gaps flagged (for owner / LEARN)
1. **Skin override needs Atul sign-off** — `Kunal/design-system.project.md` (brass-gold/graphite/Newsreader) does not exist yet.
2. **Two new env vars** — `NEXT_PUBLIC_VSL_POSTER`, `NEXT_PUBLIC_CHECKOUT_URL` — not in the copy's BUILD NOTES env list; needed for the placeholder VSL and the CTA target (checkout not built).
3. **Minor structure-library variant** — the Offer uses a **no-price R5 ledger** (deliverables without Value/Total columns) because price is withheld. Not explicitly in Tier-2; if it ships clean, file it under §3 as a "value-shown-not-priced ledger" via LEARN.
4. **All transformation media + VSL video pending** Kunal's post-meeting share — build proceeds on placeholders.
