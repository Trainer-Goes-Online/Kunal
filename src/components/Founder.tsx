/**
 * S07 — Founder authority / "Meet Your Coach" (DARK band).
 *
 * Copy source: "Kunal Full Funnel Seggregation.md" → MEET YOUR COACH. The
 * credential list (ACSM, ASCA Level 1, INFS, HYROX Head Judge) and both bio
 * paragraphs are verbatim from that document.
 *
 * The single HYROX certificate figure the previous build carried is replaced by
 * the md's five-item press + certification row, running as a slow left-to-right
 * rail ("if these articles and certifications can be shown in a moving way from
 * left to right, that'll be good"). The rail reuses the existing marquee engine
 * in ClientBehaviors via `data-carousel="credcar"`; with JS off it degrades to a
 * plain horizontally-scrollable strip, and every card is a real outbound link.
 *
 * ASSET GAP: only the HYROX certificate exists in /public today. The other four
 * cards paint their image as a CSS background, so a missing file shows the
 * card's own titled brass plate instead of a broken image. Drop the files at the
 * paths in `content.ts` → `credentials[].img` and they light up with no code
 * change.
 *
 * Server component. No client JS of its own.
 */
import Image from "next/image";
import { founderPills, founderStory, credentials } from "@/lib/content";

const [intro, bio, closing] = founderStory;

/* SDP's closing block leads with a bolded claim, then the plain-weight rest.
   founderStory[2] has the same shape, so the lead sentence is split off. */
const closingLeadEnd = closing.indexOf(". ") + 1;
const closingLead = closing.slice(0, closingLeadEnd);
const closingRest = closing.slice(closingLeadEnd);

export function Founder() {
  return (
    <section id="founder" className="s07-founder sdp-dark">
      <div className="sdp-wrap">
        <div className="sdp-eyebrow center" data-sdp-reveal>
          Meet Your Coach
        </div>
        <h2 className="sdp-h2" data-sdp-reveal style={{ "--d": ".06s" } as React.CSSProperties}>
          Athlete-Turned-Coach Who Built A Fitness System
          <br />
          For <em>High Performers.</em>
        </h2>

        <p
          className="s07-founder-intro"
          data-sdp-reveal
          style={{ "--d": ".12s" } as React.CSSProperties}
        >
          {intro}
        </p>

        <div className="s07-founder-grid">
          <div
            className="s07-founder-card"
            data-sdp-reveal
            style={{ "--d": ".16s" } as React.CSSProperties}
          >
            <div className="s07-founder-photo">
              <Image
                className="s07-founder-img"
                src="/kunal-coach.jpg"
                alt="Kunal Chalke, coach and founder of Kraft With Kunal"
                width={1050}
                height={1400}
                sizes="(max-width: 640px) 220px, (max-width: 960px) 280px, 340px"
              />
            </div>

            <div className="s07-founder-body">
              <div className="s07-founder-name">KUNAL CHALKE</div>
              <div className="s07-founder-role">
                Athlete-Turned-Fitness Coach · HYROX Head Judge
              </div>

              <ul className="s07-founder-pills">
                {founderPills.map((p) => (
                  <li className="s07-founder-pill" key={p}>
                    {p}
                  </li>
                ))}
              </ul>

              <p className="s07-founder-bio">{bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Press + certifications, slow left-to-right rail ---- */}
      <div className="sdp-wrap">
        <h3 className="s07-cred-head" data-sdp-reveal>
          Recognised &amp; Certified
        </h3>
      </div>

      {/* Boxed to the page grid, not full-bleed. The card is no longer one big
          <a>: the IMAGE opens the asset in a lightbox (a certificate should be
          readable in place, not bounce the visitor out to Google Drive), and only
          a PRESS card's text links out to the publication, in a new tab. */}
      <div className="sdp-wrap">
        <div className="s07-credrail" data-carousel="credcar" data-sdp-reveal>
          <div className="s07-credrail-track" data-carousel-track>
            <div className="s07-credrail-set" data-carousel-set>
              {credentials.map((c, idx) => {
                const isPress = c.kind === "Press";
                // Press items link out only when a href is set. Some are
                // intentionally commented out in content.ts (dead/placeholder
                // links) — those render as plain, non-clickable titles.
                const href = (c as { href?: string }).href;
                return (
                  <div className="s07-cred-card" key={c.title}>
                    <button
                      type="button"
                      className={`s07-cred-img${c.ready ? "" : " is-pending"}`}
                      style={
                        c.ready
                          ? { backgroundImage: `url("${c.img}")`, backgroundPosition: c.focus }
                          : undefined
                      }
                      data-cred-idx={idx}
                      aria-label={`View ${c.title} full size`}
                    >
                      {!c.ready && <span className="s07-cred-plate">{c.source}</span>}
                    </button>

                    <div className="s07-cred-meta">
                      <span className="s07-cred-kind">{c.kind}</span>
                      {isPress && href ? (
                        <a
                          className="s07-cred-title s07-cred-title--link"
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {c.title}
                          <span className="s07-cred-ext" aria-hidden>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 4h6v6" />
                              <path d="M20 4l-8.5 8.5" />
                              <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                            </svg>
                          </span>
                        </a>
                      ) : (
                        <span className="s07-cred-title">{c.title}</span>
                      )}
                      <span className="s07-cred-src">{c.source}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Credential lightbox shell — inert until ClientBehaviors adds `.on`.
          Lives inside the section so the `.sdp-root`-scoped CSS applies. */}
      <div className="s07-credbox" data-credbox role="dialog" aria-modal="true" aria-hidden="true" hidden>
        <div className="s07-credbox-inner">
          <button className="s07-credbox-close" type="button" aria-label="Close" data-credbox-close>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button className="s07-credbox-nav s07-credbox-prev" type="button" aria-label="Previous" data-credbox-nav="-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="s07-credbox-img" alt="" data-credbox-img src={credentials[0].img} />
          <button className="s07-credbox-nav s07-credbox-next" type="button" aria-label="Next" data-credbox-nav="1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className="s07-credbox-cap" data-credbox-cap />
        </div>
      </div>

      <div className="sdp-wrap">
        <div
          className="s07-founder-closing"
          data-sdp-reveal
          style={{ "--d": ".28s" } as React.CSSProperties}
        >
          <strong>{closingLead}</strong>
          {closingRest}
        </div>
      </div>
    </section>
  );
}
