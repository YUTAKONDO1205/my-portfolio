import type { Metadata } from "next";
import { Geist_Mono, Oswald } from "next/font/google";
import { RouteIndicator } from "./components/route-indicator";
import { SiteMotionChrome } from "./components/site-motion";
import "./globals.css";

const headingFont = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://kondo-yuta-my-portfolio.vercel.app";
const personName = "近藤悠太";
const siteName = `${personName} | Portfolio`;
const siteDescription =
  "近藤悠太の紹介サイト。現場の信号を取得し、軽量に判断し、GitHub と Elchika で公開する流れを軸に、DroneInspector、pdm_edge、anomaly-event-api を紹介します。";

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
    "Sense Decide Share",
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
      className={`${headingFont.variable} ${mono.variable} h-full antialiased`}
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
        <SiteMotionChrome />
        <RouteIndicator />
        {children}
      </body>
    </html>
  );
}
