import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { LenisProvider } from "./components/lenis-provider";
import { SiteMotionChrome } from "./components/site-motion";
import {
  personName,
  siteDescription,
  siteLabel,
  siteTitle,
  siteUrl,
} from "./site-metadata";
import "./globals.css";

/* Dala runs a single typeface across every UI context. PPNeueMontreal is
   substituted by Inter; Noto Sans JP carries the Japanese glyphs at the same
   weights, so the signature ultra-light (200) body survives in 和文 too.
   200 = body · 400 = display AND body latin · 600 = 14px uppercase labels. */
const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
});

const jpFont = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
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
      className={`${bodyFont.variable} ${jpFont.variable} h-full antialiased`}
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
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
