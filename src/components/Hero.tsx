import { Reveal } from "./Reveal";
import { VSLFrame } from "./VSLFrame";
import { ArrowGlyph } from "./sdp";
import { site } from "@/lib/site";
import { heroStats, features, outcomes } from "@/lib/content";
import { CalendarIcon, Coach, Check } from "./icons";

/* Hero — mirrors the SDP hero, brass-on-light, centred throughout.
   No logo. No pill: a dash eyebrow following the formula (ICP + the problem).
   Pre-video pills = program FEATURES. Post-video sequence, in this order:
   CTA > 3 icon pointers > offer urgency > one line > credibility table > outcome pills. */
export function Hero() {
  return (
    <header id="top" className="sdp-hero sdp-section">
      <div className="sdp-wrap sdp-hero-inner">
        <Reveal>
          <span className="sdp-eyebrow-pill">
            <span className="glowdot" aria-hidden />
            For successful men 35 to 50 whose body stopped keeping up
          </span>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="sdp-h1">
            <span className="sdp-h1-l1">You built the career.</span>
            <span className="sdp-h1-l2">Now build the body that matches it.</span>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="sdp-sub">
            In six months: 15 to 20kg down, real muscle on the frame, and blood work moving the
            right way, through <span className="sdp-mech-name">The High-Performer Protocol</span>, a plan built
            around the life that made you successful, not a gym-rat&rsquo;s week.
          </p>
        </Reveal>

        {/* pre-video pills = program FEATURES */}
        <Reveal delay={2}>
          <div className="sdp-pills">
            {features.map((f) => (
              <span className="sdp-marker-chip" key={f}>
                <span className="sdp-marker-dot" aria-hidden />
                {f}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={3}>
          <div className="sdp-watch">Watch the short video below ↓</div>
          <VSLFrame />
        </Reveal>

        {/* 1 · CTA */}
        <Reveal delay={2}>
          <a className="sdp-cta sdp-hero-cta" href={site.checkoutUrl}>
            <span className="sdp-cta-main">
              Book Your Assessment
              <span className="arrow"><ArrowGlyph /></span>
            </span>
            <span className="cta-sub">{site.assessmentFee} to apply</span>
          </a>
        </Reveal>

        {/* 2 · three pointers with icons */}
        <Reveal delay={2}>
          <div className="sdp-hero-pointers">
            <span className="pt"><span className="ico"><CalendarIcon size={18} /></span>Built for travel weeks &amp; board meetings</span>
            <span className="pt"><span className="ico"><Coach size={18} /></span>Coached 1:1 by Kunal</span>
            <span className="pt"><span className="ico"><Check size={18} /></span>A diagnosis, never a template</span>
          </div>
        </Reveal>

        {/* 3 · offer urgency */}
        <Reveal delay={2}>
          <div className="sdp-capacity">
            <span className="dot" aria-hidden />
            Only {site.monthlySlots} assessments open each month.
          </div>
        </Reveal>

        {/* 4 · one line */}
        <Reveal delay={2}>
          <p className="sdp-oneline" style={{ textAlign: "center" }}>
            A diagnostic session, not a pitch. If you&rsquo;re not the right fit, Kunal tells you honestly.
          </p>
        </Reveal>

        {/* 5 · credibility table */}
        <Reveal delay={2}>
          <div className="sdp-stats">
            {heroStats.map((s) => (
              <div className="sdp-stat" key={s.k}>
                <div className="k">{s.k}</div>
                <div className="v">{s.v}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* 6 · outcomes in pills (from the program) */}
        <Reveal delay={2}>
          <div className="sdp-pills sdp-pills-outcomes">
            {outcomes.map((o) => (
              <span className="sdp-marker-chip" key={o}>
                <span className="sdp-marker-dot" aria-hidden />
                {o}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </header>
  );
}
