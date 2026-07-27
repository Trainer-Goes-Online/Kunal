/* eslint-disable @next/next/no-img-element */
import { site } from "@/lib/site";

/**
 * S04 · Hero VSL — SERVER component, structural port of SDP `VSLVideo`
 * (_reference/sdp/components/landing/LandingPage.tsx:368-488).
 *
 * SDP boots a Vimeo Player instance client-side; here the whole behaviour is
 * delegated: we emit the SDP markup plus `data-vimeo-id` / `data-vimeo-thumb`
 * and ClientBehaviors pre-boots the player near the viewport, then plays with
 * sound (and toggles `.playing`) on click / Enter.
 *
 * Fail-open: poster + play disc are real HTML, and a <noscript> iframe lets the
 * film actually play with JS disabled.
 */

/** Hero VSL — Vimeo id per MASTER-HANDOFF §6 "known facts" (SDP ships 1209777174). */
const VSL_VIMEO_ID = "1210701586";

export function VSLFrame() {
  return (
    <div className="s04-video-frame" data-sdp-reveal style={{ "--d": ".22s" } as React.CSSProperties}>
      <div
        className="sdp-video has-video"
        id="sdp-vsl"
        role="button"
        tabIndex={0}
        aria-label="Play the film"
        data-vimeo-id={VSL_VIMEO_ID}
        data-vimeo-thumb={site.vslPoster}
      >
        <div className="sdp-video-host" />

        <div className="sdp-video-thumb on">
          <img
            src={site.vslPoster}
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
