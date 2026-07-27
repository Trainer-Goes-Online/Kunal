/**
 * S01 — Trust banner. Full-bleed brass bar at the very top of the landing page,
 * above the trust strip (S02) and the header (S03).
 *
 * SDP reference: `_reference/sdp/components/landing/LandingPage.tsx:180-189`
 * (`TrustBanner`) + `_reference/sdp/app/landing.css:194-210` (+ mobile 2373-2374).
 * Structure is reproduced verbatim: `role="note"` bar → pulsing dot + one uppercase
 * line with <b> accents. Only the copy (Kraft) and hue (brass) differ.
 *
 * SDP's line asserts "10+ Years of Experience and 550+ Success Stories". Neither
 * number is confirmed for Kraft (§6 Q1), so the claim renders as a visible <Gap>
 * instead of a plausible guess. The kept half — 1:1 coaching, never a template —
 * is confirmed copy (src/lib/content.ts `features`/`pointers`).
 *
 * Server component. No client JS; the bar is static (CSS-only dot pulse).
 */
import { Gap } from "@/components/shared/Gap";

export default function S01TrustBanner() {
  return (
    <div className="s01-trust-banner" role="note">
      <span className="s01-trust-banner-dot" aria-hidden="true" />
      <span className="s01-trust-banner-copy">
        <b>1:1 Coaching</b> with Kunal, never a template
        <Gap q={1}>years coaching + success-story count</Gap>
      </span>
    </div>
  );
}
