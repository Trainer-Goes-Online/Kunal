/**
 * /thank-you — post-booking confirmation, rebuilt 1:1 against SDP's shipped
 * thank-you page (`_reference/sdp/components/thank-you/ThankYouPage.tsx`,
 * CSS `_reference/sdp/app/new-thank-you/thank-you.css`) on the existing brass
 * `.sdp-root` foundation in globals.css.
 *
 * SDP section order reproduced exactly:
 *   AnnounceMarquee → Hero (tick + h1 + sub + booking card)
 *   → WhatHappensNext (dark numbered timeline) → CalloutBand
 *   → PrepQuestions (light-alt card grid) → AboutTheCall (dark, SDP's
 *   FeeRefund slot) → Contact → Footer.
 *
 * SERVER component — no 'use client', no state, no effects. Every behaviour is a
 * `data-*` hook per MASTER-HANDOFF §5: reveals emit `data-sdp-reveal` + an inline
 * `--d` stagger and the one delegated client file adds `.vis`. Fail-open: all copy
 * is real HTML, and the <noscript> block below un-hides the reveal targets so the
 * confirmation still reads with JS disabled.
 *
 * Copy provenance (§6 — nothing invented):
 * - Hero, timeline and prep copy: funnel-copy/04-thank-you.md:12-49 (verbatim).
 * - Call rationale: adapted from src/lib/content.ts `faqs[0]` ("his eyes on your
 *   case, not a pitch") — the fee half of that claim is gone, see below.
 * - Callout line: funnel-copy/04-thank-you.md:33 ("It was never your discipline").
 * - Brand + routes from src/lib/site.ts.
 *
 * NO PAYMENT IN THIS FUNNEL. The fee/refund copy that shipped in the paid
 * variant (₹ terms, credit-toward-programme, refund-policy link) has been
 * removed, and SDP's FeeRefund slot now answers "why is this free" instead.
 * The support address for reschedules is unchanged. SDP's post-booking film has
 * no Kraft counterpart and is dropped outright, not reserved.
 *
 * Route-local CSS (./thank-you.css) — the SDP convention for a non-landing
 * route; every class is namespaced `.ty-…` and scoped under `.ty-page`.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { SdpHead } from "@/components/sdp";
import { ClientBehaviors } from "@/components/ClientBehaviors";
import { Colophon } from "@/components/Colophon";
import { site } from "@/lib/site";
import "./thank-you.css";

export const metadata: Metadata = {
  title: "Your assessment is confirmed | Kraft With Kunal",
  robots: { index: false, follow: false },
};

/* SDP `TIMELINE` (ThankYouPage.tsx:209-241) — here it carries Kraft's
   "What we'll cover on the call" set, funnel-copy/04-thank-you.md:32-36. */
const COVER = [
  {
    num: "01",
    title: "What's actually driving it",
    body: "The real block behind your body, read from your week and your markers, not a template.",
  },
  {
    num: "02",
    title: "Why the past attempts didn't hold",
    body: (
      <>
        The pattern the last plan missed. <strong>It was never your discipline.</strong>
      </>
    ),
  },
  {
    num: "03",
    title: "What it would realistically take",
    body: "The honest version, built around your calendar, not a gym-rat's.",
  },
  {
    num: "04",
    title: "The first four weeks, mapped",
    body: "What starting would actually look like in your life.",
  },
  {
    num: "05",
    title: "Whether the Protocol fits, straight",
    body: (
      <>
        If it&rsquo;s right, <strong>Kunal tells you</strong>. If it isn&rsquo;t, he tells you that
        too.
      </>
    ),
  },
] as const;

/* SDP `PREP` (ThankYouPage.tsx:296-312) — Kraft's "Before we speak" set,
   funnel-copy/04-thank-you.md:46-49. */
const PREP = [
  {
    num: "Step 01",
    title: "Be on time.",
    body: "The hour is blocked for you, so join a couple of minutes early.",
  },
  {
    num: "Step 02",
    title: "Find a quiet space",
    body: "Somewhere you can speak freely for the full hour.",
  },
  {
    num: "Step 03",
    title: "Think about what you most want to change",
    body: "And how long you've carried it. The honest answer makes the call count.",
  },
  {
    num: "Step 04",
    title: "Your call link is in your email",
    body: "Check spam if it's not in your inbox, and reschedule from that invite if something genuinely comes up.",
  },
] as const;

