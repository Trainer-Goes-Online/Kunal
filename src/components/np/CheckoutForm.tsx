"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { Arrow } from "@/components/icons";
import { OrderSummaryBar } from "./OrderSummaryBar";
import { trackGa4EventOnce } from "@/lib/ga4";
import { fireInitiateCheckoutOnce, restoreUtm, restoreFbclid } from "@/lib/tracking";

type Fields = { firstName: string; lastName: string; email: string; phone: string; city: string };
const DIAL = "+91";
const COUNTRY = "IN";

type RzpCtor = new (opts: Record<string, unknown>) => { open: () => void };

export function CheckoutForm() {
  const [f, setF] = useState<Fields>({ firstName: "", lastName: "", email: "", phone: "", city: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!f.firstName.trim()) e.firstName = "Required";
    if (!f.lastName.trim()) e.lastName = "Required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) e.email = "Enter a valid email";
    if (f.phone.replace(/\D/g, "").length < 8) e.phone = "Enter a valid phone";
    if (!f.city.trim()) e.city = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function openRazorpay(data: { orderId: string; amount: number; currency: string; keyId?: string }) {
    const Rzp = (window as unknown as { Razorpay?: RzpCtor }).Razorpay;
    if (!Rzp || !data.keyId) {
      setErrors({ form: "Payment couldn't start. Please try again in a moment." });
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
        name: `${f.firstName} ${f.lastName}`.trim(),
        email: f.email.trim(),
        contact: `${DIAL}${f.phone.replace(/\D/g, "")}`,
      },
      notes: {},
      theme: { color: "#C9A24B" },
      handler: () => {
        // Tracking is handled server-side by the Razorpay webhook — just advance.
        window.location.href = site.thankYouUrl;
      },
      modal: { ondismiss: () => setLoading(false) },
    });
    rzp.open();
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    // GA4 initiate_checkout fires on the FIRST pay attempt, BEFORE validation.
    trackGa4EventOnce("initiate_checkout");
    if (!validate()) return;
    setLoading(true);

    const customer = {
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      email: f.email.trim(),
      phone: f.phone.replace(/\D/g, ""),
      city: f.city.trim(),
      countryCode: COUNTRY,
      dialCode: DIAL,
      customerType: "",
    };

    // Meta InitiateCheckout (after validation, once per browser) — non-blocking.
    await fireInitiateCheckoutOnce(customer);

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, utm: restoreUtm(), fbclid: restoreFbclid() }),
      });
      const data = await res.json();
      if (!res.ok || !data.orderId) throw new Error(data.error || "order_failed");
      openRazorpay(data);
    } catch {
      setErrors({ form: "Something went wrong starting your payment. Please try again." });
      setLoading(false);
    }
  }

  return (
    <form className="co-stack" onSubmit={handleSubmit} noValidate>
      {/* Order summary — minimised, above the form (expandable) */}
      <OrderSummaryBar />

      {/* Your details */}
      <div className="co-card">
        <div className="co-step">
          <span className="badge">1</span>
          <div>
            <h3>Your details</h3>
            <p>So Kunal can reach you and read your situation before you speak. Under a minute.</p>
          </div>
        </div>
        <div className="frow">
          <Field label="First name" placeholder="Rahul" value={f.firstName} onChange={set("firstName")} err={errors.firstName} required />
          <Field label="Last name" placeholder="Mehta" value={f.lastName} onChange={set("lastName")} err={errors.lastName} required />
        </div>
        <Field label="Email address" placeholder="rahul@company.com" type="email" hint="Call link comes here" value={f.email} onChange={set("email")} err={errors.email} required full />
        <label className="field">
          <span className="lab">
            <span>Phone number<span className="req"> *</span></span>
            <span className="hint">For your reminder</span>
          </span>
          <div className="selectrow">
            <span className="cc">🇮🇳 +91</span>
            <input type="tel" placeholder="98765 43210" value={f.phone} onChange={set("phone")} />
          </div>
          {errors.phone && <span className="field-err">{errors.phone}</span>}
        </label>
        <Field label="City" placeholder="Mumbai" hint="So Kunal reads your week in context" value={f.city} onChange={set("city")} err={errors.city} required full />

        <button type="submit" className="cta-big pay-btn" disabled={loading}>
          {loading ? "Starting…" : `Pay ${site.assessmentFee} & unlock the calendar`}
          <Arrow size={18} />
        </button>
        {errors.form && <p className="pay-micro" style={{ color: "#e0a86b" }}>{errors.form}</p>}
        <p className="pay-micro">
          Not a sales call. Kunal gives you a straight, man-to-man read — and if it isn&rsquo;t a fit,
          he&rsquo;ll say so.
        </p>
      </div>
    </form>
  );
}

function Field({
  label, placeholder, hint, type = "text", required, full, value, onChange, err,
}: {
  label: string;
  placeholder: string;
  hint?: string;
  type?: string;
  required?: boolean;
  full?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  err?: string;
}) {
  return (
    <label className="field" style={full ? { gridColumn: "1 / -1" } : undefined}>
      <span className="lab">
        <span>{label}{required && <span className="req"> *</span>}</span>
        {hint && <span className="hint">{hint}</span>}
      </span>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} aria-invalid={Boolean(err)} />
      {err && <span className="field-err">{err}</span>}
    </label>
  );
}
