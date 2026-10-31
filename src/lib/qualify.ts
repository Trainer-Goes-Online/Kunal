/**
 * THE CTA APPLICATION FORM — one source of truth for its questions.
 *
 * This funnel takes NO payment. Every CTA opens this application in a modal;
 * on submit EVERY applicant is handed to /book-a-call, and Calendly's own
 * hand-off carries them to /thank-you. There is no disqualification fork any
 * more: the investment answer (Q3) only decides whether the lead is reported
 * as QUALIFIED (Meta CAPI QualifiedLead + GA4 qualified_lead + Pabbly
 * `qualified`), not where the applicant goes.
 *
 * Flow: LP → application modal → /book-a-call → /thank-you
 *
 * QUESTION COPY IS THE CLIENT'S, VERBATIM (five steps, supplied 2026-10-31):
 *   Q1 physique situation (with "Other" follow-up)
 *   Q2 seriousness, 1 to 10
 *   Q3 investment level  ← the qualification gate
 *   Q4 decision maker
 *   Q5 contact details (unchanged from the previous form's "Your details" step)
 */

export type StepKind = "contact" | "textarea" | "choice" | "multi";

/** A boxed note rendered above the question. Not used by the current form. */
export type Callout = { title: string; body: readonly string[] };

/** "Other" escape hatch on a pick-one: pick Other, then type the real answer. */
export type OtherField = {
  /** The option that reveals the input. Must appear in `options`. */
  option: string;
  /** Answer key the typed value lands under. */
  id: string;
  label: string;
  placeholder?: string;
};

/** Renders a pick-one as a compact 1..N number row with end labels. */
export type ScaleLayout = { low: string; high: string };

