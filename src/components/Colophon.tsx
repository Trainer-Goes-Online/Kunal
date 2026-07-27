/**
 * S12 — Footer. Rebuilt 1:1 against SDP's `LandingFooter`
 * (_reference/sdp/components/landing/LandingPage.tsx:1716-1740) on the existing
 * brass `.sdp-root` foundation. Structure reproduced exactly: dark band →
 * `.sdp-wrap` → wordmark (`.copy`, gradient-filled display caps) → legal /
 * medical disclaimer paragraph → copyright line → a single inline `·`-separated
 * links row. Only the copy (Kraft) and hue (brass) differ.
 *
 * Bespoke CSS: src/components/sections/S12Footer.css (namespaced `.s12-…`).
 * SDP's own footer CSS (landing.css:2025-2056, mobile 2576-2579) is not in
 * globals.css yet, so it is ported there rather than reused.
 *
 * Copy provenance (§6 — nothing invented):
 * - "coach, not a doctor … not medical advice" — funnel-copy/02-call-booking.md:113
 *   (verbatim across 03-checkout.md:81 and 04-thank-you.md:57).
 * - "Results vary … not a guarantee of enrolment" — the shipped Colophon copy
 *   this file replaces.
 * - Meta / FACEBOOK / INSTAGRAM trademark notice — generic, factually true of any
 *   non-Meta site; kept because SDP ships it and Kraft runs Meta traffic.
 * - Brand + year from `site.brand`; legal routes /privacy, /terms, /refund exist.
 * No unconfirmed number, name or claim appears, so no <Gap> is emitted.
 *
 * Server component. No client JS: the footer is static in SDP too (no
 * data-sdp-reveal — it must paint even if the observer never runs).
 *
 * Note: this component is also mounted by /book-a-call, /thank-you and
 * LegalLayout, which are NOT inside `.sdp-root`. The stylesheet therefore
 * selects on `.s12-foot` alone and every token read carries a literal fallback
 * (the same pattern SDP ships), so it renders correctly off the landing page.
 */
import Link from "next/link";
import { site } from "@/lib/site";

export function Colophon() {
  return (
    <footer className="s12-foot">
      <div className="sdp-wrap s12-foot-wrap">
        <div className="s12-foot-copy">{site.brand}</div>
        <p>
          All content, systems and coaching services provided by {site.brand} are intended for
          educational and informational purposes only and do not guarantee specific results.
          Kunal is a coach, not a doctor — he works alongside your doctor, never around him. The
          assessment is coaching guidance, not medical advice or diagnosis. Always consult a
          qualified healthcare professional before making changes to your diet, exercise or
          lifestyle. Client results vary with individual factors such as consistency, medical
          history, lifestyle and adherence to the process; outcomes are not typical or
          guaranteed. This is an application, not a guarantee of enrolment. This website is not
          affiliated with or endorsed by Meta. FACEBOOK and INSTAGRAM are trademarks of Meta
          Platforms, Inc.
        </p>
        <p className="s12-foot-copyright">© 2026 {site.brand}. All rights reserved.</p>
        <div className="s12-foot-links">
          <Link href="/privacy">Privacy Policy</Link>
          <span aria-hidden="true"> · </span>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <span aria-hidden="true"> · </span>
          <Link href="/refund">Refund Policy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Colophon;
