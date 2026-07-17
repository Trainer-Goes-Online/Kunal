import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { EyebrowPill } from "@/components/ui";
import { Check, GuaranteeSeal } from "@/components/icons";
import { Colophon } from "@/components/Colophon";

export const metadata: Metadata = {
  title: "Your assessment is confirmed — Kraft With Kunal",
  robots: { index: false, follow: false },
};

const cover = [
  ["What's actually driving it", "the real block behind your body, read from your week and your markers, not a template."],
  ["Why the past attempts didn't hold", "the pattern the last plan missed. It was never your discipline."],
  ["What it would realistically take", "the honest version, built around your calendar, not a gym-rat's."],
  ["The first four weeks, mapped", "what starting would actually look like in your life."],
  ["Whether the Protocol fits — straight", "if it's right, Kunal tells you. If it isn't, he tells you that too."],
];

const prep = [
  ["Be on time.", "The hour is blocked for you — join a couple of minutes early."],
  ["Find a quiet space", "where you can speak freely for the full hour."],
  ["Think about what you most want to change", "and how long you've carried it. The honest answer makes the call count."],
  ["Your call link is in your email", "check spam if it's not in your inbox, and reschedule from that invite if something genuinely comes up."],
];

export default function ThankYouPage() {
  return (
    <>
      <main>
        <section className="section stage grain" style={{ textAlign: "center" }}>
          <div className="wrap" style={{ maxWidth: 760 }}>
            <Reveal>
              <div className="seal-lit" aria-hidden><GuaranteeSeal size={48} /></div>
              <EyebrowPill>Booking confirmed</EyebrowPill>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="display" style={{ fontSize: "clamp(30px,4.4vw,50px)", margin: "22px auto 0", maxWidth: "16ch" }}>
                Your assessment with Kunal is confirmed.
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ maxWidth: "52ch", margin: "18px auto 0", color: "var(--ink-2)", fontSize: "clamp(15px,1.6vw,17px)", lineHeight: 1.6 }}>
                The time you picked is held, and the call link is on its way to your inbox. This is a
                real, blocked hour on Kunal&rsquo;s calendar — booked for you.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            {/* What we'll cover — check markers */}
            <Reveal className="co-card" >
              <h2 className="display" style={{ fontSize: "clamp(20px,2.6vw,28px)", margin: "0 0 18px" }}>What we&rsquo;ll cover on the call</h2>
              <div className="checklist">
                {cover.map(([lead, rest]) => (
                  <div className="check-item" key={lead}>
                    <span className="ck"><Check size={15} /></span>
                    <p><strong style={{ color: "var(--ink)", fontWeight: 600 }}>{lead}</strong> — {rest}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Before we speak — numbered markers (varies from the checklist above) */}
            <Reveal className="co-card" delayMs={80} >
              <h2 className="display" style={{ fontSize: "clamp(20px,2.6vw,28px)", margin: "0 0 18px" }}>Before we speak</h2>
              <div className="checklist">
                {prep.map(([lead, rest], i) => (
                  <div className="check-item" key={lead}>
                    <span className="ck" style={{ fontFamily: "var(--f-mono)", fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                    <p><strong style={{ color: "var(--ink)", fontWeight: 600 }}>{lead}</strong> {rest}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <p style={{ textAlign: "center", marginTop: 28, fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 18, color: "var(--ink-2)" }}>
                See you on the call. — Team {site.brand}
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Colophon />
    </>
  );
}
