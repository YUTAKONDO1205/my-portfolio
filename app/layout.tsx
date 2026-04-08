import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Geist_Mono,
  Manrope,
  Noto_Serif_JP,
} from "next/font/google";
import { RouteIndicator } from "./components/route-indicator";
import "./globals.css";

const bodySans = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const displaySerif = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const japaneseSerif = Noto_Serif_JP({
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const siteUrl = "https://kondo-yuta-my-portfolio.vercel.app";
const personName = "近藤悠太";
const siteName = `${personName} | Portfolio`;
const siteDescription =
  "近藤悠太の紹介サイト。DroneInspector、pdm_edge、anomaly-event-api を中心に、SPRESENSE、ELTRES、エッジAI、異常検知の研究と公開実装を紹介します。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${personName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "近藤悠太",
    "Yuta Kondo",
    "Portfolio",
    "DroneInspector",
    "pdm_edge",
    "anomaly-event-api",
    "SPRESENSE",
    "ELTRES",
    "エッジAI",
    "異常検知",
  ],
  authors: [{ name: personName, url: siteUrl }],
  creator: personName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: siteName,
    description: siteDescription,
    siteName,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: siteDescription,
  },
  verification: {
    google: "CwhzEcI0iAakMI33bJudYRWuHz4CuGDhMH39CAHmMjM",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  alternateName: personName,
  description: siteDescription,
  url: siteUrl,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personName,
  url: siteUrl,
  sameAs: [
    "https://github.com/YUTAKONDO1205",
    "https://elchika.com/user/kd_yuta/?page=0",
    "https://www.linkedin.com/in/kondo-yuta-985430317",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${bodySans.variable} ${displaySerif.variable} ${japaneseSerif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="site-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <RouteIndicator />
        {children}
      </body>
    </html>
  );
}
