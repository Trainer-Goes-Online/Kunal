import { CTAButton, EyebrowPill, Lit } from "./ui";
import { Reveal } from "./Reveal";
import { VSLFrame } from "./VSLFrame";
import { RupeeMark, Coach, CalendarIcon } from "./icons";

const trust = [
  { icon: <RupeeMark />, label: "For ₹25L+ earners" },
  { icon: <Coach />, label: "Coached 1:1 by Kunal" },
  { icon: <CalendarIcon />, label: "Around your calendar" },
];

export function Hero() {
  return (
    <header id="top" className="section stage grain" style={{ paddingTop: "clamp(40px,6vw,72px)" }}>
      <div className="wrap" style={{ textAlign: "center", maxWidth: 940 }}>
        <Reveal>
          <EyebrowPill>For men earning ₹25L+ · 35–50</EyebrowPill>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="display" style={{ fontSize: "clamp(32px,5.4vw,60px)", margin: "26px auto 0", maxWidth: "18ch" }}>
            You built the career. Now build the body that <Lit>matches it</Lit>.
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p style={{ maxWidth: "52ch", margin: "22px auto 0", fontSize: "clamp(16px,1.9vw,19px)", color: "var(--ink-2)", lineHeight: 1.6 }}>
            You hit every target you set — the income, the title, the standing in every room.
            Every number went up. <em>Except the one you see in the mirror.</em>
          </p>
        </Reveal>

        <Reveal delay={2}>
          <p style={{ margin: "18px auto 30px", fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: "clamp(18px,2.2vw,22px)", color: "var(--ink)" }}>
            In six months: a body that matches the life you built.
          </p>
        </Reveal>

        <Reveal delay={3} className="measure" >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <VSLFrame />
          </div>
        </Reveal>

        <Reveal delay={2}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 34 }}>
            <CTAButton micro={<>You pay, then you pick your time · No hard sell</>} />
          </div>
        </Reveal>

        <Reveal>
          <div className="trust-row" style={{ maxWidth: 640, margin: "26px auto 0" }}>
            {trust.map((t, i) => (
              <span className="item" key={t.label}>
                {i > 0 && <span className="tsep" aria-hidden>·</span>}
                <span className="ic" style={{ color: "var(--accent)" }}>{t.icon}</span>
                {t.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </header>
  );
}
