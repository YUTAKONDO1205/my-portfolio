import {
  Bricolage_Grotesque,
  JetBrains_Mono,
  LINE_Seed_JP,
} from "next/font/google";

/* Latin display — Bricolage Grotesque is variable on weight, width and
   optical size. The hero headline plays with the width axis (75–100);
   numerals and English headings use it at full width. */
export const latin = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
  variable: "--font-latin",
});

/* 和文 — LINE Seed JP. Open counters and an even, geometric skeleton read
   bright on a light ground. 400 sets running text, 700 card headings, 800
   the large headlines. Google serves it in unicode-range slices, so only the
   glyphs a page uses are fetched. */
export const japanese = LINE_Seed_JP({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-japanese",
});

/* Data, code and measurement labels. */
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});
