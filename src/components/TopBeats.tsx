import { site } from "@/lib/site";
import { trustChips } from "@/lib/content";

/* Beat 0a — announcement marquee (calm brass scarcity, real capacity). */
export function Announce() {
  const unit = (
    <>
      <span>Only <b>{site.monthlySlots}</b> assessments open each month</span>
      <span className="dot" aria-hidden>·</span>
      <span>Kunal coaches every client personally</span>
      <span className="dot" aria-hidden>·</span>
    </>
  );
  return (
    <div className="sdp-announce" role="note" aria-label="Availability">
      <div className="sdp-announce-track">
        {unit}{unit}{unit}{unit}
      </div>
    </div>
  );
}

/* Beat 0b — hairline trust-chip row (three men, figures being confirmed). */
export function TrustRow() {
  return (
    <div className="sdp-trust-row" aria-label="Client results (figures being confirmed)">
      {trustChips.map((c) => (
        <span className="sdp-marker-chip" key={c}>
          <span className="sdp-marker-dot" aria-hidden />
          {c}
        </span>
      ))}
    </div>
  );
}
