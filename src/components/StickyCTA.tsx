/**
 * S13 — Sticky bottom strip (page chrome).
 *
 * SDP reference: `_reference/sdp/components/landing/LandingPage.tsx:1746-1795`
 * (`StickyBottomStrip`) + `_reference/sdp/app/landing.css:2059-2148` (mobile
 * 2581-2631). Structure reproduced 1:1: fixed dark-glass bar with a sweeping
 * accent hairline → `inner` flex row → left `meta` (pulse dot + display headline
 * with an <em> accent + a two-badge trust row separated by a middot) → right
 * brass CTA button whose label wraps onto a second line on mobile.
 *
 * Server component. All behaviour is delegated: the bar ships hidden
 * (`.sdp-stuck` is translated 120% off-screen) and `ClientBehaviors` adds `.on`
 * once the hero leaves the viewport, keyed off `data-sticky-cta`. With JS off
 * the bar simply never appears — the page keeps its six inline CTA lockups, so
 * nothing is lost (fail-open).
 *
 * Honesty: SDP's two badges assert "100% Money-Back Guarantee" and "550+
 * Success Stories". Kraft's guarantee is the four-week guarantee (content.ts
 * `offerLedger` Risk row / funnel-copy beat 9), so badge 1 states that. No
 * client-volume number is confirmed (§6 Q1), so badge 2 carries the confirmed
 * capacity fact (`site.monthlySlots`) instead of a success-story count — the
 * badge slot is preserved without asserting an unconfirmed number.
 */
import { site } from "@/lib/site";
import { ArrowGlyph } from "./sdp";

export function StickyCTA() {
  return (
    <div className="sdp-stuck s13-stuck" data-sticky-cta>
      <div className="s13-inner">
        <div className="s13-meta">
          <span className="s13-pulse" aria-hidden="true" />
          <div className="s13-text">
            <div className="s13-h">
              A body that matches <em>the life you built.</em>
            </div>
            <div className="s13-s">
              <span className="s13-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2l8 3v7c0 4.97-3.35 9.26-8 10-4.65-.74-8-5.03-8-10V5l8-3z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span>
                  <b>100%</b> Results Guarantee
                </span>
              </span>
              <span className="s13-badge-sep" aria-hidden="true">·</span>
              <span className="s13-badge">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="12 2 15 8.5 22 9.3 17 14 18.3 21 12 17.5 5.7 21 7 14 2 9.3 9 8.5 12 2" />
                </svg>
                <span>
                  <b>{site.successStories}</b> Success Stories
                </span>
              </span>
            </div>
          </div>
        </div>

        <a className="sdp-cta s13-cta" href={site.checkoutUrl}>
          <span className="sdp-cta-main">
            <span className="cta-label s13-cta-text">Click Here To Get Your Personalised High-Performer Fitness Roadmap</span>
            <span className="arrow">
              <ArrowGlyph />
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}
