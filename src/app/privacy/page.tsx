import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Kraft With Kunal",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="July 2026">
      <p>
        This Privacy Policy explains how Kraft With Kunal (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, and
        protects the information you provide when you apply for or book a paid assessment.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Details you give us</strong> — your name, email address, phone number, and city, submitted through the assessment form.</li>
        <li><strong>Payment information</strong> — processed securely by our payment provider. We do not store your full card or bank details on our servers.</li>
        <li><strong>Usage data</strong> — basic, anonymised analytics about how the site is used, to improve it.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To contact you, confirm your assessment, and send your call link and reminders.</li>
        <li>To let Kunal review your situation before the call.</li>
        <li>To process your assessment-fee payment.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>
        We never sell your details. We share the minimum necessary with trusted service providers who help
        us operate — a payment processor (to take the assessment fee), a scheduling tool (to book your call),
        and communication tools (email/WhatsApp). Each processes your data only to provide their service.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct, or delete your personal data at any time by emailing us. We keep
        your details only as long as needed to provide the service and meet legal obligations.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about your privacy? Email <a href="mailto:business@trainergoesonline.com">business@trainergoesonline.com</a>.
      </p>
    </LegalLayout>
  );
}
