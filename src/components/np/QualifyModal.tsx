"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  qualifySteps,
  dialCodes,
  QUALIFY_STORAGE_KEY,
  DISQUALIFIED_PATH,
  isDisqualified,
  parseMulti,
  toggleMulti,
  splitName,
  validateFullName,
  validateEmail,
  validatePhone,
  validateLongAnswer,
  validateMulti,
  type DialCode,
} from "@/lib/qualify";
import { site } from "@/lib/site";
import { trackGa4EventOnce } from "@/lib/ga4";
import { restoreUtm, restoreFbclid, fireRegistrationEvents } from "@/lib/tracking";

/**
 * THE CTA MODAL — the 1:1 coaching application, one question per screen.
 *
 * Mounted ONCE per page. It opens itself: every CTA on the site is a real
 * `<a href="/book-a-call" data-qualify-open>`, and this intercepts the click at
 * document level — the same delegation pattern ClientBehaviors uses, so the
 * CTAs stay server components with no client JS of their own.
 *
 * FAIL-OPEN, and that is why the CTAs are anchors rather than buttons: with JS
 * off the click is not intercepted and the link simply goes to /book-a-call.
 * The applicant loses the application, never the booking.
 *
 * `/api/lead` is best-effort and deliberately un-awaited (sendBeacon /
 * keepalive) — a slow or dead webhook must never sit between someone and the
 * calendar.
 *
 * The question set, the routing rule and every validator live in
 * src/lib/qualify.ts. This file only renders them.
 */
