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
import { baCards, testimonialNames } from "@/lib/content";
import { isMediaFile, vimeoThumbs } from "@/lib/vimeo";
import { ArrowGlyph } from "./sdp";

/* SDP's inline play triangle (LandingPage.tsx:944) — same path, same viewBox. */
function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/**
 * How many times the three clips repeat inside ONE marquee set.
 * The engine wraps on a single set's width, so that width must exceed the
 * widest viewport we care about or a gap opens at the seam:
 *   3 clips × 3 repeats × (300px card + 24px gap) ≈ 2.9k px.
 */
const REPEATS = 3;

export async function Proof() {
  const testimonials = site.testimonialVideos;
  /* Posters, in priority order: an explicit NEXT_PUBLIC_TESTIMONIAL_POSTER_n,
     then the live frame from Vimeo, then the committed copy of that frame, and
     only then the branded plate. The static fallback means a Vimeo outage or a
     build machine with blocked egress can never leave these tiles blank. */
  const fetched = await vimeoThumbs(testimonials);
  const posters = testimonials.map(
    (_, i) => site.testimonialPosters[i] || fetched[i] || site.testimonialFallbacks[i] || ""
  );

  const TILE_SEQUENCE = Array.from(
    { length: testimonials.length * REPEATS },
    (_, i) => i % testimonials.length
  );

  return (
    <section id="proof" className="sdp-section sdp-light s06-proof">
      <div className="sdp-wrap">
        <div className="sdp-center">
          <div className="sdp-eyebrow center" data-sdp-reveal>
            Real senior professionals · Real results
          </div>
        </div>
        <h2 className="sdp-h2" data-sdp-reveal style={{ ["--d" as string]: ".06s" }}>
          See How High-Performing Businessmen Lost 13-20 Kilos{" "}
          <em>Without Putting Their Careers On Hold.</em>
        </h2>
        <p className="sdp-sub" data-sdp-reveal style={{ ["--d" as string]: ".10s" }}>
          These aren&rsquo;t fitness influencers. They&rsquo;re businessmen, professionals and
          entrepreneurs just like you.
        </p>
      </div>

      {/* ---------- Testimonials: infinite auto-scrolling portrait rail ----------
          Three clips is not enough to fill a wide viewport, and the marquee engine
          wraps on the width of ONE set — so the source set repeats the three tiles
          REPEATS times, and ClientBehaviors clones that whole set once more. The
          seam is therefore always off-screen and the loop reads as continuous.

          No `data-sdp-reveal` on the tiles, deliberately: the reveal observer is
          wired at mount, before the engine clones the set, so a cloned tile would
          carry the hidden state with no observer left to release it. The rail as a
          whole reveals instead. */}
      <div className="sdp-wrap s06-tcar-wrap">
        <div className="s06-tcar" id="s06-tcar" data-carousel="tcar" data-sdp-reveal>
          <div className="s06-tcar-track" data-carousel-track>
            <div className="s06-tcar-set" data-carousel-set>
              {TILE_SEQUENCE.map((idx, pos) => {
                const src = testimonials[idx];
                const poster = posters[idx];
                const name = testimonialNames[idx];
                const hasVideo = Boolean(src);
                return (
                  <article className="s06-tslide" key={`${pos}-${idx}`}>
                    <div
                      className={`s06-tslide-video${hasVideo ? " has-video" : ""}`}
                      data-tslide-idx={idx}
                      data-tslide-src={src || undefined}
                      role={hasVideo ? "button" : undefined}
                      tabIndex={hasVideo ? 0 : undefined}
                      aria-label={hasVideo ? `Play ${name}'s testimonial` : undefined}
                    >
                      {hasVideo &&
                        (poster ? (
                          <div
                            className="s06-tslide-vthumb"
                            style={{ backgroundImage: `url("${poster}")` }}
                          />
                        ) : isMediaFile(src) ? (
                          /* Direct file with no poster: the still comes from the clip
                             itself — a muted, metadata-only <video> seeked past the
                             black lead-in. Pure HTML, no client JS. */
                          <video
                            className="s06-tslide-vthumb s06-tslide-vthumb--el"
                            src={`${src}#t=0.5`}
                            preload="metadata"
                            muted
                            playsInline
                            tabIndex={-1}
                            aria-hidden
                          />
                        ) : (
                          /* Vimeo embed: a cross-origin iframe cannot be sampled for a
                             frame, so the tile shows a branded plate until a poster is
                             supplied via NEXT_PUBLIC_TESTIMONIAL_POSTER_n. */
                          <div className="s06-tslide-vthumb s06-tslide-vthumb--plate" aria-hidden />
                        ))}
                      <div className="s06-tslide-play">
                        <PlayGlyph />
                      </div>
                    </div>
                    <div className="s06-tslide-body">
                      <span className="s06-tslide-name">{name}</span>
                      <span className="s06-tslide-role">Client transformation</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Nav lives OUTSIDE the rail: the rail is edge-masked (buttons would fade)
            and is the drag surface (a press on a button would start a drag). */}
        <button
          className="s06-bacar-nav s06-tcar-prev"
          type="button"
          aria-label="Previous testimonials"
          aria-controls="s06-tcar"
          data-carousel-nav="-1"
          data-carousel-target="tcar"
        >
          <span className="s06-bacar-nav-glyph s06-bacar-nav-glyph--flip">
            <ArrowGlyph size={18} />
          </span>
        </button>
        <button
          className="s06-bacar-nav s06-tcar-next"
          type="button"
          aria-label="Next testimonials"
          aria-controls="s06-tcar"
          data-carousel-nav="1"
          data-carousel-target="tcar"
        >
          <span className="s06-bacar-nav-glyph">
            <ArrowGlyph size={18} />
          </span>
        </button>
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
      <div className="sdp-wrap s06-bacar-wrap">
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
