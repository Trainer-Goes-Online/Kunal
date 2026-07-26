import { Reveal } from "./Reveal";
import { GuaranteeSeal } from "./icons";

/* Beat 9 — The Guarantee. Assurance (+seal) → SDP dark guarantee card (the
   second of the two dark bands, alongside the founder). */
export function Guarantee() {
  return (
    <section id="guarantee" className="sdp-section sdp-dark-alt">
      <div className="sdp-wrap">
        <Reveal className="sdp-guarantee-card">
          <div className="sdp-guarantee-icon">
            <GuaranteeSeal size={48} />
          </div>
          <div className="sdp-eyebrow center" style={{ justifyContent: "center" }}>The four-week guarantee</div>
          <h3>You Only Fail If The Work Doesn&rsquo;t Happen.</h3>
          <p>
            Follow the plan for the first four weeks. If your energy, your sleep, and your waist
            haven&rsquo;t started to move, you sit down with Kunal and rebuild the plan, <span className="lit">no charge for the time</span>.
            The only way this fails is if the work doesn&rsquo;t happen.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
