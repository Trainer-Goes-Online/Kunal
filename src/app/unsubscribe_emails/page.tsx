/**
 * /unsubscribe_emails — the landing page for the Unsubscribe link in the two
 * funnel emails (emails/application-approved.html, application-not-approved.html).
 *
 * ⚠️ THIS PAGE DOES NOT UNSUBSCRIBE ANYONE. It is a confirmation screen, not
 * a mechanism. Nothing here writes to a suppression list, because this site
 * does not hold one — the mailing list lives in Pabbly / the sending ESP, and
 * that is the only place a removal can actually be recorded.
 *
 * So it MUST be wired as a REDIRECT TARGET, not as the raw unsubscribe href:
 *
 *     email → ESP's own unsubscribe URL → ESP records the removal
 *           → ESP redirects here → this page confirms it
 *
 * Every mainstream tool supports a custom post-unsubscribe redirect. Point it
 * at https://kraftwithkunal.com/unsubscribe_emails and optionally append the
 * address as `?email=`, which is read below purely to echo it back.
 *
 * If you instead link the email's Unsubscribe straight to this URL, the page
 * will tell people they have been removed while they remain fully subscribed.
 * That is a CAN-SPAM / GDPR problem and it torches sender reputation the
 * moment someone reports the next email as spam. If the ESP genuinely cannot
 * redirect, say so and this gets a real POST endpoint instead.
 *
 * `searchParams` is a Promise in this Next version — awaited, which makes the
 * route dynamic. Correct for a page whose content depends on a query param.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ClientBehaviors } from "@/components/ClientBehaviors";
import { Colophon } from "@/components/Colophon";
import { InstagramFollow } from "@/components/np/InstagramFollow";
import { site } from "@/lib/site";
import "@/components/sections/InstagramFollow.css";
import "./unsubscribe.css";

export const metadata: Metadata = {
  title: "You're unsubscribed | Kraft With Kunal",
  description: "You have been removed from the Kraft With Kunal email list.",
  robots: { index: false, follow: false },
};

function first(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  /* Echoed back to the visitor, so it is untrusted input rendered on screen.
     React escapes it, but the shape is constrained anyway: anything that
     isn't plausibly an address is dropped rather than printed. */
  const raw = first(sp.email).trim().slice(0, 120);
  const email = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(raw) ? raw : "";

  return (
    <div className="sdp-root un-page">
      {/* Fail-open: with JS off the delegated observer never adds `.vis`, so
          un-hide every reveal target rather than ship a blank page. */}
      <noscript>
        <style>{`.un-page [data-sdp-reveal]{opacity:1;transform:none}`}</style>
      </noscript>

      {/* layout.tsx does not mount this (only the landing page does), so
          without it every `data-sdp-reveal` here stays at opacity:0. */}
      <ClientBehaviors />

      <main>
        {/* ============================================================
            1 · Confirmation
            ============================================================ */}
        <section className="sdp-hero un-hero" aria-label="Unsubscribed">
          <div className="sdp-wrap">
            <div className="un-seal" data-sdp-reveal aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6.5h16v11H4z" />
                <path d="M4 7l8 6 8-6" />
                <path d="M3 3l18 18" />
              </svg>
            </div>

            <div className="un-eyebrow-row" data-sdp-reveal style={{ ["--d" as string]: ".04s" }}>
              <span className="sdp-eyebrow center">Email preferences updated</span>
            </div>

            <h1 className="un-h1" data-sdp-reveal style={{ ["--d" as string]: ".08s" }}>
              YOU&rsquo;RE <em>UNSUBSCRIBED.</em>
            </h1>

            {email ? (
              <p className="un-sub" data-sdp-reveal style={{ ["--d" as string]: ".12s" }}>
                <strong className="un-email">{email}</strong> has been removed from the Kraft
                With Kunal email list. No further emails will be sent to it.
              </p>
            ) : (
              <p className="un-sub" data-sdp-reveal style={{ ["--d" as string]: ".12s" }}>
                Your address has been removed from the Kraft With Kunal email list. No further
                emails will be sent to it.
              </p>
            )}

            <p className="un-note" data-sdp-reveal style={{ ["--d" as string]: ".16s" }}>
              No hard feelings, and nothing else to do. If you have a call already booked,
              your calendar invite and its reminders still come through &mdash; those are part
              of the booking, not the mailing list.
            </p>
          </div>
        </section>

        {/* ============================================================
            2 · Instagram — same band as /thank-you-disqualified
            ============================================================ */}
        <InstagramFollow
          eyebrow="Still worth having"
          title={
            <>
              Leaving the list doesn&rsquo;t mean leaving <em>empty handed.</em>
            </>
          }
          sub={
            <>
              Nothing to sign up for and nothing in your inbox &mdash; just free, practical
              content on fitness, fat loss, nutrition and building a healthier body around a
              demanding career.
            </>
          }
        />

        {/* ============================================================
            3 · Close
            ============================================================ */}
        <section className="sdp-section un-close-sec" aria-label="Anything else">
          <div className="sdp-wrap">
            <div className="un-close" data-sdp-reveal>
              <p className="un-close-lead">Unsubscribed by mistake?</p>
              <p className="un-close-sub">
                Reply to any email you already have from us, or write to{" "}
                <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>{" "}
                and we&rsquo;ll put you back on. A real person reads it.
              </p>
              <p className="un-close-contact">
                <Link href="/" className="un-home">
                  Back to kraftwithkunal.com
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 10h11M11 5.5L15.5 10 11 14.5" />
                  </svg>
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Colophon />
    </div>
  );
}
