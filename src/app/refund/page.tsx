import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { guarantee } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy | Kraft With Kunal",
  robots: { index: false, follow: false },
};

/* Design-only rebuild onto the SDP policy shell (see LegalLayout). Copy unchanged —
   including the open CONFIRM note on the assessment-fee terms. The fee promise is
   split out of its paragraph into SDP's dark `.pol-callout` for weight (a layout
   change only; the sentences are untouched), and the closing "How to request a
   refund" section becomes the dark contact band. */
export default function RefundPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      updated="July 2026"
      intro={
        <>
          We want the right people in the room, and we want you to feel the assessment was worth your time.
          This policy explains how refunds work.
        </>
      }
      contact={{
        id: "request",
        heading: "How to request a refund",
        body: (
          <p>
            Email <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> with your
            name and booking details. Approved refunds are returned to your original payment method.
          </p>
        ),
      }}
    >
      <LegalSection id="fee" heading="The assessment fee">
        <p>
          The assessment fee confirms your slot and reserves time on Kunal&rsquo;s calendar. {/*
            [CONFIRM WITH CLIENT: choose the real policy for the assessment fee and replace this line.
            Common options: (a) fully refundable if Kunal decides it isn't a fit; (b) credited toward the
            program if you enrol; (c) non-refundable once the call takes place.] */}
        </p>
        <div className="pol-callout">
          <p>
            <strong>If Kunal decides on the call that the program isn&rsquo;t the right fit for you, your assessment
            fee is refunded in full.</strong> If you enrol, the fee is credited toward your program.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="reschedule" heading="Missed or rescheduled calls">
        <p>
          You can reschedule your assessment for free up to 24 hours before your slot, directly from your
          calendar invite. If you miss the call without rescheduling, the fee is not refundable, but we&rsquo;ll do
          our best to offer one more slot.
        </p>
      </LegalSection>

      <LegalSection id="guarantee" heading="The 100% Results Guarantee">
        <p>{guarantee.promise}</p>
        <p>
          <strong>{guarantee.qualifyLabel}:</strong>
        </p>
        <ul className="pol-list">
          {guarantee.qualify.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
        <p>
          The only way it fails is if the work doesn&rsquo;t happen. This guarantee covers the
          coaching programme; it is separate from the assessment-fee terms above.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
