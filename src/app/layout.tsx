import type { Metadata } from "next";
import { Newsreader, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { CtaTracker } from "@/components/CtaTracker";
import { siteOrigin } from "@/lib/config";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: "Kraft With Kunal — Build the body that matches the life you built",
  description:
    "High-performer health coaching for successful men, 35–50. In six months, a body that matches the life you built. Apply for a paid assessment with Kunal.",
  robots: { index: false, follow: false }, // pre-launch: keep out of search until assets/figures confirmed
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${newsreader.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <body>
        <Analytics />
        <CtaTracker />
        {children}
      </body>
    </html>
  );
}
