/* eslint-disable @next/next/no-img-element */
import { site } from "@/lib/site";
import { vimeoThumb } from "@/lib/vimeo";

/**
 * S04 · Hero VSL — SERVER component, structural port of SDP `VSLVideo`
 * (_reference/sdp/components/landing/LandingPage.tsx:368-488).
 *
 * SDP boots a Vimeo Player instance client-side; here the whole behaviour is
 * delegated: we emit the SDP markup plus `data-vimeo-id` / `data-vimeo-thumb`
 * and ClientBehaviors pre-boots the player near the viewport, then plays with
 * sound (and toggles `.playing`) on click / Enter.
 *
 * POSTER: the still is now a real frame from the film, pulled from Vimeo's
 * oEmbed thumbnail at 1280x720 — the same mechanism the testimonial tiles use.
 * It replaces the designed `/VSL_thumbnail.png` plate, so the hero shows Kunal
 * on camera rather than a title card. Resolution order:
 *   NEXT_PUBLIC_VSL_POSTER  →  live Vimeo frame  →  committed copy of it
 * The committed copy means a Vimeo outage at build time can't leave the hero
 * with an empty player.
 *
 * Fail-open: poster + play disc are real HTML, and a <noscript> iframe lets the
 * film actually play with JS disabled.
 */

/** Hero VSL — Vimeo id per MASTER-HANDOFF §6 "known facts" (SDP ships 1209777174). */
const VSL_VIMEO_ID = "1210701586";

export async function VSLFrame() {
  const fetched = await vimeoThumb(`https://vimeo.com/${VSL_VIMEO_ID}`, "1280x720");
  const poster = site.vslPoster || fetched || site.vslPosterFallback;

  return (
    <div className="s04-video-frame" data-sdp-reveal style={{ "--d": ".22s" } as React.CSSProperties}>
      <div
        className="sdp-video has-video"
        id="sdp-vsl"
        role="button"
        tabIndex={0}
        aria-label="Play the film"
        data-vimeo-id={VSL_VIMEO_ID}
        data-vimeo-thumb={poster}
      >
        <div className="sdp-video-host" />

        <div className="sdp-video-thumb on">
          <img
            src={poster}
            alt=""
            width={640}
            height={360}
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="sdp-play">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        <noscript>
          <iframe
            className="s04-video-noscript"
            src={`https://player.vimeo.com/video/${VSL_VIMEO_ID}?title=0&byline=0&portrait=0`}
            title="Kraft With Kunal — the film"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </noscript>
      </div>
    </div>
  );
}
