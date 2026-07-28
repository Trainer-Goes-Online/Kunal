import { fitYes } from "@/lib/content";
import { CtaLockup } from "./sdp";

/* ================================================================
   S05 — WHO THIS IS FOR
   SDP ref: `WhoThisIsFor` — _reference/sdp/components/landing/LandingPage.tsx:666-698
   CSS ref: _reference/sdp/app/landing.css:800-853 (+ 2347-2352, 2441, 2712-2717, 2810-2816)

   Structure reproduced 1:1 from SDP: section > .sdp-wrap > [center-wrap > eyebrow]
   + h2 + <ul> of check-rows + CTA slot. Reveal delays are SDP's shipped values
   (h2 .06s; list .04/.10/.16/.22/.28s; CTA .34s). Server component — behaviour is
   delegated (data-sdp-reveal only).

   Copy = Kraft (content.ts fitYes / notForYou / incomeLine + funnel-copy
   01-landing-vsl.v2-nobrainer.md BEAT 2). SDP's rows are one paragraph with a bold
   lead-in; Kraft's rows carry the same shape as head + body, so head renders as the
   <strong> lead-in and body as the run-on — same DOM as SDP.
================================================================ */

/** SDP's inline check glyph — landing.css sizes it via `.ck svg` (13px, stroke-width 3). */
function WhoCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const DELAYS = [".04s", ".10s", ".16s", ".22s", ".28s"] as const;

export function WhoFor() {
  return (
    <section id="who-for" className="s05-who sdp-light">
      <div className="sdp-wrap s05-wrap">
        <div className="s05-center-wrap">
          <div className="sdp-eyebrow center" data-sdp-reveal>
            For high-performing businessmen &amp; senior professionals
          </div>
        </div>

        <h2
          className="sdp-h2"
          data-sdp-reveal
          style={{ "--d": ".06s" } as React.CSSProperties}
        >
          This Is For You <em>If:</em>
        </h2>

        <ul className="s05-who-list">
          {fitYes.map((f, i) => (
            <li
              key={f.head}
              data-sdp-reveal
              style={{ "--d": DELAYS[i] ?? ".28s" } as React.CSSProperties}
            >
              <span className="ck">
                <WhoCheck />
              </span>
              <span>
                <strong>{f.head}</strong> {f.body}
              </span>
            </li>
          ))}
        </ul>

        <div
          className="s05-who-cta"
          data-sdp-reveal
          style={{ "--d": ".34s" } as React.CSSProperties}
        >
          <CtaLockup />
        </div>
      </div>
    </section>
  );
}
