/**
 * THE CTA QUALIFICATION FORM — one source of truth for its questions.
 *
 * This funnel takes NO payment. Where the paid funnel sent every CTA to
 * /checkout, this one opens a six-step qualifier in a modal; on submit the
 * applicant is handed to /book-a-call, and Calendly's own hand-off carries
 * them to /thank-you. Flow: LP → qualifier modal → /book-a-call → /thank-you.
 *
 * Questions 5 and 6 (income, willingness to invest) are the gate. Nothing is
 * charged, but the answers are what stop the calendar filling with people the
 * High-Performer Programme was never priced for — so the modal cannot be
 * skipped past, and the last answer is the submit.
 *
 * COPY IS THE CLIENT'S, VERBATIM. Option labels keep their supplied
 * punctuation (including the full stops in Q4). Do not "tidy" them here — this
 * is signed-off copy, and the file exists so it lives in exactly one place.
 */

export type QualifyStep =
  | {
      id: string;
      kind: "text" | "email" | "tel";
      question: string;
      hint?: string;
      placeholder?: string;
    }
  | {
      id: string;
      kind: "choice";
      question: string;
      hint?: string;
      options: readonly string[];
    };

export const qualifySteps: readonly QualifyStep[] = [
  {
    id: "firstName",
    kind: "text",
    question: "Your first name",
    placeholder: "First name",
  },
  {
    id: "email",
    kind: "email",
    question: "Your email address",
    hint: "Your calendar invite and call link are sent here",
    placeholder: "you@company.com",
  },
  {
    id: "whatsapp",
    kind: "tel",
    question: "Your WhatsApp number",
    hint: "We send your call details, prep and reminders here",
    placeholder: "98765 43210",
  },
  {
    id: "role",
    kind: "choice",
    question: "Which best describes you?",
    options: [
      "Business Owner / Entrepreneur",
      "CEO / Founder",
      "Senior Corporate Professional",
      "Doctor / Lawyer / Consultant",
      "Other",
    ],
  },
  {
    id: "goal",
    kind: "choice",
    question: "What is your biggest goal over the next 90 days?",
    options: [
      "Lose 8-12 kilos.",
      "Reduce belly fat and waist size.",
      "Improve my energy, strength and overall fitness.",
      "Improve my health markers (cholesterol, blood sugar, BP, etc.).",
      "Build a fitness system I can actually sustain.",
    ],
  },
  {
    id: "income",
    kind: "choice",
    question: "What is your current annual income?",
    hint: "We ask this because the High-Performer Programme is designed specifically for senior professionals & business owners.",
    options: [
      "Below ₹15 Lakhs",
      "₹15-25 Lakhs",
      "₹25-50 Lakhs",
      "₹50 Lakhs-₹1 Crore",
      "Above ₹1 Crore",
    ],
  },
  {
    id: "investment",
    kind: "choice",
    question:
      "If I show you a clear, personalised plan to transform your fitness without letting your career, travel or busy schedule get in the way, what are you willing to invest in achieving your goals?",
    hint: "If you’re looking for free plans, there are plenty of workouts and diet plans available on YouTube.",
    options: [
      "₹5,000–₹7,000 per month",
      "₹7,000–₹9,000 per month",
      "₹9,000+ per month",
      "Really interested, but not ready to invest in my health & fitness",
    ],
  },
];

/**
 * Dial codes for the WhatsApp field. India first and default — it is the
 * overwhelming majority — with the handful of markets the audience actually
 * travels and works in. Deliberately short: a 200-country searchable dropdown
 * is a step-2 obstacle on a form whose whole job is to be finished.
 */
export const dialCodes = [
  { code: "IN", dial: "+91", flag: "🇮🇳", digits: 10 },
  { code: "AE", dial: "+971", flag: "🇦🇪", digits: 9 },
  { code: "SG", dial: "+65", flag: "🇸🇬", digits: 8 },
  { code: "GB", dial: "+44", flag: "🇬🇧", digits: 10 },
  { code: "US", dial: "+1", flag: "🇺🇸", digits: 10 },
  { code: "AU", dial: "+61", flag: "🇦🇺", digits: 9 },
  { code: "CA", dial: "+1", flag: "🇨🇦", digits: 10 },
] as const;

export type DialCode = (typeof dialCodes)[number];

/** sessionStorage key — the answers, kept so the next page can read them. */
export const QUALIFY_STORAGE_KEY = "kwk_qualify";

/* =====================================================================
   THE ONE DISQUALIFYING ANSWER
   ===================================================================== */

/**
 * Q6's last option. Someone who picks it is telling us they will not invest,
 * and the programme has no free tier — so they are routed to
 * /thank-you-disqualified instead of the calendar.
 *
 * This is the ONLY rule that disqualifies. Income below ₹15 Lakhs does NOT:
 * Q5 exists to segment the lead, not to gate the call, and the disqualified
 * page must never tell someone they failed a criterion that was not applied.
 *
 * Must stay byte-identical to the option string in `qualifySteps` above —
 * `assertQualifyRuleIntact()` fails the build if it drifts.
 */
export const DISQUALIFYING_INVESTMENT =
  "Really interested, but not ready to invest in my health & fitness";

export const DISQUALIFIED_PATH = "/thank-you-disqualified";

export function isDisqualified(answers: { investment?: string }): boolean {
  return (answers.investment ?? "").trim() === DISQUALIFYING_INVESTMENT;
}

