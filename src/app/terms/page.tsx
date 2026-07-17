import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions — Kraft With Kunal",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms &amp; Conditions" updated="July 2026">
      <p>
        By using this website and booking a paid assessment, you agree to these Terms. Please read them
        carefully.
      </p>

      <h2>The service</h2>
      <p>
        Kraft With Kunal provides health and fitness coaching for high-performing professionals. Booking a
        paid assessment secures a review of your situation and a conversation with Kunal. It is an
        application — <strong>it is not a guarantee of enrolment</strong> into any program.
      </p>

      <h2>Not medical advice</h2>
      <p>
        Kunal is a coach, not a doctor. All guidance is coaching guidance, provided alongside — never in place
        of — your own doctor. Always consult a qualified medical professional before changing your diet,
        exercise, or lifestyle. Nothing here is medical advice, diagnosis, or treatment.
      </p>

      <h2>Results</h2>
      <p>
        Client results vary based on individual factors including consistency, medical history, lifestyle, and
        adherence to the plan. Outcomes described on this site are not typical or guaranteed.
      </p>

      <h2>Your responsibilities</h2>
      <p>
        You agree to provide accurate information, to be honest about your health and history, and to follow
        the plan and safety guidance given to you.
      </p>

      <h2>Payments</h2>
      <p>
        The assessment fee shown at checkout is charged at the time of booking to confirm your slot. Program
        fees, if you go on to enrol, are discussed separately on the call. See our{" "}
        <Link href="/refund">Refund Policy</Link> for cancellations and refunds.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All content, plans, and materials provided are for your personal use only and may not be copied,
        shared, or resold without written permission.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Kraft With Kunal is not liable for any indirect or
        consequential loss arising from use of the service. These Terms are governed by the laws of India.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href="mailto:business@trainergoesonline.com">business@trainergoesonline.com</a>.
      </p>
    </LegalLayout>
  );
}