/* ============================================================
   Section: top announce marquee (SDP `AnnounceMarquee` 123-142)
   Reuses the existing `.sdp-announce` primitive. Four identical units so the
   -50% keyframe loops seamlessly (the pattern src/components/TopBeats.tsx uses).
   ============================================================ */
function AnnounceMarquee() {
  const unit = (
    <>
      <span>Booking confirmed</span>
      <span className="dot" aria-hidden>·</span>
      <span>Call link on its way to your <b>inbox</b></span>
      <span className="dot" aria-hidden>·</span>
      <span><b>1:1</b> with Kunal</span>
      <span className="dot" aria-hidden>·</span>
      <span>A diagnosis, not a pitch</span>
      <span className="dot" aria-hidden>·</span>
    </>
  );
  return (
    <div className="sdp-announce ty-announce" role="note" aria-label="Booking status">
      <div className="sdp-announce-track">
        {unit}
        {unit}
        {unit}
        {unit}
      </div>
    </div>
  );
}

/* ============================================================
   Section: hero (SDP `Hero` 148-203)
   ============================================================ */
function Hero() {
  return (
    <section className="ty-hero">
      <div className="sdp-wrap">
        <div className="ty-hero-inner">
          <div className="ty-tick" aria-hidden="true" data-sdp-reveal>
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="ty-h1" data-sdp-reveal style={{ "--d": ".10s" } as React.CSSProperties}>
            Your assessment with Kunal is <em>confirmed.</em>
          </h1>

          <p
            className="ty-hero-sub"
            data-sdp-reveal
            style={{ "--d": ".16s" } as React.CSSProperties}
          >
            The time you picked is <strong>held</strong>, and{" "}
            <mark>the call link is on its way to your inbox</mark>. This is a real, blocked hour on
            Kunal&rsquo;s calendar, booked for you.
          </p>

          <div
            className="ty-booking-card"
            data-sdp-reveal
            style={{ "--d": ".22s" } as React.CSSProperties}
          >
            <span className="ic" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 10h18" />
                <path d="M8 4v3" />
                <path d="M16 4v3" />
              </svg>
            </span>
            <div className="ty-booking-meta">
              <div className="ty-booking-label">Your session</div>
              <div className="ty-booking-value">1:1 assessment with Kunal</div>
            </div>
          </div>

          {/* SDP plays a dedicated thank-you film here (ThankYouPage.tsx:8,
              Vimeo 1209853497) plus a "don't close this page" alert. Kraft has
              no post-booking film and none is planned, so the slot is DROPPED
              rather than reserved — the hero closes on the booking card. The
              alert banner goes with it; it would point at nothing. */}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Section: what the call covers (SDP `WhatHappensNext` 243-276)
   ============================================================ */
function WhatWeCover() {
  return (
    <section className="sdp-section sdp-dark ty-dark-grid">
      <div className="sdp-wrap">
        <SdpHead
          eyebrow="The hour itself"
          title={
            <>
              What We&rsquo;ll Cover <em>On The Call.</em>
            </>
          }
          sub="Five things, in order."
        />

        <ul className="ty-timeline">
          {COVER.map((item, idx) => (
            <li
              key={item.num}
              className="ty-tl-item"
              data-sdp-reveal
              style={{ "--d": `${(0.06 + idx * 0.04).toFixed(2)}s` } as React.CSSProperties}
            >
              <span className="ty-tl-num">{item.num}</span>
              <div>
                <div className="ty-tl-title">{item.title}</div>
                <p className="ty-tl-desc">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================================================
   Section: callout band (SDP `CalloutBand` 282-290)
   ============================================================ */
function CalloutBand() {
  return (
    <div className="ty-callout">
      <div className="ty-callout-text" data-sdp-reveal>
        It was never your <em>discipline.</em>
      </div>
    </div>
  );
}

/* ============================================================
   Section: prep (SDP `PrepQuestions` 314-345)
   ============================================================ */
function BeforeWeSpeak() {
  return (
    <section className="sdp-section sdp-light-alt">
      <div className="sdp-wrap">
        <SdpHead
          eyebrow="Five minutes of prep"
          title={
            <>
              Four Things <em>Before We Speak.</em>
            </>
          }
          sub="None of it takes long. All of it makes the hour count."
        />

        <div className="ty-prep-grid">
          {PREP.map((q, idx) => (
            <div
              key={q.num}
              className="ty-prep-card"
              data-sdp-reveal
              style={{ "--d": `${(0.06 + idx * 0.06).toFixed(2)}s` } as React.CSSProperties}
            >
              <div className="ty-prep-num">{q.num}</div>
              <h4>{q.title}</h4>
              <p>{q.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Section: why the call costs nothing (SDP `FeeRefund` 351-400)

   This funnel takes no payment, so the slot SDP used for fee/refund
   terms answers the question a free call actually raises — "what's
   the catch?" The card structure and classes are unchanged; only the
   claim is. The old ₹-fee copy is gone, not commented out: an
   assessment fee is not charged anywhere in this funnel.
   ============================================================ */
function AboutTheCall() {
  return (
    <section className="sdp-section sdp-dark ty-dark-grid">
      <div className="sdp-wrap">
        <SdpHead
          eyebrow="About the call"
          title={
            <>
              Why This Call Costs <em>Nothing.</em>
            </>
          }
          sub="No hidden agenda. Here's the whole of it."
        />

        <div
          className="ty-fee-card"
          data-sdp-reveal
          style={{ "--d": ".16s" } as React.CSSProperties}
        >
          <div className="ty-fee-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 2l8 3v7c0 4.97-3.35 9.26-8 10-4.65-.74-8-5.03-8-10V5l8-3z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>

          <h3>
            You Get <em>His Eyes On Your Case.</em>
          </h3>
          <p className="ty-fee-body">
            It&rsquo;s an assessment, not a sales call. Kunal looks at your history, your
            schedule and your goals, and tells you straight: a fit or not. The
            questions you answered are the filter &mdash; they are what let him keep this
            free and still keep the numbers small.{" "}
            <strong>
              You get his eyes on your case, not a pitch.
            </strong>
          </p>

          <div className="ty-refund-row">
            <span className="ck" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div>
              <strong>
                You leave with a real read on your situation, whether or not you go further.
              </strong>
              <span className="ty-ck-note">
                The men Kunal turns away get an honest &ldquo;not yet&rdquo; and the reason why.
                Nothing else is sold to you on this call.
              </span>
            </div>
          </div>

          {/* The dormant refund-terms paragraph that used to sit here has been
              removed: it quoted the ₹ assessment fee, and nothing is charged in
              this funnel. Recover it from git history if the paid variant
              returns. */}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Section: contact + sign-off (SDP `Contact` 406-426)
   ============================================================ */
function Contact() {
  return (
    <section className="ty-contact">
      <div className="sdp-wrap">
        <div className="ty-contact-icon" aria-hidden="true" data-sdp-reveal>
          <svg viewBox="0 0 24 24">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>

        <h3 data-sdp-reveal style={{ "--d": ".06s" } as React.CSSProperties}>
          Need to reschedule or ask something?
        </h3>
        <p
          className="ty-contact-body"
          data-sdp-reveal
          style={{ "--d": ".10s" } as React.CSSProperties}
        >
          Reschedule straight from your calendar invite. Just don&rsquo;t leave the slot empty,
          someone else is on the list. If the invite isn&rsquo;t in your inbox, check spam first.
        </p>
        <p
          className="ty-contact-gap"
          data-sdp-reveal
          style={{ "--d": ".13s" } as React.CSSProperties}
        >
          Need to reschedule, or something isn&rsquo;t right? Email{" "}
          <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> and a real person
          will pick it up.
        </p>

        <p className="ty-signoff" data-sdp-reveal style={{ "--d": ".16s" } as React.CSSProperties}>
          See you on the call. Team {site.brand}
        </p>

        <div data-sdp-reveal style={{ "--d": ".20s" } as React.CSSProperties}>
          <Link href="/" className="ty-home-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to homepage
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ThankYouPage() {
  return (
    <div className="sdp-root ty-page">
      {/* Fail-open: with JS off the delegated observer never adds `.vis`, so
          un-hide every reveal target rather than ship a blank confirmation. */}
      <noscript>
        <style>{`.ty-page [data-sdp-reveal]{opacity:1;transform:none}`}</style>
      </noscript>

      {/* The one delegated client file. `layout.tsx` does not mount it (only the
          landing `page.tsx` does), so without this every `data-sdp-reveal` here
          would stay at opacity:0 with JS ON — the page would read as blank.
          Mounted per-route rather than editing shared `layout.tsx`; flagged in
          the manifest for the orchestrator to hoist at consolidation. */}
      <ClientBehaviors />

      <AnnounceMarquee />
      <main>
        <Hero />
        <WhatWeCover />
        <CalloutBand />
        <BeforeWeSpeak />
        <AboutTheCall />
        <Contact />
      </main>
      <Colophon />
    </div>
  );
}
