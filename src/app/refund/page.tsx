import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Refund Policy | Kraft With Kunal",
  robots: { index: false, follow: false },
};

/* Design-only build onto the shared SDP policy shell (see LegalLayout). The copy
   is the client's supplied Refund Policy (29 July 2026), reproduced verbatim:
   the two opening paragraphs become the intro slab, each numbered heading an
   anchored section that feeds the TOC, the "and/must/will not apply if" blocks
   become the brass card lists, and the closing "Our Commitment" is elevated into
   the dark band (a guarantee mark replaces the default envelope). No sentence is
   added, removed or reworded. */
export default function RefundPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      updated="29 July 2026"
      intro={
        <>
          <p>
            At <strong>Kraft With Kunal</strong>, our mission is to help busy businessmen and senior
            professionals achieve sustainable fat loss, build strength, and create a fitness system that
            lasts, without relying on crash diets or unrealistic workout routines.
          </p>
          <p>
            We stand behind our programme with a <strong>100% Results Guarantee</strong> because we are
            confident in the High-Performer Protocol when it is followed consistently.
          </p>
        </>
      }
      contact={{
        id: "commitment",
        heading: "7. Our Commitment",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M12 2l8 3v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V5l8-3z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        ),
        body: (
          <>
            <p>
              The <strong>High-Performer Programme</strong> is built on honesty, science and accountability.
            </p>
            <p>
              We don&rsquo;t promise shortcuts or unrealistic transformations. We believe lasting results
              come from a personalised plan, consistent execution and expert coaching.
            </p>
            <p>
              When you commit to the process, we&rsquo;ll commit to doing everything we can to help you
              succeed.
            </p>
            <p>
              That&rsquo;s why we&rsquo;re confident enough to stand behind the programme with our{" "}
              <strong>100% Results Guarantee.</strong>
            </p>
          </>
        ),
      }}
    >
      <LegalSection id="booking-fee" heading="1. The ₹97 Booking Fee">
        <p>
          The <strong>₹97</strong> paid on this website is a one-time booking fee for your personalised{" "}
          <strong>1:1 High-Performer Fitness Strategy Call</strong> with Kunal Chalke.
        </p>
        <p>
          As this fee reserves your consultation slot and covers the strategy call, it is{" "}
          <strong>non-refundable</strong>.
        </p>
        <p>
          It is separate from the 90-day coaching programme, which you may choose to enrol in after your
          consultation and which carries its own Results Guarantee outlined below.
        </p>
      </LegalSection>

      <LegalSection id="results-guarantee" heading="2. 90-Day Results Guarantee">
        <p>
          If you enrol into the <strong>High-Performer Programme</strong> and:
        </p>
        <ul className="pol-list">
          <li>Complete the full 90-day programme,</li>
          <li>Follow your personalised training and nutrition plan,</li>
          <li>Meet all programme participation requirements, and</li>
          <li>Do not lose between <strong>8-12 kilograms</strong> during the programme,</li>
        </ul>
        <p>
          we will refund <strong>100% of your programme investment.</strong>
        </p>
      </LegalSection>

      <LegalSection id="eligibility" heading="3. Eligibility Requirements">
        <p>To qualify for the Results Guarantee, you must:</p>
        <ul className="pol-list">
          <li>Follow your personalised training and nutrition plan throughout the programme.</li>
          <li>Attend all scheduled weekly check-ins.</li>
          <li>Submit your weekly progress updates, meal logs and requested progress photos on time.</li>
          <li>Follow the coaching recommendations provided throughout the programme.</li>
          <li>Complete the full 90-day programme from your official programme start date.</li>
        </ul>
        <p>
          The Results Guarantee is intended for clients who actively participate in the coaching process.
          If the agreed plan is not followed consistently, the guarantee will not apply.
        </p>
      </LegalSection>

      <LegalSection id="bmi-clause" heading="4. Healthy BMI Clause">
        <p>
          The <strong>8-12 kg</strong> guarantee applies to clients whose starting{" "}
          <strong>BMI is above 25.</strong>
        </p>
        <p>
          If you are already within a healthy BMI range for your height, losing 8-12 kilograms may not be
          physiologically appropriate.
        </p>
        <p>
          In such cases, a personalised transformation goal will be agreed upon during your consultation
          before you enrol. That agreed outcome will form the basis of your Results Guarantee.
        </p>
      </LegalSection>

      <LegalSection id="refund-request" heading="5. Refund Request Process">
        <p>
          If you believe you are eligible for a refund, please email us within <strong>3 days</strong> of
          completing your programme at:
        </p>
        <p>
          <strong>
            <a href="mailto:kraftwithkunal@gmail.com">kraftwithkunal@gmail.com</a>
          </strong>
        </p>
        <p>
          Your request will be reviewed alongside your coaching records to confirm that all eligibility
          requirements have been met.
        </p>
        <p>
          Once approved, refunds will be processed within <strong>7-14 business days</strong> using the
          original payment method wherever possible.
        </p>
      </LegalSection>

      <LegalSection id="not-applicable" heading="6. Situations Where the Results Guarantee Does Not Apply">
        <p>The Results Guarantee will not apply if:</p>
        <ul className="pol-list">
          <li>Weekly check-ins were missed.</li>
          <li>Progress updates, meal logs or requested photos were not submitted consistently.</li>
          <li>Your personalised training or nutrition plan was not followed.</li>
          <li>The programme was discontinued before the full 90 days were completed.</li>
          <li>Required information requested by your coach was not provided.</li>
          <li>The refund request is submitted after the 3-day refund request window.</li>
          <li>
            <strong>
              You voluntarily pause, suspend or interrupt your coaching programme for any reason, including
              travel, work commitments, holidays or personal circumstances. Any pause in the programme
              makes the Results Guarantee void.
            </strong>
          </li>
        </ul>
      </LegalSection>
    </LegalLayout>
  );
}
