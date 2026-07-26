import { site } from "@/lib/site";
import { Check } from "./icons";

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
 * THE CTA LOCKUP — reused verbatim after every proof beat (~6x).
 * SDP below-CTA stack, but the red urgency timer is replaced with a CALM brass
 * capacity line (Kunal is calm high-ticket; scarcity is his real calendar).
 * The only number is the assessment fee (env), shown in the button.
 */
export function CtaLockup() {
  return (
    <div className="sdp-lockup">
      <a className="sdp-cta" href={site.checkoutUrl}>
        <span className="sdp-cta-main">
          Book Your Assessment
          <span className="arrow"><ArrowGlyph /></span>
        </span>
        <span className="cta-sub">{site.assessmentFee} to apply</span>
      </a>

      <p className="sdp-cta-roadmap">
        Kunal&rsquo;s eyes on your case, and your personalised body and health roadmap.
      </p>

      <div className="sdp-risk-strip">
        <span className="sdp-risk-badge"><span className="sdp-risk-icon-gold"><Check size={15} /></span>90-Day or 6-Month</span>
        <span className="sdp-risk-badge"><span className="sdp-risk-icon-green"><Check size={15} /></span>Coached 1:1</span>
        <span className="sdp-risk-badge"><span className="sdp-risk-icon-blue"><Check size={15} /></span>₹25L+ men only</span>
      </div>

      <div className="sdp-capacity">
        <span className="dot" aria-hidden />
        Only {site.monthlySlots} assessments open each month.
      </div>

      <p className="sdp-cta-note">
        A diagnostic session, not a pitch. If you&rsquo;re not the right fit, Kunal tells you honestly.
      </p>
    </div>
  );
}
