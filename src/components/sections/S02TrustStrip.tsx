/**
 * S02 — Trust strip. Light bar directly under the trust banner (S01) and above the
 * header (S03): reviewer avatar cluster + the rating + the guarantee.
 *
 * Copy: "Kunal Full Funnel Seggregation.md" hero strip line 2 —
 * "[Photos] ★★★★★ 5.0 Review | 100% Results Guarantee". The rating and the
 * guarantee are now client-confirmed, so both former <Gap>s are retired.
 *
 * The md marked the reviewer portraits as "[Photos]" without supplying any. They
 * now come from the SAME source as the testimonial tiles: the real opening frame
 * of each client's video, pulled from Vimeo (src/lib/vimeo.ts). So the faces in
 * this cluster are the faces in the testimonials, and nothing is stock or
 * invented. A clip that Vimeo can't resolve falls back to a brass ring.
 *
 * Async server component. No client JS; the strip is static — it sits above the
 * fold, so it must paint immediately.
 */
import { site } from "@/lib/site";
import { testimonialAvatarCrop } from "@/lib/content";
import { vimeoThumbs } from "@/lib/vimeo";

export default async function S02TrustStrip() {
  /* Ask for the PORTRAIT frame, not a square one: cropping to the face is done
     in CSS below, where it can be tuned, rather than by Vimeo's centre crop. */
  const fetched = await vimeoThumbs(site.testimonialVideos, "360x640");
  const avatars = site.testimonialVideos.map(
    (_, i) => site.testimonialPosters[i] || fetched[i] || site.testimonialFallbacks[i] || ""
  );

  return (
    <div className="s02-trust-strip">
      <div className="s02-trust-strip-avatars" aria-hidden="true">
        {avatars.map((src, i) => {
          const crop = testimonialAvatarCrop[i];
          return (
            <span
              key={i}
              className={`s02-trust-strip-avatar${src ? "" : " is-empty"}`}
              style={
                src
                  ? {
                      backgroundImage: `url("${src}")`,
                      backgroundSize: crop ? `${crop.zoom} auto` : "cover",
                      backgroundPosition: `center ${crop ? crop.focus : "50%"}`,
                    }
                  : undefined
              }
            />
          );
        })}
      </div>

      <div className="s02-trust-strip-item">
        <span className="s02-trust-strip-stars" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z" />
            </svg>
          ))}
        </span>
        <span>
          <b>{site.clientRating}</b> Review
        </span>
      </div>

      <div className="s02-trust-strip-item">
        <span className="s02-trust-strip-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l8 3v7c0 4.97-3.35 9.26-8 10-4.65-.74-8-5.03-8-10V5l8-3z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </span>
        <span>
          <b>100%</b> Results Guarantee
        </span>
      </div>
    </div>
  );
}
