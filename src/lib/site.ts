/**
 * Single source of truth for values that must NOT be hard-coded in copy/components.
 * Every one is an env var (NEXT_PUBLIC_*) with a safe DEFAULT that already matches
 * the signed-off landing copy ("Kunal Full Funnel Seggregation.md"), so the site is
 * correct even if nothing is set in Vercel. Env only OVERRIDES.
 * Set real values in .env.local locally / Vercel project env in deployment.
 */

const feeRaw = process.env.NEXT_PUBLIC_ASSESSMENT_FEE ?? "97"; // "₹97 To Start" — funnel md hero ledger

export const site = {
  brand: "Kraft With Kunal",

  /** The paid-assessment fee, formatted for display (e.g. "₹97"). */
  assessmentFee: `₹${feeRaw}`,
  assessmentFeeRaw: feeRaw,

  /**
   * Funnel routes. Flow: LP → qualifier modal → /book-a-call → /thank-you.
   *
   * NO PAYMENT IS TAKEN IN THIS FUNNEL. `checkoutUrl` is no longer linked from
   * anywhere — every CTA now opens the six-step qualifier (src/lib/qualify.ts)
   * and hands off to `bookUrl`. The /checkout route and the Razorpay plumbing
   * are still in the repo but are unreachable from the site; delete them, or
   * leave them dormant if the paid variant may come back.
   */
  checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "/checkout",
  bookUrl: "/book-a-call",
  thankYouUrl: "/thank-you",

  /** Booking calendar (Cal.com / Calendly) embed URL. Empty => branded placeholder. */
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",

  /** Hero VSL. Empty => placeholder poster + play disc (video being edited). */
  vslVideoUrl: process.env.NEXT_PUBLIC_VSL_VIDEO_URL ?? "",

  /**
   * Hero VSL poster — a real frame from the film, committed rather than fetched.
   *
   * Vimeo's oEmbed only ever returns the ONE poster frame set on the video, and
   * that frame catches an on-screen caption mid-animation ("Just …" with a
   * second word part-hidden behind Kunal's head). There is no API to ask it for
   * a different timestamp, and the video is domain-restricted, so its stream
   * can't be opened to pull one. This still is that frame with the caption band
   * cropped out, which is why it is a file and not a fetch.
   *
   * To swap it: either drop a new image here, or change the thumbnail on the
   * Vimeo video itself and point NEXT_PUBLIC_VSL_POSTER at the new URL.
   */
  vslPoster: process.env.NEXT_PUBLIC_VSL_POSTER ?? "/vsl-poster.jpg",

  /** Real capacity for the calm scarcity line. Confirm the true number with Kunal. */
  monthlySlots: process.env.NEXT_PUBLIC_MONTHLY_ASSESSMENT_SLOTS ?? "8",

  /** The one support inbox: reschedules, refunds, privacy and legal questions. */
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "kraftwithkunal@gmail.com",

  /** The one support line — WhatsApp + call reminders + "slot not available" help. */
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+91 98705 26900",

  /* ---- Proof figures, all confirmed in the funnel md. Env = override only. ---- */

  /** "200+ Success Stories" / "200+ High-Performers Coached Globally". */
  successStories: process.env.NEXT_PUBLIC_SUCCESS_STORIES ?? "200+",
  /** "5.0 ★ Client Rating" — the aggregate shown in the trust strip + hero ledger. */
  clientRating: process.env.NEXT_PUBLIC_CLIENT_RATING ?? "5.0",
  /** "12wk Avg. Transformation" — the hero ledger cell. */
  avgTransformWeeks: process.env.NEXT_PUBLIC_AVG_TRANSFORM_WEEKS ?? "12",
  /** The headline promise range, in kilos. Drives the H1 and the guarantee. */
  kilosLow: process.env.NEXT_PUBLIC_KILOS_LOW ?? "8",
  kilosHigh: process.env.NEXT_PUBLIC_KILOS_HIGH ?? "12",
  /** Length of the promise window, in days. */
  promiseDays: process.env.NEXT_PUBLIC_PROMISE_DAYS ?? "90",
  /** Hours on the rolling per-visitor offer countdown. "0" disables the timer. */
  offerTimerHours: process.env.NEXT_PUBLIC_OFFER_TIMER_HOURS ?? "5",

  /** Three client video testimonials. Vimeo player URLs or direct MP4 both work. */
  testimonialVideos: [
    process.env.NEXT_PUBLIC_TESTIMONIAL_VIDEO_1 ?? "https://player.vimeo.com/video/1213532473",
    process.env.NEXT_PUBLIC_TESTIMONIAL_VIDEO_2 ?? "https://player.vimeo.com/video/1213532711",
    process.env.NEXT_PUBLIC_TESTIMONIAL_VIDEO_3 ?? "https://player.vimeo.com/video/1213532704",
  ],
  /** Optional still for each clip. Empty => derived (MP4) or fetched (Vimeo). */
  testimonialPosters: [
    process.env.NEXT_PUBLIC_TESTIMONIAL_POSTER_1 ?? "",
    process.env.NEXT_PUBLIC_TESTIMONIAL_POSTER_2 ?? "",
    process.env.NEXT_PUBLIC_TESTIMONIAL_POSTER_3 ?? "",
  ],

  /**
   * Committed copies of the same opening frames, in clip order.
   * Last line of defence: if Vimeo's oEmbed is unreachable at build time
   * (blocked egress, outage) the tiles and the trust-strip avatars still show
   * a real face instead of an empty ring. Regenerate by re-downloading the
   * oEmbed thumbnail at -d_720x1280 if a clip is ever swapped.
   */
  testimonialFallbacks: [
    "/testimonials/clip-1.jpg",
    "/testimonials/clip-2.jpg",
    "/testimonials/clip-3.jpg",
  ],
} as const;

