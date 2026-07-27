/**
 * S03 — Site header.
 * Intentionally renders nothing. SDP ships its logo bar hidden
 * (`.sdp-header{display:none!important}` — _reference/sdp/app/landing.css:336-338),
 * and Kraft matches: the page opens straight into the trust strip + hero.
 * Kept as a component so existing call sites keep compiling.
 */
export function Nav() {
  return null;
}
