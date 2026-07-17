"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow } from "../icons";

const slides = [1, 2, 3, 4, 5, 6];
const AUTO_MS = 3800;

/** Auto-advancing carousel of the 6 pre-designed cream transformation cards.
    It moves on its own every few seconds AND stays fully hand-scrollable/swipeable;
    any interaction (hover, touch, focus) pauses the auto-play so it never fights the
    user, then it resumes. Fail-open: with zero JS it's still a native scroller. */
export function BeforeAfterCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeRef = useRef(0);
  useEffect(() => { activeRef.current = active; }, [active]);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[i] as HTMLElement | undefined;
    if (slide) {
      track.scrollTo({
        left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2,
        behavior: "smooth",
      });
    }
  }, []);

  // Track which slide is centered (drives the dots).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0, bd = Infinity;
        Array.from(track.children).forEach((c, i) => {
          const el = c as HTMLElement;
          const cc = el.offsetLeft + el.clientWidth / 2;
          const d = Math.abs(cc - center);
          if (d < bd) { bd = d; best = i; }
        });
        setActive(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-advance — paused on interaction and when the tab/section is hidden.
  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      const next = (activeRef.current + 1) % slides.length;
      goTo(next);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, goTo]);

  const holdOn = () => setPaused(true);
  const holdOff = () => setPaused(false);

  return (
    <div
      className="ba-carousel"
      onMouseEnter={holdOn}
      onMouseLeave={holdOff}
      onFocusCapture={holdOn}
      onBlurCapture={holdOff}
      onTouchStart={holdOn}
      onTouchEnd={holdOff}
    >
      <div className="ba-track" ref={trackRef} onPointerDown={holdOn}>
        {slides.map((n) => (
          <div className="ba-slide" key={n}>
            <img src={`/transformations/ba-${n}.jpg`} alt={`Client transformation ${n}`} loading="lazy" />
          </div>
        ))}
      </div>
      <div className="ba-nav">
        <button className="ba-btn" aria-label="Previous" onClick={() => goTo(Math.max(0, active - 1))}>
          <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}><Arrow size={18} /></span>
        </button>
        <div className="ba-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`ba-dot ${i === active ? "on" : ""}`}
              aria-label={`Go to transformation ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button className="ba-btn" aria-label="Next" onClick={() => goTo(Math.min(slides.length - 1, active + 1))}>
          <Arrow size={18} />
        </button>
      </div>
    </div>
  );
}
