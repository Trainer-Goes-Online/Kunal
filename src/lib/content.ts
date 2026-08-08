/**
 * Kraft With Kunal — LP copy, structured.
 *
 * SOURCE OF TRUTH: "Kunal Full Funnel Seggregation.md" (client-signed, supersedes
 * funnel-copy/01-landing-vsl.v2-nobrainer.md wherever the two disagree). Every
 * headline, bullet, deliverable, guarantee term and FAQ below is verbatim from
 * that document or a minimal typographic tidy of it.
 *
 * Numbers that the client may want to tune post-launch live in src/lib/site.ts as
 * env-overridable values (fee, success stories, rating, kilo range) — never
 * retyped inline.
 */

import { site, kiloRange } from "./site";

/* ---- Top trust banner (S01) — funnel md hero strip line 1 ----
   Split into number + label so each figure can be given its own emphasis on
   the brass bar; a single bolded run blended into the background. */
export const trustBanner = {
  storiesNum: site.successStories,
  storiesLabel: "Success Stories",
  perClientNum: "15-20 kgs",
  perClientLabel: "lost per client",
} as const;

/* ---- Program OUTCOMES — funnel md hero, the four achieved-results chips ---- */
export const outcomes = [
  "10x Energy Levels",
  "70-80% Increased Strength",
  "Better Quality Sleep",
  "Improved Blood Markers",
] as const;

/* ---- Hero ledger — funnel md 4-cell stat row under the hero CTA ---- */
export const heroStats = [
  { k: site.successStories, v: "High-Performers Coached" },
  { k: `${site.avgTransformWeeks}wk`, v: "Avg. Transformation" },
  { k: `${site.clientRating} ★`, v: "Client Rating" },
  /* Was `site.assessmentFee` ("₹97 To Start") in the paid funnel. This funnel
     charges nothing at any step, so a rupee figure here is a price claim with
     no price behind it. */
  { k: "₹0", v: "To Start" },
] as const;

/* ---- The three CTA reassurance badges — funnel md, repeated under every CTA ---- */
export const ctaBadges = [
  { icon: "star", label: "100% Results Guarantee" },
  { icon: "flame", label: `${site.successStories} Success Stories` },
  { icon: "globe", label: "Trusted by High-Performers Globally" },
] as const;

/* ---- "This Is For You if" — funnel md, five ✓ rows ---- */
export const fitYes = [
  {
    head: "You've built a successful career earning ₹25 lakhs+ a year,",
    body: "but your body is the one area that hasn't kept up.",
  },
  {
    head: "You've lost weight before, only to gain it back when work got busy,",
    body: "travel increased, or life got in the way.",
  },
  {
    head: "Your latest health check made you pause.",
    body: "Whether it was cholesterol, blood sugar or blood pressure, you know it's time to act before medication becomes your only option.",
  },
  {
    head: "You're not looking for another 12-week challenge.",
    body: "You're looking for a system that fits your life and delivers results that last.",
  },
  {
    head: "You want honest, no-nonsense coaching from someone who's walked this path himself",
    body: "and understands what it takes to balance fitness with business, family and responsibility.",
  },
] as const;

/* ---- Elite-athlete authority block — funnel md "The HIGH-PERFORMER PROTOCOL" ---- */
export const eliteAthlete = {
  eyebrow: "The High-Performer Protocol",
  heading: "From International Cricketers To Business Leaders, High Performers Trust The High-Performer Protocol",
  name: "Yashasvi Jaiswal",
  role: "Indian International Cricketer",
  body: "The High-Performer Protocol is built on the same principles of discipline, consistency and performance that elite athletes rely on. Today, those same standards help businessmen and senior professionals achieve extraordinary fitness results.",
  /* Supplied by the client (renamed from "yashswi jaswal.png" — Vercel's
     filesystem is case-sensitive and spaces would need encoding). It is a tall
     portrait, so the frame is 3/4 and anchors to the top to keep both faces. */
  photo: "/kunal-yashasvi.png",
  photoReady: true,
} as const;

/* ---- Founder / "Meet Your Coach" — funnel md, verbatim ---- */
export const founderPills = [
  "ACSM Certified Professional",
  "ASCA Level 1 Strength & Conditioning",
  "INFS Certified Fitness & Nutrition Coach",
  "HYROX Head Judge",
] as const;

export const founderStory = [
  "Kunal Chalke is an athlete-turned-fitness coach, ACSM Certified Professional, ASCA Level 1 Strength & Conditioning Coach, INFS Certified Fitness & Nutrition Coach, and HYROX Head Judge, combining elite athletic standards with science-backed coaching.",
  `Today, through ${site.brand}, he's helped ${site.successStories} businessmen, senior professionals and athletes lose weight, build strength and create lasting habits using the High-Performer Protocol, designed around demanding careers, not perfect routines.`,
  "He coaches every client personally. That's why the room stays small, and why the plan is never a template.",
] as const;

