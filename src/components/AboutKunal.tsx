import Image from "next/image";
import { Reveal } from "./Reveal";
import { Lit } from "./ui";

const pills = ["HYROX-Certified", "HYROX Head Judge", "Coaches 1:1", "Coach, not a doctor"];

export function AboutKunal() {
  return (
    <section id="about" className="section section--alt">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">The coach</div>
          <h2 className="display">
            He built his own body the same way you built your career — now he does it for men who <Lit>run companies</Lit>.
          </h2>
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-photo">
            <Image
              src="/kunal-portrait.jpg"
              alt="Kunal Chalke"
              fill
              sizes="(max-width: 820px) 100vw, 44vw"
              style={{ objectFit: "cover" }}
            />
          </Reveal>

          <div className="about-body">
            <Reveal>
              <p>
                Kunal Chalke wasn&rsquo;t handed a good physique. He built one — deliberately, over years,
                with the same discipline you use to run a P&amp;L: a standard, a system, and no excuse
                accepted on a bad week.
              </p>
              <p>
                He&rsquo;s not a hype account or a gym influencer. He&rsquo;s an operator who treats a body the way
                you treat a business — assess, plan, execute, review — and has spent his career doing
                exactly this for men who don&rsquo;t have time to get it wrong.
              </p>
            </Reveal>

            <Reveal className="cred-pills">
              {pills.map((p) => (
                <span className="cred-pill" key={p}>{p}</span>
              ))}
            </Reveal>

            <Reveal className="about-points">
              <p><strong>He coaches you personally, 1:1.</strong> The man who reviews your assessment is the man who coaches your week — which is why he takes only a limited number of clients at a time.</p>
              <p><strong>He systemises fitness like a business.</strong> The same way you built SOPs, teams and systems at work, he builds one for your body — one that survives a bad week, a flight, and a table full of food you&rsquo;re expected to eat.</p>
              <p><strong>A coach, not a doctor.</strong> His wife is the doctor. He works alongside yours, reading your markers back in plain language — never around him.</p>
            </Reveal>

            <Reveal className="cert-card">
              <div className="cert-frame">
                <Image
                  src="/kunal-hydrox.jpg"
                  alt="HYROX365 certificate — Kunal Chalke"
                  fill
                  sizes="(max-width: 820px) 100vw, 44vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <p className="cert-cap">
                HYROX365 Foundation — <em>HYROX Ready.</em> Certified 29.06.26, signed by HYROX&rsquo;s managing directors.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
