import { site, CTA_LABEL } from "@/lib/site";
import { Arrow } from "./icons";
import { Reveal } from "./Reveal";

/** Section shell (R1) — spacing rhythm, optional alt surface, centered masthead. */
export function Section({
  id,
  alt = false,
  eyebrow,
  title,
  deck,
  className = "",
  children,
}: {
  id?: string;
  alt?: boolean;
  eyebrow?: string;
  title?: React.ReactNode;
  deck?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`section ${alt ? "section--alt" : ""} ${className}`}>
      <div className="wrap">
        {(eyebrow || title || deck) && (
          <Reveal className="section-head">
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {title && <h2 className="display">{title}</h2>}
            {deck && <p className="deck">{deck}</p>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

export function Lit({ children }: { children: React.ReactNode }) {
  return <span className="lit">{children}</span>;
}

export function EyebrowPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow-pill">
      <span className="dot" />
      {children}
    </span>
  );
}

/**
 * Primary CTA (R3) — breathing brass pill. Opens the six-step qualifier modal
 * (`data-qualify-open`, intercepted by QualifyModal); the href is the calendar
 * itself, so with JS off the click still books.
 */
export function CTAButton({
  label = CTA_LABEL,
  micro,
}: {
  label?: string;
  micro?: React.ReactNode;
}) {
  return (
    <div>
      <a className="cta-big" href={site.bookUrl} data-qualify-open>
        {label}
        <Arrow size={20} />
      </a>
      {micro && <p className="cta-micro">{micro}</p>}
    </div>
  );
}
