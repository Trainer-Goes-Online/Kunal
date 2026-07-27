/**
 * S02 — Trust strip. Light bar directly under the trust banner (S01) and above the
 * header (S03): reviewer avatar cluster + two proof items, centred and wrapping.
 *
 * SDP reference: `_reference/sdp/components/landing/LandingPage.tsx:199-228`
 * (`TrustStrip`) + `_reference/sdp/app/landing.css:212-247` (mobile 2375-2378).
 * Structure reproduced 1:1: one flex row → `.avatars` cluster of four overlapping
 * circles, then N `.item` rows of (glyph + short line with a <b> lead). Only the
 * copy (Kraft) and hue (brass) differ.
 *
 * Honesty (§6):
 * - SDP asserts "★★★★★ 5.0 Review". Kraft has no confirmed aggregate rating or
 *   review count, so the stars AND the number are withheld — the item renders as a
 *   visible <Gap q={2}/> rather than a borrowed 5.0.
 * - SDP's four reviewer portraits have no Kraft equivalent (no consented client
 *   photos in /public), so the cluster renders as four empty placeholder rings
 *   plus <Gap q={3}/>. The markup and metrics are kept so dropping real images in
 *   later is a one-line change (style={{backgroundImage:…}} per avatar).
 * - SDP's third item asserts "100% Guaranteed Results". Kraft's guarantee IS
 *   confirmed copy — the four-week rebuild guarantee (funnel-copy/01-landing-vsl.md:118,
 *   resolved in funnel-copy/00-funnel-overview.md:70; also src/lib/content.ts:199) —
 *   so it renders as fact, minus the unearned "100%".
 *
 * Server component. No client JS; the strip is static (no reveal in SDP either —
 * it sits above the fold, so it must paint immediately).
 */
import { Gap } from "@/components/shared/Gap";

/** Four slots, matching SDP's TRUST_AVATARS length. No sources until Q3 lands. */
const AVATAR_SLOTS = [0, 1, 2, 3];

export default function S02TrustStrip() {
  return (
    <div className="s02-trust-strip">
      <div className="s02-trust-strip-avatars" aria-hidden="true">
        {AVATAR_SLOTS.map((i) => (
          <span key={i} className="s02-trust-strip-avatar is-empty" />
        ))}
      </div>

      <div className="s02-trust-strip-item">
        <Gap q={3}>consented client photos for the reviewer row</Gap>
      </div>

      <div className="s02-trust-strip-item">
        <Gap q={2}>aggregate rating + review count</Gap>
      </div>

      <div className="s02-trust-strip-item">
        <span className="s02-trust-strip-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l8 3v7c0 4.97-3.35 9.26-8 10-4.65-.74-8-5.03-8-10V5l8-3z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </span>
        <span><b>Four-Week</b> Rebuild Guarantee</span>
      </div>
    </div>
  );
}
