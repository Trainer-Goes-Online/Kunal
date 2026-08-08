"use client";

import { useMemo, useSyncExternalStore } from "react";
import { CRITERIA, QUALIFY_STORAGE_KEY, DISQUALIFIED_PATH } from "@/lib/qualify";
import { site } from "@/lib/site";

/**
 * "Here's Why Your Application Wasn't Approved" — the three criteria from the
 * client's copy doc, each quoting back the applicant's own selection.
 *
 * Answers come from sessionStorage, written by QualifyModal immediately before
 * it navigates here, so they are in place on mount. sessionStorage survives a
 * reload; a direct visit or a new tab has nothing, which renders an honest
 * "not recorded" state and a way back to the form rather than a blank row.
 *
 * Which criteria can actually fail, and why, is documented on `CRITERIA` in
 * src/lib/qualify.ts. Read that before changing anything here.
 */

/* sessionStorage read through useSyncExternalStore rather than an effect:
   `getServerSnapshot` returns null for the server render AND for hydration, so
   the markup matches, and the real value arrives on the first client snapshot.
   getSnapshot must return a STABLE value between renders — hence the raw
   string, parsed downstream in a useMemo. Nothing writes this key while the
   page is open, so subscribe is a no-op. */
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
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "string") out[k] = v;
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

function TickGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4 4 10-10.5" />
    </svg>
  );
}

function CrossGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 7l10 10M17 7L7 17" />
    </svg>
  );
}

export function DisqualifiedAnswers() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const loading = raw === null;
  const answers = useMemo(() => (raw ? parseAnswers(raw) : null), [raw]);
  const name = answers?.firstName?.trim();

  return (
    <div className="dq-crit" data-sdp-reveal style={{ ["--d" as string]: ".08s" }}>
      <p className="dq-crit-intro">
        To make sure every strategy call is genuinely useful, we only book calls for people
        who meet <strong>all 3</strong> of these:
      </p>

      <ol className="dq-crit-list">
        {CRITERIA.map((c) => {
          const response = answers?.[c.from]?.trim();
          /* null while loading, and for a visitor with no stored answers —
             a tick or a cross there would be a guess presented as a verdict. */
          const met = answers ? c.met(answers) : null;

          return (
            <li
              className="dq-crit-item"
              key={c.n}
              data-met={met === null ? undefined : met ? "1" : "0"}
            >
              <div className="dq-crit-head">
                <span className="dq-crit-num" aria-hidden="true">
                  {c.n}
                </span>
                <p className="dq-crit-text">{c.text}</p>
                {met !== null && (
                  <span
                    className="dq-crit-flag"
                    aria-label={met ? "You met this criterion" : "You did not meet this criterion"}
                  >
                    {met ? <TickGlyph /> : <CrossGlyph />}
                  </span>
                )}
              </div>

              <div className="dq-crit-resp">
                <span className="dq-crit-resp-lbl">
                  {name ? <>{name}&rsquo;s response</> : <>Your response</>}
                </span>

                {loading ? (
                  <span className="dq-crit-skel" aria-hidden="true" />
                ) : response ? (
                  <span className="dq-crit-resp-val">
                    <svg className="quo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9.6 5.5C6.5 6.9 4.6 9.6 4.6 12.8c0 3.2 1.9 5.4 4.4 5.4 2.1 0 3.7-1.5 3.7-3.5 0-1.9-1.3-3.3-3.1-3.3-.4 0-.8.1-1 .2.3-1.6 1.7-3.2 3.5-4.1zm9.3 0c-3.1 1.4-5 4.1-5 7.3 0 3.2 1.9 5.4 4.4 5.4 2.1 0 3.7-1.5 3.7-3.5 0-1.9-1.3-3.3-3.1-3.3-.4 0-.8.1-1 .2.3-1.6 1.7-3.2 3.5-4.1z" />
                    </svg>
                    {response}
                  </span>
                ) : (
                  <span className="dq-crit-resp-val dq-crit-resp-val--none">Not recorded</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="dq-crit-verdict">You didn&rsquo;t meet one or more of these criteria.</p>

      {!loading && !answers && (
        <p className="dq-crit-lost">
          We couldn&rsquo;t load your answers on this device &mdash; they live in the tab you filled
          the form in, and this doesn&rsquo;t look like that tab. Your application reached Kunal
          either way. <a href={DISQUALIFIED_PATH}>Reload</a> in the original tab, or{" "}
          <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> will tell you which
          criterion you missed.
        </p>
      )}
    </div>
  );
}
