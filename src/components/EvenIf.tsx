import { faqs } from "@/lib/content";
import { CtaLockup } from "./sdp";

/**
 * S11 — FAQ ("Common Questions").
 *
 * SDP reference: `_reference/sdp/components/landing/LandingPage.tsx:1655-1710`
 * (`LandingFAQ`) + `_reference/sdp/app/landing.css:1885-1939` (mobile 2359, 2548-2549;
 * open-scale 2756-2757). Structure reproduced 1:1: light band → centred eyebrow →
 * `.sdp-h2` with an <em> accent → 840px-capped list of rows → centred CTA lockup
 * 44px below the list. Only the copy (Kraft, from src/lib/content.ts `faqs`) and the
 * hue (brass, already themed) differ.
 *
 * Deviation from SDP, deliberate: SDP drives the accordion from React state
 * (`.sdp-q.open` + max-height transition), which renders CLOSED and unreadable with
 * JS off. This keeps the repo's native `<details name="faq">` accordion — the browser
 * gives single-open for free, so the section is genuinely fail-open and needs no entry
 * in ClientBehaviors. Row chrome (`.sdp-q`, `.sdp-q-head`, `.sdp-q-body`, `.sdp-q-tag`)
 * is the existing keyed-to-[open] port in globals.css; S11Faq.css only adds SDP's
 * list cap, CTA spacing, open-scale and 640px type pass.
 *
 * Server component. No client JS; reveal is the delegated `data-sdp-reveal` hook.
 */
export function EvenIf() {
  return (
    <section id="faq" className="sdp-section sdp-light s11-faq">
      <div className="sdp-wrap">
        {/* <div className="sdp-eyebrow center" data-sdp-reveal>
          Common Questions
        </div> */}
        <h2
          className="sdp-h2"
          data-sdp-reveal
          style={{ "--d": ".06s" } as React.CSSProperties}
        >
          COMMON QUESTIONS FROM 
          <br className="brk-mobile" />{" "}
          <em>HIGH-PERFORMING BUSINESSMEN & PROFESSIONALS</em>
        </h2>

        <div className="s11-list">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              data-sdp-reveal
              style={{ "--d": `${0.06 + i * 0.04}s` } as React.CSSProperties}
            >
              <details className="sdp-q" name="faq" open={f.mostAsked}>
                <summary className="sdp-q-head">
                  <span>
                    {f.q}
                    {f.mostAsked && (
                      <span className="sdp-q-tag">
                        <span className="d" />
                        Most asked
                      </span>
                    )}
                  </span>
                  <span className="ic" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </summary>
                <div className="sdp-q-body">
                  {/* The old build appended a programme-price <Gap> to an
                      "investment" question. The funnel md's question set has no
                      such question — the price is deliberately reserved for the
                      call — so the branch was dead and has been removed. */}
                  <p>{f.a}</p>
                </div>
              </details>
            </div>
          ))}
        </div>

        <div className="s11-faq-cta" data-sdp-reveal>
          <CtaLockup />
        </div>
      </div>
    </section>
  );
}
