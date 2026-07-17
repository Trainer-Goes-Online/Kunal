import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Refund Policy — Kraft With Kunal",
  robots: { index: false, follow: false },
};

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" updated="July 2026">
      <p>
        We want the right people in the room, and we want you to feel the assessment was worth your time.
        This policy explains how refunds work.
      </p>

      <h2>The assessment fee</h2>
      <p>
        The assessment fee confirms your slot and reserves time on Kunal&rsquo;s calendar. {/*
          [CONFIRM WITH CLIENT: choose the real policy for the assessment fee and replace this line.
          Common options: (a) fully refundable if Kunal decides it isn't a fit; (b) credited toward the
          program if you enrol; (c) non-refundable once the call takes place.] */}
        <strong> If Kunal decides on the call that the program isn&rsquo;t the right fit for you, your assessment
        fee is refunded in full.</strong> If you enrol, the fee is credited toward your program.
      </p>

      <h2>Missed or rescheduled calls</h2>
      <p>
        You can reschedule your assessment for free up to 24 hours before your slot, directly from your
        calendar invite. If you miss the call without rescheduling, the fee is not refundable, but we&rsquo;ll do
        our best to offer one more slot.
      </p>

      <h2>The program guarantee</h2>
      <p>
        If you go on to join the program, our guarantee is the four-week mark: follow the plan for the first
        four weeks and if your energy, sleep, and waist haven&rsquo;t started to move, we sit down and rebuild the
        plan — no charge for the time. The only way it fails is if the work doesn&rsquo;t happen.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Email <a href="mailto:business@trainergoesonline.com">business@trainergoesonline.com</a> with your
        name and booking details. Approved refunds are returned to your original payment method.
      </p>
    </LegalLayout>
  );
}
