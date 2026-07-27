import { cases } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SdpHead, CtaLockup } from "./sdp";
import { VideoTestimonials } from "./np/VideoTestimonials";

/* Beat 4 — The Proof / case files (SDP order: proof block before founder +
   mechanism). Proof-set → SDP case-file cards, the narrative layer beneath the
   Transformations marquee. Figures carry a "being confirmed" flag, never asserted. */
export function Proof() {
  return (
    <section id="proof" className="sdp-section sdp-light">
      <div className="sdp-wrap">
        <Reveal className="sdp-center">
          <SdpHead
            eyebrow="The proof"
            title={<>Men Who Looked Exactly Like You, <em>Before They Started</em>.</>}
            sub="This could be your story too. Full case files walked through with you on the assessment call."
          />
        </Reveal>

        {/* Client video testimonials (from the main branch) — above the case files */}
        <Reveal className="sdp-videos">
          <VideoTestimonials />
        </Reveal>

        <div className="sdp-cases">
          {cases.map((c, i) => (
            <Reveal className="sdp-card sdp-case" key={c.meta} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div className="sdp-case-media">
                <span className="ph">Before / after</span>
              </div>
              <div className="sdp-case-body">
                <div className="sdp-case-meta">{c.meta}</div>
                <div className="sdp-case-delta">{c.delta}</div>
                <p className="sdp-case-note">{c.note}</p>
                <div className="sdp-case-flag">{c.flag}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="sdp-proof-note">
          Client figures shown are being confirmed with each man before publish.
        </p>

        <Reveal>
          <CtaLockup />
        </Reveal>
      </div>
    </section>
  );
}
