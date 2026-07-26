import { deliverables, fourCosts } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SdpHead } from "./sdp";

/* Beat 8 — The Programme / What's Included. Accumulation → seven-item numbered
   LEDGER (deliberately a hairline ledger, not cards, to vary from the Mechanism
   pillar cards above). Then the four costs erased as a 2×2. No program price. */
export function Programme() {
  return (
    <section id="programme" className="sdp-section sdp-light-alt">
      <div className="sdp-wrap">
        <Reveal className="sdp-center">
          <SdpHead
            eyebrow="What's included"
            title={<>One Operating System For Your Body, <em>Not A Folder Of PDFs</em>.</>}
            sub="Seven parts that work together, not a stack of files you'll never open."
          />
        </Reveal>

        <div className="sdp-ledger">
          {deliverables.map((d) => (
            <Reveal className="sdp-ledger-row" key={d.n}>
              <span className="sdp-pillar-num">{d.n}</span>
              <div>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="sdp-programme-line">
          You are not paying for a plan. A plan is free on YouTube. You are paying for the system, the
          accountability, and <strong>the coach who has done this</strong> for a lawyer, a banker, and
          an engineer who all looked like you before they started.
        </p>

        <Reveal>
          <div className="sdp-costs">
            {fourCosts.map((c) => (
              <div className="sdp-cost" key={c.k}>
                <div className="k">{c.k}</div>
                <div className="v">{c.v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
