/* Brand payment marks as inline SVG (colored, recognizable) — render on white tiles.
   Inline SVG = reliable, self-contained, no external asset/CSP dependency. */

export function VisaLogo() {
  return (
    <svg viewBox="0 0 48 16" height={16} role="img" aria-label="Visa">
      <text x="24" y="13" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="800" fontStyle="italic" letterSpacing="0.5" fill="#1A1F71">VISA</text>
    </svg>
  );
}

export function MastercardLogo() {
  return (
    <svg viewBox="0 0 40 24" height={22} role="img" aria-label="Mastercard">
      <circle cx="16" cy="12" r="9" fill="#EB001B" />
      <circle cx="24" cy="12" r="9" fill="#F79E1B" />
      <path d="M20 5.2a9 9 0 0 0 0 13.6 9 9 0 0 0 0-13.6z" fill="#FF5F00" />
    </svg>
  );
}

export function UpiLogo() {
  return (
    <svg viewBox="0 0 52 18" height={16} role="img" aria-label="UPI">
      <path d="M2 3l5 6-5 6V3z" fill="#E97626" />
      <path d="M8 3l5 6-5 6V3z" fill="#0C8A3E" />
      <text x="34" y="14" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="800" fill="#0C4DA2">UPI</text>
    </svg>
  );
}

export function RupayLogo() {
  return (
    <svg viewBox="0 0 66 18" height={15} role="img" aria-label="RuPay">
      <text x="0" y="14" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="800" fontStyle="italic">
        <tspan fill="#1A75BB">Ru</tspan><tspan fill="#EA7B22">Pay</tspan>
      </text>
    </svg>
  );
}

export function AmexLogo() {
  return (
    <svg viewBox="0 0 46 26" height={22} role="img" aria-label="American Express">
      <rect width="46" height="26" rx="3" fill="#2E77BC" />
      <text x="23" y="17" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8.5" fontWeight="800" letterSpacing="0.5" fill="#fff">AMEX</text>
    </svg>
  );
}

export function NetBankingLogo() {
  return (
    <svg viewBox="0 0 64 22" height={20} role="img" aria-label="Net Banking">
      <g fill="none" stroke="#2b2b2b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8l7-4 7 4" />
        <path d="M4 8v7M16 8v7M8 8v7M12 8v7" />
        <path d="M2.5 15.5h15" />
      </g>
      <text x="24" y="15" fontFamily="Arial, sans-serif" fontSize="8.5" fontWeight="700" fill="#2b2b2b">NetBanking</text>
    </svg>
  );
}

export const PAYMENT_LOGOS = [
  UpiLogo,
  VisaLogo,
  MastercardLogo,
  RupayLogo,
  AmexLogo,
  NetBankingLogo,
];
