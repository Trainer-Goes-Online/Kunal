import { Reveal } from "./Reveal";

/* Beats 3 and 4 are narrative agitation / blame-relief. They carry NO inherent
   structure, so per THE GATE they stay clean, well-set TEXT (prose beat with a
   dropcap opener + one display pull-quote), not a forced component. */

export function Problem() {
  return (
    <section id="problem" className="sdp-section sdp-light-alt">
      <div className="sdp-wrap">
        <Reveal className="sdp-prose">
          <div className="sdp-eyebrow" style={{ justifyContent: "flex-start" }}>The problem</div>
          <p className="sdp-dropcap">
            You know the routine. Bed tea and two biscuits. Breakfast skipped, no time. Lunch off the
            canteen or the phone. Dinner at 10, after everyone&rsquo;s eaten. &ldquo;Kal se pakka,&rdquo;
            and kal never comes, because your calendar always wins.
          </p>
          <p className="sdp-pullquote">
            You&rsquo;re the most disciplined man in every room. You just can&rsquo;t seem to win <em>this one</em>.
          </p>
          <p style={{ marginTop: 34 }}>
            Then the last health check said it out loud. Sugar borderline. Cholesterol up. Fatty liver.
            BP creeping. The doctor asked about family history, and of course there is.
          </p>
          <p>
            Here&rsquo;s what nobody puts a number on: <strong>waiting isn&rsquo;t free.</strong> Every
            year it stays like this, the markers move the wrong way, recovery gets slower, and the fix
            gets harder, not easier.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function RelieveBlame() {
  return (
    <section id="why-it-failed" className="sdp-section sdp-light">
      <div className="sdp-wrap">
        <Reveal className="sdp-prose">
          <div className="sdp-eyebrow" style={{ justifyContent: "flex-start" }}>Why it failed</div>
          <p>Let&rsquo;s be honest about the ones that failed.</p>
          <p>
            The gym near the office, three visits in six months. Keto, held until someone brought
            mithai. The foreign trainer who&rsquo;d never planned a week that had a board meeting, a
            flight, and a family dinner in it.
          </p>
          <p>
            It was never your discipline. You have more of that than most. Every one of them was built
            for a man with a simple life, not for a man running a company, a family, and a table full of
            food he&rsquo;s expected to eat. The mechanism you were missing was never willpower.
          </p>
          <p className="sdp-pullquote">
            It was never your discipline. It was <em>the plan</em>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
