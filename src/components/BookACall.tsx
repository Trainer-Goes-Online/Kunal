/**
 * P02 — BOOK-A-CALL  ·  /book-a-call
 *
 * Rebuilt 1:1 against SDP's `BookACallPage`
 * (_reference/sdp/components/book-a-call/BookACallPage.tsx) on the existing
 * brass `.sdp-root` foundation. SDP DOM order is reproduced exactly:
 *
 *   announce marquee (L37-56)  → hero + 2-step progress (L62-110)
 *   → CalendarSection #calendar (L225-255) → Included / value grid (L318-359)
 *   → WhyCard, dark (L365-411)  → Transformations (L655-676)
 *   → FAQ (L783-797) → FinalCTA (L803-826) → Footer (L832-854)
 *   → sticky bottom strip (L860-884)
 *
 * SERVER COMPONENT. The only client code on this route is the pre-existing
 * `CalendarEmbed` (Calendly + GA4 `book_call` + /thank-you hand-off), exactly
 * as before. Everything else is real HTML emitting `data-*` hooks that
 * `ClientBehaviors` wires: `data-sdp-reveal` (reveal), `data-carousel="bacar"`
 * + `[data-lbox]` (transformations rail + lightbox), `data-sticky-cta` with
 * the `.sdp-hero` sentinel, and delegated smooth-scroll on `href="#calendar"`.
 * The FAQ is native `<details>` — no JS at all.
 *
 * Fail-open: with JS off the calendar iframe still loads and every CTA is a
 * plain in-page anchor; only the animations are missing.
 *
 * COPY PROVENANCE — nothing invented (§6):
 *   funnel-copy/02-call-booking.md  §1 (progress strip) · §2 (eyebrow) ·
 *   §3 (H1 + deck) · §4 (calendar head) · §5 (3 trust items) ·
 *   §6 (3 "what your assessment covers" points) · §7 (why-now beat) ·
 *   §8 (2 FAQs) · §9 (final CTA)
 *   ₹299 = `site.assessmentFee`; capacity = `site.monthlySlots`;
 *   transformations masthead = the shipped Transformations.tsx copy.
 *
 * GAPS: SDP's why-card stat row asserts "550+ Coached / 8 Yrs" — neither is
 * confirmed for Kraft (§6 Q1), so that stat renders as a visible <Gap q={1}>.
 * SDP's "fewer than 30 new clients a quarter" is likewise not Kraft's number;
 * the confirmed `site.monthlySlots` capacity is used instead. SDP's six value
 * cards become Kraft's six CONFIRMED items (3 covers + 3 trust) — no filler.
 */
import { site } from "@/lib/site";
import { baCards } from "@/lib/content";
import { Gap } from "@/components/shared/Gap";
import { Colophon } from "@/components/Colophon";
import { CalendarEmbed } from "@/components/np/CalendarEmbed";

/* SDP's tick polyline (BookACallPage.tsx:75-77) — same viewBox, same points. */
function Tick() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowInCircle() {
  return (
    <span className="arrow">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </span>
  );
}

/* ============================================================
   Announce marquee — SDP L37-56, on the foundation `.sdp-announce`
   ============================================================ */
function AnnounceMarquee() {
  const unit = (
    <>
      <span>Payment Received</span>
      <span className="dot" aria-hidden>·</span>
      <span><b>1:1</b> With Kunal Himself</span>
      <span className="dot" aria-hidden>·</span>
      <span>Free Reschedule Up To 24 Hours Before</span>
      <span className="dot" aria-hidden>·</span>
      <span>Only <b>{site.monthlySlots}</b> Assessments Open Each Month</span>
      <span className="dot" aria-hidden>·</span>
    </>
  );
  return (
    <div className="sdp-announce p02-announce" role="note" aria-label="Booking status">
      <div className="sdp-announce-track">
        {unit}{unit}
      </div>
    </div>
  );
}

/* ============================================================
   Hero — SDP L62-110. Carries `.sdp-hero`: it is the sticky sentinel.
   ============================================================ */
