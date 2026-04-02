import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "\u7814\u7a76\u30da\u30fc\u30b8",
  description:
    "\u8fd1\u85e4\u60a0\u592a\u306e\u7814\u7a76\u30fb\u958b\u767a\u5b9f\u7e3e\u3092\u7d39\u4ecb\u3059\u308b\u30da\u30fc\u30b8\u3067\u3059\u3002",
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    title: "\u7814\u7a76\u30da\u30fc\u30b8 | \u8fd1\u85e4\u60a0\u592a",
    description:
      "\u8fd1\u85e4\u60a0\u592a\u306e\u7814\u7a76\u30fb\u958b\u767a\u5b9f\u7e3e\u3092\u7d39\u4ecb\u3059\u308b\u30da\u30fc\u30b8\u3067\u3059\u3002",
    url: "/research",
    type: "article",
    locale: "ja_JP",
  },
};

export default function ResearchPage() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>
        {"\u7814\u7a76\u4e00\u89a7"}
      </h1>
      <p>
        {
          "\u3053\u3053\u306b\u7814\u7a76\u3084\u5236\u4f5c\u5b9f\u7e3e\u3092\u9806\u6b21\u8ffd\u8a18\u3057\u3066\u3044\u304d\u307e\u3059\u3002"
        }
      </p>
    </main>
  );
}
