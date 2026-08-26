/**
 * Attribution — pure, Edge-safe helpers (no node:crypto, no DOM), shared by the
 * middleware (edge capture) and the server routes (resolution).
 *
 * WHY THIS EXISTS (post-mortem, FUNNEL_ATTRIBUTION_AUDIT_AND_FIX.md): capture
 * that lives only in a client `useEffect` loses a race against the CTA on slow
 * in-app browsers — exactly the paid-social traffic we buy. The fix is to see
 * the query string on the SERVER's first request (middleware → `kwk_attr`
 * cookie), then resolve every field server-side with layered fallbacks.
 *
 * Precedence, per field:  URL → cookie → body → referrer → _fbc → none
 * `referrer` is skipped for `fbclid` (Razorpay/analytics caps truncate it —
 * 49 of 195 chars observed); `_fbc` is the only COMPLETE fbclid source.
 *
 * ATTRIBUTION (utm_*, fbclid) is LAST-touch. CONTEXT (referrer, landing_url) is
 * FIRST-touch — written once, never overwritten.
 */

export const ATTR_COOKIE = "kwk_attr";
export const ATTR_TTL_SECONDS = 30 * 24 * 60 * 60;

export const URL_TO_KEY: Record<string, string> = {
  utm_source: "source",
  utm_medium: "medium",
  utm_campaign: "campaign",
  utm_content: "content",
  utm_term: "term",
  fbclid: "fbclid",
  gclid: "gclid",
};

export const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;

type Attr = Record<string, string | number | undefined>;

const isFilled = (v: unknown): v is string => typeof v === "string" && v.length > 0;

/** Pull utm, fbclid and gclid params out of a URL or a bare query string. */
export function parseAttributionFromUrl(input?: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!input) return out;
  try {
    const search = input.includes("?") ? input.slice(input.indexOf("?")) : input;
    const sp = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    for (const [param, key] of Object.entries(URL_TO_KEY)) {
      const v = sp.get(param);
      if (isFilled(v)) out[key] = v;
    }
  } catch {
    /* malformed query — return what we have */
  }
  return out;
}

/** `_fbc` is `fb.<subdomainIndex>.<clickTsMs>.<fbclid>` — the ONLY complete fbclid source. */
export function parseFbc(fbc?: string): { fbclid?: string; ts?: number } {
  if (!isFilled(fbc)) return {};
  const p = fbc.split(".");
  if (p.length < 4 || p[0] !== "fb") return {};
  const ts = Number(p[2]);
  return { fbclid: p.slice(3).join("."), ts: Number.isFinite(ts) && ts > 0 ? ts : undefined };
}

