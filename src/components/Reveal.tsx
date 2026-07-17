"use client";

import { useEffect, useRef } from "react";

/**
 * C7 reveal — FAIL-OPEN and robust. Content is server-rendered visible; JS only
 * "arms" the hidden state, then reveals when the element enters the viewport OR
 * has already been scrolled past (anchor jumps / fast scroll never leave content
 * stuck hidden). Honors prefers-reduced-motion (left visible, no animation).
 */
export function Reveal({
  children,
  delay,
  delayMs,
  className = "",
}: {
  children: React.ReactNode;
  delay?: 1 | 2 | 3 | 4;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add("armed");
    let done = false;
    const inView = () => el.getBoundingClientRect().top < window.innerHeight * 0.9;

    const onScroll = () => {
      if (inView()) reveal();
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) reveal();
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    const cleanup = () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    function reveal() {
      if (done) return;
      done = true;
      el!.classList.add("in");
      cleanup();
    }

    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // reveal above-the-fold content on the next frame so the transition still plays
    requestAnimationFrame(() => {
      if (inView()) reveal();
    });

    return cleanup;
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      {...(delay ? { "data-delay": String(delay) } : {})}
      {...(delayMs ? { style: { transitionDelay: `${delayMs}ms` } } : {})}
    >
      {children}
    </div>
  );
}
