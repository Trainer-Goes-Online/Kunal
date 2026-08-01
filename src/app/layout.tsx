import type { Metadata } from "next";
import { Bebas_Neue, Newsreader, Inter_Tight, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import "./sections.css";
// Loaded last: the review-round-2 overrides depend on winning by source order.
import "./polish.css";
import { Analytics } from "@/components/Analytics";
import { CtaTracker } from "@/components/CtaTracker";
import { siteOrigin } from "@/lib/config";

// DISPLAY (condensed all-caps) for the SDP brass-on-light LP.
const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

// BODY face for the whole site. Self-hosted by next/font so the stack in
// globals.css (`--fb`) resolves to a real webfont, not a local-only fallback.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: "Kraft With Kunal | Lose 8-12 kilos in the next 90 days",
  description:
    "The High-Performer Protocol: 1:1 coaching for business owners and professionals 35+, built around travel, long workdays and client dinners. 200+ success stories, 100% Results Guarantee.",
  robots: { index: false, follow: false }, // pre-launch: keep out of search until assets/figures confirmed
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${bebas.variable} ${newsreader.variable} ${interTight.variable} ${jetbrains.variable} ${manrope.variable}`}
    >
      <body>
        <Analytics />
        <CtaTracker />
        {children}
      </body>
    </html>
  );
}
