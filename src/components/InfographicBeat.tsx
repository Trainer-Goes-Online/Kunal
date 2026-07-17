"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Reveal } from "./Reveal";

/**
 * A text beat paired with an infographic. Desktop: copy and a framed image sit
 * side by side (image right by default; `reverse` puts it left). Mobile: the
 * framed image leads, then an eyebrow tag + copy — a richer, more "designed"
 * stack than a bare image over text. Fail-open: if the image file is missing the
 * section collapses to clean, centered text.
 */
export function InfographicBeat({
  id,
  img,
  alt,
  eyebrow,
  reverse = false,
  altBg = false,
  children,
}: {
  id?: string;
  img: string;
  alt: string;
  eyebrow?: string;
  reverse?: boolean;
  altBg?: boolean;
  children: React.ReactNode;
}) {
  const [ok, setOk] = useState(true);

  if (!ok) {
    return (
      <section id={id} className={`section ${altBg ? "section--alt" : ""}`}>
        <div className="wrap">
          <Reveal className="prose-beat">
            {eyebrow && <div className="eyebrow" style={{ textAlign: "center", marginBottom: 16 }}>{eyebrow}</div>}
            {children}
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className={`section ${altBg ? "section--alt" : ""}`}>
      <div className="wrap">
        <div className={`ibeat ${reverse ? "ibeat--reverse" : ""}`}>
          <Reveal className="ibeat-copy prose-beat">
            {eyebrow && <div className="ibeat-eyebrow">{eyebrow}</div>}
            {children}
          </Reveal>
          <Reveal className="ibeat-media" delay={1}>
            <div className="ibeat-frame">
              <img src={img} alt={alt} loading="lazy" onError={() => setOk(false)} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
