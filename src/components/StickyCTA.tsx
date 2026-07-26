"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { ArrowGlyph } from "./sdp";

/* Beat 13 — Sticky CTA. Page-chrome: hidden until past the hero, hides again at
   the final CTA so it never doubles a visible CTA. Pure enhancement (absent
   without JS). SDP sweeping dark glass, calm brass capacity tag. */
export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const final = document.getElementById("apply");
    let pastHero = false;
    let finalIn = false;
    const sync = () => setVisible(pastHero && !finalIn);

    const heroObs = new IntersectionObserver(
      ([e]) => { pastHero = !e.isIntersecting; sync(); },
      { rootMargin: "-40% 0px 0px 0px" }
    );
    const finalObs = new IntersectionObserver(
      ([e]) => { finalIn = e.isIntersecting; sync(); },
      { threshold: 0.15 }
    );
    if (hero) heroObs.observe(hero);
    if (final) finalObs.observe(final);
    return () => { heroObs.disconnect(); finalObs.disconnect(); };
  }, []);

  return (
    <div className={`sdp-stuck ${visible ? "on" : ""}`} aria-hidden={!visible}>
      <div className="sdp-stuck-inner">
        <span className="sdp-stuck-label">Kraft With Kunal · a body that matches the life you built.</span>
        <span className="sdp-stuck-tag">
          <span className="dot" aria-hidden />
          {site.monthlySlots} assessments / month
        </span>
        <a className="sdp-stuck-go" href={site.checkoutUrl}>
          Book · {site.assessmentFee}
          <ArrowGlyph size={14} />
        </a>
      </div>
    </div>
  );
}
