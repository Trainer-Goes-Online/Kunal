import Image from "next/image";
import { Reveal } from "./Reveal";
import { founderPills, founderStory } from "@/lib/content";

/* Beat 5 — Founder / Mentor. DARK band (SDP reserves dark for authority + risk).
   The credential SET earns pills (§12); the first-person narrative stays TEXT. */
export function Founder() {
  return (
    <section id="founder" className="sdp-section sdp-dark">
      <div className="sdp-wrap">
        <div style={{ marginBottom: 44 }}>
          <Reveal className="sdp-center">
            <div className="sdp-eyebrow center">Behind the protocol</div>
            <h2 className="sdp-h2">The Coach, And Why The Room Stays <em>Small</em>.</h2>
          </Reveal>
        </div>

        <div className="sdp-founder">
          <Reveal className="sdp-founder-photo">
            <Image
              src="/kunal-portrait.jpg"
              alt="Kunal Chalke"
              fill
              sizes="(max-width: 820px) 100vw, 40vw"
              style={{ objectFit: "cover" }}
            />
          </Reveal>

          <div>
            <Reveal className="sdp-founder-pills">
              {founderPills.map((p) => (
                <span className="sdp-founder-pill" key={p}>{p}</span>
              ))}
            </Reveal>

            <Reveal className="sdp-prose sdp-founder-story">
              {founderStory.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </Reveal>

            <Reveal className="sdp-cert">
              <div className="sdp-cert-frame">
                <Image
                  src="/kunal-hydrox.jpg"
                  alt="HYROX365 certificate — Kunal Chalke"
                  fill
                  sizes="(max-width: 820px) 100vw, 40vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <p className="sdp-cert-cap">
                HYROX365 Foundation, <em>HYROX Ready.</em> Certified 29.06.26, signed by HYROX&rsquo;s managing directors.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
