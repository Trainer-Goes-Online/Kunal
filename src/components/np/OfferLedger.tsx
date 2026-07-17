"use client";

import { useEffect, useRef } from "react";

/**
 * The deliverables ledger with:
 *  - staggered reveal on scroll (fail-open: reveals anything scrolled past)
 *  - hover highlight on pointer devices (CSS :hover)
 *  - "active" highlight on the row nearest viewport-center on touch devices
 *    (so mobile gets the same draw-attention effect without a hover state)
 * The stagger delay is cleared after entrance so hover response stays instant.
 */
export function OfferLedger({ items }: { items: readonly string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>(".ledger-row"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    if (!reduce) {
      rows.forEach((el, i) => {
        el.classList.add("armed");
        let done = false;
        const inView = () => el.getBoundingClientRect().top < window.innerHeight * 0.92;
        const io = new IntersectionObserver(
          (es) => { if (es.some((e) => e.isIntersecting)) show(); },
          { threshold: 0.2 }
        );
        const onScroll = () => { if (inView()) show(); };
        function show() {
          if (done) return;
          done = true;
          el.style.transitionDelay = `${Math.min(i, 8) * 45}ms`;
          el.classList.add("in");
          io.disconnect();
          window.removeEventListener("scroll", onScroll);
          window.setTimeout(() => { el.style.transitionDelay = ""; }, 500 + i * 45);
        }
        io.observe(el);
        window.addEventListener("scroll", onScroll, { passive: true });
        requestAnimationFrame(() => { if (inView()) show(); });
        cleanups.push(() => { io.disconnect(); window.removeEventListener("scroll", onScroll); });
      });
    }

    // Small screens (no reliable hover): highlight the row nearest viewport center.
    if (window.matchMedia("(max-width: 820px)").matches) {
      let raf = 0;
      const sync = () => {
        raf = 0;
        const mid = window.innerHeight / 2;
        let best = -1, bestD = Infinity;
        rows.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (d < bestD) { bestD = d; best = i; }
        });
        rows.forEach((el, i) => el.classList.toggle("active", i === best));
      };
      const onScroll = () => { if (!raf) raf = requestAnimationFrame(sync); };
      window.addEventListener("scroll", onScroll, { passive: true });
      sync();
      cleanups.push(() => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); });
    }

    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <div className="ledger" ref={wrapRef}>
      <div className="ledger-head">
        <span>#</span>
        <span>What you get</span>
      </div>
      {items.map((d, i) => (
        <div className="ledger-row" key={d}>
          <span className="idx">{String(i + 1).padStart(2, "0")}</span>
          <span className="what">{d}</span>
        </div>
      ))}
    </div>
  );
}
