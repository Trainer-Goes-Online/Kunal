import { Reveal } from "./Reveal";
import { Lit } from "./ui";
import { VideoTestimonials } from "./np/VideoTestimonials";
import { BeforeAfterCarousel } from "./np/BeforeAfterCarousel";

export function Proof() {
  return (
    <section id="proof" className="section section--alt">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Proof</div>
          <h2 className="display">Men who looked exactly like you — <Lit>before they started</Lit>.</h2>
          <p className="deck">
            Busy, successful, out of time — and they did it while running the business, not sacrificing it.
          </p>
        </Reveal>

        {/* Sub 1 — video testimonials */}
        <VideoTestimonials />

        {/* Sub 2 — before/after transformation cards */}
        <Reveal className="section-head vtest-cap">
          <div className="eyebrow">The transformations</div>
          <h2 className="display" style={{ fontSize: "clamp(24px,3vw,36px)" }}>Real clients. Real numbers.</h2>
          <p className="deck">Swipe through a few of them.</p>
        </Reveal>
        <BeforeAfterCarousel />

        <p className="lengths-note" style={{ marginTop: 32 }}>
          Full case files walked through with you on the assessment call.
        </p>
      </div>
    </section>
  );
}
