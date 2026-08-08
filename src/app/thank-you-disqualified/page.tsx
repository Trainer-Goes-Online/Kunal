/**
 * /thank-you-disqualified — where the qualifier sends the one applicant who
 * says they are not ready to invest (`DISQUALIFYING_INVESTMENT`, qualify.ts).
 *
 * COPY IS THE CLIENT'S — "Kunal Disqualify TY page.md", §"No Thank You Page".
 * Section order is theirs too: thank-you → Instagram ("You're Not Left Empty
 * Handed") → re-apply → why it wasn't approved → close. The Instagram block
 * reproduces the layout in the reference screenshot
 * (vsl.palaksachdeva.com/thank-you-disqualified) on Kraft's brass `.sdp-root`
 * foundation, with the copy swapped for Kunal's.
 *
 * NOTE ON THE ORDER: re-apply sitting ABOVE the reason means someone can
 * re-answer before reading why they were turned away. The re-apply note is
 * doing the work of discouraging that — if the numbers show people gaming it,
 * moving §4 above §3 is a one-line change here.
 *
 * SERVER component apart from `DisqualifiedAnswers`, which has to read
 * sessionStorage. Route-local CSS (./disqualified.css), every class namespaced
 * `.dq-…` and scoped under `.dq-page`, matching the /thank-you convention.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { SdpHead } from "@/components/sdp";
import { ClientBehaviors } from "@/components/ClientBehaviors";
import { Colophon } from "@/components/Colophon";
import { QualifyModal } from "@/components/np/QualifyModal";
import { DisqualifiedAnswers } from "@/components/np/DisqualifiedAnswers";
import { InstagramFollow } from "@/components/np/InstagramFollow";
import { site } from "@/lib/site";
import "@/components/sections/QualifyModal.css";
import "@/components/sections/InstagramFollow.css";
import "./disqualified.css";

export const metadata: Metadata = {
  title: "Thank you for applying | Kraft With Kunal",
  description:
    "This programme may not be the right fit right now — but you are not left empty handed.",
  robots: { index: false, follow: false },
};

/* ============================================================
   Announce marquee — same chrome as /book-a-call, different words.
   ============================================================ */
function AnnounceMarquee() {
  const unit = (
    <>
      <span>Application Received</span>
      <span className="dot" aria-hidden>·</span>
      <span>Thank You For Your <b>Honesty</b></span>
      <span className="dot" aria-hidden>·</span>
      <span>The Free Work Is Still Yours</span>
      <span className="dot" aria-hidden>·</span>
    </>
  );
  return (
    <div className="sdp-announce dq-announce" role="note" aria-label="Application status">
      <div className="sdp-announce-track">
        {unit}
        {unit}
      </div>
    </div>
  );
}

/* ============================================================
   1 · Thank you
   ============================================================ */
function Hero() {
  return (
    <section className="sdp-hero dq-hero" aria-label="Thank you for applying">
      <div className="sdp-wrap">
        <div className="dq-seal" data-sdp-reveal aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6.5h16v11H4z" />
            <path d="M4 7l8 6 8-6" />
          </svg>
        </div>

        <div className="dq-eyebrow-row" data-sdp-reveal style={{ ["--d" as string]: ".04s" }}>
          <span className="sdp-eyebrow center">Application received</span>
        </div>

        <h1 className="dq-h1" data-sdp-reveal style={{ ["--d" as string]: ".08s" }}>
          THANK YOU FOR <em>APPLYING</em>
        </h1>

        <p className="dq-hero-sub" data-sdp-reveal style={{ ["--d" as string]: ".12s" }}>
          After going through your answers, it looks like the{" "}
          <strong>High-Performer Programme may not be the right fit for you</strong> at this
          moment.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   3 · Re-apply — the same modal every landing CTA opens
   ============================================================ */
function ReApply() {
  return (
    <section className="sdp-section dq-reapply-sec" aria-label="Re-apply">
      <div className="sdp-wrap">
        <div className="dq-reapply" data-sdp-reveal>
          <span className="dq-reapply-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12a8 8 0 1 1 2.3 5.6" />
              <path d="M4 20v-4h4" />
            </svg>
            Answered something incorrectly?
          </span>

          <h2 className="dq-reapply-title">
            Think you may have answered something incorrectly?
          </h2>

          <a className="dq-reapply-cta" href={site.bookUrl} data-qualify-open>
            Re-Apply Now
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 10h11M11 5.5L15.5 10 11 14.5" />
            </svg>
          </a>

          <p className="dq-reapply-note">
            Only re-apply if you genuinely feel your answers didn&rsquo;t reflect your actual
            situation. If you do meet our criteria around your profile, fitness goals,
            readiness and investment, please re-apply with accurate answers.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   4 · Why it wasn't approved — the three criteria, each quoting
   the applicant's own selection. Copy + criteria from the client's
   doc; the predicates live on CRITERIA in src/lib/qualify.ts.
   ============================================================ */
function WhyNotApproved() {
  return (
    <section className="sdp-section sdp-dark dq-why" aria-label="Why your application wasn't approved">
      <div className="sdp-wrap">
        <div data-sdp-reveal>
          <SdpHead
            eyebrow="Full transparency"
            title={
              <>
                Here&rsquo;s Why Your Application <em>Wasn&rsquo;t Approved</em>
              </>
            }
          />
        </div>
        <DisqualifiedAnswers />
      </div>
    </section>
  );
}

/* ============================================================
   5 · Close
   ============================================================ */
function Closing() {
  return (
    <section className="sdp-section sdp-light-alt dq-close-sec" aria-label="One more thing">
      <div className="sdp-wrap">
        <div className="dq-close" data-sdp-reveal>
          <span className="dq-close-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.5s-7.5-4.3-7.5-9.7A4.3 4.3 0 0 1 12 8.4a4.3 4.3 0 0 1 7.5 2.4c0 5.4-7.5 9.7-7.5 9.7z" />
            </svg>
          </span>
          <p className="dq-close-lead">
            This doesn&rsquo;t mean your fitness goals aren&rsquo;t real or important.
          </p>
          <p className="dq-close-sub">
            It just means this particular programme, in its current format, isn&rsquo;t the right
            fit for you right now.
          </p>
          <p className="dq-close-contact">
            Questions? <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> reaches a
            real person. Or head <Link href="/">back to the main page</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function ThankYouDisqualifiedPage() {
  return (
    <div className="sdp-root dq-page">
      {/* Fail-open: with JS off the delegated observer never adds `.vis`, so
          un-hide every reveal target rather than ship a blank page. */}
      <noscript>
        <style>{`.dq-page [data-sdp-reveal]{opacity:1;transform:none}`}</style>
      </noscript>

      {/* layout.tsx does not mount this (only the landing page does), so
          without it every `data-sdp-reveal` here stays at opacity:0. */}
      <ClientBehaviors />

      {/* Re-apply opens the same six-step modal the landing CTAs open. */}
      <QualifyModal />

      <AnnounceMarquee />
      <main>
        <Hero />
        {/* Shared with /unsubscribe_emails — src/components/np/InstagramFollow.tsx */}
        <InstagramFollow />
        <ReApply />
        <WhyNotApproved />
        <Closing />
      </main>
      <Colophon />
    </div>
  );
}
