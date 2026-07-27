/**
 * Kraft With Kunal — LP copy, structured.
 * Source of truth: funnel-copy/01-landing-vsl.v2-nobrainer.md (VSL 13-beat).
 * Proof figures stay flagged and swappable / unasserted until Kunal confirms them
 * (lawyer ~68kg not 78; Kunal 108->71; banker 135->85). Never assert client volume.
 */

import { site } from "./site";

/* ---- Beat 0b : trust-chip row (three men, figures being confirmed) ---- */
export const trustChips = [
  "Lawyer 94 → ~68kg",
  "Banker 135 → 85kg",
  "Kunal 108 → 71kg",
] as const;

/* ---- Program FEATURES (hero pre-video pills + Section 2). What the program IS. ---- */
export const features = [
  "Plan built to your real week",
  "Coached 1:1 by Kunal, never a template",
  "Weekly WhatsApp accountability",
  "Form checks + injury-safe training",
  "Blood-markers tracked, in plain language",
  "Habits that survive a bad work week",
] as const;

/* ---- Program OUTCOMES (post-video pills). Four, no heading. ---- */
export const outcomes = [
  "15 to 20kg down",
  "Real muscle on the frame",
  "Blood work moving right",
  "Energy back for good",
] as const;

/* ---- Three pointers (icon row under the hero CTA) ---- */
export const pointers = [
  "Built around board meetings, flights, and family dinners",
  "Coached 1:1 by Kunal, the room stays small",
  "A diagnosis first, never a template",
] as const;

/* ---- Beat 1 : hero stats ledger (the 4th column is the assessment fee) ---- */
export const heroStats = [
  { k: "Coached", v: "1:1 by Kunal" },
  { k: "Length", v: "90-Day or 6-Month" },
  { k: "Room", v: "₹25L+ men only" },
  { k: "To apply", v: site.assessmentFee },
] as const;

/* ---- Beat 2 : This Is For You If (one-sided ✓ self-recognition set) ---- */
export const fitYes = [
  {
    head: "You've hit every target you set, except the one in the mirror.",
    body: "The income climbed, the title changed, the standing in every room went up. The body went the other way.",
  },
  {
    head: "The fitted shirt, the pool, the holiday photo, they stopped feeling like a win.",
    body: "The places your success should feel best are the exact places the gap now shows.",
  },
  {
    head: "You already know what to do. Knowing was never the problem.",
    body: "You could recite protein, steps, and sleep in your own words. What you've never had is a plan that survives your actual week.",
  },
  {
    head: "A health check flagged something, and a pill wasn't the answer you wanted.",
    body: "You'd rather fix the cause than manage a number on a chart for the rest of your life.",
  },
  {
    head: "You think in years, not in a 12-week challenge.",
    body: "You're done with the restart cycle. You want a system you keep for good, run by a man who has done it himself.",
  },
] as const;

export const notForYou =
  "This is not for you if you're shopping for the cheapest plan or a free PDF; you blame your age, your genetics, or your calendar and intend to keep blaming them; you want a quick fix you're fine regaining; you won't give three honest hours a week; you want a cheerleader, not a system.";

export const incomeLine =
  "If you earn under ₹25 lakh a year, this isn't the program for you.";

/* ---- Beat 5 : Founder credentials (list) + narrative (kept as text) ---- */
export const founderPills = [
  "Coaches every client 1:1",
  "Coach, not a doctor",
  "HYROX-certified",
  "108 → 71kg himself",
] as const;

export const founderStory = [
  "Kunal isn't a doctor. His wife is. He coaches alongside your doctor, never around him.",
  "What he brings is the other half of the equation. He carried 108kg himself and got to 71kg. Then he did it for men who looked exactly like you before they started: a lawyer, a banker, an engineer, each with a calendar as full as yours.",
  "He coaches every client personally. That's why the room stays small, and why the plan is never a template.",
] as const;

/* ---- Beat 6 : The Mechanism (four phases → numbered pillar ledger) ---- */
export const phases = [
  {
    n: "01",
    label: "Weeks 1 to 4",
    title: "Assessment & Reset",
    body: "A full workup: history, body composition, your real week, injuries, blood work, read together. The plan is built to your calendar. Training starts in three days.",
  },
  {
    n: "02",
    label: "Weeks 5 to 12",
    title: "Fat Loss",
    body: "A real but liveable deficit. Two numbers run the show: protein and steps. Training three to four days, harder on purpose, with a weekly check-in and adjustment.",
  },
  {
    n: "03",
    label: "Weeks 13 to 20",
    title: "Recomposition",
    body: "Food comes back up, strength ramps, and the body gets built, not just lighter. Travel weeks and restaurant weeks get planned for, not feared.",
  },
  {
    n: "04",
    label: "Weeks 21 to 26",
    title: "Lifestyle Lock",
    body: "You learn to run your own week. Markers retested against your baseline. The result is made permanent.",
  },
] as const;

/* ---- Beat 3 : Transformations marquee (before/after at a glance) ---- */
/* The real before/after cards from the main branch. Each card is self-contained
   (client name + before/after photos + short story), so the marquee shows them as
   image-only tiles — no separate caption to contradict what's printed on the card. */