/** "8-12" — the kilo range as printed in the H1, guarantee and FAQ. */
export const kiloRange = `${site.kilosLow}-${site.kilosHigh}`;

/**
 * The /checkout "special offer" block.
 *
 * ⚠️ `NEXT_PUBLIC_ASSESSMENT_FEE_ORIGINAL` is the struck-through anchor price.
 * It must be a price the business has genuinely charged or genuinely offers —
 * a strike-through against a figure never actually charged is a misleading
 * price representation, and India's CCPA guidelines treat it as such. Set it
 * to a real number, or leave it UNSET: with no anchor the block still renders
 * the coupon and the countdown, it simply drops the was-price and the
 * percentage badge rather than inventing a discount.
 *
 * The coupon code is intentionally static — the client asked for a fixed code,
 * so nothing here pretends to be a per-visitor voucher.
 */
const feeNum = Number(site.assessmentFeeRaw) || 0;
/* Default 999, the figure the client specified for the struck-through price.
   ONE anchor drives every place it appears — the offer card, the order-summary
   bar and the sticky pay button — so the page can never quote two different
   "was" prices. CONFIRM IT IS REAL before launch; see the warning above. Set
   the var to "0" to drop the strike-through and badge entirely. */
const anchorRaw = Number(process.env.NEXT_PUBLIC_ASSESSMENT_FEE_ORIGINAL ?? "999") || 0;
const hasAnchor = anchorRaw > feeNum;

export const offer = {
  code: process.env.NEXT_PUBLIC_OFFER_CODE ?? "uwpxkowyzpqx",
  timerMinutes: Number(process.env.NEXT_PUBLIC_OFFER_TIMER_MINUTES ?? "15") || 15,
  hasAnchor,
  wasRaw: anchorRaw,
  /** "₹999" — ready to print beside the fee wherever the pair is shown. */
  was: `₹${anchorRaw.toLocaleString("en-IN")}`,
  savingRaw: hasAnchor ? anchorRaw - feeNum : 0,
  percentOff: hasAnchor ? Math.round(((anchorRaw - feeNum) / anchorRaw) * 1000) / 10 : 0,
} as const;

export const CTA_LABEL = `Book your assessment — ${site.assessmentFee}`;
