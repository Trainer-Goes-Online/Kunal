import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { EyebrowPill, Lit } from "@/components/ui";
import { Arrow, Check, Plus } from "@/components/icons";
import { Colophon } from "@/components/Colophon";
import { ProgressSteps } from "@/components/np/ProgressSteps";
import { CalendarEmbed } from "@/components/np/CalendarEmbed";

export const metadata: Metadata = {
  title: "Book your assessment — Kraft With Kunal",
  robots: { index: false, follow: false },
};

const covers = [
  { n: "01", h: "An honest read on what's actually stalling your body.", p: "Not a generic diagnosis — Kunal looks at your training history, your markers, and your real week, and tells you where the block actually is." },
  { n: "02", h: "The real pattern in your week.", p: "The meetings, the travel, the late dinners, the “kal se” that never comes. He finds the pattern the last plan ignored — because that pattern is what beat every plan before it." },
  { n: "03", h: "Whether the Protocol is the right fit — straight.", p: "If it fits your life right now, he'll tell you. If it doesn't, he'll tell you that too. You leave knowing where you stand, either way." },
];

const trust = [
  ["1:1 with Kunal", "Not a team member. He runs every assessment himself."],
  ["Details in your inbox", "The call link and confirmation land the moment you book."],
  ["Free reschedule", "Up to 24 hours before, no questions."],
];

const faqs = [
  { q: "Is the call directly with Kunal?", a: "Yes — every assessment is Kunal himself, not a team member. That's the whole point of keeping the numbers small.", open: true },
  { q: "What if I need to reschedule?", a: "Reschedule freely up to 24 hours before, straight from your calendar invite. Just don't leave the slot empty — someone else is on the list.", open: false },
];

export default function BookACallPage() {
  return (
    <>
      <div className="topstrip">
        <div className="topstrip-inner"><ProgressSteps /></div>
      </div>

      <main>
        <section className="section stage" style={{ textAlign: "center", paddingBottom: "clamp(28px,3vw,40px)" }}>
          <div className="wrap" style={{ maxWidth: 760 }}>
            <Reveal><EyebrowPill>One step left</EyebrowPill></Reveal>
            <Reveal delay={1}>
              <h1 className="display" style={{ fontSize: "clamp(30px,4.4vw,50px)", margin: "22px auto 0", maxWidth: "16ch" }}>
                Your fee is in. Now <Lit>lock the slot</Lit>.
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ maxWidth: "52ch", margin: "18px auto 0", color: "var(--ink-2)", fontSize: "clamp(15px,1.6vw,17px)", lineHeight: 1.6 }}>
                Pick the time you&rsquo;ll actually keep. Kunal reviews your details before you speak, so the
                hour is spent on you — not on getting up to speed.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Calendar */}
        <section id="calendar" className="section" style={{ paddingTop: 0 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            {/* <Reveal className="section-head" >
              <h2 className="display" style={{ fontSize: "clamp(22px,2.8vw,32px)" }}>Pick a slot</h2>
              <p className="deck">Times shown in your local zone. Choose the one you&rsquo;ll keep — it&rsquo;s held for you the moment you book.</p>
            </Reveal> */}
            <Reveal><CalendarEmbed /></Reveal>
            <div className="trust-cards">
              {trust.map(([h, p]) => (
                <Reveal className="tc" key={h}>
                  <span className="ck"><Check size={16} /></span>
                  <span><strong style={{ color: "var(--ink)", fontWeight: 600 }}>{h}.</strong> {p}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* What your assessment covers */}
        <section className="section section--alt">
          <div className="wrap">
            <Reveal className="section-head">
              <div className="eyebrow">The paid hour</div>
              <h2 className="display">What your assessment <Lit>covers</Lit>.</h2>
            </Reveal>
            <div className="numcards">
              {covers.map((c, i) => (
                <Reveal className="numcard" delayMs={i * 90} key={c.n}>
                  <div className="n">{c.n}</div>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why-now / loss aversion */}
        <section className="section">
          <div className="wrap">
            <Reveal className="urgency-band">
              <h3>The hard part is already done.</h3>
              <p>
                Plenty of men pay, then leave the booking for &ldquo;later&rdquo; — and later is exactly the
                calendar that&rsquo;s kept them stuck for years. You&rsquo;ve already cleared the paid step. This is
                thirty seconds.
              </p>
              <a className="cta-big" href="#calendar">Pick my slot<Arrow size={18} /></a>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="section section--alt">
          <div className="wrap" style={{ maxWidth: 820 }}>
            <Reveal className="section-head">
              <div className="eyebrow">Before you book</div>
              <h2 className="display">A couple of <Lit>questions</Lit>.</h2>
            </Reveal>
            <Reveal className="faq">
              {faqs.map((f, i) => (
                <details className="faq-row" key={f.q} name="bookfaq" open={f.open}>
                  <summary className="faq-q">
                    <span className="qidx">Q.{String(i + 1).padStart(2, "0")}</span>
                    <span className="qtext">{f.q}</span>
                    <span className="faq-ic"><Plus size={14} /></span>
                  </summary>
                  <div className="faq-a"><p>{f.a}</p></div>
                </details>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Final CTA band */}
        <section className="section stage" style={{ textAlign: "center" }}>
          <div className="wrap" style={{ maxWidth: 640 }}>
            <Reveal>
              <h2 className="display" style={{ fontSize: "clamp(26px,3.6vw,42px)", margin: "0 auto 22px", maxWidth: "18ch" }}>
                You&rsquo;ve paid. Now lock the assessment.
              </h2>
            </Reveal>
            <Reveal delay={1}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <a className="cta-big" href="#calendar">Pick my slot<Arrow size={18} /></a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Colophon />
    </>
  );
}
