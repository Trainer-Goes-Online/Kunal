/**
 * Kraft With Kunal — LP copy, structured. MARATHI FUNNEL.
 *
 * SOURCE OF TRUTH: "Kunal Project File.md" (the Marathi-audience landing copy,
 * supplied 2026-10-23). It supersedes "Kunal Full Funnel Seggregation.md" and the
 * older High-Performer Protocol positioning everywhere the two disagree. Every
 * headline, bullet, deliverable, guarantee term and FAQ below is verbatim from
 * that document or a minimal typographic tidy of it.
 *
 * Numbers that the client may want to tune post-launch live in src/lib/site.ts as
 * env-overridable values (success stories, rating, kilo range, promise days) —
 * never retyped inline.
 */

import { site, kiloRange } from "./site";

/* ---- Top trust bar (S01 + S02) — the doc's two-line strip ----
   Line 1 → S01 (brass bar), line 2 → S02 (avatars + rating + guarantee + audience). */
export const trustLine1 = [
  `${site.successStories} Clients Coached`,
  "ACSM Certified",
  "Trained International Cricketers",
] as const;

export const trustLine2Audience = "Built For Marathi Working Professionals";

/* ---- Hero ---- */
export const hero = {
  callout: "For Marathi Working Professionals & Entrepreneurs Aged 35+",
  promise: `Achieve Your Fitness Goal In ${site.promiseDays} Days. Or Your Programme Is On Me.`,
  noGivingUp: "No giving up Poli-Bhaji, Varan-Bhaat or Bhakri. No crash diets. No endless hours in the gym.",
  coach: {
    eyebrow: "Meet Your Coach",
    name: "Kunal Chalke",
    role: "Athlete-Turned-Fitness Coach · ACSM Certified · HYROX Head Judge",
    line: "Athlete-turned-coach who now trains busy Marathi working professionals.",
    photo: "/kunal-coach.jpg",
  },
} as const;

/* The five-item strip under the hero CTA. `icon` keys map to src/components/icons.tsx. */
export const heroPointers = [
  { icon: "clock", label: "Fits 10–12 Hour Workdays" },
  { icon: "globe", label: "Travel-Friendly Plans" },
  { icon: "dumbbell", label: "Gym Or Home" },
  { icon: "chat", label: "Weekly 1:1 Check-Ins" },
  { icon: "star", label: "Marathi, Hindi & English Support" },
] as const;

/** The line printed under every CTA button. */
export const ctaScarcity = "Limited consultation slots available each week.";
export const ctaLabel = "Book Your Free 1:1 Fitness Strategy Call";

/* ---- "Does This Sound Like You?" — six rows + the closing line ---- */
export const soundsLikeYou = [
  {
    head: "Your belly has grown over the last few years.",
    body: "Between office hours, business meetings and family responsibilities, you've barely found time to take care of yourself.",
  },
  {
    head: "Your clothes don't fit the way they used to.",
    body: "You've started buying bigger sizes, and you know you've gained more weight than you're comfortable with.",
  },
  {
    head: "You've joined a gym or started a diet multiple times.",
    body: "You see some progress initially, but the moment work gets hectic, the routine breaks and the weight comes back.",
  },
  {
    head: "You don't want to stop eating the food your family cooks.",
    body: "You enjoy your regular पोळी-भाजी, वरण-भात, भाकरी and occasional restaurant meals. You need a plan that works with them.",
  },
  {
    head: "Your recent health reports have started worrying you.",
    body: "Whether it's cholesterol, blood sugar, blood pressure or increasing belly fat, you want to take your health more seriously.",
  },
  {
    head: "You want to get fitter without compromising your career or family time.",
    body: "You need someone to tell you exactly what to eat, how to train and what to change when your schedule gets busy.",
  },
] as const;

export const soundsLikeYouClose =
  "If you relate to these situations, this programme was designed for people like you.";

/* ---- The MARATHI Framework — seven letters. The doc sets the final "I"
   (Initial Body Assessment) apart as a full-width row; `wide` carries that. ---- */
