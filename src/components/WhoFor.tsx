import { fitYes, notForYou, incomeLine } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SdpHead } from "./sdp";
import { Check } from "./icons";

/* Beat 2 — This Is For You If. One-sided ✓ self-recognition list (VSL default),
   with the disqualifier folded to a single muted note beneath (takeaway selling). */
export function WhoFor() {
  return (
    <section id="who-for" className="sdp-section sdp-light">
      <div className="sdp-wrap">
        <Reveal className="sdp-center">
          <SdpHead
            eyebrow="Is this you?"
            title={<>These Are The Men The Protocol Was <em>Built For</em>.</>}
          />
        </Reveal>

        <Reveal>
          <ul className="sdp-who-list">
            {fitYes.map((f) => (
              <li key={f.head}>
                <div className="head">
                  <span className="ck"><Check size={15} /></span>
                  <span>{f.head}</span>
                </div>
                <div className="body">{f.body}</div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <p className="sdp-disqualify">{notForYou}</p>
          <p className="sdp-income-line">{incomeLine}</p>
        </Reveal>
      </div>
    </section>
  );
}
