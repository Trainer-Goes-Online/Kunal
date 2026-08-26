"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  QUALIFY_STORAGE_KEY,
  GATES_IN_FORM_ORDER,
  GATE_STYLE,
  failedRules,
} from "@/lib/qualify";
import { site } from "@/lib/site";

/**
 * "Here's why it wasn't approved" — all four gates as a pass/fail checklist,
 * green for met and red for not, each quoting the applicant's own answer.
 *
 * Reads the same GATES_IN_FORM_ORDER and GATE_STYLE the router and the
 * disqualified email use, so the page can never show a different verdict, a
 * different order or a different colour from the email that lands minutes
 * later. Showing all four (not only the failures) is the point: someone who
 * missed on income should be able to see that the rest of their application
 * was fine, and someone who missed on three should not re-apply expecting a
 * different answer.
 *
 * Answers come from sessionStorage, written by QualifyModal immediately before
 * it navigates here, so they are in place on mount. sessionStorage survives a
 * reload; a direct visit or a new tab has nothing, which renders an honest
 * fallback rather than four blank rows.
 */

/* sessionStorage read through useSyncExternalStore rather than an effect:
   getServerSnapshot returns null for the server render AND for hydration, so
   the markup matches, and the real value arrives on the first client snapshot.
   getSnapshot must return a STABLE value between renders, hence the raw
   string, parsed downstream in a useMemo. */
const subscribe = () => () => {};
const getSnapshot = (): string | null => {
  try {
    return window.sessionStorage.getItem(QUALIFY_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};
const getServerSnapshot = (): string | null => null;

function parseAnswers(raw: string): Record<string, string> | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) if (typeof v === "string") out[k] = v;
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

export function DisqualifiedAnswers() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const loading = raw === null;
  const answers = useMemo(() => (raw ? parseAnswers(raw) : null), [raw]);
  const name = answers?.firstName?.trim();
  const failedCount = useMemo(() => (answers ? failedRules(answers).length : 0), [answers]);

  return (
    <div className="dq-crit" data-sdp-reveal style={{ ["--d" as string]: ".08s" }}>
      <p className="dq-crit-intro">
        We book calls with people who meet <strong>all four</strong> of these. Here is how
        your answers landed.
      </p>

      <ol className="dq-crit-list">
        {GATES_IN_FORM_ORDER.map((rule) => {
          /* null while loading and for a visitor with no stored answers: a
             tick or a cross there would be a guess presented as a verdict. */
          const met = answers ? !rule.failed(answers) : null;
          const s = met === null ? null : met ? GATE_STYLE.pass : GATE_STYLE.fail;
          const given = answers?.[rule.from]?.trim();

          return (
            <li
              className="dq-crit-item"
              key={rule.code}
              data-met={met === null ? undefined : met ? "1" : "0"}
            >
              <div className="dq-crit-head">
                <span className="dq-crit-num" aria-hidden="true">
                  Q{rule.q}
                </span>
                <p className="dq-crit-text">{rule.label}</p>
                {s && (
                  <span
                    className="dq-crit-flag"
                    aria-label={met ? "You met this criterion" : "You did not meet this criterion"}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {met ? <path d="M5 12.5l4 4 10-10.5" /> : <path d="M7 7l10 10M17 7L7 17" />}
                    </svg>
                  </span>
                )}
              </div>

              <div className="dq-crit-resp">
                <span className="dq-crit-resp-lbl">
                  {name ? <>{name} answered</> : <>You answered</>}
                </span>
                {loading ? (
                  <span className="dq-crit-skel" aria-hidden="true" />
                ) : given ? (
                  <span className="dq-crit-resp-val">
                    <svg className="quo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9.6 5.5C6.5 6.9 4.6 9.6 4.6 12.8c0 3.2 1.9 5.4 4.4 5.4 2.1 0 3.7-1.5 3.7-3.5 0-1.9-1.3-3.3-3.1-3.3-.4 0-.8.1-1 .2.3-1.6 1.7-3.2 3.5-4.1zm9.3 0c-3.1 1.4-5 4.1-5 7.3 0 3.2 1.9 5.4 4.4 5.4 2.1 0 3.7-1.5 3.7-3.5 0-1.9-1.3-3.3-3.1-3.3-.4 0-.8.1-1 .2.3-1.6 1.7-3.2 3.5-4.1z" />
                    </svg>
                    {given}
                  </span>
                ) : (
                  <span className="dq-crit-resp-val dq-crit-resp-val--none">Not recorded</span>
                )}
              </div>

              {/* The full explanation, only on the ones that actually failed. */}
              {met === false && <p className="dq-crit-why">{rule.text}</p>}
            </li>
          );
        })}
      </ol>

      {!loading && answers && (
        <p className="dq-crit-verdict">
          {failedCount === 1
            ? "You didn’t meet one of these four."
            : `You didn’t meet ${failedCount} of these four.`}
        </p>
      )}

      {!loading && !answers && (
        <p className="dq-crit-lost">
          We couldn&rsquo;t load your answers on this device, so the four criteria are shown
          without your responses. Your application reached Kunal either way. Questions go to{" "}
          <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
        </p>
      )}
    </div>
  );
}
