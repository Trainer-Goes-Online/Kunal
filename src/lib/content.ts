/**
 * Kraft With Kunal — LP copy, structured.
 * Source of truth: funnel-copy/01-landing-vsl.md (approved), reconciled to the
 * offer doc. Proof figures are flagged and must stay swappable / unasserted until
 * Kunal confirms them (lawyer ~68kg not 78; Kunal 108->71; banker 135->85).
 */

export const phases = [
  {
    n: "01",
    label: "Weeks 1–4",
    title: "Assessment & Reset",
    body: "Full workup: training history, body composition, your real schedule, eating habits, injuries, current blood work — read together. The plan is built to your actual week. Training starts in three days.",
  },
  {
    n: "02",
    label: "Weeks 5–12",
    title: "Fat Loss",
    body: "A real but liveable deficit. Two numbers run the show: protein and steps. Training three to four days, harder on purpose. Weekly check-in, weekly adjustment.",
  },
  {
    n: "03",
    label: "Weeks 13–20",
    title: "Recomposition",
    body: "Food comes back up. Strength ramps. The body gets built, not just lighter. Travel weeks and restaurant weeks get planned for, not feared.",
  },
  {
    n: "04",
    label: "Weeks 21–26",
    title: "Lifestyle Lock",
    body: "You learn to run your own week. Markers retested against your baseline. The result is made permanent.",
  },
] as const;

export const deliverables = [
  "Full lifestyle and medical assessment",
  "A plan built to your week",
  "Personalised training plan",
  "Personalised nutrition plan",
  "Weekly WhatsApp accountability",
  "Form checks on video",
  "Injury and constraint work",
  "Health-marker tracking, read in plain language",
  "Supplement guidance — no upsell",
  "Habit and lifestyle coaching",
  "A private progress log",
] as const;

export const fourCosts = [
  { k: "Effort", v: "Three honest hours a week, built around your calendar — not a gym-rat's." },
  { k: "Time", v: "Training starts in three days, not after some 12-week “foundation.”" },
  { k: "Risk", v: "The four-week guarantee — if it hasn't started to move, Kunal rebuilds the plan." },
  { k: "Money", v: "No number on this page. What it costs, and whether it's a fit, is a conversation Kunal has with you after he's seen your situation." },
] as const;

// Proof — every figure flagged; render as case files, never assert client volume.
export const cases = [
  {
    meta: "The lawyer · 46",
    delta: "94kg → ~68kg",
    note: "Roughly 25kg down. Trained three days a week around a schedule worse than yours, and travelled through it. Building muscle at 48, eighteen months in.",
    flag: "confirm exact figure with Kunal",
  },
  {
    meta: "The banker",
    delta: "135kg → 85kg",
    note: "Fifty kilos gone while running a demanding job the entire way. Wouldn't take a photo when he started.",
    flag: "confirm before publish",
  },
  {
    meta: "Kunal himself",
    delta: "108kg → 71kg",
    note: "He did it himself first — then built the system for men who looked exactly like you before they started.",
    flag: "confirm figures + show proof",
  },
] as const;

export const fitYes = [
  "You earn ₹25 lakh a year or more and have built real success at work.",
  "Your body is the one area of your life that stopped keeping up.",
  "You've tried before — it worked for a few weeks, then your schedule won.",
  "A last health check flagged something, and a pill wasn't the answer you wanted.",
  "You think in years, not in a 12-week challenge.",
] as const;

export const fitNo = [
  "You're shopping for the cheapest plan or a free PDF.",
  "You blame your age, your genetics, or your calendar — and intend to keep blaming them.",
  "You want a quick fix and you're fine gaining it back.",
  "You won't give three honest hours a week.",
  "You want a cheerleader. This is a system, not a hype account.",
] as const;

export const faqs = [
  {
    q: "Will this work for me — I've failed every time before?",
    a: "Even if every plan you've tried has failed, the ones that failed were built for a life that isn't yours. This one starts by looking at your actual week.",
    mostAsked: true,
  },
  {
    q: "I genuinely don't have two hours a day.",
    a: "Even if your calendar is full, three honest hours a week is the ask — designed around board meetings, flights, and family dinners, not despite them.",
    mostAsked: false,
  },
  {
    q: "My knees / shoulder / old injury won't let me train.",
    a: "Even if you're carrying an old injury, the plan trains around it, coordinated with your physio where it matters.",
    mostAsked: false,
  },
  {
    q: "I'm starting from the worst shape of my life.",
    a: "Even if you're starting heavier than you've ever been — so was the banker at 135kg, and so was Kunal at 108kg.",
    mostAsked: false,
  },
] as const;

export const trustItems = [
  "For men earning ₹25L+",
  "Coached personally by Kunal",
  "Built around your calendar",
] as const;
