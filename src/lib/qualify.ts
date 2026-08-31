/**
 * THE CTA APPLICATION FORM — one source of truth for its questions.
 *
 * This funnel takes NO payment. Every CTA opens this application in a modal;
 * on submit the applicant is handed to /book-a-call, and Calendly's own
 * hand-off carries them to /thank-you. One fork: the applicant who says they
 * are only after free advice goes to /thank-you-disqualified instead.
 *
 * Flow: LP → application modal → /book-a-call → /thank-you
 *                              ↘ /thank-you-disqualified
 *
 * QUESTION COPY IS THE CLIENT'S, VERBATIM, from
 * "KWK_Application_Form_Final.pdf" (Q01–Q11, four sections).
 *
 * ⚠️ NO EM DASHES OR EN DASHES anywhere in question, option or hint copy.
 * That is an explicit instruction in that PDF's implementation notes — the
 * client stripped every one and they must not creep back in. Use commas.
 *
 * ⚠️ CONTACT COMES FIRST, not last. The PDF puts Full Name / Email / WhatsApp
 * immediately before the booking redirect; the client asked for them as the
 * first three steps instead, so that is what this does. Everything downstream
 * (Calendly prefill, /api/lead validation, Pabbly identity, the email merge
 * tags) works either way — only the running order changed.
 */

export type StepKind = "contact" | "textarea" | "choice" | "multi";

/** A boxed note rendered above the question. Used once, on Q08. */
export type Callout = { title: string; body: readonly string[] };

/** Q01's "Other" escape hatch: pick Other, then type the real profession. */
export type OtherField = {
  /** The option that reveals the input. Must appear in `options`. */
  option: string;
  /** Answer key the typed value lands under. */
  id: string;
  label: string;
  placeholder?: string;
};

type StepBase = {
  id: string;
  /** Section heading from the PDF, shown above the question. */
  section: string;
  question: string;
  hint?: string;
  callout?: Callout;
  /** Reassurance shown under the field. Used once, on the final step. */
  note?: string;
};

export type QualifyStep =
  /** Full name + email + WhatsApp, all three on one screen. Always last. */
  | (StepBase & { kind: "contact" })
  | (StepBase & { kind: "textarea"; placeholder?: string })
  | (StepBase & { kind: "choice"; options: readonly string[]; other?: OtherField })
  | (StepBase & { kind: "multi"; options: readonly string[] });

const S_YOU = "Your details";
const S_SITUATION = "Your current situation";
const S_URGENCY = "Urgency and intent";
const S_INVESTMENT = "Investment readiness";
const S_DECISION = "Decision readiness";

