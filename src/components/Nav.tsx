import Image from "next/image";
import { site } from "@/lib/site";
import { ArrowGlyph } from "./sdp";

export function Nav() {
  return (
    <nav className="sdp-nav">
      <div className="sdp-nav-inner">
        <a className="sdp-brand" href="#top">
          <Image src="/logo-mark.png" alt="Kraft With Kunal" width={44} height={32} priority />
          {site.brand}
        </a>
        <a className="sdp-nav-cta" href={site.checkoutUrl}>
          Book your assessment
          <ArrowGlyph size={14} />
        </a>
      </div>
    </nav>
  );
}
