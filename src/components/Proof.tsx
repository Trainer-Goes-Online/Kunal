/**
 * S06 — PROOF: video testimonials + before/after.
 *
 * SDP reference (structure reproduced 1:1):
 *   `_reference/sdp/components/landing/LandingPage.tsx:1201-1225` — `ProofSection`
 *   `_reference/sdp/components/landing/LandingPage.tsx:774-961`   — `TestimonialCarousel`
 *   `_reference/sdp/components/landing/LandingPage.tsx:980-1199`  — `BeforeAfterGrid`
 *   CSS: `_reference/sdp/app/landing.css:1145-1318` (proof + both carousels),
 *        `2153-2231` (lightbox), `2239-2300` (video modal) — ported to `.s06-*`
 *        in `src/components/sections/S06Proof.css`.
 *
 * DEVIATION FROM SDP (deliberate, client-directed): SDP runs its testimonials as a
 * second auto-scrolling marquee because it has a dozen of them. We have exactly
 * THREE, all phone-shot portrait, so they render as a static one-row portrait grid
 * — all three in frame on desktop, one per row under 860px. No rail, nothing
 * sliding out of view, each clip shown at its native 9/16. Only the before/after
 * rail stays a marquee.
 *
 * SERVER COMPONENT. All motion (auto-scroll marquee, drag, manual nav,
 * tap→modal/lightbox) is delegated to `ClientBehaviors.tsx` via these hooks:
 *
 *   Testimonials  static grid; tiles: [data-tslide-idx] [data-tslide-src] (MP4 URL)
 *                 overlay shell: [data-vmodal="tcar"]  (hidden until .on)
 *   Before/after  [data-carousel="bacar"] › [data-carousel-track] › [data-carousel-set]
 *                 cards: [data-ba-idx] [data-ba-src]
 *                 manual nav: [data-carousel-nav="-1|1"][data-carousel-target="bacar"]
 *                 overlay shell: [data-lbox="bacar"]  (hidden until .on)
 *
 * Fail-open: every tile/card is real HTML. With JS off the marquee simply doesn't
 * move, the overlays never open, and the rail stays hand-scrollable.
 *
 * Honesty: the three testimonial videos are confirmed (env
 * `NEXT_PUBLIC_TESTIMONIAL_VIDEO_1..3`), but their names/roles/quotes are NOT
 * (§6 Q8) — so each tile body carries a visible <Gap q={8}> instead of an invented
 * name or quote. The six before/after cards are self-contained and anonymous, so —
 * exactly as SDP ships them — they render image-only with no caption body.
 */
import { site } from "@/lib/site";
import { baCards } from "@/lib/content";
import { Gap } from "@/components/shared/Gap";
import { ArrowGlyph } from "./sdp";

