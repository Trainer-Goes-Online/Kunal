# Per-page session prompt (checkout / book-a-call / thank-you)

Open a fresh Claude Code session in the `Kunal` repo, paste the block below, and append
the page code (`P01`, `P02`, or `P03`). Run the three in parallel.

---

```
You are rebuilding ONE page of the Kraft With Kunal funnel to be pixel-exact to the SDP
reference, on the EXISTING .sdp-root brass foundation, WHILE PRESERVING the working
backend (Razorpay / Calendly / tracking). Read parallel-build/PAGES-HANDOFF.md in FULL
first, and parallel-build/MASTER-HANDOFF.md §1–§6 for the shared foundation/rules. The SDP
reference is cloned at _reference/sdp.

Build ONLY page: <P01 | P02 | P03>

Rules:
- Edit ONLY your page's owned files named in PAGES-HANDOFF §3, plus a co-located
  src/components/sections/<Page>.css (classes namespaced .p<NN>-…). Touch NO shared file
  (globals.css, sections.css, layout.tsx, ClientBehaviors.tsx, sdp.tsx, shared/*, content.ts,
  config.ts) and no other page. Declare shared needs in your manifest.
- CONSUME the existing foundation (.sdp-root tokens/bands/.sdp-section/.sdp-wrap/--sdp-cw,
  <SdpHead>, <CtaLockup>, .sdp-h1/.sdp-h2/.sdp-eyebrow/.sdp-sub). Reveal = data-sdp-reveal.
  Do NOT redefine tokens or add raw CSS to globals.css.
- PRESERVE the working backend: keep the existing Razorpay create-order/verify + ₹299 +
  redirect→/book-a-call (checkout), the Calendly embed/prefill + event_scheduled→book_call→
  /thank-you (book-a-call), and all GA4/Meta tracking calls. Reskin markup/classes only;
  reuse the existing logic/state. If you must change any backend/tracking line, call it out
  loudly in your manifest.
- Match the SDP page element named for your page exactly: open its file:line in _reference/sdp,
  read the shipped structure/type/spacing/animation, reproduce it. Only copy (Kraft) + palette
  (already brass) differ.
- Emit interactivity as data-* hooks (data-sdp-reveal, data-vimeo-id, data-carousel="bacar",
  data-sticky-cta, native <details> for FAQ); ClientBehaviors wires it. No new client JS beyond
  the existing Razorpay/Calendly client component.
- Any unconfirmed fact (programme price, ratings, counts, value stacks, scarcity numbers,
  thank-you VSL id) = a visible <Gap q={N}/> (from @/components/shared/Gap). ₹299 is the only
  hard number. Never fabricate a discount or testimonial.
- Real, complete HTML; fail-open; zero horizontal overflow. Do NOT run a prod build against the
  dev server. Do NOT commit or push.
- End with a manifest: files edited, shared needs, SDP refs matched, gaps emitted, and any
  change you made to backend/tracking logic.
```
```