/**
 * Press + certification rail (funnel md "Meet Your Coach" table).
 *
 * All five assets are now in `/public/credentials/`, renamed from the client's
 * originals to lowercase, space-free paths — Vercel serves from a case-sensitive
 * filesystem, so "Power list.png" is a 404 waiting to happen.
 *
 * `ready` gates the image: false renders a titled brass plate instead of a broken
 * frame and still links out. Kept in place so a swapped-out or pending asset is a
 * one-flag change rather than a layout break.
 *
 * `focus` sets the background-position for that card. Press screenshots are tall,
 * so they anchor to the top to keep the masthead and headline in frame;
 * certificates are near-landscape and sit centred.
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
    /* The supplied certificate is the INFS Exercise Science Specialist course —
       the md listed it only as "Certified Exercise Science Specialist", so the
       issuing body is named here from the document itself. */
    kind: "Certification",
    title: "Certified Exercise Science Specialist",
    source: "INFS",
    // href: "https://drive.google.com/file/d/1A1O6WD0kldDjEUh17jvlb_kdYD5jWFPg/view",
    img: "/credentials/cert-infs-exercise-science.png",
    focus: "center center",
    ready: true,
  },
] as const;

/* ---- The Mechanism — four phases, now a scroll-assembled timeline ----
   Not covered by the funnel md, so the phase copy is unchanged. What DID change
   is the framing: the md sells a 12-week programme, so weeks 1-12 are labelled as
   the programme itself and weeks 13-26 as the continuation the md's FAQ describes
   ("If you choose to continue, the next phase shifts towards body recomposition").
   `icon` keys map to the glyph set in src/components/icons.tsx. */
export const phases = [
  {
    n: "01",
    label: "Weeks 1 to 4",
    stage: "Your 12-week programme",
    title: "Assessment & Reset",
    icon: "stethoscope",
    body: "A full workup: history, body composition, your real week, injuries, blood work, read together. The plan is built to your calendar. Training starts in three days.",
  },
  {
    n: "02",
    label: "Weeks 5 to 12",
    stage: "Your 12-week programme",
    title: "Fat Loss",
    icon: "flame",
    body: "A real but liveable deficit. Two numbers run the show: protein and steps. Training three to four days, harder on purpose, with a weekly check-in and adjustment.",
  },
  {
    n: "03",
    label: "Weeks 13 to 20",
    stage: "If you continue",
    title: "Recomposition",
    icon: "dumbbell",
    body: "Food comes back up, strength ramps, and the body gets built, not just lighter. Travel weeks and restaurant weeks get planned for, not feared.",
  },
  {
    n: "04",
    label: "Weeks 21 to 26",
    stage: "If you continue",
    title: "Lifestyle Lock",
    icon: "lock",
    body: "You learn to run your own week. Markers retested against your baseline. The result is made permanent.",
  },
] as const;

/* ---- Transformations marquee (before/after at a glance) ----
   The funnel md instructs "[Keep ONLY male transformation photos]". Each card is
   a self-contained plate with the client's name printed on it, so the three
   female clients were identified by inspection and removed:
     ba-2 Trupti · ba-4 Archana · ba-5 Manpreet   → withdrawn
     ba-1 Vaibhav · ba-3 Vinayak · ba-6 Ashish    → kept
   The files stay in /public so nothing is destroyed and a decision to bring any
   back is a one-line change. Three cards is a short rail — more male
   transformation plates would fill it out. */
export const baCards = [
  "/transformations/ba-1.jpg", // Vaibhav
  "/transformations/ba-3.jpg", // Vinayak
  "/transformations/ba-6.jpg", // Ashish
] as const;

/* ---- Video testimonials — names confirmed in the funnel md ---- */
export const testimonialNames = ["Ashish R", "Vaibhav", "Ashish"] as const;

/**
 * Face framing for the trust-strip avatar circles.
 *
 * The avatars reuse each testimonial's opening video frame, and those three
 * clips are shot very differently: one is a close-up selfie, two are standing
 * mid-shots where the head sits near the top. A single crop cannot serve all
 * three, so each carries its own zoom + vertical anchor.
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
] as const;

/* ---- "Everything Included In Your 12-Week Programme" — funnel md, six items ---- */
export const deliverables = [
  {
    n: "01",
    title: "Complete health & lifestyle assessment",
    icon: "stethoscope",
    body: "We start by understanding your body, your schedule and your health. Your body composition, eating habits, training history, injuries, lifestyle and blood work all come together to build a plan that's designed specifically for you.",
  },
  {
    n: "02",
    title: "Your personalised training blueprint",
    icon: "dumbbell",
    body: "A progressive training plan built around your calendar, whether you're travelling, working long hours or training from home. Every exercise includes video demonstrations and regular updates as you get stronger.",
  },
  {
    n: "03",
    title: "Personalised nutrition & supplement plan",
    icon: "plate",
    body: "No restrictive diets. No foods you can never eat again. Your calories, protein, meal timing, restaurant meals, travel and supplements are all planned around your lifestyle, not someone else's.",
  },
  {
    n: "04",
    title: "Weekly coaching & WhatsApp accountability",
    icon: "chat",
    body: "Every week, you'll check in directly with Kunal. Your progress, photos, weight and feedback are reviewed, your plan is adjusted, and you'll always know the next step instead of guessing.",
  },
  {
    n: "05",
    title: "Form corrections & injury support",
    icon: "shieldBody",
    body: "Record your workouts, send them directly to Kunal and receive detailed technique corrections. If you're managing shoulder, knee or back issues, your training is adapted so you can continue progressing safely.",
  },
  {
    n: "06",
    title: "Progress tracking & long-term habit coaching",
    icon: "chart",
    body: "Track your weight, waist measurements, strength and progress photos while building habits that survive busy work weeks, travel and family commitments, so your results actually last.",
  },
] as const;

