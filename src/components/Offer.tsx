import { deliverables, fourCosts } from "@/lib/content";
import { Reveal } from "./Reveal";
import { GuaranteeSeal } from "./icons";
import { Lit } from "./ui";
import { OfferLedger } from "./np/OfferLedger";

export function Offer() {
  return (
    <section id="offer" className="section">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">What working with Kunal is</div>
          <h2 className="display">You&rsquo;re not paying for a plan. A plan is <span className="lit">free on YouTube</span>.</h2>
          <p className="deck">
            You&rsquo;re paying for the system, the accountability, and the coach who&rsquo;s done this
            for a lawyer, a banker, and an engineer who all looked like you before they started.
          </p>
        </Reveal>

        {/* Deliverables ledger — value shown, not invoiced. No price column (reserved for the call).
            Rows reveal + ignite as you scroll; hover (or center-in-view on touch) highlights a row. */}
        <OfferLedger items={deliverables} />

        {/* Four costs erased — a 2×2 grid, deliberately varied from the ledger above. */}
        <Reveal className="section-head" >
          <h2 className="display" style={{ fontSize: "clamp(24px,3vw,36px)", marginTop: "clamp(56px,7vw,84px)" }}>
            The four costs, erased.
          </h2>
        </Reveal>
        <Reveal>
          <div className="costs">
            {fourCosts.map((c) => (
              <div className="cost" key={c.k}>
                <div className="k">{c.k}</div>
                <div className="v">{c.v}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Guarantee — bespoke seal weld */}
        <Reveal className="guarantee">
          <span className="seal" style={{ color: "var(--accent)" }}>
            <GuaranteeSeal size={64} />
          </span>
          <div className="g-body">
            <h4>The four-week guarantee</h4>
            <p>
              Follow the plan for the first four weeks. If your energy, your sleep, and your waist
              haven&rsquo;t started to move, you sit down with Kunal and rebuild the plan — <Lit>no charge for the time</Lit>.
              The only way this fails is if the work doesn&rsquo;t happen.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
