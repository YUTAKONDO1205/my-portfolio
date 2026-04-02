import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://kondo-yuta-my-portfolio.vercel.app";
const personName = "近藤悠太";
const siteName = `${personName} | Portfolio`;
const siteDescription =
  "近藤悠太のポートフォリオサイト。SPRESENSE、ELTRES、センシング、AI、振動解析を軸にした研究とプロトタイピングの実績を紹介します。";

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
    "SPRESENSE",
    "ELTRES",
    "AI",
    "センシング",
    "振動解析",
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
    card: "summary_large_image",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
        {children}
      </body>
    </html>
  );
}
