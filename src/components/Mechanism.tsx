import { phases } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SdpHead, CtaLockup } from "./sdp";

/* Beat 6 — The Mechanism. Sequence of N named phases → numbered PILLAR ledger
   (the SDP mechanism builder-pick: "the N principles of our method", not
   old-vs-new compare). Four cards, each an SDP pillar tile. */
export function Mechanism() {
  return (
    <section id="mechanism" className="sdp-section sdp-light">
      <div className="sdp-wrap">
        <Reveal className="sdp-center">
          <SdpHead
            eyebrow="The mechanism"
            title={<>One System. Four Phases. You Feel Each One <em>End</em>.</>}
            sub="The High-Performer Protocol: structure that fits the life that made you successful, not a gym-rat's week."
          />
        </Reveal>

        <div className="sdp-pillars">
          {phases.map((p, i) => (
            <Reveal className="sdp-card sdp-pillar" key={p.n} delay={((i % 2) + 1) as 1 | 2}>
              <span className="sdp-pillar-num">{p.n}</span>
              <div className="sdp-pillar-body">
                <div className="sdp-pillar-label">{p.label}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="sdp-mech-reframe">
            It was never your discipline, you have more of that than most. It was <em>the plan</em>,
            every one built for a man with a simple life. This isn&rsquo;t about willpower. It&rsquo;s about
            structure that fits the life that made you successful.
          </p>
        </Reveal>

        <p className="sdp-lengths-note">
          One system, two lengths: a <strong>90-Day Reset</strong> and a <strong>6-Month Transformation</strong>.
          Same engine, same coach, same standard. The length is the only real choice you make.
        </p>

        <Reveal>
          <CtaLockup />
        </Reveal>
      </div>
    </section>
  );
}