export const marathiFramework = [
  {
    letter: "M",
    title: "Muscle-First Fat Loss",
    body: "Personalised strength workouts built around your fitness level and available time, whether at home or in the gym. Lose excess fat while maintaining muscle and building strength.",
  },
  {
    letter: "A",
    title: "Aahar: Your Regular Food",
    body: "Poli-Bhaji, Varan-Bhaat, Bhakri, Misal or your favourite non-veg meals. We personalise portions, protein and calories so you can lose fat without giving up your everyday food.",
  },
  {
    letter: "R",
    title: "Regular 1:1 Coaching",
    body: "Weekly personal check-ins with Kunal to review your weight, waist, strength and progress photos. Get direct feedback, accountability and adjustments instead of figuring everything out yourself.",
  },
  {
    letter: "A",
    title: "Adaptive Fitness Planning",
    body: "Late office hours, business travel, client dinners or family functions? Your workouts and nutrition are adjusted around your changing schedule so one busy week doesn't derail your progress.",
  },
  {
    letter: "T",
    title: "Technique & Injury Support",
    body: "Send workout videos directly to Kunal for exercise-form corrections. Your training is modified around old injuries, physical limitations and recovery needs so you can progress more safely.",
  },
  {
    letter: "H",
    title: "Habits That Last",
    body: `The goal isn't to follow a strict diet forever. You learn how to manage your food, workouts and progress even after ${site.promiseDays} days, so maintaining your transformation becomes part of your lifestyle.`,
  },
  {
    letter: "I",
    title: "Initial Body Assessment",
    body: `Your weight, body fat, muscle, waist, strength, health history and work schedule are assessed. Then we agree on a realistic, measurable ${site.promiseDays}-day fitness target.`,
    wide: true,
  },
] as const;

/* ---- Meet Kunal — certifications (pills) + press/cert rail ---- */
export const founderPills = [
  "ACSM Certified Fitness Professional",
  "ASCA Level 1 Strength & Conditioning Coach",
  "INFS Certified Fitness & Nutrition Coach",
  "HYROX Head Judge",
] as const;

/**
 * Press + certification rail (the doc's five linked images under "Meet Kunal").
 *
 * All five assets are in `/public/credentials/`, renamed from the client's
 * originals to lowercase, space-free paths — Vercel serves from a case-sensitive
 * filesystem, so "Power list.png" is a 404 waiting to happen.
 *
 * `ready` gates the image: false renders a titled brass plate instead of a broken
 * frame. `focus` sets the background-position: press screenshots are tall, so
 * they anchor to the top; certificates are near-landscape and sit centred.
 */
export const credentials = [
  {
    kind: "Press",
    title: "The Power List: Top 26 Indian Entrepreneurs Defining The Future in 2026",
    source: "Mumbai Uncensored",
    // href: "https://mumbaiuncensored.com/2026/07/24/the-power-list-top-26-indian-entrepreneurs-defining-the-future-in-2026/",
    img: "/credentials/press-power-list.png",
    focus: "center top",
    ready: true,
  },
  {
    kind: "Certification",
    title: "ACSM Certified Professional",
    source: "American College of Sports Medicine",
    // href: "https://drive.google.com/file/d/1FkgSKxM3-UG3uM9kAYAL_rhJAGhuS8cR/view",
    img: "/credentials/cert-acsm.png",
    focus: "center center",
    ready: true,
  },
  {
    kind: "Press",
    title: "Kunal Chalke: Building Stronger Lives Through Science-Backed Fitness Coaching",
    source: "Sangri Times",
    // href: "https://m.dailyhunt.in/news/india/english/sangri+times-epaper-dh95df621a7fd04fa4860b3336547dd507/kunal+chalke+building+stronger+lives+through+sciencebacked+fitness+coaching-newsid-dh95df621a7fd04fa4860b3336547dd507_3bd83790844d11f19fbbdd5186d048eb",
    img: "/credentials/press-sangri-times.png",
    focus: "center top",
    ready: true,
  },
  {
    kind: "Certification",
    title: "HYROX365 Foundation: HYROX Ready",
    source: "HYROX",
    // href: "https://drive.google.com/file/d/1XWvCQqDsA_Kg17yACxpxlfZaae-Y9KYo/view",
    img: "/credentials/cert-hyrox.jpg",
    focus: "center center",
    ready: true,
  },
  {
    kind: "Certification",
    title: "Certified Exercise Science Specialist",
    source: "INFS",
    // href: "https://drive.google.com/file/d/1A1O6WD0kldDjEUh17jvlb_kdYD5jWFPg/view",
    img: "/credentials/cert-infs-exercise-science.png",
    focus: "center center",
    ready: true,
  },
] as const;

/* ---- Before/after rails ----
   The doc asks for TWO rows of five (row 1 drifts left→right, row 2 right→left).
   Only four male transformation plates exist today (the three female plates —
   ba-2 Trupti, ba-4 Archana, ba-5 Manpreet — stay withdrawn; this funnel is
   "Built For Marathi Working Professionals"). Until more plates are supplied, both rows draw from
   the same four, in a different order so the two rows never line up.
   TO ADD PLATES: drop them in /public/transformations and list them below. */
