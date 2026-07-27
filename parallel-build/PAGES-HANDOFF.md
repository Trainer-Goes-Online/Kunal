# PAGES HANDOFF — Kraft With Kunal: Checkout · Book-a-call · Thank-you (SDP-referenced)

**Read this end-to-end.** You are rebuilding **ONE page** of the Kraft funnel to be
pixel-exact to the SDP reference, on the **existing `.sdp-root` brass foundation**,
**while preserving Kraft's already-working backend** (Razorpay, Calendly, tracking).
Same method as the landing rebuild: one session per page, disjoint file ownership.

> Prereq context — read `parallel-build/MASTER-HANDOFF.md` §1–§6 first. Everything there
> (stack, `.sdp-root` foundation tokens/primitives, `<SdpHead>`/`<CtaLockup>`, the delegated
> `ClientBehaviors.tsx`, honesty/`<Gap>` rules, SDP clone at `_reference/sdp/`) applies here
> too. This file adds only what's page-specific.

---

## 0. Funnel flow & the backend you MUST keep working
`Landing → /checkout (pay ₹299) → /book-a-call (Calendly) → /thank-you.` The payment,
calendar, and tracking are **already built and live** — you **reskin the presentation to
SDP's structure; you do NOT rewrite the working logic**:
- **Razorpay** create-order/verify + the ₹299 fee (`src/lib/config.ts` / `site.assessmentFee`),
  redirect **after success → `/book-a-call`** (funnel order — not straight to thank-you).
- **Calendly** inline embed → `NEXT_PUBLIC_CALENDLY_URL` (`calendly.com/kraftwithkunal/30min`);
  `calendly.event_scheduled` postMessage → GA4 `book_call` → `/thank-you`.
- **Tracking**: GA4 `initiate_checkout` (before validation), Meta InitiateCheckout/CAPI,
  `add_to_cart` on CTAs — all already wired in the existing components. Keep them.

**Honesty:** ₹299 is real. Any *other* number (programme price, "was ₹X / save ₹Y" value
stacks, ratings, counts) is unconfirmed → `<Gap q={N}/>`, never invented. Do NOT fabricate a
discount ("87% off") for an assessment fee that isn't discounted.

## 1. Foundation (consume — same as landing)
Wrap the page in `.sdp-root`. Use the existing tokens, bands (`.sdp-light`/`.sdp-dark`),
`.sdp-section`, `.sdp-wrap`, `--sdp-cw`, `<SdpHead>`, `.sdp-eyebrow/.sdp-h1/.sdp-h2/.sdp-sub`,
`[data-sdp-reveal]` (reveal handled by `ClientBehaviors`). Breakpoints `1280/960/768/640/420`.
Zero horizontal overflow at every width. Behavior = `data-*` hooks (no per-page client JS
beyond what already exists for Razorpay/Calendly, which stays in the existing client component).

## 2. File ownership + CSS
- Each page owns its **route file** + its **presentation component(s)** named below, plus a
  co-located **`src/components/sections/<Page>.css`** (classes namespaced `.p<NN>-…`). Do NOT
  touch `globals.css`, `sections.css`, `layout.tsx`, `ClientBehaviors.tsx`, `sdp.tsx`,
  `shared/*`, `content.ts`, `config.ts`, or another page. Declare shared needs in your manifest.
- The orchestrator relocates your `<Page>.css` into `src/app/sections.css` at consolidation.
  (Note: raw CSS appended into `globals.css` is silently dropped by Tailwind v4 — section/page
  CSS lives in `sections.css`, imported in `layout.tsx`.)

## 3. THE PAGE INDEX (build ONLY your page)

