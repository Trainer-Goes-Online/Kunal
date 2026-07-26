import { twoChoices } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SdpHead, CtaLockup } from "./sdp";

/* Beat 10 — Two Choices. Contrast/decision → weighted two-column: 01 (the drift)
   dimmed, 02 (the diagnostic he leaves with) lit + recommended. */
export function TwoChoices() {
  return (
    <section id="two-choices" className="sdp-section sdp-light">
      <div className="sdp-wrap">
        <Reveal className="sdp-center">
          <SdpHead
            eyebrow="Two choices"
            title={<>You Have Two Choices <em>From Here</em>.</>}
          />
        </Reveal>

        <div className="sdp-choices">
          <Reveal className="sdp-choice drift">
            <div className="cnum">01</div>
            <p>{twoChoices.drift}</p>
          </Reveal>
          <Reveal className="sdp-choice act" delay={1}>
            <span className="sdp-choice-tag">The one that changes it</span>
            <div className="cnum">02</div>
            <p>{twoChoices.act}</p>
          </Reveal>
        </div>

        <Reveal>
          <CtaLockup />
        </Reveal>
      </div>
    </section>
  );
}