export const baCards = [
  "/transformations/ba-7.jpg", // Kaushabh — corporate, 95→75kg in 6 months
  "/transformations/ba-1.jpg", // Vaibhav
  "/transformations/ba-3.jpg", // Vinayak
  "/transformations/ba-6.jpg", // Ashish
] as const;

export const baRows = [
  ["/transformations/ba-7.jpg", "/transformations/ba-1.jpg", "/transformations/ba-3.jpg", "/transformations/ba-6.jpg"],
  ["/transformations/ba-3.jpg", "/transformations/ba-6.jpg", "/transformations/ba-7.jpg", "/transformations/ba-1.jpg"],
] as const;

/* ---- Client chat screenshots ("Here's A Glimpse Into Our Clients' Journeys") ----
   WhatsApp messages from clients, with the contact name + profile photo in the
   chat header blurred out (privacy). Four supplied so far, so they run as ONE
   auto-scrolling rail; the set repeats twice so a single set is wider than the
   viewport and the infinite loop never shows a gap. The lightbox de-duplicates.
   TO ADD MORE: drop chat-5.jpg … in /public/chats and list them here. A second
   row (right→left) appears as soon as chatRows[1] has entries. */
const chatShots = [
  "/chats/chat-1.jpg",
  "/chats/chat-2.jpg",
  "/chats/chat-3.jpg",
  "/chats/chat-4.jpg",
] as const;
export const chatRows: readonly [readonly string[], readonly string[]] = [
  [...chatShots, ...chatShots],
  [],
];

/* ---- Video testimonials — names confirmed in the funnel md ---- */
export const testimonialNames = ["Ashish R", "Vaibhav", "Ashish", "Kaushabh"] as const;

/**
 * Face framing for the trust-strip avatar circles.
 *
 * The avatars reuse each testimonial's opening video frame, and those clips are
 * shot very differently, so each carries its own zoom + vertical anchor.
 *
 *   zoom  — background-size as a % of the circle's width (100% = plain cover)
 *   focus — background-position-y; 0% shows the top of the frame, 100% the base
 *
 * TO RETUNE after a clip is swapped: find the face's vertical centre in the
 * frame as a fraction f (0 = top, 1 = bottom), then
 *   slice = 56.25 / zoom      focus = (f - slice/2) / (1 - slice) * 100
 * Clamp focus to 0 when the head sits near the very top.
 */
export const testimonialAvatarCrop = [
  { zoom: "100%", focus: "68%" }, // Ashish R — close-up selfie, face mid-frame
  { zoom: "252%", focus: "26%" }, // Vaibhav  — standing, head ~a third down
  { zoom: "200%", focus: "0%" },  // Ashish   — standing, head near the top
  { zoom: "150%", focus: "22%" }, // Kaushabh — selfie, 464×832; zoomed out to show the whole head
] as const;

/* ---- "Everything You Get" — six inclusions ---- */
export const deliverables = [
  {
    n: "01",
    title: "Complete Body & Lifestyle Assessment",
    icon: "stethoscope",
    body: `We assess your weight, body fat, waist, strength, eating habits and work schedule. Then we agree on a clear, realistic ${site.promiseDays}-day transformation target.`,
  },
  {
    n: "02",
    title: "Workouts Built Around Your Work Hours",
    icon: "dumbbell",
    body: "Personalised strength and fat-loss workouts for home or gym. Long office days or business travel? Your training is adjusted to fit your available time.",
  },
  {
    n: "03",
    title: "Nutrition From Your Own Kitchen",
    icon: "plate",
    body: "Poli-Bhaji, Varan-Bhaat, Bhakri and your regular family meals stay. We personalise your portions, protein and calories without requiring separate cooking.",
  },
  {
    n: "04",
    title: "Weekly 1:1 Coaching With Kunal",
    icon: "chat",
    body: "Every week, Kunal reviews your weight, waist, workouts and progress. You get direct feedback, accountability and adjustments whenever your routine changes.",
  },
  {
    n: "05",
    title: "Exercise Form & Technique Corrections",
    icon: "shieldBody",
    body: "Send your workout videos directly to Kunal for form corrections. Your exercises are adapted to your fitness level, recovery needs and physical limitations.",
  },
  {
    n: "06",
    title: "Progress Tracking & Long-Term Maintenance",
    icon: "chart",
    body: `Track changes in your weight, waist, strength and body composition. Build a practical routine to help maintain your results after the first ${site.promiseDays} days.`,
  },
] as const;