export const qualifySteps: readonly QualifyStep[] = [
  /* ---- 1 · YOUR CURRENT SITUATION (PDF Q01 to Q04) ---- */
  {
    id: "role",
    section: S_SITUATION,
    kind: "choice",
    question: "What best describes your current professional role?",
    options: [
      "Business owner or entrepreneur",
      "Corporate executive or senior management",
      "Lawyer or legal professional",
      "Doctor or healthcare professional",
      "Engineer or technical professional",
      "Not currently working",
      "Other",
    ],
    other: {
      option: "Other",
      id: "roleOther",
      label: "If other, enter your actual profession:",
      placeholder: "Your profession",
    },
  },
  {
    id: "situation",
    section: S_SITUATION,
    kind: "choice",
    question: "Which best describes where you are right now?",
    options: [
      "I’m overweight and struggling to get consistent",
      "I’ve been training consistently but results have stalled",
      "I’ve tried multiple approaches and keep falling off",
      "Nothing has worked so far and I want a real system this time",
    ],
  },
  {
    id: "goal90",
    section: S_SITUATION,
    kind: "choice",
    question: "What is the single result you want to achieve in the next 90 days?",
    options: [
      "Lose significant body fat and look visibly leaner",
      "Build muscle and look more athletic",
      "Get lean and visibly defined, the aesthetic look",
      "Improve energy, health, and overall fitness",
    ],
  },
  {
    id: "tried",
    section: S_SITUATION,
    kind: "multi",
    question: "What have you tried so far?",
    hint: "Select all that apply.",
    options: [
      "Training at the gym on my own",
      "Following diet plans or calorie tracking",
      "Working with a personal trainer in person",
      "Online coaching or fitness programs",
      "Multiple programs, nothing has stuck",
      "Nothing consistently, this would be my first real attempt",
    ],
  },
  /* ---- 2 · URGENCY AND INTENT (PDF Q06 to Q07) ---- */
  {
    id: "urgency",
    section: S_URGENCY,
    kind: "choice",
    question: "Why is solving this important to you right now? What is driving your urgency today?",
    options: [
      "A doctor’s warning (blood pressure, cholesterol, sugar, or similar)",
      "A specific event coming up (wedding, trip, reunion, milestone birthday)",
      "Low energy that’s affecting my work and my family",
      "I’m done putting this off. This year is different.",
      "Someone close to me had a health scare and it got me thinking about mine",
      "No single trigger. I just decided it’s time.",
      "Other (please specify)",
    ],
    other: {
      option: "Other (please specify)",
      id: "urgencyOther",
      label: "Please specify:",
      placeholder: "What is driving it",
    },
  },
  {
    id: "paidBefore",
    section: S_URGENCY,
    kind: "choice",
    question: "Have you previously paid for a trainer, nutritionist, or fitness coaching program?",
    options: [
      "Yes, and I got results, but I’ve since lost them or want to go further",
      "Yes, but I didn’t get the results I was promised",
      "Yes, multiple times, but I couldn’t stay consistent",
      "No, I’ve never invested in professional coaching",
    ],
  },

  /* ---- 3 · INVESTMENT READINESS (PDF Q08 to Q10) ---- */
  {
    id: "investReady",
    section: S_INVESTMENT,
    kind: "choice",
    callout: {
      title: "Why this isn’t like your last program",
      body: [
        "Kunal is ASCA certified, a former professional cricketer, and has spent 8+ years coaching executives, lawyers, and engineers. He’s trained IPL players including Yashashwit Jaiswal and serves as head judge for Hyrox Delhi. This isn’t a templated PDF or an AI-generated plan. Every program is built directly by Kunal around your body, your schedule, and your constraints.",
        "Here’s Kunal’s standing promise on every program below. If you follow the plan and don’t reach your goal, he keeps coaching you until you do. No extra charge. No walking away.",
      ],
    },
    question:
      "Kunal’s promise: if personalised coaching is the right fit and you follow the plan, he’ll work with you until you hit your goal, at no extra charge. Are you prepared to invest in a structured 90-day program?",
    options: [
      "Yes, if it’s the right fit, I’m ready to start",
      "Yes, but I need to understand exactly what’s included first",
      "Possibly, I haven’t decided yet",
      "No, I’m looking for free advice or resources",
    ],
  },
  {
    id: "investLevel",
    section: S_INVESTMENT,
    kind: "choice",
    question:
      "What monthly investment level are you currently comfortable making toward your physique goal?",
    hint: "This helps us recommend the right coaching tier for you.",
    options: [
      "Rs.5,000 to Rs.7,000/month (Rs.15,000 for 3 months): Standard Coaching, self-guided plan with monthly check-ins",
      "Rs.7,000 to Rs.9,000/month (Rs.25,000 for 3 months): High-Level Coaching, weekly accountability and personalised adjustments",
      "Rs.10,000+/month (Rs.35,000 for 3 months): World-Class Coaching, daily access and full accountability. Includes Kunal’s results guarantee.",
      "I’m not sure yet, I’d like to understand the program first",
    ],
  },
  {
    id: "income",
    section: S_INVESTMENT,
    kind: "choice",
    question: "Your approximate monthly income",
    hint: "Required. Kept strictly confidential. Used only to recommend the right program tier.",
    options: [
      "Below Rs.1 lakh",
      "Rs.1 to Rs.2 lakh",
      "Rs.2 to Rs.5 lakh",
      "Rs.5 lakh+",
    ],
  },

  /* ---- 4 · DECISION READINESS (PDF Q11) ---- */
  {
    id: "decisionMaker",
    section: S_DECISION,
    kind: "choice",
    question:
      "If the coaching program is a strong fit, will you be able to make the enrollment decision yourself?",
    options: [
      "Yes, I make my own financial decisions",
      "I’d like to discuss it with my spouse or family first",
      "Someone else would need to approve the investment",
    ],
  },

  /* ---- Contact, last and on ONE screen ----
     The PDF puts these immediately before the booking redirect and the client
     confirmed that placement. Asking for a name before anything has been
     invested in the form is the easiest point to abandon; by here they have
     answered ten questions and the details are the last small step.
     All three share a step, stacked, because they are one thought. */
  {
    id: "contact",
    section: S_YOU,
    kind: "contact",
    question: "Almost there. Where should we send it?",
    note: "If you’re selected, you’ll be taken to a calendar next. Select your date and time. Do not exit the page before booking your slot.",
  },
];

/**
 * Dial codes for the WhatsApp field. India first and default, with the handful
 * of markets the audience actually travels and works in. Deliberately short: a
 * 200-country searchable dropdown is an obstacle on a form whose whole job is
 * to be finished.
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
   MULTI-SELECT
   ===================================================================== */

