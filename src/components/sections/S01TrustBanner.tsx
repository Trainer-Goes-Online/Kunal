/**
 * S01 — Trust banner. Full-bleed brass bar at the very top of the landing page,
 * above the trust strip (S02) and the header (S03).
 *
 * Copy: "Kunal Full Funnel Seggregation.md" hero strip line 1 —
 * "200+ SUCCESS STORIES | 15-20 KGS LOST PER CLIENT". Both numbers are now
 * client-confirmed, so the <Gap> this component used to carry is retired. The
 * success-story figure reads from `site.successStories` so it can be moved from
 * Vercel env without a code change.
 *
 * Each figure renders as number + label rather than one bolded run: brass-bright
 * bold text on the brass bar had almost no contrast and read as blended. The
 * number now sits in a dark graphite chip, the label in solid white.
 *
 * Server component. No client JS; the bar is static (CSS-only dot pulse).
 */
import { trustBanner } from "@/lib/content";

export default function S01TrustBanner() {
  return (
    <div className="s01-trust-banner" role="note">
      <span className="s01-trust-banner-dot" aria-hidden="true" />
      <span className="s01-trust-banner-copy">
        <span className="s01-tb-item">
          <b className="s01-tb-num">{trustBanner.storiesNum}</b>
          <span className="s01-tb-label">{trustBanner.storiesLabel}</span>
        </span>
        <span className="s01-trust-banner-sep" aria-hidden="true">|</span>
        <span className="s01-tb-item">
          <b className="s01-tb-num">{trustBanner.perClientNum}</b>
          <span className="s01-tb-label">{trustBanner.perClientLabel}</span>
        </span>
      </span>
    </div>
  );
}
