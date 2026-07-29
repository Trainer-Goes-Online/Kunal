/**
 * S10 — Guarantee (dark band).
 *
 * Copy source: "Kunal Full Funnel Seggregation.md" → "100% Results Guarantee".
 * This REPLACES the previous four-week rebuild guarantee, which came from the
 * older offer draft: the client-signed md commits to a full refund if the
 * 8-12 kilo / 90-day outcome isn't hit, and lists three qualifying conditions.
 * Both former <Gap> placeholders (terms + fee treatment) are therefore retired —
 * the md answers them.
 *
 * The same promise is mirrored on /refund, the trust strip and the sticky bar;
 * all four read from `content.guarantee` so they cannot drift apart.
 *
 * Server component. No client JS: reveal is emitted as `data-sdp-reveal`; the
 * icon hover-straighten is pure CSS. Fully readable with JS disabled.
 */
import { guarantee } from "@/lib/content";

export function Guarantee() {
  return (
    <section id="guarantee" className="sdp-section sdp-dark s10-guarantee">
      <div className="sdp-wrap">
        <div className="s10-card" data-sdp-reveal>
          <div className="s10-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l8 3v7c0 4.97-3.35 9.26-8 10-4.65-.74-8-5.03-8-10V5l8-3z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>

          <div className="s10-badge">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l8 3v7c0 4.97-3.35 9.26-8 10-4.65-.74-8-5.03-8-10V5l8-3z" />
            </svg>
            {guarantee.badge}
          </div>

          {/* <h2 className="s10-title">
            Hit The Outcome, Or <em>Every Rupee Comes Back.</em>
          </h2> */}

          <p className="s10-primary">{guarantee.promise}</p>

          <div className="s10-terms">
            <div className="s10-terms-label">{guarantee.qualifyLabel}</div>
            <ul className="s10-terms-list">
              {guarantee.qualify.map((q, i) => (
                <li key={i}>
                  <span className="s10-ck" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="s10-extra">
            The only way this fails is if the work doesn&rsquo;t happen.
          </p>
        </div>
      </div>
    </section>
  );
}
