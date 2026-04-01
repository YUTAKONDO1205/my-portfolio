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

export const metadata: Metadata = {
  title: "近藤悠太 | ポートフォリオ",
  description: "近藤悠太のポートフォリオサイト。Spresense、AI、異常検知、ドローン開発などの研究・制作実績を紹介。",
  verification: {
    google: "CwhzEcI0iAakMI33bJudYRWuHz4CuGDhMH39CAHmMjM", // ← contentの中身だけ入れる
    // <meta name="google-site-verification" content="CwhzEcI0iAakMI33bJudYRWuHz4CuGDhMH39CAHmMjM" />
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
