import Link from "next/link";
import { Nav } from "./Nav";
import { Colophon } from "./Colophon";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="section">
        <div className="wrap legal-doc">
          <Link href="/" className="legal-back">&larr; Back to Kraft With Kunal</Link>
          <h1 className="display">{title}</h1>
          <p className="legal-updated">Last updated: {updated}</p>
          {children}
        </div>
      </main>
      <Colophon />
    </>
  );
}