/* ---- The four erased costs. Effort/Time now carry the funnel md's own numbers
   ("45-60 minutes, 3-5 days a week"), and Risk points at the new guarantee. ---- */
export const fourCosts = [
  {
    k: "Effort",
    icon: "clock",
    v: "45 to 60 minutes, 3 to 5 days a week, built around your calendar, not a gym-rat's.",
  },
  {
    k: "Time",
    icon: "bolt",
    v: "Training starts in three days, not after a 12-week “foundation.”",
  },
  {
    k: "Risk",
    icon: "shield",
    v: "The 100% Results Guarantee (below). Miss the outcome and every rupee comes back.",
  },
  {
    k: "Money",
    icon: "rupee",
    v: "No hard number on this page. What it costs, and whether it's even a fit, is a conversation Kunal has with you directly, after he's seen your situation.",
  },
] as const;

/* ---- 100% Results Guarantee — funnel md, replaces the old four-week rebuild ---- */
export const guarantee = {
  badge: "100% Results Guarantee",
  promise: `If you don't lose between ${kiloRange} kilos within your ${site.promiseDays}-day programme, we'll refund every rupee you paid us.`,
  qualifyLabel: "To Qualify",
  qualify: [
    "Simply commit to the process. Follow your personalised nutrition and training plan, complete your weekly check-ins, and submit your progress updates as requested. If you do your part and don't achieve the agreed outcome, we'll honour our guarantee.",
    "If your starting BMI is already close to a healthy range, your goal may shift from weight loss to body recomposition, waist reduction, muscle gain or improving key health markers. Your personalised success target will be agreed upon before you join.",
    `The guarantee applies for the first ${site.promiseDays} days of your programme.`,
  ],
} as const;

/* ---- FAQ — funnel md "Common Questions", nine items, order preserved ---- */
export const faqs = [
  {
    q: "I've tried gyms, diets and personal trainers before. Why would this be different?",
    a: "Most fitness plans fail because they're built for people with predictable schedules. The High-Performer Protocol is built around your work, travel and responsibilities. Instead of asking you to change your life to fit the plan, we build the plan around your life and adjust it every week as things change.",
    mostAsked: true,
  },
  {
    q: "I barely have time as it is. How much time do I actually need?",
    a: "Around 45-60 minutes, 3-5 days a week, depending on your goal and experience. Your programme is designed around your calendar, so whether you're travelling, working long hours or training from home, you'll always know exactly what to do.",
    mostAsked: false,
  },
  {
    q: "I travel frequently for work. Will I still be able to follow the programme?",
    a: "Yes. Travel is expected, not treated as a setback. Your nutrition, workouts and restaurant choices are adapted to your schedule so you can stay consistent whether you're at home, in a hotel or travelling internationally.",
    mostAsked: false,
  },
  {
    q: "Do I need to join a gym?",
    a: "No. The programme can be customised for a fully equipped gym, a basic gym or even home workouts with minimal equipment. We'll recommend the best setup based on your circumstances.",
    mostAsked: false,
  },
  {
    q: "What if I have knee pain, back pain or an old injury?",
    a: "Your programme is built around your body's limitations, not against them. Training is modified where required, and if you're already working with a physiotherapist or doctor, those recommendations can be incorporated into your plan.",
    mostAsked: false,
  },
  {
    q: "Do I have to give up eating out or drinking?",
    a: "No. The goal isn't to remove the foods you enjoy. Your nutrition plan includes practical strategies for client dinners, family outings, travel and social occasions, so you can lose weight without feeling like your life has stopped.",
    mostAsked: false,
  },
  {
    q: `What happens after the first ${site.promiseDays} days?`,
    a: `The first ${site.promiseDays} days are focused on building momentum and creating visible results. If you choose to continue, the next phase shifts towards body recomposition, building more muscle, improving strength and making your results sustainable for the long term.`,
    mostAsked: false,
  },
  {
    q: "What if I don't get the promised results?",
    a: "If you complete the programme as coached, follow your personalised training and nutrition plan, attend your weekly check-ins and submit your progress updates, you're covered by our Results Guarantee. Full details are shared on the guarantee section of this page.",
    mostAsked: false,
  },
  {
    q: "Will I be working directly with Kunal?",
    a: "Yes. This isn't a programme handed off to junior trainers. Kunal personally oversees your coaching, reviews your progress, adjusts your plan and works with you throughout your transformation.",
    mostAsked: false,
  },
] as const;