/**
 * Q04 is the only "select all that apply". Its value is stored as ONE string
 * rather than an array so the whole answer set stays Record<string, string> —
 * what sessionStorage, the /api/lead payload and every Pabbly column already
 * expect. The separator is something no option contains.
 */
export const MULTI_SEPARATOR = " | ";

export function parseMulti(value: string): string[] {
  return (value ?? "").split(MULTI_SEPARATOR).map((s) => s.trim()).filter(Boolean);
}

/** Add or remove one option, preserving the declared option order. */
export function toggleMulti(value: string, option: string, all: readonly string[]): string {
  const chosen = new Set(parseMulti(value));
  if (chosen.has(option)) chosen.delete(option);
  else chosen.add(option);
  return all.filter((o) => chosen.has(o)).join(MULTI_SEPARATOR);
}

/* =====================================================================
   ROUTING — who reaches the calendar
   ===================================================================== */

/**
 * The PDF's routing logic (page 5), implemented in full.
 *
 * PASS, and only then, is every one of these true:
 *     role   is not "Not currently working"
 *  AND Q08   is not "No, I’m looking for free advice or resources"
 *  AND Q10   is Rs.1 lakh a month or above
 *  AND Q11   is "Yes, I make my own financial decisions"
 *
 * Anything else routes to /thank-you-disqualified.
 *
 * NOT a gate: Q09, the coaching tier. All three tiers are real programmes, so
 * that answer tells whoever takes the call which one to open with. The PDF is
 * explicit that it must never disqualify, and its on-screen hint promises the
 * applicant the same.
 *
 * Borderline answers PASS by design, per the PDF: "Possibly, I haven’t decided
 * yet" on Q08 and "Rs.1 to Rs.2 lakh" on Q10 both reach the calendar, because
 * the call itself is the final filter for those.
 *
 * Each rule carries the copy shown to the applicant and the answer id it
 * reads, so the disqualified page and the email quote the right answer back
 * instead of guessing which condition tripped.
 */
export type FailRule = {
  /** Stable machine value. Goes to Pabbly as `disqualified_reason`. */
  code: "role_not_working" | "invest_no" | "income_below" | "not_decision_maker";
  /** Which question on the form this gate reads. Drives display order. */
  q: number;
  /** Which answer it reads — a `qualifySteps` id. */
  from: string;
  /** One-line criterion, for the pass/fail checklist on the page and email. */
  label: string;
  /** Applicant-facing explanation. No dashes, per the client's copy rule. */
  text: string;
  failed: (a: Record<string, string>) => boolean;
};

/** The exact option strings the rules match. Verified against qualifySteps below. */
export const NOT_WORKING_OPTION = "Not currently working";
export const DISQUALIFYING_ANSWER = "No, I’m looking for free advice or resources";
export const INCOME_BELOW_OPTION = "Below Rs.1 lakh";
export const DECISION_MAKER_OPTION = "Yes, I make my own financial decisions";

/** The step that carries the Q08 rule, so the guard and the UI agree on one id. */
export const DISQUALIFYING_STEP_ID = "investReady";

export const DISQUALIFIED_PATH = "/thank-you-disqualified";

/** Order matters: the first failure is the one reported as the primary reason. */
export const FAIL_RULES: readonly FailRule[] = [
  {
    code: "invest_no",
    q: 8,
    from: "investReady",
    label: "Ready to invest in a structured 90 day program if it is the right fit",
    text: "We only book calls with people who are prepared to invest in a structured 90-day program if it turns out to be the right fit. It is 1:1 coaching with Kunal and it is paid, so the call ends in an offer. There is no free version to point you at.",
    failed: (a) => (a.investReady ?? "").trim() === DISQUALIFYING_ANSWER,
  },
  {
    code: "role_not_working",
    q: 1,
    from: "role",
    label: "Currently working in a professional or business role",
    text: "The programme is built around a demanding career, and the coaching is priced for people currently earning from one. It is not the right fit while you are between roles.",
    failed: (a) => (a.role ?? "").trim() === NOT_WORKING_OPTION,
  },
  {
    code: "income_below",
    q: 10,
    from: "income",
    label: "Monthly income of Rs.1 lakh or above",
    text: "The programme starts at Rs.15,000 for three months. Below Rs.1 lakh a month that is a stretch we would rather not put you under.",
    failed: (a) => (a.income ?? "").trim() === INCOME_BELOW_OPTION,
  },
  {
    code: "not_decision_maker",
    q: 11,
    from: "decisionMaker",
    label: "Able to make the enrolment decision yourself",
    text: "The call ends in a decision about a paid programme, so we book it with the person who can actually make that decision on the day.",
    failed: (a) => {
      const v = (a.decisionMaker ?? "").trim();
      // Unanswered does not fail: the modal cannot submit without it, and a
      // partial payload arriving at /api/lead should not invent a reason.
      return v.length > 0 && v !== DECISION_MAKER_OPTION;
    },
  },
];

