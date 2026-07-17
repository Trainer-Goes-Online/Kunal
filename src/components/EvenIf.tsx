import { faqs } from "@/lib/content";
import { Reveal } from "./Reveal";
import { Plus } from "./icons";

/* Native <details name> accordion — single-open, and FAIL-OPEN: works with no JS.
   The "most asked" objection is open by default (C8). */
export function EvenIf() {
  return (
    <section id="even-if" className="section">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Even if…</div>
          <h2 className="display">The honest answers to <span className="lit">what&rsquo;s stopping you</span>.</h2>
        </Reveal>

        <Reveal className="faq">
          {faqs.map((f, i) => (
            <details className="faq-row" key={f.q} name="faq" open={f.mostAsked}>
              <summary className="faq-q">
                <span className="qidx">Q.{String(i + 1).padStart(2, "0")}</span>
                <span className="qtext">
                  {f.q}
                  {f.mostAsked && (
                    <span className="faq-tag"><span className="d" />Most asked</span>
                  )}
                </span>
                <span className="faq-ic"><Plus size={14} /></span>
              </summary>
              <div className="faq-a">
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
