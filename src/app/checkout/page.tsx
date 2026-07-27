/**
 * P01 — /checkout. Server route shell, rebuilt to SDP's checkout page structure on
 * the existing `.sdp-root` brass foundation.
 *
 * SDP reference: `_reference/sdp/app/new-checkout-page/page.tsx:10-43` —
 * trust announce bar (3 items + dots, shield/lock/verified glyphs) → <main> stage →
 * <CheckoutForm/>. Reproduced 1:1; only the copy (Kraft) and hue (brass) differ, plus
 * SDP's "100% Refundable" claim is replaced with an honest, confirmed one (Kraft's
 * ₹299 refund/credit terms are unconfirmed — §6 Q5, flagged inside the summary).
 *
 * Razorpay checkout.js is loaded here (afterInteractive) exactly as before; all
 * payment/tracking logic stays in the existing client component.
 */
import type { Metadata } from "next";
import Script from "next/script";
import { CheckoutForm } from "@/components/np/CheckoutForm";
import { ClientBehaviors } from "@/components/ClientBehaviors";
import "@/components/sections/P01Checkout.css";

export const metadata: Metadata = {
  title: "Secure your assessment — Kraft With Kunal",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="sdp-root">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      {/* SDP `_reference/sdp/app/new-checkout-page/page.tsx:13-37` */}
      <div className="p01-announce" role="region" aria-label="Checkout trust">
        <span className="p01-announce-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secure Checkout
        </span>
        <span className="p01-announce-dot" aria-hidden="true" />
        <span className="p01-announce-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2l8 3v7c0 4.97-3.35 9.26-8 10-4.65-.74-8-5.03-8-10V5l8-3z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
          Assessment Fee Only
        </span>
        <span className="p01-announce-dot" aria-hidden="true" />
        <span className="p01-announce-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          Razorpay Verified · 256-bit SSL
        </span>
      </div>

      <main className="p01-page">
        <CheckoutForm />

        {/* Legal — once, at the very bottom */}
        <p className="p01-legal">
          By completing this booking you agree to our Terms, Privacy Policy &amp; Refund Policy. We
          never share your details. Your call slot is confirmed only after payment.
        </p>
      </main>

      <ClientBehaviors />
    </div>
  );
}
