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

  /** Funnel routes. Flow: LP → /checkout → /book-a-call → /thank-you. */
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

export const CTA_LABEL = `Book your assessment — ${site.assessmentFee}`;