### P01 — Checkout · `/checkout`
- **Owned:** `src/app/checkout/page.tsx` + `src/components/np/CheckoutForm.tsx` (+ `P01Checkout.css`).
- **SDP ref:** `_reference/sdp/app/new-checkout-page/page.tsx`, `_reference/sdp/components/checkout/CheckoutForm.tsx`, `_reference/sdp/app/new-checkout-page/checkout.css`.
- **Structure to match (SDP):** top trust announce bar (Secure Checkout · 100% Refundable ·
  Razorpay Verified/256-bit SSL). **Two-panel** body: left = "Your Details" form (First/Last
  name, Email, City, Phone via country-dropdown, digits-only), right = **desktop order-summary
  aside**; PLUS a **collapsible mobile summary bar** on top. Summary = product ("Assessment with
  Kunal"), event pill, honest inclusion bullets, **Total due today ₹299** (the lit value-moment),
  payment-method tiles, guarantee line. Submit = "Pay ₹299 & Book My Call" (spinner while loading).
- **Keep working:** the existing Razorpay handleSubmit/handlePaymentSuccess, validation, UTM
  capture, GA4/Meta calls, and **redirect → `/book-a-call`** on success. Reskin the markup +
  classes to SDP's; reuse the existing state/logic. Coupon UI only if the repo already has it.
- **Gap:** any "value stack"/original-price numbers (Q6/programme price) → `<Gap>` or omit;
  keep it to the honest ₹299.

### P02 — Book-a-call · `/book-a-call`
- **Owned:** `src/app/book-a-call/page.tsx` + `src/components/np/CalendarEmbed.tsx` (+ a new
  `src/components/BookACall.tsx` composer if cleaner) + `P02BookACall.css`.
- **SDP ref:** `_reference/sdp/app/new-book-a-call/page.tsx`, `_reference/sdp/components/book-a-call/BookACallPage.tsx` (+ it reuses `landing.css`).
- **Structure to match (SDP):** announce marquee ("Payment Confirmed · 1:1 Consultation ·
  Refundable…") → **hero** (green "Payment Confirmed" tick, H1 "ONE LAST STEP{, NAME}. PICK YOUR
  SLOT." with name from `?name`, sub "Your ₹299 is paid…", 2-step progress Paid→Pick) →
  **CalendarSection `#calendar`** (H2 + the **Calendly inline embed** with prefill + spinner +
  fallback link + reassurance checklist) → **Included** (eyebrow + H2 "A Real Diagnostic. Not A
  Pitch." + 6 value cards w/ "Included" pills) → **WhyCard** (dark scarcity + stat row) →
  **Transformations** (reuse the landing before/after — same `data-carousel="bacar"` markup) →
  **FAQ** (native `<details>` accordion) → **FinalCTA** (`<a href="#calendar">Pick My Slot`) →
  **Footer** → **sticky strip** (`data-sticky-cta`, sentinel `.sdp-hero`).
- **Keep working:** the existing Calendly URL/prefill + `event_scheduled` → GA4 `book_call` →
  `/thank-you` logic in `CalendarEmbed.tsx`. Smooth-scroll `#calendar` is delegated (already in
  `ClientBehaviors`). Gap: `<30 clients/quarter` scarcity number, stat-row figures (Q1/Q7).

### P03 — Thank-you · `/thank-you`
- **Owned:** `src/app/thank-you/page.tsx` (+ a `src/components/ThankYou.tsx` composer) + `P03ThankYou.css`.
- **SDP ref:** `_reference/sdp/app/new-thank-you/page.tsx`, `_reference/sdp/components/thank-you/ThankYouPage.tsx`.
- **Structure to match (SDP):** announce marquee ("Booking Confirmed…") → **hero** (green tick,
  H1 "Assessment Confirmed.", sub, booking card, an **"important — watch the video" banner**,
  then a **VSL** — emit `.sdp-video[data-vimeo-id][data-vimeo-thumb]` so `ClientBehaviors` plays
  it; Gap the video id if none is confirmed for thank-you) → **What Happens Next** (dark, 4-item
  timeline) → **CalloutBand** ("Most coaches guess. Kunal measures.") → **Prep Questions**
  (light-alt, 3 cards) → **Fee/Refund** (dark, "Why the ₹299", refundable) → **Contact** (mailto +
  back-to-home) → **Footer**.
- **Note:** a session already left changes in `src/app/thank-you/page.tsx` + a `thank-you.css`
  from the landing run — **review and reconcile** them (don't blindly overwrite); fold anything
  good into the SDP structure. Gap: the thank-you VSL id, prep copy specifics.

## 4. Consolidation (orchestrator)
Relocate each page's `.css` into `sections.css`; verify each route builds + renders at every
breakpoint (no overflow, forms validate, Razorpay modal opens on ₹299, Calendly mounts,
`event_scheduled`→thank-you, VSL plays, fail-open with JS off); resolve manifests.

## 5. END WITH A MANIFEST (no commit/push)
Files edited (only your page's); shared tokens/content you need added; SDP `file:line` matched;
gaps emitted; any deviation (esp. anything you changed in the working Razorpay/Calendly/tracking
logic — call it out explicitly).
