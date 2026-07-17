import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function Colophon() {
  return (
    <footer className="colophon">
      <div className="wrap">
        <div className="colophon-top">
          <div>
            <div className="colophon-brand">
              <Image src="/logo-mark.png" alt="Kraft With Kunal" width={54} height={42} className="colophon-logo" />
              <span className="brand-name">{site.brand}</span>
            </div>
          </div>
          <nav className="colophon-links" aria-label="Site">
            <Link href="/#mechanism">The Protocol</Link>
            <Link href="/#proof">Proof</Link>
            <Link href="/#about">About Kunal</Link>
            <Link href={site.checkoutUrl}>Book your assessment</Link>
          </nav>
          <nav className="colophon-links" aria-label="Legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/refund">Refund Policy</Link>
          </nav>
        </div>
        <div className="colophon-bottom">
          <p>
            Health consulting for high-performers. Kunal is a coach, not a doctor — he works alongside your
            doctor, never around him. Results vary with the man and the work he puts in. This is an
            application, not a guarantee of enrolment.
          </p>
          <p className="legal">© 2026 {site.brand}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
