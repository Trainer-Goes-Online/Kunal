/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";
import { SdpHead } from "./sdp";
import { baCards } from "@/lib/content";

/* Beat 3 — Transformations. The real before/after cards from the main branch, in a
   continuous SDP marquee. Each card is self-contained (name + photos + story), so
   tiles are image-only — no overlaid caption that could contradict the card. */
export function Transformations() {
  const row = (
    <>
      {baCards.map((src) => (
        <div className="sdp-ba-tile sdp-ba-tile--card" key={src}>
          <div className="sdp-ba-media sdp-ba-media--img">
            <img src={src} alt="Client transformation, before and after" loading="lazy" />
          </div>
        </div>
      ))}
    </>
  );

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
      <div className="sdp-marquee" aria-label="Client transformations">
        <div className="sdp-marquee-track">
          {row}{row}
        </div>
      </div>
    </section>
  );
}
