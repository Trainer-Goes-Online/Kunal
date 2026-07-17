"use client";

import { useEffect, useRef } from "react";
import { phases } from "@/lib/content";
import { Reveal } from "./Reveal";

/**
 * R9 scroll-linked journey spine — the page's ONE signature moment.
 * FAIL-OPEN: server-renders fully visible/lit. JS only "arms" it (mutes, then
 * lights per scroll) when motion is allowed. prefers-reduced-motion → left lit.
 */
function JourneySpine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add("armed");
    const nodes = Array.from(el.querySelectorAll<HTMLElement>(".phase"));
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // fill 0→1 as the section travels through the lower-middle of the viewport
      const fill = Math.max(0, Math.min(1, (vh * 0.62 - rect.top) / (rect.height * 0.9)));
      el.style.setProperty("--fill", fill.toFixed(3));
      const n = nodes.length;
      nodes.forEach((node, i) => {
        node.classList.toggle("lit", fill >= (i + 0.5) / n);
      });
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="spine" ref={ref}>
      <div className="spine-rail" aria-hidden>
        <div className="spine-fill" />
      </div>
      {phases.map((p) => (
        <div className="phase" key={p.n}>
          <div className="phase-num">{p.n}</div>
          <span className="phase-dot" aria-hidden />
          <div className="phase-body">
            <div className="phase-label">{p.label}</div>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Mechanism() {
  return (
    <section id="mechanism" className="section">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">The mechanism · Holistic Lifestyle Integration</div>
          <h2 className="display">One system. Four phases you can <span className="lit">feel</span>.</h2>
          <p className="deck">
            The High-Performer Protocol. You feel each phase end and the next begin — built around
            your calendar, not a gym-rat&rsquo;s.
          </p>
        </Reveal>

        <JourneySpine />

        <Reveal className="lengths">
          <div className="length">
            <div className="lname">90-Day Reset</div>
            <div className="lmeta">Phases 1–2</div>
          </div>
          <div className="or">or</div>
          <div className="length">
            <div className="lname">6-Month Transformation</div>
            <div className="lmeta">All four phases</div>
          </div>
        </Reveal>
        <p className="lengths-note">
          Same engine, same coach, same standard. The length is the only real choice you make.
        </p>
      </div>
    </section>
  );
}