type StepBase = {
  id: string;
  /** Section heading, shown above the question. */
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
  | (StepBase & {
      kind: "choice";
      options: readonly string[];
      other?: OtherField;
      scale?: ScaleLayout;
    })
  | (StepBase & { kind: "multi"; options: readonly string[] });

const S_YOU = "Your details";
const S_SITUATION = "Your current situation";
const S_URGENCY = "Urgency and intent";
const S_INVESTMENT = "Investment readiness";
const S_DECISION = "Decision readiness";

/** The three coaching tiers on Q3. Picking any of them qualifies the lead. */
export const INVEST_TIERS = [
  "Rs.5,000 to Rs.7,000/month (Rs.15,000 for 3 months): Standard Coaching, self-guided plan with monthly check-ins",
  "Rs.7,000 to Rs.9,000/month (Rs.25,000 for 3 months): High-Level Coaching, weekly accountability and personalised adjustments",
  "Rs.10,000+/month (Rs.35,000 for 3 months): World-Class Coaching, daily access and full accountability. Includes Kunal’s results guarantee.",
] as const;

/** Q3's fourth option — the only answer that does NOT qualify. */
export const NOT_READY_OPTION = "I’m really interested, but not ready to invest in my health right now";

export const qualifySteps: readonly QualifyStep[] = [
  /* ---- Q1 · physique situation ---- */
  {
    id: "physique",
    section: S_SITUATION,
    kind: "choice",
    question: "What best describes your current physique and fitness situation?",
    options: [
      "I train consistently, but my physique has plateaued.",
      "I’ve built some muscle, but I’m carrying more body fat than I want.",
      "I’m relatively lean, but I want significantly more muscle and definition",
      "I’ve made progress before, but I struggle to maintain momentum and consistency.",
      "I’m getting back into serious training after some time away.",
      "Other",
    ],
    other: {
      option: "Other",
      id: "physiqueOther",
      label: "Please describe your situation:",
      placeholder: "Your current situation",
    },
  },

  /* ---- Q2 · seriousness, 1 to 10 ---- */
  {
    id: "seriousness",
    section: S_URGENCY,
    kind: "choice",
    question: "On a scale of 1–10, how serious are you about solving this now?",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    scale: { low: "1 = Just exploring", high: "10 = Ready to fix this now" },
  },

  /* ---- Q3 · investment level — THE QUALIFICATION GATE ---- */
  {
    id: "investLevel",
    section: S_INVESTMENT,
    kind: "choice",
    question:
      "If I show you a clear, personalised plan to transform your physique over the next 90–120 days, with the training, nutrition and accountability needed to remove the guesswork, what would you be willing to invest in achieving that transformation?",
    options: [...INVEST_TIERS, NOT_READY_OPTION],
  },

  /* ---- Q4 · decision maker ---- */
  {
    id: "decisionMaker",
    section: S_DECISION,
    kind: "choice",
    question: "How will the decision to start be made?",
    options: [
      "I am the sole decision maker and can go ahead on my own",
      "Someone else would need to pay for this, and I have not spoken to them about it yet",
    ],
  },

  /* ---- Q5 · contact, last and on ONE screen (unchanged) ---- */
  {
    id: "contact",
    section: S_YOU,
    kind: "contact",
    question: "Almost there. Where should we send it?",
    note: "If you’re selected, you’ll be taken to a calendar next. Select your date and time. Do not exit the page before booking your slot.",
  },
];

/** Every answer key the form can produce, in form order. /api/lead and the
    modal payload both iterate this, so a new question cannot be silently dropped. */
export const ANSWER_KEYS = [
  "physique",
  "physiqueOther",
  "seriousness",
  "investLevel",
  "decisionMaker",
] as const;
export type AnswerKey = (typeof ANSWER_KEYS)[number];

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
   QUALIFICATION — who counts as a qualified lead
   ===================================================================== */

/**
 * ONE gate, set by the client (2026-10-31):
 *
 *   QUALIFIED  ⇔  Q3 (investLevel) is one of the three coaching tiers.
 *   Not qualified  ⇔  Q3 is "I’m really interested, but not ready to invest…".
 *
 * Qualification decides REPORTING only — Meta CAPI QualifiedLead, GA4
 * qualified_lead and the Pabbly `qualified` flag. It does NOT decide routing:
 * every applicant, qualified or not, is sent to /book-a-call.
 *
 * The rule is still expressed as a FailRule so the existing consumers
 * (/api/lead's gate columns, the dormant /thank-you-disqualified checklist)
 * keep working off one definition.
 */
export type FailRule = {
  /** Stable machine value. Goes to Pabbly as `disqualified_reason`. */
  code: "not_ready_to_invest";
  /** Which question on the form this gate reads. Drives display order. */
  q: number;
  /** Which answer it reads — a `qualifySteps` id. */
  from: string;
  /** One-line criterion, for the pass/fail checklist on the page and email. */
  label: string;
  /** Applicant-facing explanation. */
  text: string;
  failed: (a: Record<string, string>) => boolean;
};

/** The step that carries the gate, so the guard and the UI agree on one id. */
export const QUALIFYING_STEP_ID = "investLevel";

/** Kept for the dormant /thank-you-disqualified page; nothing routes there now. */
export const DISQUALIFIED_PATH = "/thank-you-disqualified";

export const FAIL_RULES: readonly FailRule[] = [
  {
    code: "not_ready_to_invest",
    q: 3,
    from: "investLevel",
    label: "Ready to invest in one of the coaching tiers",
    text: "The coaching is a paid programme. You said you are not ready to invest in your health right now, so we will share free resources until the timing is right.",
    failed: (a) => {
      const v = (a.investLevel ?? "").trim();
      // Unanswered does not fail: the modal cannot submit without it, and a
      // partial payload arriving at /api/lead should not invent a reason.
      return v.length > 0 && !(INVEST_TIERS as readonly string[]).includes(v);
    },
  },
];

/** The gates in FORM order, which is the order a person reads them. */
export const GATES_IN_FORM_ORDER: readonly FailRule[] = [...FAIL_RULES].sort((a, b) => a.q - b.q);

/**
 * Presentation tokens for the pass/fail checklist (email + dormant page).
 * An email template cannot branch, so colour and tick arrive pre-decided.
 */
export const GATE_STYLE = {
  pass: { mark: "✓", color: "#3F8F5B", bg: "#F1F7F3", border: "#CFE3D6", status: "Met" },
  fail: { mark: "×", color: "#B4451F", bg: "#FBF4F1", border: "#EBD8D0", status: "Not met" },
} as const;

/** Every rule this applicant tripped, in FAIL_RULES order. */
export function failedRules(answers: Record<string, string>): FailRule[] {
  return FAIL_RULES.filter((r) => r.failed(answers));
}

/** True when the lead picked one of the three tiers on Q3. */
export function isQualified(answers: Record<string, string>): boolean {
  return failedRules(answers).length === 0;
}

/** Inverse of isQualified — kept so older call sites read naturally. */
export function isDisqualified(answers: Record<string, string>): boolean {
  return !isQualified(answers);
}

/**
 * Guard against the silent failure this design invites: edit an option's text,
 * forget the constant here, and the gate that reads it dies with no error
 * anywhere. Runs at module load, so any mismatch breaks the build.
 */
function assertQualifyRuleIntact(): void {
  const step = qualifySteps.find((x) => x.id === QUALIFYING_STEP_ID);
  const options = step && step.kind === "choice" ? step.options : [];
  for (const needle of [...INVEST_TIERS, NOT_READY_OPTION]) {
    if (!options.includes(needle)) {
      throw new Error(
        `qualify.ts: "${needle}" is no longer an option on "${QUALIFYING_STEP_ID}". The ` +
          "qualification gate that reads it is dead until these agree."
      );
    }
  }

  for (const s of qualifySteps) {
    if (s.kind === "choice" && s.other && !s.options.includes(s.other.option)) {
      throw new Error(
        `qualify.ts: the "other" trigger on "${s.id}" is not one of its options, so the ` +
          "follow-up input can never appear."
      );
    }
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
