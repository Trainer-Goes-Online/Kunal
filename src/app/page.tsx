import { Announce } from "@/components/TopBeats";
import { Hero } from "@/components/Hero";
import { WhoFor } from "@/components/WhoFor";
import { Transformations } from "@/components/Transformations";
import { Proof } from "@/components/Proof";
import { Founder } from "@/components/Founder";
import { Mechanism } from "@/components/Mechanism";
import { Programme } from "@/components/Programme";
import { Guarantee } from "@/components/Guarantee";
import { EvenIf } from "@/components/EvenIf";
import { FinalCTA } from "@/components/FinalCTA";
import { StickyCTA } from "@/components/StickyCTA";

/* Kraft With Kunal — VSL landing page, SDP component system, brass-on-light.
   No logo/nav bar (SDP hides it). No Two Choices beat (removed per Atul).
   Founder + Guarantee are the two dark bands; footer is dark, sreshtha-style. */
export default function Home() {
  return (
    <div className="sdp-root">
      <Announce />
      <main>
        <Hero />
        <WhoFor />
        <Transformations />
        <Proof />
        <Founder />
        <Mechanism />
        <Programme />
        <Guarantee />
        <EvenIf />
        <FinalCTA />
      </main>
      <StickyCTA />
    </div>
  );
}
