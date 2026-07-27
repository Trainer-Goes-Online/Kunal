# Per-section session prompt

Open a fresh Claude Code session in the `Kunal` repo, paste the block below, and
append the section number (e.g. `S04`). Nothing else.

---

```
You are rebuilding ONE section of the Kraft With Kunal landing page to be pixel-exact
to the SDP reference, ON THE EXISTING brass-gold .sdp-root foundation. Read
parallel-build/MASTER-HANDOFF.md in FULL before anything else — it defines the client,
the stack, the SDP reference (cloned at _reference/sdp), the file you own, the EXISTING
tokens/primitives you consume, the shared components you reuse, the CSS namespace, the
delegated-behavior model, and the honesty/<Gap> rules.

Build ONLY section number: <N>

Rules (from MASTER-HANDOFF):
- Edit ONLY your section's owned file named in §7 (rebuild it as a SERVER component —
  no 'use client', no useEffect, no state), plus a co-located
  src/components/sections/<Name>.css for bespoke CSS, every class namespaced .s<NN>-… .
  Touch NO shared file (globals.css, layout.tsx, page.tsx, ClientBehaviors.tsx, sdp.tsx,
  shared/*, content.ts, config.ts) and no other section. Need a token/config/content key/
  shared component you can't find? List it in your manifest — the orchestrator adds it.
- CONSUME the existing foundation: .sdp-root tokens (--brand #C9A24B etc.), bands
  (.sdp-light/.sdp-dark), .sdp-section, .sdp-wrap, --sdp-cw:1040px, and the primitives
  <SdpHead>, <CtaLockup>, .sdp-eyebrow/.sdp-h1/.sdp-h2/.sdp-sub. Do NOT redefine tokens or
  build a new CTA. Reveal = emit data-sdp-reveal (+ inline --d stagger).
- Match the SDP element named for section <N> exactly: open its file:line in _reference/sdp,
  read the shipped structure/type-scale/spacing/animation, reproduce it. Only the COPY
  (Kraft, from src/lib/content.ts / funnel-copy/) and palette (already brass) differ.
- Emit interactivity as data-* hooks per the behavior table (data-sdp-reveal, data-vimeo-id,
  data-carousel, etc.); the one delegated client file wires it. No per-section client JS.
- Any fact not in content.ts/config.ts or the MASTER-HANDOFF "known facts" =
  a visible <Gap q={N}/> chip (from @/components/shared/Gap). Never invent a number, name,
  rating, or testimonial.
- Real, complete HTML that works with JS disabled (fail-open). Zero horizontal overflow.
- Do NOT run a production build against the dev server. Do NOT commit or push.
- End by printing a "consolidation manifest": files edited, tokens/config/content/shared you
  need the orchestrator to add, SDP reference values matched (file:line + numbers), gaps
  emitted, and any deviation.
```
