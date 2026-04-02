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
const personName = "\u8fd1\u85e4\u60a0\u592a";
const siteName = `${personName}\u306e\u30dd\u30fc\u30c8\u30d5\u30a9\u30ea\u30aa`;
const siteDescription =
  "\u8fd1\u85e4\u60a0\u592a\u306e\u30dd\u30fc\u30c8\u30d5\u30a9\u30ea\u30aa\u30b5\u30a4\u30c8\u3002Spresense\u3001AI\u3001\u7570\u5e38\u691c\u77e5\u3001\u30c9\u30ed\u30fc\u30f3\u958b\u767a\u306a\u3069\u306e\u7814\u7a76\u30fb\u5236\u4f5c\u5b9f\u7e3e\u3092\u7d39\u4ecb\u3002";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${personName} | \u30dd\u30fc\u30c8\u30d5\u30a9\u30ea\u30aa`,
    template: `%s | ${personName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: `${personName} | \u30dd\u30fc\u30c8\u30d5\u30a9\u30ea\u30aa`,
    description: siteDescription,
    siteName,
    locale: "ja_JP",
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
      <body className="min-h-full flex flex-col">
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