/**
 * The same four gates in FORM order, which is the order a person reads them.
 * FAIL_RULES stays in priority order because its first entry is the primary
 * reason; this is purely for display.
 */
export const GATES_IN_FORM_ORDER: readonly FailRule[] = [...FAIL_RULES].sort((a, b) => a.q - b.q);

/**
 * Presentation tokens for the pass/fail checklist.
 *
 * These live here, not in the email, because an email template cannot branch:
 * Pabbly does plain string substitution, so the colour and the tick have to
 * arrive already decided. The page imports the same values, which is what
 * keeps the email and /thank-you-disqualified visually identical.
 */
export const GATE_STYLE = {
  pass: { mark: "✓", color: "#3F8F5B", bg: "#F1F7F3", border: "#CFE3D6", status: "Met" },
  fail: { mark: "×", color: "#B4451F", bg: "#FBF4F1", border: "#EBD8D0", status: "Not met" },
} as const;

/** Every rule this applicant tripped, in FAIL_RULES order. */
export function failedRules(answers: Record<string, string>): FailRule[] {
  return FAIL_RULES.filter((r) => r.failed(answers));
}

export function isDisqualified(answers: Record<string, string>): boolean {
  return failedRules(answers).length > 0;
}

/**
 * Guard against the silent failure this design invites: edit an option's text,
 * forget the constant here, and the rule that reads it dies with no error
 * anywhere. Runs at module load, so any mismatch breaks the build.
 */
function assertQualifyRuleIntact(): void {
  const optionsOf = (id: string) => {
    const s = qualifySteps.find((x) => x.id === id);
    return s && s.kind === "choice" ? s.options : [];
  };

  const pairs: Array<[string, string]> = [
    ["investReady", DISQUALIFYING_ANSWER],
    ["role", NOT_WORKING_OPTION],
    ["income", INCOME_BELOW_OPTION],
    ["decisionMaker", DECISION_MAKER_OPTION],
  ];
  for (const [id, needle] of pairs) {
    if (!optionsOf(id).includes(needle)) {
      throw new Error(
        `qualify.ts: "${needle}" is no longer an option on "${id}". The routing rule that ` +
          "reads it is dead until these agree."
      );
    }
  }

  const other = qualifySteps.find((s) => s.kind === "choice" && s.other);
  if (other && other.kind === "choice" && other.other && !other.options.includes(other.other.option)) {
    throw new Error(
      `qualify.ts: the "other" trigger on "${other.id}" is not one of its options, so the ` +
        "follow-up input can never appear."
    );
  }
}
assertQualifyRuleIntact();

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
   * only once someone has read them off the account.
   */
  stats: null as { posts: string; followers: string; following: string } | null,
} as const;

/* =====================================================================
   NAME SPLITTING
   ===================================================================== */

/**
 * The form asks for a full name; Pabbly and the emails want first and last
 * separately. First token is the first name, the remainder is the surname —
 * good enough for a greeting, and the untouched full string is sent too, so
 * nothing is lost if the split guesses wrong on a multi-part name.
 */
export function splitName(full: string): { first: string; last: string; full: string } {
  const t = full.trim().replace(/\s+/g, " ");
  const parts = t.split(" ");
  return { first: parts[0] ?? "", last: parts.slice(1).join(" "), full: t };
}

/* =====================================================================
   VALIDATION
   Kept here, not in the component, so /api/lead can apply the same rules
   to whatever it receives.
   ===================================================================== */

export function validateFullName(v: string): string {
  const t = v.trim();
  if (!t) return "Please enter your full name.";
  if (t.length < 2) return "That looks too short. Please enter your full name.";
  if (!/^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u.test(t)) return "Please use letters only.";
  return "";
}

/**
 * Deliberately permissive: one @, a dot in the domain, no spaces, and a TLD of
 * at least two characters. Anything stricter starts rejecting real addresses,
 * and the only thing that proves an address works is mail arriving at it.
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

/** Free-text answers. Required, but with no minimum length. */
export function validateLongAnswer(v: string): string {
  const t = v.trim().replace(/\s+/g, " ");
  if (!t) return "Please answer this one. It’s the part Kunal actually reads.";
  if (t.length > 2000) return "Please keep this under 2000 characters.";
  return "";
}

/** Multi-select: at least one option. */
export function validateMulti(v: string): string {
  return parseMulti(v).length ? "" : "Please pick at least one. Select all that apply.";
}