export const baCards = [
  "/transformations/ba-1.jpg",
  "/transformations/ba-2.jpg",
  "/transformations/ba-3.jpg",
  "/transformations/ba-4.jpg",
  "/transformations/ba-5.jpg",
  "/transformations/ba-6.jpg",
] as const;

/* ---- Beat 4 : The Proof / case files ---- */
export const cases = [
  {
    meta: "The lawyer",
    delta: "94kg → ~68kg",
    note: "Ran on coffee and 14-hour days for a decade, and tried every gym membership guilt could buy. Working around his court calendar, not against it, about 25 kilos gone, and back in the suits he'd stopped wearing.",
    flag: "figure being confirmed",
  },
  {
    meta: "The banker",
    delta: "135kg → 85kg",
    note: "Travelled four days a week and ate every meal out. Started at the heaviest of his life. Fifty kilos down, on a plan built for the road, not the gym.",
    flag: "figure being confirmed",
  },
  {
    meta: "Kunal himself",
    delta: "108kg → 71kg",
    note: "He built the protocol on his own body first. And he's kept it, which is the whole point.",
    flag: "figure being confirmed",
  },
] as const;

/* ---- Beat 8 : The Programme (seven-item numbered ledger) ---- */
export const deliverables = [
  {
    n: "01",
    title: "Full lifestyle and medical assessment",
    body: "Body composition, schedule, injuries, and current blood work, read together, so the plan starts from your reality.",
  },
  {
    n: "02",
    title: "A plan built to your week",
    body: "Personalised training and nutrition, chosen around your calendar, restaurants, and travel, with nothing banned that you won't sustain.",
  },
  {
    n: "03",
    title: "Weekly WhatsApp accountability",
    body: "You send the week, you get the adjustment: what worked, and the one thing to fix next.",
  },
  {
    n: "04",
    title: "Form checks and injury work on video",
    body: "Send a lift and get it corrected, and train around the old shoulder or knee, coordinated with your physio where it matters.",
  },
  {
    n: "05",
    title: "Health-marker tracking",
    body: "Baseline blood work logged and retested where you're willing, read back in plain language, alongside your doctor.",
  },
  {
    n: "06",
    title: "Habit coaching and a private progress log",
    body: "The routine that survives a bad work week, tracked against your own starting line. The part that makes the result hold.",
  },
  {
    n: "07",
    title: "Supplement guidance",
    body: "What to use, what to skip, checked against your history. No upsell.",
  },
] as const;

export const fourCosts = [
  { k: "Effort", v: "Three honest hours a week, built around your calendar, not a gym-rat's." },
  { k: "Time", v: "Training starts in three days, not after a 12-week “foundation.”" },
  { k: "Risk", v: "The four-week guarantee (below)." },
  { k: "Money", v: "No hard number on this page. What it costs, and whether it's even a fit, is a conversation Kunal has with you directly, after he's seen your situation." },
] as const;

/* ---- Beat 10 : Two Choices (weighted compare, 01 dimmed / 02 lit) ---- */
export const twoChoices = {
  drift: "Keep running the same calendar, telling yourself “kal se,” and let the markers drift another year.",
  act: `Put ${site.assessmentFee} down, get Kunal's eyes on your case, and walk away with a clear read on your body, your markers, and the plan that fits your week, whether or not you go further.`,
} as const;

/* ---- Beat 11 : FAQ / Even-If (six items, fixed order, price runs long) ---- */
export const faqs = [
  {
    q: "Is this just a sales call?",
    a: "No. It's a paid assessment, and you leave with a real read on your situation whether or not you join. Kunal looks at your history, your schedule, and your goals, and tells you straight, a fit or not. The men he turns away get an honest “not yet” and the reason why. You're paying for his eyes on your case, not for a pitch.",
    mostAsked: true,
  },
  {
    q: "I genuinely don't have two hours a day.",
    a: "Even if your calendar is full, three honest hours a week is the ask, designed around board meetings, flights, and family dinners, not despite them.",
    mostAsked: false,
  },
  {
    q: "I've failed every time before. Why would this be different?",
    a: "Even if every plan you've tried has failed, the ones that failed were built for a life that isn't yours. This one starts by reading your actual week before a single thing is prescribed.",
    mostAsked: false,
  },
  {
    q: "My knees, my shoulder, an old injury won't let me train.",
    a: "Even if you're carrying an old injury, the plan trains around it, coordinated with your physio where it matters.",
    mostAsked: false,
  },
  {
    q: "I'm starting from the worst shape of my life.",
    a: "Even if you're heavier than you've ever been, so was the banker at 135kg, and so was Kunal at 108kg.",
    mostAsked: false,
  },
  {
    q: "What's the actual investment?",
    a: `The program price isn't on this page on purpose, and it isn't hidden either. What it costs depends on which length fits you, and whether it's a fit at all is something Kunal decides with you on the call. Today you're only putting down ${site.assessmentFee} for the assessment. If he takes you on, you'll know the number before you commit to anything: no instalment menus, no discounts, one real price.`,
    mostAsked: false,
  },
] as const;
