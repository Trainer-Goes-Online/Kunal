import { VSLFrame } from "./VSLFrame";
import { CtaLockup } from "./sdp";
import { Gap } from "./shared/Gap";
import { site } from "@/lib/site";
import { outcomes } from "@/lib/content";

/**
 * S04 · HERO + VSL — SERVER component. Structural port of SDP `Hero`
 * (_reference/sdp/components/landing/LandingPage.tsx:490-604): callout pill →
 * h1 (l1/l2) → hero-sub → marker chips → above-VSL button → VSL → CTA →
 * below-VSL line → 4-card credibility row → 4-item trust strip, with SDP's
 * reveal stagger (.06 → .42s) reproduced exactly.
 *
 * Copy is Kraft (funnel-copy/01-landing-vsl.v2-nobrainer.md Beat 1 + content.ts);
 * palette is the existing brass `.sdp-root` foundation. Any hero stat Kunal has
 * not confirmed renders as a visible <Gap q={7}/> chip, never a guess.
 */

/** SDP's four blood-marker chips → Kraft's four confirmed programme outcomes. */
const HERO_CHIPS = outcomes;

/** SDP trust strip icons, verbatim paths (landing.css strokes them, fill:none). */
const TRUST_ITEMS = [
  {
    label: "Blood markers tracked",
    path: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
  },
  {
    label: "Built for travel weeks",
    path: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </>
    ),
  },
  {
    label: "A diagnosis, never a template",
    path: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
  },
  {
    label: "Coached 1:1 by Kunal",
    path: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
  },
] as const;

export function Hero() {
  return (
    <section id="top" className="sdp-hero s04-hero">
      <div className="sdp-wrap sdp-hero-inner">
        <div className="sdp-callout">
          For the successful man 35 to 50 whose body stopped keeping up with his life
        </div>

        <h1 className="sdp-h1" data-sdp-reveal style={{ "--d": ".06s" } as React.CSSProperties}>
          <span className="sdp-h1-l1">You built the career.</span>
          <span className="sdp-h1-l2">Now build the body that matches it.</span>
        </h1>

        <p className="s04-hero-sub" data-sdp-reveal style={{ "--d": ".14s" } as React.CSSProperties}>
          In six months: <mark>15 to 20kg down</mark>, real muscle on the frame, and blood work
          moving the right way &mdash; through{" "}
          <strong>The High-Performer Protocol</strong>, a plan built around the life that made you
          successful, not a gym-rat&rsquo;s week.
        </p>

        <div
          className="s04-hero-markers"
          data-sdp-reveal
          style={{ "--d": ".16s" } as React.CSSProperties}
          aria-label="What the six months are built to deliver"
        >
          {HERO_CHIPS.map((c) => (
            <span key={c} className="sdp-marker-chip">
              <span className="sdp-marker-dot" aria-hidden />
              {c}
            </span>
          ))}
        </div>

        {/* <p className="s04-range-note" data-sdp-reveal style={{ "--d": ".18s" } as React.CSSProperties}>
          The kilo range is a directional promise, not a guarantee.
        </p> */}

        <a
          className="s04-above-vsl"
          href="#sdp-vsl"
          data-sdp-reveal
          style={{ "--d": ".20s" } as React.CSSProperties}
        >
          Watch the short video below <span aria-hidden>&darr;</span>
        </a>

        <VSLFrame />

        <div data-sdp-reveal style={{ "--d": ".26s" } as React.CSSProperties}>
          <CtaLockup />
        </div>

        {/* <p className="s04-below-vsl" data-sdp-reveal style={{ "--d": ".3s" } as React.CSSProperties}>
          A short walkthrough of why every plan collapsed the moment work got heavy, and what
          Kunal does differently.
        </p> */}

        <div className="s04-cred-row" data-sdp-reveal style={{ "--d": ".36s" } as React.CSSProperties}>
          <div className="s04-cred-card">
            <div className="s04-cred-num"><Gap q={7}>clients coached</Gap></div>
            <div className="s04-cred-lbl">Clients</div>
          </div>
          <div className="s04-cred-card">
            <div className="s04-cred-num"><Gap q={7}>years coaching</Gap></div>
            <div className="s04-cred-lbl">Coaching</div>
          </div>
          <div className="s04-cred-card">
            <div className="s04-cred-num">1:1</div>
            <div className="s04-cred-lbl">Coached by Kunal</div>
          </div>
          <div className="s04-cred-card">
            <div className="s04-cred-num">{site.assessmentFee}</div>
            <div className="s04-cred-lbl">To start</div>
          </div>
        </div>

        <div className="s04-trust" data-sdp-reveal style={{ "--d": ".42s" } as React.CSSProperties}>
          {TRUST_ITEMS.map((t) => (
            <div className="s04-trust-item" key={t.label}>
              <div className="s04-trust-icon" aria-hidden>
                <svg viewBox="0 0 24 24">{t.path}</svg>
              </div>
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
