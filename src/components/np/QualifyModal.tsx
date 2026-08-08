"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  qualifySteps,
  dialCodes,
  QUALIFY_STORAGE_KEY,
  DISQUALIFIED_PATH,
  isDisqualified,
  validateFirstName,
  validateEmail,
  validatePhone,
  type DialCode,
} from "@/lib/qualify";
import { site } from "@/lib/site";
import { trackGa4EventOnce } from "@/lib/ga4";
import { restoreUtm, restoreFbclid, fireRegistrationEvents } from "@/lib/tracking";

/**
 * THE CTA MODAL — six questions, one per screen, then straight to the calendar.
 *
 * Mounted ONCE per page. It opens itself: every CTA on the site is a real
 * `<a href="/book-a-call" data-qualify-open>`, and this component intercepts
 * the click at document level — the same delegation pattern ClientBehaviors
 * uses, so the CTAs stay server components with no client JS of their own.
 *
 * FAIL-OPEN, and that is why the CTAs are anchors rather than buttons: with JS
 * off (or before hydration) the click is not intercepted and the link simply
 * goes to /book-a-call. The applicant loses the qualifier, never the booking.
 *
 * NO PAYMENT ANYWHERE IN HERE. The old funnel's CTAs pointed at /checkout and
 * Razorpay; this one collects answers and hands off. `/api/lead` is
 * best-effort and deliberately un-awaited (keepalive/sendBeacon) — a slow or
 * dead webhook must never sit between someone and the calendar.
 */
