"use client";

import { useEffect, useState } from "react";
import { site, CTA_LABEL } from "@/lib/site";
import { Arrow } from "./icons";

/**
 * R8 sticky bar — hidden until past the hero, hides again at the final CTA so it
 * never duplicates a visible CTA. Pure enhancement; absent entirely without JS.
 */
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
    <a className={`sticky-cta ${visible ? "in" : ""}`} href={site.checkoutUrl} aria-hidden={!visible}>
      <span className="label label--long">In six months, a body that matches the life you built.</span>
      <span className="go">
        {CTA_LABEL}
        <Arrow size={16} />
      </span>
    </a>
  );
}
