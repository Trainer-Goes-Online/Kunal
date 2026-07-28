import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions | Kraft With Kunal",
  robots: { index: false, follow: false },
};

/* Design-only rebuild onto the SDP policy shell (see LegalLayout). Copy unchanged.
   The medical disclaimer is the one paragraph given extra weight — it renders in
   SDP's dark `.pol-callout` slab rather than as plain prose. */
export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      updated="July 2026"
      intro={
        <>
          By using this website and booking a paid assessment, you agree to these Terms. Please read them
          carefully.
        </>
      }
      contact={{
        id: "contact",
        heading: "Contact",
        body: (
          <p>
            Questions? Email <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
          </p>
        ),
      }}
    >
      <LegalSection id="service" heading="The service">
        <p>
          Kraft With Kunal provides health and fitness coaching for high-performing professionals. Booking a
          paid assessment secures a review of your situation and a conversation with Kunal. It is an
          application: <strong>it is not a guarantee of enrolment</strong> into any program.
        </p>
      </LegalSection>

      <LegalSection id="medical" heading="Not medical advice">
        <div className="pol-callout">
          <p>
            Kunal is a coach, not a doctor. All guidance is coaching guidance, provided alongside (never in place
            of) your own doctor. Always consult a qualified medical professional before changing your diet,
            exercise, or lifestyle. Nothing here is medical advice, diagnosis, or treatment.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="results" heading="Results">
        <p>
          Client results vary based on individual factors including consistency, medical history, lifestyle, and
          adherence to the plan. Outcomes described on this site are not typical or guaranteed.
        </p>
      </LegalSection>

      <LegalSection id="responsibilities" heading="Your responsibilities">
        <p>
          You agree to provide accurate information, to be honest about your health and history, and to follow
          the plan and safety guidance given to you.
        </p>
      </LegalSection>

      <LegalSection id="payments" heading="Payments">
        <p>
          The assessment fee shown at checkout is charged at the time of booking to confirm your slot. Program
          fees, if you go on to enrol, are discussed separately on the call. See our{" "}
          <Link href="/refund">Refund Policy</Link> for cancellations and refunds.
        </p>
      </LegalSection>

      <LegalSection id="ip" heading="Intellectual property">
        <p>
          All content, plans, and materials provided are for your personal use only and may not be copied,
          shared, or resold without written permission.
        </p>
      </LegalSection>

      <LegalSection id="liability" heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, Kraft With Kunal is not liable for any indirect or
          consequential loss arising from use of the service. These Terms are governed by the laws of India.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
