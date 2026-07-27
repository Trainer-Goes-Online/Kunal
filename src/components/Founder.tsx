/**
 * S07 — Founder authority (DARK band).
 *
 * SDP reference: `_reference/sdp/components/landing/LandingPage.tsx:1231-1282`
 * (`FounderAuthority`) + `_reference/sdp/app/landing.css:854-938` (+ responsive
 * 2327-2328, 2352, 2444-2448 and the bar sweep 2769-2782).
 *
 * Structure reproduced 1:1: eyebrow → h2 → centred intro paragraph → ONE merged
 * founder card (photo column + name/role/bio) → italic closing block with a
 * brand left rule. Reveal stagger is SDP's shipped ladder: 0 / .06s / .12s /
 * .16s / .28s. Only the copy (Kraft, from src/lib/content.ts) and the palette
 * (already brass via .sdp-root) differ.
 *
 * Copy mapping — content.ts `founderStory` is three paragraphs and SDP's founder
 * block has exactly three prose slots, so they map one-to-one:
 *   founderStory[0] → intro   founderStory[1] → bio   founderStory[2] → closing
 * `founderPills` (credential set) and the HYROX certificate are Kraft assets SDP
 * has no slot for; both are kept inside the card in SDP's own chip/frame grammar
 * (see the manifest deviation note) rather than dropped.
 *
 * Server component. No client JS — reveals are `data-sdp-reveal` hooks only.
 */
import Image from "next/image";
import { founderPills, founderStory } from "@/lib/content";

const [intro, bio, closing] = founderStory;

/* SDP's closing block leads with a bolded claim, then the plain-weight rest
   (LandingPage.tsx:1276). founderStory[2] has the same shape, so the lead
   sentence is split off rather than re-typed. */
const closingLeadEnd = closing.indexOf(". ") + 1;
const closingLead = closing.slice(0, closingLeadEnd);
const closingRest = closing.slice(closingLeadEnd);

export function Founder() {
  return (
    <section id="founder" className="s07-founder sdp-dark">
      <div className="sdp-wrap">
        <div className="sdp-eyebrow center" data-sdp-reveal>
          Behind The Protocol
        </div>
        <h2 className="sdp-h2" data-sdp-reveal style={{ "--d": ".06s" } as React.CSSProperties}>
          The Coach, And Why The Room Stays <em>Small.</em>
        </h2>

        <p
          className="s07-founder-intro"
          data-sdp-reveal
          style={{ "--d": ".12s" } as React.CSSProperties}
        >
          {intro}
        </p>

        <div className="s07-founder-grid">
          <div
            className="s07-founder-card"
            data-sdp-reveal
            style={{ "--d": ".16s" } as React.CSSProperties}
          >
            <div className="s07-founder-photo">
              <Image
                className="s07-founder-img"
                src="/kunal-coach.jpg"
                alt="Kunal Chalke, coach and founder of Kraft With Kunal"
                width={1050}
                height={1400}
                sizes="(max-width: 640px) 220px, (max-width: 960px) 280px, 340px"
              />
            </div>

            <div className="s07-founder-body">
              <div className="s07-founder-name">KUNAL CHALKE</div>
              <div className="s07-founder-role">1:1 Coach · HYROX-Certified, Head Judge</div>

              <ul className="s07-founder-pills">
                {founderPills.map((p) => (
                  <li className="s07-founder-pill" key={p}>
                    {p}
                  </li>
                ))}
              </ul>

              <p className="s07-founder-bio">{bio}</p>

              <figure className="s07-cert">
                <div className="s07-cert-frame">
                  <Image
                    src="/kunal-hydrox.jpg"
                    alt="HYROX365 Foundation certificate issued to Kunal Chalke"
                    width={1400}
                    height={936}
                    sizes="(max-width: 640px) 220px, 320px"
                  />
                </div>
                <figcaption className="s07-cert-cap">
                  HYROX365 Foundation, <em>HYROX Ready.</em> Certified 29.06.26, signed by
                  HYROX&rsquo;s managing directors.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        <div
          className="s07-founder-closing"
          data-sdp-reveal
          style={{ "--d": ".28s" } as React.CSSProperties}
        >
          <strong>{closingLead}</strong>
          {closingRest}
        </div>
      </div>
    </section>
  );
}
