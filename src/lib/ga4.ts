/**
 * GA4 event helper — fires each event at most ONCE per browser (localStorage),
 * with no monetary params (pure counts, independent of Meta). Stamps the flag
 * BEFORE firing (a CTA click navigates away immediately). Never stamps when GA4
 * is absent (so the event can still fire once GA loads on production).
 */
type Gtag = (...args: unknown[]) => void;

export function trackGa4EventOnce(event: string): void {
  if (typeof window === "undefined") return;
  const key = `kwk_ga4_${event}_fired`;
  try {
    if (window.localStorage.getItem(key)) return;
  } catch {
    /* private mode — fall through, best-effort */
  }
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== "function") return; // GA4 not present — do NOT stamp
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
  try {
    gtag("event", event);
  } catch {
    /* analytics must never throw into a handler */
  }
}
