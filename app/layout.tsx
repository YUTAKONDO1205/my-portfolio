import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Noto_Sans_JP,
  Space_Grotesk,
} from "next/font/google";
import { LenisProvider } from "./components/lenis-provider";
import { RouteIndicator } from "./components/route-indicator";
import { SiteMotionChrome } from "./components/site-motion";
import {
  personName,
  siteDescription,
  siteLabel,
  siteTitle,
  siteUrl,
} from "./site-metadata";
import "./globals.css";

// Display / heading — geometric, classic-meets-future feel
const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Body / UI — neutral, highly legible, harmonizes with Space Grotesk
const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Japanese — modern sans with multiple weights, pairs with Latin fonts above
const jpFont = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Mono — technical labels, eyebrows, mono numerics
const monoFont = JetBrains_Mono({
  variable: "--font-mono-source",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${personName}`,
  },
  description: siteDescription,
  applicationName: siteLabel,
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
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: siteTitle,
    description: siteDescription,
    siteName: siteLabel,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  verification: {
    google: "CwhzEcI0iAakMI33bJudYRWuHz4CuGDhMH39CAHmMjM",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteLabel,
  alternateName: siteTitle,
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
      className={`${displayFont.variable} ${bodyFont.variable} ${jpFont.variable} ${monoFont.variable} h-full antialiased`}
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
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
