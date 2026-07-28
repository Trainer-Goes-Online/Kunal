/**
 * S06b — ELITE-ATHLETE AUTHORITY (dark band).
 *
 * New section, straight from "Kunal Full Funnel Seggregation.md" →
 * "The HIGH-PERFORMER PROTOCOL / From International Cricketers To Business
 * Leaders". Borrows the athlete's standard, not his endorsement: the copy claims
 * shared principles, which is exactly what the md claims, and nothing more.
 *
 * ASSET GAP: the md calls for "[image of Kunal with Yashasvi Jaiswal]" but ships
 * no file. The frame therefore paints the photo as a CSS background — when
 * `/public/kunal-yashasvi.jpg` lands it simply appears, and until then the frame
 * shows a labelled brass plate rather than a broken-image glyph. Path is set in
 * `content.ts` → `eliteAthlete.photo`.
 *
 * Server component; reveal via the shared `data-sdp-reveal` hook only.
 */
import { eliteAthlete as a } from "@/lib/content";

export function EliteAthlete() {
  return (
    <section id="elite" className="sdp-section sdp-dark s6b-elite">
      <div className="sdp-wrap">
        <div className="sdp-eyebrow center" data-sdp-reveal>
          {a.eyebrow}
        </div>
        <h2 className="sdp-h2" data-sdp-reveal style={{ "--d": ".06s" } as React.CSSProperties}>
          From International Cricketers To Business Leaders,
          {/* break before the accent so the underline runs under one whole
              phrase instead of splitting after "High" */}
          <br className="brk-desktop" />{" "}
          <em>High Performers Trust The Protocol.</em>
        </h2>

        <div className="s6b-grid">
          <figure
            className="s6b-photo"
            data-sdp-reveal
            style={{ "--d": ".12s" } as React.CSSProperties}
          >
            <div
              className={`s6b-photo-frame${a.photoReady ? "" : " is-pending"}`}
              style={a.photoReady ? { backgroundImage: `url("${a.photo}")` } : undefined}
              role={a.photoReady ? "img" : undefined}
              aria-label={a.photoReady ? `Kunal Chalke with ${a.name}` : undefined}
            >
              {!a.photoReady && (
                <span className="s6b-photo-plate">
                  Photo pending: Kunal &amp; {a.name}
                </span>
              )}
            </div>
          </figure>

          <div
            className="s6b-body"
            data-sdp-reveal
            style={{ "--d": ".18s" } as React.CSSProperties}
          >
            <div className="s6b-name">{a.name}</div>
            <div className="s6b-role">{a.role}</div>
            <p className="s6b-copy">{a.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