/* ---- 100% Results Guarantee ----
   The same promise is mirrored on /refund; both read from here so they cannot
   drift apart. */
export const guarantee = {
  badge: "100% Results Guarantee",
  titleLead: "Achieve Your Fitness Goal.",
  titleAccent: "Or Get Your Money Back.",
  body: [
    `Before your programme begins, Kunal will assess your starting point and agree on a realistic ${site.promiseDays}-day transformation target with you.`,
    `For eligible clients, this may involve losing ${kiloRange} kilos. For others, the target may focus on waist reduction, body recomposition or other measurable fitness outcomes.`,
  ],
  /* The conditional sentence; the refund clause is bolded by the component. */
  conditionLead:
    "If you follow your personalised nutrition and training plan, complete your weekly check-ins and submit the required progress updates, but fail to achieve your agreed guaranteed outcome within the programme period, ",
  conditionBold: "your programme fee will be refunded under the guarantee terms.",
  footnote: "Full eligibility and adherence conditions will be explained before enrolment.",
} as const;

/* ---- FAQ — "Questions Busy Men Commonly Ask", order preserved ---- */
export const faqs = [
  {
    q: "Do I have to stop eating rice, roti or my regular food?",
    a: "No. Your plan will be designed around the food you normally eat at home, including पोळी, भाजी, वरण-भात, भाकरी and other favourites. Kunal will help you adjust portions, protein and meal combinations according to your fitness goals.",
    mostAsked: true,
  },
  {
    q: "I work 10–12 hours a day. Will I realistically be able to follow this?",
    a: "Yes, the programme is designed for busy working professionals. Kunal will understand your weekly schedule and create a training and nutrition routine that fits your availability. You'll also have weekly reviews to make adjustments when work gets demanding.",
    mostAsked: false,
  },
  {
    q: "I'm already 40 or 45+. Is it too late to lose belly fat and build strength?",
    a: "No. Your age, current fitness level, medical history and recovery capacity will be considered while designing your plan. You won't be expected to train like a 25-year-old athlete.",
    mostAsked: false,
  },
  {
    q: "Do I need to join a gym?",
    a: "Not necessarily. Kunal can design your programme around the equipment and space you have available, whether that's at home or in a gym.",
    mostAsked: false,
  },
  {
    q: "What if I travel frequently or eat out for business meetings?",
    a: "Your nutrition and workout plans can be adjusted for travel, hotel stays, restaurant meals and irregular workdays. The goal is to help you remain consistent even when your schedule isn't perfect.",
    mostAsked: false,
  },
  {
    q: "Will I work directly with Kunal?",
    a: "Yes. Kunal personally reviews your progress, provides weekly coaching feedback and helps make adjustments throughout your programme.",
    mostAsked: false,
  },
  {
    q: "What happens on the free fitness strategy call?",
    a: `Kunal will understand your current fitness level, weight-loss goals, work schedule, food habits and previous attempts. He'll explain what your personalised ${site.promiseDays}-day approach could look like and whether the programme is suitable for you.`,
    mostAsked: false,
  },
  {
    q: `What happens after the ${site.promiseDays} days?`,
    a: "The aim is to help you transition into a sustainable routine for maintaining your results. You'll work on the nutrition, training and lifestyle habits needed to continue managing your fitness independently.",
    mostAsked: false,
  },
] as const;

/* ======================================================================
   LEGACY — not rendered on the Marathi landing page.
   Kept only because dormant components (EliteAthlete, FourCosts) still
   import them; remove together with those components if they are deleted.
   ====================================================================== */
export const eliteAthlete = {
  eyebrow: "Trained International Cricketers",
  heading: "From International Cricketers To Marathi Working Professionals",
  name: "Yashasvi Jaiswal",
  role: "Indian International Cricketer",
  body: "Kunal has worked with international cricketers and athletes. The same principles of training, nutrition and recovery now power the MARATHI Framework.",
  photo: "/kunal-yashasvi.png",
  photoReady: true,
} as const;

export const fourCosts = [
  { k: "Effort", icon: "clock", v: "Workouts built around your work hours, at home or in the gym." },
  { k: "Time", icon: "bolt", v: `A clear, measurable ${site.promiseDays}-day target agreed before you start.` },
  { k: "Risk", icon: "shield", v: "The 100% Results Guarantee. Miss the agreed outcome and your programme fee is refunded under the guarantee terms." },
  { k: "Money", icon: "rupee", v: "The strategy call is free. Fees are discussed only once Kunal has seen your situation." },
] as const;
