import Link from "next/link";
import { site } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SdpHead, CtaLockup } from "./sdp";

/* Final CTA + footer — dark, centred, formatted like tgo-sreshtha:
   eyebrow -> identity headline -> CTA lockup -> clean foot-bottom
   (name · ornament · links). No dense body copy, no long legal block. */
export function FinalCTA() {
  return (
    <section id="apply" className="sdp-section sdp-dark sdp-final">
      <div className="sdp-wrap">
        <Reveal>
          <SdpHead
            eyebrow="And it all starts with one assessment"
            title={<>Become The Man Whose Body Finally <em>Matches His Life</em>.</>}
          />
        </Reveal>

        <Reveal>
          <CtaLockup />
        </Reveal>

        <div className="sdp-colophon">
          <span className="cbrand">{site.brand} · The High-Performer Protocol</span>
          <span className="foot-ornament" aria-hidden>✦</span>
          <nav className="foot-links" aria-label="Legal">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
