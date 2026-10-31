import type { NextRequest } from "next/server";
import { ATTR_COOKIE, readAttrCookie, resolveAttribution, buildFbc } from "./attribution";
import type { CapiSignals, CapiPII } from "./meta-events";

/** First-party visitor id cookie, set by the browser (src/lib/tracking.ts). */
export const VISITOR_COOKIE = "kwk_vid";

/**
 * Everything a same-origin request carries that Meta can match on:
 * _fbc (rebuilt from the captured fbclid when the cookie is missing — L4),
 * _fbp, client IP, user agent and the kwk_vid visitor id.
 */
export function readCapiSignals(req: NextRequest): CapiSignals {
  const cookieFbc = req.cookies.get("_fbc")?.value || "";
  const resolved = resolveAttribution({
    cookieAttr: readAttrCookie(req.cookies.get(ATTR_COOKIE)?.value),
    fbc: cookieFbc,
  });
  return {
    fbc: buildFbc(resolved, cookieFbc) || undefined,
    fbp: req.cookies.get("_fbp")?.value || undefined,
    clientIp:
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      undefined,
    clientUserAgent: req.headers.get("user-agent") ?? undefined,
    visitorId: (req.cookies.get(VISITOR_COOKIE)?.value || "").slice(0, 64) || undefined,
  };
}

/** A browser-supplied event id, accepted only in a safe shape. */
export function cleanEventId(v: unknown): string | undefined {
  return typeof v === "string" && /^[A-Za-z0-9_.:-]{6,100}$/.test(v) ? v : undefined;
}

/** Browser-supplied PII, trimmed and capped. */
export function cleanPII(v: unknown): CapiPII {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const s = (x: unknown, max: number) => (typeof x === "string" ? x.trim().slice(0, max) : "");
  return {
    email: s(o.email, 120).toLowerCase(),
    phone: s(o.phone, 24),
    firstName: s(o.firstName, 60),
    lastName: s(o.lastName, 60),
    countryCode: s(o.countryCode, 4),
  };
}
