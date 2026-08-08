import { SdpHead } from "@/components/sdp";
import { instagram } from "@/lib/qualify";

/**
 * THE INSTAGRAM BAND — "you're not left empty handed".
 *
 * Shared by /thank-you-disqualified and /unsubscribe_emails: both are pages
 * someone reaches at the end of a "no", and on both the free content is the
 * only thing left worth offering. Extracted so the profile mock exists once —
 * it was ~130 lines of markup and a second copy would have drifted.
 *
 * The mock mirrors an Instagram profile's structure, skinned in brass. Nothing
 * is invented: the reasons are the landing page's own pillars, the avatar is
 * the real profile picture, and the stats row renders ONLY if real numbers are
 * set in `instagram.stats` — otherwise the Instagram glyph takes its place.
 * A made-up follower count on a page about honesty would be a poor joke.
 *
 * Styles: src/components/sections/InstagramFollow.css (`.igf-*`, scoped to
 * `.sdp-root`, so any route inside the brass foundation can mount this).
 */

const REASONS = [
  <>The same <em>system thinking</em> this page is built on, broken down post by post.</>,
  <>How to train and eat around travel, client dinners and a 12-hour day — not around a rest week that never comes.</>,
  <>Real transformations from business owners and senior professionals, with what actually changed.</>,
];

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4 4 10-10.5" />
    </svg>
  );
}

function IgGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function InstagramFollow({
  eyebrow = "You're not left empty handed",
  title,
  sub,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <section className="sdp-section sdp-light-alt igf" aria-label="Follow Kunal on Instagram">
      <div className="sdp-wrap">
        <div data-sdp-reveal>
          <SdpHead
            eyebrow={eyebrow}
            title={
              title ?? (
                <>
                  The free work doesn&rsquo;t stop here. <em>Come and take it.</em>
                </>
              )
            }
            sub={
              sub ?? (
                <>
                  Follow Kunal on Instagram for free, practical content on fitness, fat loss,
                  nutrition and building a healthier body around a demanding career.
                </>
              )
            }
          />
        </div>

        <div className="igf-split">
          {/* ---- reasons ---- */}
          <div className="igf-why" data-sdp-reveal style={{ ["--d" as string]: ".08s" }}>
            <h3 className="igf-why-title">Why it&rsquo;s worth following</h3>
            <ul className="igf-why-list">
              {REASONS.map((reason, i) => (
                <li key={i}>
                  <span className="ic" aria-hidden="true">
                    <CheckGlyph />
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            <p className="igf-why-foot">
              None of it costs anything.{" "}
              <strong>Take it whether or not you ever work with Kunal.</strong>
            </p>
          </div>

          {/* ---- profile mock ---- */}
          <div className="igf-phone" data-sdp-reveal style={{ ["--d" as string]: ".14s" }}>
            <div className="igf-bar">
              <span className="igf-back" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </span>
              <span className="igf-bar-handle">{instagram.handle}</span>
              <span className="igf-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </div>

            <div className="igf-body">
              <div className="igf-idrow">
                <span className="igf-ring">
                  <span className="igf-avatar">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={instagram.avatar}
                      alt={`${instagram.name} on Instagram`}
                      loading="lazy"
                    />
                  </span>
                </span>

                {instagram.stats ? (
                  <dl className="igf-stats">
                    <div>
                      <dt>{instagram.stats.posts}</dt>
                      <dd>posts</dd>
                    </div>
                    <div>
                      <dt>{instagram.stats.followers}</dt>
                      <dd>followers</dd>
                    </div>
                    <div>
                      <dt>{instagram.stats.following}</dt>
                      <dd>following</dd>
                    </div>
                  </dl>
                ) : (
                  <span className="igf-mark" aria-hidden="true">
                    <IgGlyph />
                  </span>
                )}
              </div>

              <div className="igf-meta">
                <span className="igf-name">{instagram.name}</span>
                <p className="igf-bio">
                  {instagram.bio.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <span className="igf-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
                    <path d="M10 13.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-5-5L11 7.5" />
                    <path d="M14 10.5a3.5 3.5 0 0 0-5 0L6.5 13a3.5 3.5 0 0 0 5 5l1.5-1.5" />
                  </svg>
                  {instagram.bioLink}
                </span>
              </div>

              <div className="igf-actions">
                <a
                  className="igf-follow"
                  href={instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow
                </a>
                <span className="igf-ghost" aria-hidden="true">
                  Message
                </span>
                <span className="igf-ghost igf-ghost--sq" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>

            <a
              className="igf-cta"
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IgGlyph className="ig" />
              Follow @{instagram.handle}
              <svg className="arr" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 10h11M11 5.5L15.5 10 11 14.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
