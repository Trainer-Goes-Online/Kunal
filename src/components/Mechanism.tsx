/**
 * S08 — MECHANISM (light-alt band).
 *
 * SDP reference: `_reference/sdp/components/landing/LandingPage.tsx:1295-1333`
 * (`Mechanism`) + `_reference/sdp/app/landing.css:940-1008` (mobile 2329, 2353,
 * 2451-2452; hover micro-motion 2720-2725). Structure reproduced 1:1:
 *   section.sdp-mech.sdp-light-alt
 *     └ .sdp-wrap
 *        ├ .sdp-center-wrap > .sdp-eyebrow.center           (reveal, no delay)
 *        ├ h2.sdp-h2                                        (reveal --d .06s)
 *        ├ p.<mech-sub-body>  italic/muted/13.5px           (reveal --d .10s)
 *        ├ .<pillars> grid 1fr 1fr, 4 × .<pillar>           (reveal --d .06 + i*.06)
 *        │    └ num badge → title → desc
 *        └ p.<mech-closing>  italic, border-top             (reveal --d .30s)
 *
 * Only the COPY (Kraft — `src/lib/content.ts` `phases`, `funnel-copy/
 * 01-landing-vsl.v2-nobrainer.md` Beat 6) and the palette (already brass in the
 * .sdp-root foundation) differ. Bespoke CSS lives in `sections/Mechanism.css`,
 * namespaced `.s08-*` so it cannot collide with the legacy `.sdp-pillar*` rules
 * still in globals.css (which encode a different, pre-SDP pillar layout).
 *
 * Server component. Reveal is delegated: `data-sdp-reveal` + inline `--d`.
 * No CTA here — SDP's Mechanism carries none, and §7 lists the CtaLockup only
 * for S05 / S09 / S11 (see manifest deviation note).
 */
import { phases } from "@/lib/content";

export function Mechanism() {
  return (
    <section id="mechanism" className="sdp-section sdp-light-alt s08-mech">
      <div className="sdp-wrap">
        <div className="sdp-center-wrap">
          <div className="sdp-eyebrow center" data-sdp-reveal>
            The Mechanism
          </div>
        </div>

        <h2 className="sdp-h2" data-sdp-reveal style={{ "--d": ".06s" } as React.CSSProperties}>
          One System. Four Phases. You Feel Each One <em>End</em>.
        </h2>

        <p
          className="s08-mech-sub-body"
          data-sdp-reveal
          style={{ "--d": ".10s" } as React.CSSProperties}
        >
          Through The High-Performer Protocol, a plan built around the life that made you
          successful, not a gym-rat&rsquo;s week.
        </p>

        <div className="s08-pillars">
          {phases.map((p, idx) => (
            <div
              key={p.n}
              className="s08-pillar"
              data-sdp-reveal
              style={{ "--d": `${0.06 + idx * 0.06}s` } as React.CSSProperties}
            >
              <div className="s08-pillar-num">{p.n}</div>
              <div className="s08-pillar-label">{p.label}</div>
              <div className="s08-pillar-title">{p.title}</div>
              <p className="s08-pillar-desc">{p.body}</p>
            </div>
          ))}
        </div>

        <p
          className="s08-lengths-note"
          data-sdp-reveal
          style={{ "--d": ".26s" } as React.CSSProperties}
        >
          One system, two lengths: a <strong>90-Day Reset</strong> and a{" "}
          <strong>6-Month Transformation</strong>. Same engine, same coach, same standard.{" "}
          <strong>The length is the only real choice you make.</strong>
        </p>

        <p
          className="s08-mech-closing"
          data-sdp-reveal
          style={{ "--d": ".30s" } as React.CSSProperties}
        >
          This isn&rsquo;t about willpower. It&rsquo;s about structure that fits the life that
          made you successful.
        </p>
      </div>
    </section>
  );
}
