import S01TrustBanner from "@/components/sections/S01TrustBanner";
import S02TrustStrip from "@/components/sections/S02TrustStrip";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WhoFor } from "@/components/WhoFor";
import { Proof } from "@/components/Proof";
import { EliteAthlete } from "@/components/EliteAthlete";
import { Founder } from "@/components/Founder";
import { Mechanism } from "@/components/Mechanism";
import { Programme } from "@/components/Programme";
import { Guarantee } from "@/components/Guarantee";
import { EvenIf } from "@/components/EvenIf";
import { Colophon } from "@/components/Colophon";
import { StickyCTA } from "@/components/StickyCTA";
import { ClientBehaviors } from "@/components/ClientBehaviors";

/* Kraft With Kunal — VSL landing page. Rebuilt section-by-section pixel-exact to
   the SDP reference on the existing .sdp-root brass foundation. Every section is a
   server component emitting data-* hooks; ClientBehaviors is the one delegated
   client file that wires all interactivity. SDP DOM order:
   trust banner → trust strip → header → hero → who → elite-athlete → proof →
   founder → mechanism → programme → guarantee → faq → footer → sticky.
   The elite-athlete band is the funnel md's "From International Cricketers To
   Business Leaders" block; it sits between the qualifier and the client proof so
   the authority claim lands before the peer proof does. */
export default function Home() {
  return (
    <div className="sdp-root">
      {/* Reading-progress hairline pinned to the top of the viewport.
          ClientBehaviors writes --scroll-progress; with JS off it stays at 0
          and reads as a plain rule. */}
      <div className="sdp-scrollbar" aria-hidden="true" data-scrollbar>
        <span className="sdp-scrollbar-fill" />
      </div>
      <S01TrustBanner />
      <S02TrustStrip />
      <Nav />
      <main>
        <Hero />
        <WhoFor />
        <EliteAthlete />
        <Proof />
        <Founder />
        <Mechanism />
        <Programme />
        <Guarantee />
        <EvenIf />
      </main>
      <Colophon />
      <StickyCTA />
      <ClientBehaviors />
    </div>
  );
}
