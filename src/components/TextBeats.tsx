import { Lit } from "./ui";
import { InfographicBeat } from "./InfographicBeat";

/* Editorial persuasion beats, each paired with an infographic that carries the
   same meaning visually (image beside copy on desktop, above it on mobile).
   Fail-open: if an infographic file is missing, the beat renders as text only. */

export function Problem() {
  return (
    <InfographicBeat id="problem" img="/infographics/problem.png" alt="A packed day leaves no room for his health" eyebrow="The problem" altBg>
      <p className="dropcap">
        You know the routine. Bed tea and two biscuits. Breakfast skipped — no time.
        Lunch off the canteen or the phone. Dinner at 10, after everyone&rsquo;s eaten.
        &ldquo;Kal se pakka&rdquo; — and kal never comes, because your calendar always wins.
      </p>
      <p className="pullquote">
        You&rsquo;re the most disciplined man in every room you walk into.
        You just can&rsquo;t seem to win this one.
      </p>
    </InfographicBeat>
  );
}

export function Stakes() {
  return (
    <InfographicBeat id="stakes" img="/infographics/stakes.png" alt="Health markers drifting the wrong way over time" eyebrow="The stakes" reverse>
      <p>
        The last health check said it out loud. Sugar borderline. Cholesterol up.
        Fatty liver. BP creeping. The doctor asked about family history — and of course there is.
      </p>
      <p>
        Here&rsquo;s what nobody puts a number on: <strong>waiting isn&rsquo;t free.</strong> Every year it
        stays like this, the markers move the wrong way, the recovery gets slower, and the fix
        gets harder — not easier.
      </p>
    </InfographicBeat>
  );
}

export function RelieveBlame() {
  return (
    <InfographicBeat id="why-it-failed" img="/infographics/plan.png" alt="The one plan built around your real week" eyebrow="Why it failed" altBg>
      <p>
        The gym near the office — three visits in six months. Keto — held until someone brought
        mithai. The foreign trainer who&rsquo;d never planned a week that had a board meeting, a
        flight, and a family dinner in it.
      </p>
      <p>
        It was never your discipline. You have more of that than most. It was the plan — every one
        built for a man with a simple life, not for a man running a company, a family, and a table
        full of food he&rsquo;s expected to eat.
      </p>
      <p className="pullquote">
        It was never your discipline. It was <Lit>the plan.</Lit>
      </p>
    </InfographicBeat>
  );
}
