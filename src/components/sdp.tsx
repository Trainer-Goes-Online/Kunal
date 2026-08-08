import { site } from "@/lib/site";
import { ctaBadges } from "@/lib/content";
import { Glyph } from "./icons";
import { OfferTimer } from "./OfferTimer";

/** Plain arrow glyph for the CTA's circular chip (no ".arrow" class so it
 *  doesn't inherit the SDP circle styling meant for its wrapper). */
export function ArrowGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** SDP section masthead — dash-eyebrow + display H2 (accent word via <em>) + sub. */
export function SdpHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <>
      <div className="sdp-eyebrow center">{eyebrow}</div>
      <h2 className="sdp-h2">{title}</h2>
      {sub && <p className="sdp-sub">{sub}</p>}
    </>
  );
}

/**
 * THE CTA LOCKUP — one group, reused verbatim after every proof beat (~6x).
 *
 * FIXED ORDER, client-specified, identical at every occurrence on the page:
 *   1. the button
 *   2. the three reassurance badges
 *   3. the urgency countdown
 *
 * The monthly-capacity pill and the "diagnostic session, not a pitch" note used
 * to close this group; both were removed at the client's request.
 *
 * Keeping the countdown inside the lockup rather than only in the hero is what
 * makes the group repeatable; every timer instance reads the same localStorage
 * deadline, so they all show the same number and stay in sync.
 *
 * Button label and badges are the funnel md's own. The md prints the badges with
 * emoji; they render here as the repo's line glyphs, because the skin brief bans
 * emoji in chrome.
 *
 * NO PAYMENT. This funnel takes none: the button carries `data-qualify-open`,
 * so QualifyModal intercepts the click and runs the six-step qualifier, then
 * hands off to /book-a-call. The href IS /book-a-call, which is what makes the
 * interception safe — with JS off the link books directly.
 */
export function CtaLockup() {
  return (
    <div className="sdp-lockup">
      <a className="sdp-cta" href={site.bookUrl} data-qualify-open>
        <span className="sdp-cta-main">
          <span className="cta-label">
            Click Here To Get Your Personalised High-Performer Fitness Roadmap
          </span>
          <span className="arrow"><ArrowGlyph /></span>
        </span>
      </a>

      <div className="sdp-risk-strip">
        {ctaBadges.map((b) => (
          <span className="sdp-risk-badge" key={b.label}>
            <span className="sdp-risk-icon-gold">
              <Glyph name={b.icon} size={15} />
            </span>
            {b.label}
          </span>
        ))}
      </div>

      <OfferTimer />
    </div>
  );
}