/* SDP's inline play triangle (LandingPage.tsx:944) — same path, same viewBox. */
function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function Proof() {
  const testimonials = site.testimonialVideos;

  return (
    <section id="proof" className="sdp-section sdp-light s06-proof">
      <div className="sdp-wrap">
        <div className="sdp-center">
          <div className="sdp-eyebrow center" data-sdp-reveal>
            Real senior professionals · Real results
          </div>
        </div>
        <h2 className="sdp-h2" data-sdp-reveal style={{ ["--d" as string]: ".06s" }}>
          Men Who <em>Stopped Restarting</em>.
        </h2>
        <p className="sdp-sub" data-sdp-reveal style={{ ["--d" as string]: ".10s" }}>
          Clients like you. Founders, GMs, engineers, corporate leaders — 35 to 50, and
          done starting over.
        </p>
      </div>

      {/* ---------- Testimonials: static 2×2 portrait grid ---------- */}
      <div className="sdp-wrap">
        <div className="s06-tgrid">
          {testimonials.map((src, idx) => {
            const poster = site.testimonialPosters[idx];
            const hasVideo = Boolean(src);
            return (
              <article
                className="s06-tslide"
                key={idx}
                data-sdp-reveal
                style={{ ["--d" as string]: `${0.06 * idx + 0.06}s` }}
              >
                <div
                  className={`s06-tslide-video${hasVideo ? " has-video" : ""}`}
                  data-tslide-idx={idx}
                  data-tslide-src={src || undefined}
                  role={hasVideo ? "button" : undefined}
                  tabIndex={hasVideo ? 0 : undefined}
                  aria-label={hasVideo ? `Play client testimonial ${idx + 1}` : undefined}
                >
                  {hasVideo &&
                    (poster ? (
                      <div
                        className="s06-tslide-vthumb"
                        style={{ backgroundImage: `url("${poster}")` }}
                      />
                    ) : (
                      /* No poster asset exists yet, so the still comes from the clip
                         itself: a muted metadata-only <video> seeked past the black
                         lead-in. Pure HTML — needs no client JS. */
                      <video
                        className="s06-tslide-vthumb s06-tslide-vthumb--el"
                        src={`${src}#t=0.5`}
                        preload="metadata"
                        muted
                        playsInline
                        tabIndex={-1}
                        aria-hidden
                      />
                    ))}
                  <div className="s06-tslide-play">
                    <PlayGlyph />
                  </div>
                </div>
                <div className="s06-tslide-body">
                  <Gap q={8}>name, role &amp; pull-quote for video {idx + 1}</Gap>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="sdp-wrap">
        <h3 className="s06-ba-head" data-sdp-reveal>
          Before &amp; After Transformations
        </h3>
      </div>

      {/* ---------- Before/after carousel (SDP `.sdp-bacar`) ----------
          The rail and its manual nav are siblings: the buttons must sit OUTSIDE
          `.s06-bacar`, which is both edge-masked (they'd fade out) and the drag
          surface (a press on a button would start a drag). */}
      <div className="s06-bacar-wrap">
        <div className="s06-bacar" id="s06-bacar" data-carousel="bacar" data-sdp-reveal>
          <div className="s06-bacar-track" data-carousel-track>
            <div className="s06-bacar-set" data-carousel-set>
              {baCards.map((src, idx) => (
                <div
                  className="s06-ba-card"
                  key={src}
                  data-ba-idx={idx}
                  data-ba-src={src}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open client transformation ${idx + 1}`}
                >
                  <div className="s06-ba-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt="Client transformation, before and after"
                      width={1000}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Manual nav — one card per press, and the drift holds for a beat after
            (the client file pauses on press, same as it does on hover/drag). */}
        <button
          className="s06-bacar-nav s06-bacar-prev"
          type="button"
          aria-label="Previous transformations"
          aria-controls="s06-bacar"
          data-carousel-nav="-1"
          data-carousel-target="bacar"
        >
          <span className="s06-bacar-nav-glyph s06-bacar-nav-glyph--flip">
            <ArrowGlyph size={18} />
          </span>
        </button>
        <button
          className="s06-bacar-nav s06-bacar-next"
          type="button"
          aria-label="Next transformations"
          aria-controls="s06-bacar"
          data-carousel-nav="1"
          data-carousel-target="bacar"
        >
          <span className="s06-bacar-nav-glyph">
            <ArrowGlyph size={18} />
          </span>
        </button>
      </div>

      {/* ---------- Overlay shells (inert until ClientBehaviors adds `.on`) ----------
          They live INSIDE the section on purpose: the ported CSS is scoped to
          `.sdp-root`, so an overlay appended to <body> by the client file would be
          unstyled. ClientBehaviors should fill + toggle these, not build its own. */}
      <div className="s06-vmodal" data-vmodal="tcar" role="dialog" aria-modal="true" aria-hidden="true" hidden>
        <div className="s06-vmodal-shell">
          <button className="s06-vmodal-close" type="button" aria-label="Close video" data-vmodal-close>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="s06-vmodal-content" data-vmodal-content />
        </div>
      </div>

      <div className="s06-lbox" data-lbox="bacar" role="dialog" aria-modal="true" aria-hidden="true" hidden>
        <div className="s06-lbox-content">
          <button className="s06-lbox-close" type="button" aria-label="Close" data-lbox-close>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button className="s06-lbox-nav s06-lbox-prev" type="button" aria-label="Previous" data-lbox-nav="-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="s06-lbox-img" alt="Client transformation, before and after" data-lbox-img src={baCards[0]} width={1000} height={1000} />
          <button className="s06-lbox-nav s06-lbox-next" type="button" aria-label="Next" data-lbox-nav="1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className="s06-lbox-counter" data-lbox-counter>
            1 / {baCards.length}
          </div>
        </div>
      </div>
    </section>
  );
}
