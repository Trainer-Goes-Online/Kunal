/**
 * Single source of truth for values that must NOT be hard-coded in copy/components.
 * Every one is an env var (NEXT_PUBLIC_*) with a safe placeholder default so the
 * page builds and previews before the real assets/decisions land.
 * Set real values in .env.local (see .env.local.example).
 */

const feeRaw = process.env.NEXT_PUBLIC_ASSESSMENT_FEE ?? "299"; // ₹199 / ₹299 / ₹599 TBD

export const site = {
  brand: "Kraft With Kunal",

  /** The paid-assessment fee, formatted for display (e.g. "₹299"). */
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
  vslPoster: process.env.NEXT_PUBLIC_VSL_POSTER ?? "/VSL_thumbnail.png",

  /** Real capacity for the calm scarcity line. Confirm the true number with Kunal. */
  monthlySlots: process.env.NEXT_PUBLIC_MONTHLY_ASSESSMENT_SLOTS ?? "8",

  /** Four client video testimonials (CDN URLs). Empty => "testimonial coming" placeholder. */
  testimonialVideos: [
    process.env.NEXT_PUBLIC_TESTIMONIAL_VIDEO_1 ?? "",
    process.env.NEXT_PUBLIC_TESTIMONIAL_VIDEO_2 ?? "",
    process.env.NEXT_PUBLIC_TESTIMONIAL_VIDEO_3 ?? "",
    process.env.NEXT_PUBLIC_TESTIMONIAL_VIDEO_4 ?? "",
  ],
  testimonialPosters: [
    process.env.NEXT_PUBLIC_TESTIMONIAL_POSTER_1 ?? "",
    process.env.NEXT_PUBLIC_TESTIMONIAL_POSTER_2 ?? "",
    process.env.NEXT_PUBLIC_TESTIMONIAL_POSTER_3 ?? "",
    process.env.NEXT_PUBLIC_TESTIMONIAL_POSTER_4 ?? "",
  ],
} as const;

export const CTA_LABEL = `Book your assessment — ${site.assessmentFee}`;
