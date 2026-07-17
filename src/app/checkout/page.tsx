import type { Metadata } from "next";
import Script from "next/script";
import { Reveal } from "@/components/Reveal";
import { EyebrowPill, Lit } from "@/components/ui";
import { CheckoutForm } from "@/components/np/CheckoutForm";

export const metadata: Metadata = {
  title: "Secure your assessment — Kraft With Kunal",
  robots: { index: false, follow: false },
};

function LockGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ marginRight: 6, verticalAlign: "-1px" }}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}

export default function CheckoutPage() {
  return (
    <main>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="topstrip">
        <div className="topstrip-inner">
          <span><span className="tick">✓</span> Secure checkout</span>
          <span className="sep">·</span>
          <span className="hide-sm">256-bit SSL</span>
          <span className="sep hide-sm">·</span>
          <span>You pay only the assessment fee here — never the program</span>
        </div>
      </div>

      <section className="section stage">
        <div className="wrap" style={{ textAlign: "center", maxWidth: 820 }}>
          <Reveal><EyebrowPill>You&rsquo;re one step away</EyebrowPill></Reveal>
          <Reveal delay={1}>
            <h1 className="display co-h1" style={{ fontSize: "clamp(28px,3.8vw,44px)", margin: "22px auto 0" }}>
              Secure your assessment with <Lit>Kunal</Lit>.
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p style={{ maxWidth: "52ch", margin: "18px auto 0", color: "var(--ink-2)", fontSize: "clamp(15px,1.6vw,17px)", lineHeight: 1.6 }}>
              Completing this holds your place and sends your details to Kunal ahead of the call.
              The moment your fee is in, the calendar opens and you pick your time.
            </p>
          </Reveal>
          <Reveal delay={2}>
            <div className="co-trust">
              <span><LockGlyph /> Secure payment</span>
              <span className="sep">·</span>
              <span>256-bit encrypted</span>
              <span className="sep">·</span>
              <span>Not a sales call</span>
            </div>
          </Reveal>
        </div>

        <div className="wrap co-wrap" style={{ marginTop: "clamp(28px,3.5vw,40px)" }}>
          <CheckoutForm />

          {/* Legal — once, at the very bottom */}
          <p style={{ maxWidth: "min(680px, 100%)", margin: "40px auto 0", textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 11, lineHeight: 1.8, color: "var(--ink-3)", letterSpacing: ".02em" }}>
            By completing this booking you agree to our Terms, Privacy Policy &amp; Refund Policy. We
            never share your details. Your call slot is confirmed only after payment.
          </p>
        </div>
      </section>
    </main>
  );
}
