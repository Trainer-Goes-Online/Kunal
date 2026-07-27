/**
 * LegalLayout — the shared shell for /privacy, /terms and /refund, rebuilt to
 * SDP's policy-page design on the existing brass `.sdp-root` foundation.
 *
 * SDP reference:
 *   _reference/sdp/components/policy/PolicyHero.tsx:11-24        hero
 *   _reference/sdp/components/policy/PrivacyPage.tsx:44-194      sticky TOC + sectioned body
 *   _reference/sdp/components/policy/PolicyContactCTA.tsx:10-25  dark contact band
 *   _reference/sdp/app/new-privacy-policy/privacy.css            ported to `.pol-…`
 *
 * DESIGN-ONLY pass: not a single word of the three policies changed. The copy is
 * the same text, re-homed into the SDP structure —
 *   · the existing "← Back to Kraft With Kunal" link becomes the hero's top chrome
 *   · the existing "Last updated: …" line becomes SDP's `.hero-meta` pill
 *   · the first paragraph becomes SDP's `.legal-intro` slab
 *   · each existing <h2> becomes a `.pol-sec` with an id, and the TOC is generated
 *     from those same headings (no new labels invented)
 *   · the final "Contact" / "How to request a refund" section becomes the dark
 *     contact band, heading and body verbatim
 * SDP's announcement marquee and hero eyebrow pill are omitted — both would need
 * new copy, which is out of scope for this pass.
 *
 * Server components. Reveal is deliberately limited to the hero chrome and the
 * TOC: legal text must paint in full even if the observer never runs.
 */
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import Link from "next/link";
import { Colophon } from "./Colophon";
import { ClientBehaviors } from "./ClientBehaviors";
import "./sections/PolicyPages.css";

/* ── A titled block of policy text. Its `id` + `heading` also feed the TOC. ── */
export function LegalSection({
  id,
  heading,
  children,
}: {
  id: string;
  heading: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="pol-sec" id={id}>
      <h2 className="pol-sec-h">{heading}</h2>
      {children}
    </section>
  );
}

type SectionProps = { id: string; heading: ReactNode };

/** Pull { id, heading } off every <LegalSection> child so the TOC needs no second list. */
function tocFromChildren(children: ReactNode): SectionProps[] {
  return Children.toArray(children)
    .filter((c): c is ReactElement<SectionProps> => isValidElement(c) && c.type === LegalSection)
    .map((c) => ({ id: c.props.id, heading: c.props.heading }));
}

/** Split the display title so the last word can carry the brass accent. */
function AccentedTitle({ title }: { title: string }) {
  const words = title.trim().split(" ");
  if (words.length < 2) return <>{title}</>;
  const head = words.slice(0, -1).join(" ");
  return (
    <>
      {head} <em>{words[words.length - 1]}</em>
    </>
  );
}

export function LegalLayout({
  title,
  updated,
  intro,
  contact,
  children,
}: {
  /** Page title, e.g. "Privacy Policy". Rendered as-is; the last word gets the accent. */
  title: string;
  /** e.g. "July 2026" — shown in the hero meta pill. */
  updated: string;
  /** The policy's opening paragraph, rendered as SDP's intro slab. */
  intro: ReactNode;
  /** The closing contact block, rendered as SDP's dark band. Heading + body verbatim. */
  contact: { id: string; heading: ReactNode; body: ReactNode };
  /** One <LegalSection> per existing <h2>. */
  children: ReactNode;
}) {
  const toc = [...tocFromChildren(children), { id: contact.id, heading: contact.heading }];

  return (
    <div className="sdp-root">
      {/* Hero — SDP PolicyHero.tsx:11-24 */}
      <section className="pol-hero">
        <div className="pol-wrap">
          <Link href="/" className="pol-back" data-sdp-reveal>
            &larr; Back to Kraft With Kunal
          </Link>
          <h1 className="pol-h1" data-sdp-reveal style={{ ["--d" as string]: ".08s" }}>
            <AccentedTitle title={title} />
          </h1>
          <p className="pol-meta" data-sdp-reveal style={{ ["--d" as string]: ".14s" }}>
            <span className="pip" aria-hidden="true" />
            Last updated: <b>{updated}</b>
          </p>
        </div>
      </section>

      {/* Sticky TOC + sectioned body — SDP PrivacyPage.tsx:44-194 */}
      <section className="pol-legal">
        <div className="pol-wrap">
          <div className="pol-grid">
            <aside className="pol-toc" aria-label="On this page" data-sdp-reveal>
              <div className="pol-toc-label">On this page</div>
              <ul>
                {toc.map(({ id, heading }) => (
                  <li key={id}>
                    <a href={`#${id}`}>{heading}</a>
                  </li>
                ))}
              </ul>
            </aside>

            <article className="pol-body">
              <p className="pol-intro">{intro}</p>
              {children}
            </article>
          </div>
        </div>
      </section>

      {/* Dark contact band — SDP PolicyContactCTA.tsx:10-25 */}
      <section className="pol-contact" id={contact.id}>
        <div className="pol-wrap">
          <div className="pol-contact-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h2 className="pol-contact-h">{contact.heading}</h2>
          {contact.body}
          <Link href="/" className="pol-home-link">
            &larr; Back to Kraft With Kunal
          </Link>
        </div>
      </section>

      <Colophon />
      <ClientBehaviors />
    </div>
  );
}
