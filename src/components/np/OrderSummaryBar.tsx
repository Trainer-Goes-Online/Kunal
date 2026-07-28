"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { PaymentTiles } from "./PaymentTiles";

/* Collapsible order-summary bar that sits ABOVE the form (hierarchy copied from
   the reference checkout: a minimised bar you can expand for the breakdown).
   Content is honest for this offer — what the assessment fee actually holds, no
   invented "value" stack. */

const includes = [
  "A 1:1 assessment call with Kunal himself, not a rep",
  "Your health markers & real week read before you speak",
  "A straight, man-to-man verdict: a fit, or not",
  "Your priority slot held the moment your fee is in",
];

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3.5h2.2l2.2 11.2a1.4 1.4 0 0 0 1.4 1.1h8.6a1.4 1.4 0 0 0 1.4-1.1L21 7H6" />
    </svg>
  );
}
function Caret() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function OrderSummaryBar() {
  const [open, setOpen] = useState(false);
  return (
    <div className={`osum ${open ? "open" : ""}`}>
      <button type="button" className="osum-bar" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="osum-lead">
          <span className="osum-cart"><CartIcon /></span>
          <span className="osum-title">Order summary</span>
        </span>
        <span className="osum-right">
          <span className="osum-toggle">{open ? "Hide details" : "Show details"}</span>
          <span className="osum-amt">{site.assessmentFee}</span>
          <span className="osum-chev" aria-hidden><Caret /></span>
        </span>
      </button>

      <div className="osum-panel">
        <div className="osum-panel-inner">
          <div className="osum-cap">What&rsquo;s included for {site.assessmentFee}</div>
          <ul className="osum-list">
            {includes.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
          <div className="osum-total">
            <span className="lbl">Total due today</span>
            <span className="amt">{site.assessmentFee}</span>
          </div>
          <PaymentTiles />
        </div>
      </div>
    </div>
  );
}
