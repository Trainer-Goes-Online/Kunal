import { NextResponse, type NextRequest } from "next/server";
import {
  ATTR_COOKIE,
  ATTR_TTL_SECONDS,
  mergeAttribution,
  parseAttributionFromUrl,
  readAttrCookie,
} from "@/lib/attribution";

/**
 * L1 — attribution capture at the edge. This is the layer that actually fixes
 * the hydration race: the query string is read on the SERVER's first request,
 * before any React hydrates, so utm and fbclid survive even when a slow in-app
 * browser leaves before the client effect runs. Written to the `kwk_attr`
 * cookie (readable by the client as a fallback, and by the API routes).
 *
 * Last-touch attribution + first-touch context; untagged internal navigation
 * writes nothing (no cookie churn). Never throws into the response.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  try {
    const live = parseAttributionFromUrl(req.nextUrl.search);
    const stored = readAttrCookie(req.cookies.get(ATTR_COOKIE)?.value);
    const { attr, changed } = mergeAttribution(stored, {
      live,
      landingUrl: req.nextUrl.href,
      referrer: req.headers.get("referer") || "",
      now: Date.now(),
    });
    if (changed) {
      res.cookies.set(ATTR_COOKIE, encodeURIComponent(JSON.stringify(attr)), {
        path: "/",
        maxAge: ATTR_TTL_SECONDS,
        sameSite: "lax",
        httpOnly: false, // the client reads it as a capture fallback
        secure: req.nextUrl.protocol === "https:",
      });
    }
  } catch {
    /* attribution must never break a page render */
  }
  return res;
}

export const config = {
  // Skip static assets, images, API routes and the Next internals.
  matcher: ["/((?!_next/static|_next/image|api/|favicon.ico|.*\\.).*)"],
};
