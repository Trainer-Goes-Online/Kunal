import { fitYes, fitNo } from "@/lib/content";
import { Reveal } from "./Reveal";
import { Check, Cross } from "./icons";

export function WhoFor() {
  return (
    <section id="who-for" className="section section--alt">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Who this is for</div>
          <h2 className="display">Selective, <span className="lit">on purpose</span>.</h2>
          <p className="deck">Saying no to the wrong man is what makes the right man lean in.</p>
        </Reveal>

        <div className="fit">
          <Reveal className="fit-col yes">
            <h4>This is for you if</h4>
            {fitYes.map((t) => (
              <div className="fit-li" key={t}>
                <span className="mk" style={{ color: "var(--accent)" }}><Check size={18} /></span>
                <span>{t}</span>
              </div>
            ))}
          </Reveal>

          <Reveal className="fit-col no" delay={1}>
            <h4>This is not for you if</h4>
            {fitNo.map((t) => (
              <div className="fit-li" key={t}>
                <span className="mk" style={{ color: "var(--ink-3)" }}><Cross size={18} /></span>
                <span>{t}</span>
              </div>
            ))}
          </Reveal>
        </div>

        <p className="fit-rule" style={{ textAlign: "center" }}>
          If you earn under ₹25 lakh a year, this isn&rsquo;t the program for you.
        </p>
      </div>
    </section>
  );
}
