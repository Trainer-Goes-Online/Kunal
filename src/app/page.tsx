import S01TrustBanner from "@/components/sections/S01TrustBanner";
import S02TrustStrip from "@/components/sections/S02TrustStrip";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WhoFor } from "@/components/WhoFor";
import { Proof } from "@/components/Proof";
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
   trust banner → trust strip → header → hero → who → proof → founder → mechanism
   → programme → guarantee → faq → footer → sticky. (Saket influencer spotlight is
   deliberately omitted — no Kraft equivalent.) */
export default function Home() {
  return (
    <div className="sdp-root">
      <S01TrustBanner />
      <S02TrustStrip />
      <Nav />
      <main>
        <Hero />
        <WhoFor />
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