/**
 * Guard against the silent failure this design invites: edit the Q6 option
 * text, forget this constant, and every applicant qualifies forever with no
 * error anywhere. Called at module load, so a mismatch breaks the build.
 */
function assertQualifyRuleIntact(): void {
  const q6 = qualifySteps.find((s) => s.id === "investment");
  const opts = q6 && q6.kind === "choice" ? q6.options : [];
  if (!opts.includes(DISQUALIFYING_INVESTMENT)) {
    throw new Error(
      "qualify.ts: DISQUALIFYING_INVESTMENT no longer matches any option on Q6. " +
        "The disqualification route is dead until these agree."
    );
  }
}
assertQualifyRuleIntact();

/* =====================================================================
   THE THREE CRITERIA — /thank-you-disqualified
   ===================================================================== */

/**
 * The three criteria the disqualified page shows, with the answer each one
 * reads. Copy is the client's, verbatim from "Kunal Disqualify TY page.md".
 *
 * ⚠️ READ BEFORE CHANGING A PREDICATE. Only criterion 3 actually gates the
 * funnel — `isDisqualified` routes on Q6 alone, so criterion 3 is the only one
 * that can be the REASON someone landed on that page. Criteria 1 and 2 are
 * shown because the client's copy asks for all three; their predicates are
 * written to be honest about the answer given, not to imply a gate that was
 * applied:
 *
 *   1. role  — fails only on "Other", which is literally the applicant saying
 *              they are none of the four listed profiles. Note that "Other"
 *              alone does NOT send anyone here.
 *   2. goal  — every option on Q4 is a specific 90-day fitness goal, so this
 *              passes for anyone who answered. It can only fail on a missing
 *              answer, which the modal does not permit.
 *   3. money — the real gate. See DISQUALIFYING_INVESTMENT above.
 *
 * Q5 (income) is deliberately absent. It segments the lead; it does not gate
 * the call, and listing it as a criterion would tell people they failed a test
 * that was never run.
 */
export type Criterion = {
  n: number;
  /** Which answer this criterion reads — a `qualifySteps` id. */
  from: "role" | "goal" | "investment";
  text: string;
  met: (a: Record<string, string>) => boolean;
};

export const CRITERIA: readonly Criterion[] = [
  {
    n: 1,
    from: "role",
    text: "Being a business owner, senior professional or high-performing professional with a demanding career.",
    met: (a) => {
      const v = (a.role ?? "").trim();
      return v.length > 0 && v !== "Other";
    },
  },
  {
    n: 2,
    from: "goal",
    text: "Having a specific fitness goal you’re serious about achieving over the next 90 days.",
    met: (a) => (a.goal ?? "").trim().length > 0,
  },
  {
    n: 3,
    from: "investment",
    text: "Being ready to invest in your health and fitness if it’s a clear fit on the call.",
    met: (a) => !isDisqualified(a),
  },
];

/* =====================================================================
   INSTAGRAM — the offer on the disqualified page
   ===================================================================== */

export const instagram = {
  url: "https://www.instagram.com/kraftwithkunal/",
  handle: "kraftwithkunal",
  name: "Kunal Chalke",
  /** The actual @kraftwithkunal profile picture, supplied by the client. */
  avatar: "/profile_insta.jpg",
  bio: [
    "Athlete-turned-coach · ACSM Certified",
    "Fitness systems for business owners & senior professionals",
    "200+ high-performers coached",
  ],
  bioLink: "kraftwithkunal.com",
  /**
   * Follower / post counts are NOT set. The profile mock renders the Instagram
   * glyph in their place rather than a made-up number — put real figures here
   * only once someone has read them off the account, and expect to keep them
   * current.
   */
  stats: null as { posts: string; followers: string; following: string } | null,
} as const;

/**
 * Validation for the two typed steps. Returns an error string, or "" when the
 * value passes. Kept here (not in the component) so the API route can apply
 * the same rules to what it receives.
 */
export function validateFirstName(v: string): string {
  const t = v.trim();
  if (!t) return "Please enter your first name.";
  if (t.length < 2) return "That looks too short — please enter your first name.";
  if (!/^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u.test(t)) return "Please use letters only.";
  return "";
}

/**
 * Deliberately permissive: one @, a dot in the domain, no spaces, and a TLD of
 * at least two characters. Anything stricter starts rejecting real addresses
 * (new TLDs, plus-addressing, apostrophes), and the only thing that actually
 * proves an address works is mail arriving at it.
 */
export function validateEmail(v: string): string {
  const t = v.trim();
  if (!t) return "Please enter your email address.";
  if (/\s/.test(t)) return "An email address can’t contain spaces.";
  if (!/^[^@]+@[^@]+\.[A-Za-z]{2,}$/.test(t)) return "That doesn’t look like a valid email address.";
  if (t.length > 120) return "That email address is too long.";
  return "";
}

export function validatePhone(digits: string, country: DialCode): string {
  const d = digits.replace(/\D/g, "");
  if (!d) return "Please enter your WhatsApp number.";
  if (country.code === "IN") {
    if (d.length !== 10) return "An Indian mobile number is 10 digits.";
    if (!/^[6-9]/.test(d)) return "An Indian mobile number starts with 6, 7, 8 or 9.";
    return "";
  }
  if (d.length < 6 || d.length > 14) return "Please enter a valid mobile number.";
  return "";
}
