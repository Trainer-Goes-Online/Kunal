import { VSLFrame } from "./VSLFrame";
import { CtaLockup } from "./sdp";
import { site, kiloRange } from "@/lib/site";
import { outcomes, heroStats } from "@/lib/content";

/**
 * S04 · HERO + VSL — SERVER component.
 *
 * Copy source: "Kunal Full Funnel Seggregation.md" hero block, top to bottom:
 * qualifier callout → three-line H1 (the 8-12 kilos / 90 days promise) →
 * Protocol sub → the "200+ have used it to achieve" lead-in → four outcome chips
 * → watch-below cue → VSL → CTA lockup → offer countdown → the four-cell stat
 * ledger. (The four-item icon trust strip that used to close the hero was
 * removed at the client's request.)
 *
 * Every number is read from `site`/`content`, never typed inline, so the client
 * can move the fee, the kilo range or the proof figures from Vercel env without a
 * code change. The only client component in here is the countdown.
 */
const HERO_CHIPS = outcomes;

export function Hero() {
  return (
    <section id="top" className="sdp-hero s04-hero">
      <div className="sdp-wrap sdp-hero-inner">
        <div className="sdp-callout">
          For high-performing business owners &amp; professionals 35+ whose body has stopped
          matching their success
        </div>

        <h1 className="sdp-h1" data-sdp-reveal style={{ "--d": ".06s" } as React.CSSProperties}>
          <span className="sdp-h1-l1">
            Lose Up To{" "}
            <span className="s04-h1-kilos">{kiloRange} Kilos</span>{" "}
            In The Next {site.promiseDays} Days
          </span>
          <span className="sdp-h1-l2">
            &amp; Start Looking Like The Successful Man You Are.
          </span>
        </h1>

        <p className="s04-hero-sub" data-sdp-reveal style={{ "--d": ".14s" } as React.CSSProperties}>
          Using our <strong>High-Performer Protocol</strong>, designed around travel, long
          workdays, client dinners, and demanding schedules, not the lifestyle of a
          full-time gym-goer.
        </p>

        <p
          className="s04-hero-lead"
          data-sdp-reveal
          style={{ "--d": ".15s" } as React.CSSProperties}
        >
          {/* One deliberate break, before "to lose", so the highlighted kilo box
              always starts a line and can never be split in half. Everything
              before it wraps on its own with `text-wrap: balance`, which
              adapts to any width — a hard mobile break here orphaned
              "professionals" onto its own line on narrower phones. */}
          <strong>{site.successStories}</strong>{" "}
          high-performing businessmen &amp; professionals have used the{" "}
          <strong>High-Performer Protocol</strong>
          <br />{" "}
          to lose <mark>{kiloRange} kilos</mark> and achieve:
        </p>

        <div
          className="s04-hero-markers"
          data-sdp-reveal
          style={{ "--d": ".16s" } as React.CSSProperties}
          aria-label="What the protocol is built to deliver"
        >
          {HERO_CHIPS.map((c) => (
            <span key={c} className="sdp-marker-chip">
              <span className="sdp-marker-dot" aria-hidden />
              {c}
            </span>
          ))}
        </div>

        <a
          className="s04-above-vsl"
          href="#sdp-vsl"
          data-sdp-reveal
          style={{ "--d": ".20s" } as React.CSSProperties}
        >
          Watch the short video below
          <span className="s04-above-vsl-arrow" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v14" />
              <path d="M6 13l6 6 6-6" />
            </svg>
          </span>
        </a>

        <VSLFrame />

        <div data-sdp-reveal style={{ "--d": ".26s" } as React.CSSProperties}>
          <CtaLockup />
        </div>

        <div className="s04-cred-row" data-sdp-reveal style={{ "--d": ".36s" } as React.CSSProperties}>
          {heroStats.map((s) => (
            <div className="s04-cred-card" key={s.v}>
              <div className="s04-cred-num">{s.k}</div>
              <div className="s04-cred-lbl">{s.v}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