export function QualifyModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [country, setCountry] = useState<DialCode>(dialCodes[0]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const total = qualifySteps.length;
  const current = qualifySteps[step];
  const isLast = step === total - 1;

  /* ---- Open: delegated click on any [data-qualify-open] CTA ---- */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Let modified clicks (new tab / new window) behave natively.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const trigger = (e.target as HTMLElement | null)?.closest?.<HTMLElement>("[data-qualify-open]");
      if (!trigger) return;
      e.preventDefault();
      lastFocused.current = trigger;
      setOpen(true);
      // AddToCart (Meta CAPI) + GA4 add_to_cart fire from CtaTracker on this same
      // [data-qualify-open] click; the modal just opens here.
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setError("");
    lastFocused.current?.focus?.();
  }, []);

  /* ---- Scroll lock + Escape, only while open ---- */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, submitting, close]);

  /* ---- Focus the field (or the panel, on choice steps) as each step lands ---- */
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      if (firstFieldRef.current) firstFieldRef.current.focus();
      else panelRef.current?.focus();
    }, 60);
    return () => window.clearTimeout(t);
  }, [open, step]);

  const setAnswer = (id: string, value: string) =>
    setAnswers((a) => ({ ...a, [id]: value }));

  /* ---- Submit: stash, count, fire-and-forget, hand off to the calendar ---- */
  const submit = useCallback(
    (finalAnswers: Record<string, string>) => {
      setSubmitting(true);
      const firstName = (finalAnswers.firstName || "").trim();
      const email = (finalAnswers.email || "").trim().toLowerCase();
      const disqualified = isDisqualified(finalAnswers);
      const payload = {
        firstName,
        email,
        whatsapp: `${country.dial}${(finalAnswers.whatsapp || "").replace(/\D/g, "")}`,
        countryCode: country.code,
        dialCode: country.dial,
        role: finalAnswers.role || "",
        goal: finalAnswers.goal || "",
        income: finalAnswers.income || "",
        investment: finalAnswers.investment || "",
        /* The routing decision travels WITH the lead. Pabbly must not have to
           re-derive it by string-matching the investment answer — that rule
           lives in one place (qualify.ts) and nowhere else. */
        qualified: !disqualified,
        utm: restoreUtm(),
        fbclid: restoreFbclid(),
        pageUrl: window.location.href,
      };

      // Kept for the next page — /book-a-call greets by name, and
      // /thank-you-disqualified quotes the answers back. The URL carries only
      // the name, so the rest rides in the tab rather than in a shareable link.
      try {
        window.sessionStorage.setItem(QUALIFY_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        /* private mode — /thank-you-disqualified degrades to its "not
           recorded" state, and the booking hand-off is unaffected */
      }

      // GA4: complete_registration for everyone who finishes the form;
      // qualified_lead only when the investment answer qualifies (top 3 options).
      trackGa4EventOnce("complete_registration");
      if (!disqualified) trackGa4EventOnce("qualified_lead");

      // Meta CAPI (highest EMQ): CompleteRegistration always, QualifiedLead when
      // qualified. Fire-and-forget; survives the hand-off navigation below.
      fireRegistrationEvents(
        { firstName, email, phone: payload.whatsapp, countryCode: country.code },
        !disqualified
      );

      const body = JSON.stringify(payload);
      let sent = false;
      try {
        const blob = new Blob([body], { type: "application/json" });
        sent = Boolean(navigator.sendBeacon && navigator.sendBeacon("/api/lead", blob));
      } catch {
        sent = false;
      }
      if (!sent) {
        // keepalive: survives the navigation on the next line. Not awaited.
        fetch("/api/lead", {
          method: "POST",
          body,
          keepalive: true,
          headers: { "Content-Type": "application/json" },
        }).catch(() => {});
      }

      /* The one fork in the funnel: everyone reaches the calendar EXCEPT the
         applicant who said they are not ready to invest.
         `name` + `email` are what /book-a-call reads to prefill Calendly, so
         nobody retypes what they just gave us. */
      window.location.href = disqualified
        ? DISQUALIFIED_PATH
        : `${site.bookUrl}?name=${encodeURIComponent(firstName)}&email=${encodeURIComponent(email)}`;
    },
    [country]
  );

  /* ---- Advance: validates the typed steps, submits on the last one ---- */
  const advance = useCallback(
    (next: Record<string, string>) => {
      if (current.kind === "text") {
        const msg = validateFirstName(next[current.id] || "");
        if (msg) return setError(msg);
      }
      if (current.kind === "email") {
        const msg = validateEmail(next[current.id] || "");
        if (msg) return setError(msg);
      }
      if (current.kind === "tel") {
        const msg = validatePhone(next[current.id] || "", country);
        if (msg) return setError(msg);
      }
      if (current.kind === "choice" && !next[current.id]) {
        return setError("Please pick one to continue.");
      }
      setError("");
      if (isLast) submit(next);
      else setStep((s) => s + 1);
    },
    [current, country, isLast, submit]
  );

  const back = () => {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  };

  /* A choice moves the form on by itself — except on the last step, where the
     answer is also the submit, so it waits for a deliberate press. */
  const pickChoice = (value: string) => {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    setError("");
    if (!isLast) window.setTimeout(() => advance(next), 180);
  };

  if (!open) return null;

  const pct = Math.round(((step + 1) / total) * 100);
  const typed =
    current.kind === "text" || current.kind === "email" || current.kind === "tel";
  const chosen = answers[current.id] || "";

  return (
    <div
      className="qz-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) close();
      }}
    >
      <div
        className="qz-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qz-question"
        ref={panelRef}
        tabIndex={-1}
      >
        <button
          type="button"
          className="qz-close"
          onClick={close}
          aria-label="Close"
          disabled={submitting}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="qz-head">
          <div className="qz-track" aria-hidden="true">
            <span className="qz-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="qz-meta">
            <span className="qz-count">
              Question {step + 1} <i>of</i> {total}
            </span>
            <span className="qz-free">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l8 3v7c0 4.97-3.35 9.26-8 10-4.65-.74-8-5.03-8-10V5l8-3z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              Free · No card needed
            </span>
          </div>
        </div>

        <div className="qz-body">
          <h2 className="qz-question" id="qz-question">
            {current.question}
          </h2>
          {current.hint && <p className="qz-hint">{current.hint}</p>}

          {(current.kind === "text" || current.kind === "email") && (
            <input
              ref={firstFieldRef}
              type={current.kind === "email" ? "email" : "text"}
              inputMode={current.kind === "email" ? "email" : undefined}
              /* Phone keyboards like to capitalise and autocorrect the first
                 word of an address; both are wrong for an email field. */
              autoCapitalize={current.kind === "email" ? "none" : undefined}
              autoCorrect={current.kind === "email" ? "off" : undefined}
              spellCheck={current.kind === "email" ? false : undefined}
              className={`qz-input${error ? " is-error" : ""}`}
              placeholder={current.placeholder}
              value={answers[current.id] || ""}
              autoComplete={current.kind === "email" ? "email" : "given-name"}
              aria-label={current.question}
              aria-invalid={Boolean(error)}
              onChange={(e) => {
                setAnswer(current.id, e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  advance({ ...answers, [current.id]: e.currentTarget.value });
                }
              }}
            />
          )}

          {current.kind === "tel" && (
            <div className={`qz-phone${error ? " is-error" : ""}`}>
              <label className="qz-dial">
                <span aria-hidden="true">{country.flag}</span>
                <span>{country.dial}</span>
                <select
                  aria-label="Country dialling code"
                  value={country.code}
                  onChange={(e) => {
                    const found = dialCodes.find((c) => c.code === e.target.value);
                    if (found) setCountry(found);
                    if (error) setError("");
                  }}
                >
                  {dialCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} {c.dial}
                    </option>
                  ))}
                </select>
                <svg className="qz-caret" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </label>
              <input
                ref={firstFieldRef}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                className="qz-input qz-input--phone"
                placeholder={current.placeholder}
                value={answers[current.id] || ""}
                aria-label={current.question}
                aria-invalid={Boolean(error)}
                onChange={(e) => {
                  setAnswer(current.id, e.target.value.replace(/\D/g, "").slice(0, 14));
                  if (error) setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    advance({ ...answers, [current.id]: e.currentTarget.value });
                  }
                }}
              />
            </div>
          )}

          {current.kind === "choice" && (
            <div className="qz-options" role="radiogroup" aria-labelledby="qz-question">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={chosen === opt}
                  className={`qz-option${chosen === opt ? " is-on" : ""}`}
                  onClick={() => pickChoice(opt)}
                  disabled={submitting}
                >
                  <span className="qz-tick" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <polyline points="5 12.5 10 17.5 19 7" />
                    </svg>
                  </span>
                  <span className="qz-option-label">{opt}</span>
                </button>
              ))}
            </div>
          )}

          {error && (
            <p className="qz-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="qz-foot">
          {step > 0 ? (
            <button type="button" className="qz-back" onClick={back} disabled={submitting}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
              Back
            </button>
          ) : (
            <span />
          )}

          {(typed || isLast) && (
            <button
              type="button"
              className="qz-next"
              onClick={() => advance(answers)}
              disabled={submitting || (isLast && !chosen)}
            >
              {/* Don't promise a call to someone whose selected answer routes
                  them away from the calendar. */}
              {submitting
                ? isDisqualified(answers)
                  ? "One moment…"
                  : "Taking you to the calendar…"
                : isLast
                  ? isDisqualified(answers)
                    ? "Submit my answers"
                    : "Book my call"
                  : "Continue"}
              {!submitting && (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              )}
            </button>
          )}
        </div>

        <p className="qz-legal">
          Your details are used to run the call and send reminders. Nothing is charged
          at any point in this process.
        </p>
      </div>
    </div>
  );
}
