"use client";

/**
 * P01 — Checkout form, rebuilt to the SDP checkout structure on the existing
 * `.sdp-root` brass foundation, WITH the already-working Kraft backend intact.
 *
 * SDP reference (structure reproduced 1:1, only copy + hue differ):
 *   _reference/sdp/components/checkout/CheckoutForm.tsx:28-135   CountryDropdown
 *   _reference/sdp/components/checkout/CheckoutForm.tsx:147-184  MobileSummary (collapsible bar)
 *   _reference/sdp/components/checkout/CheckoutForm.tsx:200-277  OrderSummary (desktop aside)
 *   _reference/sdp/components/checkout/CheckoutForm.tsx:553-735  toast → mobile summary →
 *                                                               two-panel .checkout-main
 *   _reference/sdp/app/new-checkout-page/checkout.css:54-673     ported to `.p01-*`
 *
 * PRESERVED backend (unchanged logic, only re-skinned markup around it):
 *   · GA4 `initiate_checkout` fires on the FIRST Pay click, BEFORE validation
 *   · Meta InitiateCheckout / CAPI via fireInitiateCheckoutOnce(customer) after validation
 *   · POST /api/razorpay/create-order with { customer, utm, fbclid }
 *   · Razorpay modal, brass theme #C9A24B, ondismiss → un-spin
 *   · Purchase tracking stays server-side in the Razorpay webhook — the client just advances
 *
 * DELIBERATE HONESTY DEVIATIONS from SDP (see manifest):
 *   · No "was ₹999 / SAVE ₹902" strike-through + save badge and no coupon field. The
 *     assessment fee (`site.assessmentFee`, env-driven — ₹97 per the funnel md) is not
 *     discounted and the repo has no coupon lib — inventing a discount would be a
 *     fabricated claim. The fee is the single hard number on this page.
 *   · SDP's "100% Refundable · Zero Risk" guarantee line is replaced by Kraft's real fee
 *     terms (the /refund policy, quoted verbatim), and its "8 yrs · 550+ clients ·
 *     14 countries" credential row by the landing page's confirmed figures.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { trackGa4EventOnce } from "@/lib/ga4";
import {
  captureLandingParams,
  fireInitiateCheckoutOnce,
  restoreUtm,
  restoreFbclid,
} from "@/lib/tracking";

/* ============================================================
   Countries — dial codes for the phone dropdown. India first,
   then every NRI corridor Kraft actually sells into + majors.
   Local to this file (no shared lib touched).
   ============================================================ */

type Country = { code: string; name: string; dial: string; flag: string };

