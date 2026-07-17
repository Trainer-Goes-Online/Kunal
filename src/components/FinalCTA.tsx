import { site } from "@/lib/site";
import { Reveal } from "./Reveal";
import { CTAButton } from "./ui";

export function FinalCTA() {
  return (
    <section id="apply" className="section stage" style={{ textAlign: "center" }}>
      <div className="wrap" style={{ maxWidth: 720 }}>
        <Reveal>
          <div className="capacity">
            <span className="d" aria-hidden />
            Only {site.monthlySlots} assessments open each month
          </div>
        </Reveal>

        <Reveal delay={1}>
          <h2 className="display" style={{ fontSize: "clamp(28px,4vw,46px)", margin: "0 auto 18px", maxWidth: "20ch" }}>
            You&rsquo;re not buying the program here. You&rsquo;re applying for an assessment.
          </h2>
        </Reveal>

        <Reveal delay={2}>
          <p style={{ maxWidth: "48ch", margin: "0 auto 32px", color: "var(--ink-2)", fontSize: "clamp(15px,1.7vw,17px)", lineHeight: 1.7 }}>
            Kunal coaches every man himself, so the calendar stays short. He reviews your situation
            and tells you straight — a fit, or not.
          </p>
        </Reveal>

        <Reveal delay={2}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CTAButton micro={<>A small assessment fee — you pay, then you pick your time. No hard sell.</>} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
