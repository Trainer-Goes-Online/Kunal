import { Check } from "@/components/icons";

/** 2-step progress (book-a-call): Pay ✓ (done) → Book (now). */
export function ProgressSteps() {
  return (
    <div className="progress">
      <span className="step done">
        <span className="n"><Check size={12} /></span> Payment
      </span>
      <span className="bar" aria-hidden />
      <span className="step now">
        <span className="n">2</span> Book the call
      </span>
    </div>
  );
}
