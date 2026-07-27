/**
 * S10 — Guarantee (dark band).
 *
 * SDP reference: `_reference/sdp/components/landing/LandingPage.tsx:1566-1616`
 * (`Guarantee`) + `_reference/sdp/app/landing.css:1766-1882` (mobile 2358, 2539-2545).
 * Structure reproduced verbatim, top to bottom:
 *   dark band (+ centred radial bloom) → single centred card with a 5px gradient
 *   top-bar → rotated icon tile (shield + tick) → pill badge → h2 with <em> accent →
 *   primary promise paragraph → "What We Ask In Return" terms block (label + ticked
 *   list) → italic hairline-topped extra line.
 * Only the COPY (Kraft) and the palette (brass, from the existing tokens) differ.
 *
 * Copy source: `funnel-copy/01-landing-vsl.v2-nobrainer.md` BEAT 9 — the offer doc's
 * FOUR-WEEK REBUILD guarantee, explicitly NOT the VSL's "money-back" version
 * (`funnel-copy/00-funnel-overview.md:70` resolves this). So SDP's "100% Money-Back /
 * refund every rupee" promise is deliberately NOT carried over. The itemised terms and
 * the ₹299 assessment-fee refund terms are unconfirmed (§6 Q5, and
 * `funnel-copy/00-funnel-overview.md:63` flags the fee terms as the highest-priority
 * missing input) → visible <Gap q={5}/> chips rather than a plausible guess.
 *
 * Server component. No client JS: reveal is emitted as `data-sdp-reveal`; the icon
 * hover-straighten is pure CSS. Fully readable with JS disabled.
 */
import { Gap } from "@/components/shared/Gap";

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
            The Four-Week Guarantee
          </div>

          <h2 className="s10-title">
            You Only Fail If <em>The Work Doesn&rsquo;t Happen.</em>
          </h2>

          <p className="s10-primary">
            Follow the plan for the <strong>first four weeks</strong>. If your energy, your
            sleep, and your waist haven&rsquo;t started to move, you sit down with Kunal and{" "}
            <strong>rebuild the plan &mdash; no charge for the time</strong>.
          </p>

          <div className="s10-terms">
            <div className="s10-terms-label">What We Ask In Return</div>
            <ul className="s10-terms-list">
              <li>
                <span className="s10-ck" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>
                  <strong>You follow the plan for the first four weeks.</strong> Three honest
                  hours a week, built around your calendar &mdash; the work has to actually happen.
                </span>
              </li>
              <li>
                <span className="s10-ck" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>
                  <Gap q={5}>the remaining guarantee conditions, in Kunal&rsquo;s words</Gap>
                </span>
              </li>
            </ul>
          </div>

          <p className="s10-extra">
            The only way this fails is if the work doesn&rsquo;t happen.{" "}
            <Gap q={5}>₹299 assessment-fee refund / credit terms</Gap>
          </p>
        </div>
      </div>
    </section>
  );
}