/** Parse the `kwk_attr` cookie value (URL-encoded JSON object). Never throws. */
export function readAttrCookie(raw?: string): Attr {
  if (!isFilled(raw)) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Merge freshly-seen params into the stored cookie value.
 * - CONTEXT (landing_url, referrer): written once, first-touch.
 * - ATTRIBUTION (utm_*, fbclid, gclid): overwritten on every tagged hit (last-touch).
 * Returns `changed=false` for untagged internal navigation so the cookie never churns.
 */
export function mergeAttribution(
  stored: Attr,
  { live, landingUrl, referrer, now }: { live: Record<string, string>; landingUrl?: string; referrer?: string; now: number }
): { attr: Attr; changed: boolean } {
  const attr: Attr = { ...stored };
  let changed = false;
  if (!isFilled(attr.landing_url as string) && isFilled(landingUrl)) {
    attr.landing_url = landingUrl;
    attr.referrer = isFilled(referrer) ? referrer : "";
    changed = true;
  }
  if (live && Object.keys(live).length > 0) {
    Object.assign(attr, live, { ts: now });
    changed = true;
  }
  return { attr, changed };
}

export interface ResolvedAttribution {
  utm: Record<string, string>;
  fbclid: string;
  fbclidTs: number;
  gclid: string;
  referrer: string;
  landingUrl: string;
  provenance: string;
  utmSource: string;
  clidSource: string;
}

/**
 * Resolve the final attribution from every source, in precedence order.
 * `utmSource` / `clidSource` record WHERE each came from → `provenance`.
 */
export function resolveAttribution({
  cookieAttr = {},
  bodyAttr = {},
  referrer = "",
  landingUrl = "",
  fbc = "",
  now = Date.now(),
}: {
  cookieAttr?: Attr;
  bodyAttr?: Attr;
  referrer?: string;
  landingUrl?: string;
  fbc?: string;
  now?: number;
} = {}): ResolvedAttribution {
  const utm: Record<string, string> = {};
  let utmSource = "none";
  for (const [label, src] of [
    ["cookie", cookieAttr],
    ["body", bodyAttr],
  ] as const) {
    for (const key of UTM_KEYS) {
      if (!isFilled(utm[key]) && isFilled(src?.[key] as string)) {
        utm[key] = src![key] as string;
        if (utmSource === "none") utmSource = label;
      }
    }
  }
  if (UTM_KEYS.every((k) => !isFilled(utm[k]))) {
    const recovered = { ...parseAttributionFromUrl(landingUrl), ...parseAttributionFromUrl(referrer) };
    let used = false;
    for (const key of UTM_KEYS) if (isFilled(recovered[key])) { utm[key] = recovered[key]; used = true; }
    if (used) utmSource = "referrer";
  }
  for (const key of UTM_KEYS) if (!isFilled(utm[key])) utm[key] = "";

  let fbclid = "", fbclidTs = 0, clidSource = "none";
  if (isFilled(cookieAttr.fbclid as string)) {
    fbclid = cookieAttr.fbclid as string; clidSource = "cookie"; fbclidTs = Number(cookieAttr.ts) || 0;
  } else if (isFilled(bodyAttr.fbclid as string)) {
    fbclid = bodyAttr.fbclid as string; clidSource = "body"; fbclidTs = Number(bodyAttr.ts) || 0;
  } else {
    const f = parseFbc(fbc);
    if (isFilled(f.fbclid)) { fbclid = f.fbclid!; clidSource = "fbc"; fbclidTs = f.ts || 0; }
  }
  if (!fbclidTs) fbclidTs = Number(cookieAttr.ts) || Number(bodyAttr.ts) || 0;

  const firstFilled = (...vals: unknown[]) => vals.find(isFilled) as string | undefined;

  return {
    utm,
    fbclid,
    fbclidTs: fbclidTs || now,
    gclid: firstFilled(cookieAttr.gclid, bodyAttr.gclid) || "",
    referrer: firstFilled(referrer, cookieAttr.referrer, bodyAttr.referrer) || "",
    landingUrl: firstFilled(landingUrl, cookieAttr.landing_url, bodyAttr.landing_url) || "",
    provenance: `utm:${utmSource}|clid:${clidSource}`,
    utmSource,
    clidSource,
  };
}

/** Rebuild the `_fbc` string from a resolved fbclid when the cookie is missing. */
export function buildFbc(resolved: Pick<ResolvedAttribution, "fbclid" | "fbclidTs">, cookieFbc = ""): string {
  if (isFilled(cookieFbc)) return cookieFbc;
  return resolved.fbclid ? `fb.1.${resolved.fbclidTs}.${resolved.fbclid}` : "";
}

/**
 * L5 — GUARANTEES valid JSON that fits within `max` by shortening the LONGEST
 * value, never slicing mid-JSON. `truncate(JSON.stringify(obj), 256)` slices the
 * serialised string and the downstream JSON.parse throws → every field is lost
 * at once (observed on a 335-char Advantage+ campaign name).
 */
export function packJsonNote(obj: Record<string, unknown>, max = 256): string {
  const w: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) w[k] = typeof v === "string" ? v : String(v ?? "");
  let json = JSON.stringify(w);
  let guard = 0;
  while (json.length > max && guard < 200) {
    guard += 1;
    let key: string | null = null;
    let len = 0;
    for (const [k, v] of Object.entries(w)) if (v.length > len) { len = v.length; key = k; }
    if (!key || len === 0) break;
    const cut = Math.max(1, Math.min(len, json.length - max));
    w[key] = w[key].slice(0, len - cut);
    json = JSON.stringify(w);
  }
  return json.length > max ? "{}" : json;
}
