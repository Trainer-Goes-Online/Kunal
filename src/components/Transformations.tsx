import { Reveal } from "./Reveal";
import { SdpHead } from "./sdp";
import { transformations } from "@/lib/content";

/* Beat 3 — Transformations. Proof-at-a-glance → SDP before/after marquee (the
   number-glance layer; the narrative lives in the case cards below, so the two
   proof beats stay varied). Photos are placeholders until Kunal shares them;
   the marquee reads on the deltas alone until then. Figures being confirmed. */
export function Transformations() {
  const row = transformations.map((t) => (
    <div className="sdp-ba-tile" key={t.who}>
      <div className="sdp-ba-media">
        <span className="ba-tag before">Before</span>
        <span className="ba-tag after">After</span>
      </div>
      <div className="sdp-ba-meta">
        <span className="who">{t.who}</span>
        <span className="delta">{t.from} → {t.to}</span>
        <span className="note">{t.tag}</span>
      </div>
    </div>
  ));

  return (
    <section id="transformations" className="sdp-section sdp-light-alt">
      <div className="sdp-wrap">
        <Reveal className="sdp-center">
          <SdpHead
            eyebrow="Stubborn weight. A body they stopped recognising."
            title={<>Real Men. Real Numbers. <em>Results That Held</em>.</>}
          />
        </Reveal>
      </div>
      <div className="sdp-marquee" aria-label="Client transformations (figures being confirmed)">
        <div className="sdp-marquee-track">
          {row}{row}
        </div>
      </div>
    </section>
  );
}
