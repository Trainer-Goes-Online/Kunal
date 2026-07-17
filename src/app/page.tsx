import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Problem, Stakes, RelieveBlame } from "@/components/TextBeats";
import { Mechanism } from "@/components/Mechanism";
import { Proof } from "@/components/Proof";
import { Offer } from "@/components/Offer";
import { WhoFor } from "@/components/WhoFor";
import { AboutKunal } from "@/components/AboutKunal";
import { EvenIf } from "@/components/EvenIf";
import { FinalCTA } from "@/components/FinalCTA";
import { Colophon } from "@/components/Colophon";
import { StickyCTA } from "@/components/StickyCTA";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Stakes />
        <RelieveBlame />
        <Mechanism />
        <Proof />
        <Offer />
        <WhoFor />
        <AboutKunal />
        <EvenIf />
        <FinalCTA />
      </main>
      <Colophon />
      <StickyCTA />
    </>
  );
}