function Hero({ firstName }: { firstName: string }) {
  const greet = firstName ? `, ${firstName.toUpperCase()}` : "";

  return (
    <section className="sdp-hero p02-hero">
      <div className="sdp-wrap">
        <div className="p02-hero-row" data-sdp-reveal>
          <div className="p02-tick" aria-hidden><Tick /></div>
          <div className="p02-paid-badge">Payment Received</div>
        </div>

        <h1 className="p02-h1" data-sdp-reveal style={{ ["--d" as string]: ".06s" }}>
          YOUR FEE IS IN{greet}. <em>NOW LOCK THE SLOT.</em>
        </h1>

        <p className="p02-hero-sub" data-sdp-reveal style={{ ["--d" as string]: ".10s" }}>
          Your <strong>{site.assessmentFee} assessment fee</strong> is received.{" "}
          <mark>Pick the time you&rsquo;ll actually keep</mark> — Kunal reviews your details
          before you speak, so the hour is spent on you.
        </p>

        <div className="p02-steps" data-sdp-reveal style={{ ["--d" as string]: ".14s" }}>
          <div className="p02-step is-done">
            <div className="p02-circ">
              <span className="p02-num">1</span>
              <Tick />
            </div>
            <div className="p02-step-lbl">Paid</div>
          </div>
          <div className="p02-step-line" aria-hidden />
          <div className="p02-step is-active">
            <div className="p02-circ"><span className="p02-num">2</span></div>
            <div className="p02-step-lbl">Book The Call</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Calendar — SDP L225-255. `#calendar` is the smooth-scroll target.
   ============================================================ */
const CAL_ITEMS: [string, string][] = [
  ["1:1 with Kunal", "Not a team member. He runs every assessment himself."],
  ["Details in your inbox", "The call link and confirmation land the moment you book."],
  ["Free reschedule", "Up to 24 hours before, no questions."],
];

function CalendarSection({ firstName, email }: { firstName: string; email: string }) {
  return (
    <section className="p02-cal" id="calendar">
      <div className="sdp-wrap">
        <div className="p02-cal-head">
          <h2 data-sdp-reveal>
            Pick The Slot You&rsquo;ll <em>Actually Keep.</em>
          </h2>
        </div>

        <CalendarEmbed name={firstName} email={email} />

        <div className="p02-cal-reassure" data-sdp-reveal style={{ ["--d" as string]: ".16s" }}>
          <Tick />
          A diagnostic session, not a pitch. If you&rsquo;re not the right fit, Kunal tells you
          honestly.
        </div>

        <div className="p02-cal-items" data-sdp-reveal style={{ ["--d" as string]: ".20s" }}>
          {CAL_ITEMS.map(([h, p]) => (
            <div className="p02-cal-itm" key={h}>
              <Tick />
              <span><strong>{h}</strong> — {p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   What's included — SDP L318-359 (6 cards, "Included" pills)
   ============================================================ */
const VALUE_CARDS: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: "An Honest Read On What’s Stalling You",
    body: "Not a generic diagnosis — Kunal looks at your training history, your markers, and your real week, and tells you where the block actually is.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <circle cx="9" cy="9" r="1" />
        <circle cx="15" cy="9" r="1" />
      </>
    ),
  },
  {
    title: "The Real Pattern In Your Week",
    body: "The meetings, the travel, the late dinners, the “kal se” that never comes. He finds the pattern the last plan ignored — because that pattern is what beat every plan before it.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  {
    title: "Whether The Protocol Fits — Straight",
    body: "If it fits your life right now, he’ll tell you. If it doesn’t, he’ll tell you that too. You leave knowing where you stand, either way.",
    icon: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
  {
    title: "1:1 With Kunal",
    body: "Not a team member. He runs every assessment himself — that’s the whole point of keeping the numbers small.",
    icon: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  },
  {
    title: "Details In Your Inbox",
    body: "The call link and confirmation land the moment you book. Nothing to chase, nothing to remember.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <polyline points="3 7 12 13 21 7" />
      </>
    ),
  },
  {
    title: "Free Reschedule",
    body: "Up to 24 hours before, no questions — straight from your calendar invite. Just don’t leave the slot empty; someone else is on the list.",
    icon: (
      <>
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
  },
];

function IncludedSection() {
  return (
    <section className="sdp-section sdp-light">
      <div className="sdp-wrap">
        <div className="sdp-center">
          <div className="sdp-eyebrow center" data-sdp-reveal>The paid hour</div>
        </div>
        <h2 className="sdp-h2" data-sdp-reveal style={{ ["--d" as string]: ".06s" }}>
          A Real Diagnostic. <em>Not A Pitch.</em>
        </h2>
        <p className="sdp-sub" data-sdp-reveal style={{ ["--d" as string]: ".10s" }}>
          What your assessment covers — an honest read on your body, your week, and whether
          the Protocol is the right fit.
        </p>

        <div className="p02-value-grid">
          {VALUE_CARDS.map((card, idx) => (
            <div
              className="p02-value-card"
              key={card.title}
              data-sdp-reveal
              style={{ ["--d" as string]: `${(0.04 + idx * 0.06).toFixed(2)}s` }}
            >
              <span className="p02-vc-pill">
                <Tick /> Included
              </span>
              <div className="p02-vc-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {card.icon}
                </svg>
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Why book now — SDP L365-411 (dark scarcity card + stat row)
   ============================================================ */
function WhyCard() {
  return (
    <section className="sdp-section sdp-dark">
      <div className="sdp-wrap">
        <div className="p02-why-card" data-sdp-reveal>
          <div className="p02-why-kicker">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Why The Booking Window Matters
          </div>

          <h2>The Hard Part Is <span className="p02-hl">Already Done.</span></h2>

          <p>
            Here&rsquo;s the quiet trap: plenty of men pay, then leave the booking for
            &ldquo;later&rdquo; — and later is exactly the calendar that&rsquo;s kept them stuck
            for years.
          </p>
          <p>
            Kunal runs every assessment himself, so there is a real ceiling on the week.{" "}
            <span className="p02-hl">Only {site.monthlySlots} assessments open each month.</span>{" "}
            The earlier you book, the better the slot you get.
          </p>

          <div className="p02-why-stat-row">
            <div className="p02-why-stat">
              <div className="p02-stat-n">{site.monthlySlots}</div>
              <div className="p02-stat-l">Assessments Each Month</div>
            </div>
            <div className="p02-why-stat">
              <div className="p02-stat-n">100%</div>
              <div className="p02-stat-l">Run By Kunal, 1:1</div>
            </div>
            <div className="p02-why-stat">
              <div className="p02-stat-n"><Gap q={1}>clients coached / years</Gap></div>
              <div className="p02-stat-l">Track Record</div>
            </div>
          </div>

          <p>
            You&rsquo;ve already cleared the paid step. The only thing left is to{" "}
            <strong>actually pick a time</strong> so Kunal can prep for the call. This is
            thirty seconds.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Transformations — SDP L655-676. Reuses the LANDING before/after
   rail verbatim: identical `data-carousel="bacar"` markup and the
   S06 classes, so ClientBehaviors drives it with no new JS and no
   duplicated CSS.
   ============================================================ */
function TransformationsSection() {
  return (
    <section className="sdp-section sdp-light-alt">
      <div className="sdp-wrap">
        <div className="sdp-center">
          <div className="sdp-eyebrow center" data-sdp-reveal>
            Stubborn weight. A body they stopped recognising.
          </div>
        </div>
        <h2 className="sdp-h2" data-sdp-reveal style={{ ["--d" as string]: ".06s" }}>
          Real Men. Real Numbers. <em>Results That Held</em>.
        </h2>
        <p className="sdp-sub" data-sdp-reveal style={{ ["--d" as string]: ".10s" }}>
          Founders, GMs, engineers, corporate leaders — 35 to 50, with the same calendar
          pressure as yours.
        </p>
      </div>

      <div className="s06-bacar" data-carousel="bacar" data-sdp-reveal>
        <div className="s06-bacar-track" data-carousel-track>
          <div className="s06-bacar-set" data-carousel-set>
            {baCards.map((src, idx) => (
              <div
                className="s06-ba-card"
                key={src}
                data-ba-idx={idx}
                data-ba-src={src}
                role="button"
                tabIndex={0}
                aria-label={`Open client transformation ${idx + 1}`}
              >
                <div className="s06-ba-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt="Client transformation, before and after"
                    width={1000}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox shell — inert until ClientBehaviors adds `.on`. */}
      <div className="s06-lbox" data-lbox="bacar" role="dialog" aria-modal="true" aria-hidden="true" hidden>
        <div className="s06-lbox-content">
          <button className="s06-lbox-close" type="button" aria-label="Close" data-lbox-close>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button className="s06-lbox-nav s06-lbox-prev" type="button" aria-label="Previous" data-lbox-nav="-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="s06-lbox-img" alt="Client transformation, before and after" data-lbox-img src={baCards[0]} width={1000} height={1000} />
          <button className="s06-lbox-nav s06-lbox-next" type="button" aria-label="Next" data-lbox-nav="1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className="s06-lbox-counter" data-lbox-counter>1 / {baCards.length}</div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ — SDP L783-797. Native <details> (fail-open), foundation .sdp-q.
   ============================================================ */
const FAQS: { q: string; a: React.ReactNode; open?: boolean }[] = [
  {
    q: "Is the call directly with Kunal?",
    a: (
      <>
        Yes — every assessment is Kunal himself, not a team member.{" "}
        <strong>That&rsquo;s the whole point of keeping the numbers small.</strong>
      </>
    ),
    open: true,
  },
  {
    q: "What if I need to reschedule?",
    a: (
      <>
        Reschedule freely up to 24 hours before, straight from your calendar invite. Just
        don&rsquo;t leave the slot empty — someone else is on the list.
      </>
    ),
  },
];

function FAQSection() {
  return (
    <section className="sdp-section sdp-light">
      <div className="sdp-wrap">
        <div className="sdp-center">
          <div className="sdp-eyebrow center" data-sdp-reveal>Before you book</div>
        </div>
        <h2 className="sdp-h2" data-sdp-reveal style={{ ["--d" as string]: ".06s" }}>
          A Couple Of <em>Questions.</em>
        </h2>
        <p className="sdp-sub" data-sdp-reveal style={{ ["--d" as string]: ".10s" }}>
          Quick answers. Then pick your slot.
        </p>

        <div className="p02-faq-list">
          {FAQS.map((f) => (
            <details className="sdp-q" key={f.q} name="p02faq" open={f.open}>
              <summary className="sdp-q-head">
                <span>{f.q}</span>
                <span className="ic" aria-hidden>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </summary>
              <div className="sdp-q-body"><p>{f.a}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Final CTA — SDP L803-826
   ============================================================ */
function FinalCTA() {
  return (
    <section className="p02-final">
      <div className="sdp-wrap">
        <h2 data-sdp-reveal>
          You&rsquo;ve Paid.
          <span className="p02-hl">Now Lock The Assessment.</span>
        </h2>
        <p data-sdp-reveal style={{ ["--d" as string]: ".08s" }}>
          The slot is the only thing standing between today and an honest hour on your
          situation. <strong>This is thirty seconds.</strong>
        </p>
        <a className="p02-btn is-lg" href="#calendar" data-sdp-reveal style={{ ["--d" as string]: ".14s" }}>
          Pick My Slot
          <ArrowInCircle />
        </a>
      </div>
    </section>
  );
}

/* ============================================================
   Sticky bottom strip — SDP L860-884, on the foundation `.sdp-stuck`.
   Sentinel = `.sdp-hero` (the hero above); ClientBehaviors adds `.on`.
   ============================================================ */
function StickyStrip() {
  return (
    <div className="sdp-stuck p02-stuck" data-sticky-cta>
      <div className="p02-stuck-inner">
        <div className="p02-stuck-meta">
          <span className="p02-pulse" aria-hidden />
          <div className="p02-stuck-text">
            <div className="p02-stuck-h"><em>One step left</em> — pick your slot</div>
            <div className="p02-stuck-s">1:1 with Kunal · Fee already paid · Free reschedule</div>
          </div>
        </div>
        <a className="p02-btn" href="#calendar">
          Pick My Slot
          <ArrowInCircle />
        </a>
      </div>
    </div>
  );
}

/* ============================================================
   Page entry
   ============================================================ */
export function BookACall({ firstName = "", email = "" }: { firstName?: string; email?: string }) {
  return (
    <>
      <AnnounceMarquee />
      <main>
        <Hero firstName={firstName} />
        <CalendarSection firstName={firstName} email={email} />
        <IncludedSection />
        <WhyCard />
        <TransformationsSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <div className="p02-foot-runway">
        <Colophon />
      </div>
      <StickyStrip />
    </>
  );
}

export default BookACall;