export function QualifyModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [country, setCountry] = useState<DialCode>(dialCodes[0]);
  const [error, setError] = useState("");
  /* Which field the error belongs to. The contact step shows three inputs at
     once, so a bare message would not say which one to fix. */
  const [errorField, setErrorField] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const fields = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});
  const lastFocused = useRef<HTMLElement | null>(null);

  /* Callback refs keyed by answer id: the same step can hold three inputs, and
     a RefObject of a union element type is assignable to none of them. */
  const fieldRef = useCallback(
    (id: string) => (el: HTMLInputElement | HTMLTextAreaElement | null) => {
      fields.current[id] = el;
    },
    []
  );

  const fail = (msg: string, field: string) => {
    setError(msg);
    setErrorField(field);
    window.setTimeout(() => fields.current[field]?.focus(), 0);
  };
  const clearError = () => {
    if (error) {
      setError("");
      setErrorField("");
    }
  };

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
      trackGa4EventOnce("qualify_start");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setError("");
    setErrorField("");
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

  /* ---- Focus the first field (or the panel) as each step lands. The body
          also scrolls back to the top: a long option list could otherwise
          leave it scrolled, hiding the new question. ---- */
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector(".qz-body")?.scrollTo({ top: 0 });
      const first = current.kind === "contact" ? fields.current.fullName : fields.current[current.id];
      if (first) first.focus();
      else panelRef.current?.focus();
    }, 60);
    return () => window.clearTimeout(t);
  }, [open, step, current]);

  const setAnswer = (id: string, value: string) => setAnswers((a) => ({ ...a, [id]: value }));

  /* ---- Submit: stash, count, fire-and-forget, hand off ---- */
  const submit = useCallback(
    (finalAnswers: Record<string, string>) => {
      setSubmitting(true);
      const name = splitName(finalAnswers.fullName || "");
      const email = (finalAnswers.email || "").trim().toLowerCase();
      const disqualified = isDisqualified(finalAnswers);

      const payload = {
        fullName: name.full,
        firstName: name.first,
        lastName: name.last,
        email,
        whatsapp: `${country.dial}${(finalAnswers.whatsapp || "").replace(/\D/g, "")}`,
        countryCode: country.code,
        dialCode: country.dial,

        /* The ten application answers, by step id. /api/lead maps these onto
           the q01_… Pabbly columns. */
        role: finalAnswers.role || "",
        roleOther: finalAnswers.roleOther || "",
        situation: finalAnswers.situation || "",
        goal90: finalAnswers.goal90 || "",
        tried: finalAnswers.tried || "",
        urgency: finalAnswers.urgency || "",
        urgencyOther: finalAnswers.urgencyOther || "",
        paidBefore: finalAnswers.paidBefore || "",
        investReady: finalAnswers.investReady || "",
        investLevel: finalAnswers.investLevel || "",
        income: finalAnswers.income || "",
        decisionMaker: finalAnswers.decisionMaker || "",

        /* The routing decision travels WITH the lead, so Pabbly never has to
           re-derive it by string-matching an answer. */
        qualified: !disqualified,
        utm: restoreUtm(),
        fbclid: restoreFbclid(),
        pageUrl: window.location.href,
      };

      // Kept for the next page — /book-a-call greets by name and
      // /thank-you-disqualified quotes the deciding answers back.
      try {
        window.sessionStorage.setItem(QUALIFY_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        /* private mode — the disqualified page degrades to its "not recorded"
           state, and the booking hand-off is unaffected */
      }

      /* ---- Conversion events ------------------------------------------
         GA4: complete_registration for everyone who finishes the form,
         qualified_lead only for the ones who pass all four gates.
         META CAPI: /api/meta/registration sends CompleteRegistration for
         everyone and QualifiedLead on top when `qualified` is true.

         Both names match what the downstream `free` branch fires — do not
         rename one without the other, or the funnel reports two different
         events for the same action. */
      trackGa4EventOnce("complete_registration");
      if (!disqualified) trackGa4EventOnce("qualified_lead");

      fireRegistrationEvents(
        { firstName: name.first, email, phone: payload.whatsapp, countryCode: country.code },
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

      /* The one fork: everyone reaches the calendar EXCEPT the applicant who
         trips one of the four gates. `name` + `email` prefill Calendly. */
      window.location.href = disqualified
        ? DISQUALIFIED_PATH
        : `${site.bookUrl}?name=${encodeURIComponent(name.first)}&email=${encodeURIComponent(email)}`;
    },
    [country]
  );

  /* ---- Advance: validate this step, then move on or submit ---- */
  const advance = useCallback(
    (next: Record<string, string>) => {
      const value = next[current.id] || "";

      switch (current.kind) {
        case "contact": {
          // Three fields on one screen: report the first problem and put the
          // cursor in the field it belongs to.
          const n = validateFullName(next.fullName || "");
          if (n) return fail(n, "fullName");
          const e = validateEmail(next.email || "");
          if (e) return fail(e, "email");
          const p = validatePhone(next.whatsapp || "", country);
          if (p) return fail(p, "whatsapp");
          break;
        }
        case "textarea": {
          const msg = validateLongAnswer(value);
          if (msg) return fail(msg, current.id);
          break;
        }
        case "multi": {
          const msg = validateMulti(value);
          if (msg) return fail(msg, current.id);
          break;
        }
        case "choice": {
          if (!value) return fail("Please pick one to continue.", current.id);
          // "Other" is only a real answer once the follow-up is filled in.
          if (current.other && value === current.other.option && !(next[current.other.id] || "").trim()) {
            return fail("Please add a little detail.", current.other.id);
          }
          break;
        }
      }

      setError("");
      setErrorField("");
      if (isLast) submit(next);
      else setStep((s) => s + 1);
    },
    [current, country, isLast, submit]
  );

  const back = () => {
    setError("");
    setErrorField("");
    setStep((s) => Math.max(0, s - 1));
  };

  /* A pick-one moves the form on by itself, except on the last step and when
     the choice is "Other" (there is still something to type). */
  const pickChoice = (value: string) => {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    clearError();
    const opensOther = current.kind === "choice" && current.other?.option === value;
    if (!isLast && !opensOther) window.setTimeout(() => advance(next), 180);
  };

  if (!open) return null;

  const pct = Math.round(((step + 1) / total) * 100);
  const value = answers[current.id] || "";
  const otherOpen = current.kind === "choice" && current.other?.option === value;
  /* Every kind except a plain pick-one needs an explicit Continue: they accept
     free text or several answers, so no single click means "done". */
  const needsContinue = current.kind !== "choice" || Boolean(otherOpen);
  const multiChosen = current.kind === "multi" ? parseMulti(value) : [];
  const err = (field: string) => (errorField === field ? " is-error" : "");

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
        <button type="button" className="qz-close" onClick={close} aria-label="Close" disabled={submitting}>
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
              Step {step + 1} <i>of</i> {total}
            </span>
            <span className="qz-free">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l8 3v7c0 4.97-3.35 9.26-8 10-4.65-.74-8-5.03-8-10V5l8-3z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              Confidential · Reviewed manually
            </span>
          </div>
        </div>

        <div className="qz-body">
          <p className="qz-section">{current.section}</p>

          {current.callout && (
            <div className="qz-callout">
              <p className="qz-callout-title">{current.callout.title}</p>
              {current.callout.body.map((line, i) => (
                <p className="qz-callout-body" key={i}>
                  {line}
                </p>
              ))}
            </div>
          )}

          <h2 className="qz-question" id="qz-question">
            {current.question}
          </h2>
          {current.hint && <p className="qz-hint">{current.hint}</p>}

          {/* ---- contact: three fields, one screen, always last ---- */}
          {current.kind === "contact" && (
            <div className="qz-contact">
              <div className="qz-field">
                <label className="qz-label" htmlFor="qz-fullname">
                  Full Name
                </label>
                <input
                  id="qz-fullname"
                  ref={fieldRef("fullName")}
                  type="text"
                  className={`qz-input${err("fullName")}`}
                  placeholder="First and last name"
                  value={answers.fullName || ""}
                  autoComplete="name"
                  aria-invalid={errorField === "fullName"}
                  onChange={(e) => {
                    setAnswer("fullName", e.target.value);
                    clearError();
                  }}
                />
              </div>

              <div className="qz-field">
                <label className="qz-label" htmlFor="qz-email">
                  Email Address
                </label>
                <input
                  id="qz-email"
                  ref={fieldRef("email")}
                  type="email"
                  inputMode="email"
                  /* Phone keyboards capitalise and autocorrect the first word
                     of an address; both are wrong here. */
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className={`qz-input${err("email")}`}
                  placeholder="you@company.com"
                  value={answers.email || ""}
                  autoComplete="email"
                  aria-invalid={errorField === "email"}
                  onChange={(e) => {
                    setAnswer("email", e.target.value);
                    clearError();
                  }}
                />
                <p className="qz-field-hint">Your calendar invite and call link are sent here.</p>
              </div>

              <div className="qz-field">
                <label className="qz-label" htmlFor="qz-whatsapp">
                  WhatsApp Number
                </label>
                <div className={`qz-phone${err("whatsapp")}`}>
                  <label className="qz-dial">
                    <span aria-hidden="true">{country.flag}</span>
                    <span>{country.dial}</span>
                    <select
                      aria-label="Country dialling code"
                      value={country.code}
                      onChange={(e) => {
                        const found = dialCodes.find((c) => c.code === e.target.value);
                        if (found) setCountry(found);
                        clearError();
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
                    id="qz-whatsapp"
                    ref={fieldRef("whatsapp")}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    className="qz-input qz-input--phone"
                    placeholder="98765 43210"
                    value={answers.whatsapp || ""}
                    aria-invalid={errorField === "whatsapp"}
                    onChange={(e) => {
                      setAnswer("whatsapp", e.target.value.replace(/\D/g, "").slice(0, 14));
                      clearError();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        advance({ ...answers, whatsapp: e.currentTarget.value });
                      }
                    }}
                  />
                </div>
                <p className="qz-field-hint">We send call details, prep and reminders here.</p>
              </div>
            </div>
          )}

          {current.kind === "textarea" && (
            <textarea
              ref={fieldRef(current.id)}
              className={`qz-textarea${err(current.id)}`}
              placeholder={current.placeholder}
              value={value}
              rows={5}
              maxLength={2000}
              aria-label={current.question}
              aria-invalid={errorField === current.id}
              onChange={(e) => {
                setAnswer(current.id, e.target.value);
                clearError();
              }}
              onKeyDown={(e) => {
                /* Enter inserts a newline here. Ctrl/Cmd+Enter is "done". */
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  advance({ ...answers, [current.id]: e.currentTarget.value });
                }
              }}
            />
          )}

          {current.kind === "multi" && (
            <div className="qz-options" role="group" aria-labelledby="qz-question">
              {current.options.map((opt) => {
                const on = multiChosen.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    className={`qz-option${on ? " is-on" : ""}`}
                    onClick={() => {
                      setAnswer(current.id, toggleMulti(value, opt, current.options));
                      clearError();
                    }}
                    disabled={submitting}
                  >
                    <span className="qz-tick qz-tick--box" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <polyline points="5 12.5 10 17.5 19 7" />
                      </svg>
                    </span>
                    <span className="qz-option-label">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {current.kind === "choice" && (
            <>
              <div className="qz-options" role="radiogroup" aria-labelledby="qz-question">
                {current.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={value === opt}
                    className={`qz-option${value === opt ? " is-on" : ""}`}
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

              {/* Picking "Other" reveals the follow-up and suppresses
                  auto-advance, so there is time to type it. */}
              {otherOpen && current.other && (
                <div className="qz-other">
                  <label className="qz-other-label" htmlFor="qz-other-input">
                    {current.other.label}
                  </label>
                  <input
                    id="qz-other-input"
                    ref={fieldRef(current.other.id)}
                    type="text"
                    className={`qz-input${err(current.other.id)}`}
                    placeholder={current.other.placeholder}
                    value={answers[current.other.id] || ""}
                    aria-invalid={errorField === current.other.id}
                    onChange={(e) => {
                      setAnswer(current.other!.id, e.target.value);
                      clearError();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        advance({ ...answers, [current.other!.id]: e.currentTarget.value });
                      }
                    }}
                  />
                </div>
              )}
            </>
          )}

          {current.note && <p className="qz-note">{current.note}</p>}

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

          {(needsContinue || isLast) && (
            <button
              type="button"
              className="qz-next"
              onClick={() => advance(answers)}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : isLast ? "Submit My Application" : "Continue"}
              {!submitting && (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              )}
            </button>
          )}
        </div>

        <p className="qz-legal">
          Reviewed within 24 hrs · No spam, ever · Answers kept confidential
        </p>
      </div>
    </div>
  );
}
