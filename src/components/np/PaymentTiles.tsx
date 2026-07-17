import { PAYMENT_LOGOS } from "./paymentLogos";

/** Payment-method logos on light tiles (C12 — colored marks stay legible on the dark stage). */
export function PaymentTiles() {
  return (
    <div className="paytiles">
      <div className="cap">Accepted payment methods</div>
      <div className="row">
        {PAYMENT_LOGOS.map((Logo, i) => (
          <span className="tile" key={i}>
            <Logo />
          </span>
        ))}
      </div>
    </div>
  );
}
