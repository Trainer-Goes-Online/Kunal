import { deliverables, fourCosts } from "@/lib/content";
import { CtaLockup } from "./sdp";

/**
 * S09 — Programme / What's Included.
 *
 * SDP reference: `_reference/sdp/components/landing/LandingPage.tsx:1500-1539`
 * (`Programme`) + `_reference/sdp/app/landing.css:1712-1761` (grid/card/icon/title/
 * desc/cta), `:2330` (960 → 2 cols), `:2534-2536` (640 → 1 col, 19px/13px),
 * `:2727-2733` (icon lift on card hover), `:2816-2817` (hover:none kill).
 *
 * Structure reproduced verbatim: eyebrow (`.sdp-eyebrow.center`) → `.sdp-h2` with the
 * accent clause in <em> → `.sdp-sub` → a 3-column card grid of inclusions, each card a
 * 48px rounded icon tile + display title + 13.5px description → centred CTA lockup.
 * SDP staggers the grid at `.06s + idx*.06s` and the CTA at `.42s`; same here.
 *
 * Deltas vs SDP: (a) SDP ships six inclusions, Kraft's offer ships seven (confirmed —
 * `content.ts` `deliverables`, funnel-copy/01-landing-vsl.v2-nobrainer.md Beat 8, cap
 * of 7 stated at :306); the grid simply runs to a fourth row. (b) SDP's icon tile holds
 * a line-art glyph; Kraft's inclusions are a numbered ledger in the source copy, so the
 * tile holds the ledger number instead — same tile, same hover behaviour. (c) Beat 8
 * also carries the "not paying for a plan" line and the four erased costs, which SDP has
 * no analogue for; both are confirmed Kraft copy and are kept below the grid, styled in
 * SDP's own card idiom. No programme price is shown (reserved for the call).
 *
 * Server component — reveal is emitted as `data-sdp-reveal` + inline `--d` only.
 */
export function Programme() {
  return (
    <section id="programme" className="sdp-section sdp-light-alt s09-program">
      <div className="sdp-wrap">
        <div className="sdp-eyebrow center" data-sdp-reveal>
          What&rsquo;s Included
        </div>
        <h2 className="sdp-h2" data-sdp-reveal style={{ "--d": ".06s" } as React.CSSProperties}>
          One Operating System For Your Body, <em>Not A Folder Of PDFs.</em>
        </h2>
        <p className="sdp-sub" data-sdp-reveal style={{ "--d": ".10s" } as React.CSSProperties}>
          Seven parts that work together as one operating system for your body, not a folder of PDFs.
        </p>

        <div className="s09-grid">
          {deliverables.map((d, idx) => (
            <div
              key={d.n}
              className="s09-item"
              data-sdp-reveal
              style={{ "--d": `${(0.06 + idx * 0.06).toFixed(2)}s` } as React.CSSProperties}
            >
              <div className="s09-icon" aria-hidden>
                {d.n}
              </div>
              <div className="s09-title">{d.title}</div>
              <p className="s09-desc">{d.body}</p>
            </div>
          ))}
        </div>

        <p className="s09-note" data-sdp-reveal style={{ "--d": ".48s" } as React.CSSProperties}>
          You are not paying for a plan. A plan is free on YouTube. You are paying for the system, the
          accountability, and <strong>the coach who has done this</strong> for a lawyer, a banker, and
          an engineer who all looked like you before they started.
        </p>

        <div className="s09-costs" data-sdp-reveal style={{ "--d": ".54s" } as React.CSSProperties}>
          {fourCosts.map((c) => (
            <div className="s09-cost" key={c.k}>
              <div className="s09-cost-k">{c.k}</div>
              <div className="s09-cost-v">{c.v}</div>
            </div>
          ))}
        </div>

        <div className="s09-cta" data-sdp-reveal style={{ "--d": ".60s" } as React.CSSProperties}>
          <CtaLockup />
        </div>
      </div>
    </section>
  );
}
