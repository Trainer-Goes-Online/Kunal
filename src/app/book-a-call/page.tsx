import type { Metadata } from "next";
import { BookACall } from "@/components/BookACall";
import { ClientBehaviors } from "@/components/ClientBehaviors";
import "@/components/sections/P02BookACall.css";

/**
 * P02 route — /book-a-call. Thin wrapper: it puts the page inside `.sdp-root`
 * (so the brass foundation applies), reads the optional `?name` / `?email`
 * hand-off from /checkout, and mounts the single delegated client file.
 *
 * SDP ref: `_reference/sdp/app/new-book-a-call/page.tsx`.
 *
 * `searchParams` is a Promise in this Next version (node_modules/next/dist/docs/
 * 01-app/03-api-reference/03-file-conventions/page.md:117) — awaited here, which
 * makes the route dynamic. That is correct for a post-payment page and lets the
 * name greeting + Calendly prefill render server-side, with no extra client JS.
 *
 * NOTE for the orchestrator: `P02BookACall.css` is imported here so the route
 * is self-contained; relocate it into `src/app/sections.css` at consolidation
 * and drop this import.
 */
export const metadata: Metadata = {
  title: "Book your assessment — Kraft With Kunal",
  robots: { index: false, follow: false },
};

function first(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export default async function BookACallPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  // Strip anything that isn't a plain name so the H1 can't be injected via URL.
  const firstName = first(sp.name).replace(/[^\p{L}\p{M}\s'.-]/gu, "").trim().slice(0, 24);
  const email = first(sp.email).trim().slice(0, 120);

  return (
    <div className="sdp-root">
      <BookACall firstName={firstName} email={email} />
      <ClientBehaviors />
    </div>
  );
}
