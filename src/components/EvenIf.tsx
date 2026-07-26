import { faqs } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SdpHead } from "./sdp";
import { Plus } from "./icons";

/* Beat 11 — FAQ / Even-If. Objection-set → SDP rotate-to-× FAQ. Built on native
   <details> (single-open via name) so it is FAIL-OPEN with no JS; the "most
   asked" legitimacy objection opens by default. */
export function EvenIf() {
  return (
    <section id="faq" className="sdp-section sdp-light-alt">
      <div className="sdp-wrap">
        <Reveal className="sdp-center">
          <SdpHead
            eyebrow="Before you book"
            title={<>The Honest Answers To <em>What&rsquo;s Stopping You</em>.</>}
          />
        </Reveal>

        <Reveal>
          <div style={{ maxWidth: "var(--sdp-cw)", margin: "0 auto" }}>
            {faqs.map((f) => (
              <details className="sdp-q" key={f.q} name="faq" open={f.mostAsked}>
                <summary className="sdp-q-head">
                  <span>
                    {f.q}
                    {f.mostAsked && (
                      <span className="sdp-q-tag"><span className="d" />Most asked</span>
                    )}
                  </span>
                  <span className="ic"><Plus size={14} /></span>
                </summary>
                <div className="sdp-q-body">
                  <p>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
