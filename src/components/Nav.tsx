import Image from "next/image";
import { site } from "@/lib/site";
import { Arrow } from "./icons";

export function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="brand" href="#top">
          <Image
            src="/logo-mark.png"
            alt="Kraft With Kunal"
            width={44}
            height={34}
            className="brand-logo"
            priority
          />
          <span className="brand-name">{site.brand}</span>
        </a>
        <a className="btn btn--ghost" href={site.checkoutUrl}>
          Book your assessment
          <Arrow size={16} />
        </a>
      </div>
    </nav>
  );
}
