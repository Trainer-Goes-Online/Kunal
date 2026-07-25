"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow } from "../icons";

const slides = [1, 2, 3, 4, 5, 6];
// Slides are rendered twice so the track can loop seamlessly (marquee).
const loop = [...slides, ...slides];
const SPEED = 0.4; // px per frame — slow, continuous conveyor

/** Continuously-scrolling before/after marquee (ref: sciencedrivenperformance.in).
    The track drifts slowly on its own and loops seamlessly; it stays fully
    hand-scrollable/swipeable and the arrows nudge it one card at a time. Any
    interaction (hover/touch/drag) pauses the drift, then it resumes. Honors
    prefers-reduced-motion (no auto-motion; manual scroll + arrows still work). */
export function BeforeAfterCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  // Continuous drift with seamless wrap at the halfway point.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    // Float accumulator — scrollLeft rounds to an integer, so sub-pixel steps
    // would otherwise be lost. We keep the true position here and sync it back
    // to the real scroll position whenever the user takes over (paused).
    let pos = track.scrollLeft;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const half = track.scrollWidth / 2;
      if (half <= 0) return;
      if (pausedRef.current || document.hidden) {
        pos = track.scrollLeft; // follow the user's manual position while paused
        return;
      }
      pos += SPEED;
      if (pos >= half) pos -= half; // wrap seamlessly into the identical first half
      track.scrollLeft = pos;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nudge = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".ba-slide");
    const by = (card ? card.clientWidth + 20 : track.clientWidth * 0.6) * dir;
    track.scrollBy({ left: by, behavior: "smooth" });
  }, []);

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
        {loop.map((n, i) => (
          <div className="ba-slide" key={`${n}-${i}`} aria-hidden={i >= slides.length}>
            <img src={`/transformations/ba-${n}.jpg`} alt={i < slides.length ? `Client transformation ${n}` : ""} loading="lazy" />
          </div>
        ))}
      </div>
      <div className="ba-nav">
        <button className="ba-btn" aria-label="Previous" onClick={() => nudge(-1)}>
          <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}><Arrow size={18} /></span>
        </button>
        <button className="ba-btn" aria-label="Next" onClick={() => nudge(1)}>
          <Arrow size={18} />
        </button>
      </div>
    </div>
  );
}
