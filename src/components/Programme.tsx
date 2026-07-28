import { deliverables } from "@/lib/content";
import { CtaLockup } from "./sdp";
import { FourCosts } from "./FourCosts";
import { Glyph } from "./icons";

/**
 * S09 — Programme / What's Included.
 *
 * Copy source: "Kunal Full Funnel Seggregation.md" → "Everything Included In Your
 * 12-Week Programme" — SIX inclusions (the previous build shipped seven from the
 * older funnel-copy draft; the md supersedes it). Each tile now carries a drawn
 * line glyph plus its ledger number rather than the number alone.
 *
 * The four erased costs below the grid moved into `FourCosts` — a gauge-tile
 * treatment rather than the flat cards it replaces. No programme price is shown
 * (reserved for the call, per the md's own "Money" row and FAQ).
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
          Everything Included In Your
          <br className="brk-mobile" />{" "}
          <em>12-Week Programme.</em>
        </h2>
        <p className="sdp-sub" data-sdp-reveal style={{ "--d": ".10s" } as React.CSSProperties}>
          Personalised coaching designed for demanding careers and busy lives.
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
                <Glyph name={d.icon} size={24} draw />
                <span className="s09-icon-n">{d.n}</span>
              </div>
              <div className="s09-title">{d.title}</div>
              <p className="s09-desc">{d.body}</p>
            </div>
          ))}
        </div>

        <p className="s09-note" data-sdp-reveal style={{ "--d": ".48s" } as React.CSSProperties}>
          You are not paying for a plan. A plan is free on YouTube. You are paying for the system, the
          accountability, and <strong>the coach who has done this</strong> for 200+ businessmen,
          senior professionals and athletes who all looked like you before they started.
        </p>

        <FourCosts />

        <div className="s09-cta" data-sdp-reveal style={{ "--d": ".60s" } as React.CSSProperties}>
          <CtaLockup />
        </div>
      </div>
    </section>
  );
}