const COUNTRIES: Country[] = [
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", dial: "+965", flag: "🇰🇼" },
  { code: "OM", name: "Oman", dial: "+968", flag: "🇴🇲" },
  { code: "BH", name: "Bahrain", dial: "+973", flag: "🇧🇭" },
  { code: "HK", name: "Hong Kong", dial: "+852", flag: "🇭🇰" },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
  { code: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
  { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Norway", dial: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰" },
  { code: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪" },
  { code: "AT", name: "Austria", dial: "+43", flag: "🇦🇹" },
  { code: "PL", name: "Poland", dial: "+48", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷" },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { code: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭" },
  { code: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩" },
  { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { code: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳" },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { code: "TZ", name: "Tanzania", dial: "+255", flag: "🇹🇿" },
  { code: "MU", name: "Mauritius", dial: "+230", flag: "🇲🇺" },
  { code: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰" },
  { code: "NP", name: "Nepal", dial: "+977", flag: "🇳🇵" },
  { code: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { code: "TR", name: "Türkiye", dial: "+90", flag: "🇹🇷" },
  { code: "IL", name: "Israel", dial: "+972", flag: "🇮🇱" },
  { code: "RU", name: "Russia", dial: "+7", flag: "🇷🇺" },
  { code: "FI", name: "Finland", dial: "+358", flag: "🇫🇮" },
  { code: "CZ", name: "Czechia", dial: "+420", flag: "🇨🇿" },
  { code: "GR", name: "Greece", dial: "+30", flag: "🇬🇷" },
  { code: "LU", name: "Luxembourg", dial: "+352", flag: "🇱🇺" },
];

/* ── What the assessment fee actually holds. Honest, repo-sourced (funnel-copy/03-checkout.md) —
      not SDP's value stack. ── */
const INCLUSIONS = [
  "A 1:1 assessment call with Kunal himself, not a rep",
  "Your health markers and your real week read before you speak",
  "A straight, man-to-man verdict: a fit, or not",
  "Your priority slot held the moment your fee is in",
];

/* ============================================================
   Types + form state
   ============================================================ */

type Fields = { firstName: string; lastName: string; email: string; city: string; phone: string };
type FieldKey = keyof Fields;

const FIELD_KEYS: FieldKey[] = ["firstName", "lastName", "email", "city", "phone"];

type RzpInstance = { open: () => void; on: (ev: string, cb: (r: unknown) => void) => void };
type RzpCtor = new (opts: Record<string, unknown>) => RzpInstance;

function validateFields(f: Fields): Partial<Record<FieldKey, string>> {
  const e: Partial<Record<FieldKey, string>> = {};
  if (!f.firstName.trim()) e.firstName = "Required";
  if (!f.lastName.trim()) e.lastName = "Required";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) e.email = "Enter a valid email";
  if (!f.city.trim()) e.city = "Required";
  if (f.phone.replace(/\D/g, "").length < 8) e.phone = "Enter a valid phone";
  return e;
}

/* ============================================================
   Sub-component: country-code dropdown + digits-only phone input
   SDP ref: CheckoutForm.tsx:28-135
   ============================================================ */

function CountryDropdown({
  value,
  countryCode,
  onValueChange,
  onCountryChange,
  error,
  touched,
  onBlur,
}: {
  value: string;
  countryCode: string;
  onValueChange: (v: string) => void;
  onCountryChange: (code: string) => void;
  error?: string;
  touched: boolean;
  onBlur: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];

  const filtered = search.trim()
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRIES;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const hasError = touched && !!error;
  const isValid = touched && !error && value.trim().length > 0;

  return (
    <div
      ref={wrapRef}
      className={`p01-phone-wrap${hasError ? " is-error" : ""}${isValid ? " is-valid" : ""}`}
    >
      <button
        type="button"
        className="p01-country-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Select country code"
        aria-expanded={open}
      >
        <span className="p01-country-flag">{selected.flag}</span>
        <span className="p01-country-code">{selected.dial}</span>
        <span className={`p01-country-chevron${open ? " open" : ""}`} aria-hidden>
          ▾
        </span>
      </button>

      <input
        ref={inputRef}
        id="phone"
        type="tel"
        className="p01-phone-input"
        placeholder={countryCode === "IN" ? "98765 43210" : "Phone number"}
        value={value}
        onChange={(e) => onValueChange(e.target.value.replace(/\D/g, ""))}
        onBlur={onBlur}
        inputMode="numeric"
        autoComplete="tel-national"
        aria-label="Phone number"
        aria-invalid={hasError}
      />

      {open && (
        <div className="p01-country-dropdown">
          <div className="p01-country-search">
            <input
              type="text"
              placeholder="Search country…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              aria-label="Search country"
            />
          </div>
          <div className="p01-country-list" role="listbox">
            {filtered.map((c) => (
              <div
                key={c.code}
                role="option"
                aria-selected={c.code === countryCode}
                className={`p01-country-option${c.code === countryCode ? " selected" : ""}`}
                onClick={() => {
                  onCountryChange(c.code);
                  setOpen(false);
                  setSearch("");
                  inputRef.current?.focus();
                }}
              >
                <span className="p01-country-option-flag">{c.flag}</span>
                <span className="p01-country-option-name">{c.name}</span>
                <span className="p01-country-option-code">{c.dial}</span>
              </div>
            ))}
            {filtered.length === 0 && <div className="p01-country-empty">No results</div>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Shared summary internals (product → pill → inclusions → total)
   ============================================================ */

function SummaryBody() {
  return (
    <>
      <div className="p01-event-pill">1:1 Assessment · With Kunal</div>

      <div className="p01-divider" />

      <div className="p01-value-stack">
        {INCLUSIONS.map((item) => (
          <div key={item} className="p01-value-item">
            <span className="p01-check" aria-hidden>
              ✓
            </span>
            {item}
          </div>
        ))}
      </div>

      <div className="p01-divider" />

      <div className="p01-price-block">
        <div className="p01-price-row">
          <span className="p01-price-label">Total due today</span>
          <span className="p01-price-now">{site.assessmentFee}</span>
        </div>
        {/* <p className="p01-price-note">
          The assessment fee only, never the programme. Programme cost is a conversation you
          have with Kunal directly.
        </p> */}
        {/* Fee terms are confirmed and already stated on /refund; quoting them
            here rather than a placeholder, from the same source of truth. */}
        {/* <p className="p01-guarantee">
          <span aria-hidden>✦</span> Fee terms: if Kunal decides on the call that the
          programme isn&rsquo;t the right fit, your {site.assessmentFee} is{" "}
          <strong>refunded in full</strong>. If you enrol, it&rsquo;s{" "}
          <strong>credited toward your programme</strong>.
        </p> */}
      </div>
    </>
  );
}

/* ============================================================
   Sub-component: collapsible mobile summary bar
   SDP ref: CheckoutForm.tsx:147-184
   ============================================================ */

function MobileSummary() {
  // Open by default so the buyer sees exactly what the fee holds on arrival;
  // the bar still toggles closed to reclaim the screen.
  const [open, setOpen] = useState(true);

  return (
    <div className="p01-summary-mobile">
      <button
        type="button"
        className="p01-summary-mobile-bar"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="p01-mobile-summary-panel"
      >
        <span className="p01-summary-mobile-title">Assessment with Kunal</span>
        <span className="p01-summary-mobile-trail">
          <span className="p01-summary-mobile-price">{site.assessmentFee}</span>
          <span className={`p01-summary-mobile-chevron${open ? " open" : ""}`} aria-hidden>
            ▾
          </span>
        </span>
      </button>
      <div
        id="p01-mobile-summary-panel"
        className={`p01-summary-expand${open ? " open" : ""}`}
      >
        <div className="p01-summary-expand-inner">
          <SummaryBody />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Sub-component: desktop order-summary aside
   SDP ref: CheckoutForm.tsx:200-277 (coupon block deliberately omitted)
   ============================================================ */

function OrderSummary() {
  return (
    <aside className="p01-summary" aria-label="Order summary">
      <p className="p01-summary-label">Order summary</p>
      <h2 className="p01-product-name">Assessment with Kunal</h2>

      <SummaryBody />

      <div className="p01-methods">
        <div className="p01-methods-cap">Pay by</div>
        <div className="p01-methods-row">
          {["UPI", "Cards", "Net banking", "Wallets"].map((m) => (
            <span className="p01-method-tile" key={m}>
              {m}
            </span>
          ))}
        </div>
        <p className="p01-methods-note">Processed by Razorpay · 256-bit SSL · PCI-DSS</p>
      </div>

      <div className="p01-coach">
        <span className="p01-coach-avatar" aria-hidden>
          KC
        </span>
        <span className="p01-coach-names">
          <strong>Kunal Chalke</strong>
          ACSM certified · HYROX head judge
          {/* the landing page's confirmed track record, not a placeholder */}
          <span className="p01-coach-gap">
            {site.successStories}{" "}
            high-performers coached · {site.clientRating} ★ rating
          </span>
        </span>
      </div>
    </aside>
  );
}

/* ============================================================
   Page entry
   ============================================================ */

export function CheckoutForm() {
  const [fields, setFields] = useState<Fields>({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    city: false,
    phone: false,
  });
  const [countryCode, setCountryCode] = useState("IN");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  const dismissToast = () => {
    setToast(null);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  };

  // First-touch UTM/fbclid capture (no-op if the landing already stamped it) +
  // surface a bounced-back payment error, then clean the URL. SDP ref: 315-325.
  useEffect(() => {
    captureLandingParams();
    const paymentError = new URLSearchParams(window.location.search).get("payment_error");
    if (!paymentError) return;
    window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    // Deferred one tick: surfacing the toast is a post-render side effect, not
    // render-time state (and it keeps the effect free of a synchronous setState).
    const t = setTimeout(() => showToast(paymentError), 0);
    return () => clearTimeout(t);
  }, [showToast]);

  function handleChange(field: FieldKey, value: string) {
    const updated = { ...fields, [field]: value };
    setFields(updated);
    if (touched[field]) {
      const next = validateFields(updated);
      setErrors((e) => ({ ...e, [field]: next[field] }));
    }
  }

  function handleBlur(field: FieldKey) {
    setTouched((t) => ({ ...t, [field]: true }));
    const next = validateFields(fields);
    setErrors((e) => ({ ...e, [field]: next[field] }));
  }

  function fieldState(key: FieldKey) {
    const hasError = touched[key] && !!errors[key];
    const isValid = touched[key] && !errors[key] && fields[key].trim().length > 0;
    return {
      hasError,
      inputClass: `p01-input${hasError ? " is-error" : ""}${isValid ? " is-valid" : ""}`,
    };
  }

  /* ── PRESERVED: Razorpay handoff. Purchase tracking is server-side (webhook);
        the client's only job on success is to advance the funnel. ── */
  function openRazorpay(
    data: { orderId: string; amount: number; currency: string; keyId?: string },
    dialCode: string
  ) {
    const Rzp = (window as unknown as { Razorpay?: RzpCtor }).Razorpay;
    if (!Rzp || !data.keyId) {
      showToast("Payment couldn't start. Please try again in a moment.");
      setLoading(false);
      return;
    }
    const rzp = new Rzp({
      key: data.keyId,
      order_id: data.orderId,
      amount: data.amount,
      currency: data.currency,
      name: site.brand,
      description: "Assessment with Kunal",
      prefill: {
        name: `${fields.firstName} ${fields.lastName}`.trim(),
        email: fields.email.trim(),
        contact: `${dialCode}${fields.phone.replace(/\D/g, "")}`,
      },
      notes: {},
      theme: { color: "#C9A24B" },
      handler: (res: unknown) => {
        const r = (res ?? {}) as { razorpay_order_id?: string; razorpay_payment_id?: string };
        const q = new URLSearchParams({
          name: fields.firstName.trim(),
          email: fields.email.trim(),
          phone: `${dialCode}${fields.phone.replace(/\D/g, "")}`,
        });
        if (r.razorpay_order_id) q.set("order_id", r.razorpay_order_id);
        if (r.razorpay_payment_id) q.set("payment_id", r.razorpay_payment_id);
        window.location.href = `${site.bookUrl}?${q.toString()}`;
      },
      modal: { ondismiss: () => setLoading(false) },
    });
    rzp.on("payment.failed", (failure: unknown) => {
      const f = (failure ?? {}) as { error?: { description?: string } };
      setLoading(false);
      showToast(f.error?.description ?? "Payment failed. Please try again.");
    });
    rzp.open();
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();

    // PRESERVED: GA4 initiate_checkout fires on the FIRST pay attempt, BEFORE validation.
    trackGa4EventOnce("initiate_checkout");

    setTouched({ firstName: true, lastName: true, email: true, city: true, phone: true });
    const allErrors = validateFields(fields);
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      const first = FIELD_KEYS.find((k) => allErrors[k]);
      if (first) {
        document
          .getElementById(`p01-field-${first}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);

    const selected = COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];
    const customer = {
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      email: fields.email.trim(),
      phone: fields.phone.replace(/\D/g, ""),
      city: fields.city.trim(),
      countryCode: selected.code,
      dialCode: selected.dial,
      customerType: "",
    };

    // PRESERVED: Meta InitiateCheckout (after validation, once per browser) — awaited so
    // the mandated order (IC → create-order) holds. Non-blocking on failure.
    await fireInitiateCheckoutOnce(customer);

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, utm: restoreUtm(), fbclid: restoreFbclid() }),
      });
      const data = await res.json();
      if (!res.ok || !data.orderId) throw new Error(data.error || "order_failed");
      openRazorpay(data, selected.dial);
    } catch {
      showToast("Something went wrong starting your payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <div className={`p01-toast${toast ? " visible" : ""}`} role="alert" aria-live="assertive">
        {toast}
        <button
          type="button"
          className="p01-toast-close"
          onClick={dismissToast}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      <MobileSummary />

      <div className="p01-main">
        {/* No `data-sdp-reveal` here — SDP's checkout has no reveal animation, and a
            reveal would hide the payment form outright if JS never runs. */}
        <div className="p01-form-panel">
          <div className="p01-form-heading">
            <div className="p01-section-label">Secure checkout</div>
            <h1 className="p01-form-title">Your Details</h1>
            {/* <p className="p01-form-note">
              So Kunal can reach you and read your situation before you speak. Under a minute.
            </p> */}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="p01-fields">
              <div className="p01-fields-row">
                <div className="p01-field" id="p01-field-firstName">
                  <label className="p01-label" htmlFor="firstName">
                    First name <span>*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={fieldState("firstName").inputClass}
                    placeholder="Rahul"
                    value={fields.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    onBlur={() => handleBlur("firstName")}
                    autoComplete="given-name"
                    aria-invalid={fieldState("firstName").hasError}
                  />
                  <span
                    className={`p01-error-msg${fieldState("firstName").hasError ? " visible" : ""}`}
                    role="alert"
                  >
                    {errors.firstName}
                  </span>
                </div>

                <div className="p01-field" id="p01-field-lastName">
                  <label className="p01-label" htmlFor="lastName">
                    Last name <span>*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={fieldState("lastName").inputClass}
                    placeholder="Mehta"
                    value={fields.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    onBlur={() => handleBlur("lastName")}
                    autoComplete="family-name"
                    aria-invalid={fieldState("lastName").hasError}
                  />
                  <span
                    className={`p01-error-msg${fieldState("lastName").hasError ? " visible" : ""}`}
                    role="alert"
                  >
                    {errors.lastName}
                  </span>
                </div>
              </div>

              <div className="p01-field" id="p01-field-email">
                <label className="p01-label" htmlFor="email">
                  Email address <span>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className={fieldState("email").inputClass}
                  placeholder="rahul@company.com"
                  value={fields.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={fieldState("email").hasError}
                />
                <span
                  className={`p01-error-msg${fieldState("email").hasError ? " visible" : ""}`}
                  role="alert"
                >
                  {errors.email}
                </span>
                <span className="p01-field-hint">Your call link comes here.</span>
              </div>

              <div className="p01-field" id="p01-field-city">
                <label className="p01-label" htmlFor="city">
                  City <span>*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  className={fieldState("city").inputClass}
                  placeholder="Mumbai"
                  value={fields.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  onBlur={() => handleBlur("city")}
                  autoComplete="address-level2"
                  aria-invalid={fieldState("city").hasError}
                />
                <span
                  className={`p01-error-msg${fieldState("city").hasError ? " visible" : ""}`}
                  role="alert"
                >
                  {errors.city}
                </span>
                <span className="p01-field-hint">So Kunal reads your week in context.</span>
              </div>

              <div className="p01-field" id="p01-field-phone">
                <label className="p01-label" htmlFor="phone">
                  Phone number <span>*</span>
                </label>
                <CountryDropdown
                  value={fields.phone}
                  countryCode={countryCode}
                  onValueChange={(v) => handleChange("phone", v)}
                  onCountryChange={(code) => {
                    setCountryCode(code);
                    if (touched.phone) {
                      const next = validateFields(fields);
                      setErrors((e) => ({ ...e, phone: next.phone }));
                    }
                  }}
                  error={errors.phone}
                  touched={touched.phone}
                  onBlur={() => handleBlur("phone")}
                />
                <span
                  className={`p01-error-msg${touched.phone && !!errors.phone ? " visible" : ""}`}
                  role="alert"
                >
                  {errors.phone}
                </span>
                <span className="p01-field-hint">For your call reminder.</span>
              </div>
            </div>

            <div className="p01-submit-wrap">
              <button type="submit" className="p01-cta" disabled={loading} aria-busy={loading}>
                {loading ? (
                  <>
                    <span className="p01-btn-spinner" aria-hidden />
                    Processing…
                  </>
                ) : (
                  <>
                    {`Pay ${site.assessmentFee} & Book My Call`}
                    <span className="p01-cta-arrow" aria-hidden>
                      →
                    </span>
                  </>
                )}
              </button>

              <div className="p01-trust">
                <span>🔒 256-bit SSL</span>
                <span className="p01-trust-sep" aria-hidden>
                  ·
                </span>
                <span>PCI-DSS via Razorpay</span>
                <span className="p01-trust-sep" aria-hidden>
                  ·
                </span>
                <span>Assessment fee only</span>
              </div>

              <p className="p01-submit-note">
                Not a sales call. Kunal gives you a straight, man-to-man read, and if it
                isn&rsquo;t a fit, he&rsquo;ll say so.
              </p>
            </div>
          </form>
        </div>

        <OrderSummary />
      </div>
    </>
  );
}
